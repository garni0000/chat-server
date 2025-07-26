const waitingUsers = [];

function arraysIntersect(arr1, arr2) {
  return arr1.some(item => arr2.includes(item));
}

function addUser(socket, userInfo) {
  socket.userInfo = userInfo; // { genre, genreInteret: [], interets: [] }
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
      // Le genre du candidat est dans la liste des genres recherchés par socket
      socket.userInfo.genreInteret.includes(candidate.userInfo.genre) &&
      // Le genre de socket est dans la liste des genres recherchés par le candidat
      candidate.userInfo.genreInteret.includes(socket.userInfo.genre) &&
      // Au moins un intérêt commun
      arraysIntersect(socket.userInfo.interets, candidate.userInfo.interets)
    ) {
      waitingUsers.splice(i, 1);
      return candidate;
    }
  }
  return null;
}

module.exports = { addUser, removeUser, findMatch };
