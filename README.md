# Home Assignment - TicTacToe

[link to design](https://www.figma.com/file/xX8khEDmthWjXbfrNUAn7B/Tic-Tac-Toe?node-id=0%3A1&t=eOvzSjJMmaABsVwT-1)

## The Task

### User story:
user a loads `https://.../?code=1234`, and sends the same link to his friend.<br />
user b opens `https://.../?code=1234`, and the game will start for both users.<br />
every user receives a random sign, either x or c.<br />
the first player is picked randomly, and they play until lose/draw/win.<br />

### Breaking it down
1. create a project with your favorite language / framework
2. implement the design
3. create a websocket connection, and a listener to the websocket, preferably with the built in `WebSocket` class. 
4. read the instructions in [Backend](#Backend)  

## Installation

```cmd
git clone https://github.com/SaitLabs-R-D/home-assignment-ttt
cd home-assignment-ttt
npm install
npm start
```

## Backend

You will need the backend two times in this app

1. once a user loads the page, we need to register him to a game.
1. every move.

### Start
```js
ws.send({ type: "start", code: CODE_FROM_URL });
```

In return, the backend will response whether with "Waiting" or "Continue".

### Move

```js
// `move` is the index of the square the user clicked, top left is 0, bottom right is 8.
ws.send({ type: "move", move: 1 });
```
Every move in the game, the backend will send both users: `{ sign, turn, status, tsy }`
