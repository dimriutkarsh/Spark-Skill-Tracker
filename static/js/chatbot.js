// Tab management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('nav li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to corresponding nav item
    const navItems = document.querySelectorAll('nav li a');
    navItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(tabName)) {
            item.parentElement.classList.add('active');
        }
    });
    
    // Load content if needed
    if (tabName === 'roadmap' && !document.getElementById('roadmapContent').innerHTML.trim()) {
        generateRoadmap();
    } else if (tabName === 'reality' && !document.getElementById('realityContent').innerHTML.trim()) {
        generateRealityCheck();
    }
}

// Generate roadmap
function generateRoadmap() {
    const loadingElement = document.getElementById('roadmapLoading');
    const contentElement = document.getElementById('roadmapContent');
    
    loadingElement.style.display = 'block';
    contentElement.innerHTML = '';
    
    fetch('/get_roadmap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        loadingElement.style.display = 'none';
        
        if (data.success) {
            contentElement.innerHTML = formatContent(data.roadmap);
        } else {
            contentElement.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loadingElement.style.display = 'none';
        contentElement.innerHTML = '<div class="error">An error occurred while generating your roadmap. Please try again.</div>';
    });
}

// Generate reality check
function generateRealityCheck() {
    const loadingElement = document.getElementById('realityLoading');
    const contentElement = document.getElementById('realityContent');
    
    loadingElement.style.display = 'block';
    contentElement.innerHTML = '';
    
    fetch('/get_reality_check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        loadingElement.style.display = 'none';
        
        if (data.success) {
            contentElement.innerHTML = formatContent(data.reality_check);
        } else {
            contentElement.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loadingElement.style.display = 'none';
        contentElement.innerHTML = '<div class="error">An error occurred while generating your reality check. Please try again.</div>';
    });
}

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Send to server
    fetch('/chat_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addMessageToChat(data.response, 'bot');
        } else {
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
    });
}

function addMessageToChat(message, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = formatContent(message);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Progress tracker functionality
let progressData = {
    technical: [],
    project: [],
    course: [],
    networking: []
};

function addProgress(type) {
    let prompt = '';
    let targetId = '';
    
    switch(type) {
        case 'technical':
            prompt = 'Enter a technical skill you\'ve learned:';
            targetId = 'technicalSkills';
            break;
        case 'project':
            prompt = 'Enter a project you\'ve completed:';
            targetId = 'projectsCompleted';
            break;
        case 'course':
            prompt = 'Enter a course or certification you\'ve completed:';
            targetId = 'coursesCompleted';
            break;
        case 'networking':
            prompt = 'Enter a networking activity or experience:';
            targetId = 'networkingActivities';
            break;
    }
    
    const item = window.prompt(prompt);
    if (item && item.trim()) {
        progressData[type].push(item.trim());
        updateProgressDisplay(type, targetId);
        saveProgress();
    }
}

function updateProgressDisplay(type, targetId) {
    const container = document.getElementById(targetId);
    container.innerHTML = '';
    
    progressData[type].forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'progress-item';
        itemDiv.innerHTML = `
            <span>${item}</span>
            <button class="remove-btn" onclick="removeProgress('${type}', ${index}, '${targetId}')">×</button>
        `;
        container.appendChild(itemDiv);
    });
}

function removeProgress(type, index, targetId) {
    progressData[type].splice(index, 1);
    updateProgressDisplay(type, targetId);
    saveProgress();
}

function saveProgress() {
    fetch('/update_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            progress: progressData
        })
    })
    .catch(error => {
        console.error('Error saving progress:', error);
    });
}

// Format content for display
function formatContent(content) {
    // Convert markdown-like formatting to HTML
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/## (.*?)$/gm, '<h3>$1</h3>')
        .replace(/# (.*?)$/gm, '<h3>$1</h3>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.)/gm, '<p>$1')
        .replace(/(.)$/gm, '$1</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p><h3>/g, '<h3>')
        .replace(/<\/h3><\/p>/g, '</h3>')
        .replace(/- (.*?)(?=<\/p>)/g, '<li>$1</li>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/li><\/p>/g, '</li></ul>');
}

// Handle Enter key in chat input
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        sendMessage();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Show roadmap tab by default
    showTab('roadmap');
});