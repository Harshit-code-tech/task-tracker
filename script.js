// User-specific data management
class UserDataManager {
    constructor() {
        this.currentUser = null;
        this.initializeUser();
    }

    initializeUser() {
        // Check both sessionStorage and localStorage for user data
        const savedUser = sessionStorage.getItem('productivefire_user') || 
                         sessionStorage.getItem('taskTrackerCurrentUser') ||
                         localStorage.getItem('productivefire_user') ||
                         localStorage.getItem('taskTrackerCurrentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // Ensure user data is also stored in localStorage for persistence
            if (!localStorage.getItem('productivefire_user')) {
                localStorage.setItem('productivefire_user', savedUser);
            }
        }
    }

    getUserKey(key) {
        if (!this.currentUser || !this.currentUser.email) {
            return key; // fallback for legacy data
        }
        return `${this.currentUser.email}_${key}`;
    }

    setUserData(key, data) {
        const userKey = this.getUserKey(key);
        localStorage.setItem(userKey, JSON.stringify(data));
    }

    getUserData(key, defaultValue = null) {
        const userKey = this.getUserKey(key);
        const data = localStorage.getItem(userKey);
        return data ? JSON.parse(data) : defaultValue;
    }

    clearUserData() {
        if (!this.currentUser || !this.currentUser.email) return;
        
        const keysToRemove = [];
        const userPrefix = `${this.currentUser.email}_`;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(userPrefix)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Refresh user data when authentication state changes
    refreshUser() {
        this.initializeUser();
        // Reload user-specific data
        tasks = this.getUserData('tasks', []);
        neetcodeProgress = this.getUserData('neetcodeProgress', {});
        dsaProgress = this.getUserData('dsaProgress', {});
        algorithmsProgress = this.getUserData('algorithmsProgress', {});
        personalCourses = this.getUserData('personalCourses', []);
        roadmapProgress = this.getUserData('roadmapProgress', {
            currentMonth: 1,
            currentWeek: 1,
            completedWeeks: [],
            skillsProgress: {},
            projectsCompleted: [],
            learningStreak: 0,
            lastActiveDate: null
        });
        
        // Re-render the UI with user-specific data
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    }
}

// Initialize user data manager
const userDataManager = new UserDataManager();

// Application state - now user-specific
let tasks = userDataManager.getUserData('tasks', []);
let neetcodeProgress = userDataManager.getUserData('neetcodeProgress', {});
let dsaProgress = userDataManager.getUserData('dsaProgress', {});
let algorithmsProgress = userDataManager.getUserData('algorithmsProgress', {});
let personalCourses = userDataManager.getUserData('personalCourses', []);
let roadmapProgress = userDataManager.getUserData('roadmapProgress', {
    currentMonth: 1,
    currentWeek: 1,
    completedWeeks: [],
    skillsProgress: {},
    projectsCompleted: [],
    learningStreak: 0,
    lastActiveDate: null
});
let currentEditingTask = null;
let currentEditingCourse = null;

// Roadmap Data Structure
const roadmapData = {
    months: [
        {
            month: 1,
            title: "DSA + Web Basics",
            description: "Foundation building with algorithms and web technologies",
            weeks: [
                {
                    week: 1,
                    title: "Arrays & Web Fundamentals",
                    topics: ["Arrays", "Strings", "HTML", "CSS", "Git"],
                    goals: "Solve LeetCode Top 50 Easy problems, build basic portfolio website",
                    skills: ["Data Structures", "Web Development", "Version Control"]
                },
                {
                    week: 2,
                    title: "Linked Lists & JavaScript",
                    topics: ["Linked Lists", "Stacks", "Queues", "JavaScript ES6", "DOM"],
                    goals: "Master linear data structures, build interactive JS portfolio",
                    skills: ["Data Structures", "JavaScript", "DOM Manipulation"]
                },
                {
                    week: 3,
                    title: "Hashing & React Basics",
                    topics: ["Hashing", "Sliding Window", "React Components", "Hooks"],
                    goals: "Learn hash tables and React fundamentals, convert portfolio to React",
                    skills: ["Algorithms", "React", "Component Design"]
                },
                {
                    week: 4,
                    title: "Trees & State Management",
                    topics: ["Binary Trees", "BST", "Tree Traversal", "React Router", "Context API"],
                    goals: "Master tree data structures, add routing and state management",
                    skills: ["Tree Algorithms", "React Ecosystem", "State Management"]
                }
            ]
        },
        {
            month: 2,
            title: "Backend + Full-Stack Foundation",
            description: "Building robust backend systems and full-stack applications",
            weeks: [
                {
                    week: 5,
                    title: "Graphs & Backend Basics",
                    topics: ["Graph BFS", "Graph DFS", "Node.js/Django", "REST APIs"],
                    goals: "Learn graph algorithms, build REST API for To-Do App",
                    skills: ["Graph Algorithms", "Backend Development", "API Design"]
                },
                {
                    week: 6,
                    title: "Advanced Graphs & Databases",
                    topics: ["Dijkstra", "Topological Sort", "PostgreSQL", "MongoDB", "JWT Auth"],
                    goals: "Master graph algorithms, implement authentication system",
                    skills: ["Advanced Algorithms", "Databases", "Authentication"]
                },
                {
                    week: 7,
                    title: "Recursion & Full-Stack Integration",
                    topics: ["Recursion", "Backtracking", "Frontend-Backend Integration"],
                    goals: "Connect React frontend with backend API, complete full-stack app",
                    skills: ["Recursion", "Full-Stack Development", "System Integration"]
                },
                {
                    week: 8,
                    title: "Dynamic Programming & Deployment",
                    topics: ["DP Basics", "Memoization", "Deployment", "Render/Vercel"],
                    goals: "Learn DP fundamentals, deploy full-stack application",
                    skills: ["Dynamic Programming", "DevOps", "Cloud Deployment"]
                }
            ]
        },
        {
            month: 3,
            title: "Major Full-Stack Project",
            description: "Building a comprehensive full-stack application",
            weeks: [
                {
                    week: 9,
                    title: "Advanced DP & Project Planning",
                    topics: ["Knapsack", "LIS", "Project Architecture", "Database Design"],
                    goals: "Start Job Portal or E-Commerce project with auth and search features",
                    skills: ["Advanced DP", "System Design", "Project Planning"]
                },
                {
                    week: 10,
                    title: "Binary Search & Payment Integration",
                    topics: ["Binary Search on Answer", "Payment Gateway", "Admin Dashboard"],
                    goals: "Implement payment systems and administrative features",
                    skills: ["Search Algorithms", "Payment Processing", "Admin Systems"]
                },
                {
                    week: 11,
                    title: "Company Patterns & Project Completion",
                    topics: ["Amazon Patterns", "Google Patterns", "Performance Optimization"],
                    goals: "Finish and deploy major project with optimizations",
                    skills: ["Interview Patterns", "Performance", "Production Deployment"]
                },
                {
                    week: 12,
                    title: "System Design & Testing",
                    topics: ["Caching", "Load Balancing", "Testing", "Code Review"],
                    goals: "Add testing, optimize APIs, write technical blog post",
                    skills: ["System Design", "Testing", "Technical Writing"]
                }
            ]
        },
        {
            month: 4,
            title: "AI/ML Advanced + LLM",
            description: "Diving into artificial intelligence and machine learning",
            weeks: [
                {
                    week: 13,
                    title: "AI Fundamentals & Chatbots",
                    topics: ["Transformers", "Hugging Face", "LangChain", "OpenAI API"],
                    goals: "Build AI Chatbot with context memory and conversation turns",
                    skills: ["AI/ML", "NLP", "LLM Integration"]
                },
                {
                    week: 14,
                    title: "Model Fine-tuning & Resume AI",
                    topics: ["Fine-tuning", "Text Classification", "Resume Analysis"],
                    goals: "Create Resume Screening AI that ranks resumes by job description",
                    skills: ["Model Training", "Classification", "Document Processing"]
                },
                {
                    week: 15,
                    title: "AI Deployment & Hosting",
                    topics: ["Streamlit", "Gradio", "Hugging Face Spaces", "Model Serving"],
                    goals: "Deploy AI Chatbot and Resume Screener, write AI blog post",
                    skills: ["AI Deployment", "MLOps", "Technical Communication"]
                },
                {
                    week: 16,
                    title: "MLOps & CI/CD",
                    topics: ["Docker for ML", "GitHub Actions", "Model Versioning"],
                    goals: "Implement CI/CD pipeline for AI projects",
                    skills: ["MLOps", "DevOps", "Automation"]
                }
            ]
        },
        {
            month: 5,
            title: "Advanced Projects + System Design",
            description: "Building complex systems and mastering system design",
            weeks: [
                {
                    week: 17,
                    title: "Real-time Systems",
                    topics: ["WebSockets", "Real-time Chat", "Typing Indicators", "Online Status"],
                    goals: "Build real-time chat application with advanced features",
                    skills: ["Real-time Systems", "WebSockets", "Concurrency"]
                },
                {
                    week: 18,
                    title: "Scalability & Analytics",
                    topics: ["URL Shortener", "Rate Limiting", "Caching", "Analytics"],
                    goals: "Create URL shortener with analytics and performance optimization",
                    skills: ["Scalability", "Performance", "Analytics"]
                },
                {
                    week: 19,
                    title: "AI Image Generation",
                    topics: ["Stable Diffusion", "Image Processing", "AI Art"],
                    goals: "Deploy AI Image Generator using Stable Diffusion",
                    skills: ["Computer Vision", "Generative AI", "Image Processing"]
                },
                {
                    week: 20,
                    title: "System Design Mastery",
                    topics: ["CAP Theorem", "Distributed Systems", "Microservices"],
                    goals: "Master system design concepts, practice mock interviews",
                    skills: ["System Design", "Distributed Systems", "Architecture"]
                }
            ]
        },
        {
            month: 6,
            title: "Placement Prep + Networking",
            description: "Final preparation for job interviews and career advancement",
            weeks: [
                {
                    week: 21,
                    title: "DSA Revision & Mock Interviews",
                    topics: ["Trees Review", "Graphs Review", "DP Review", "Mock Interviews"],
                    goals: "Comprehensive DSA revision, start regular mock interviews",
                    skills: ["Interview Prep", "Problem Solving", "Communication"]
                },
                {
                    week: 22,
                    title: "Behavioral Prep & Resume",
                    topics: ["STAR Method", "Behavioral Questions", "Resume Optimization"],
                    goals: "Master behavioral interviews, update resume with projects",
                    skills: ["Soft Skills", "Personal Branding", "Professional Communication"]
                },
                {
                    week: 23,
                    title: "Job Applications & Networking",
                    topics: ["Job Applications", "LinkedIn Optimization", "Networking"],
                    goals: "Apply to companies, enhance LinkedIn presence, network actively",
                    skills: ["Job Search", "Networking", "Personal Marketing"]
                },
                {
                    week: 24,
                    title: "Final Preparation",
                    topics: ["System Design Review", "AI Concepts", "Final Projects"],
                    goals: "Final review of all concepts, intensive mock interview practice",
                    skills: ["Comprehensive Review", "Interview Excellence", "Confidence Building"]
                }
            ]
        }
    ],
    skills: [
        { name: "Data Structures & Algorithms", category: "DSA", totalTopics: 25 },
        { name: "Web Development", category: "Frontend", totalTopics: 20 },
        { name: "Backend Development", category: "Backend", totalTopics: 18 },
        { name: "React Ecosystem", category: "Frontend", totalTopics: 15 },
        { name: "AI/ML & LLM", category: "AI", totalTopics: 22 },
        { name: "System Design", category: "Architecture", totalTopics: 16 },
        { name: "DevOps & Deployment", category: "Infrastructure", totalTopics: 12 },
        { name: "Interview Skills", category: "Career", totalTopics: 10 }
    ],
    projectIdeas: [
        { title: "E-Commerce Platform", category: "Full-Stack", difficulty: "Advanced", tech: ["React", "Node.js", "MongoDB"] },
        { title: "Job Portal", category: "Full-Stack", difficulty: "Advanced", tech: ["React", "Django", "PostgreSQL"] },
        { title: "Real-Time Chat App", category: "Full-Stack", difficulty: "Intermediate", tech: ["React", "WebSocket", "Node.js"] },
        { title: "AI Chatbot", category: "AI/ML", difficulty: "Advanced", tech: ["LangChain", "OpenAI", "Streamlit"] },
        { title: "Resume Screening AI", category: "AI/ML", difficulty: "Intermediate", tech: ["NLP", "Classification", "Flask"] },
        { title: "URL Shortener", category: "Backend", difficulty: "Intermediate", tech: ["Node.js", "Redis", "Analytics"] },
        { title: "AI Image Generator", category: "AI/ML", difficulty: "Advanced", tech: ["Stable Diffusion", "Python"] },
        { title: "Personal Finance Tracker", category: "Full-Stack", difficulty: "Intermediate", tech: ["React", "Charts", "AI"] }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🟢 DOM Content Loaded - Starting app initialization');
    
    // Initialize main app components
    initializeApp();
    setupEventListeners();
    
    // Initialize user authentication
    console.log('📱 Setting up authentication');
    // Check if BackendUserAuth is available and not already initialized
    if (typeof BackendUserAuth !== 'undefined' && !window.backendUserAuthInstance) {
        userAuth = new BackendUserAuth();
        console.log('✅ Using BackendUserAuth for authentication');
    } else if (window.backendUserAuthInstance) {
        userAuth = window.backendUserAuthInstance;
        console.log('✅ Using existing BackendUserAuth instance');
    } else {
        userAuth = new UserAuth();
        console.log('⚠️ Falling back to UserAuth (BackendUserAuth not available)');
    }
    
    // Initialize robot only when main app is visible
    const mainApp = document.getElementById('mainApp');
    if (mainApp && mainApp.style.display !== 'none') {
        // If main app is already visible, init robot immediately
        setTimeout(() => {
            robot = new RobotCompanion();
        }, 500);
    }
    
    // Watch for when main app becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (mainApp && mainApp.style.display !== 'none' && !robot) {
                    // Initialize robot when main app becomes visible
                    setTimeout(() => {
                        robot = new RobotCompanion();
                    }, 1000);
                }
            }
        });
    });
    
    if (mainApp) {
        observer.observe(mainApp, { attributes: true });
    }
});

function initializeApp() {
    // Ensure we have the latest user data
    userDataManager.refreshUser();
    
    renderGeneralTasks();
    renderDSAProblems();
    renderNeetcodeProblems();
    renderLearningHub();
    updateStats();
    updateAnalytics();
    createParticleEffect();
    
    // Set active tab
    const firstTab = document.querySelector('.nav-tab');
    if (firstTab) {
        switchTab(firstTab.dataset.tab);
    }
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Task form submission
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
    
    // Course form submission
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCourse();
    });
    
    // Modal close on overlay click
    document.getElementById('taskModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeTaskModal();
        }
    });
    
    document.getElementById('courseModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCourseModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTaskModal();
            closeCourseModal();
        }
    });
}

// Tab switching functionality
function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Update analytics when switching to analytics tab
    if (tabName === 'analytics') {
        updateAnalytics();
        renderWeeklyChart();
    }
    
    // Initialize roadmap when switching to roadmap tab
    if (tabName === 'roadmap') {
        initializeRoadmap();
    }
}

// Task management functions
function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('modalTitle');
    
    if (taskId) {
        currentEditingTask = taskId;
        const task = tasks.find(t => t.id === taskId);
        title.textContent = 'Edit Task';
        populateTaskForm(task);
    } else {
        currentEditingTask = null;
        title.textContent = 'Add New Task';
        resetTaskForm();
    }
    
    modal.classList.add('active');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    currentEditingTask = null;
    resetTaskForm();
}

function resetTaskForm() {
    document.getElementById('taskForm').reset();
}

function populateTaskForm(task) {
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskCategory').value = task.category || '';
    
    if (task.deadline) {
        const deadline = new Date(task.deadline);
        const localDateTime = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000);
        document.getElementById('taskDeadline').value = localDateTime.toISOString().slice(0, 16);
    }
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const deadline = document.getElementById('taskDeadline').value;
    const category = document.getElementById('taskCategory').value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const taskData = {
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        category,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    if (currentEditingTask) {
        // Update existing task
        const taskIndex = tasks.findIndex(t => t.id === currentEditingTask);
        tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
    } else {
        // Create new task
        taskData.id = generateId();
        tasks.push(taskData);
    }
    
    saveTasks();
    renderGeneralTasks();
    updateStats();
    closeTaskModal();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderGeneralTasks();
        updateStats();
    }
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderGeneralTasks();
        updateStats();
        updateAnalytics();
    }
}

function renderGeneralTasks() {
    const container = document.getElementById('generalTasks');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks found</h3>
                <p>Add your first task to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
}

function createTaskCard(task) {
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
    const deadlineText = task.deadline ? formatDeadline(task.deadline) : '';
    
    return `
        <div class="task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
            <div class="task-header">
                <div>
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button onclick="toggleTaskComplete('${task.id}')" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button onclick="openTaskModal('${task.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTask('${task.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <div>
                    <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
                    ${task.category ? `<span class="task-category">${task.category}</span>` : ''}
                </div>
                ${deadlineText ? `<div class="task-deadline ${isOverdue ? 'overdue' : ''}">${deadlineText}</div>` : ''}
            </div>
        </div>
    `;
}

function getFilteredTasks() {
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    
    return tasks.filter(task => {
        const statusMatch = statusFilter === 'all' || 
            (statusFilter === 'completed' && task.completed) ||
            (statusFilter === 'pending' && !task.completed) ||
            (statusFilter === 'overdue' && task.deadline && new Date(task.deadline) < new Date() && !task.completed);
        
        const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
        
        return statusMatch && priorityMatch;
    });
}

function filterTasks() {
    renderGeneralTasks();
}

// NeetCode functions
function renderNeetcodeProblems() {
    const container = document.getElementById('neetcodeCategories');
    
    // Check if neetcodeProblems is defined
    if (typeof neetcodeProblems === 'undefined') {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px;"></i>
                <h3>NeetCode data not loaded</h3>
                <p>Please refresh the page to load NeetCode problems.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = Object.entries(neetcodeProblems).map(([category, problems]) => {
        const completedCount = problems.filter(p => neetcodeProgress[p.title]).length;
        const progress = Math.round((completedCount / problems.length) * 100);
        
        return `
            <div class="category-card">
                <div class="category-header">
                    <h3 class="category-title">${category}</h3>
                    <div class="category-progress">${completedCount}/${problems.length} (${progress}%)</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="problems-grid">
                    ${problems.map(problem => createProblemCard(problem)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function createProblemCard(problem) {
    const isCompleted = neetcodeProgress[problem.title];
    
    return `
        <div class="problem-card ${isCompleted ? 'completed' : ''}" onclick="toggleNeetcodeProblem('${problem.title}')">
            <div class="problem-title">${problem.title}</div>
            <div class="problem-meta">
                <span class="problem-difficulty ${problem.difficulty}">${problem.difficulty.toUpperCase()}</span>
                ${isCompleted ? '<i class="fas fa-check-circle" style="color: #28a745; margin-left: 8px;"></i>' : ''}
            </div>
        </div>
    `;
}

function toggleNeetcodeProblem(problemTitle) {
    neetcodeProgress[problemTitle] = !neetcodeProgress[problemTitle];
    
    if (!neetcodeProgress[problemTitle]) {
        delete neetcodeProgress[problemTitle];
    }
    
    saveNeetcodeProgress();
    renderNeetcodeProblems();
    updateStats();
    updateAnalytics();
}

// DSA Functions
function renderDSAProblems() {
    const container = document.getElementById('dsaCategories');
    
    // Check if dsaProblems is defined
    if (typeof dsaProblems === 'undefined') {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px;"></i>
                <h3>DSA data not loaded</h3>
                <p>Please refresh the page to load DSA problems.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = Object.entries(dsaProblems).map(([category, problems]) => {
        const completedCount = problems.filter(p => dsaProgress[p.title]).length;
        const progress = Math.round((completedCount / problems.length) * 100);
        
        return `
            <div class="category-card">
                <div class="category-header">
                    <h3 class="category-title">${category}</h3>
                    <div class="category-progress">${completedCount}/${problems.length} (${progress}%)</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="problems-grid">
                    ${problems.map(problem => createDSAProblemCard(problem)).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    updateDSAProgress();
}

function createDSAProblemCard(problem) {
    const isCompleted = dsaProgress[problem.title];
    
    return `
        <div class="dsa-problem-card ${isCompleted ? 'completed' : ''}">
            <div class="dsa-problem-header">
                <div class="dsa-problem-title">${problem.title}</div>
                <div class="dsa-problem-leetcode">#${problem.leetcode}</div>
            </div>
            <div class="problem-meta">
                <span class="problem-difficulty ${problem.difficulty}">${problem.difficulty.toUpperCase()}</span>
                ${isCompleted ? '<i class="fas fa-check-circle" style="color: #28a745; margin-left: 8px;"></i>' : ''}
            </div>
            <div class="dsa-problem-actions">
                <button class="dsa-btn dsa-btn-leetcode" onclick="window.open('${problem.url}', '_blank')">
                    <i class="fas fa-external-link-alt"></i>
                    LeetCode
                </button>
                <button class="dsa-btn dsa-btn-complete" onclick="toggleDSAProblem('${problem.title}')">
                    <i class="fas ${isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                    ${isCompleted ? 'Undo' : 'Complete'}
                </button>
            </div>
        </div>
    `;
}

function toggleDSAProblem(problemTitle) {
    dsaProgress[problemTitle] = !dsaProgress[problemTitle];
    
    if (!dsaProgress[problemTitle]) {
        delete dsaProgress[problemTitle];
    }
    
    saveDSAProgress();
    renderDSAProblems();
    updateStats();
    updateAnalytics();
}

function updateDSAProgress() {
    // Check if dsaProblems is defined
    if (typeof dsaProblems === 'undefined') {
        return;
    }
    
    const totalProblems = Object.values(dsaProblems).flat().length;
    const completedProblems = Object.keys(dsaProgress).length;
    const percentage = Math.round((completedProblems / totalProblems) * 100);
    
    const progressBar = document.getElementById('dsaProgressBar');
    const progressText = document.getElementById('dsaProgressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completedProblems}/${totalProblems} (${percentage}%)`;
    }
}

// Learning Hub Functions
function renderLearningHub() {
    renderAlgorithms();
    renderLearningResources();
    renderPersonalCourses();
}

function renderAlgorithms() {
    const container = document.getElementById('algorithmsGrid');
    
    // Check if algorithms is defined
    if (typeof algorithms === 'undefined') {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px;"></i>
                <h3>Algorithms data not loaded</h3>
                <p>Please refresh the page to load algorithms list.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = algorithms.map(algorithm => {
        const isCompleted = algorithmsProgress[algorithm.name];
        return `
            <div class="algorithm-card ${isCompleted ? 'completed' : ''}" onclick="toggleAlgorithm('${algorithm.name}')">
                <div class="algorithm-name">${algorithm.name}</div>
                <div class="algorithm-meta">
                    <span class="algorithm-level ${algorithm.level}">${algorithm.level}</span>
                    ${isCompleted ? '<i class="fas fa-check-circle" style="color: #4ecdc4; margin-left: 8px;"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    updateAlgorithmsProgress();
}

function toggleAlgorithm(algorithmName) {
    algorithmsProgress[algorithmName] = !algorithmsProgress[algorithmName];
    
    if (!algorithmsProgress[algorithmName]) {
        delete algorithmsProgress[algorithmName];
    }
    
    saveAlgorithmsProgress();
    renderAlgorithms();
    updateStats();
}

function updateAlgorithmsProgress() {
    // Check if algorithms is defined
    if (typeof algorithms === 'undefined') {
        return;
    }
    
    const totalAlgorithms = algorithms.length;
    const completedAlgorithms = Object.keys(algorithmsProgress).length;
    const percentage = Math.round((completedAlgorithms / totalAlgorithms) * 100);
    
    const progressBar = document.getElementById('algorithmsProgressBar');
    const progressText = document.getElementById('algorithmsProgressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completedAlgorithms}/${totalAlgorithms} (${percentage}%)`;
    }
}

function renderLearningResources() {
    const container = document.getElementById('resourcesGrid');
    
    // Check if learningResources is defined
    if (typeof learningResources === 'undefined') {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px;"></i>
                <h3>Learning resources not loaded</h3>
                <p>Please refresh the page to load resources.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = learningResources.map(resource => `
        <a href="${resource.url}" target="_blank" class="resource-card">
            <div class="resource-header">
                <i class="${resource.icon} resource-icon"></i>
                <div class="resource-name">${resource.name}</div>
            </div>
            <div class="resource-description">${resource.description}</div>
            <div class="resource-category">${resource.category}</div>
        </a>
    `).join('');
}

function renderPersonalCourses() {
    const container = document.getElementById('coursesGrid');
    
    if (personalCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-graduation-cap" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 16px;"></i>
                <h3>No courses added yet</h3>
                <p>Start tracking your learning journey by adding your first course!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = personalCourses.map(course => createCourseCard(course)).join('');
}

function createCourseCard(course) {
    const deadline = course.deadline ? new Date(course.deadline) : null;
    const deadlineText = deadline ? deadline.toLocaleDateString() : 'No deadline';
    const isOverdue = deadline && deadline < new Date();
    
    return `
        <div class="course-card">
            <div class="course-header">
                <div class="course-name">${course.name}</div>
                <div class="course-actions">
                    ${course.url ? `<button onclick="window.open('${course.url}', '_blank')" title="Open Course">
                        <i class="fas fa-external-link-alt"></i>
                    </button>` : ''}
                    <button onclick="openCourseModal('${course.id}')" title="Edit Course">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCourse('${course.id}')" title="Delete Course">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${course.description ? `<div class="course-description">${course.description}</div>` : ''}
            <div class="course-meta">
                <span>Platform: ${course.platform || 'Not specified'}</span>
                <span class="${isOverdue ? 'overdue' : ''}">Target: ${deadlineText}</span>
            </div>
            <div class="course-progress-container">
                <div class="course-progress-bar">
                    <div class="course-progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <div class="course-progress-text">${course.progress}% Complete</div>
            </div>
        </div>
    `;
}

// Course Management
function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('courseModalTitle');
    
    if (courseId) {
        currentEditingCourse = courseId;
        const course = personalCourses.find(c => c.id === courseId);
        title.textContent = 'Edit Course';
        populateCourseForm(course);
    } else {
        currentEditingCourse = null;
        title.textContent = 'Add New Course';
        resetCourseForm();
    }
    
    modal.classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
    currentEditingCourse = null;
    resetCourseForm();
}

function resetCourseForm() {
    document.getElementById('courseForm').reset();
}

function populateCourseForm(course) {
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('coursePlatform').value = course.platform || '';
    document.getElementById('courseProgress').value = course.progress || 0;
    document.getElementById('courseUrl').value = course.url || '';
    
    if (course.deadline) {
        document.getElementById('courseDeadline').value = course.deadline;
    }
}

function saveCourse() {
    const name = document.getElementById('courseName').value.trim();
    const description = document.getElementById('courseDescription').value.trim();
    const platform = document.getElementById('coursePlatform').value.trim();
    const progress = parseInt(document.getElementById('courseProgress').value) || 0;
    const url = document.getElementById('courseUrl').value.trim();
    const deadline = document.getElementById('courseDeadline').value;
    
    if (!name) {
        alert('Please enter a course name');
        return;
    }
    
    const courseData = {
        name,
        description,
        platform,
        progress: Math.min(Math.max(progress, 0), 100),
        url,
        deadline: deadline || null,
        createdAt: new Date().toISOString()
    };
    
    if (currentEditingCourse) {
        const courseIndex = personalCourses.findIndex(c => c.id === currentEditingCourse);
        personalCourses[courseIndex] = { ...personalCourses[courseIndex], ...courseData };
    } else {
        courseData.id = generateId();
        personalCourses.push(courseData);
    }
    
    savePersonalCourses();
    renderPersonalCourses();
    updateStats();
    closeCourseModal();
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        personalCourses = personalCourses.filter(c => c.id !== courseId);
        savePersonalCourses();
        renderPersonalCourses();
        updateStats();
    }
}

// Enhanced animations and effects
function createParticleEffect() {
    const container = document.createElement('div');
    container.className = 'particle-container';
    document.body.appendChild(container);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = Math.random() > 0.5 ? 'particle' : 'particle water';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
        
        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
            }
        }, 12000);
    }
    
    // Create particles less frequently - every 3 seconds instead of every 1 second
    setInterval(createParticle, 3000);
}

// Robot Companion Functionality
class RobotCompanion {
    constructor() {
        this.robot = document.getElementById('robotCompanion');
        this.robotContainer = this.robot.querySelector('.robot-container');
        this.leftEye = document.getElementById('leftEye');
        this.rightEye = document.getElementById('rightEye');
        this.mouth = document.getElementById('robotMouth');
        this.speech = document.getElementById('robotSpeech');
        this.speechContent = document.getElementById('speechContent');
        this.light = document.getElementById('robotLight');
        
        this.currentMood = 'neutral';
        this.soundEnabled = true;
        this.lastInteraction = Date.now();
        this.taskCompletionCount = 0;
        this.userMood = 'neutral'; // Track user's productivity mood
        this.contextAwareMessages = true;
        this.initSounds();
        this.messages = {
            greeting: [
                'Welcome to your productivity journey! �',
                'Ready to crush some goals today? 💪',
                'Hey there, future achiever! ✨',
                'Time to turn dreams into done! 🎯'
            ],
            firstTaskComplete: [
                'Fantastic start! First task down! 🎉',
                'Look at you go! One task completed! ⭐',
                'That\'s the spirit! Keep this energy! 🔥',
                'Amazing! You\'re building momentum! 🚀'
            ],
            taskComplete: [
                'Another one bites the dust! 💥',
                'You\'re on fire today! 🔥',
                'Task conquered! What\'s next? 🎯',
                'Productivity level: BEAST MODE! 💪',
                'That\'s how it\'s done! 👏',
                'You\'re making great progress! �'
            ],
            multipleTasksComplete: [
                'WOW! You\'re absolutely crushing it! 🌟',
                'Multiple tasks down! You\'re unstoppable! 🚀',
                'This is what peak performance looks like! �',
                'I\'m so proud of your progress! 👑'
            ],
            taskAdd: [
                'New challenge accepted! �',
                'I love seeing you plan ahead! 🗂️',
                'Another goal to conquer! Let\'s do this! 🎯',
                'Great minds think and plan! 🧠',
                'Adding fuel to your productivity fire! 🔥'
            ],
            problemSolved: [
                'Code ninja in action! �',
                'That algorithm didn\'t stand a chance! 💻',
                'Your coding skills are evolving! 📈',
                'LeetCode problem = SOLVED! ✅',
                'Brain power level: MAXIMUM! 🧠⚡'
            ],
            encouragement: [
                'Don\'t stop now, you\'ve got this! 💪',
                'Every small step counts! 👣',
                'Progress over perfection! 🌱',
                'You\'re closer than you think! 🎯',
                'Believe in yourself like I believe in you! ✨'
            ],
            longBreak: [
                'Hey! Miss me? Let\'s get back to work! �',
                'Welcome back! Ready to be productive? 🚀',
                'I was starting to worry! Let\'s code! 💻',
                'Time to turn potential into progress! ⚡'
            ],
            struggling: [
                'Taking your time? That\'s smart! 🤔',
                'Quality over speed, always! 👍',
                'Deep thinking leads to great solutions! 🧠',
                'I\'m here if you need a motivation boost! 💪'
            ],
            celebration: [
                'CELEBRATION TIME! �🎊',
                'You\'ve earned this victory dance! �',
                'Outstanding achievement unlocked! 🏆',
                'This calls for a happy dance! �'
            ],
            thinking: [
                'Hmm, let me process this... 🤔',
                'Interesting choice! 🧐',
                'Calculating optimal encouragement... ⚙️',
                'Analyzing your awesome progress... 📊'
            ],
            confused: [
                'Wait, what just happened? �',
                'My circuits are a bit puzzled... 🤨',
                'That\'s... unexpected! 🤔',
                'Error 404: Logic not found! �'
            ],
            happy: [
                'I\'m so happy to see you succeed! 😄',
                'This energy is contagious! ✨',
                'Your success makes my LEDs glow brighter! 💡',
                'Happiness.exe is running at 100%! 😊'
            ],
            sad: [
                'Aww, don\'t worry, we all have tough days... 💙',
                'It\'s okay to take breaks, you know! 🫂',
                'Tomorrow is a fresh start! 🌅',
                'I believe in your comeback story! 💪'
            ],
            timeOfDay: {
                morning: [
                    'Good morning, champion! ☀️',
                    'Early bird gets the code! �',
                    'Morning productivity mode: ACTIVATED! ⚡',
                    'Fresh day, fresh possibilities! 🌅'
                ],
                afternoon: [
                    'Afternoon power session! �',
                    'Keep that momentum going! 🚀',
                    'Midday motivation boost! ⚡',
                    'You\'re doing great this afternoon! ☀️'
                ],
                evening: [
                    'Evening coding session? I like it! 🌙',
                    'Night owl mode activated! 🦉',
                    'Burning the midnight oil! �️',
                    'Late night productivity! 🌟'
                ]
            }
        };
        
        this.init();
    }
    
    initSounds() {
        // Create audio context for Web Audio API sounds
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playSound(type, frequency = 440, duration = 200) {
        // Sound effects disabled for better user experience
        return;
    }
    
    init() {
        this.setupEventListeners();
        
        // Check if robot elements exist before initializing behaviors
        if (this.robot && this.robotContainer) {
            this.startIdleAnimation();
            this.greet();
        } else {
            console.warn('Robot elements not found. Retrying in 1 second...');
            setTimeout(() => {
                this.robot = document.getElementById('robotCompanion');
                this.robotContainer = this.robot ? this.robot.querySelector('.robot-container') : null;
                if (this.robot && this.robotContainer) {
                    this.startIdleAnimation();
                    this.greet();
                }
            }, 1000);
        }
    }
    
    setupEventListeners() {
        // Enhanced task completion tracking
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dsa-btn-complete') || e.target.closest('.task-actions button[title*="complete"]')) {
                this.handleTaskCompletion();
            }
            
            if (e.target.closest('.btn-primary')) {
                this.handleTaskAddition();
            }
            
            if (e.target.closest('.dsa-btn-leetcode')) {
                this.handleProblemSolving();
            }
            
            if (e.target.closest('.nav-tab')) {
                this.handleTabSwitch(e.target.textContent);
            }
        });
        
        // More interactive robot behavior
        this.robotContainer.addEventListener('mouseenter', () => {
            this.handleMouseHover();
        });
        
        this.robotContainer.addEventListener('click', () => {
            this.handleRobotClick();
        });
        
        // Track user activity for context
        this.trackUserActivity();
        
        // Smart encouragement system
        this.startSmartEncouragement();
    }
    
    handleTaskCompletion() {
        this.taskCompletionCount++;
        this.lastInteraction = Date.now();
        
        if (this.taskCompletionCount === 1) {
            this.celebrate('firstTaskComplete');
        } else if (this.taskCompletionCount % 5 === 0) {
            this.celebrate('multipleTasksComplete');
        } else {
            this.celebrate('taskComplete');
        }
        
        this.updateUserMood('productive');
    }
    
    handleTaskAddition() {
        this.setMood('happy');
        this.say(this.getContextualMessage('taskAdd'));
        this.playSound('happy');
        this.lastInteraction = Date.now();
    }
    
    handleProblemSolving() {
        this.celebrate('problemSolved');
        this.updateUserMood('focused');
    }
    
    handleTabSwitch(tabName) {
        const messages = {
            'General Tasks': 'Time to tackle those tasks! 📝',
            'DSA Problems': 'Ready to flex those coding muscles? 💪',
            'NeetCode 150': 'LeetCode challenge mode activated! 🔥',
            'Learning Hub': 'Learning never stops! 📚',
            'Analytics': 'Let\'s see those amazing stats! 📊'
        };
        
        const message = messages[tabName] || this.getContextualMessage('thinking');
        this.say(message);
        this.setMood('thinking');
        this.playSound('thinking');
    }
    
    handleMouseHover() {
        const timeSinceLastInteraction = Date.now() - this.lastInteraction;
        
        if (timeSinceLastInteraction > 300000) { // 5 minutes
            this.say(this.getContextualMessage('longBreak'));
        } else {
            this.contextualReaction();
        }
    }
    
    handleRobotClick() {
        const responses = [
            'Need some motivation? You\'ve got this! 💪',
            'Click me anytime for a pep talk! 😊',
            'I\'m here to keep you motivated! 🚀',
            'Your personal cheerleader reporting for duty! 🎉',
            'Remember: progress over perfection! ✨'
        ];
        
        this.say(responses[Math.floor(Math.random() * responses.length)]);
        this.setMood('happy');
        this.playSound('happy');
    }
    
    trackUserActivity() {
        let inactiveTime = 0;
        
        // Reset timer on user activity
        document.addEventListener('mousemove', () => {
            inactiveTime = 0;
            this.lastInteraction = Date.now();
        });
        
        document.addEventListener('keypress', () => {
            inactiveTime = 0;
            this.lastInteraction = Date.now();
        });
        
        // Check for inactivity
        setInterval(() => {
            inactiveTime++;
            
            if (inactiveTime > 300) { // 5 minutes of inactivity
                this.handleInactivity();
                inactiveTime = 0;
            }
        }, 1000);
    }
    
    handleInactivity() {
        if (!this.speech.classList.contains('show')) {
            const encouragements = [
                'Still there? Let\'s keep the momentum! 🚀',
                'Ready to tackle another task? 💪',
                'I believe in you! Let\'s get back to it! ✨',
                'Your goals are waiting! 🎯'
            ];
            
            this.say(encouragements[Math.floor(Math.random() * encouragements.length)]);
            this.setMood('encouraging');
        }
    }
    
    startSmartEncouragement() {
        setInterval(() => {
            const timeSinceLastInteraction = Date.now() - this.lastInteraction;
            
            // Smart encouragement based on user behavior
            if (timeSinceLastInteraction > 600000) { // 10 minutes
                if (Math.random() < 0.3) { // 30% chance
                    this.smartEncouragement();
                }
            }
        }, 60000); // Check every minute
    }
    
    smartEncouragement() {
        if (this.speech.classList.contains('show')) return;
        
        const hour = new Date().getHours();
        let timeBasedMessage;
        
        if (hour < 12) {
            timeBasedMessage = this.getRandomMessage('timeOfDay.morning');
        } else if (hour < 18) {
            timeBasedMessage = this.getRandomMessage('timeOfDay.afternoon');
        } else {
            timeBasedMessage = this.getRandomMessage('timeOfDay.evening');
        }
        
        this.say(timeBasedMessage);
        this.setMood('happy');
        this.playSound('greeting');
    }
    
    updateUserMood(mood) {
        this.userMood = mood;
        // Adjust robot behavior based on user mood
        this.adaptToUserMood();
    }
    
    adaptToUserMood() {
        switch(this.userMood) {
            case 'productive':
                this.contextAwareMessages = true;
                break;
            case 'struggling':
                // More encouraging, less frequent
                break;
            case 'focused':
                // Less interruptions
                break;
        }
    }
    
    contextualReaction() {
        const reactions = [
            { mood: 'happy', message: this.getContextualMessage('happy') },
            { mood: 'thinking', message: this.getContextualMessage('thinking') },
            { mood: 'surprised', message: 'Oh, hello there! 👋' }
        ];
        
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        this.setMood(reaction.mood);
        
        if (Math.random() < 0.7) { // 70% chance to say something
            this.say(reaction.message);
        }
    }
    
    getContextualMessage(type) {
        const hour = new Date().getHours();
        const taskCount = this.taskCompletionCount;
        
        // Add context based on time and user progress
        let messageType = type;
        
        if (type === 'encouragement' && taskCount === 0) {
            messageType = 'struggling';
        }
        
        if (type === 'greeting' && hour < 12) {
            return this.getRandomMessage('timeOfDay.morning');
        }
        
        return this.getRandomMessage(messageType);
    }
    
    greet() {
        setTimeout(() => {
            this.say(this.getRandomMessage('greeting'));
            this.setMood('happy');
            this.playSound('greeting');
        }, 2000);
    }
    
    celebrate(type = 'celebration') {
        this.robotContainer.classList.add('excited');
        this.setMood('happy');
        this.say(this.getRandomMessage(type));
        this.playSound('celebration');
        this.light.style.background = 'radial-gradient(circle, #f9ca24, #f0932b)';
        
        setTimeout(() => {
            this.robotContainer.classList.remove('excited');
            this.light.style.background = 'radial-gradient(circle, #4ecdc4, #45b7d1)';
        }, 1000);
    }
    
    react(type) {
        switch(type) {
            case 'taskAdd':
                this.setMood('happy');
                this.say(this.getRandomMessage('taskAdd'));
                this.playSound('happy');
                break;
            case 'problemSolved':
                this.celebrate('problemSolved');
                break;
            case 'thinking':
                this.setMood('thinking');
                this.say(this.getRandomMessage('thinking'));
                this.playSound('thinking');
                break;
            case 'encouragement':
                this.setMood('happy');
                this.say(this.getRandomMessage('encouragement'));
                this.playSound('happy');
                break;
            default:
                this.randomReaction();
        }
    }
    
    randomReaction() {
        const reactions = ['happy', 'thinking', 'surprised'];
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        this.setMood(reaction);
        
        if (Math.random() < 0.7) { // 70% chance to say something
            this.randomMessage();
        }
    }
    
    randomMessage() {
        const messageTypes = ['happy', 'encouragement', 'thinking'];
        const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
        this.say(this.getRandomMessage(type));
    }
    
    setMood(mood) {
        this.currentMood = mood;
        
        // Reset all mood classes
        this.leftEye.classList.remove('happy', 'blink', 'confused');
        this.rightEye.classList.remove('happy', 'blink', 'confused');
        this.mouth.classList.remove('happy', 'sad', 'surprised');
        this.robotContainer.classList.remove('thinking', 'sad');
        
        switch(mood) {
            case 'happy':
                this.leftEye.classList.add('happy');
                this.rightEye.classList.add('happy');
                this.mouth.classList.add('happy');
                break;
            case 'sad':
                this.mouth.classList.add('sad');
                this.robotContainer.classList.add('sad');
                break;
            case 'surprised':
                this.mouth.classList.add('surprised');
                this.blink();
                break;
            case 'thinking':
                this.robotContainer.classList.add('thinking');
                this.leftEye.classList.add('confused');
                this.rightEye.classList.add('confused');
                break;
            case 'confused':
                this.leftEye.classList.add('confused');
                this.rightEye.classList.add('confused');
                this.mouth.classList.add('surprised');
                break;
        }
    }
    
    blink() {
        this.leftEye.classList.add('blink');
        this.rightEye.classList.add('blink');
        
        setTimeout(() => {
            this.leftEye.classList.remove('blink');
            this.rightEye.classList.remove('blink');
        }, 150);
    }
    
    startIdleAnimation() {
        // Random blinking
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                this.blink();
            }
        }, 3000);
        
        // Random mood changes when idle
        setInterval(() => {
            if (Math.random() < 0.2 && !this.speech.classList.contains('show')) { // 20% chance when not speaking
                const moods = ['neutral', 'thinking', 'happy'];
                const mood = moods[Math.floor(Math.random() * moods.length)];
                this.setMood(mood);
            }
        }, 10000);
    }
    
    say(message, duration = 3000) {
        this.speechContent.textContent = message;
        this.speech.classList.add('show');
        
        setTimeout(() => {
            this.speech.classList.remove('show');
        }, duration);
    }
    
    getRandomMessage(type) {
        let messages;
        
        // Handle nested objects like 'timeOfDay.morning'
        if (type.includes('.')) {
            const parts = type.split('.');
            messages = this.messages[parts[0]][parts[1]];
        } else {
            messages = this.messages[type];
        }
        
        // Fallback to greeting if type doesn't exist
        if (!messages || !Array.isArray(messages)) {
            messages = this.messages.greeting;
        }
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Initialize robot companion
let robot;

// User Authentication System
class UserAuth {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('taskTrackerUsers')) || {};
        
        // Check storage and cleanup if needed
        this.checkStorageQuota();
        if (!this.checkStorageQuota()) {
            this.cleanupOldData();
        }
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkExistingLogin();
    }
    
    setupEventListeners() {
        // Auth buttons for landing page (only if they exist)
        const showSignInBtn = document.getElementById('showSignInBtn');
        const showSignUpBtn = document.getElementById('showSignUpBtn');
        
        if (showSignInBtn) showSignInBtn.addEventListener('click', () => this.showSignInModal());
        if (showSignUpBtn) showSignUpBtn.addEventListener('click', () => this.showSignUpModal());
        
        // Original auth buttons in header (for when logged in)
        const signInBtn = document.getElementById('signInBtn');
        const signUpBtn = document.getElementById('signUpBtn');
        
        if (signInBtn) signInBtn.addEventListener('click', () => this.showSignInModal());
        if (signUpBtn) signUpBtn.addEventListener('click', () => this.showSignUpModal());
        
        // User menu and logout
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) userMenuBtn.addEventListener('click', () => this.showUserMenu());
        
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) signOutBtn.addEventListener('click', () => this.signOut());
        
        // Close buttons for modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.hideModals());
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModals();
                }
            });
        });

        // Form submissions - check if forms exist first
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('signUpForm');
        const profileForm = document.getElementById('profileForm');
        
        if (signInForm) signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        if (signUpForm) signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
        if (profileForm) profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        
        // Modal switching
        const switchToSignUp = document.getElementById('switchToSignUp');
        const switchToSignIn = document.getElementById('switchToSignIn');
        
        if (switchToSignUp) {
            switchToSignUp.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
                this.showSignUpModal();
            });
        }
        
        if (switchToSignIn) {
            switchToSignIn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
                this.showSignInModal();
            });
        }
        
        // Avatar upload
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const avatarUpload = document.getElementById('avatarUpload');
        
        if (changeAvatarBtn && avatarUpload) {
            changeAvatarBtn.addEventListener('click', () => {
                avatarUpload.click();
            });
            avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }
        
        // Settings - check if elements exist
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (robot) {
                    robot.soundEnabled = e.target.checked;
                }
                this.saveUserSettings();
            });
        }
        
        // Close modals
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => this.hideModals());
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModals();
            }
        });
    }
    
    checkExistingLogin() {
        // Auth is now handled by api-service.js and auth-common.js
        console.log('🔍 Script.js checking for existing login...');
        
        // Check both sessionStorage (new) and localStorage (migration) 
        const token = sessionStorage.getItem('productivefire_token') || localStorage.getItem('productivefire_token');
        const userData = sessionStorage.getItem('productivefire_user') || localStorage.getItem('productivefire_user');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('✅ User data loaded:', this.currentUser);
                this.showMainApp();
                this.updateUserStats();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.showMainApp(); // Show app anyway
            }
        } else {
            console.log('⚠️ No user authentication found in script.js');
            // Don't redirect - let auth-common.js handle it
            this.showMainApp(); // Show app anyway, auth will be handled by api-service.js
        }
    }
    
    showMainApp() {
        document.getElementById('mainApp').style.display = 'block';
        
        // Reinitialize user data manager with the new user
        userDataManager.initializeUser();
        
        // Reload user-specific data
        tasks = userDataManager.getUserData('tasks', []);
        neetcodeProgress = userDataManager.getUserData('neetcodeProgress', {});
        dsaProgress = userDataManager.getUserData('dsaProgress', {});
        algorithmsProgress = userDataManager.getUserData('algorithmsProgress', {});
        personalCourses = userDataManager.getUserData('personalCourses', []);
        
        // Re-render everything with user-specific data
        initializeApp();
        
        this.showUserProfile();
    }
    
    showSignInModal() {
        document.getElementById('signInModal').style.display = 'block';
    }
    
    showSignUpModal() {
        document.getElementById('signUpModal').style.display = 'block';
    }
    
    showUserMenu() {
        const userMenuModal = document.getElementById('userMenuModal');
        userMenuModal.classList.remove('closing'); // Remove any closing class
        userMenuModal.classList.add('active'); // Use class instead of inline style
        userMenuModal.style.display = 'flex'; // Ensure flex display
        this.populateUserMenu();
    }
    
    hideModals() {
        const userMenuModal = document.getElementById('userMenuModal');
        
        // Special handling for user menu modal with explode animation
        if (userMenuModal && (userMenuModal.classList.contains('active') || userMenuModal.style.display !== 'none')) {
            userMenuModal.classList.add('closing');
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                userMenuModal.style.display = 'none';
                userMenuModal.classList.remove('closing', 'active');
            }, 400); // Match animation duration
        }
        
        // Hide other modals immediately
        document.querySelectorAll('.modal:not(#userMenuModal)').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
    }
    
    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;
        
        // Simple validation (in production, use proper authentication)
        const user = this.users[email];
        if (user && user.password === password) {
            this.currentUser = user;
            this.currentUser.lastLogin = new Date().toISOString();
            this.updateStreak();
            localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            
            this.showMainApp();
            this.hideModals();
            
            // Welcome message after app loads
            setTimeout(() => {
                if (robot) {
                    robot.say(`Welcome back, ${user.name}! Ready to be productive? 🎉`);
                    robot.celebrate();
                }
            }, 1000);
            
        } else {
            alert('Invalid email or password');
        }
    }
    
    async handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpPasswordConfirm').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (this.users[email]) {
            alert('User already exists');
            return;
        }
        
        const newUser = {
            name,
            email,
            password, // In production, hash this!
            avatar: null,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            streak: 1,
            settings: {
                soundEnabled: true,
                notificationsEnabled: true
            }
        };
        
        this.users[email] = newUser;
        localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
        
        this.showMainApp();
        this.hideModals();
        
        // Welcome new user
        setTimeout(() => {
            if (robot) {
                robot.say(`Welcome to ProductiveFire, ${name}! Let's build great habits together! 🚀`);
                robot.celebrate();
            }
        }, 1000);
    }
    
    handleProfileUpdate(e) {
        e.preventDefault();
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        
        // Validate inputs
        if (!name.trim()) {
            alert('Please enter a valid name');
            return;
        }
        
        if (!email.trim() || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        
        try {
            const oldEmail = this.currentUser.email;
            this.currentUser.name = name;
            this.currentUser.email = email;
            
            // Update in users database
            if (oldEmail !== email) {
                delete this.users[oldEmail];
            }
            this.users[email] = this.currentUser;
            
            localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
            localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            
            this.showUserProfile();
            this.hideModals();
            
            if (robot) {
                robot.say('Profile updated! ✅');
                robot.react('happy');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('Failed to update profile. Storage quota may be exceeded.');
        }
    }
    
    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Please select an image smaller than 2MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Compress image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions (max 150x150)
                    const maxSize = 150;
                    let { width, height } = img;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedData = canvas.toDataURL('image/jpeg', 0.8);
                    
                    try {
                        this.currentUser.avatar = compressedData;
                        localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                        this.users[this.currentUser.email] = this.currentUser;
                        localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
                        this.updateAvatarDisplay();
                        
                        if (robot) {
                            robot.say('Avatar updated! Looking good! 📸');
                            robot.react('happy');
                        }
                    } catch (error) {
                        console.error('Storage error:', error);
                        alert('Failed to save avatar. Storage quota exceeded. Please try a smaller image.');
                        // Reset file input
                        e.target.value = '';
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Storage management
    checkStorageQuota() {
        try {
            const used = JSON.stringify(localStorage).length;
            const maxSize = 5 * 1024 * 1024; // 5MB estimate for localStorage
            
            if (used > maxSize * 0.9) { // 90% full
                console.warn('Storage is nearly full. Consider clearing old data.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Storage check failed:', error);
            return false;
        }
    }
    
    cleanupOldData() {
        try {
            // Remove old temporary data
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('temp_') || key.includes('cache_'))) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // If still too full, offer to reset avatar data
            if (!this.checkStorageQuota()) {
                const resetAvatars = confirm(
                    'Storage is full. Would you like to clear avatar data to free up space? This will reset all user avatars.'
                );
                
                if (resetAvatars) {
                    // Remove all avatar data
                    Object.keys(this.users).forEach(email => {
                        if (this.users[email].avatar) {
                            delete this.users[email].avatar;
                        }
                    });
                    
                    if (this.currentUser && this.currentUser.avatar) {
                        delete this.currentUser.avatar;
                        localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                    }
                    
                    localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
                    
                    if (robot) {
                        robot.say('Storage cleaned! Avatars reset. 🧹');
                    }
                }
            }
            
            if (robot && keysToRemove.length > 0) {
                robot.say(`Cleaned up ${keysToRemove.length} temporary files! 🧹`);
            }
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastLogin = new Date(this.currentUser.lastLogin).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === today) {
            // Same day, no change
            return;
        } else if (lastLogin === yesterday.toDateString()) {
            // Consecutive day
            this.currentUser.streak++;
        } else {
            // Streak broken
            this.currentUser.streak = 1;
        }
    }
    
    showUserProfile() {
        // Hide auth section if it exists (for pages that have it)
        const userNotSignedIn = document.getElementById('userNotSignedIn');
        if (userNotSignedIn) {
            userNotSignedIn.style.display = 'none';
        }
        
        // Show user info
        const userSignedIn = document.getElementById('userSignedIn');
        if (userSignedIn) {
            userSignedIn.style.display = 'flex';
        }
        
        // Check if currentUser exists before accessing properties
        if (!this.currentUser) {
            console.warn('No current user data available for profile display');
            return;
        }
        
        const userName = document.getElementById('userName');
        if (userName && this.currentUser.name) {
            userName.textContent = this.currentUser.name;
        }
        
        const userStreak = document.getElementById('userStreak');
        if (userStreak) {
            const streak = this.currentUser.streak || 0;
            userStreak.textContent = `🔥 ${streak} day streak`;
        }
        
        this.updateAvatarDisplay();
    }
    
    updateAvatarDisplay() {
        const avatar = document.getElementById('userAvatar');
        const initials = document.getElementById('userInitials');
        
        if (!avatar || !initials) {
            console.warn('Avatar elements not found in DOM');
            return;
        }
        
        if (!this.currentUser || !this.currentUser.name) {
            console.warn('No current user data available for avatar display');
            // Set default initials
            initials.textContent = '??';
            avatar.style.display = 'none';
            initials.style.display = 'flex';
            return;
        }
        
        if (this.currentUser.avatar) {
            avatar.src = this.currentUser.avatar;
            avatar.style.display = 'block';
            avatar.style.visibility = 'visible';
            avatar.style.opacity = '1';
            initials.style.display = 'none';
        } else {
            const userInitials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            initials.textContent = userInitials;
            avatar.style.display = 'none';
            initials.style.display = 'flex';
            initials.style.visibility = 'visible';
            initials.style.opacity = '1';
        }
        
        // Also update the profile display
        this.populateUserMenu();
    }
    
    populateUserMenu() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const soundToggle = document.getElementById('soundToggle');
        
        if (!this.currentUser) {
            console.warn('No current user data available for user menu');
            return;
        }
        
        if (!profileName || !profileEmail) {
            console.warn('Profile form elements not found in DOM');
            return;
        }
        
        // Populate form fields with current user data
        profileName.value = this.currentUser.name || '';
        profileEmail.value = this.currentUser.email || '';
        
        // Make sure form elements are visible and styled
        profileName.style.visibility = 'visible';
        profileName.style.opacity = '1';
        profileEmail.style.visibility = 'visible';
        profileEmail.style.opacity = '1';
        
        // Handle optional elements
        if (soundToggle) {
            soundToggle.checked = this.currentUser.settings?.soundEnabled ?? true;
        }
        
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.currentUser.settings?.notificationsEnabled ?? true;
        }
        
        console.log('✅ User menu populated with:', {
            name: this.currentUser.name,
            email: this.currentUser.email
        });
        
        // Update large avatar
        const avatarLarge = document.getElementById('profileAvatarLarge');
        const initialsLarge = document.getElementById('profileInitialsLarge');
        
        if (avatarLarge && initialsLarge) {
            if (this.currentUser.avatar) {
                avatarLarge.src = this.currentUser.avatar;
                avatarLarge.style.display = 'block';
                avatarLarge.style.visibility = 'visible';
                avatarLarge.style.opacity = '1';
                initialsLarge.style.display = 'none';
            } else {
                const userInitials = this.currentUser.name ? 
                    this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                    '??';
                initialsLarge.textContent = userInitials;
                avatarLarge.style.display = 'none';
                initialsLarge.style.display = 'flex';
                initialsLarge.style.visibility = 'visible';
                initialsLarge.style.opacity = '1';
            }
        }
        
        // Make sure the change avatar button is visible
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        if (changeAvatarBtn) {
            changeAvatarBtn.style.visibility = 'visible';
            changeAvatarBtn.style.opacity = '1';
        }
    }
    
    saveUserSettings() {
        if (!this.currentUser) return;
        
        const soundToggle = document.getElementById('soundToggle');
        const notificationsToggle = document.getElementById('notificationsToggle');
        
        this.currentUser.settings = {
            soundEnabled: soundToggle ? soundToggle.checked : true,
            notificationsEnabled: notificationsToggle ? notificationsToggle.checked : true
        };
        
        localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
        this.users[this.currentUser.email] = this.currentUser;
        localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
    }
    
    updateUserStats() {
        // This would integrate with your existing task tracking
        // For now, just ensure the stats are visible
    }
    
    signOut() {
        console.log('🚪 Script.js signOut called...');
        
        // Clear all authentication data
        sessionStorage.removeItem('productivefire_token');
        sessionStorage.removeItem('productivefire_user');
        sessionStorage.removeItem('taskTrackerCurrentUser');
        sessionStorage.removeItem('authToken');
        
        localStorage.removeItem('productivefire_token');
        localStorage.removeItem('productivefire_user');
        localStorage.removeItem('taskTrackerCurrentUser');
        localStorage.removeItem('authToken');
        
        this.currentUser = null;
        
        this.hideModals();
        
        if (robot) {
            robot.say('Thanks for being productive! See you soon! 👋');
            robot.setMood('sad');
        }
        
        console.log('✅ All user data cleared, redirecting to home...');
        
        // Redirect to home page
        window.location.href = 'home.html';
    }
}

// Initialize user authentication
let userAuth;

// Statistics and Analytics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // Update header stats
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    
    // Update DSA progress in header (safer approach)
    if (typeof dsaProblems !== 'undefined') {
        const completedDSA = Object.keys(dsaProgress).length;
        const totalDSAProblems = Object.values(dsaProblems).flat().length;
        document.getElementById('neetcodeProgress').textContent = `${completedDSA}/${totalDSAProblems}`;
    } else {
        document.getElementById('neetcodeProgress').textContent = '0/0';
    }
    
    // Update NeetCode progress bar
    if (typeof neetcodeProblems !== 'undefined') {
        const totalNeetcodeProblems = Object.values(neetcodeProblems).flat().length;
        const completedNeetcode = Object.keys(neetcodeProgress).length;
        const neetcodePercentage = Math.round((completedNeetcode / totalNeetcodeProblems) * 100);
        
        const progressBar = document.getElementById('neetcodeProgressBar');
        const progressText = document.getElementById('neetcodeProgressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${neetcodePercentage}%`;
            progressText.textContent = `${completedNeetcode}/150 (${neetcodePercentage}%)`;
        }
    }
    
    // Update DSA progress
    updateDSAProgress();
    updateAlgorithmsProgress();
}

// Throttle analytics updates to prevent lag
let analyticsUpdateTimeout = null;
const ANALYTICS_UPDATE_DELAY = 300; // 300ms delay

function updateAnalytics() {
    // Clear any pending analytics update
    if (analyticsUpdateTimeout) {
        clearTimeout(analyticsUpdateTimeout);
    }
    
    // Throttle the actual update
    analyticsUpdateTimeout = setTimeout(() => {
        updateAnalyticsImmediate();
        analyticsUpdateTimeout = null;
    }, ANALYTICS_UPDATE_DELAY);
}

function updateAnalyticsImmediate() {
    try {
        console.log('📊 Updating analytics...');
        
        // Ensure we have valid data arrays
        const validTasks = Array.isArray(tasks) ? tasks : [];
        const validDsaProgress = typeof dsaProgress === 'object' && dsaProgress !== null ? dsaProgress : {};
        
        const totalTasks = validTasks.length;
        const completedTasks = validTasks.filter(t => t.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const upcomingDeadlines = validTasks.filter(t => {
            if (!t.deadline || t.completed) return false;
            const deadline = new Date(t.deadline);
            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return deadline >= now && deadline <= sevenDaysFromNow;
        }).length;
        
        // Calculate combined progress (DSA + NeetCode + Algorithms)
        let totalDSAProblems = 0;
        if (typeof dsaProblems === 'object' && dsaProblems !== null) {
            totalDSAProblems = Object.values(dsaProblems).flat().length;
        }
        const completedDSA = Object.keys(validDsaProgress).length;
        const dsaPercentage = totalDSAProblems > 0 ? Math.round((completedDSA / totalDSAProblems) * 100) : 0;
        
        // Calculate daily streak
        const streak = calculateDailyStreak();
        
        console.log('📊 Analytics data:', { completionRate, streak, upcomingDeadlines, dsaPercentage, totalTasks, completedTasks });
        
        // Update DOM elements with error checking
        const elements = {
            completionRate: document.getElementById('completionRate'),
            dailyStreak: document.getElementById('dailyStreak'),
            upcomingDeadlines: document.getElementById('upcomingDeadlines'),
            neetcodeMetric: document.getElementById('neetcodeMetric')
        };
        
        console.log('🔍 Analytics DOM elements found:', {
            completionRate: !!elements.completionRate,
            dailyStreak: !!elements.dailyStreak,
            upcomingDeadlines: !!elements.upcomingDeadlines,
            neetcodeMetric: !!elements.neetcodeMetric
        });
        
        // Safely update each element
        if (elements.completionRate) {
            elements.completionRate.textContent = `${completionRate}%`;
            console.log('✅ Updated completionRate to:', `${completionRate}%`);
        } else {
            console.warn('❌ completionRate element not found');
        }
        
        if (elements.dailyStreak) {
            elements.dailyStreak.textContent = streak;
            console.log('✅ Updated dailyStreak to:', streak);
        } else {
            console.warn('❌ dailyStreak element not found');
        }
        
        if (elements.upcomingDeadlines) {
            elements.upcomingDeadlines.textContent = upcomingDeadlines;
            console.log('✅ Updated upcomingDeadlines to:', upcomingDeadlines);
        } else {
            console.warn('❌ upcomingDeadlines element not found');
        }
        
        if (elements.neetcodeMetric) {
            elements.neetcodeMetric.textContent = `${dsaPercentage}%`;
            console.log('✅ Updated neetcodeMetric to:', `${dsaPercentage}%`);
        } else {
            console.warn('❌ neetcodeMetric element not found');
        }
        
        // Update category breakdown if function exists
        if (typeof renderCategoryBreakdown === 'function') {
            renderCategoryBreakdown();
        }
        
        console.log('✅ Analytics updated successfully');
    } catch (error) {
        console.error('❌ Error updating analytics:', error);
        
        // Set default values if update fails
        const fallbackElements = {
            completionRate: document.getElementById('completionRate'),
            dailyStreak: document.getElementById('dailyStreak'),
            upcomingDeadlines: document.getElementById('upcomingDeadlines'),
            neetcodeMetric: document.getElementById('neetcodeMetric')
        };
        
        if (fallbackElements.completionRate) fallbackElements.completionRate.textContent = '0%';
        if (fallbackElements.dailyStreak) fallbackElements.dailyStreak.textContent = '0';
        if (fallbackElements.upcomingDeadlines) fallbackElements.upcomingDeadlines.textContent = '0';
        if (fallbackElements.neetcodeMetric) fallbackElements.neetcodeMetric.textContent = '0%';
    }
}

function calculateDailyStreak() {
    try {
        const validTasks = Array.isArray(tasks) ? tasks : [];
        const completedTasks = validTasks.filter(t => t.completed && t.completedAt);
        if (completedTasks.length === 0) return 0;
        
        // Sort by completion date
        completedTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        
        let streak = 0;
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        
        // Check if there's any task completed today or yesterday
        const recentCompletion = completedTasks.find(t => {
            const completedDate = new Date(t.completedAt);
            return isSameDay(completedDate, today) || isSameDay(completedDate, yesterday);
        });
        
        if (!recentCompletion) return 0;
        
        // Count consecutive days with completions
        let currentDate = new Date(today);
        
        for (let i = 0; i < 30; i++) { // Check last 30 days max
            const hasCompletionOnDay = completedTasks.some(t => 
                isSameDay(new Date(t.completedAt), currentDate)
            );
            
            if (hasCompletionOnDay) {
                streak++;
            } else {
                // Allow one day gap (yesterday to today)
                if (i === 0 && !isSameDay(currentDate, today)) {
                    currentDate.setDate(currentDate.getDate() - 1);
                    continue;
                }
                break;
            }
            
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    } catch (error) {
        console.error('Error calculating daily streak:', error);
        return 0;
    }
}

function renderCategoryBreakdown() {
    try {
        const validTasks = Array.isArray(tasks) ? tasks : [];
        const categories = {};
        
        validTasks.forEach(task => {
            const category = task.category || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = { total: 0, completed: 0 };
            }
            categories[category].total++;
            if (task.completed) categories[category].completed++;
        });
        
        const container = document.getElementById('categoryBreakdown');
        if (!container) {
            console.warn('Category breakdown container not found');
            return;
        }
        
        container.innerHTML = Object.entries(categories).map(([category, stats]) => {
            const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            return `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 500;">${category}</span>
                        <span style="color: #666;">${stats.completed}/${stats.total} (${percentage}%)</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: #f1f1f1; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: linear-gradient(135deg, #667eea, #764ba2);"></div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering category breakdown:', error);
    }
}

function renderWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple bar chart for last 7 days
    const days = getLast7Days();
    const completionData = days.map(day => {
        return tasks.filter(t => t.completed && t.completedAt && isSameDay(new Date(t.completedAt), day)).length;
    });
    
    const maxValue = Math.max(...completionData, 1);
    const barWidth = canvas.width / days.length - 10;
    const barMaxHeight = canvas.height - 40;
    
    ctx.fillStyle = '#667eea';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    
    days.forEach((day, index) => {
        const barHeight = (completionData[index] / maxValue) * barMaxHeight;
        const x = index * (barWidth + 10) + 5;
        const y = canvas.height - barHeight - 20;
        
        // Draw bar
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw day label
        ctx.fillStyle = '#666';
        ctx.fillText(day.toLocaleDateString('en', { weekday: 'short' }), x + barWidth / 2, canvas.height - 5);
        
        // Draw value
        if (completionData[index] > 0) {
            ctx.fillStyle = '#fff';
            ctx.fillText(completionData[index], x + barWidth / 2, y + barHeight / 2 + 3);
        }
        
        ctx.fillStyle = '#667eea';
    });
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveTasks() {
    userDataManager.setUserData('tasks', tasks);
}

function saveNeetcodeProgress() {
    userDataManager.setUserData('neetcodeProgress', neetcodeProgress);
}

function saveDSAProgress() {
    userDataManager.setUserData('dsaProgress', dsaProgress);
}

function saveAlgorithmsProgress() {
    userDataManager.setUserData('algorithmsProgress', algorithmsProgress);
}

function savePersonalCourses() {
    userDataManager.setUserData('personalCourses', personalCourses);
}

function formatDeadline(deadline) {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
        return 'Due today';
    } else if (diffDays === 1) {
        return 'Due tomorrow';
    } else if (diffDays <= 7) {
        return `Due in ${diffDays} days`;
    } else {
        return date.toLocaleDateString();
    }
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date);
    }
    return days;
}

// Add some demo data on first load
if (tasks.length === 0 && Object.keys(neetcodeProgress).length === 0 && Object.keys(dsaProgress).length === 0) {
    // Add a few sample tasks
    const sampleTasks = [
        {
            id: generateId(),
            title: "Master Binary Search Algorithm",
            description: "Study binary search template and solve related problems",
            priority: "high",
            category: "Algorithms",
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: "Complete Arrays & Hashing DSA Problems",
            description: "Solve all 7 problems in the Arrays & Lists category",
            priority: "medium",
            category: "DSA Practice",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: "Take Coursera ML Course",
            description: "Complete Week 1 of Machine Learning course",
            priority: "medium",
            category: "Learning",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date().toISOString()
        }
    ];
    
    tasks = sampleTasks;
    saveTasks();
    
    // Mark some DSA problems as completed
    dsaProgress = {
        "Two Sum": true,
        "Contains Duplicate": true,
        "Valid Palindrome": true,
        "Reverse Linked List": true,
        "Valid Parentheses": true
    };
    localStorage.setItem('dsaProgress', JSON.stringify(dsaProgress));
    
    // Mark some algorithms as completed
    algorithmsProgress = {
        "Linear Search": true,
        "Binary Search": true,
        "Bubble Sort": true,
        "Two Pointers Technique": true
    };
    localStorage.setItem('algorithmsProgress', JSON.stringify(algorithmsProgress));
    
    // Mark a few NeetCode problems as completed
    neetcodeProgress = {
        "Contains Duplicate": true,
        "Valid Anagram": true,
        "Two Sum": true,
        "Valid Palindrome": true
    };
    localStorage.setItem('neetcodeProgress', JSON.stringify(neetcodeProgress));
    
    // Add sample personal courses
    personalCourses = [
        {
            id: generateId(),
            name: "Complete Python Developer Course",
            description: "Master Python from basics to advanced with real projects",
            platform: "Udemy",
            progress: 75,
            url: "https://www.udemy.com/course/complete-python-developer-zero-to-mastery/",
            deadline: "2025-09-15",
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: "Data Structures and Algorithms Specialization",
            description: "Comprehensive DSA course from UC San Diego",
            platform: "Coursera",
            progress: 45,
            url: "https://www.coursera.org/specializations/data-structures-algorithms",
            deadline: "2025-10-31",
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('personalCourses', JSON.stringify(personalCourses));
}

// ========================================
// ROADMAP FUNCTIONALITY
// ========================================

// Initialize roadmap when tab is clicked
function initializeRoadmap() {
    updateRoadmapOverview();
    renderTimeline();
    renderSkillsProgress();
    updateLearningStreak();
}

// Update roadmap overview statistics
function updateRoadmapOverview() {
    const totalWeeks = roadmapData.months.reduce((total, month) => total + month.weeks.length, 0);
    const completedWeeks = roadmapProgress.completedWeeks.length;
    const completionPercentage = Math.round((completedWeeks / totalWeeks) * 100);
    
    // Update current month and week
    document.getElementById('currentMonth').textContent = `Month ${roadmapProgress.currentMonth}`;
    document.getElementById('weekProgress').textContent = `Week ${roadmapProgress.currentWeek} of 4`;
    document.getElementById('roadmapCompleted').textContent = `${completionPercentage}%`;
    document.getElementById('learningStreak').textContent = `${roadmapProgress.learningStreak} days`;
}

// Render timeline for current month
function renderTimeline() {
    const currentMonth = roadmapData.months[roadmapProgress.currentMonth - 1];
    if (!currentMonth) return;
    
    document.getElementById('timelineMonth').textContent = `Month ${currentMonth.month}: ${currentMonth.title}`;
    
    const timelineContent = document.getElementById('timelineContent');
    timelineContent.innerHTML = `
        <div class="month-timeline">
            <div class="month-header">
                <h4>${currentMonth.title}</h4>
                <p>${currentMonth.description}</p>
            </div>
            ${currentMonth.weeks.map(week => renderWeekItem(week, currentMonth.month)).join('')}
        </div>
    `;
}

// Render individual week item
function renderWeekItem(week, month) {
    const weekId = `${month}-${week.week}`;
    const isCompleted = roadmapProgress.completedWeeks.includes(weekId);
    const isCurrent = roadmapProgress.currentMonth === month && roadmapProgress.currentWeek === week.week;
    
    let statusClass = 'upcoming';
    let statusText = 'Upcoming';
    
    if (isCompleted) {
        statusClass = 'completed';
        statusText = 'Completed';
    } else if (isCurrent) {
        statusClass = 'current';
        statusText = 'Current';
    }
    
    return `
        <div class="week-item ${isCompleted ? 'completed' : ''}" data-week="${weekId}">
            <div class="week-header">
                <div class="week-title">Week ${week.week}: ${week.title}</div>
                <div class="week-status ${statusClass}">${statusText}</div>
            </div>
            <div class="week-content">
                <div class="topic-list">
                    ${week.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                </div>
                <div class="week-goals">
                    <strong>Goals:</strong> ${week.goals}
                </div>
                <div class="week-skills">
                    <strong>Skills:</strong> ${week.skills.join(', ')}
                </div>
            </div>
        </div>
    `;
}

// Change roadmap month (navigation)
function changeRoadmapMonth(direction) {
    const newMonth = roadmapProgress.currentMonth + direction;
    if (newMonth >= 1 && newMonth <= 6) {
        roadmapProgress.currentMonth = newMonth;
        saveRoadmapProgress();
        renderTimeline();
    }
}

// Add weekly goals as tasks
function addWeeklyGoals() {
    const currentMonth = roadmapData.months[roadmapProgress.currentMonth - 1];
    if (!currentMonth) return;
    
    const currentWeek = currentMonth.weeks.find(w => w.week === roadmapProgress.currentWeek);
    if (!currentWeek) return;
    
    // Create tasks based on current week's goals and topics
    const weeklyTasks = [
        {
            id: Date.now() + Math.random(),
            title: `Week ${currentWeek.week}: ${currentWeek.title}`,
            description: currentWeek.goals,
            category: 'roadmap',
            priority: 'high',
            dueDate: getEndOfWeek(),
            completed: false,
            createdAt: new Date().toISOString(),
            roadmapWeek: `${roadmapProgress.currentMonth}-${roadmapProgress.currentWeek}`
        }
    ];
    
    // Add individual topic tasks
    currentWeek.topics.forEach((topic, index) => {
        weeklyTasks.push({
            id: Date.now() + Math.random() + index,
            title: `Study: ${topic}`,
            description: `Learn and practice ${topic} concepts`,
            category: 'roadmap',
            priority: 'medium',
            dueDate: getEndOfWeek(),
            completed: false,
            createdAt: new Date().toISOString(),
            roadmapWeek: `${roadmapProgress.currentMonth}-${roadmapProgress.currentWeek}`
        });
    });
    
    // Add tasks to main tasks array
    tasks.push(...weeklyTasks);
    saveTasksData();
    renderTasks();
    
    // Show success message
    showNotification(`Added ${weeklyTasks.length} tasks for Week ${currentWeek.week}!`, 'success');
    
    // Switch to general tasks tab to see the new tasks
    switchTab('general');
}

// Mark current week as complete
function markWeekComplete() {
    const weekId = `${roadmapProgress.currentMonth}-${roadmapProgress.currentWeek}`;
    
    if (!roadmapProgress.completedWeeks.includes(weekId)) {
        roadmapProgress.completedWeeks.push(weekId);
        
        // Update learning streak
        updateLearningStreak();
        
        // Move to next week
        if (roadmapProgress.currentWeek < 4) {
            roadmapProgress.currentWeek++;
        } else if (roadmapProgress.currentMonth < 6) {
            roadmapProgress.currentMonth++;
            roadmapProgress.currentWeek = 1;
        }
        
        saveRoadmapProgress();
        updateRoadmapOverview();
        renderTimeline();
        renderSkillsProgress();
        
        showNotification('Week marked as complete! 🎉', 'success');
        
        // Celebrate with robot
        if (robot) {
            robot.celebrate(`Congratulations on completing Week ${roadmapProgress.currentWeek}! You're making great progress! 🚀`);
        }
    }
}

// View project ideas modal
function viewProjectIdeas() {
    // Check if modal already exists and remove it
    const existingModal = document.querySelector('.project-ideas-modal-container');
    if (existingModal) {
        existingModal.remove();
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal project-ideas-modal-container';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content project-ideas-modal">
            <div class="modal-header">
                <h3>15 High-Value Project Ideas</h3>
                <button class="close-btn" onclick="closeProjectIdeasModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="projects-grid">
                    ${roadmapData.projectIdeas.map(project => `
                        <div class="project-card">
                            <div class="project-header">
                                <h4>${project.title}</h4>
                                <span class="project-difficulty ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                            </div>
                            <div class="project-category">${project.category}</div>
                            <div class="project-tech">
                                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            <button class="add-project-btn" onclick="addProjectAsTask('${project.title}', '${project.category}')">
                                Add as Task
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectIdeasModal();
        }
    });
    
    document.body.appendChild(modal);
}

// Close project ideas modal
function closeProjectIdeasModal() {
    const modal = document.querySelector('.project-ideas-modal-container');
    if (modal) {
        modal.remove();
    }
}

// Add project as task
function addProjectAsTask(projectTitle, category) {
    const newTask = {
        id: Date.now() + Math.random(),
        title: `Project: ${projectTitle}`,
        description: `Build ${projectTitle} - ${category} project`,
        category: 'roadmap',
        priority: 'high',
        deadline: getEndOfMonth(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderGeneralTasks();
    
    // Close modal
    closeProjectIdeasModal();
    
    showNotification(`Project "${projectTitle}" added as task!`, 'success');
    switchTab('general');
}

// Render skills progress
function renderSkillsProgress() {
    const skillsGrid = document.getElementById('skillsGrid');
    
    skillsGrid.innerHTML = roadmapData.skills.map(skill => {
        const progress = calculateSkillProgress(skill);
        return `
            <div class="skill-card">
                <div class="skill-header">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-percentage">${progress}%</div>
                </div>
                <div class="skill-progress-bar">
                    <div class="skill-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="skill-topics">
                    <span class="skill-topic">${skill.category}</span>
                    <span class="skill-topic">${skill.totalTopics} topics</span>
                </div>
            </div>
        `;
    }).join('');
}

// Calculate skill progress based on completed weeks
function calculateSkillProgress(skill) {
    const relevantWeeks = roadmapData.months.flatMap(month => 
        month.weeks.filter(week => 
            week.skills.some(weekSkill => 
                weekSkill.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])
            )
        ).map(week => `${month.month}-${week.week}`)
    );
    
    const completedRelevantWeeks = relevantWeeks.filter(weekId => 
        roadmapProgress.completedWeeks.includes(weekId)
    );
    
    return relevantWeeks.length > 0 ? Math.round((completedRelevantWeeks.length / relevantWeeks.length) * 100) : 0;
}

// Update learning streak
function updateLearningStreak() {
    const today = new Date().toDateString();
    const lastActiveDate = roadmapProgress.lastActiveDate;
    
    if (lastActiveDate === today) {
        // Already updated today
        return;
    }
    
    if (lastActiveDate === new Date(Date.now() - 86400000).toDateString()) {
        // Consecutive day
        roadmapProgress.learningStreak++;
    } else if (lastActiveDate !== today) {
        // Reset streak if gap > 1 day
        roadmapProgress.learningStreak = 1;
    }
    
    roadmapProgress.lastActiveDate = today;
    saveRoadmapProgress();
}

// Helper functions
function getEndOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const endOfWeek = new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
    return endOfWeek.toISOString().split('T')[0];
}

function getEndOfMonth() {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endOfMonth.toISOString().split('T')[0];
}

// Save roadmap progress
function saveRoadmapProgress() {
    userDataManager.setUserData('roadmapProgress', roadmapProgress);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
