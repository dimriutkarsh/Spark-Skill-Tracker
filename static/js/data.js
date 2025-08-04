// Mock Data for SkillForge Platform

// Current User (Student Only)
const currentUser = {
    id: '1',
    name: 'Utkarsh Dimri',
    email: 'dimriutkarsh55@gmail.com',
    role: 'student', 
    year: '2nd Year',
    course: 'B.Tech CSE(AI/ML)',
    avatar_url: "/static/images/updated.png",
    bio: 'Aim to become a Data Scientist, an AI/ML Engineer',
    skills: {
        'Programming Languages': [
            { name: 'JavaScript', level: 40 },
            { name: 'Python', level: 65 },
            { name: 'C', level: 70 }
        ],
        'Web Technologies': [
            { name: 'Flask', level: 55 },
            { name: 'Django', level: 70 },
            { name: 'HTML/CSS', level: 95 },
            { name: 'SQL', level: 60 },
            { name: 'Web-Scraping', level: 70 },
        ],
        'Tools & Frameworks': [
            { name: 'Git/GitHub', level: 75 },
            { name: 'TensorFlow', level: 80 },
        ]
    },
    active_challenges: [], // Track active challenges
    created_at: '2024-01-15'
};

// Users Data
const users = [
    {
        id: '1',
        name: 'Utkarsh Dimri',
        email: 'dimriutkarsh55@gmail.com',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering(AI/ML)',
        avatar_url: "/static/images/updated.png",
        bio: 'Aim to become a Data Scientist and AI/ML Engineer',
        total_upvotes: 245,
        total_endorsements: 12,
        total_projects: 8
    },
    {
        id: '2',
        name: 'Aman Joshi',
        email: 'aman.joshi@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/amanj.png",
        bio: 'AI enthusiast and data science explorer.',
        total_upvotes: 189,
        total_endorsements: 15,
        total_projects: 6
    },
    {
        id: '3',
        name: 'Aayush Semwal',
        email: 'aayush.semwal@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/aayush.png",
        bio: 'Mobile app developer and UX/UI designer.',
        total_upvotes: 156,
        total_endorsements: 9,
        total_projects: 5
    },
    {
        id: '4',
        name: 'Rishiraj Rawat',
        email: 'rishiraj.rawat@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/rishi.png",
        bio: 'Entrepreneur and tech enthusiast',
        total_upvotes: 178,
        total_endorsements: 11,
        total_projects: 7
    },
    {
        id: '5',
        name: 'Pranjal Maithani',
        email: 'pranjal@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/pranjal.png",
        bio: 'Entrepreneur and tech enthusiast',
        total_upvotes: 168,
        total_endorsements: 11,
        total_projects: 7
    },
    {
        id: '6',
        name: 'Kushal Veer Singh',
        email: 'kushal@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/updated.png",
        bio: 'Full-stack developer.',
        total_upvotes: 140,
        total_endorsements: 8,
        total_projects: 5
    },
    {
        id: '7',
        name: 'Abhinav',
        email: 'abhinav@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Cyber Security',
        avatar_url: "/static/images/abhinav.png",
        bio: 'Cybersecurity enthusiast and ethical hacker.',
        total_upvotes: 178,
        total_endorsements: 11,
        total_projects: 7
    },
    {
        id: '8',
        name: 'Akshat Dimri',
        email: 'akshat.dimri@student.edu',
        role: 'student',
        year: '2nd Year',
        course: 'B.Tech Computer Science & Engineering',
        avatar_url: "/static/images/akshat.png",
        bio: 'Aspiring software engineer with interest in web development.',
        total_upvotes: 89,
        total_endorsements: 4,
        total_projects: 3
    }
];

// Projects Data with enhanced details
const projects = [
    {
        id: '1',
        title: 'Student Progress Tracker (SPARK)',
        description: 'A centralized system to monitor student progress across semesters, including academics, projects, and AI-generated roadmaps.',
        tech_stack: ['Python', 'Flask', 'SQLite', 'JavaScript', 'Chart.js'],
        github_url: 'https://github.com/utkarsh/spark',
        demo_url: 'https://spark-demo.herokuapp.com',
        image_url: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: '1',
        created_at: '2024-02-15',
        upvotes_count: 42,
        endorsements_count: 3,
        is_upvoted: false,
        status: 'active',
        challenge_id: null
    },
    {
        id: '2',
        title: 'JARVIS AI Assistant',
        description: 'A Flask-based AI assistant powered by Gemini API, integrated with voice recognition and response via JavaScript.',
        tech_stack: ['Python', 'Flask', 'Gemini API', 'JavaScript', 'Speech Recognition'],
        github_url: 'https://github.com/utkarsh/jarvis-ai',
        demo_url: '',
        image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: '1',
        created_at: '2024-02-10',
        upvotes_count: 38,
        endorsements_count: 2,
        is_upvoted: true,
        status: 'active',
        challenge_id: null
    },
    {
        id: '3',
        title: 'Kaggle Data Explorer',
        description: 'A collection of data analysis notebooks built using NumPy, Pandas, and Matplotlib on real-world datasets.',
        tech_stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
        github_url: 'https://github.com/aman/kaggle-explorer',
        demo_url: '',
        image_url: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1622730874517/3g7G6Hv-W.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp',
        student_id: '2',
        created_at: '2024-02-08',
        upvotes_count: 29,
        endorsements_count: 1,
        is_upvoted: false,
        status: 'completed',
        challenge_id: null
    },
    {
        id: '4',
        title: 'AI Resume Generator',
        description: 'An AI-powered tool that creates professional resumes based on user inputs using LLMs and form data.',
        tech_stack: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
        github_url: 'https://github.com/aayush/ai-resume',
        demo_url: 'https://ai-resume-gen.vercel.app',
        image_url: 'https://airesume.com/templates/resume/wright.webp',
        student_id: '3',
        created_at: '2024-02-05',
        upvotes_count: 35,
        endorsements_count: 2,
        is_upvoted: false,
        status: 'active',
        challenge_id: null
    },
    {
        id: '5',
        title: 'Scientific Calculator with NumPy',
        description: 'A menu-driven scientific calculator using NumPy that supports basic operations and medium-level data analysis.',
        tech_stack: ['Python', 'NumPy', 'Tkinter', 'Math'],
        github_url: 'https://github.com/rishiraj/sci-calculator',
        demo_url: '',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAQe1QSFjDTXQizkBz07SkOzzW3TX7wI2EHw&s',
        student_id: '4',
        created_at: '2024-01-28',
        upvotes_count: 22,
        endorsements_count: 1,
        is_upvoted: false,
        status: 'completed',
        challenge_id: null
    },
    {
        id: '6',
        title: 'AI Dataset Preprocessing Engine',
        description: 'A Python-based tool that cleans, normalizes, and splits AI datasets using Pandas and NumPy.',
        tech_stack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
        github_url: 'https://github.com/akshat/dataset-preprocessor',
        demo_url: '',
        image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: '8',
        created_at: '2024-01-25',
        upvotes_count: 18,
        endorsements_count: 1,
        is_upvoted: false,
        status: 'active',
        challenge_id: null
    },
    {
        id: '7',
        title: 'Tourism Chatbot for DEEP‑SHIVA',
        description: 'A smart chatbot for Uttarakhand tourism that provides personalized travel plans, weather info, and local guidance.',
        tech_stack: ['Python', 'NLP', 'Flask', 'API Integration'],
        github_url: 'https://github.com/rishiraj/tourism-bot',
        demo_url: 'https://deep-shiva-bot.herokuapp.com',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-QYcj31ALNMVqK1JMKa1Njgre44XMuPKbbw&s',
        student_id: '4',
        created_at: '2024-01-20',
        upvotes_count: 31,
        endorsements_count: 2,
        is_upvoted: false,
        status: 'completed',
        challenge_id: null
    },
    {
        id: '8',
        title: 'NotesNest',
        description: 'A web app for organizing and sharing academic notes collaboratively, featuring tagging, search, and versioning.',
        tech_stack: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
        github_url: 'https://github.com/aayush/notes-nest',
        demo_url: 'https://notes-nest.vercel.app',
        image_url: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: '3',
        created_at: '2024-01-15',
        upvotes_count: 27,
        endorsements_count: 1,
        is_upvoted: false,
        status: 'completed',
        challenge_id: null
    },
    {
        id: '9',
        title: 'Image Generating Chatbot',
        description: 'An AI-powered chatbot that converts user prompts into generated images using text-to-image models.',
        tech_stack: ['Python', 'Stable Diffusion', 'Flask', 'OpenAI'],
        github_url: 'https://github.com/akshat/image-gen-bot',
        demo_url: '',
        image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        student_id: '8',
        created_at: '2024-01-10',
        upvotes_count: 24,
        endorsements_count: 1,
        is_upvoted: false,
        status: 'active',
        challenge_id: null
    }
];

// Endorsements Data
const endorsements = [
    {
        id: '1',
        project_id: '1',
        teacher_id: 'teacher1',
        teacher_name: 'Head of Club',
        teacher_avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        remarks: 'Excellent implementation of student tracking system with practical real-world application. Great attention to user experience.',
        created_at: '2024-02-22'
    },
    {
        id: '2',
        project_id: '2',
        teacher_id: 'teacher1',
        teacher_name: 'Organizer',
        teacher_avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        remarks: 'Outstanding use of AI API integration for educational purposes. The voice recognition approach is innovative.',
        created_at: '2024-02-20'
    },
    {
        id: '3',
        project_id: '4',
        teacher_id: 'teacher2',
        teacher_name: 'HOD CSE',
        teacher_avatar: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        remarks: 'Impressive work on AI integration. The user interface is professional and the API integration is well executed.',
        created_at: '2024-02-17'
    }
];

// Challenges Data
const challenges = [
    {
        id: '1',
        title: 'Green Campus Initiative – Environment Club',
        description: 'Build a digital platform that tracks and promotes eco-friendly student activities like tree plantation, plastic collection, and energy conservation drives.',
        expected_outcome: 'An interactive dashboard showing individual and collective impact, with gamified achievements to encourage participation.',
        tags: ['Environment', 'Web App', 'Gamification', 'Data Visualization'],
        deadline: '2024-09-10',
        teacher_id: 'teacher_env1',
        teacher_name: 'Prof.',
        participants_count: 15,
        created_at: '2024-08-01'
    },
    {
        id: '2',
        title: 'Library Automation System – Library Club',
        description: 'Design a smart library system using RFID and QR to automate book tracking, late return alerts, and space utilization.',
        expected_outcome: 'A demo with automated check-in/check-out, analytics on book demand, and student engagement reports.',
        tags: ['Library', 'IoT', 'Python', 'RFID', 'Django'],
        deadline: '2024-09-25',
        teacher_id: 'teacher_lib1',
        teacher_name: 'Dr.',
        participants_count: 10,
        created_at: '2024-08-02'
    },
    {
        id: '3',
        title: 'Hack the Campus – Tech Club Open Innovation',
        description: 'Propose and build any software or hardware solution that solves a real problem faced by students on campus. This could include mental health, attendance, hostel complaints, or anything else.',
        expected_outcome: 'A working prototype with user feedback and a pitch presentation to judges.',
        tags: ['Open Innovation', 'Full Stack', 'AI/ML', 'App Development'],
        deadline: '2024-10-01',
        teacher_id: 'teacher_tech1',
        teacher_name: 'Mr.',
        participants_count: 25,
        created_at: '2024-08-02'
    },
    {
        id: '4',
        title: 'Sustainable Transport Tracker – Environment Club',
        description: 'Build an app that encourages carpooling, cycling, or walking by tracking and rewarding sustainable transport methods among students.',
        expected_outcome: 'App with geolocation, user profiles, and leaderboard to track eco-friendly transport behavior.',
        tags: ['Sustainability', 'React Native', 'Maps API', 'Gamification'],
        deadline: '2024-09-20',
        teacher_id: 'teacher_env2',
        teacher_name: 'Prof.',
        participants_count: 12,
        created_at: '2024-08-01'
    },
    {
        id: '5',
        title: 'Digital Notes Exchange – Library Club + Tech Club',
        description: 'Create a peer-to-peer notes and resource sharing platform where students can upload, review, and request notes by subject or teacher.',
        expected_outcome: 'A platform with student login, file uploads, search filters, and reputation system for top contributors.',
        tags: ['Collaboration', 'Web App', 'Node.js', 'MongoDB', 'Cloud Storage'],
        deadline: '2024-09-30',
        teacher_id: 'teacher_tech2',
        teacher_name: 'Ms.',
        participants_count: 18,
        created_at: '2024-08-03'
    }
];