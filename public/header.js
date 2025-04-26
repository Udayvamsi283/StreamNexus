// header.js
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("header-container").innerHTML = `
    <!-- Hamburger Menu Button -->
    <div class="hamburger-menu">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>STREAM<span >NEXUS</span></h3>
        <div class="close-btn">&times;</div>
      </div>
      <ul class="sidebar-menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="how-to-use.html">How to Use</a></li>
        <li><a href="how-it-works.html">How It Works</a></li>
        <li><a href="why-streamnexus.html">Why STREAM<span >NEXUS</span></a></li>
        <li><a href="our-team.html">Our Team</a></li>
        <li><a href="skills-to-learn.html">Skills to Learn</a></li>
        <li><a href="career-paths.html">Career Paths</a></li>
        <li><a href="mailto:StreamNexusEdu@gmail.com" class="help-link">Help</a></li>
      </ul>
    </div>

    <!-- Overlay for sidebar -->
    <div class="overlay"></div>

    <!-- Top Navigation Bar -->
    <nav class="navbar">
      <div class="logo-container">
      <a href="./index.html"><img src="./img/Logo.png" alt="Logo" class="logo" height="50"></a>
      </div>
      <div class="college-logo-container">
      <a href="https://vignaniit.edu.in/" target="blank"><img src="./img/Clg_Logo.png" alt="College Logo" class="college-logo" height="50"></a>
      </div>
      <div class="college-logo-container"><a href="./skills-to-learn.html"><img src="./img/cse-logo.png" height="50"></a></div>
    </nav>

  `;

  // Sidebar Toggle
  const hamburger = document.querySelector(".hamburger-menu");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const closeBtn = document.querySelector(".close-btn");

  hamburger.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Login Modal Functionality
  const loginModal = document.querySelector(".login-modal");
  const openLoginModal = document.querySelector(".profile-icon");
  const closeLoginModal = document.querySelector(".close-login-modal");

  openLoginModal.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  closeLoginModal.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
});
