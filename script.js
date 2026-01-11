document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const emailBtn = document.getElementById('emailBtn');
    const contactEmailBtn = document.getElementById('contactEmailBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    const loadingBar = document.getElementById('loadingBar');
    const welcomeBubble = document.getElementById('welcome-bubble');
    const contactForm = document.getElementById('contactForm');
    const emailAddress = 'shahadatislam8224@gmail.com';

    if (loadingBar) {
        window.addEventListener('load', () => {
            setTimeout(() => { loadingBar.style.opacity = '0'; }, 500);
            setTimeout(() => { loadingBar.style.display = 'none'; }, 800);
        });
    }

    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });

    setTimeout(() => {
        if (welcomeBubble) welcomeBubble.classList.add('show');
    }, 4000);

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            mobileNav.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times text-lg' : 'fas fa-ellipsis-v text-lg';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (mobileNav && !mobileNav.contains(e.target) && e.target !== mobileMenuBtn) {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) icon.className = 'fas fa-ellipsis-v text-lg';
        }
    });

    function handleEmailCopy(button) {
        if (!button) return;
        const originalText = button.innerHTML;
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            button.classList.add('bg-green-600');
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Email Copied!';
            
            setTimeout(() => {
                button.classList.remove('bg-green-600');
                button.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            alert('Please copy the email manually: ' + emailAddress);
        });
    }

    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleEmailCopy(emailBtn);
        });
    }
    
    if (contactEmailBtn && contactForm) {
        contactEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const message = document.getElementById('message')?.value;
            
            if (!name || !email || !message) {
                alert('Please fill all fields before sending.');
                return;
            }
            
            alert('Thank you for your message! I will respond within 24-48 hours.');
            contactForm.reset();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                    mobileNav.classList.add('hidden');
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.form) {
            e.preventDefault();
        }
    });

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById('skills');
    if(skillsSection) observer.observe(skillsSection);
});

window.revealReference = function(num) {
    const ref = document.getElementById('reference' + num);
    if (ref) {
        ref.classList.toggle('hidden');
    }
};

window.toggleChat = function() {
    const chat = document.getElementById('chat-window');
    const bubble = document.getElementById('welcome-bubble');
    if (bubble) bubble.classList.remove('show');
    
    if (chat) {
        const isHidden = (chat.style.display === 'none' || chat.style.display === '');
        chat.style.display = isHidden ? 'flex' : 'none';
    }
};

window.sendToGemini = async function() {
    const input = document.getElementById('user-input');
    const content = document.getElementById('chat-content');
    if (!input || !content || !input.value.trim()) return;

    const userMessage = input.value.trim();
    content.innerHTML += `<div class="user-msg">${userMessage}</div>`;
    input.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    content.appendChild(typingDiv);
    content.scrollTop = content.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await response.json();
        document.getElementById('typing-indicator')?.remove();
        
        const aiReply = data.reply || "I'm having trouble thinking right now.";
        content.innerHTML += `<div class="ai-msg">${aiReply}</div>`;
    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        content.innerHTML += `<div class="ai-msg">Connection lost. Please try again.</div>`;
    }
    content.scrollTop = content.scrollHeight;
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'user-input') {
        e.preventDefault();
        sendToGemini();
    }
});
