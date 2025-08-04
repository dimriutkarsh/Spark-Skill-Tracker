// Utility Functions

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateRelative(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
}

function getDaysUntilDeadline(deadlineString) {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffInMs = deadline - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Overdue';
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `${diffInDays} days left`;
}

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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function openModal(title, content) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .stagger-animation');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

function filterProjects(searchTerm, selectedTags = []) {
    return projects.filter(project => {
        const student = getUserById(project.student_id);
        const matchesSearch = searchTerm === '' || 
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesTags = selectedTags.length === 0 || 
            selectedTags.some(tag => project.tech_stack.includes(tag));
            
        return matchesSearch && matchesTags;
    });
}

// Helper Functions
function getUserById(id) {
    return users.find(user => user.id === id);
}

function getProjectsByStudentId(studentId) {
    return projects.filter(project => project.student_id === studentId);
}

function getActiveProjects(studentId) {
    return projects.filter(project => project.student_id === studentId && project.status === 'active');
}

function getCompletedProjects(studentId) {
    return projects.filter(project => project.student_id === studentId && project.status === 'completed');
}

function getChallengeProjects(studentId) {
    return projects.filter(project => project.student_id === studentId && project.challenge_id !== null);
}

function getEndorsementsByProjectId(projectId) {
    return endorsements.filter(endorsement => endorsement.project_id === projectId);
}

function getTopStudents() {
    return users
        .filter(user => user.role === 'student')
        .sort((a, b) => (b.total_upvotes + b.total_endorsements * 10) - (a.total_upvotes + a.total_endorsements * 10))
        .slice(0, 10);
}

function getTrendingProjects() {
    return projects
        .sort((a, b) => {
            const scoreA = a.upvotes_count + a.endorsements_count * 5;
            const scoreB = b.upvotes_count + b.endorsements_count * 5;
            return scoreB - scoreA;
        })
        .slice(0, 6);
}

function getRecentlyEndorsedProjects() {
    const endorsedProjectIds = [...new Set(endorsements.map(e => e.project_id))];
    return projects
        .filter(project => endorsedProjectIds.includes(project.id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4);
}

function getAllTags() {
    const allTags = new Set();
    projects.forEach(project => {
        project.tech_stack.forEach(tag => allTags.add(tag));
    });
    challenges.forEach(challenge => {
        challenge.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}

// Skill Management Functions
function addSkillToCategory(category, skillName, skillLevel) {
    if (!currentUser.skills[category]) {
        currentUser.skills[category] = [];
    }
    
    // Check if skill already exists
    const existingSkill = currentUser.skills[category].find(skill => skill.name === skillName);
    if (existingSkill) {
        existingSkill.level = skillLevel;
        showNotification('Skill updated successfully!', 'success');
    } else {
        currentUser.skills[category].push({ name: skillName, level: skillLevel });
        showNotification('Skill added successfully!', 'success');
    }
}

function removeSkillFromCategory(category, skillName) {
    if (currentUser.skills[category]) {
        currentUser.skills[category] = currentUser.skills[category].filter(skill => skill.name !== skillName);
        
        // Remove category if empty
        if (currentUser.skills[category].length === 0) {
            delete currentUser.skills[category];
        }
        
        showNotification('Skill removed successfully!', 'success');
    }
}

function createChallengeProject(challenge) {
    const newProject = {
        id: Date.now().toString(),
        title: `Challenge: ${challenge.title}`,
        description: `Working on the "${challenge.title}" challenge. ${challenge.description}`,
        tech_stack: challenge.tags,
        status: 'active',
        github_url: '',
        demo_url: '',
        image_url: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: currentUser.id,
        created_at: new Date().toISOString(),
        upvotes_count: 0,
        endorsements_count: 0,
        is_upvoted: false,
        challenge_id: challenge.id,
        challenge_deadline: challenge.deadline
    };
    
    projects.unshift(newProject);
    
    // Update user stats
    const user = getUserById(currentUser.id);
    user.total_projects = getProjectsByStudentId(currentUser.id).length;
    
    // Add to active challenges
    if (!currentUser.active_challenges.includes(challenge.id)) {
        currentUser.active_challenges.push(challenge.id);
    }
    
    return newProject;
}