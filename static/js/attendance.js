// Enhanced Attendance Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAttendanceCalculator();
    initializeTooltips();
    initializeAnimations();
    
    // Auto-calculate on page load with default values
    setTimeout(calculateAttendance, 500);
});

// Initialize the attendance calculator
function initializeAttendanceCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const totalInput = document.getElementById('calc-total');
    const attendedInput = document.getElementById('calc-attended');
    const targetInput = document.getElementById('calc-target');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateAttendance);
    }

    // Auto-calculate on input change with validation
    [totalInput, attendedInput, targetInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                validateInputs();
                debounce(calculateAttendance, 800)();
            });
        }
    });

    // Enhanced input validation
    totalInput?.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
        if (value > 500) { // Reasonable upper limit
            this.value = 500;
        }
        validateAttendedClasses();
    });

    attendedInput?.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 0) {
            this.value = 0;
        }
        validateAttendedClasses();
    });

    targetInput?.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 0) {
            this.value = 0;
        }
        if (value > 100) {
            this.value = 100;
        }
    });
}

// Validate that attended classes don't exceed total classes
function validateAttendedClasses() {
    const totalInput = document.getElementById('calc-total');
    const attendedInput = document.getElementById('calc-attended');
    
    if (totalInput && attendedInput) {
        const total = parseInt(totalInput.value) || 0;
        const attended = parseInt(attendedInput.value) || 0;
        
        if (attended > total) {
            attendedInput.value = total;
        }
    }
}

// Validate all inputs
function validateInputs() {
    const totalInput = document.getElementById('calc-total');
    const attendedInput = document.getElementById('calc-attended');
    const targetInput = document.getElementById('calc-target');
    
    const total = parseInt(totalInput?.value) || 0;
    const attended = parseInt(attendedInput?.value) || 0;
    const target = parseInt(targetInput?.value) || 75;
    
    // Clear previous error states
    [totalInput, attendedInput, targetInput].forEach(input => {
        if (input) {
            input.classList.remove('error');
        }
    });
    
    let isValid = true;
    
    if (total <= 0) {
        totalInput?.classList.add('error');
        isValid = false;
    }
    
    if (attended < 0 || attended > total) {
        attendedInput?.classList.add('error');
        isValid = false;
    }
    
    if (target < 0 || target > 100) {
        targetInput?.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Enhanced calculate attendance function
async function calculateAttendance() {
    const totalClasses = parseInt(document.getElementById('calc-total')?.value) || 0;
    const attendedClasses = parseInt(document.getElementById('calc-attended')?.value) || 0;
    const targetPercentage = parseInt(document.getElementById('calc-target')?.value) || 75;

    // Validate inputs
    if (!validateInputs()) {
        hideResults();
        return;
    }

    // Show loading state
    showLoading();

    try {
        const response = await fetch('/api/calculate_attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                total_classes: totalClasses,
                attended_classes: attendedClasses,
                target_percentage: targetPercentage
            })
        });

        const data = await response.json();

        if (response.ok) {
            displayResults(data);
            showWeeklyBreakdown(data.weekly_data);
            showDetailedRecommendations(data.recommendations);
        } else {
            showError(data.error || 'An error occurred');
        }
    } catch (error) {
        console.error('Error calculating attendance:', error);
        showError('Failed to calculate attendance. Please check your connection and try again.');
    }
}

// Enhanced display results function
function displayResults(data) {
    const resultsSection = document.getElementById('calculator-results');
    const currentPercentage = document.getElementById('current-percentage');
    const classesNeeded = document.getElementById('classes-needed');
    const holidaysAvailable = document.getElementById('holidays-available');
    const attendanceStatus = document.getElementById('attendance-status');

    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
    }

    if (currentPercentage) {
        currentPercentage.textContent = `${data.current_percentage}%`;
        currentPercentage.style.color = getPercentageColor(data.current_percentage);
    }

    if (classesNeeded) {
        if (data.classes_needed > 0) {
            classesNeeded.textContent = `${data.classes_needed} classes`;
            classesNeeded.style.color = '#FF4500';
            classesNeeded.style.fontWeight = 'bold';
        } else {
            classesNeeded.textContent = '✓ Target achieved';
            classesNeeded.style.color = '#228B22';
            classesNeeded.style.fontWeight = 'bold';
        }
    }

    if (holidaysAvailable) {
        if (data.holidays_available > 0) {
            holidaysAvailable.textContent = `${data.holidays_available} classes`;
            holidaysAvailable.style.color = '#228B22';
            holidaysAvailable.style.fontWeight = 'bold';
        } else {
            if (data.current_percentage < data.target_percentage) {
                holidaysAvailable.textContent = '⚠️ Cannot miss any';
                holidaysAvailable.style.color = '#FF4500';
            } else {
                holidaysAvailable.textContent = '0 classes';
                holidaysAvailable.style.color = '#FFA500';
            }
            holidaysAvailable.style.fontWeight = 'bold';
        }
    }

    if (attendanceStatus) {
        attendanceStatus.textContent = data.status.text;
        attendanceStatus.style.color = data.status.color;
        attendanceStatus.className = `result-value status ${data.status.status}`;
    }

    // Add visual indicators
    addVisualIndicators(data);
}

// Show weekly breakdown
function showWeeklyBreakdown(weeklyData) {
    const breakdownSection = document.getElementById('weekly-breakdown');
    const weeksNeeded = document.getElementById('weeks-needed');
    const daysCanMiss = document.getElementById('days-can-miss');
    
    if (breakdownSection && weeklyData) {
        breakdownSection.style.display = 'block';
        
        if (weeksNeeded) {
            if (weeklyData.weeks_needed > 0) {
                weeksNeeded.textContent = `${weeklyData.weeks_needed} week(s)`;
                weeksNeeded.style.color = '#FF4500';
            } else {
                weeksNeeded.textContent = '✓ Target achieved';
                weeksNeeded.style.color = '#228B22';
            }
        }
        
        if (daysCanMiss) {
            if (weeklyData.days_can_miss > 0) {
                daysCanMiss.textContent = `${weeklyData.days_can_miss} day(s)`;
                daysCanMiss.style.color = '#228B22';
            } else {
                daysCanMiss.textContent = '0 days';
                daysCanMiss.style.color = '#FF4500';
            }
        }
    }
}

// Show detailed recommendations
function showDetailedRecommendations(recommendations) {
    let tipsSection = document.getElementById('calculation-tips');
    
    if (!tipsSection) {
        tipsSection = document.createElement('div');
        tipsSection.id = 'calculation-tips';
        tipsSection.className = 'tips-section';
        
        const resultsSection = document.getElementById('calculator-results');
        if (resultsSection) {
            resultsSection.appendChild(tipsSection);
        }
    }

    if (recommendations && recommendations.length > 0) {
        tipsSection.innerHTML = `
            <div class="tips-header">
                <i class="fas fa-brain"></i>
                <strong>AI-Powered Recommendations</strong>
            </div>
            <ul class="tips-list">
                ${recommendations.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
        tipsSection.style.display = 'block';
    } else {
        tipsSection.style.display = 'none';
    }
}

// Add visual indicators
function addVisualIndicators(data) {
    // Add progress bar
    let progressBar = document.getElementById('attendance-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'attendance-progress';
        progressBar.className = 'progress-container';
        
        const resultsSection = document.getElementById('calculator-results');
        if (resultsSection) {
            resultsSection.appendChild(progressBar);
        }
    }
    
    const progressWidth = Math.min(data.current_percentage, 100);
    const progressColor = getPercentageColor(data.current_percentage);
    
    progressBar.innerHTML = `
        <div class="progress-header">
            <span>Current Progress</span>
            <span>${data.current_percentage}% / ${data.target_percentage}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressWidth}%; background-color: ${progressColor}"></div>
            <div class="progress-target" style="left: ${data.target_percentage}%">
                <span class="target-line"></span>
                <span class="target-label">Target</span>
            </div>
        </div>
    `;
}

// Get color based on percentage
function getPercentageColor(percentage) {
    if (percentage >= 90) return '#228B22';
    if (percentage >= 80) return '#32CD32';
    if (percentage >= 75) return '#FFD700';
    if (percentage >= 60) return '#FFA500';
    return '#FF4500';
}

// Show loading state
function showLoading() {
    const resultsSection = document.getElementById('calculator-results');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <i class="fas fa-calculator fa-spin"></i>
                </div>
                <p class="loading-text">Calculating your attendance metrics...</p>
                <div class="loading-progress">
                    <div class="loading-bar"></div>
                </div>
            </div>
        `;
        
        // Animate loading bar
        setTimeout(() => {
            const loadingBar = document.querySelector('.loading-bar');
            if (loadingBar) {
                loadingBar.style.width = '100%';
            }
        }, 100);
    }
}

// Show error message with retry option
function showError(message) {
    const resultsSection = document.getElementById('calculator-results');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.innerHTML = `
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-content">
                    <h4>Calculation Error</h4>
                    <p class="error-message">${message}</p>
                    <button class="retry-btn" onclick="calculateAttendance()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Hide results
function hideResults() {
    const resultsSection = document.getElementById('calculator-results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

// Initialize tooltips for better UX
function initializeTooltips() {
    // Add helpful tooltips to input fields
    const tooltipElements = [
        {
            element: document.getElementById('calc-total'),
            text: 'Enter the total number of classes conducted so far'
        },
        {
            element: document.getElementById('calc-attended'),
            text: 'Enter the number of classes you have attended'
        },
        {
            element: document.getElementById('calc-target'),
            text: 'Set your target attendance percentage (minimum 75% required)'
        }
    ];

    tooltipElements.forEach(({ element, text }) => {
        if (element) {
            element.title = text;
            element.setAttribute('data-tooltip', text);
        }
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for cards
                const cards = entry.target.querySelectorAll('.performance-card, .analysis-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Utility function for debouncing
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

// Enhanced responsive behavior
function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust calculator layout for mobile
    const calculatorGrid = document.querySelector('.calculator-grid');
    if (calculatorGrid) {
        if (isMobile) {
            calculatorGrid.style.gridTemplateColumns = '1fr';
        } else {
            calculatorGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        }
    }
    
    // Adjust table display for mobile
    const tables = document.querySelectorAll('.subjects-table table');
    tables.forEach(table => {
        if (isMobile) {
            table.style.fontSize = '0.8rem';
        } else {
            table.style.fontSize = '1rem';
        }
    });
}

// Listen for window resize
window.addEventListener('resize', debounce(handleResponsiveChanges, 250));

// Initialize responsive behavior on load
handleResponsiveChanges();

// Add custom CSS for enhanced features
function addCustomStyles() {
    if (!document.getElementById('enhanced-attendance-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-attendance-styles';
        style.textContent = `
            .input-group input.error {
                border-color: #FF4500 !important;
                box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1) !important;
            }
            
            .loading-container {
                text-align: center;
                padding: 3rem 2rem;
                color: #002b5c;
            }
            
            .loading-spinner i {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #002b5c;
            }
            
            .loading-text {
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
                color: #666;
            }
            
            .loading-progress {
                width: 100%;
                height: 4px;
                background: #e9ecef;
                border-radius: 2px;
                overflow: hidden;
            }
            
            .loading-bar {
                height: 100%;
                background: linear-gradient(90deg, #002b5c, #f2b100);
                width: 0%;
                transition: width 1.5s ease-out;
            }
            
            .error-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 2rem;
                background: #fff5f5;
                border: 2px solid #fed7d7;
                border-radius: 8px;
                color: #c53030;
            }
            
            .error-icon i {
                font-size: 2.5rem;
                color: #e53e3e;
            }
            
            .error-content h4 {
                margin: 0 0 0.5rem 0;
                color: #c53030;
            }
            
            .error-message {
                margin: 0 0 1rem 0;
                font-size: 0.9rem;
            }
            
            .retry-btn {
                background: #e53e3e;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: background 0.3s ease;
            }
            
            .retry-btn:hover {
                background: #c53030;
            }
            
            .tips-section {
                margin-top: 2rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 100%);
                border-radius: 8px;
                border-left: 4px solid #002b5c;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .tips-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #002b5c;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .tips-header i {
                font-size: 1.3rem;
                color: #f2b100;
            }
            
            .tips-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .tips-list li {
                padding: 0.75rem 0;
                color: #333;
                font-size: 0.95rem;
                line-height: 1.5;
                border-bottom: 1px solid rgba(0, 43, 92, 0.1);
                position: relative;
                padding-left: 1.5rem;
            }
            
            .tips-list li:before {
                content: "💡";
                position: absolute;
                left: 0;
                top: 0.75rem;
            }
            
            .tips-list li:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            
            .weekly-breakdown {
                margin-top: 2rem;
                padding: 1.5rem;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            
            .weekly-breakdown h4 {
                margin: 0 0 1rem 0;
                color: #002b5c;
                font-size: 1.1rem;
            }
            
            .breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .breakdown-item {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
                padding: 1rem;
                background: white;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .breakdown-label {
                font-size: 0.9rem;
                color: #666;
                font-weight: 500;
            }
            
            .breakdown-value {
                font-size: 1.3rem;
                font-weight: 700;
                color: #002b5c;
            }
            
            .progress-container {
                margin-top: 2rem;
                padding: 1.5rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: #002b5c;
                font-weight: 600;
            }
            
            .progress-bar {
                position: relative;
                height: 12px;
                background: #e9ecef;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                transition: width 1s ease-out;
                border-radius: 6px;
            }
            
            .progress-target {
                position: absolute;
                top: 0;
                transform: translateX(-50%);
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .target-line {
                width: 2px;
                height: 12px;
                background: #FF4500;
                border-radius: 1px;
            }
            
            .target-label {
                font-size: 0.7rem;
                color: #FF4500;
                font-weight: 600;
                margin-top: 2px;
                white-space: nowrap;
            }
            
            @media (max-width: 768px) {
                .breakdown-grid {
                    grid-template-columns: 1fr;
                }
                
                .progress-header {
                    flex-direction: column;
                    gap: 0.5rem;
                    text-align: center;
                }
                
                .error-container {
                    flex-direction: column;
                    text-align: center;
                }
                
                .tips-list li {
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize custom styles
document.addEventListener('DOMContentLoaded', addCustomStyles);