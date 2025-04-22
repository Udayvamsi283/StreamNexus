// server.js - Improved version
const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Store connected clients
const clients = new Map();
let messageHistory = [];
const MAX_HISTORY = 100; // Store last 100 messages

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  const userId = Date.now().toString();
  const clientInfo = {
    id: userId,
    name: "Anonymous",
    role: "student", // Default role
    ws: ws,
    ip: req.socket.remoteAddress,
  };

  clients.set(userId, clientInfo);
  console.log(`New client connected: ${userId} from IP: ${clientInfo.ip}`);

  // Send message history to new client
  if (messageHistory.length > 0) {
    ws.send(
      JSON.stringify({
        type: "history",
        data: messageHistory,
      })
    );
  }

  // Message handler for each client
  ws.on("message", (messageData) => {
    try {
      const message = JSON.parse(messageData.toString());

      // Handle different message types
      if (message.type === "chat") {
        // Add timestamp and ID to message
        message.timestamp = new Date().toISOString();
        message.id =
          Date.now().toString() + Math.random().toString(36).substr(2, 5);

        console.log(`Chat from ${message.sender}: ${message.text}`);

        // Store message in history
        messageHistory.push(message);
        if (messageHistory.length > MAX_HISTORY) {
          messageHistory.shift(); // Remove oldest message
        }

        // Broadcast message to all OTHER clients
        broadcastExcept(message, userId);
      } else if (message.type === "identity") {
        // Update client information
        clientInfo.name = message.name || clientInfo.name;
        clientInfo.role = message.role || clientInfo.role;
        console.log(
          `Updated client info: ${clientInfo.id}, Name: ${clientInfo.name}, Role: ${clientInfo.role}`
        );

        // Send confirmation back to the client
        ws.send(
          JSON.stringify({
            type: "identityConfirmed",
            name: clientInfo.name,
            role: clientInfo.role,
            id: userId,
          })
        );

        // Notify all clients about user list update
        broadcastUserList();
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    clients.delete(userId);
    console.log(`Client disconnected: ${userId}`);
    broadcastUserList();
  });

  // Send initial user list to new client
  broadcastUserList();
});

// Broadcast message to all connected clients
function broadcast(message) {
  console.log(`Broadcasting message to ${clients.size} clients`);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Broadcast message to all clients except the sender
function broadcastExcept(message, senderId) {
  console.log(`Broadcasting message to all except ${senderId}`);
  clients.forEach((client, id) => {
    if (id !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Broadcast the current user list to all clients
function broadcastUserList() {
  const userList = Array.from(clients.values()).map((client) => ({
    id: client.id,
    name: client.name,
    role: client.role,
  }));

  const message = {
    type: "userList",
    data: userList,
  };

  broadcast(message);
}

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  const networkInterfaces = require("os").networkInterfaces();

  // Display all available IP addresses on the LAN
  console.log("Available on the following addresses:");
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`http://${iface.address}:${PORT}`);
      }
    });
  });
});
