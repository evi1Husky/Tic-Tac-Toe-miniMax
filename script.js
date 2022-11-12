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
  const getPlayerScore = () => document.getElementById("stats-player-score");
  const getComputerScore = () => document.getElementById("stats-computer-score");
  const playerScore = getPlayerScore();
  const computerScore = getComputerScore();
  const updateGameStats = () => {
    playerScore.innerHTML = player.score;
    computerScore.innerHTML = computer.score;
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
  const getPlayerStats = () => document.getElementById("stats-player");
  const getComputerStats = () => document.getElementById("stats-computer");
  const playerStats = getPlayerStats();
  const computerStats = getComputerStats();
  const changeStatsColor = (move) => {
    if (move === "player") {
      playerStats.style.color = "#5bafe6";
      computerStats.style.color = "inherit";
    } else if (move === "computer") {
      computerStats.style.color = "#ff8383";
      playerStats.style.color = "inherit";
    } else if (move === "none") {
      playerStats.style.color = "inherit";
      computerStats.style.color = "inherit";
    }
  };
  const xoAnimation = (xo) => {
    console.log(xo)
    xo.style.animationName = "grow";
    setTimeout(function () {
      xo.style.animationName = "none";
    }, "500");
  };
  return {boardSquares, updateBoard, difficultyButtonEvent, disableButtons,
          enableButtons, changeStatsColor, xoAnimation};
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
    renderer.xoAnimation(renderer.boardSquares[computerChoice]);
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
          renderer.changeStatsColor("player");
          gameBoard.xoArray[i] = player.symbol;
          renderer.xoAnimation(renderer.boardSquares[i]);
          renderer.disableButtons();
          renderer.updateBoard();
          let isWinner = checkIfWinner(player.symbol, gameBoard.xoArray);
          endGame(isWinner, player.name);
          if (isWinner === true || isWinner === "tie") {
            renderer.boardSquares[i].focus();
            return;
          };
          renderer.changeStatsColor("computer");
          setTimeout(() => {
            computer.computerMove(computer.difficulty);
            renderer.updateBoard();
            isWinner = checkIfWinner(computer.symbol, gameBoard.xoArray);
            endGame(isWinner, computer.name);
            renderer.enableButtons();
            renderer.changeStatsColor("player");
            renderer.boardSquares[i].focus();
          }, "700");
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
      renderer.changeStatsColor("none");
      changePlayerSymbol(player.symbol);
      setTimeout(() => {
        renderer.updateBoard();
        renderer.changeStatsColor("player");
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
renderer.changeStatsColor("player");