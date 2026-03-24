// ---------- UI & Navigation Logic ---------- //
const backendUrl = "https://leadintel-backend-production.up.railway.app";

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
const textToType = "The ultimate all-in-one suite to rule the B2B market. From premium data to seamless outreach and a powerful CRM, everything you need to dominate your industry is right here.";
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
// Commented out because it causes the cards to disappear after 2 seconds
/*
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
*/

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

// Helper: Create a glowing circle texture for Nodes
function createNodeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(9, 132, 227, 0.3)');
    gradient.addColorStop(1, 'rgba(9, 132, 227, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// Helper: Create binary textures (0 and 1)
function createBinaryTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

const nodeTexture = createNodeTexture();
const zeroTexture = createBinaryTexture('0');
const oneTexture = createBinaryTexture('1');

const particleCount = 400;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);

// Generate random points in space
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 60;     // x
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 60; // y
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    
    // Mix white and brand blue 
    const isBlue = Math.random() > 0.7;
    const color = isBlue ? new THREE.Color(0x0984E3) : new THREE.Color(0xF5F6FA);
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
    
    particleSizes[i] = Math.random() * 0.8 + 0.2;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.6,
    map: nodeTexture,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const particleMesh = new THREE.Points(particlesGeo, particleMat);
networkGroup.add(particleMesh);

// Binary Particle System
const binaryCount = 150;
const binaryPositions = new Float32Array(binaryCount * 3);
for (let i = 0; i < binaryCount; i++) {
    binaryPositions[i * 3] = (Math.random() - 0.5) * 80;
    binaryPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    binaryPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
}

const binaryGeo0 = new THREE.BufferGeometry();
binaryGeo0.setAttribute('position', new THREE.BufferAttribute(binaryPositions.slice(0, binaryCount * 1.5), 3));
const binaryMat0 = new THREE.PointsMaterial({ size: 1.2, map: zeroTexture, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
const binaryMesh0 = new THREE.Points(binaryGeo0, binaryMat0);
networkGroup.add(binaryMesh0);

const binaryGeo1 = new THREE.BufferGeometry();
binaryGeo1.setAttribute('position', new THREE.BufferAttribute(binaryPositions.slice(binaryCount * 1.5), 3));
const binaryMat1 = new THREE.PointsMaterial({ size: 1.2, map: oneTexture, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
const binaryMesh1 = new THREE.Points(binaryGeo1, binaryMat1);
networkGroup.add(binaryMesh1);

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

    // RESTORED: Rotate the entire data network
    networkGroup.rotation.y = elapsedTime * 0.05;
    networkGroup.rotation.x = elapsedTime * 0.02;

    // RESTORED: Mouse parallax effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    networkGroup.rotation.y += 0.05 * (targetX - networkGroup.rotation.y);
    networkGroup.rotation.x += 0.05 * (targetY - networkGroup.rotation.x);

    // Pulsing effect for nodes
    particleMesh.material.size = 0.6 + Math.sin(elapsedTime * 2) * 0.1;
    
    // Drift binary particles
    binaryMesh0.position.y += 0.01;
    binaryMesh1.position.y += 0.01;
    if (binaryMesh0.position.y > 20) binaryMesh0.position.y = -20;
    if (binaryMesh1.position.y > 20) binaryMesh1.position.y = -20;

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
if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        // Toggle active state instead of just adding
        if(chatbotWindow.classList.contains('active')){
            chatbotWindow.classList.remove('active');
        } else {
            chatbotWindow.classList.add('active');
            if (chatbotMessages && chatbotMessages.children.length === 0) {
                addBotMessage("Hi there! 👋 I'm the LeadintelAI Assistant. How can I help you grow your business today?");
            }
        }
    });
}

// Close Chatbot when clicking outside
document.addEventListener('click', (event) => {
    // Check if chatbot elements exist and are open
    if (chatbotWindow && chatbotWindow.classList.contains('active')) {
        // Check if the click was outside the chatbot window and outside the toggle button
        const isClickInsideWindow = chatbotWindow.contains(event.target);
        const isClickOnToggle = chatbotToggle ? chatbotToggle.contains(event.target) : false;
        
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

if (chatbotSend) chatbotSend.addEventListener('click', handleSend);
if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

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
    const typingId = 'typing-' + Date.now();
    addTypingIndicator(typingId);

    try {
        const response = await fetch(`${backendUrl}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: input,
                phone_number: "PUBLIC_CHAT" // Identifier for landing page chat
            })
        });

        if (response.ok) {
            const data = await response.json();
            removeTypingIndicator(typingId);
            addBotMessage(data.reply);
        } else {
            throw new Error("API Failure");
        }
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

// ---------- Live Intelligence Dashboard Logic ---------- //
const feedContainer = document.getElementById('intelligence-feed');
const liveClock = document.getElementById('live-clock');

const sampleAlerts = [
    { person: "Anjali Sharma", action: "promoted to CTO", company: "Zomato India" },
    { person: "David Miller", action: "joined as VP Sales", company: "Salesforce" },
    { person: "Rajesh Kumar", action: "newly appointed HR head", company: "HCL Tech" },
    { person: "Sarah Jenkins", action: "changed role to Director", company: "Google Cloud" },
    { person: "Vivek Gupta", action: "promoted to Marketing Head", company: "Airtel" },
    { person: "Linda Wu", action: "joined as Product Manager", company: "Netflix" },
    { person: "Karan Singh", action: "appointed CEO", company: "Innovate AI" }
];

function updateClock() {
    const now = new Date();
    if (liveClock) {
        liveClock.textContent = now.toLocaleTimeString();
    }
}

function addIntelligenceAlert() {
    if (!feedContainer) return;

    const alert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    const div = document.createElement('div');
    div.classList.add('intelligence-item');
    div.innerHTML = `
        <strong>${alert.person}</strong> ${alert.action}
        <span class="company">at ${alert.company}</span>
    `;

    // Keep only last 3 alerts
    if (feedContainer.children.length >= 3) {
        feedContainer.removeChild(feedContainer.firstChild);
    }
    
    feedContainer.appendChild(div);
}

setInterval(updateClock, 1000);
updateClock(); // initial call
setInterval(addIntelligenceAlert, 4000);
// Initial alerts
setTimeout(addIntelligenceAlert, 500);
setTimeout(addIntelligenceAlert, 1500);

// ---------- Pricing Tab Switcher ---------- //
document.querySelectorAll('.pricing-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Update active tab button
        document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active panel
        document.querySelectorAll('.pricing-panel').forEach(panel => panel.classList.remove('active'));
        const targetPanel = document.getElementById('tab-' + target);
        if (targetPanel) targetPanel.classList.add('active');
    });
});

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
