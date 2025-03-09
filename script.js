// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Import GSAP (if not already included via CDN or other means)
  // import { gsap } from "gsap"; // Uncomment if using a module bundler

  // Ensure GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error(
      "GSAP is not loaded. Please include GSAP via CDN or module bundler."
    );
    return;
  }

  // DOM Elements
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".close-btn");
  const overlay = document.querySelector(".overlay");
  const getStartedBtn = document.querySelector(".get-started-btn");
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
  console.log("GSAP Loaded:", gsap); // Should log the GSAP object, not `undefined`

  // Generate a random class code
  function generateClassCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

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
  hamburgerMenu.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // Close sidebar when clicking on a link (mobile)
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Check if we're on the streaming page
  const isStreamingPage = document.querySelector(".streaming-page");
  if (isStreamingPage) {
    // Initialize streaming page
    initializeStreamingPage();
  }

  // Initialize streaming page
  function initializeStreamingPage() {
    // Generate and display class code
    const classCode = generateClassCode();
    if (classCodeDisplay) {
      classCodeDisplay.textContent = classCode;

      // Animate class code
      gsap.fromTo(
        classCodeDisplay.parentElement,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out" }
      );
    }

    // Request camera and microphone access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set the stream to the video element
        videoStream.srcObject = stream;

        // Setup controls
        setupStreamControls(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert(
          "Unable to access camera and microphone. Please check your permissions."
        );
      });
  }

  // Setup stream controls
  function setupStreamControls(stream) {
    let isCameraOn = true;
    let isMicOn = true;
    let isRecording = false;

    // Toggle camera
    toggleCameraBtn.addEventListener("click", () => {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        isCameraOn = !isCameraOn;
        videoTracks[0].enabled = isCameraOn;

        // Update button appearance
        toggleCameraBtn.innerHTML = isCameraOn
          ? '<i class="fas fa-video"></i>'
          : '<i class="fas fa-video-slash"></i>';

        toggleCameraBtn.classList.toggle("muted", !isCameraOn);

        // Animate button
        gsap.to(toggleCameraBtn, {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        });
      }
    });

    // Toggle microphone
    toggleMicBtn.addEventListener("click", () => {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        isMicOn = !isMicOn;
        audioTracks[0].enabled = isMicOn;

        // Update button appearance
        toggleMicBtn.innerHTML = isMicOn
          ? '<i class="fas fa-microphone"></i>'
          : '<i class="fas fa-microphone-slash"></i>';

        toggleMicBtn.classList.toggle("muted", !isMicOn);

        // Animate button
        gsap.to(toggleMicBtn, {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        });
      }
    });

    // Switch camera (for mobile devices)
    if (
      "mediaDevices" in navigator &&
      "enumerateDevices" in navigator.mediaDevices
    ) {
      switchCameraBtn.addEventListener("click", async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );

          if (videoDevices.length > 1) {
            // Get the ID of the current video device
            const currentVideoTrack = stream.getVideoTracks()[0];
            const currentDeviceId = currentVideoTrack.getSettings().deviceId;

            // Find the next video device
            const currentIndex = videoDevices.findIndex(
              (device) => device.deviceId === currentDeviceId
            );
            const nextDevice =
              videoDevices[(currentIndex + 1) % videoDevices.length];

            // Get a new stream with the next video device
            const newStream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: nextDevice.deviceId } },
              audio: true,
            });

            // Replace the video track
            const newVideoTrack = newStream.getVideoTracks()[0];
            const sender = stream.getVideoTracks()[0];
            sender.replaceTrack(newVideoTrack);

            // Update the stream
            stream.removeTrack(currentVideoTrack);
            stream.addTrack(newVideoTrack);

            // Animate button
            gsap.to(switchCameraBtn, {
              rotate: 360,
              duration: 0.5,
              ease: "power2.inOut",
            });
          } else {
            alert("Only one video device available.");
          }
        } catch (error) {
          console.error("Error switching camera:", error);
          alert("Unable to switch camera. Please check your permissions.");
        }
      });
    } else {
      switchCameraBtn.style.display = "none";
    }

    // Record class (placeholder functionality)
    recordClassBtn.addEventListener("click", () => {
      isRecording = !isRecording;

      // Update button appearance
      recordClassBtn.innerHTML = isRecording
        ? '<i class="fas fa-stop-circle"></i>'
        : '<i class="fas fa-record-vinyl"></i>';

      recordClassBtn.classList.toggle("active", isRecording);

      // Animate button
      gsap.to(recordClassBtn, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });

      // Placeholder alert
      alert(
        isRecording
          ? "Recording started (placeholder)"
          : "Recording stopped (placeholder)"
      );
    });

    // Fullscreen button
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        if (videoStream.requestFullscreen) {
          videoStream.requestFullscreen();
        } else if (videoStream.webkitRequestFullscreen) {
          /* Safari */
          videoStream.webkitRequestFullscreen();
        } else if (videoStream.msRequestFullscreen) {
          /* IE11 */
          videoStream.msRequestFullscreen();
        }

        // Animate button
        gsap.to(fullscreenBtn, {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        });
      });
    }

    // Stop streaming button
    if (stopStreamingBtn) {
      stopStreamingBtn.addEventListener("click", () => {
        // Stop all tracks in the stream
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }

        // If we're on the main page, return to dashboard
        if (streamView) {
          // Animate stream view out
          gsap.to(streamView, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            onComplete: () => {
              streamView.style.display = "none";
              cardsContainer.style.display = "grid";

              // Animate cards back in
              gsap.fromTo(
                cardsContainer,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.5 }
              );
            },
          });
        } else {
          // If we're on the streaming page, redirect to index
          window.location.href = "index.html";
        }
      });
    }

    // Leave class button
    if (leaveClassBtn) {
      leaveClassBtn.addEventListener("click", () => {
        // Stop all tracks in the stream
        if (joinVideoStream.srcObject) {
          const tracks = joinVideoStream.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }

        // Animate join stream view out
        gsap.to(joinStreamView, {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          onComplete: () => {
            joinStreamView.style.display = "none";
            cardsContainer.style.display = "grid";

            // Animate cards back in
            gsap.fromTo(
              cardsContainer,
              { opacity: 0, y: -30 },
              { opacity: 1, y: 0, duration: 0.5 }
            );
          },
        });
      });
    }
  }

  // Copy class code to clipboard
  if (copyCodeBtn && classCodeDisplay) {
    copyCodeBtn.addEventListener("click", () => {
      const code = classCodeDisplay.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          // Show success animation
          gsap.to(copyCodeBtn, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          });

          // Temporarily change icon to checkmark
          const originalIcon = copyCodeBtn.innerHTML;
          copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';

          // Reset icon after 2 seconds
          setTimeout(() => {
            copyCodeBtn.innerHTML = originalIcon;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          alert("Failed to copy class code. Please try again.");
        });
    });
  }

  // Transition from Landing Page to Dashboard
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      // Animate landing page out
      gsap.to(landingPage, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
          landingPage.style.display = "none";
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
        },
      });
    });
  }

  // Start Streaming Card Click
  if (startStreamingCard) {
    startStreamingCard.addEventListener("click", () => {
      // Generate class code
      const classCode = generateClassCode();
      if (classCodeDisplay) {
        classCodeDisplay.textContent = classCode;
      }

      // Request camera and microphone access
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Set the stream to the video element
          videoStream.srcObject = stream;

          // Setup controls
          setupStreamControls(stream);

          // Animate cards out
          gsap.to(cardsContainer, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            onComplete: () => {
              cardsContainer.style.display = "none";
              streamView.style.display = "flex";

              // Animate stream view in
              gsap.fromTo(
                streamView,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5 }
              );

              // Animate class code
              gsap.fromTo(
                ".class-code-container",
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
              );
            },
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
          alert(
            "Unable to access camera and microphone. Please check your permissions."
          );
        });
    });
  }

  // Join Stream Card Click
  if (joinStreamCard) {
    joinStreamCard.addEventListener("click", () => {
      joinStreamModal.style.display = "flex";

      // Animate modal in
      gsap.fromTo(
        ".modal-content",
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.5 }
      );

      // Focus on input
      classCodeInput.focus();
    });
  }

  // Close Modal
  if (closeModal) {
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

  // Close modal when clicking outside
  if (joinStreamModal) {
    joinStreamModal.addEventListener("click", (e) => {
      if (e.target === joinStreamModal) {
        // Animate modal out
        gsap.to(".modal-content", {
          opacity: 0,
          y: -50,
          duration: 0.5,
          onComplete: () => {
            joinStreamModal.style.display = "none";
          },
        });
      }
    });
  }

  // Join Class Button Click
  if (joinClassBtn) {
    joinClassBtn.addEventListener("click", () => {
      const classCode = classCodeInput.value.trim();

      if (classCode === "") {
        alert("Please enter a class code");
        return;
      }

      // For demo purposes, any code is valid
      // In a real app, you would validate the code against a database

      // Close modal
      joinStreamModal.style.display = "none";

      // Animate cards out
      gsap.to(cardsContainer, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        onComplete: () => {
          cardsContainer.style.display = "none";
          joinStreamView.style.display = "flex";

          // Animate join stream view in
          gsap.fromTo(
            joinStreamView,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5 }
          );

          // In a real app, you would connect to the stream here
          // For demo, we'll just show a placeholder
          joinVideoStream.poster = "/placeholder.svg?height=400&width=700";
        },
      });
    });
  }

  // View Recordings Card Click (placeholder functionality)
  if (viewRecordingsCard) {
    viewRecordingsCard.addEventListener("click", () => {
      alert("View Recordings feature will be implemented in the next phase.");
    });
  }

  // Notes & Resources Card Click (placeholder functionality)
  if (notesResourcesCard) {
    notesResourcesCard.addEventListener("click", () => {
      alert("Notes & Resources feature will be implemented in the next phase.");
    });
  }

  // Add hover animations for cards
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card.querySelector(".card-icon"), {
        y: -5,
        scale: 1.1,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card.querySelector(".card-icon"), {
        y: 0,
        scale: 1,
        duration: 0.3,
      });
    });
  });

  // Add hover animations for feature cards
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card.querySelector(".feature-icon"), {
        y: -5,
        scale: 1.1,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card.querySelector(".feature-icon"), {
        y: 0,
        scale: 1,
        duration: 0.3,
      });
    });
  });

  // Add hover animations for team cards
  const teamCards = document.querySelectorAll(".team-card");

  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card.querySelector(".team-photo"), {
        scale: 1.05,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card.querySelector(".team-photo"), {
        scale: 1,
        duration: 0.3,
      });
    });
  });

  // Initial animations when page loads
  gsap.fromTo(
    ".navbar",
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
  );

  // Animate page content based on which page we're on
  if (document.querySelector(".landing-page")) {
    gsap.fromTo(
      ".landing-text",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    gsap.fromTo(
      ".landing-image",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
    );

    // Add a subtle pulse animation to the Get Started button
    gsap.to(".get-started-btn", {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  } else if (document.querySelector(".page-content")) {
    // Animate page title
    gsap.fromTo(
      ".page-title",
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

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
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }

    if (document.querySelector(".team-card")) {
      gsap.fromTo(
        ".team-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }
  }

  // Add a subtle animation to the hamburger menu
  gsap.fromTo(
    ".hamburger-menu",
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1 }
  );

  // Animate footer
  gsap.fromTo(
    ".footer",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: "power2.out" }
  );
});
