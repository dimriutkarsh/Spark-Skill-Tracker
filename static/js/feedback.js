// Semester Navigation
document.addEventListener('DOMContentLoaded', function() {
    const semesterBtns = document.querySelectorAll('.semester-btn');
    const semesterContents = document.querySelectorAll('.semester-content');
    
    semesterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const semester = this.dataset.semester;
            
            // Update active button
            semesterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            semesterContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === semester + '_content') {
                    content.classList.add('active');
                }
            });
        });
    });
});

// Meeting Request Functionality
let currentMeetingData = {};

function requestMeeting(semester, subjectCode, teacherName) {
    currentMeetingData = { semester, subjectCode, teacherName };
    
    // Get subject name
    const subjectName = getSubjectName(semester, subjectCode);
    
    document.getElementById('meetingSubject').value = `${subjectName} (${subjectCode})`;
    document.getElementById('meetingFaculty').value = teacherName;
    document.getElementById('meetingModal').style.display = 'block';
}

function closeMeetingModal() {
    document.getElementById('meetingModal').style.display = 'none';
    document.getElementById('meetingForm').reset();
}

// Student Feedback Functionality
let currentFeedbackData = {};

function submitStudentFeedback(semester, subjectCode) {
    currentFeedbackData = { semester, subjectCode };
    
    // Get subject name
    const subjectName = getSubjectName(semester, subjectCode);
    
    document.getElementById('feedbackSubject').value = `${subjectName} (${subjectCode})`;
    document.getElementById('feedbackModal').style.display = 'block';
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'none';
    document.getElementById('feedbackForm').reset();
}

// Helper function to get subject name
function getSubjectName(semester, subjectCode) {
    const subjects = {
        'semester_1': {
            'CHE001': 'Engineering Chemistry',
            'MEC001': 'Basic Mechanical Engineering',
            'ELE001': 'Basic Electronics Engineering',
            'MAT001': 'Engineering Mathematics-I',
            'ENG001': 'English Language Lab'
        },
        'semester_2': {
            'PHY001': 'Engineering Physics',
            'PPS001': 'Programming for Problem Solving',
            'ELE002': 'Basic Electrical Engineering',
            'MAT002': 'Engineering Mathematics-II',
            'EVS001': 'Environmental Science'
        }
    };
    
    return subjects[semester][subjectCode] || 'Unknown Subject';
}

// Form Submissions
document.getElementById('meetingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        semester: currentMeetingData.semester,
        subject_code: currentMeetingData.subjectCode,
        teacher: currentMeetingData.teacherName,
        datetime: document.getElementById('meetingDateTime').value,
        message: document.getElementById('meetingMessage').value
    };
    
    // Send meeting request
    fetch('/request_meeting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Meeting request sent successfully!', 'success');
        closeMeetingModal();
        
        // Update UI to show meeting requested
        updateMeetingStatus(currentMeetingData.semester, currentMeetingData.subjectCode, true);
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error sending meeting request. Please try again.', 'error');
    });
});

document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        semester: currentFeedbackData.semester,
        subject_code: currentFeedbackData.subjectCode,
        feedback: document.getElementById('studentFeedback').value
    };
    
    // Send student feedback
    fetch('/submit_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Feedback submitted successfully!', 'success');
        closeFeedbackModal();
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error submitting feedback. Please try again.', 'error');
    });
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #059669;' : 'background: #dc2626;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update meeting status in UI
function updateMeetingStatus(semester, subjectCode, requested) {
    const semesterContent = document.getElementById(semester + '_content');
    const feedbackCards = semesterContent.querySelectorAll('.feedback-card');
    
    feedbackCards.forEach(card => {
        const header = card.querySelector('.feedback-header h5');
        if (header && header.textContent.includes(subjectCode)) {
            let badge = card.querySelector('.meeting-badge');
            if (requested && !badge) {
                badge = document.createElement('span');
                badge.className = 'meeting-badge';
                badge.innerHTML = '<i class="fas fa-calendar-check"></i> Meeting Requested';
                card.querySelector('.feedback-header').appendChild(badge);
            }
        }
    });
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const meetingModal = document.getElementById('meetingModal');
    const feedbackModal = document.getElementById('feedbackModal');
    
    if (event.target === meetingModal) {
        closeMeetingModal();
    }
    
    if (event.target === feedbackModal) {
        closeFeedbackModal();
    }
});

// Print functionality
document.querySelector('.btn-print').addEventListener('click', function() {
    // Show print dialog with custom message
    showNotification('Preparing document for printing...', 'success');
    
    setTimeout(() => {
        window.print();
    }, 500);
});

// Progress bar animations
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.width = width;
        }, 500);
    });
}

// Initialize progress bar animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateProgressBars, 1000);
});

// Add smooth scrolling for internal links
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

// Performance Analytics Enhancement
function calculateGPA(semester) {
    // This would calculate GPA based on grades
    // For now, returning mock data
    return semester === 'semester_1' ? 8.5 : 8.2;
}

function updateAnalytics() {
    const sem1GPA = calculateGPA('semester_1');
    const sem2GPA = calculateGPA('semester_2');
    
    // Update progress bars with calculated values
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars.length >= 2) {
        progressBars[0].style.width = `${sem1GPA * 10}%`;
        progressBars[1].style.width = `${sem2GPA * 10}%`;
    }
}

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateAnalytics, 1500);
});