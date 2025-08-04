// Component Functions

function generateProjectHTML(project) {
    const student = getUserById(project.student_id);
    const projectEndorsements = getEndorsementsByProjectId(project.id);
    const isEndorsed = projectEndorsements.length > 0;
    const isChallengeProject = project.challenge_id !== null;
    
    return `
        <div class="card project-card hover-lift" data-project-id="${project.id}">
            ${isEndorsed ? '<div class="endorsement-badge"><i data-lucide="check-circle"></i> Endorsed</div>' : ''}
            ${isChallengeProject ? '<div class="challenge-badge"><i data-lucide="target"></i> Challenge</div>' : ''}
            <img src="${project.image_url}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                
                <!-- Student Info -->
                <div class="project-student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-year">${student.year} - ${student.course}</div>
                    ${isChallengeProject ? `<div class="challenge-deadline">Deadline: ${formatDate(project.challenge_deadline)}</div>` : ''}
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <!-- Tech Stack -->
                <div class="project-tech">
                    ${project.tech_stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <div class="project-stats">
                    <div class="stat-group">
                        <div class="stat-item">
                            <i data-lucide="heart"></i>
                            <span>${project.upvotes_count}</span>
                        </div>
                        <div class="stat-item">
                            <i data-lucide="award"></i>
                            <span>${project.endorsements_count}</span>
                        </div>
                        <div class="stat-item">
                            <i data-lucide="calendar"></i>
                            <span>${formatDateRelative(project.created_at)}</span>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn ${project.is_upvoted ? 'active' : ''}" onclick="toggleUpvote('${project.id}')">
                            <i data-lucide="heart"></i>
                        </button>
                        <button class="action-btn" onclick="viewProject('${project.id}')">
                            <i data-lucide="eye"></i>
                        </button>
                        ${project.student_id === currentUser.id ? `
                            <button class="action-btn" onclick="editProject('${project.id}')">
                                <i data-lucide="edit"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateChallengeHTML(challenge) {
    const daysLeft = getDaysUntilDeadline(challenge.deadline);
    const isOverdue = daysLeft === 'Overdue';
    const isParticipating = currentUser.active_challenges.includes(challenge.id);
    
    return `
        <div class="card challenge-card hover-lift">
            <div class="challenge-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <h3 class="challenge-title">${challenge.title}</h3>
                    <p class="challenge-author">by ${challenge.teacher_name}</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                    <span class="badge ${isOverdue ? 'badge-warning' : 'badge-success'}">${daysLeft}</span>
                    ${isParticipating ? '<span class="badge badge-info">Participating</span>' : ''}
                </div>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-tags">
                ${challenge.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
            <div class="challenge-footer">
                <span class="stat-item">
                    <i data-lucide="users"></i>
                    <span>${challenge.participants_count} participants</span>
                </span>
                <button class="btn ${isParticipating ? 'btn-secondary' : 'btn-primary'}" onclick="startChallenge('${challenge.id}')">
                    <i data-lucide="${isParticipating ? 'eye' : 'play'}"></i>
                    ${isParticipating ? 'View Details' : 'Start Working'}
                </button>
            </div>
        </div>
    `;
}

function createProjectModal(project) {
    const student = getUserById(project.student_id);
    const projectEndorsements = getEndorsementsByProjectId(project.id);
    const isChallengeProject = project.challenge_id !== null;
    
    return `
        <div class="project-modal">
            <img src="${project.image_url}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 24px;">
            
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 16px; color: #002b5c;">${project.title}</h2>
            
            ${isChallengeProject ? `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #856404;">
                        <i data-lucide="target"></i>
                        <span style="font-weight: 600;">Challenge Project</span>
                    </div>
                    <div style="font-size: 0.875rem; margin-top: 4px; color: #856404;">
                        Deadline: ${formatDate(project.challenge_deadline)}
                    </div>
                </div>
            ` : ''}
            
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #002b5c;">
                <img src="${student.avatar_url}" alt="${student.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
                <div>
                    <div style="font-weight: 600; color: #002b5c;">${student.name}</div>
                    <div style="font-size: 0.875rem; color: #666;">${student.year} - ${student.course}</div>
                    <div style="font-size: 0.875rem; color: #666;">${formatDateRelative(project.created_at)}</div>
                </div>
            </div>
            
            <p style="color: #333; line-height: 1.8; margin-bottom: 24px;">${project.description}</p>
            
            <div style="margin-bottom: 24px;">
                <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Technologies Used</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${project.tech_stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            ${project.github_url || project.demo_url ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Project Links</h4>
                    <div style="display: flex; gap: 12px;">
                        ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="btn btn-outline"><i data-lucide="github"></i> GitHub</a>` : ''}
                        ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="btn btn-primary"><i data-lucide="external-link"></i> Live Demo</a>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${projectEndorsements.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Teacher Endorsements</h4>
                    ${projectEndorsements.map(endorsement => `
                        <div style="padding: 16px; background: rgba(34, 139, 34, 0.05); border-left: 4px solid #228B22; border-radius: 8px; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <img src="${endorsement.teacher_avatar}" alt="${endorsement.teacher_name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                                <div>
                                    <div style="font-weight: 500; color: #002b5c;">${endorsement.teacher_name}</div>
                                    <div style="font-size: 0.75rem; color: #666;">${formatDateRelative(endorsement.created_at)}</div>
                                </div>
                            </div>
                            <p style="color: #333; font-style: italic;">"${endorsement.remarks}"</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 24px;">
                    <div class="stat-item">
                        <i data-lucide="heart"></i>
                        <span>${project.upvotes_count} upvotes</span>
                    </div>
                    <div class="stat-item">
                        <i data-lucide="award"></i>
                        <span>${project.endorsements_count} endorsements</span>
                    </div>
                    <div class="stat-item">
                        <i data-lucide="calendar"></i>
                        <span>${formatDateRelative(project.created_at)}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 12px;">
                    ${project.student_id === currentUser.id ? `
                        <button class="btn btn-outline" onclick="editProject('${project.id}')">
                            <i data-lucide="edit"></i>
                            Edit
                        </button>
                    ` : ''}
                    <button class="btn ${project.is_upvoted ? 'btn-secondary' : 'btn-primary'}" onclick="toggleUpvote('${project.id}')">
                        <i data-lucide="heart"></i>
                        ${project.is_upvoted ? 'Unlike' : 'Upvote'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createAddProjectModal() {
    return `
        <form id="add-project-form" class="project-form">
            <div class="form-group">
                <label class="form-label">Project Title</label>
                <input type="text" class="form-input" name="title" required placeholder="Enter your project title">
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" name="description" required placeholder="Describe your project, its features, and what problems it solves"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Technologies Used</label>
                <input type="text" class="form-input" name="tech_stack" placeholder="e.g., React, Node.js, MongoDB (comma separated)">
            </div>
            
            <div class="form-group">
                <label class="form-label">Project Status</label>
                <select class="form-input" name="status" required>
                    <option value="active">Currently Working</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">GitHub URL (optional)</label>
                <input type="url" class="form-input" name="github_url" placeholder="https://github.com/username/project">
            </div>
            
            <div class="form-group">
                <label class="form-label">Demo URL (optional)</label>
                <input type="url" class="form-input" name="demo_url" placeholder="https://your-project-demo.com">
            </div>
            
            <div class="form-group">
                <label class="form-label">Project Image URL</label>
                <input type="url" class="form-input" name="image_url" placeholder="https://example.com/project-image.jpg">
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i data-lucide="plus"></i>
                    Add Project
                </button>
            </div>
        </form>
    `;
}

function createEditProjectModal(project) {
    return `
        <form id="edit-project-form" class="project-form">
            <input type="hidden" name="project_id" value="${project.id}">
            
            <div class="form-group">
                <label class="form-label">Project Title</label>
                <input type="text" class="form-input" name="title" required value="${project.title}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" name="description" required>${project.description}</textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Technologies Used</label>
                <input type="text" class="form-input" name="tech_stack" value="${project.tech_stack.join(', ')}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Project Status</label>
                <select class="form-input" name="status" required>
                    <option value="active" ${project.status === 'active' ? 'selected' : ''}>Currently Working</option>
                    <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">GitHub URL (optional)</label>
                <input type="url" class="form-input" name="github_url" value="${project.github_url || ''}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Demo URL (optional)</label>
                <input type="url" class="form-input" name="demo_url" value="${project.demo_url || ''}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Project Image URL</label>
                <input type="url" class="form-input" name="image_url" value="${project.image_url}">
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i data-lucide="save"></i>
                    Update Project
                </button>
            </div>
        </form>
    `;
}

function createChallengeModal(challenge) {
    const isParticipating = currentUser.active_challenges.includes(challenge.id);
    
    return `
        <div class="challenge-modal">
            <div style="margin-bottom: 24px;">
                <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: #002b5c;">${challenge.title}</h2>
                <p style="color: #666;">Posted by ${challenge.teacher_name} • ${formatDateRelative(challenge.created_at)}</p>
                ${isParticipating ? '<div style="color: #228B22; font-weight: 600; margin-top: 8px;"><i data-lucide="check-circle"></i> You are participating in this challenge</div>' : ''}
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Problem Statement</h4>
                <p style="color: #333; line-height: 1.8;">${challenge.description}</p>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Expected Outcome</h4>
                <p style="color: #333; line-height: 1.8;">${challenge.expected_outcome}</p>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="font-weight: 600; margin-bottom: 12px; color: #002b5c;">Required Skills</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${challenge.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 24px;">
                <div>
                    <div style="font-weight: 500; color: #002b5c;">Deadline</div>
                    <div style="color: #666; font-size: 0.875rem;">${formatDate(challenge.deadline)}</div>
                </div>
                <div>
                    <div style="font-weight: 500; color: #002b5c;">Participants</div>
                    <div style="color: #666; font-size: 0.875rem;">${challenge.participants_count} students</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Close</button>
                ${!isParticipating ? `
                    <button type="button" class="btn btn-primary" onclick="joinChallenge('${challenge.id}')">
                        <i data-lucide="play"></i>
                        Start Working
                    </button>
                ` : `
                    <button type="button" class="btn btn-secondary" onclick="viewChallengeProject('${challenge.id}')">
                        <i data-lucide="folder"></i>
                        View My Project
                    </button>
                `}
            </div>
        </div>
    `;
}

function createAddSkillModal() {
    const categories = Object.keys(currentUser.skills);
    
    return `
        <form id="add-skill-form" class="skill-form">
            <div class="form-group">
                <label class="form-label">Skill Category</label>
                <select class="form-input" name="category" id="skill-category" required>
                    <option value="">Select a category</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    <option value="new">Create New Category</option>
                </select>
            </div>
            
            <div class="form-group" id="new-category-group" style="display: none;">
                <label class="form-label">New Category Name</label>
                <input type="text" class="form-input" name="new_category" placeholder="e.g., Database Technologies">
            </div>
            
            <div class="form-group">
                <label class="form-label">Skill Name</label>
                <input type="text" class="form-input" name="skill_name" required placeholder="e.g., React.js">
            </div>
            
            <div class="form-group">
                <label class="form-label">Proficiency Level (%)</label>
                <input type="range" class="form-range" name="skill_level" min="0" max="100" value="50" id="skill-level-range">
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.875rem; color: #666;">
                    <span>Beginner</span>
                    <span id="skill-level-display">50%</span>
                    <span>Expert</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i data-lucide="plus"></i>
                    Add Skill
                </button>
            </div>
        </form>
    `;
}