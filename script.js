// ---------- UI & Navigation Logic ---------- //

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.add('scrolled');
        navbar.classList.remove('scrolled');
    }
    
    // Proper specific class toggle
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tl = gsap.timeline();

tl.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2
})
.from('.hero-cta .btn', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out'
}, '-=0.6');

// Typing Effect for Subtitle
const typingTextElement = document.getElementById('typing-text');
const textToType = "Unlock unparalleled growth with our premium B2B Data, seamless WhatsApp API, Mass Mailing solutions, state-of-the-art AI Chatbots, and Powerful CRM. This product will be free for users with a verified company mail ID.";
let charIndex = 0;

function typeText() {
    if (charIndex < textToType.length) {
        typingTextElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 30); // 30ms typing speed
    }
}
setTimeout(typeText, 800); // Start after title animation

// GSAP ScrollTrigger for service cards staggered entrance
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Blur and fade 3D background on scroll down
gsap.to('#canvas-container', {
    scrollTrigger: {
        trigger: 'body',
        start: '10px top',
        end: '800px top',
        scrub: true
    },
    filter: 'blur(20px)',
    opacity: 0,
    ease: 'none'
});

// ---------- Three.js 3D Background Logic ---------- //
const canvasContainer = document.getElementById('canvas-container');

// Scene Setup
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high DPI
canvasContainer.appendChild(renderer.domElement);

// Add Items to Scene
// Data Network Effect
const networkGroup = new THREE.Group();
scene.add(networkGroup);

const particleCount = 400;
const particlePositions = new Float32Array(particleCount * 3);

// Generate random points in space
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 60;     // x
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 60; // y
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMat = new THREE.PointsMaterial({
    color: 0xF5F6FA,
    size: 0.2,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const particleMesh = new THREE.Points(particlesGeo, particleMat);
networkGroup.add(particleMesh);

// Create static connections between nearby data points to form a data network
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0984E3,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});

const linePositions = [];
for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 60) { // Connect if distance is close enough
            linePositions.push(
                particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2],
                particlePositions[j * 3], particlePositions[j * 3 + 1], particlePositions[j * 3 + 2]
            );
        }
    }
}

const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lineMesh = new THREE.LineSegments(lineGeo, lineMaterial);
networkGroup.add(lineMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate the entire data network
    networkGroup.rotation.y = elapsedTime * 0.05;
    networkGroup.rotation.x = elapsedTime * 0.02;

    // Mouse parallax effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    networkGroup.rotation.y += 0.05 * (targetX - networkGroup.rotation.y);
    networkGroup.rotation.x += 0.05 * (targetY - networkGroup.rotation.x);

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- AI Chatbot Logic ---------- //
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Open Chatbot
chatbotToggle.addEventListener('click', () => {
    // Toggle active state instead of just adding
    if(chatbotWindow.classList.contains('active')){
        chatbotWindow.classList.remove('active');
    } else {
        chatbotWindow.classList.add('active');
        if (chatbotMessages.children.length === 0) {
            addBotMessage("Hi there! 👋 I'm the LeadintelAI Assistant. How can I help you grow your business today?");
        }
    }
});

// Close Chatbot when clicking outside
document.addEventListener('click', (event) => {
    // Check if chatbot is open
    if (chatbotWindow.classList.contains('active')) {
        // Check if the click was outside the chatbot window and outside the toggle button
        const isClickInsideWindow = chatbotWindow.contains(event.target);
        const isClickOnToggle = chatbotToggle.contains(event.target);
        
        // Ensure we aren't clicking on service modals before closing chat
        const isClickOnModal = event.target.closest('.service-modal') !== null;
        
        if (!isClickInsideWindow && !isClickOnToggle && !isClickOnModal) {
            chatbotWindow.classList.remove('active');
        }
    }
});

// Send Message
function handleSend() {
    const text = chatbotInput.value.trim();
    if (text === '') return;

    // Add User Message
    addUserMessage(text);
    chatbotInput.value = '';

    // Simulate Bot Response Delay
    setTimeout(() => {
        generateBotResponse(text.toLowerCase());
    }, 600 + Math.random() * 500);
}

chatbotSend.addEventListener('click', handleSend);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

// Helpers to add messages to UI
function addUserMessage(text) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', 'msg-user');
    div.textContent = text;
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function addBotMessage(text) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', 'msg-bot');
    div.innerHTML = text; // Allow HTML for bolding/links if needed
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Real AI Chatbot Logic
async function generateBotResponse(input) {
    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    addTypingIndicator(typingId);

    try {
        // NOTE: In a production environment, you should never expose your API key in frontend code.
        // This should be routed through your own backend server.
        // For demonstration purposes, we are simulating a dynamic AI response or setting up the fetch structure.
        
        // Example structure for calling an AI API (like Google Gemini or OpenAI):
        /*
        const response = await fetch('YOUR_BACKEND_ENDPOINT_OR_DIRECT_API', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                prompt: `You are the Leadintelai.in helpful assistant. 
                         The company provides B2B Data Selling, WhatsApp API, Mass Mailing, and AI Chatbots.
                         The founder is Gaurav Yadav. Only mention him if explicitly asked.
                         User asked: ${input}`
            })
        });
        const data = await response.json();
        const aiText = data.choices[0].text; // or data.candidates[0].content depending on API
        */

        // -----------------------------------------------------
        // Simulated Dynamic Backend Call for Demo
        // -----------------------------------------------------
        const systemPromptContext = "Leadintelai.in offers B2B Data with numbers/emails, 24/7 WhatsApp API & Chatbots, and Mass Mailing. Founder is Gaurav Yadav (only mention if asked about founders/owners/creators). ";
        
        // Simulating the AI processing time...
        await new Promise(r => setTimeout(r, 1500));
        
        let aiResponse = "";
        
        // Enhanced parsing to simulate "Real AI" understanding without a live key
        if (input.includes('founder') || input.includes('gaurav') || input.includes('owner') || input.includes('who created')) {
            aiResponse = "Leadintelai.in was proudly founded by **Gaurav Yadav**. Under his leadership, we strive to be India's biggest B2B lead generation platform.";
        } else if (input.includes('price') || input.includes('cost') || input.includes('plan')) {
            aiResponse = "We have transparent pricing in INR. Our Marketing Suite starts at ₹4,999/mo, and our B2B Data packages start at ₹9,999/mo. You can find full details on our <a href='price.html' style='color:#0984E3;text-decoration:underline;'>Pricing Page</a>.";
        } else if (input.includes('data') || input.includes('lead')) {
            aiResponse = "We provide premium B2B Data Selling. You get high-quality leads that include phone numbers, verified emails, and crucial decision-maker titles like HR, CIO, CXO, or CTO to fuel your growth.";
        } else if (input.includes('whatsapp') || input.includes('api')) {
            aiResponse = "Our WhatsApp Business API lets you connect with prospects in less than a second! We also provide custom WhatsApp Chatbots for absolute 24/7 automated assistance.";
        } else if (input.includes('mail') || input.includes('email')) {
            aiResponse = "With our Mass Mailing solutions, you can reach your entire lead database instantly with highly personalized email campaigns and excellent deliverability.";
        } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            aiResponse = "Hello there! I'm the Leadintelai AI assistant. How can I help you dominate your market today?";
        } else if (input.includes('what do you do') || input.includes('services')) {
            aiResponse = "We specialize in B2B Data Selling (leads with contacts), WhatsApp API integrations with chatbots, and high-volume Mass Mailing. It's a single tap to grow your business!";
        } else {
            // General fallback acting like an AI that needs clarification
            aiResponse = `I'm an AI assistant for Leadintelai.in. You asked about "${input}". While I'm still learning, I can definitely tell you all about our B2B databases, WhatsApp API, Mass Mailing tools, or our pricing plans. Could you specify what you need?`;
        }

        removeTypingIndicator(typingId);
        addBotMessage(aiResponse);

    } catch (error) {
        removeTypingIndicator(typingId);
        addBotMessage("I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later!");
    }
}

function addTypingIndicator(id) {
    const div = document.createElement('div');
    div.id = id;
    div.classList.add('chat-msg', 'msg-bot');
    div.innerHTML = `<span style="opacity:0.5;">Typing...</span>`;
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ---------- Service Modals Logic ---------- //

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        document.getElementById('modal-overlay').classList.add('active');
        modal.classList.add('active');
    }
}

function closeModals() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
    
    const modals = document.querySelectorAll('.service-modal');
    modals.forEach((modal) => {
        modal.classList.remove('active');
    });

    // Reset contact form if it was used
    const contactForm = document.getElementById('expert-contact-form');
    const successMsg = document.getElementById('contact-success-msg');
    setTimeout(() => {
        if(contactForm) contactForm.style.display = 'flex';
        if(successMsg) {
            successMsg.style.display = 'none';
            successMsg.style.opacity = '0';
            successMsg.style.transform = 'scale(0.9)';
        }
    }, 400); // Reset after modal closes
}

// ---------- Expert Contact Form Submission ---------- //
document.addEventListener('DOMContentLoaded', () => {
    const expertForm = document.getElementById('expert-contact-form');
    if(expertForm) {
        expertForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            const form = e.target;
            const successMsg = document.getElementById('contact-success-msg');
            
            // Hide the form smoothly
            form.style.display = 'none';
            
            // Display success message with animation
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.opacity = '1';
                successMsg.style.transform = 'scale(1)';
            }, 50);
            
            // Optional: You could add an API call here to actually send the email/Slack message
            form.reset(); // clear inputs
        });
    }
});
