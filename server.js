const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { addUser, removeUser, findMatch } = require('./matchmaker');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('🚀 Serveur de chat aléatoire en ligne');
});

io.on('connection', (socket) => {
  console.log(`🟢 Nouveau client connecté : ${socket.id}`);

  socket.on('userInfo', (userInfo) => {
    addUser(socket, userInfo);

    const partner = findMatch(socket);
    if (partner) {
      socket.partner = partner;
      partner.partner = socket;
      socket.emit('system', 'Tu es connecté à un inconnu.');
      partner.emit('system', 'Tu es connecté à un inconnu.');
    } else {
      socket.emit('system', 'En attente d’un partenaire...');
    }
  });

  socket.on('message', (msg) => {
    if (socket.partner) {
      socket.partner.emit('message', msg);
    }
  });

  socket.on('next', () => {
    if (socket.partner) {
      socket.partner.emit('system', 'Ton partenaire est parti.');
      socket.partner.partner = null;
      socket.partner = null;
    }

    const newPartner = findMatch(socket);
    if (newPartner) {
      socket.partner = newPartner;
      newPartner.partner = socket;
      socket.emit('system', 'Nouveau partenaire trouvé.');
      newPartner.emit('system', 'Nouveau partenaire trouvé.');
    } else {
      socket.emit('system', 'En attente d’un nouveau partenaire...');
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Déconnexion : ${socket.id}`);
    if (socket.partner) {
      socket.partner.emit('system', 'Ton partenaire s’est déconnecté.');
      socket.partner.partner = null;
    }
    removeUser(socket);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});
