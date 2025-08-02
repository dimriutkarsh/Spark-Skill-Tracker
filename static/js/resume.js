// Global variables
let currentStep = 1;
const totalSteps = 6;
let resumeData = {
    personal_info: {},
    experience: [],
    education: [],
    skills: { technical: [], soft: [], languages: [] },
    projects: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupEventListeners();
    setupSkillsInput();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step <= currentStep || validateCurrentStep()) {
                goToStep(step);
            }
        });
    });

    // Form inputs for personal info
    document.getElementById('fullName').addEventListener('input', updatePersonalInfo);
    document.getElementById('email').addEventListener('input', updatePersonalInfo);
    document.getElementById('phone').addEventListener('input', updatePersonalInfo);
    document.getElementById('location').addEventListener('input', updatePersonalInfo);
    document.getElementById('linkedin').addEventListener('input', updatePersonalInfo);
    document.getElementById('github').addEventListener('input', updatePersonalInfo);
    document.getElementById('summary').addEventListener('input', updatePersonalInfo);
}

// Setup skills input functionality
function setupSkillsInput() {
    const skillInputs = [
        { input: 'technicalSkillInput', container: 'technicalSkills', type: 'technical' },
        { input: 'softSkillInput', container: 'softSkills', type: 'soft' },
        { input: 'languageInput', container: 'languages', type: 'languages' }
    ];

    skillInputs.forEach(skill => {
        const input = document.getElementById(skill.input);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addSkill(this.value.trim(), skill.type, skill.container);
                this.value = '';
            }
        });
    });
}

// Navigation functions
function nextStep() {
    if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        goToStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        goToStep(currentStep);
    }
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${step}`).classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active', 'completed');
        const buttonStep = parseInt(button.dataset.step);
        if (buttonStep === step) {
            button.classList.add('active');
        } else if (buttonStep < step) {
            button.classList.add('completed');
        }
    });

    currentStep = step;
    updateProgressBar();
    updateNavigationButtons();

    if (step === 6) {
        generatePreview();
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = percentage + '%';
    
    const stepNames = [
        'Personal Information',
        'Work Experience', 
        'Education',
        'Skills & Competencies',
        'Projects',
        'Generate Resume'
    ];
    
    progressText.textContent = `Step ${currentStep} of ${totalSteps}: ${stepNames[currentStep - 1]}`;
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'flex';
    }
}

// Validation functions
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validatePersonalInfo();
        case 2:
            return validateExperience();
        case 3:
            return validateEducation();
        case 4:
            return validateSkills();
        case 5:
            return validateProjects();
        default:
            return true;
    }
}

function validatePersonalInfo() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!fullName || !email || !phone) {
        alert('Please fill in all required fields (Name, Email, Phone)');
        return false;
    }
    
    return true;
}

function validateExperience() {
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length === 0) {
        alert('Please add at least one work experience');
        return false;
    }
    
    for (let item of experienceItems) {
        const jobTitle = item.querySelector('input[name="jobTitle"]').value.trim();
        const company = item.querySelector('input[name="company"]').value.trim();
        
        if (!jobTitle || !company) {
            alert('Please fill in job title and company for all experiences');
            return false;
        }
    }
    
    return true;
}

function validateEducation() {
    const educationItems = document.querySelectorAll('.education-item');
    if (educationItems.length === 0) {
        alert('Please add at least one education entry');
        return false;
    }
    
    for (let item of educationItems) {
        const degree = item.querySelector('input[name="degree"]').value.trim();
        const institution = item.querySelector('input[name="institution"]').value.trim();
        
        if (!degree || !institution) {
            alert('Please fill in degree and institution for all education entries');
            return false;
        }
    }
    
    return true;
}

function validateSkills() {
    const hasSkills = resumeData.skills.technical.length > 0 || 
                     resumeData.skills.soft.length > 0 || 
                     resumeData.skills.languages.length > 0;
    
    if (!hasSkills) {
        alert('Please add at least one skill');
        return false;
    }
    
    return true;
}

function validateProjects() {
    // Projects are optional
    return true;
}

// Data collection functions
function updatePersonalInfo() {
    resumeData.personal_info = {
        full_name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        github: document.getElementById('github').value.trim(),
        summary: document.getElementById('summary').value.trim()
    };
}

function collectExperienceData() {
    resumeData.experience = [];
    document.querySelectorAll('.experience-item').forEach(item => {
        const exp = {
            job_title: item.querySelector('input[name="jobTitle"]').value.trim(),
            company: item.querySelector('input[name="company"]').value.trim(),
            start_date: item.querySelector('input[name="startDate"]').value,
            end_date: item.querySelector('input[name="endDate"]').value,
            current_job: item.querySelector('input[name="currentJob"]').checked,
            job_description: item.querySelector('textarea[name="jobDescription"]').value.trim()
        };
        
        if (exp.job_title && exp.company) {
            resumeData.experience.push(exp);
        }
    });
}

function collectEducationData() {
    resumeData.education = [];
    document.querySelectorAll('.education-item').forEach(item => {
        const edu = {
            degree: item.querySelector('input[name="degree"]').value.trim(),
            field_of_study: item.querySelector('input[name="fieldOfStudy"]').value.trim(),
            institution: item.querySelector('input[name="institution"]').value.trim(),
            graduation_year: item.querySelector('input[name="graduationYear"]').value,
            gpa: item.querySelector('input[name="gpa"]').value.trim(),
            location: item.querySelector('input[name="eduLocation"]').value.trim()
        };
        
        if (edu.degree && edu.institution) {
            resumeData.education.push(edu);
        }
    });
}

function collectProjectsData() {
    resumeData.projects = [];
    document.querySelectorAll('.project-item').forEach(item => {
        const project = {
            name: item.querySelector('input[name="projectName"]').value.trim(),
            technologies: item.querySelector('input[name="technologies"]').value.split(',').map(t => t.trim()).filter(t => t),
            github_url: item.querySelector('input[name="githubUrl"]').value.trim(),
            live_url: item.querySelector('input[name="liveUrl"]').value.trim(),
            description: item.querySelector('textarea[name="projectDescription"]').value.trim()
        };
        
        if (project.name) {
            resumeData.projects.push(project);
        }
    });
}

// Skills management
function addSkill(skill, type, containerId) {
    if (!resumeData.skills[type].includes(skill)) {
        resumeData.skills[type].push(skill);
        updateSkillsDisplay(containerId, resumeData.skills[type], type);
    }
}

function removeSkill(skill, type, containerId) {
    const index = resumeData.skills[type].indexOf(skill);
    if (index > -1) {
        resumeData.skills[type].splice(index, 1);
        updateSkillsDisplay(containerId, resumeData.skills[type], type);
    }
}

function updateSkillsDisplay(containerId, skills, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <span class="remove-skill" onclick="removeSkill('${skill}', '${type}', '${containerId}')">&times;</span>
        `;
        container.appendChild(skillTag);
    });
}

// Dynamic form management
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newExp = document.querySelector('.experience-item').cloneNode(true);
    
    // Clear all inputs
    newExp.querySelectorAll('input, textarea').forEach(input => {
        input.value = '';
        if (input.type === 'checkbox') input.checked = false;
    });
    
    // Update checkbox IDs
    const checkbox = newExp.querySelector('input[type="checkbox"]');
    const label = newExp.querySelector('label[for^="currentJob"]');
    const newId = 'currentJob' + Date.now();
    checkbox.id = newId;
    label.setAttribute('for', newId);
    
    container.appendChild(newExp);
}

function removeExperience(button) {
    const container = document.getElementById('experienceContainer');
    if (container.children.length > 1) {
        button.closest('.experience-item').remove();
    }
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const newEdu = document.querySelector('.education-item').cloneNode(true);
    
    // Clear all inputs
    newEdu.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(newEdu);
}

function removeEducation(button) {
    const container = document.getElementById('educationContainer');
    if (container.children.length > 1) {
        button.closest('.education-item').remove();
    }
}

function addProject() {
    const container = document.getElementById('projectsContainer');
    const newProject = document.querySelector('.project-item').cloneNode(true);
    
    // Clear all inputs
    newProject.querySelectorAll('input, textarea').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(newProject);
}

function removeProject(button) {
    const container = document.getElementById('projectsContainer');
    if (container.children.length > 1) {
        button.closest('.project-item').remove();
    }
}

// AI Enhancement functions
function enhanceDescription(elementId, type) {
    const element = document.getElementById(elementId);
    const description = element.value.trim();
    
    if (!description) {
        alert('Please enter some text to enhance');
        return;
    }
    
    showLoading('Enhancing description...');
    
    fetch('/api/enhance-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            type: type
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            element.value = data.enhanced_description;
        } else {
            alert('Error enhancing description: ' + data.message);
        }
    })
    .catch(error => {
        hideLoading();
        alert('Error enhancing description: ' + error.message);
    });
}

function enhanceJobDescription(button) {
    const textarea = button.previousElementSibling;
    const description = textarea.value.trim();
    
    if (!description) {
        alert('Please enter job description to enhance');
        return;
    }
    
    showLoading('Enhancing job description...');
    
    fetch('/api/enhance-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            type: 'experience'
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            textarea.value = data.enhanced_description;
        } else {
            alert('Error enhancing description: ' + data.message);
        }
    })
    .catch(error => {
        hideLoading();
        alert('Error enhancing description: ' + error.message);
    });
}

function enhanceProjectDescription(button) {
    const textarea = button.previousElementSibling;
    const description = textarea.value.trim();
    
    if (!description) {
        alert('Please enter project description to enhance');
        return;
    }
    
    showLoading('Enhancing project description...');
    
    fetch('/api/enhance-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            type: 'project'
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            textarea.value = data.enhanced_description;
        } else {
            alert('Error enhancing description: ' + data.message);
        }
    })
    .catch(error => {
        hideLoading();
        alert('Error enhancing description: ' + error.message);
    });
}

// Preview and generation
function generatePreview() {
    updatePersonalInfo();
    collectExperienceData();
    collectEducationData();
    collectProjectsData();
    
    const preview = document.getElementById('resumePreview');
    
    let previewHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #002b5c; margin: 0;">${resumeData.personal_info.full_name || 'Your Name'}</h2>
            <p style="margin: 5px 0;">${resumeData.personal_info.email || 'your.email@example.com'} | ${resumeData.personal_info.phone || 'Your Phone'}</p>
            ${resumeData.personal_info.location ? `<p style="margin: 5px 0;">${resumeData.personal_info.location}</p>` : ''}
        </div>
    `;
    
    if (resumeData.personal_info.summary) {
        previewHTML += `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #002b5c; border-bottom: 1px solid #ccc;">Professional Summary</h3>
                <p>${resumeData.personal_info.summary}</p>
            </div>
        `;
    }
    
    if (resumeData.experience.length > 0) {
        previewHTML += `<div style="margin-bottom: 20px;">
            <h3 style="color: #002b5c; border-bottom: 1px solid #ccc;">Experience</h3>`;
        
        resumeData.experience.forEach(exp => {
            previewHTML += `
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 5px 0;">${exp.job_title} - ${exp.company}</h4>
                    <p style="font-style: italic; margin: 5px 0;">${exp.start_date} - ${exp.current_job ? 'Present' : exp.end_date}</p>
                    ${exp.job_description ? `<p style="margin: 5px 0;">${exp.job_description.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `;
        });
        
        previewHTML += `</div>`;
    }
    
    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) {
        previewHTML += `<div style="margin-bottom: 20px;">
            <h3 style="color: #002b5c; border-bottom: 1px solid #ccc;">Skills</h3>`;
        
        if (resumeData.skills.technical.length > 0) {
            previewHTML += `<p><strong>Technical:</strong> ${resumeData.skills.technical.join(', ')}</p>`;
        }
        
        if (resumeData.skills.soft.length > 0) {
            previewHTML += `<p><strong>Soft Skills:</strong> ${resumeData.skills.soft.join(', ')}</p>`;
        }
        
        previewHTML += `</div>`;
    }
    
    preview.innerHTML = previewHTML;
}

function generateResume() {
    updatePersonalInfo();
    collectExperienceData();
    collectEducationData();
    collectProjectsData();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    showLoading('Generating your resume...');
    
    fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showStatus('Resume generated successfully!', 'success');
            // Create download link
            const link = document.createElement('a');
            link.href = data.download_url;
            link.download = '';
            link.click();
        } else {
            showStatus('Error generating resume: ' + data.message, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        showStatus('Error generating resume: ' + error.message, 'error');
    });
}

// Utility functions
function showLoading(message) {
    const modal = document.getElementById('loadingModal');
    const loadingText = document.getElementById('loadingText');
    loadingText.textContent = message;
    modal.style.display = 'block';
}

function hideLoading() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'none';
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('generationStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}