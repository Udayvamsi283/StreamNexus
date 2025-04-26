// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");

  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error(
      "GSAP is not loaded. Please include GSAP via CDN or module bundler."
    );
    return;
  }

  console.log("GSAP Loaded:", gsap);

  // DOM Elements
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".close-btn");
  const overlay = document.querySelector(".overlay");
  const landingPage = document.querySelector(".landing-page");
  const dashboard = document.querySelector(".dashboard");
  const startStreamingCard = document.getElementById("start-streaming");
  const joinStreamCard = document.getElementById("join-stream");
  const viewRecordingsCard = document.getElementById("view-recordings");
  const notesResourcesCard = document.getElementById("notes-resources");
  const streamView = document.querySelector(".stream-view");
  const joinStreamView = document.querySelector(".join-stream-view");
  const stopStreamingBtn = document.querySelector(".stop-streaming-btn");
  const leaveClassBtn = document.querySelector(".leave-class-btn");
  const joinStreamModal = document.getElementById("join-stream-modal");
  const closeModal = document.querySelector(".close-modal");
  const joinClassBtn = document.getElementById("join-class-btn");
  const classCodeInput = document.getElementById("class-code-input");
  const videoStream = document.getElementById("video-stream");
  const joinVideoStream = document.getElementById("join-video-stream");
  const sidebarLinks = document.querySelectorAll(".sidebar-menu a");
  const cardsContainer = document.querySelector(".cards-container");
  const copyCodeBtn = document.getElementById("copy-code-btn");
  const classCodeDisplay = document.getElementById("class-code-display");
  const toggleCameraBtn = document.getElementById("toggle-camera");
  const toggleMicBtn = document.getElementById("toggle-mic");
  const switchCameraBtn = document.getElementById("switch-camera");
  const recordClassBtn = document.getElementById("record-class");
  const fullscreenBtn = document.getElementById("fullscreen-btn");


  // Initialize GSAP
  gsap.config({
    nullTargetWarn: false,
  });

  // Sidebar Toggle Functions
  function openSidebar() {
    sidebar.classList.add("active");
    overlay.style.display = "block";

    // Animate sidebar with GSAP
    gsap.fromTo(
      sidebar,
      { x: -300 },
      { x: 0, duration: 0.5, ease: "power2.out" }
    );

    // Fade in overlay
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }

  function closeSidebar() {
    // Animate sidebar with GSAP
    gsap.to(sidebar, {
      x: -300,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        sidebar.classList.remove("active");
      },
    });

    // Fade out overlay
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        overlay.style.display = "none";
      },
    });
  }

  // Event Listeners for Sidebar
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", openSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar when clicking on a link (mobile)
  if (sidebarLinks) {
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
  }

  // Fix for "Get Started" button - We need to wait for the header to load
  function setupGetStartedButton() {
    const getStartedBtn = document.querySelector(".get-started-btn");

    if (getStartedBtn) {
      console.log("Get Started button found, attaching event listener");

      getStartedBtn.addEventListener("click", () => {
        console.log("Get Started button clicked");

        // Animate landing page out
        gsap.to(landingPage, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          onComplete: () => {
            landingPage.style.display = "none";

            // Make sure dashboard is available
            if (dashboard) {
              dashboard.style.display = "block";

              // Animate dashboard in
              gsap.fromTo(
                dashboard,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.5 }
              );

              // Stagger animate cards
              gsap.fromTo(
                ".card",
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "back.out(1.7)",
                }
              );
            } else {
              console.error("Dashboard element not found");
            }
          },
        });
      });
    } else {
      setTimeout(setupGetStartedButton, 500);
    }
  }

  // Call the setup function after a short delay to ensure header is loaded
  setTimeout(setupGetStartedButton, 500);

  // Close Modal
  if (closeModal && joinStreamModal) {
    closeModal.addEventListener("click", () => {
      // Animate modal out
      gsap.to(".modal-content", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
          joinStreamModal.style.display = "none";
        },
      });
    });
  }

 
  // Add hover animations for cards
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const cardIcon = card.querySelector(".card-icon");
      if (cardIcon) {
        gsap.to(cardIcon, {
          y: -5,
          scale: 1.1,
          duration: 0.3,
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      const cardIcon = card.querySelector(".card-icon");
      if (cardIcon) {
        gsap.to(cardIcon, {
          y: 0,
          scale: 1,
          duration: 0.3,
        });
      }
    });
  });

  // Add hover animations for feature cards
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const featureIcon = card.querySelector(".feature-icon");
      if (featureIcon) {
        gsap.to(featureIcon, {
          y: -5,
          scale: 1.1,
          duration: 0.3,
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      const featureIcon = card.querySelector(".feature-icon");
      if (featureIcon) {
        gsap.to(featureIcon, {
          y: 0,
          scale: 1,
          duration: 0.3,
        });
      }
    });
  });

  // Add hover animations for team cards
  const teamCards = document.querySelectorAll(".team-card");

  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const teamPhoto = card.querySelector(".team-photo");
      if (teamPhoto) {
        gsap.to(teamPhoto, {
          scale: 1.05,
          duration: 0.3,
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      const teamPhoto = card.querySelector(".team-photo");
      if (teamPhoto) {
        gsap.to(teamPhoto, {
          scale: 1,
          duration: 0.3,
        });
      }
    });
  });

  // Run initial animations when window is fully loaded
  window.onload = () => {
    console.log("Window fully loaded, running animations");

    // Initial animations when page loads
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      gsap.fromTo(
        navbar,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }

    // Animate page content based on which page we're on
    if (document.querySelector(".landing-page")) {
      const landingText = document.querySelector(".landing-text");
      const landingImage = document.querySelector(".landing-image");
      const getStartedBtn = document.querySelector(".get-started-btn");

      if (landingText) {
        gsap.fromTo(
          landingText,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
        );
      }

      if (landingImage) {
        gsap.fromTo(
          landingImage,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
        );
      }

      // Add a subtle pulse animation to the Get Started button
      if (getStartedBtn) {
        gsap.to(getStartedBtn, {
          scale: 1.05,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    } else if (document.querySelector(".page-content")) {
      // Animate page title
      const pageTitle = document.querySelector(".page-title");
      if (pageTitle) {
        gsap.fromTo(
          pageTitle,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
      }

      // Animate sections with stagger
      if (document.querySelector(".instruction-section")) {
        gsap.fromTo(
          ".instruction-section",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );
      }

      if (document.querySelector(".info-section")) {
        gsap.fromTo(
          ".info-section",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );
      }

      if (document.querySelector(".feature-card")) {
        gsap.fromTo(
          ".feature-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
      }

      if (document.querySelector(".team-card")) {
        gsap.fromTo(
          ".team-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
      }
    }

    // Add a subtle animation to the hamburger menu
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    if (hamburgerMenu) {
      gsap.fromTo(
        hamburgerMenu,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1 }
      );
    }

    // Animate footer
    const footer = document.querySelector(".footer");
    if (footer) {
      gsap.fromTo(
        footer,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: "power2.out" }
      );
    }
  };
});
