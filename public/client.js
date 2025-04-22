// public/client.js
(function () {
  // DOM Elements
  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-btn");
  const userListContainer = document.getElementById("users");
  const nameInput = document.getElementById("name-input");
  const roleSelect = document.getElementById("role-select");
  const joinButton = document.getElementById("join-btn");
  const loginContainer = document.getElementById("login");
  const chatInterface = document.getElementById("chat-interface");
  const connectionStatus = document.getElementById("connection-status");
  const userInfo = document.getElementById("user-info");

  // Client state
  let socket;
  let userData = {
    name: "",
    role: "student",
    id: null,
  };

  // Keep track of message IDs we've already displayed
  const displayedMessages = new Set();

  // Initialize the application
  function init() {
    bindEvents();
  }

  // Bind UI events
  function bindEvents() {
    joinButton.addEventListener("click", joinChat);
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Join the chat room
  function joinChat() {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Please enter your name");
      return;
    }

    userData.name = name;
    userData.role = roleSelect.value;

    // Connect to WebSocket server
    connectToServer();

    // Hide login, show chat interface
    loginContainer.classList.add("hidden");
    chatInterface.classList.remove("hidden");

    // Update user info banner
    updateUserInfoBanner();
  }

  // Update the user info banner
  function updateUserInfoBanner() {
    userInfo.textContent = `${userData.name} (${
      userData.role === "teacher" ? "Teacher" : "Student"
    })`;
  }

  // Connect to WebSocket server
  function connectToServer() {
    try {
      // Get host dynamically
      const host = window.location.hostname;
      const port = window.location.port || 3000; // Default to 3000 if no port
      const serverAddress = `ws://${host}:${port}`;

      console.log(`Connecting to WebSocket server at: ${serverAddress}`);
      socket = new WebSocket(serverAddress);

      socket.onopen = () => {
        console.log("WebSocket connection established");
        connectionStatus.innerHTML = `
                    <span class="status-indicator status-online"></span>
                    Connected to classroom
                `;
        connectionStatus.style.backgroundColor = "#e8f5e9";

        // Send user identity
        socket.send(
          JSON.stringify({
            type: "identity",
            name: userData.name,
            role: userData.role,
          })
        );
      };

      socket.onmessage = handleMessage;

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        connectionStatus.innerHTML = `
                    <span class="status-indicator status-offline"></span>
                    Disconnected. Attempting to reconnect...
                `;
        connectionStatus.style.backgroundColor = "#ffebee";

        // Try to reconnect after 5 seconds
        setTimeout(connectToServer, 5000);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        connectionStatus.innerHTML = `
                    <span class="status-indicator status-offline"></span>
                    Connection error. Check if server is running.
                `;
        connectionStatus.style.backgroundColor = "#ffebee";
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      connectionStatus.innerHTML = `
                <span class="status-indicator status-offline"></span>
                Failed to connect. Check if server is running.
            `;
      connectionStatus.style.backgroundColor = "#ffebee";
    }
  }

  // Handle incoming messages
  function handleMessage(event) {
    try {
      console.log("Received message:", event.data);
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "chat":
          // Check if we've already displayed this message to avoid duplicates
          if (!displayedMessages.has(message.id)) {
            displayedMessages.add(message.id);
            displayMessage(message, false);
          }
          break;

        case "history":
          displayMessageHistory(message.data);
          break;

        case "userList":
          updateUserList(message.data);
          break;

        case "identityConfirmed":
          // Update user data with server-assigned ID
          userData.id = message.id;
          console.log("Identity confirmed, assigned ID:", userData.id);
          break;

        default:
          console.log("Unknown message type:", message);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  // Send a message to the server
  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "chat",
        text: text,
        sender: userData.name,
        role: userData.role,
        timestamp: new Date().toISOString(),
        id: "local-" + Date.now().toString(), // Local ID for detecting duplicates
      };

      console.log("Sending message:", message);
      socket.send(JSON.stringify(message));
      messageInput.value = "";

      // Display message locally for immediate feedback
      displayMessage(message, true);
      displayedMessages.add(message.id);
    } else {
      alert("Not connected to server");
    }
  }

  // Display a single message
  function displayMessage(message, isOwnMessage) {
    const messageElement = document.createElement("div");
    const roleClass = isOwnMessage ? "own-message" : message.role || "student";
    messageElement.className = `message ${roleClass}`;

    const time = new Date(message.timestamp).toLocaleTimeString();

    messageElement.innerHTML = `
            <div class="message-header">
                <span>${message.sender || "Anonymous"} ${
      message.role === "teacher" ? "(Teacher)" : ""
    }</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHTML(message.text)}</div>
        `;

    messageElement.setAttribute("data-message-id", message.id);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Display message history
  function displayMessageHistory(messages) {
    messagesContainer.innerHTML = "";
    displayedMessages.clear();

    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        displayedMessages.add(message.id);
        displayMessage(message, message.sender === userData.name);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
      console.error("Invalid message history format:", messages);
    }
  }

  // Update the user list
  function updateUserList(users) {
    userListContainer.innerHTML = "";

    if (!Array.isArray(users)) {
      console.error("Invalid user list format:", users);
      return;
    }

    // Sort by role (teachers first)
    users.sort((a, b) => {
      if (a.role === "teacher" && b.role !== "teacher") return -1;
      if (a.role !== "teacher" && b.role === "teacher") return 1;
      return a.name.localeCompare(b.name);
    });

    users.forEach((user) => {
      const userElement = document.createElement("div");
      userElement.className = `user ${user.role}`;
      userElement.innerHTML = `
                <span class="status-indicator status-online"></span>
                ${user.name} ${user.role === "teacher" ? "(Teacher)" : ""}
            `;
      userListContainer.appendChild(userElement);
    });
  }

  // Helper function to escape HTML and prevent XSS
  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize the application
  init();
})();