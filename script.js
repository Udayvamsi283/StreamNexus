// Global variables
let stream;
let darkMode = true;

// Modal functionality
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal.style.display === "block") {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  } else {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modals = document.getElementsByClassName("modal");
  for (let modal of modals) {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
};

// Escape key to close modals
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  }
});

// Smartboard functionality
function toggleSmartboard(show) {
  const smartboardContainer = document.getElementById("smartboard-container");
  const smartboard = document.querySelector(".smartboard");

  if (show) {
    smartboardContainer.classList.add("active");
    setTimeout(() => {
      smartboard.classList.add("active");
    }, 50);
  } else {
    smartboard.classList.remove("active");
    setTimeout(() => {
      smartboardContainer.classList.remove("active");
    }, 500);
  }
}

function startClass() {
  console.log("Starting class...");
  toggleSmartboard(true);
  startWebcam();
}

function joinClass() {
  console.log("Joining class...");
  toggleSmartboard(true);
  startWebcam();
}

function closeSmartboard() {
  toggleSmartboard(false);
  stopWebcam();
}

// Webcam functionality
async function startWebcam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoElement = document.getElementById("webcam-stream");
    videoElement.srcObject = stream;
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
}

function stopWebcam() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

// YouTube live stream
function loadYouTubeStream(videoId) {
  const iframe = document.getElementById("youtube-stream");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&live=1`;
}

// Settings functionality
const cameraToggle = document.getElementById("camera-toggle");
const micToggle = document.getElementById("mic-toggle");
const cameraPreview = document.getElementById("camera-preview");
const audioMeter = document.getElementById("audio-meter");
const mediaPreview = document.getElementById("media-preview");

cameraToggle.addEventListener("change", toggleCamera);
micToggle.addEventListener("change", toggleMicrophone);

async function toggleCamera() {
  if (cameraToggle.checked) {
    try {
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micToggle.checked,
        });
      } else {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = true;
      }
      cameraPreview.srcObject = stream;
      mediaPreview.style.display = "block";
    } catch (error) {
      console.error("Error accessing camera:", error);
      cameraToggle.checked = false;
    }
  } else {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = false;
    }
  }
}

async function toggleMicrophone() {
  if (micToggle.checked) {
    try {
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: cameraToggle.checked,
          audio: true,
        });
      } else {
        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = true;
      }
      cameraPreview.srcObject = stream;
      mediaPreview.style.display = "block";
      visualizeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      micToggle.checked = false;
    }
  } else {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = false;
    }
    audioMeter.style.width = "0%";
  }
}

function visualizeAudio() {
  if (!stream) return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function updateAudioMeter() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
    const volume = Math.min(100, Math.max(0, average * 2));
    audioMeter.style.width = `${volume}%`;
    requestAnimationFrame(updateAudioMeter);
  }

  updateAudioMeter();
}

// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("change", toggleDarkMode);

function toggleDarkMode() {
  darkMode = darkModeToggle.checked;
  document.body.classList.toggle("dark-mode", darkMode);
  // Update other elements that need to change in dark mode
}

// Chat functionality
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

chatInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Login form submission
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("Login attempted with:", username, password);
    // Add your login logic here
    toggleModal("profile-modal");
  });

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Add any initialization code here
  console.log("StreamNexus initialized");
});

// Existing code

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    console.log("StreamNexus initialized");
    
    // Declare darkModeToggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Enable dark mode by default
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.slide, #our-team, .team-member').forEach(el => {
        observer.observe(el);
    });
});

// Slide-in buttons functionality
const leftButton = document.querySelector('.slide-button.left');
const rightButton = document.querySelector('.slide-button.right');

leftButton.addEventListener('mouseenter', () => {
    leftButton.style.transform = 'translateY(-50%) translateX(95px)';
});

leftButton.addEventListener('mouseleave', () => {
    leftButton.style.transform = 'translateY(-50%)';
});

rightButton.addEventListener('mouseenter', () => {
    rightButton.style.transform = 'translateY(-50%) translateX(-95px)';
});

rightButton.addEventListener('mouseleave', () => {
    rightButton.style.transform = 'translateY(-50%)';
});