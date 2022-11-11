const gameBoard = (() => {
  const xoArray = ["", "", "", "", "", "", "", "", ""];
  return {xoArray};
})();

const renderer = (() => {
  const getBoardSquares = () => document.querySelectorAll(".xo");
  const boardSquares = getBoardSquares();
  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      boardSquares[i].innerHTML = gameBoard.xoArray[i];
      if (boardSquares[i].innerHTML === player.symbol) {
        boardSquares[i].style.color = player.color;
      } else if (boardSquares[i].innerHTML === computer.symbol) {
        boardSquares[i].style.color = computer.color;
      };
    };
    updateGameStats();
    console.log(gameBoard.xoArray);
  };
  const getStats = () => document.querySelector(".stats");
  const gameStats = getStats();
  const updateGameStats = () => {
    gameStats.innerHTML = `player:&nbsp;&nbsp;<span>${player.score}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;computer:&nbsp;&nbsp;<span>${computer.score}</span></p>`
  };
  return {boardSquares, updateBoard};
})();

const player = (() => {
  let score = 0;
  let symbol = "x";
  const color = "#5bafe6";
  return {symbol, color, score};
})();

const computer = (() => {
  let score = 0;
  let symbol = "o";
  const color = "#ff8383";
  let difficulty = "easy";
  const easyMove = () => {
    const availableSquares = [];
    for (let [index, xo] of gameBoard.xoArray.entries()) {
      if (xo === "") {
        availableSquares.push(index);
      };
    };
    const computerChoice = availableSquares[Math.random() * availableSquares.length | 0];
    gameBoard.xoArray[computerChoice] = computer.symbol;
  }
  const computerMove = () => {
    if (difficulty === "easy") {
      easyMove();
    } else if (difficulty === "medium") {
      alert("medium move");
    } else if (difficulty === "unbeatable") {
      alert("unbeatable move");
    };
  };
  return {symbol, color, score, difficulty, computerMove};
})();

const game = (() => {
  const loop = () => {
    for (let i = 0; i < 9; i++) {
      renderer.boardSquares[i].addEventListener("click", () => {
        if (gameBoard.xoArray[i] === "") {
          gameBoard.xoArray[i] = player.symbol;
          renderer.updateBoard();
          setTimeout(() => {
            computer.computerMove();
            renderer.updateBoard();
          }, "300");
        } else {
          return;
        };
    })}};
    return {loop};
})();

renderer.updateBoard();
game.loop();
