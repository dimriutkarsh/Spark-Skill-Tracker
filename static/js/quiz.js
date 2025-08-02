// Quiz data and state
const questions = {
    name: {
        title: "What's your name?",
        subtitle: "Let's start with getting to know you better.",
        type: "text",
        placeholder: "Enter your full name",
        required: true
    },
    semester: {
        title: "What's your current semester?",
        subtitle: "This helps us understand where you are in your academic journey.",
        type: "select",
        options: [
            { value: "1", text: "1st Semester" },
            { value: "2", text: "2nd Semester" },
            { value: "3", text: "3rd Semester" },
            { value: "4", text: "4th Semester" },
            { value: "5", text: "5th Semester" },
            { value: "6", text: "6th Semester" },
            { value: "7", text: "7th Semester" },
            { value: "8", text: "8th Semester" },
            { value: "graduate", text: "Graduate/Post-Graduate" }
        ],
        required: true
    },
    field: {
        title: "Which field are you most interested in?",
        subtitle: "Choose the area where you see your future career.",
        type: "radio",
        options: [
            "Computer Science & Software Development",
            "Data Science & Machine Learning",
            "Artificial Intelligence & Robotics",
            "Cybersecurity",
            "Web Development & Design",
            "Mobile App Development",
            "Game Development",
            "Cloud Computing & DevOps",
            "Blockchain & Cryptocurrency",
            "Digital Marketing & E-commerce",
            "Product Management",
            "UI/UX Design",
            "Other (specify in next section)"
        ],
        required: true
    },
    skills: {
        title: "What skills have you learned so far?",
        subtitle: "List any programming languages, tools, frameworks, or relevant skills you've acquired. If you're a beginner, just write 'Beginner' or 'None yet'.",
        type: "textarea",
        placeholder: "e.g., Python, JavaScript, HTML/CSS, React, SQL, Git, etc.",
        required: true
    },
    goals: {
        title: "What are your career goals?",
        subtitle: "Describe where you want to be in the next 2-4 years. What kind of role or company do you aspire to work for?",
        type: "textarea",
        placeholder: "e.g., Become a full-stack developer at a tech startup, work as a data scientist at Google, start my own tech company, etc.",
        required: true
    }
};

let currentQuestion = 'name';
let answers = {};
const questionOrder = ['name', 'semester', 'field', 'skills', 'goals'];

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    showQuestion(currentQuestion);
});

function showQuestion(questionId) {
    const question = questions[questionId];
    const container = document.getElementById('questionContainer');
    const currentIndex = questionOrder.indexOf(questionId);
    
    // Update progress
    updateProgress(currentIndex + 1);
    
    let html = `
        <div class="question">
            <h3>${question.title}</h3>
            <p>${question.subtitle}</p>
    `;
    
    switch(question.type) {
        case 'text':
            html += `
                <div class="input-group">
                    <input type="text" id="answer" placeholder="${question.placeholder}" 
                           value="${answers[questionId] || ''}" 
                           onchange="handleInputChange()" 
                           onkeyup="handleInputChange()" />
                </div>
            `;
            break;
            
        case 'select':
            html += `
                <div class="input-group">
                    <select id="answer" onchange="handleInputChange()">
                        <option value="">Choose your semester...</option>
            `;
            question.options.forEach(option => {
                const selected = answers[questionId] === option.value ? 'selected' : '';
                html += `<option value="${option.value}" ${selected}>${option.text}</option>`;
            });
            html += `
                    </select>
                </div>
            `;
            break;
            
        case 'radio':
            html += '<div class="radio-group">';
            question.options.forEach((option, index) => {
                const checked = answers[questionId] === option ? 'checked' : '';
                const selectedClass = answers[questionId] === option ? 'selected' : '';
                html += `
                    <label class="radio-option ${selectedClass}" onclick="selectRadio('${option}', this)">
                        <input type="radio" name="answer" value="${option}" ${checked} onchange="handleInputChange()" />
                        ${option}
                    </label>
                `;
            });
            html += '</div>';
            break;
            
        case 'textarea':
            html += `
                <div class="input-group">
                    <textarea id="answer" placeholder="${question.placeholder}" 
                              onchange="handleInputChange()" 
                              onkeyup="handleInputChange()">${answers[questionId] || ''}</textarea>
                </div>
            `;
            break;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Check if answer exists to enable/disable button
    handleInputChange();
}

function selectRadio(value, element) {
    // Remove selected class from all options
    document.querySelectorAll('.radio-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Update the radio button
    element.querySelector('input[type="radio"]').checked = true;
    
    handleInputChange();
}

function handleInputChange() {
    const answerElement = document.getElementById('answer') || document.querySelector('input[name="answer"]:checked');
    const nextBtn = document.getElementById('nextBtn');
    
    if (answerElement && answerElement.value.trim()) {
        nextBtn.disabled = false;
        answers[currentQuestion] = answerElement.value.trim();
    } else {
        nextBtn.disabled = true;
    }
}

function updateProgress(current) {
    const total = questionOrder.length;
    const percentage = (current / total) * 100;
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Question ${current} of ${total}`;
}

function submitAnswer() {
    const answerElement = document.getElementById('answer') || document.querySelector('input[name="answer"]:checked');
    
    if (!answerElement || !answerElement.value.trim()) {
        alert('Please provide an answer before continuing.');
        return;
    }
    
    const answer = answerElement.value.trim();
    
    // Show loading state
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = 'Processing...';
    nextBtn.disabled = true;
    
    // Submit answer to server
    fetch('/submit_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question_id: currentQuestion,
            answer: answer
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.quiz_complete) {
                // Quiz completed, redirect to chatbot
                window.location.href = data.redirect_url;
            } else {
                // Move to next question
                currentQuestion = data.next_question;
                showQuestion(currentQuestion);
                
                // Reset button
                nextBtn.textContent = data.is_last ? 'Complete Assessment' : 'Next Question';
                nextBtn.disabled = false;
            }
        } else {
            alert('Error: ' + data.error);
            nextBtn.textContent = 'Next Question';
            nextBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        nextBtn.textContent = 'Next Question';
        nextBtn.disabled = false;
    });
}

// Handle Enter key in input fields
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !document.getElementById('nextBtn').disabled) {
        if (e.target.tagName !== 'TEXTAREA') {
            submitAnswer();
        }
    }
});