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
  const getDifficultyButton = () => document.querySelector(".difficulty-button");
  const difficultyButton = getDifficultyButton();
  const difficultyButtonEvent = () => difficultyButton.addEventListener("click", () => {
    switch (computer.difficulty) {
      case "easy":
        computer.difficulty = "medium";
        difficultyButton.innerHTML = `difficulty:&nbsp;<span class="medium">medium</span>`
        break;
      case "medium":
        computer.difficulty = "unbeatable";
        difficultyButton.innerHTML = `difficulty:&nbsp;<span class="unbeatable">unbeatable</span>`
        break;
      case "unbeatable":
        computer.difficulty = "easy";
        difficultyButton.innerHTML = `difficulty:&nbsp;<span class="easy">easy</span>`
        break;
    }
    console.log(`${computer.difficulty} difficulty`);
  });
  return {boardSquares, updateBoard, difficultyButtonEvent,};
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
  const computerMove = (difficulty) => {
    if (difficulty === "easy") {
      easyMove();
    } else if (difficulty === "medium") {
      console.log("medium move");
    } else if (difficulty === "unbeatable") {
      console.log("unbeatable move");
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
            computer.computerMove(computer.difficulty);
            renderer.updateBoard();
          }, "300");
        } else {
          return;
        };
    })}};
    return {loop};
})();

renderer.difficultyButtonEvent();
renderer.updateBoard();
game.loop();
