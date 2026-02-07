/**
 * Sinodol Website - JavaScript
 * Handles: Navigation, Scroll Animations, FAQ Accordion, Form Validation
 */

// TRACKING: This file contains comments for analytics integration points

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initFAQ();
    initSmoothScroll();
    initUrgencyCountdown();
});

/**
 * Navigation - Sticky with scroll effect
 */
function initNavigation() {
    const nav = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for shadow effect
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // TRACKING: nav_cta_click
    const navCTA = document.querySelector('.nav-cta');
    if (navCTA) {
        navCTA.addEventListener('click', function () {
            // TRACKING: navigation_cta_click
            console.log('TRACKING: nav_cta_click');
        });
    }
}

/**
 * Scroll Animations - Fade in elements on scroll
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (element) {
        observer.observe(element);
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                // TRACKING: faq_item_open
                console.log('TRACKING: faq_open - ' + question.textContent.trim().substring(0, 30));
            }
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // TRACKING: internal_link_click
                console.log('TRACKING: scroll_to_section - ' + href);
            }
        });
    });
}

/**
 * Urgency Countdown (for ethical scarcity)
 * Updates the stock counter periodically
 */
function initUrgencyCountdown() {
    const stockElement = document.querySelector('.final-cta-stock span:last-child');

    if (!stockElement) return;

    // Simulate real-time stock (ethical - based on documented urgency)
    let currentStock = 14;

    // Update stock every 2-5 minutes randomly (simulated)
    function updateStock() {
        // Only decrease occasionally for realism
        if (Math.random() > 0.7 && currentStock > 5) {
            currentStock--;
            stockElement.textContent = 'Quedan ' + currentStock + ' kits disponibles para despacho hoy mismo';
        }

        // Schedule next update
        const nextUpdate = Math.floor(Math.random() * (300000 - 120000) + 120000); // 2-5 min
        setTimeout(updateStock, nextUpdate);
    }

    // Start after 1 minute
    setTimeout(updateStock, 60000);
}

/**
 * Form Validation (for future form implementation)
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
            }
        }

        // Phone validation (Colombia)
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^(\+57)?[0-9]{10}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                isValid = false;
                field.classList.add('error');
            }
        }
    });

    return isValid;
}

/**
 * WhatsApp Message Builder
 * Creates pre-filled WhatsApp messages based on selected plan
 */
function buildWhatsAppMessage(plan, price) {
    const baseUrl = 'https://wa.me/573001234567';
    const message = encodeURIComponent(
        'Hola! Quiero ordenar el ' + plan + ' de Sinodol por ' + price + '. ¿Está disponible?'
    );
    return baseUrl + '?text=' + message;
}

/**
 * Pricing Card CTA Handlers
 */
document.querySelectorAll('.pricing-card .btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('.pricing-name').textContent;
        const planPrice = card.querySelector('.pricing-amount').textContent;

        // TRACKING: pricing_plan_selected
        console.log('TRACKING: pricing_selected - ' + planName);

        // Update WhatsApp link dynamically
        const whatsappUrl = buildWhatsAppMessage(planName, '$' + planPrice);

        // If it's the main CTA, redirect to WhatsApp
        if (this.classList.contains('btn-primary')) {
            e.preventDefault();
            window.open(whatsappUrl, '_blank');
        }
    });
});

/**
 * Hero CTA Tracking
 */
const heroCTA = document.querySelector('.hero .btn-primary');
if (heroCTA) {
    heroCTA.addEventListener('click', function () {
        // TRACKING: hero_cta_click
        console.log('TRACKING: hero_cta_click');
    });
}

/**
 * Final CTA Tracking
 */
const finalCTA = document.querySelector('.final-cta .btn-primary');
if (finalCTA) {
    finalCTA.addEventListener('click', function () {
        // TRACKING: final_cta_click
        console.log('TRACKING: final_cta_click');
    });
}

/**
 * WhatsApp Float Button Tracking
 */
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', function () {
        // TRACKING: whatsapp_float_click
        console.log('TRACKING: whatsapp_float_click');
    });
}

/**
 * Scroll Depth Tracking
 */
let scrollMilestones = [25, 50, 75, 100];
let milestonesReached = [];

window.addEventListener('scroll', function () {
    const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollMilestones.forEach(function (milestone) {
        if (scrollPercent >= milestone && !milestonesReached.includes(milestone)) {
            milestonesReached.push(milestone);
            // TRACKING: scroll_depth
            console.log('TRACKING: scroll_depth_' + milestone);
        }
    });
});

/**
 * Time on Page Tracking
 */
let timeOnPage = 0;
let timeIntervals = [30, 60, 120, 300]; // seconds
let timeEventsTracked = [];

setInterval(function () {
    timeOnPage++;

    timeIntervals.forEach(function (interval) {
        if (timeOnPage === interval && !timeEventsTracked.includes(interval)) {
            timeEventsTracked.push(interval);
            // TRACKING: time_on_page
            console.log('TRACKING: time_on_page_' + interval + 's');
        }
    });
}, 1000);

// Log page load
console.log('TRACKING: page_load - Sinodol Homepage');
