const gameBoard = (() => {
  const xoArray = ["", "", "",
                   "", "", "",
                   "", "", ""];
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
  const disableButtons = () => {
      for (let i = 0; i < 9; i++) {
        boardSquares[i].disabled = true;
    };
  };
  const enableButtons = () => {
    for (let i = 0; i < 9; i++) {
      boardSquares[i].disabled = false;
  };
};
  return {boardSquares, updateBoard, difficultyButtonEvent, disableButtons,
          enableButtons};
})();

const player = (() => {
  const name = "player";
  let score = 0;
  let symbol = "x";
  const color = "#5bafe6";
  return {name, symbol, color, score};
})();

const computer = (() => {
  const name = "computer";
  let score = 0;
  let symbol = "o";
  const color = "#ff8383";
  let difficulty = "easy";
  const getAvailableSquares = () => {
    const availableSquares = [];
    for (let [index, xo] of gameBoard.xoArray.entries()) {
      if (xo === "") {
        availableSquares.push(index);
      };
    };
    return availableSquares;
  };
  const easyMove = () => {
    const availableSquares = getAvailableSquares();
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
  return {name, symbol, color, score, difficulty, computerMove};
})();

const game = (() => {
  const loop = () => {
    for (let i = 0; i < 9; i++) {
      renderer.boardSquares[i].addEventListener("click", () => {
        if (gameBoard.xoArray[i] === "") {
          gameBoard.xoArray[i] = player.symbol;
          renderer.disableButtons();
          renderer.updateBoard();
          let isWinner = checkIfWinner(player.symbol, gameBoard.xoArray);
          endGame(isWinner, player.name);
          if (isWinner === true || isWinner === "tie") {
            return;
          };
          setTimeout(() => {
            computer.computerMove(computer.difficulty);
            renderer.updateBoard();
            isWinner = checkIfWinner(computer.symbol, gameBoard.xoArray);
            endGame(isWinner, computer.name);
            renderer.enableButtons();
          }, "400");
        } else {
          return;
        };
    })}};
  const checkIfWinner = (xo, arr) => {
    console.log(gameBoard.xoArray);
    if (
      (arr[0] === xo && arr[1] === xo && arr[2] === xo) ||
      (arr[3] === xo && arr[4] === xo && arr[5] === xo) ||
      (arr[6] === xo && arr[7] === xo && arr[8] === xo) || 
      (arr[0] === xo && arr[3] === xo && arr[6] === xo) ||
      (arr[1] === xo && arr[4] === xo && arr[7] === xo) ||
      (arr[2] === xo && arr[5] === xo && arr[8] === xo) ||
      (arr[0] === xo && arr[4] === xo && arr[8] === xo) ||
      (arr[2] === xo && arr[4] === xo && arr[6] === xo)) {
      return true;
    } else if (!arr.includes("")) {
      return "tie";
    } else {
      return false;
    };
  };
  const endGame = (isWinner, name) => {
    if (isWinner != false) {
      if (isWinner === true && name === "player") {
        player.score += 1;
        console.log(name + " won");
      } else if (isWinner === true && name === "computer") {
        computer.score += 1
        console.log(name + " won");
      } else if (isWinner === "tie") {
        console.log("no one won");
      }
      for (let i = 0; i < 9; i++) {
        gameBoard.xoArray[i] = "";
      };
      changePlayerSymbol(player.symbol);
      setTimeout(() => {
        renderer.updateBoard();
      }, "1200");
      renderer.enableButtons();
    } else if (isWinner === false) {
      return;
    };
  };
  const changePlayerSymbol = (symbol) => {
    switch (symbol) {
      case "x":
        player.symbol = "o";
        computer.symbol = "x";
        break;
      case "o":
        player.symbol = "x";
        computer.symbol = "o";
        break;
    };
  };
  return {loop, checkIfWinner};
})();

renderer.difficultyButtonEvent();
renderer.updateBoard();
game.loop();
