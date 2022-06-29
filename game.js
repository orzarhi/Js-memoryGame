var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

function MemoryGame(rootEl, numOfPlayers, { renderMenu }) {
  const root = rootEl;
  let cells = [];
  let firstCell = null;
  let turn = 0;
  let players = [];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
    start();
  };
  function openModal(text) {
    document.getElementById("modal-winnner-user").innerHTML = text;
    modal.style.display = "block"; // open modal
  }

  function start() {
    players = initPlayers(numOfPlayers);
    initCell(); // init game cards
    render(); // draw cards to html
  }

  function initPlayers(numOfPlayers) {
    let arr = new Array(numOfPlayers).fill(0);
    return arr.map((_, i) => ({ score: 0, name: `Player ${i + 1}` }));
  }

  function checkWin() {
    return cells.every(function (cell) {
      return cell.checked === true;
    });
  }

  function clearDom() {
    root.innerHTML = "";
  }

  function shuffleArray(arr) {
    return arr.sort(function (a, b) {
      return 0.5 - Math.random();
    });
  }

  function initCell() {
    cells = [];
    for (let i = 0; i < 16; i++) {
      cells.push({
        id: i,
        checked: false,
        image: `image${(i % 8) + 1}.png`,
      });
    }
    shuffleArray(cells);
  }

  function render() {
    clearDom();
    const main = document.createElement("div");
    main.className = "main";

    root.appendChild(main);
    renderBoard(main);
    renderDashboard(main);
  }

  function renderDashboard(target) {
    const dashboard = document.createElement("div");
    dashboard.className = "dashboard center";
    dashboard.id = "dashboard";
    target.appendChild(dashboard);
    players.forEach((player, i) => {
      const title = document.createElement("div");
      dashboard.appendChild(title);
      title.className = "dashboard-title";
      title.innerHTML = player.name;

      const score = document.createElement("div");
      score.id = "score" + i;
      dashboard.appendChild(score);
      score.innerHTML = `score: ${player.score}`;
    });

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `
        
            <button id="restartBtn">Restart</button>
        `;
    dashboard.appendChild(actions);
    document.getElementById("restartBtn").addEventListener("click", restart);
  }

  function restart() {
    renderMenu();
  }

  function updateScore() {
    players[turn].score++;
    const score = document.getElementById("score" + turn);
    score.innerHTML = `score ${players[turn].score}`;
  }

  function renderBoard(target) {
    const board = document.createElement("div");
    board.className = "board center";
    target.appendChild(board);

    for (const cell of cells) {
      renderCell(cell, board);
    }
  }
  function checkPair(secondCell) {
    return firstCell.image == secondCell.image;
  }

  function renderCell(cell, target) {
    const card = document.createElement("div");
    card.id = cell.id;
    card.className = "flip-card";

    target.appendChild(card);

    const cardInner = document.createElement("div");
    cardInner.className = "flip-card-inner";
    card.appendChild(cardInner);

    const cardFront = document.createElement("div");
    cardFront.addEventListener("click", () => {
      console.log("turn", turn);
      card.classList.toggle("active"); // flip card (via css)
      if (!firstCell) {
        //if not first click
        firstCell = cell;
      } else {
        // second click
        const success = checkPair(cell);
        if (!success) {
          // no match
          document.body.classList.add("pending"); //for disable mouse click
          setTimeout(() => {
            document.getElementById(firstCell.id).classList.remove("active");
            document.getElementById(cell.id).classList.remove("active");
            firstCell = null;
            if (numOfPlayers === 1) {
              turn = 0;
            } else {
              if (turn === 0) {
                turn = 1;
              } else {
                turn = 0;
              }
            }
            document.body.classList.remove("pending");
          }, 1000);
        } else {
          // was match
          cells.forEach((c) => {
            if (c.id === firstCell.id || c.id === cell.id) {
              c.checked = true;
            }
          });
          firstCell = null;
          updateScore();
          const win = checkWin();
          if (win) {
            const winner = players.reduce((winner, next) =>
              next.score > winner.score ? next : winner
            );
            setTimeout(() => {
              openModal(`winner is ${winner.name} score:${winner.score}`);
            }, 300);
          }
        }
      }
    });
    cardFront.className = "flip-card-front";
    cardInner.appendChild(cardFront);

    const cardBack = document.createElement("div");
    cardBack.className = "flip-card-back";
    cardBack.style.backgroundImage = `url(/images/${cell.image})`;
    cardInner.appendChild(cardBack);
  }

  return {
    start,
    render,
    clearDom,
  };
}

export default MemoryGame;
