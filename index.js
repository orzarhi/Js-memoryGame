import MemoryGame from "./game.js";

const app = document.querySelector("#app");

let game;

main(); //start

function main() {
  renderMenu();
}

function selectPlayers(numOfPlayers) {
  game = MemoryGame(app, numOfPlayers, { renderMenu: renderMenu });
  game.start();
}

function renderMenu() {
  app.innerHTML = "";
  const menu = document.createElement("div");
  menu.className = "menu center";
  app.appendChild(menu);
  const title = document.createElement("h1");
  title.innerHTML = "How much players?";
  menu.appendChild(title);

  const oneBtn = document.createElement("button");
  oneBtn.innerHTML = "One Player";
  oneBtn.className = "menu-button";
  oneBtn.addEventListener("click", () => selectPlayers(1));
  menu.appendChild(oneBtn);

  const twoBtn = document.createElement("button");
  twoBtn.innerHTML = "Two Player";
  twoBtn.className = "menu-button";
  twoBtn.addEventListener("click", () => selectPlayers(2));

  menu.appendChild(twoBtn);
}
