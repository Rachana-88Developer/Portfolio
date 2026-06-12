// SHARED JS FOR MULTI-PAGE PORTFOLIO - IMMERSIVE SYSTEM

// Sound System: Bio-Digital Audio
const AudioEngine = (() => {
    let context = null;
    let muted = false;
    const init = () => { 
        if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
        if (context && context.state === 'suspended') context.resume();
    };
    const playSound = (freq, type, duration, vol) => {
        if (muted || !context) return;
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, context.currentTime);
        gain.gain.setValueAtTime(vol, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        osc.connect(gain); gain.connect(context.destination);
        osc.start(); osc.stop(context.currentTime + duration);
    };
    return {
        init,
        toggleMute: () => { muted = !muted; return muted; },
        hover: () => playSound(800, 'sine', 0.1, 0.05),
        click: () => playSound(1200, 'triangle', 0.1, 0.05),
        isMuted: () => muted
    };
})();

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Injected Sound & Theme Controls in Navbar
    const navActions = document.getElementById('nav-actions');
    if (navActions) {
        // Sound Toggle
        const volBtn = document.createElement('div');
        volBtn.className = 'social-icon';
        volBtn.style.width = '32px'; volBtn.style.height = '32px'; volBtn.style.cursor = 'pointer';
        volBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volBtn.style.color = 'var(--accent-gold)';
        volBtn.style.borderColor = 'var(--accent-gold)';
        volBtn.title = "Disable Immersive Audio";
        navActions.appendChild(volBtn);

        volBtn.addEventListener('click', () => {
            AudioEngine.init();
            const isMuted = AudioEngine.toggleMute();
            volBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
            volBtn.style.color = isMuted ? 'var(--text-secondary)' : 'var(--accent-gold)';
            volBtn.style.borderColor = isMuted ? 'var(--border-subtle)' : 'var(--accent-gold)';
        });

        // Theme Toggle
        const themeBtn = document.createElement('div');
        themeBtn.className = 'social-icon';
        themeBtn.style.width = '32px'; themeBtn.style.height = '32px'; themeBtn.style.cursor = 'pointer';
        themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeBtn.title = "Toggle Light/Dark Mode";
        navActions.appendChild(themeBtn);

        themeBtn.addEventListener('click', () => {
            dark = !dark;
            document.body.classList.toggle('day-mode', !dark);
            themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            initNeural(); // Refresh canvas colors
        });
    }

    // 2. Attach Global Sound Listeners (Delegation)
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .social-icon, .bot-toggle, .bot-close, .proj-card, .cert-card')) {
            AudioEngine.hover();
        }
    });
    
    // Use mousedown so sound plays instantly before any page navigation triggers
    document.body.addEventListener('mousedown', (e) => {
        AudioEngine.init(); 
        if (e.target.closest('a, button, input, textarea, .social-icon, .bot-toggle, .bot-close, .nav-links li a')) {
            AudioEngine.click();
        }
    });

    // 3. Reveal Observer
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stats-row')) animateStats();
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(r => revealObserver.observe(r));

    // 4. Initialize Background Effects
    initNeural();
    drawNeural();
});

// Toast System
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--accent); color: var(--bg); padding: 1rem 2rem; border-radius: 50px; font-weight: 700; font-size: 0.9rem; z-index: 10000; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); text-transform: uppercase; display: flex; align-items: center; gap: 0.8rem;`;
    toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.transform = 'translateX(-50%) translateY(0)');
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

// Neural Network Canvas
const canvas = document.getElementById('neural-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let points = [];

function initNeural() {
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    points = [];
    for(let i=0; i<80; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function drawNeural() {
    if(!ctx) return;
    const isDay = document.body.classList.contains('day-mode');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = isDay ? '#8da9c4' : '#c8a96e';
    ctx.strokeStyle = isDay ? 'rgba(141, 169, 196, 0.05)' : 'rgba(200,169,110,0.1)';
    points.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
        for(let j=i+1; j<points.length; j++) {
            const p2 = points[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(dist < 150) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
        }
    });
    requestAnimationFrame(drawNeural);
}

window.addEventListener('resize', initNeural);

// Chatbot Knowledge Base
const RachanaKB = {
    "who": "Rachana Hinge: AI Engineer & Lead Clinical Researcher. Focus: RAG & Agentic Systems.",
    "experience": "1.5+ Years. Lead AI Research (IEEE) & Industrial Residency (Prime Numerics).",
    "bhaktiwaani": "AI Sanskrit Guide. Tech: Next.js, PostgreSQL, Drizzle, AI Speech Modules.",
    "projects": "BhaktiWaani (Vani AI), Agentic RAG Platform, IEEE Clinical AI.",
    "skills": "Mastery: RAG, Agentic AI, Medical NLP, Python, R, Next.js, AWS/Azure.",
    "contact": "rachanahinge123@gmail.com | +91 7498425211 | Pune, India.",
    "education": "B.Tech CSE (AI/ML) @ DESPU. 8.2 CGPA.",
    "rag": "Deep Expertise: Graph RAG (Neo4j), Semantic Chunking, Enterprise Agent Teams.",
    "hi": "Hi. Ready.",
    "hello": "Hello. Awaiting query."
};

function getBotResponse(input) {
    const q = input.toLowerCase();
    
    // GREETINGS & IDENTITY
    if (q.includes("hi") || q.includes("hey") || q.includes("hello")) return "Rachu Ai how may i hep u";
    if (q.includes("who are you") || q.includes("who r u")) return "Rachu Ai how may i hep u";
    if (q.includes("made you") || q.includes("owner") || q.includes("creator") || q.includes("built you")) return "Rachana Hinge Built me.";

    // QUANTITATIVE (Numeric Priority)
    if (q.includes("how many") || q.includes("count") || q.includes("number")) {
        if (q.includes("project")) return "3+ Production Core Projects & 30+ Academic/Self projects.";
        if (q.includes("year") || q.includes("exp")) return "1.5+ Years of Lead AI Research.";
        if (q.includes("cert") || q.includes("credential")) return "7+ Professional Credentials.";
    }

    // DATA MATCHING
    if (q.includes("experience") || q.includes("experiance") || q.includes("year")) return "1.5+ Years in Lead AI & RAG Research.";
    if (q.includes("project") || q.includes("build") || q.includes("made")) return "3+ Core Systems (BhaktiWaani, RAG) & 30+ Academic builds.";
    if (q.includes("skill") || q.includes("tech") || q.includes("know") || q.includes("ai")) return "Mastery: RAG, Agentic AI, Python, R, AWS/Azure.";
    if (q.includes("study") || q.includes("education") || q.includes("gpa")) return "B.Tech CSE (AI/ML) @ DESPU. GPA: 8.2.";
    if (q.includes("contact") || q.includes("email") || q.includes("reach")) return "rachanahinge123@gmail.com | +91 7498425211.";
    
    return "Data limit. Ask for Rachana's RAG, AI Research, or Contact.";
}

// Chatbot UI Handlers
document.addEventListener('DOMContentLoaded', () => {
    const botToggle = document.querySelector('.bot-toggle');
    const botWindow = document.querySelector('.bot-window');
    const botClose = document.querySelector('.bot-close');
    const botSend = document.getElementById('bot-send');
    const botInput = document.getElementById('bot-input');
    const botMessages = document.getElementById('bot-messages');

    if (botToggle) {
        botToggle.addEventListener('click', () => {
            AudioEngine.init(); // Unlock sound on first click
            botWindow.classList.add('visible');
        });
    }
    if (botClose) {
        botClose.addEventListener('click', () => botWindow.classList.remove('visible'));
    }

    const sendMessage = () => {
        AudioEngine.init(); // Ensure engine is hot
        const text = botInput.value.trim();
        if (!text) return;

        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'bot-msg user';
        userDiv.textContent = text;
        botMessages.appendChild(userDiv);
        botInput.value = '';

        // AI response
        setTimeout(() => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'bot-msg ai';
            const response = getBotResponse(text);
            aiDiv.textContent = response;
            botMessages.appendChild(aiDiv);
            botMessages.scrollTop = botMessages.scrollHeight;
            
            // Fast UI sound instead of lagging TTS
            AudioEngine.click();
        }, 600);
    };

    if (botSend) botSend.addEventListener('click', sendMessage);
    if (botInput) botInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });

    // 6. Scroll Reveal & Skill Bar Animation
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's a skill card, fill the bars
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach(fill => {
                    fill.style.width = fill.getAttribute('data-width');
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .skill-card').forEach(el => observer.observe(el));
});
