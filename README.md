# Live Polling System

A real-time live polling system built with React, Express.js, and Socket.io for teachers and students to conduct interactive polls in real-time.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ Configure maximum time for polls (10-300 seconds)
- ✅ View live polling results in real-time
- ✅ End polls manually
- ✅ Kick students out of the session
- ✅ View poll history
- ✅ Real-time chat with students

### Student Features
- ✅ Join sessions with unique names
- ✅ Answer polls within time limits
- ✅ View live results after answering
- ✅ Real-time chat with teachers and other students
- ✅ Tab-based session management (new tab = new student)

### Technical Features
- ✅ Real-time communication with Socket.io
- ✅ Redux state management
- ✅ Responsive design with styled-components
- ✅ Modern UI with smooth animations
- ✅ Error handling and validation
- ✅ Session persistence

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Styled Components** - CSS-in-JS styling
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Express.js** - Server framework
- **Socket.io** - Real-time communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd live-polling-system
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 3. Start the development servers
```bash
# Start both server and client concurrently
npm run dev
```

Or start them separately:
```bash
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

### 4. Access the application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

### For Teachers
1. Open the application in your browser
2. Enter your name and select "Teacher" role
3. You'll be redirected to the Teacher Dashboard
4. Create polls with questions, options, and time limits
5. Monitor live results as students answer
6. Use the chat feature to communicate with students
7. View poll history for past sessions

### For Students
1. Open the application in your browser
2. Enter your name and select "Student" role
3. You'll be redirected to the Student Dashboard
4. Wait for the teacher to create a poll
5. Answer polls within the time limit
6. View live results after submitting
7. Use the chat feature to communicate

### Multi-tab Testing
- Each browser tab acts as a separate student
- Refreshing a tab maintains the same student session
- Opening a new tab creates a new student session

## Project Structure

```
live-polling-system/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   └── package.json       # Server dependencies
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API and socket services
│   │   ├── styles/        # Global styles
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json       # Client dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## API Endpoints

### GET /api/polls/history
Returns the history of all conducted polls.

### GET /api/users
Returns the list of currently connected users.

## Socket Events

### Client to Server
- `join` - User joins the session
- `createPoll` - Teacher creates a new poll
- `submitAnswer` - Student submits an answer
- `endPoll` - Teacher ends a poll manually
- `kickStudent` - Teacher kicks a student
- `sendMessage` - Send chat message

### Server to Client
- `userList` - Updated list of connected users
- `newPoll` - New poll created
- `pollUpdate` - Poll results updated
- `pollEnded` - Poll has ended
- `newMessage` - New chat message
- `error` - Error message
- `kicked` - User has been kicked

## Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

### Backend Deployment
```bash
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 