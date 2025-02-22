import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import presentationsRouter from './routes/presentations.js';
import compileRouter from './routes/compile.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/presentations', presentationsRouter);
app.use('/api/compile', compileRouter);

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const isPresenter = rooms.get(roomId).size === 0;
    const participant = { id: socket.id, username, isPresenter };
    rooms.get(roomId).add(participant);

    socket.emit('room-joined', { 
      isPresenter, 
      participants: Array.from(rooms.get(roomId))
    });

    socket.to(roomId).emit('participants-updated', Array.from(rooms.get(roomId)));

    socket.on('slide-change', ({ roomId, slideIndex }) => {
      socket.to(roomId).emit('slide-changed', slideIndex);
    });

    socket.on('mcq-answer', ({ roomId, slideIndex, answer }) => {
      socket.to(roomId).emit('mcq-answered', { slideIndex, answer });
    });

    socket.on('short-answer', ({ roomId, slideIndex, answer }) => {
      socket.to(roomId).emit('short-answer-submitted', { slideIndex, answer });
    });

    socket.on('disconnect', () => {
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(participant);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        } else if (isPresenter) {
          const newPresenter = Array.from(rooms.get(roomId))[0];
          newPresenter.isPresenter = true;
          io.to(roomId).emit('new-presenter', newPresenter.id);
        }
        socket.to(roomId).emit('participants-updated', Array.from(rooms.get(roomId)));
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
