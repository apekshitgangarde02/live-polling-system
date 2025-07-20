const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active polls and connected users
let activePoll = null;
let connectedUsers = new Map();
let pollHistory = [];
let teacherSocketId = null; // Track the teacher
let pollTimer = null; // To hold the timer for the poll

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Designate the first user as the teacher
  if (!teacherSocketId) {
    teacherSocketId = socket.id;
    console.log(`User ${socket.id} is the teacher.`);
  }

  // Handle user joining (teacher or student)
  socket.on('join', (userData) => {
    const { name, tabId } = userData;
    const role = socket.id === teacherSocketId ? 'teacher' : 'student';
    
    // Store user information
    connectedUsers.set(socket.id, {
      id: socket.id,
      name,
      role,
      tabId,
      hasAnswered: false
    });

    // Send current poll state to new user
    if (activePoll) {
      socket.emit('pollUpdate', {
        poll: activePoll,
        canAnswer: role === 'student' && !activePoll.answeredBy.includes(socket.id),
        timeLeft: Math.max(0, activePoll.endTime - Date.now())
      });
    }

    // Notify all users about new connection
    io.emit('userList', Array.from(connectedUsers.values()));
  });

  // Handle teacher creating a new poll
  socket.on('createPoll', (pollData) => {
    const user = connectedUsers.get(socket.id);
    if (user && user.role === 'teacher') {
      // Check if there's already an active poll
      if (activePoll && activePoll.status === 'active') {
        socket.emit('error', 'There is already an active poll. Please wait for it to complete.');
        return;
      }

      const { question, options, maxTime = 60, correctAnswer } = pollData;
      const pollId = uuidv4();
      
      activePoll = {
        id: pollId,
        question,
        options: options.map(option => ({ text: option, votes: 0 })),
        status: 'active',
        startTime: Date.now(),
        endTime: Date.now() + (maxTime * 1000),
        maxTime: maxTime * 1000,
        createdBy: socket.id,
        answeredBy: [],
        results: {},
        correctAnswer // Store the correct answer index
      };

      // Store in history right away
      pollHistory.push({
        ...activePoll,
        timestamp: new Date().toISOString()
      });

      // Broadcast new poll to all users
      io.emit('newPoll', activePoll);

      // Set timer to end poll
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
      pollTimer = setTimeout(() => {
        if (activePoll && activePoll.id === pollId) {
          endPoll(pollId);
        }
      }, maxTime * 1000);
    }
  });

  // Handle student submitting an answer
  socket.on('submitAnswer', (answerData) => {
    const user = connectedUsers.get(socket.id);
    if (user && user.role === 'student' && activePoll && activePoll.status === 'active') {
      const { optionIndex } = answerData;
      
      // Check if student already answered
      if (activePoll.answeredBy.includes(socket.id)) {
        socket.emit('error', 'You have already answered this poll.');
        return;
      }

      // Check if time is up
      if (Date.now() > activePoll.endTime) {
        socket.emit('error', 'Time is up for this poll.');
        return;
      }

      // Record the answer
      activePoll.options[optionIndex].votes++;
      activePoll.answeredBy.push(socket.id);
      activePoll.results[socket.id] = optionIndex;

      // Update user status
      user.hasAnswered = true;
      connectedUsers.set(socket.id, user);

      // Broadcast updated results
      io.emit('pollUpdate', {
        poll: activePoll,
        canAnswer: false,
        timeLeft: Math.max(0, activePoll.endTime - Date.now())
      });

      // Check if all students have answered
      const students = Array.from(connectedUsers.values()).filter(u => u.role === 'student');
      if (activePoll.answeredBy.length >= students.length) {
        endPoll(activePoll.id);
      }
    }
  });

  // Handle teacher ending poll manually
  socket.on('endPoll', () => {
    const user = connectedUsers.get(socket.id);
    if (user && user.role === 'teacher' && activePoll && activePoll.status === 'active') {
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
      endPoll(activePoll.id);
    }
  });

  // Handle teacher kicking a student
  socket.on('kickStudent', (studentId) => {
    const user = connectedUsers.get(socket.id);
    if (user && user.role === 'teacher') {
      const studentSocket = io.sockets.sockets.get(studentId);
      if (studentSocket) {
        studentSocket.emit('kicked', 'You have been kicked by the teacher.');
        studentSocket.disconnect();
        connectedUsers.delete(studentId);
        io.emit('userList', Array.from(connectedUsers.values()));
      }
    }
  });

  // Handle chat messages
  socket.on('sendMessage', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = {
        id: uuidv4(),
        sender: user.name,
        senderId: socket.id,
        role: user.role,
        text: messageData.text,
        timestamp: new Date().toISOString()
      };
      io.emit('newMessage', message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // If the teacher disconnects, handle it
    if (socket.id === teacherSocketId) {
      console.log('Teacher disconnected. Ending session.');
      // Optionally, you can end the current poll or notify users
      if (activePoll) {
        if (pollTimer) {
          clearTimeout(pollTimer);
          pollTimer = null;
        }
        endPoll(activePoll.id);
      }
      teacherSocketId = null; // Allow a new teacher to be assigned
    }

    connectedUsers.delete(socket.id);
    io.emit('userList', Array.from(connectedUsers.values()));
  });
});

// Function to end a poll
function endPoll(pollId) {
  if (activePoll && activePoll.id === pollId && activePoll.status === 'active') {
    activePoll.status = 'ended';
    activePoll.endTime = Date.now();
    
    // Calculate final results
    const totalVotes = activePoll.options.reduce((sum, option) => sum + option.votes, 0);
    const results = activePoll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
    }));

    const finalPoll = {
      ...activePoll,
      options: results,
      totalVotes,
      correctAnswer: activePoll.correctAnswer
    };

    // Update history with final results
    const historyIndex = pollHistory.findIndex(p => p.id === pollId);
    if (historyIndex !== -1) {
      pollHistory[historyIndex] = {
        ...pollHistory[historyIndex],
        ...finalPoll,
        status: 'ended'
      };
    }

    // Broadcast final results
    io.emit('pollEnded', finalPoll);
    
    // Reset active poll and timer
    activePoll = null;
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
  }
}

// API Routes
app.get('/api/polls/history', (req, res) => {
  res.json(pollHistory);
});

app.get('/api/users', (req, res) => {
  res.json(Array.from(connectedUsers.values()));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 