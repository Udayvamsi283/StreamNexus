const fs = require("fs");
const https = require("https");
const express = require("express");
const socketIo = require("socket.io");
const os = require("os");
// Add multicast-dns for network discovery (safer alternative to bonjour)
const mdns = require('multicast-dns')();

const app = express();

// Get SSL certificates
const options = {
    key: fs.readFileSync("key.pem"),  
    cert: fs.readFileSync("cert.pem"),
};

const server = https.createServer(options, app);
const io = socketIo(server);

// Serve static files
app.use(express.static("public"));

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
});

// Serve the service worker
app.get("/service-worker.js", (req, res) => {
    res.sendFile(__dirname + "/public/service-worker.js");
});

// Serve manifest for PWA
app.get("/manifest.json", (req, res) => {
    res.sendFile(__dirname + "/public/manifest.json");
});

// API endpoint for network status
app.get("/api/network-info", (req, res) => {
    res.json({
        interfaces: getNetworkAddresses(),
        serverTime: new Date().toISOString()
    });
});

// Get all network interfaces
function getNetworkAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                addresses.push({
                    address: iface.address,
                    name: name,
                    netmask: iface.netmask
                });
            }
        }
    }
    
    return addresses;
}

// Room management
const rooms = {};

// Enhanced room management with persistence
const roomsFile = "./rooms-data.json";

// Load existing rooms from file if it exists
try {
    if (fs.existsSync(roomsFile)) {
        const roomsData = fs.readFileSync(roomsFile);
        const savedRooms = JSON.parse(roomsData);
        Object.assign(rooms, savedRooms);
        console.log("Loaded existing rooms from file");
    }
} catch (err) {
    console.error("Failed to load rooms data:", err);
}

// Save rooms to file periodically
function saveRooms() {
    try {
        fs.writeFileSync(roomsFile, JSON.stringify(rooms));
    } catch (err) {
        console.error("Failed to save rooms data:", err);
    }
}

// Save rooms every 5 minutes and on shutdown
const saveInterval = setInterval(saveRooms, 5 * 60 * 1000);
process.on('SIGINT', () => {
    clearInterval(saveInterval);
    saveRooms();
    process.exit(0);
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Send network info to client
    socket.emit("network-info", {
        interfaces: getNetworkAddresses(),
        socketId: socket.id,
        serverTime: new Date().toISOString()
    });

    // Teacher creates a room
    socket.on("create-room", (roomID) => {
        if (!rooms[roomID]) {
            rooms[roomID] = { 
                teacher: socket.id, 
                students: [],
                created: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            socket.join(roomID);
            console.log(`Teacher created and joined room ${roomID}`);
            saveRooms(); // Save room data
        }
    });

    // Student checks if room exists before joining
    socket.on("check-room", (roomID) => {
        if (rooms[roomID]) {
            socket.emit("room-status", { 
                exists: true, 
                roomID: roomID 
            });
        } else {
            socket.emit("room-status", { exists: false });
        }
    });

    // Student joins room
    socket.on("join-room", (roomID) => {
        if (rooms[roomID]) {
            rooms[roomID].students.push(socket.id);
            rooms[roomID].lastActive = new Date().toISOString();
            socket.join(roomID);
            
            io.to(rooms[roomID].teacher).emit("user-joined", socket.id);
            socket.emit("connected-to-teacher", rooms[roomID].teacher);
            
            console.log(`Student ${socket.id} joined room ${roomID}`);
            saveRooms(); // Save room data
        } else {
            socket.emit("error", { message: "Room does not exist!" });
        }
    });

    // WebRTC signaling
    socket.on("signal", (data) => {
        const signalData = {
            ...data,
            senderID: socket.id
        };
        
        io.to(data.targetID).emit("signal", signalData);
        
        // Update last active time for the room
        for (let roomID in rooms) {
            if (rooms[roomID].teacher === socket.id || rooms[roomID].students.includes(socket.id)) {
                rooms[roomID].lastActive = new Date().toISOString();
                break;
            }
        }
    });

    // Teacher ends room
    socket.on("end-room", (roomID) => {
        if (rooms[roomID] && rooms[roomID].teacher === socket.id) {
            io.to(roomID).emit("force-disconnect"); 
            delete rooms[roomID];
            console.log(`Room ${roomID} ended by teacher`);
            saveRooms(); // Save room data
        }
    });
    
    // Connection status heartbeat
    socket.on("heartbeat", () => {
        socket.emit("heartbeat-ack", { serverTime: new Date().toISOString() });
    });

    // Handle offline mode detection
    socket.on("offline-mode", (data) => {
        console.log(`User ${socket.id} entered offline mode`);
        
        // Store client's offline preference
        socket.offlineMode = true;
        
        // If they were in a room, mark their status
        for (let roomID in rooms) {
            if (rooms[roomID].teacher === socket.id) {
                rooms[roomID].teacherOffline = true;
                saveRooms();
            } else if (rooms[roomID].students.includes(socket.id)) {
                // Mark this student as temporarily offline
                if (!rooms[roomID].offlineStudents) {
                    rooms[roomID].offlineStudents = [];
                }
                if (!rooms[roomID].offlineStudents.includes(socket.id)) {
                    rooms[roomID].offlineStudents.push(socket.id);
                    saveRooms();
                }
            }
        }
    });
    
    // Handle coming back online
    socket.on("online-mode", (data) => {
        console.log(`User ${socket.id} returned to online mode`);
        socket.offlineMode = false;
        
        // Update their status in rooms
        for (let roomID in rooms) {
            if (rooms[roomID].teacher === socket.id) {
                rooms[roomID].teacherOffline = false;
                saveRooms();
            } else if (rooms[roomID].students.includes(socket.id) && 
                      rooms[roomID].offlineStudents && 
                      rooms[roomID].offlineStudents.includes(socket.id)) {
                // Remove from offline list
                rooms[roomID].offlineStudents = rooms[roomID].offlineStudents.filter(id => id !== socket.id);
                saveRooms();
            }
        }
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (let roomID in rooms) {
            if (rooms[roomID].teacher === socket.id) {
                // If teacher disconnected but was in offline mode, don't end room immediately
                if (socket.offlineMode) {
                    console.log(`Teacher ${socket.id} disconnected but in offline mode - keeping room ${roomID} active`);
                    rooms[roomID].teacherOffline = true;
                    saveRooms();
                } else {
                    io.to(roomID).emit("force-disconnect");
                    delete rooms[roomID];
                    console.log(`Room ${roomID} closed due to teacher disconnecting`);
                    saveRooms();
                }
            } else if (rooms[roomID].students.includes(socket.id)) {
                if (socket.offlineMode) {
                    // Don't remove completely, just mark as offline
                    if (!rooms[roomID].offlineStudents) {
                        rooms[roomID].offlineStudents = [];
                    }
                    if (!rooms[roomID].offlineStudents.includes(socket.id)) {
                        rooms[roomID].offlineStudents.push(socket.id);
                    }
                    console.log(`Student ${socket.id} disconnected in offline mode`);
                } else {
                    rooms[roomID].students = rooms[roomID].students.filter(id => id !== socket.id);
                    io.to(rooms[roomID].teacher).emit("student-left", socket.id);
                    console.log(`Student ${socket.id} left room ${roomID}`);
                }
                saveRooms();
            }
        }
    });
});

// Start server with available network interfaces
const PORT = 3000;
const HOST = "0.0.0.0"; // Allow access on all interfaces

server.listen(PORT, HOST, () => {
    const addresses = getNetworkAddresses();
    console.log(`Server running on port ${PORT}`);
    console.log("Available on these network addresses:");
    addresses.forEach(addr => {
        console.log(`https://${addr.address}:${PORT}`);
    });
    
    // Register with mDNS for local network discovery
    mdns.on('query', (query) => {
        // Respond to queries for our service
        if (query.questions.some(q => q.name === 'classroom-stream._http._tcp.local')) {
            mdns.respond([{
                name: 'classroom-stream._http._tcp.local',
                type: 'SRV',
                data: {
                    port: PORT,
                    weight: 0,
                    priority: 0,
                    target: os.hostname() + '.local'
                }
            }, {
                name: os.hostname() + '.local',
                type: 'A',
                ttl: 300,
                data: addresses[0].address
            }]);
        }
    });
    
    // Announce our service
    mdns.respond([{
        name: 'classroom-stream._http._tcp.local',
        type: 'PTR',
        ttl: 300,
        data: 'Classroom-Stream-Server._http._tcp.local'
    }]);
    
    console.log('Service registered for local network discovery');
});