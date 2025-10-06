document.addEventListener("DOMContentLoaded", () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger not found. Make sure the scripts are loaded before this file.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    
    const bottleContainer = document.querySelector(".bottle-container");
    if (!bottleContainer) {
        console.warn("No element with class .bottle-container found.");
        return;
    }
    
    // Get responsive values based on screen size
    function getResponsiveValues() {
        const width = window.innerWidth;
        
        // Mobile (< 640px)
        if (width < 640) {
            return {
                phase1: { x: -50, y: 80, scale: 0.7 },
                phase2: { x: -20, y: 120, scale: 0.85, rotation: -15 },
                phase3: { x: 0, y: 180, scale: 1.2, rotation: 0 },
                item1: { x: 30, rotation: 10 },
                item2: { x: -30, rotation: -10 },
                scrollEnd: "+=2000"
            };
        }
        // Tablet (640px - 1024px)
        else if (width < 1024) {
            return {
                phase1: { x: -150, y: 300, scale: 0.75 },
                phase2: { x: -80, y: 450, scale: 0.9, rotation: -18 },
                phase3: { x: -40, y: 650, scale: 1.3, rotation: 0 },
                item1: { x: 60, rotation: 15 },
                item2: { x: -150, rotation: -15 },
                scrollEnd: "+=2500"
            };
        }
        // Laptop (1024px - 1440px)
        else if (width < 1440) {
            return {
                phase1: { x: -350, y: 700, scale: 0.8 },
                phase2: { x: -200, y: 1200, scale: 0.95, rotation: -20 },
                phase3: { x: -300, y: 1800, scale: 1.4, rotation: 0 },
                item1: { x: 80, rotation: 18 },
                item2: { x: -250, rotation: -18 },
                scrollEnd: "+=2800"
            };
        }
        // Desktop (1440px - 1920px)
        else if (width < 1920) {
            return {
                phase1: { x: -450, y: 900, scale: 0.84 },
                phase2: { x: -250, y: 1600, scale: 0.98, rotation: -20 },
                phase3: { x: -400, y: 2400, scale: 1.45, rotation: 0 },
                item1: { x: 90, rotation: 20 },
                item2: { x: -300, rotation: -20 },
                scrollEnd: "+=3000"
            };
        }
        // Large Desktop (>= 1920px)
        else {
            return {
                phase1: { x: -560, y: 1150, scale: 0.86 },
                phase2: { x: -300, y: 2100, scale: 1, rotation: -20 },
                phase3: { x: -530, y: 3100, scale: 1.5, rotation: 0 },
                item1: { x: 100, rotation: 20 },
                item2: { x: -350, rotation: -20 },
                scrollEnd: "+=3000"
            };
        }
    }
    
    // Create scroll-driven GSAP timeline
    function createTimeline(markers = false) {
        const values = getResponsiveValues();
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#product",
                start: "top bottom",
                end: values.scrollEnd,
                scrub: 2,
                markers: markers
            }
        });
        
        // Phase 1 - move bottle down-left (0-40% of timeline)
        tl.to(bottleContainer, {
            x: values.phase1.x,
            y: values.phase1.y,
            scale: values.phase1.scale,
            duration: 4,
            ease: "none"
        }, 0);
        
        // Phase 2 - move toward viewport center (40-70% of timeline)
        tl.to(bottleContainer, {
            x: values.phase2.x,
            y: values.phase2.y,
            scale: values.phase2.scale,
            rotation: values.phase2.rotation,
            duration: 3,
            ease: "none"
        }, 4);
        
        // Phase 3 - zoom in to center (70-100% of timeline)
        tl.to(bottleContainer, {
            x: values.phase3.x,
            y: values.phase3.y,
            scale: values.phase3.scale,
            rotation: values.phase3.rotation,
            duration: 4,
            ease: "none"
        }, 7);
        
        return tl;
    }
    
    // Create item animations
    function createItemAnimations() {
        const values = getResponsiveValues();
        
        // Kill existing animations if they exist
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars.trigger === ".item1" || st.vars.trigger === ".item2") {
                st.kill();
            }
        });
        
        // Item 1 animation
        gsap.to(".item1", {
            scrollTrigger: {
                trigger: ".item1",
                start: "top 80%",
                end: "bottom 60%",
                scrub: true
            },
            x: values.item1.x,
            rotation: values.item1.rotation,
            duration: 1.2,
            ease: "power1.out"
        });
        
        // Item 2 animation
        gsap.to(".item2", {
            scrollTrigger: {
                trigger: ".item1",
                start: "top 70%",
                end: "bottom 60%",
                scrub: true
            },
            x: values.item2.x,
            rotation: values.item2.rotation,
            duration: 1.2,
            ease: "power1.out"
        });
    }
    
    // Initialize animations
    let mainTL = createTimeline(false);
    createItemAnimations();
    
    // Refresh ScrollTrigger on resize with debouncing
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Kill existing timeline
            if (mainTL && mainTL.scrollTrigger) {
                mainTL.scrollTrigger.kill();
                mainTL.kill();
            }
            
            // Refresh and recreate
            ScrollTrigger.refresh();
            mainTL = createTimeline(false);
            createItemAnimations();
        }, 150);
    });
});