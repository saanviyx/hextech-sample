let selectedPackage = null;
let selectedAddons = [];

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initServiceCards();
    initPackageSelection();
    initContactActions();
    initFormSubmission();
    initHeroVideoScrollEffect();
    initMorphingEffects();
    preloadResources();
});

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            if (navLinks) navLinks.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
}

function scrollToSection(sectionId) {
    let targetId = sectionId;
    if (sectionId === 'contact') {
        targetId = 'contact';
    }
    
    const element = document.getElementById(targetId);
    console.log('Scrolling to:', targetId, 'Element found:', !!element);
    
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } else {
        console.error('Element not found:', targetId);
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const elementsToAnimate = [
        '.hero-title',
        '.hero-subtitle', 
        '.hero-buttons',
        '.product-mockups',
        '.about-text',
        '.tech-feature',
        '.addon-card',
        '.contact-card',
        '.section-subtitle-main',
        '.section-subtitle',
        '.section-note',
        '.addons-title',
        '.addons-subtitle',
        '.contact-header',
        '.form-header',
        '.contact-form',
        '.map-info-wrapper',
    ];

    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            
            observer.observe(element);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .hero-content > * {
            animation: fadeInUp 1s ease-out forwards;
        }
        
        .hero-title { animation-delay: 0.2s; }
        .hero-subtitle { animation-delay: 0.4s; }
        .hero-buttons { animation-delay: 0.6s; }
        .product-mockups { animation-delay: 0.8s; }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .package-card.selected {
            border-color: #36579eff !important;
            box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3) !important;
            transform: translateY(-10px) scale(1.02) !important;
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #36579eff, #001a82ff);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(107, 70, 193, 0.4);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(168, 85, 247, 0.3);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

function initPackageSelection() {
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packageCard = e.target.closest('.package-card');
            const packageName = packageCard.querySelector('.package-name').textContent.toLowerCase();
            selectPackage(packageName);
        });
    });

    document.querySelectorAll('.btn-addon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const addonCard = e.target.closest('.addon-card');
            const addonName = addonCard.querySelector('.addon-name').textContent.toLowerCase().replace(/\s+/g, '-');
            addAddon(addonName);
        });
    });
}

function selectPackage(packageName) {
    selectedPackage = packageName;

    // Remove selected class from all package cards
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Find and select the correct package card
    document.querySelectorAll('.package-card').forEach(card => {
        const nameElement = card.querySelector('.package-name');
        if (nameElement && nameElement.textContent.toLowerCase() === packageName) {
            card.classList.add('selected');
        }
    });

    // Update the form select dropdown
    const packageSelect = document.getElementById('packageSelect');
    if (packageSelect) {
        const optionText = packageName.charAt(0).toUpperCase() + packageName.slice(1);
        for (let option of packageSelect.options) {
            if (option.text.toLowerCase().includes(optionText.toLowerCase())) {
                option.selected = true;
                break;
            }
        }
    }

    // Scroll to contact section after a brief delay
    setTimeout(() => {
        scrollToSection('contact');
    }, 500);

    showNotification(`${packageName.toUpperCase()} package selected! 🚀`);
}

function addAddon(addonName) {
    if (!selectedAddons.includes(addonName)) {
        selectedAddons.push(addonName);

        const button = event.target;
        button.textContent = 'Added ✓';
        button.style.background = 'linear-gradient(135deg, #6B46C1, #A855F7)';
        button.style.color = 'white';
        button.disabled = true;

        showNotification(`Add-on selected! 🎉`);
    }
}

function initContactActions() {
    window.bookCall = function() {
        showNotification('Redirecting to booking system... 📅');
        setTimeout(() => {
            window.open('https://calendly.com', '_blank');
        }, 1000);
    };

    window.callPhone = function() {
        showNotification('Opening phone dialer... 📞');
        window.open('tel:+971501234567');
    };

    window.sendEmail = function() {
        showNotification('Opening email client... 📧');
        const subject = selectedPackage ? `Inquiry about ${selectedPackage.toUpperCase()} package` : 'General Inquiry';
        const body = selectedPackage ? `Hi, I'm interested in the ${selectedPackage.toUpperCase()} package.` : 'Hi, I\'d like to learn more about your services.';
        window.open(`mailto:info@hextech.ae?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };
}

function initFormSubmission() {
    // Use a more specific selector to avoid the ID conflict
    const contactForm = document.querySelector('section#contactForm form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours. 🎉');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                selectedPackage = null;
                selectedAddons = [];
                document.querySelectorAll('.package-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                document.querySelectorAll('.btn-addon').forEach(btn => {
                    if (btn.textContent.includes('Added')) {
                        btn.textContent = 'Add to Package';
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.disabled = false;
                    }
                });
            }, 2000);
        });
    }
}

function initHeroVideoScrollEffect() {
  const heroVideo = document.getElementById('heroVideo');
  const heroBg = document.getElementById('heroBg');
  const heroContent = document.getElementById('heroContent');
  const nav = document.getElementById('navbar');

  if (!heroVideo || !heroBg || !heroContent || !nav) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 50) {
      // hide video, show content
      heroVideo.style.opacity = '0';
      heroBg.style.opacity = '1';
      heroContent.classList.add('visible');

      nav.classList.add('solid');
      nav.classList.remove('transparent');
    } else {
      // show video, hide content
      heroVideo.style.opacity = '1';
      heroBg.style.opacity = '0';
      heroContent.classList.remove('visible');

      nav.classList.add('transparent');
      nav.classList.remove('solid');
    }

    // navbar hide/show on scroll
    if (y < lastScrollY) {
      nav.classList.remove('hidden');
    } else if (y > lastScrollY) {
      nav.classList.add('hidden');
    }

    lastScrollY = y;
  });
}


function initMorphingEffects() {
    document.querySelectorAll('.contact-card, .addon-card, .tech-feature').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            }
        });
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.05)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    document.querySelectorAll('.mockup').forEach(mockup => {
        mockup.addEventListener('mouseenter', () => {
            mockup.style.transform = 'translateY(-10px) rotateY(5deg)';
        });

        mockup.addEventListener('mouseleave', () => {
            mockup.style.transform = 'translateY(0) rotateY(0)';
        });
    });
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function preloadResources() {
    const fonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    ];

    fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.selectPackage = selectPackage;
window.addAddon = addAddon;