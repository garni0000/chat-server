const waitingUsers = [];

function addUser(socket, userInfo) {
  socket.userInfo = userInfo; // { genre, interet }
  waitingUsers.push(socket);
}

function removeUser(socket) {
  const index = waitingUsers.indexOf(socket);
  if (index !== -1) {
    waitingUsers.splice(index, 1);
  }
}

function findMatch(socket) {
  for (let i = 0; i < waitingUsers.length; i++) {
    const candidate = waitingUsers[i];
    if (
      candidate !== socket &&
      !candidate.partner &&
      candidate.userInfo.genre === socket.userInfo.genre &&
      candidate.userInfo.interet === socket.userInfo.interet
    ) {
      waitingUsers.splice(i, 1);
      return candidate;
    }
  }
  return null;
}

module.exports = { addUser, removeUser, findMatch };
