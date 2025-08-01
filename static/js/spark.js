// Dashboard JavaScript functionality

// Global variables for academic data
let academicData = {};
let analysisData = {};
let currentView = 'overall';

document.addEventListener('DOMContentLoaded', function() {
    // Load academic data from hidden script tags
    loadAcademicData();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Load performance charts
    loadPerformanceCharts();
    
    // Add interactive features
    addInteractiveFeatures();
});

function loadAcademicData() {
    try {
        const academicScript = document.getElementById('academic-data');
        const analysisScript = document.getElementById('analysis-data');
        
        if (academicScript && analysisScript) {
            academicData = JSON.parse(academicScript.textContent);
            analysisData = JSON.parse(analysisScript.textContent);
        }
    } catch (error) {
        console.error('Error loading academic data:', error);
    }
}

function changeSemesterView() {
    const selector = document.getElementById('semester-select');
    currentView = selector.value;
    
    if (currentView === 'overall') {
        showOverallView();
    } else {
        showSemesterView(parseInt(currentView));
    }
    
    // Reload charts for the selected view
    loadPerformanceCharts();
}

function showOverallView() {
    // Update titles
    document.getElementById('performance-title').textContent = 'Overall Performance Overview';
    document.getElementById('cgpa-title').textContent = 'Current CGPA';
    document.getElementById('sgpa-title').textContent = 'Current SGPA';
    document.getElementById('attendance-title').textContent = 'Overall Attendance';
    document.getElementById('rank-title').textContent = 'Academic Rank';
    document.getElementById('semester-details-title').textContent = 'Current Semester Performance';
    document.getElementById('analysis-title').textContent = 'Overall Performance Analysis';
    document.getElementById('charts-title').textContent = 'Overall Performance Analytics';
    
    // Update values
    document.getElementById('cgpa-value').textContent = academicData.cgpa;
    document.getElementById('sgpa-value').textContent = academicData.semesters[academicData.semesters.length - 1].sgpa;
    document.getElementById('sgpa-subtitle').textContent = `Semester ${academicData.semesters[academicData.semesters.length - 1].semester}`;
    document.getElementById('attendance-value').textContent = academicData.overall_attendance + '%';
    document.getElementById('rank-value').textContent = '12';
    document.getElementById('rank-subtitle').textContent = 'Out of 120 students';
    
    // Update remarks
    document.getElementById('cgpa-remark').textContent = analysisData.cgpa_remark;
    document.getElementById('cgpa-remark').style.color = analysisData.cgpa_color;
    document.getElementById('attendance-remark').textContent = analysisData.attendance_remark;
    document.getElementById('attendance-remark').style.color = analysisData.attendance_color;
    
    // Show current semester subjects
    const currentSemester = academicData.semesters[academicData.semesters.length - 1];
    updateSubjectsTable(currentSemester.subjects);
    
    // Update analysis cards
    updateAnalysisCards(analysisData);
}

function showSemesterView(semesterNumber) {
    const semester = academicData.semesters.find(sem => sem.semester === semesterNumber);
    
    if (!semester) {
        console.error('Semester not found:', semesterNumber);
        return;
    }
    
    // Update titles
    document.getElementById('performance-title').textContent = `Semester ${semesterNumber} Performance`;
    document.getElementById('cgpa-title').textContent = 'CGPA till this Semester';
    document.getElementById('sgpa-title').textContent = `Semester ${semesterNumber} SGPA`;
    document.getElementById('attendance-title').textContent = `Semester ${semesterNumber} Attendance`;
    document.getElementById('rank-title').textContent = `Semester ${semesterNumber} Rank`;
    document.getElementById('semester-details-title').textContent = `Semester ${semesterNumber} Subject Performance`;
    document.getElementById('analysis-title').textContent = `Semester ${semesterNumber} Analysis`;
    document.getElementById('charts-title').textContent = `Semester ${semesterNumber} Analytics`;
    
    // Calculate CGPA up to this semester
    const semestersUpTo = academicData.semesters.filter(sem => sem.semester <= semesterNumber);
    const avgCGPA = semestersUpTo.reduce((sum, sem) => sum + sem.sgpa, 0) / semestersUpTo.length;
    
    // Update values
    document.getElementById('cgpa-value').textContent = avgCGPA.toFixed(1);
    document.getElementById('sgpa-value').textContent = semester.sgpa;
    document.getElementById('sgpa-subtitle').textContent = `Semester ${semesterNumber}`;
    document.getElementById('attendance-value').textContent = semester.attendance + '%';
    document.getElementById('rank-value').textContent = semesterNumber === 1 ? '15' : '12';
    document.getElementById('rank-subtitle').textContent = 'Out of 120 students';
    
    // Update remarks based on semester performance
    const semesterAnalysis = getSemesterAnalysis(semester);
    document.getElementById('cgpa-remark').textContent = semesterAnalysis.cgpa_remark;
    document.getElementById('cgpa-remark').style.color = semesterAnalysis.cgpa_color;
    document.getElementById('attendance-remark').textContent = semesterAnalysis.attendance_remark;
    document.getElementById('attendance-remark').style.color = semesterAnalysis.attendance_color;
    
    // Show semester subjects
    updateSubjectsTable(semester.subjects);
    
    // Update analysis cards for semester
    updateAnalysisCards(semesterAnalysis);
}

function getSemesterAnalysis(semester) {
    const sgpa = semester.sgpa;
    const attendance = semester.attendance;
    
    // SGPA remarks
    let cgpa_remark, cgpa_color;
    if (sgpa >= 9.0) {
        cgpa_remark = "Excellent";
        cgpa_color = "#228B22";
    } else if (sgpa >= 8.0) {
        cgpa_remark = "Very Good";
        cgpa_color = "#32CD32";
    } else if (sgpa >= 7.0) {
        cgpa_remark = "Good";
        cgpa_color = "#FFD700";
    } else if (sgpa >= 6.0) {
        cgpa_remark = "Average";
        cgpa_color = "#FFA500";
    } else {
        cgpa_remark = "Needs Improvement";
        cgpa_color = "#FF4500";
    }
    
    // Attendance remarks
    let attendance_remark, attendance_color;
    if (attendance >= 90) {
        attendance_remark = "Excellent";
        attendance_color = "#228B22";
    } else if (attendance >= 80) {
        attendance_remark = "Good";
        attendance_color = "#32CD32";
    } else if (attendance >= 75) {
        attendance_remark = "Satisfactory";
        attendance_color = "#FFD700";
    } else {
        attendance_remark = "Poor";
        attendance_color = "#FF4500";
    }
    
    // Improvements for this semester
    const improvements = [];
    if (sgpa < 8.0) {
        improvements.push("Focus on understanding core concepts better");
        improvements.push("Seek help from faculty during office hours");
    }
    if (attendance < 85) {
        improvements.push("Improve class attendance to meet minimum requirements");
    }
    if (improvements.length === 0) {
        improvements.push("Keep up the excellent work!");
        improvements.push("Consider participating in research projects");
    }
    
    return {
        cgpa_remark,
        cgpa_color,
        attendance_remark,
        attendance_color,
        improvements
    };
}

function updateSubjectsTable(subjects) {
    const tableBody = document.querySelector('#subjects-table tbody');
    tableBody.innerHTML = '';
    
    subjects.forEach(subject => {
        const row = document.createElement('tr');
        
        let status, statusClass;
        if (subject.marks >= 85) {
            status = 'Excellent';
            statusClass = 'excellent';
        } else if (subject.marks >= 75) {
            status = 'Good';
            statusClass = 'good';
        } else if (subject.marks >= 60) {
            status = 'Average';
            statusClass = 'average';
        } else {
            status = 'Needs Improvement';
            statusClass = 'poor';
        }
        
        row.innerHTML = `
            <td>${subject.name}</td>
            <td>${subject.credits}</td>
            <td>${subject.marks}</td>
            <td class="grade-${subject.grade.replace('+', 'plus')}">${subject.grade}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateAnalysisCards(analysis) {
    // Update recommendations
    const recommendationsList = document.querySelector('#recommendations-card ul');
    recommendationsList.innerHTML = '';
    analysis.improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        recommendationsList.appendChild(li);
    });
    
    // Update strengths (this could be dynamic based on performance)
    const strengthsList = document.querySelector('#strengths-card ul');
    strengthsList.innerHTML = '';
    
    const strengths = [];
    if (currentView === 'overall') {
        if (academicData.cgpa >= 8.5) strengths.push('Consistently high academic performance');
        if (academicData.overall_attendance >= 90) strengths.push('Excellent attendance record');
    } else {
        const semester = academicData.semesters.find(sem => sem.semester === parseInt(currentView));
        if (semester) {
            if (semester.sgpa >= 8.5) strengths.push('Excellent semester performance');
            if (semester.attendance >= 90) strengths.push('Excellent attendance this semester');
        }
    }
    
    strengths.push('Strong performance in technical subjects');
    strengths.push('Good problem-solving abilities');
    
    strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // Update alerts
    const alertsList = document.querySelector('#alerts-card ul');
    alertsList.innerHTML = '';
    
    const alerts = [];
    if (currentView === 'overall') {
        if (academicData.overall_attendance < 85) alerts.push('Attendance below recommended level');
        if (academicData.cgpa < 8.0) alerts.push('CGPA could be improved');
        
        // Check current semester subjects
        const currentSem = academicData.semesters[academicData.semesters.length - 1];
        currentSem.subjects.forEach(subject => {
            if (subject.marks < 75) {
                alerts.push(`${subject.name} performance needs attention`);
            }
        });
    } else {
        const semester = academicData.semesters.find(sem => sem.semester === parseInt(currentView));
        if (semester) {
            if (semester.attendance < 85) alerts.push('Attendance below recommended level');
            if (semester.sgpa < 8.0) alerts.push('SGPA could be improved');
            
            semester.subjects.forEach(subject => {
                if (subject.marks < 75) {
                    alerts.push(`${subject.name} performance needs attention`);
                }
            });
        }
    }
    
    if (alerts.length === 0) {
        alerts.push('No major concerns identified');
    }
    
    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert;
        alertsList.appendChild(li);
    });
}

function initializeDashboard() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.performance-card, .analysis-card, .info-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
    
    // Add slide-in animation to table rows
    const tableRows = document.querySelectorAll('.subjects-table tbody tr');
    tableRows.forEach((row, index) => {
        setTimeout(() => {
            row.classList.add('slide-in');
        }, index * 50);
    });
}

function loadPerformanceCharts() {
    const chartContainer = document.getElementById('performance-charts');
    
    // Show loading state
    showLoading(chartContainer);
    
    // Fetch chart data from Flask backend with current view
    const url = currentView === 'overall' ? '/graphs' : `/graphs?semester=${currentView}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayChart(chartContainer, data.graph);
        })
        .catch(error => {
            console.error('Error loading charts:', error);
            showError(chartContainer, 'Unable to load performance charts. Please try again later.');
        });
}

function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading performance charts...</p>
        </div>
    `;
}

function displayChart(container, chartData) {
    container.innerHTML = `
        <img src="data:image/png;base64,${chartData}" 
             alt="Performance Charts" 
             class="performance-chart">
    `;
    
    // Add fade-in effect
    const img = container.querySelector('img');
    img.style.opacity = '0';
    img.onload = function() {
        img.style.transition = 'opacity 0.5s ease-in';
        img.style.opacity = '1';
    };
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="loadPerformanceCharts()" class="retry-btn">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

function addInteractiveFeatures() {
    // Add hover effects to performance cards
    const performanceCards = document.querySelectorAll('.performance-card');
    performanceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click functionality to table rows
    const tableRows = document.querySelectorAll('.subjects-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from all rows
            tableRows.forEach(r => r.classList.remove('active-row'));
            // Add active class to clicked row
            this.classList.add('active-row');
            
            // Show subject details (placeholder functionality)
            const subjectName = this.querySelector('td:first-child').textContent;
            showSubjectDetails(subjectName);
        });
    });
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add dropdown functionality for mobile
    addMobileDropdownFunctionality();
    
    // Add progress indicators
    addProgressIndicators();
    
    // Add navigation button functionality
    addNavigationFunctionality();
}

function addNavigationFunctionality() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you could add functionality to show different sections
            const buttonText = this.querySelector('span').textContent;
            console.log(`Navigated to: ${buttonText}`);
        });
    });
}

function showSubjectDetails(subjectName) {
    // Create and show a modal with subject details
    const modal = document.createElement('div');
    modal.className = 'subject-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${subjectName} - Detailed View</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Detailed performance analytics for ${subjectName} would be displayed here.</p>
                <p>This could include:</p>
                <ul>
                    <li>Assignment scores</li>
                    <li>Quiz performance</li>
                    <li>Lab work evaluation</li>
                    <li>Attendance for this subject</li>
                    <li>Improvement suggestions</li>
                </ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .subject-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            color: #002b5c;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-modal:hover {
            color: #002b5c;
        }
        
        .active-row {
            background-color: #e3f2fd !important;
            border-left: 4px solid #002b5c;
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
}

function closeModal() {
    const modal = document.querySelector('.subject-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function addMobileDropdownFunctionality() {
    // Mobile navigation functionality can be added here if needed
    // Since we removed dropdowns, this function is now simplified
    console.log('Mobile navigation initialized');
}

function addProgressIndicators() {
    // Add progress rings to CGPA and attendance cards
    const cgpaCard = document.querySelector('.performance-card:first-child .card-content');
    const attendanceCard = document.querySelector('.performance-card:nth-child(3) .card-content');
    
    if (cgpaCard) {
        addProgressRing(cgpaCard, 86, '#228B22'); // 8.6/10 * 100
    }
    
    if (attendanceCard) {
        addProgressRing(attendanceCard, 90, '#32CD32'); // 90%
    }
}

function addProgressRing(container, percentage, color) {
    const ring = document.createElement('div');
    ring.className = 'progress-ring';
    ring.innerHTML = `
        <svg width="60" height="60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#eee" stroke-width="4"/>
            <circle cx="30" cy="30" r="25" fill="none" stroke="${color}" stroke-width="4"
                    stroke-dasharray="${2 * Math.PI * 25}" 
                    stroke-dashoffset="${2 * Math.PI * 25 * (1 - percentage/100)}"
                    transform="rotate(-90 30 30)"
                    style="transition: stroke-dashoffset 1s ease;"/>
        </svg>
    `;
    
    ring.style.position = 'absolute';
    ring.style.top = '10px';
    ring.style.right = '10px';
    
    container.style.position = 'relative';
    container.appendChild(ring);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add window resize handler
window.addEventListener('resize', debounce(function() {
    // Reposition elements if needed
    const charts = document.querySelector('.performance-chart');
    if (charts) {
        charts.style.width = '100%';
    }
}, 250));

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Dashboard loaded in ${loadTime}ms`);
    }
}

// Call performance logging after page load
window.addEventListener('load', logPerformance);