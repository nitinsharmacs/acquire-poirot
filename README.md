## **ACQUIRE**

<br>

**ABOUT**

---

**Acquire** is a multi-player mergers and acquisitions themed board game. It is played with tiles representing hotels that are arranged on the board, play money and stock certificates.

<br>

**COMPONENTS OF GAME**

- Land (board)
- Corporations
- Tiles
- Stock market
- Shares
- Money
- Information card

<br>

**RULES**

- At the beginning of the game, each player receives $6,000.
- To determine who plays first, each player draws one tile and places it in its matching square on the board.
- The player who has drawn the lowest number-letter combination starts play and players will play in ascending order.
- Each player draws six tiles.

- Each player’s turn consists of:

  1. Play a tile onto the gameboard by putting it on its matching space.

     - Depending upon where a tile is played, it may form a corporation or it may merge two or more corporations.

  2. Buy stocks of any active corporations. There is a limit of three total per turn.

  3. Draw a new tile from the facedown cluster.

- Ending the game
  When all active corporations are safe or one corporation has 41 or more tiles on the board.

<br>

**INSTALLATION**

---

#### **clone the project**

```
git clone https://github.com/step-8/acquire-poirot.git
```

#### **Setting up environment**

Create `.env` file in the project root with following values

```
SESSION_KEY = "hello"
# not required for redis running on localhost
REDIS_URL="redis_url"
```

#### **Execute npm install command**

```
npm install
```

#### **Execute npm setup command**

```
npm run setup
```

<br>

**RUN**

---

##### **GAME**

#### **Execute npm start command to run the server**

```
npm start
```

##### **TEST**

#### **Execute npm test command to run the tests**

```
 npm test
```

<br>

**VISIT HOMEPAGE**

---

See the homepage on local machine :

step 1 : run the server

step 2 : visit http://localhost:8888/

Or visit https://acquire-qag2.onrender.com/
