// Main Application Logic

let currentPage = 'discover';
let selectedTags = [];
let searchTerm = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize icons
    lucide.createIcons();
    
    // Load the initial page
    loadPage('discover');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize animations
    animateOnScroll();
});

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            loadPage(page);
        });
    });
    
    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    });
}

function loadPage(page) {
    currentPage = page;
    
    // Update navigation active state
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Load page content
    const mainContent = document.getElementById('main-content');
    
    switch(page) {
        case 'discover':
            mainContent.innerHTML = renderDiscoverPage();
            setupDiscoverPageListeners();
            break;
        case 'leaderboard':
            mainContent.innerHTML = renderLeaderboardPage();
            setupLeaderboardListeners();
            break;
        case 'challenges':
            mainContent.innerHTML = renderChallengesPage();
            setupChallengesListeners();
            break;
        case 'profile':
            mainContent.innerHTML = renderProfilePage();
            setupProfileListeners();
            break;
    }
    
    // Reinitialize icons and animations
    lucide.createIcons();
    animateOnScroll();
}

function setupDiscoverPageListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchTerm = e.target.value;
            filterAndDisplayProjects();
        }, 300));
    }
    
    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.getAttribute('data-filter');
            applyProjectFilter(filter);
        });
    });
    
    // Tag filters
    document.querySelectorAll('[data-tag]').forEach(button => {
        button.addEventListener('click', (e) => {
            const tag = e.target.getAttribute('data-tag');
            e.target.classList.toggle('active');
            
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
            
            filterAndDisplayProjects();
        });
    });
}

function setupLeaderboardListeners() {
    // Leaderboard tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const leaderboardType = e.target.getAttribute('data-leaderboard');
            updateLeaderboard(leaderboardType);
        });
    });
}

function setupChallengesListeners() {
    // Challenge event listeners are handled in individual challenge cards
}

function setupProfileListeners() {
    // Profile event listeners are handled in individual project cards
}

function applyProjectFilter(filter) {
    const allProjectsContainer = document.getElementById('all-projects');
    let filteredProjects = [];
    
    switch(filter) {
        case 'all':
            filteredProjects = projects;
            break;
        case 'trending':
            filteredProjects = getTrendingProjects();
            break;
        case 'endorsed':
            filteredProjects = getRecentlyEndorsedProjects();
            break;
        case 'recent':
            filteredProjects = projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
    }
    
    if (allProjectsContainer) {
        allProjectsContainer.innerHTML = filteredProjects.map(project => generateProjectHTML(project)).join('');
        lucide.createIcons();
    }
}

function filterAndDisplayProjects() {
    const filteredProjects = filterProjects(searchTerm, selectedTags);
    const allProjectsContainer = document.getElementById('all-projects');
    
    if (allProjectsContainer) {
        allProjectsContainer.innerHTML = filteredProjects.map(project => generateProjectHTML(project)).join('');
        lucide.createIcons();
    }
}

function updateLeaderboard(type) {
    const leaderboardList = document.getElementById('leaderboard-list');
    let sortedStudents = [];
    
    const students = users.filter(user => user.role === 'student');
    
    switch(type) {
        case 'overall':
            sortedStudents = students.sort((a, b) => (b.total_upvotes + b.total_endorsements * 10) - (a.total_upvotes + a.total_endorsements * 10));
            break;
        case 'upvotes':
            sortedStudents = students.sort((a, b) => b.total_upvotes - a.total_upvotes);
            break;
        case 'endorsements':
            sortedStudents = students.sort((a, b) => b.total_endorsements - a.total_endorsements);
            break;
        case 'projects':
            sortedStudents = students.sort((a, b) => b.total_projects - a.total_projects);
            break;
    }
    
    if (leaderboardList) {
        leaderboardList.innerHTML = sortedStudents.map((student, index) => `
            <div class="leaderboard-item hover-lift">
                <div class="leaderboard-rank rank-${index + 1 <= 3 ? index + 1 : 'other'}">#${index + 1}</div>
                <img src="${student.avatar_url}" alt="${student.name}" class="leaderboard-avatar">
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${student.name}</div>
                    <div class="leaderboard-title">${student.year} - ${student.course}</div>
                    <div style="display: flex; gap: 16px; margin-top: 8px;">
                        <span class="stat-item">
                            <i data-lucide="heart"></i>
                            <span>${student.total_upvotes} upvotes</span>
                        </span>
                        <span class="stat-item">
                            <i data-lucide="award"></i>
                            <span>${student.total_endorsements} endorsed</span>
                        </span>
                        <span class="stat-item">
                            <i data-lucide="folder"></i>
                            <span>${student.total_projects} projects</span>
                        </span>
                    </div>
                </div>
                <div class="leaderboard-score">
                    ${type === 'upvotes' ? student.total_upvotes : 
                      type === 'endorsements' ? student.total_endorsements :
                      type === 'projects' ? student.total_projects :
                      student.total_upvotes + student.total_endorsements * 10}
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }
}

// Action Functions
function toggleUpvote(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        if (project.is_upvoted) {
            project.upvotes_count--;
            project.is_upvoted = false;
            showNotification('Upvote removed', 'success');
        } else {
            project.upvotes_count++;
            project.is_upvoted = true;
            showNotification('Project upvoted!', 'success');
        }
        
        // Update user stats
        const student = getUserById(project.student_id);
        if (student) {
            student.total_upvotes = getProjectsByStudentId(student.id).reduce((sum, p) => sum + p.upvotes_count, 0);
        }
        
        // Refresh current page
        loadPage(currentPage);
    }
}

function viewProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        openModal('Project Details', createProjectModal(project));
    }
}

function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project && project.student_id === currentUser.id) {
        openModal('Edit Project', createEditProjectModal(project));
        
        // Setup form submission
        setTimeout(() => {
            const form = document.getElementById('edit-project-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    
                    // Update project
                    project.title = formData.get('title');
                    project.description = formData.get('description');
                    project.tech_stack = formData.get('tech_stack').split(',').map(tech => tech.trim());
                    project.status = formData.get('status');
                    project.github_url = formData.get('github_url');
                    project.demo_url = formData.get('demo_url');
                    project.image_url = formData.get('image_url');
                    
                    closeModal();
                    showNotification('Project updated successfully!', 'success');
                    loadPage(currentPage);
                });
            }
        }, 100);
    }
}

function startChallenge(challengeId) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
        openModal('Challenge Details', createChallengeModal(challenge));
    }
}

function joinChallenge(challengeId) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
        // Check if already participating
        if (currentUser.active_challenges.includes(challengeId)) {
            showNotification('You are already participating in this challenge!', 'warning');
            return;
        }
        
        // Create a challenge project
        const challengeProject = createChallengeProject(challenge);
        
        // Update challenge participant count
        challenge.participants_count++;
        
        closeModal();
        showNotification('Challenge started! Project created in your profile.', 'success');
        
        // If on profile page, refresh it to show the new project
        if (currentPage === 'profile') {
            loadPage('profile');
        }
    }
}

function viewChallengeProject(challengeId) {
    const challengeProject = projects.find(p => p.challenge_id === challengeId && p.student_id === currentUser.id);
    if (challengeProject) {
        closeModal();
        viewProject(challengeProject.id);
    }
}

function openAddProjectModal() {
    openModal('Add New Project', createAddProjectModal());
    
    // Setup form submission
    setTimeout(() => {
        const form = document.getElementById('add-project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                const newProject = {
                    id: Date.now().toString(),
                    title: formData.get('title'),
                    description: formData.get('description'),
                    tech_stack: formData.get('tech_stack').split(',').map(tech => tech.trim()),
                    status: formData.get('status'),
                    github_url: formData.get('github_url'),
                    demo_url: formData.get('demo_url'),
                    image_url: formData.get('image_url') || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    student_id: currentUser.id,
                    created_at: new Date().toISOString(),
                    upvotes_count: 0,
                    endorsements_count: 0,
                    is_upvoted: false,
                    challenge_id: null
                };
                
                projects.unshift(newProject);
                
                // Update user stats
                const user = getUserById(currentUser.id);
                user.total_projects = getProjectsByStudentId(currentUser.id).length;
                
                closeModal();
                showNotification('Project added successfully!', 'success');
                loadPage('profile');
            });
        }
    }, 100);
}

function openAddSkillModal() {
    openModal('Add New Skill', createAddSkillModal());
    
    // Setup form functionality
    setTimeout(() => {
        const form = document.getElementById('add-skill-form');
        const categorySelect = document.getElementById('skill-category');
        const newCategoryGroup = document.getElementById('new-category-group');
        const skillLevelRange = document.getElementById('skill-level-range');
        const skillLevelDisplay = document.getElementById('skill-level-display');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                if (e.target.value === 'new') {
                    newCategoryGroup.style.display = 'block';
                } else {
                    newCategoryGroup.style.display = 'none';
                }
            });
        }
        
        if (skillLevelRange && skillLevelDisplay) {
            skillLevelRange.addEventListener('input', (e) => {
                skillLevelDisplay.textContent = e.target.value + '%';
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                let category = formData.get('category');
                if (category === 'new') {
                    category = formData.get('new_category');
                    if (!category) {
                        showNotification('Please enter a category name', 'error');
                        return;
                    }
                }
                
                const skillName = formData.get('skill_name');
                const skillLevel = parseInt(formData.get('skill_level'));
                
                addSkillToCategory(category, skillName, skillLevel);
                
                closeModal();
                loadPage('profile');
            });
        }
    }, 100);
}

function deleteSkill(category, skillName) {
    if (confirm(`Are you sure you want to remove "${skillName}" from your skills?`)) {
        removeSkillFromCategory(category, skillName);
        loadPage('profile');
    }
}

// Global click handlers for dynamically generated content
document.addEventListener('click', function(e) {
    // Handle project card clicks
    if (e.target.closest('.project-card')) {
        const projectCard = e.target.closest('.project-card');
        const projectId = projectCard.getAttribute('data-project-id');
        
        // Don't open modal if clicking on action buttons
        if (!e.target.closest('.action-buttons') && !e.target.closest('.skill-delete-btn')) {
            viewProject(projectId);
        }
    }
});