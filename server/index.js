const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./db');
const Poll = require('./models/Poll');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

let pollTimer = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userData) => {
    const { name, role, tabId } = userData;
    
    let user = await User.findOneAndUpdate(
      { tabId },
      { name, role, socketId: socket.id, isConnected: true },
      { upsert: true, new: true }
    );
    
    const users = await User.find({ isConnected: true });
    io.emit('userList', users);

    const activePoll = await Poll.findOne({ status: 'active' });
    if (activePoll) {
      socket.emit('pollUpdate', { poll: activePoll });
    }
  });

  socket.on('createPoll', async (pollData) => {
    const { question, options, maxTime = 60, correctAnswer } = pollData;
    
    const newPoll = new Poll({
      question,
      options: options.map(text => ({ text })),
      maxTime,
      correctAnswer,
      createdBy: socket.id,
      endTime: Date.now() + maxTime * 1000,
    });

    await newPoll.save();
    io.emit('newPoll', newPoll);

    if (pollTimer) clearTimeout(pollTimer);
    pollTimer = setTimeout(() => endPoll(newPoll._id), maxTime * 1000);
  });

  socket.on('submitAnswer', async ({ pollId, optionIndex }) => {
    const poll = await Poll.findById(pollId);
    if (poll && poll.status === 'active') {
      poll.options[optionIndex].votes++;
      await poll.save();
      io.emit('pollUpdate', { poll });
    }
  });

  socket.on('endPoll', async (pollId) => {
    if (pollTimer) clearTimeout(pollTimer);
    await endPoll(pollId);
  });

  socket.on('kickStudent', async (studentId) => {
    await User.findOneAndUpdate({ socketId: studentId }, { isConnected: false });
    const studentSocket = io.sockets.sockets.get(studentId);
    if (studentSocket) {
      studentSocket.emit('kicked');
      studentSocket.disconnect();
    }
    const users = await User.find({ isConnected: true });
    io.emit('userList', users);
  });

  socket.on('sendMessage', async (messageData) => {
    const user = await User.findOne({ socketId: socket.id });
    if (user) {
      const message = new Message({
        senderId: socket.id,
        senderName: user.name,
        senderRole: user.role,
        text: messageData.text,
      });
      await message.save();
      io.emit('newMessage', message);
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    await User.findOneAndUpdate({ socketId: socket.id }, { isConnected: false });
    const users = await User.find({ isConnected: true });
    io.emit('userList', users);
  });
});

async function endPoll(pollId) {
  const poll = await Poll.findById(pollId);
  if (poll && poll.status === 'active') {
    poll.status = 'ended';
    await poll.save();
    io.emit('pollEnded', poll);
  }
}

app.get('/api/polls/history', async (req, res) => {
  const polls = await Poll.find({ status: 'ended' }).sort({ createdAt: -1 });
  res.json(polls);
});

app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 