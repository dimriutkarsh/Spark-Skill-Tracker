// Page Content Functions

function renderDiscoverPage() {
    const trendingProjects = getTrendingProjects();
    const recentlyEndorsed = getRecentlyEndorsedProjects();
    const allTags = getAllTags();
    
    return `
        <div class="page-transition fade-in">
            <div class="page-header">
                <h1 class="page-title">Discover Amazing Projects</h1>
                <p class="page-subtitle">Explore innovative student projects, find inspiration, and connect with talented peers</p>
            </div>
            
            <!-- Search and Filters -->
            <div class="search-container">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" class="search-input" id="search-input" placeholder="Search projects, students, or technologies...">
            </div>
            
            <div class="filters">
                <div class="filter-group">
                    <label style="font-weight: 500; color: #002b5c;">Filter by:</label>
                    <button class="filter-button active" data-filter="all">All Projects</button>
                    <button class="filter-button" data-filter="trending">Trending</button>
                    <button class="filter-button" data-filter="endorsed">Endorsed</button>
                    <button class="filter-button" data-filter="recent">Recent</button>
                </div>
            </div>
            
            <!-- Tags Filter -->
            <div class="filters">
                <div class="filter-group">
                    <label style="font-weight: 500; color: #002b5c;">Technologies:</label>
                    ${allTags.slice(0, 8).map(tag => `
                        <button class="filter-button" data-tag="${tag}">${tag}</button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Trending Section -->
            <section class="mb-12">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">🔥 Trending Projects</h2>
                <div class="grid grid-cols-3 stagger-animation" id="trending-projects">
                    ${trendingProjects.map(project => generateProjectHTML(project)).join('')}
                </div>
            </section>
            
            <!-- Recently Endorsed -->
            <section class="mb-12">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">✅ Recently Endorsed</h2>
                <div class="grid grid-cols-2 stagger-animation" id="endorsed-projects">
                    ${recentlyEndorsed.map(project => generateProjectHTML(project)).join('')}
                </div>
            </section>
            
            <!-- All Projects -->
            <section>
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">All Projects</h2>
                <div class="grid grid-cols-3 stagger-animation" id="all-projects">
                    ${projects.map(project => generateProjectHTML(project)).join('')}
                </div>
            </section>
        </div>
    `;
}

function renderLeaderboardPage() {
    const topStudents = getTopStudents();
    
    return `
        <div class="page-transition fade-in">
            <div class="page-header">
                <h1 class="page-title">🏆 Hall of Fame</h1>
                <p class="page-subtitle">Celebrating our most outstanding students and their remarkable achievements</p>
            </div>
            
            <!-- Leaderboard Filters -->
            <div class="tabs mb-8">
                <button class="tab active" data-leaderboard="overall">Overall Ranking</button>
                <button class="tab" data-leaderboard="upvotes">Most Upvoted</button>
                <button class="tab" data-leaderboard="endorsements">Most Endorsed</button>
                <button class="tab" data-leaderboard="projects">Most Projects</button>
            </div>
            
            <!-- Top 3 Spotlight -->
            <section class="mb-12">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c; text-align: center;">🥇 Top Performers</h2>
                <div class="grid grid-cols-3 stagger-animation">
                    ${topStudents.slice(0, 3).map((student, index) => `
                        <div class="card profile-card hover-lift" style="text-align: center;">
                            <div style="position: relative; margin-bottom: 16px;">
                                <img src="${student.avatar_url}" alt="${student.name}" class="profile-avatar" style="width: 100px; height: 100px; margin: 0 auto;">
                                <div style="position: absolute; top: -8px; right: 50%; transform: translateX(50%); background: ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}; color: ${index === 1 ? '#002b5c' : 'white'}; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">
                                    #${index + 1}
                                </div>
                            </div>
                            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: #002b5c;">${student.name}</h3>
                            <p style="color: #666; margin-bottom: 8px; font-weight: 500;">${student.year} - ${student.course}</p>
                            <p style="color: #666; margin-bottom: 16px; font-size: 0.9rem;">${student.bio}</p>
                            <div class="profile-stats" style="justify-content: center; gap: 24px;">
                                <div class="profile-stat">
                                    <span class="profile-stat-number" style="font-size: 1.5rem;">${student.total_upvotes}</span>
                                    <span class="profile-stat-label">Upvotes</span>
                                </div>
                                <div class="profile-stat">
                                    <span class="profile-stat-number" style="font-size: 1.5rem;">${student.total_endorsements}</span>
                                    <span class="profile-stat-label">Endorsed</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- Full Leaderboard -->
            <section>
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">Complete Rankings</h2>
                <div id="leaderboard-list" class="stagger-animation">
                    ${topStudents.map((student, index) => `
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
                            <div class="leaderboard-score">${student.total_upvotes + student.total_endorsements * 10}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
}

function renderChallengesPage() {
    return `
        <div class="page-transition fade-in">
            <div class="page-header">
                <h1 class="page-title">📌 Student Challenges</h1>
                <p class="page-subtitle">Upgrade your skills by building real-world projects assigned by teachers and clubs.</p>
            </div>
            
            <!-- Active Challenges -->
            <section class="mb-12">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">🚀 Active Challenges</h2>
                <div class="grid grid-cols-1 stagger-animation" id="challenges-list">
                    ${challenges.map(challenge => generateChallengeHTML(challenge)).join('')}
                </div>
            </section>
            
            <!-- Challenge Stats -->
            <section>
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 32px; color: #002b5c;">📊 Challenge Statistics</h2>
                <div class="grid grid-cols-3">
                    <div class="card text-center p-6">
                        <div style="font-size: 3rem; font-weight: 700; color: #002b5c; margin-bottom: 8px;">${challenges.length}</div>
                        <div style="color: #666;">Active Challenges</div>
                    </div>
                    <div class="card text-center p-6">
                        <div style="font-size: 3rem; font-weight: 700; color: #f2b100; margin-bottom: 8px;">${challenges.reduce((sum, c) => sum + c.participants_count, 0)}</div>
                        <div style="color: #666;">Total Participants</div>
                    </div>
                    <div class="card text-center p-6">
                        <div style="font-size: 3rem; font-weight: 700; color: #228B22; margin-bottom: 8px;">${getChallengeProjects(currentUser.id).filter(p => p.status === 'completed').length}</div>
                        <div style="color: #666;">My Completed</div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function renderProfilePage() {
    const userProjects = getProjectsByStudentId(currentUser.id);
    const activeProjects = getActiveProjects(currentUser.id);
    const completedProjects = getCompletedProjects(currentUser.id);
    const challengeProjects = getChallengeProjects(currentUser.id);
    const totalUpvotes = userProjects.reduce((sum, project) => sum + project.upvotes_count, 0);
    const totalEndorsements = userProjects.reduce((sum, project) => sum + project.endorsements_count, 0);
    
    return `
        <div class="page-transition fade-in">
            <!-- Profile Header -->
            <div class="card profile-card mb-8">
                <img src="${currentUser.avatar_url}" alt="${currentUser.name}" class="profile-avatar">
                <h1 class="profile-name">${currentUser.name}</h1>
                <p class="profile-role">${currentUser.year} Student</p>
                <p style="color: #666; font-weight: 500; margin-bottom: 1rem;">${currentUser.course}</p>
                <p class="profile-bio">${currentUser.bio}</p>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="profile-stat-number">${userProjects.length}</span>
                        <span class="profile-stat-label">Total Projects</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-number">${totalUpvotes}</span>
                        <span class="profile-stat-label">Upvotes</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-number">${totalEndorsements}</span>
                        <span class="profile-stat-label">Endorsements</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-number">${challengeProjects.length}</span>
                        <span class="profile-stat-label">Challenges</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="openAddProjectModal()">
                    <i data-lucide="plus"></i>
                    Add New Project
                </button>
            </div>
            
            <!-- Skills Section -->
            <section class="skills-section">
                <div class="section-header">
                    <h2 class="section-title">My Skills</h2>
                    <button class="btn btn-primary" onclick="openAddSkillModal()">
                        <i data-lucide="plus"></i>
                        Add Skill
                    </button>
                </div>
                ${Object.entries(currentUser.skills).map(([category, skills]) => `
                    <div class="skill-category">
                        <h3 class="skill-category-title">${category}</h3>
                        <div class="skills-grid">
                            ${skills.map(skill => `
                                <div class="skill-card">
                                    <div class="skill-header">
                                        <div class="skill-name">${skill.name}</div>
                                        <button class="skill-delete-btn" onclick="deleteSkill('${category}', '${skill.name}')" title="Remove skill">
                                            <i data-lucide="x"></i>
                                        </button>
                                    </div>
                                    <div class="skill-level">${skill.level}% Proficiency</div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${skill.level}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </section>
            
            <!-- Challenge Projects Section -->
            ${challengeProjects.length > 0 ? `
                <section class="projects-section">
                    <div class="section-header">
                        <h2 class="section-title">Challenge Projects</h2>
                        <span class="project-count">${challengeProjects.length} Projects</span>
                    </div>
                    <div class="grid grid-cols-2 stagger-animation">
                        ${challengeProjects.map(project => generateProjectHTML(project)).join('')}
                    </div>
                </section>
            ` : ''}
            
            <!-- Active Projects Section -->
            <section class="projects-section">
                <div class="section-header">
                    <h2 class="section-title">Active Projects</h2>
                    <span class="project-count">${activeProjects.filter(p => !p.challenge_id).length} Projects</span>
                </div>
                ${activeProjects.filter(p => !p.challenge_id).length > 0 ? `
                    <div class="grid grid-cols-2 stagger-animation">
                        ${activeProjects.filter(p => !p.challenge_id).map(project => generateProjectHTML(project)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <i data-lucide="code" class="empty-state-icon"></i>
                        <h3 class="empty-state-title">No Active Personal Projects</h3>
                        <p class="empty-state-description">Start working on a new project to showcase your skills!</p>
                        <button class="btn btn-primary" onclick="openAddProjectModal()">
                            <i data-lucide="plus"></i>
                            Start New Project
                        </button>
                    </div>
                `}
            </section>
            
            <!-- Completed Projects Section -->
            <section class="projects-section">
                <div class="section-header">
                    <h2 class="section-title">Completed Projects</h2>
                    <span class="project-count">${completedProjects.length} Projects</span>
                </div>
                ${completedProjects.length > 0 ? `
                    <div class="grid grid-cols-2 stagger-animation">
                        ${completedProjects.map(project => generateProjectHTML(project)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <i data-lucide="check-circle" class="empty-state-icon"></i>
                        <h3 class="empty-state-title">No Completed Projects</h3>
                        <p class="empty-state-description">Complete your first project to build your portfolio!</p>
                    </div>
                `}
            </section>
        </div>
    `;
}