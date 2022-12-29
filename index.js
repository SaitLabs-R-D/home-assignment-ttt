const express = require("express");
const app = express();
const server = require("http").Server(app);
const ws = require("ws");
const { updateTsy, checkWin, toggleTurn, randomTurn } = require("./helper");

const wss = new ws.Server({ server });
const game = {};

wss.on("connection", (ws) => {
  ws.on("close", () => delete game[ws.id]);
  ws.on("message", (data) => onMessage(ws, data));
});

function onMessage(ws, data) {
  data = JSON.parse(data);

  if (data.type === "start") {
    onStart(ws, data);
  } else if (data.type === "move") {
    onMove(ws, data);
  }
}

function onMove(ws, data) {
  game[ws.id] = {
    ...game[ws.id],
    tsy: updateTsy(game[ws.id].tsy, data.move, game[ws.id].turn),
    status: checkWin(game[ws.id].tsy, game[ws.id].turn),
    turn: toggleTurn(game[ws.id].turn),
  };

  game[ws.id].players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: "move",
        sign: player.sign,
        turn: game[ws.id].turn,
        tsy: game[ws.id].tsy,
        status: game[ws.id].status,
      })
    );
  });
}

function onStart(ws, data) {
  ws.id = data.code;

  // first person log's in
  if (typeof game[data.code] === "undefined") {
    game[data.code] = {
      tsy: "000000000",
      status: "waiting",
      turn: randomTurn(),
      players: [{ ws, sign: randomTurn() }],
    };
    return ws.send(
      JSON.stringify({ type: "settings", data: "Waiting for player b.." })
    );
  }

  // game already has 1 player
  if (game[data.code].players.length == 1) {
    const toggledSign = toggleTurn(game[data.code].players[0].sign);

    game[data.code].players.push({ ws, sign: toggledSign });
    game[data.code].status = "Continue";

    game[data.code].players.forEach((player) => {
      const { turn, tsy, status } = game[data.code];

      player.ws.send(
        JSON.stringify({
          type: "move",
          sign: player.sign,
          turn,
          tsy,
          status,
        })
      );
    });
    return;
  }

  ws.send(JSON.stringify({ type: "settings", data: "Game is full" }));
}

server.listen(3000, () => console.log("Server started"));
