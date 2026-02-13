/* ============================================
   ASHLEY ROBINSON — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const hasHero = document.querySelector('.hero') || document.querySelector('.page-hero');

    const handleScroll = () => {
        if (!hasHero) return;
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile Navigation Toggle ----
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Scroll Reveal Animation ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Multi-Step Questionnaire ----
    const questionnaire = document.getElementById('questionnaire');
    if (questionnaire) {
        let currentStep = 1;
        let selectedService = '';
        const totalSteps = 4;
        const progressBar = document.getElementById('q-progress-bar');
        const stepLabel = document.getElementById('q-step-label');

        const updateProgress = () => {
            progressBar.style.width = (currentStep / totalSteps * 100) + '%';
            stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
        };

        const goToStep = (step) => {
            document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
            document.getElementById(`step-${step}`).classList.add('active');
            currentStep = step;
            updateProgress();
            questionnaire.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Step 1: Service card selection
        document.querySelectorAll('.q-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedService = card.dataset.service;
                document.getElementById('h-service').value = selectedService;

                // Show correct service fields
                document.querySelectorAll('.q-service-fields').forEach(f => f.classList.remove('active'));
                document.getElementById(`fields-${selectedService}`).classList.add('active');

                goToStep(2);
            });
        });

        // Auto-select from URL params
        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get('service');
        if (serviceParam && ['consulting', 'fitting', 'wedding'].includes(serviceParam)) {
            const card = document.querySelector(`.q-card[data-service="${serviceParam}"]`);
            if (card) card.click();
        }

        // Back buttons
        document.getElementById('back-2').addEventListener('click', () => goToStep(1));
        document.getElementById('back-3').addEventListener('click', () => goToStep(2));
        document.getElementById('back-4').addEventListener('click', () => goToStep(3));

        // Step 2 → 3: Collect service-specific data
        document.getElementById('next-2').addEventListener('click', () => {
            if (selectedService === 'consulting') {
                document.getElementById('h-business-name').value = document.getElementById('business-name').value;
                document.getElementById('h-business-stage').value = document.getElementById('business-stage').value;
                const checked = [...document.querySelectorAll('#fields-consulting .q-checkbox input:checked')].map(c => c.value);
                document.getElementById('h-help-areas').value = checked.join(', ');
            } else if (selectedService === 'fitting') {
                document.getElementById('h-occasion').value = document.getElementById('occasion').value;
                document.getElementById('h-timeline').value = document.getElementById('timeline').value;
                const stylePref = document.querySelector('input[name="style-pref"]:checked');
                document.getElementById('h-style-pref').value = stylePref ? stylePref.value : '';
            } else if (selectedService === 'wedding') {
                document.getElementById('h-wedding-date').value = document.getElementById('wedding-date').value;
                document.getElementById('h-party-size').value = document.getElementById('party-size').value;
                document.getElementById('h-wedding-vision').value = document.getElementById('wedding-vision').value;
            }
            goToStep(3);
        });

        // Step 3 → 4: Collect contact info and build review
        document.getElementById('next-3').addEventListener('click', () => {
            const name = document.getElementById('q-name').value.trim();
            const email = document.getElementById('q-email').value.trim();

            if (!name || !email) {
                if (!name) document.getElementById('q-name').focus();
                else document.getElementById('q-email').focus();
                return;
            }

            document.getElementById('h-name').value = name;
            document.getElementById('h-email').value = email;
            document.getElementById('h-phone').value = document.getElementById('q-phone').value;
            document.getElementById('h-message').value = document.getElementById('q-message').value;

            // Build review
            const serviceNames = { consulting: 'Strategic Consulting', fitting: 'Custom Suit Design', wedding: 'Wedding Styling' };
            let reviewHTML = '';

            const addRow = (label, value) => {
                if (value) reviewHTML += `<div class="q-review-group"><div class="q-review-label">${label}</div><div class="q-review-value">${value}</div></div>`;
            };

            addRow('Service', serviceNames[selectedService]);
            addRow('Name', name);
            addRow('Email', email);
            if (document.getElementById('q-phone').value) addRow('Phone', document.getElementById('q-phone').value);

            if (selectedService === 'consulting') {
                addRow('Business', document.getElementById('business-name').value);
                addRow('Stage', document.getElementById('business-stage').value);
                addRow('Help With', document.getElementById('h-help-areas').value);
            } else if (selectedService === 'fitting') {
                addRow('Occasion', document.getElementById('occasion').value);
                addRow('Timeline', document.getElementById('timeline').value);
                addRow('Style', document.getElementById('h-style-pref').value);
            } else if (selectedService === 'wedding') {
                addRow('Wedding Date', document.getElementById('wedding-date').value);
                addRow('Party Size', document.getElementById('party-size').value);
                addRow('Vision', document.getElementById('wedding-vision').value);
            }

            if (document.getElementById('q-message').value) addRow('Additional Notes', document.getElementById('q-message').value);

            document.getElementById('q-review').innerHTML = reviewHTML;
            goToStep(4);
        });

        // Step 4: Submit
        document.getElementById('submit-btn').addEventListener('click', () => {
            document.getElementById('contact-form').submit();
        });
    }

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            // Close all other answers in the same category
            const category = button.closest('.faq-category');
            category.querySelectorAll('.faq-question').forEach(otherBtn => {
                if (otherBtn !== button) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherBtn.nextElementSibling;
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.classList.remove('open');
                }
            });

            // Toggle current
            if (isOpen) {
                button.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                answer.classList.remove('open');
            } else {
                button.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 24 + 'px';
                answer.classList.add('open');
            }
        });
    });

    // ---- Parallax-style subtle movement on hero ----
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const parallaxSpeed = 0.3;
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
            }
        }, { passive: true });
    }

});
