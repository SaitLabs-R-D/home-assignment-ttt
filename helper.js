function updateTsy(tsy, index, turn) {
  if (tsy[index] != 0) return tsy;
  if (index > 8) return tsy;

  return tsy.substring(0, index) + turn + tsy.substring(index + 1);
}

function checkWin(tsy, turn) {
  let win = false;
  if (tsy[0] == turn && tsy[1] == turn && tsy[2] == turn) win = true;
  if (tsy[3] == turn && tsy[4] == turn && tsy[5] == turn) win = true;
  if (tsy[6] == turn && tsy[7] == turn && tsy[8] == turn) win = true;
  if (tsy[0] == turn && tsy[3] == turn && tsy[6] == turn) win = true;
  if (tsy[1] == turn && tsy[4] == turn && tsy[7] == turn) win = true;
  if (tsy[2] == turn && tsy[5] == turn && tsy[8] == turn) win = true;
  if (tsy[0] == turn && tsy[4] == turn && tsy[8] == turn) win = true;
  if (tsy[2] == turn && tsy[4] == turn && tsy[6] == turn) win = true;

  if (!win) {
    if (!tsy.includes(0)) return "Draw";
    return "Continue";
  }
  return turn.toUpperCase() + " Won";
}

function toggleTurn(turn) {
  return turn === "x" ? "c" : "x";
}

function randomTurn() {
  return ["x", "c"][Math.floor(Math.random() * 2)];
}

module.exports = {
  updateTsy,
  checkWin,
  toggleTurn,
  randomTurn,
};
