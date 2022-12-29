const express = require("express");
const WebSocket = require("ws");
const { updateTsy, checkWin, toggleTurn, randomTurn } = require("./helper");

const app = express();
const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });
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
    console.log({
      type: "move",
      sign: player.sign,
      turn: game[ws.id].turn,
      tsy: game[ws.id].tsy,
      status: game[ws.id].status,
    });
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
  if (typeof game[ws.id] === "undefined") {
    game[ws.id] = {
      tsy: "000000000",
      status: "waiting",
      turn: randomTurn(),
      players: [{ ws, sign: randomTurn() }],
    };
    return ws.send(JSON.stringify({ type: "start", data: "Waiting" }));
  }

  // game already has 1 player
  if (game[ws.id].players.length == 1) {
    const toggledSign = toggleTurn(game[ws.id].players[0].sign);

    game[ws.id].players.push({ ws, sign: toggledSign });
    game[ws.id].status = "Continue";

    game[ws.id].players.forEach((player) => {
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

  ws.send(JSON.stringify({ type: "start", data: "Game is full" }));
}

server.listen(3000, () => console.log("Server started"));
