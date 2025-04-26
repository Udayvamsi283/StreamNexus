// Setup connection to server using window.location
const socket = io();
let localStream, remoteStreams = {}, peerConnections = {};
const config = { 
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ] 
};
let roomID = null;
let isTeacher = false;

// Teacher Starts Class
document.getElementById("startBtn").addEventListener("click", async () => {
    roomID = Math.random().toString(36).substring(7);
    socket.emit("create-room", roomID);
    
    // Display room code for sharing
    const roomCodeElement = document.getElementById("roomCode");
    roomCodeElement.innerText = `${roomID}`;
    
    await startClass(true);
});

// Student Joins Class
document.getElementById("joinBtn").addEventListener("click", async () => {
    const enteredRoomID = document.getElementById("roomInput").value;
    socket.emit("check-room", enteredRoomID);
});

// End Class
document.getElementById("endBtn").addEventListener("click", () => {
    socket.emit("end-room", roomID);
    endClass(true);
});

// Check URL for room parameter on page load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
        document.getElementById("roomInput").value = roomParam;
        // Optional: Auto-join the room
        // socket.emit("check-room", roomParam);
    }
});

// Room Validation
socket.on("room-status", (data) => {
    if (data.exists) {
        roomID = data.roomID;
        joinClass();
    } else {
        alert("Room does not exist or has ended.");
    }
});

// Teacher Ends Class
socket.on("force-disconnect", () => {
    alert("The teacher has ended the class.");
    endClass(true);
});

// Start Class (Teacher)
async function startClass(isTeacherRole) {
    try {
        isTeacher = isTeacherRole;
        document.getElementById("main").style.display = "none";
        document.getElementById("videoContainer").style.display = "block";
        
        // Set up UI based on role
        if (isTeacher) {
            document.querySelector('.student-view').style.display = 'none';
            document.querySelector('.teacher-container').style.display = 'block';
        } else {
            document.querySelector('.teacher-container').style.display = 'none';
            document.querySelector('.student-view').style.display = 'flex';
        }

        // Get camera & mic
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById("localVideo").srcObject = localStream;
        
        // Debug camera access
        console.log("Local video tracks:", localStream.getVideoTracks().length);
        console.log("Local video track enabled:", localStream.getVideoTracks()[0]?.enabled);

        // Setup connection handling
        socket.on("user-joined", async (studentID) => {
            await setupPeerConnection(studentID);
        });
        
        // Handle student disconnection (for teachers)
        socket.on("student-left", (studentID) => {
            if (peerConnections[studentID]) {
                peerConnections[studentID].close();
                delete peerConnections[studentID];
                console.log(`Student ${studentID} connection closed`);
            }
        });

    } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Failed to access camera/microphone. Please check your device permissions.");
    }
}

// Join Class (Student)
async function joinClass() {
  try {
    isTeacher = false;
    document.getElementById("main").style.display = "none";
    document.getElementById("videoContainer").style.display = "block";

    // Hide teacher-specific controls
    document.getElementById("teacherControls").style.display = "none";

    // Show student view
    document.querySelector(".teacher-container").style.display = "none";
    document.querySelector(".student-view").style.display = "flex";

    // Show room code
    const roomCodeElement = document.getElementById("roomCode");
    roomCodeElement.innerText = `${roomID}`;

    // Connect to the room
    socket.emit("join-room", roomID);

    socket.on("connected-to-teacher", async (teacherID) => {
      console.log("Connected to teacher:", teacherID);
      await setupPeerConnection(teacherID);
    });
  } catch (error) {
    console.error("Error joining class:", error);
    alert("Could not join the class. Please check your device permissions.");
  }
}


// Setup WebRTC connections
async function setupPeerConnection(peerID) {
    console.log(`Setting up connection with peer: ${peerID}`);
    peerConnections[peerID] = new RTCPeerConnection(config);

    // Add tracks ONLY if localStream exists (teacher side)
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log(`Adding local ${track.kind} track to peer connection`);
        peerConnections[peerID].addTrack(track, localStream);
      });
    }

    // Setup incoming remote tracks (student side)
    if (!isTeacher) {
      console.log("Setting up remote stream container for teacher's video");
      remoteStreams[peerID] = new MediaStream();
      const remoteVideo = document.getElementById("remoteVideo");
      remoteVideo.srcObject = remoteStreams[peerID];
    }


    // Handle incoming media tracks
    peerConnections[peerID].ontrack = (event) => {
        console.log(`Received remote track: ${event.track.kind} from ${peerID}`);
        
        if (!isTeacher && event.track) {
            remoteStreams[peerID].addTrack(event.track);
            
            const statusElement = document.getElementById("connectionStatus");
            if (statusElement) statusElement.textContent = "Connected to teacher";
            
            const streamStatus = document.getElementById("streamStatus");
            if (streamStatus) {
                streamStatus.textContent = `Receiving ${event.track.kind} stream`;
            }
            
            console.log(`Teacher's ${event.track.kind} stream connected`);
        }
    };

    // ICE candidate handling
    peerConnections[peerID].onicecandidate = (event) => {
        if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.emit("signal", { 
                roomID, 
                targetID: peerID, 
                candidate: event.candidate 
            });
        }
    };

    // Connection state monitoring
    peerConnections[peerID].oniceconnectionstatechange = () => {
        const state = peerConnections[peerID].iceConnectionState;
        console.log(`ICE connection state with ${peerID}: ${state}`);
        
        const statusElement = document.getElementById("connectionStatus");
        if (statusElement) {
            statusElement.textContent = `Connection: ${state}`;
        }
    };

    // Create offer (for teacher) or wait for offer (for student)
    if (isTeacher) {
        console.log("Teacher: Creating offer for student");
        try {
            const offer = await peerConnections[peerID].createOffer();
            await peerConnections[peerID].setLocalDescription(offer);
            console.log("Teacher: Sending offer to student");
            socket.emit("signal", { roomID, targetID: peerID, offer });
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    }
}

// Signal handling
socket.on("signal", async (data) => {
    console.log("Received signal:", data.offer ? "offer" : data.answer ? "answer" : "candidate");
    
    // Create peer connection if it doesn't exist
    if (!peerConnections[data.senderID]) {
        console.log(`Creating new peer connection for ${data.senderID}`);
        peerConnections[data.senderID] = new RTCPeerConnection(config);
        
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            peerConnections[peerID].addTrack(track, localStream);
          });
        }


        
        // Set up track handling (for students)
        if (!isTeacher) {
            remoteStreams[data.senderID] = new MediaStream();
            document.getElementById("remoteVideo").srcObject = remoteStreams[data.senderID];
            
            peerConnections[data.senderID].ontrack = (event) => {
                console.log(`Received track in dynamic handler: ${event.track.kind}`);
                remoteStreams[data.senderID].addTrack(event.track);
            };
        }
        
        // ICE candidate handling
        peerConnections[data.senderID].onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("signal", { 
                    roomID, 
                    targetID: data.senderID, 
                    candidate: event.candidate 
                });
            }
        };
    }
    
    try {
        // Process offer
        if (data.offer) {
            console.log("Processing offer from", data.senderID);
            await peerConnections[data.senderID].setRemoteDescription(new RTCSessionDescription(data.offer));
            
            console.log("Creating answer");
            const answer = await peerConnections[data.senderID].createAnswer();
            await peerConnections[data.senderID].setLocalDescription(answer);
            
            console.log("Sending answer to", data.senderID);
            socket.emit("signal", { roomID, targetID: data.senderID, answer });
        }
        
        // Process answer
        if (data.answer) {
            console.log("Processing answer from", data.senderID);
            await peerConnections[data.senderID].setRemoteDescription(new RTCSessionDescription(data.answer));
        }
        
        // Process ICE candidate
        if (data.candidate) {
            console.log("Adding ICE candidate from", data.senderID);
            await peerConnections[data.senderID].addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    } catch (error) {
        console.error("Error processing signal:", error);
    }
});

// End Class
function endClass(forceClose = false) {
    document.getElementById("videoContainer").style.display = "none";
    document.getElementById("main").style.display = "block";

    // Stop all media tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    Object.values(peerConnections).forEach(pc => pc.close());
    peerConnections = {};
    remoteStreams = {};

    // Reset UI
    const statusElement = document.getElementById("connectionStatus");
    if (statusElement) statusElement.textContent = "";
    
    const streamStatus = document.getElementById("streamStatus");
    if (streamStatus) streamStatus.textContent = "";

    if (forceClose) {
        // Clear URL parameters
        if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Optional redirect
        // window.location.href = "/";
    }
}
// Toggle Video
document.getElementById("toggleVideoBtn").addEventListener("click", () => {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        document.getElementById("toggleVideoBtn").innerHTML = videoTrack.enabled 
            ? '<i class="fas fa-video"></i> Video' 
            : '<i class="fas fa-video-slash"></i> Video Off';
    }
});

// Toggle Audio
document.getElementById("toggleAudioBtn").addEventListener("click", () => {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        document.getElementById("toggleAudioBtn").innerHTML = audioTrack.enabled 
            ? '<i class="fas fa-microphone"></i> Audio' 
            : '<i class="fas fa-microphone-slash"></i> Muted';
    }
});

// Fullscreen
document.getElementById("fullscreenBtn").addEventListener("click", () => {
    const videoElement = isTeacher ? document.getElementById("localVideo") : document.getElementById("remoteVideo");
    if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
    }
});
