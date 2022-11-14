const gameBoard = (() => {
  const xoArray = ["", "", "",
                   "", "", "",
                   "", "", ""];
  const winningXORow = [];
  const pushToWinningArray = (...arguments) => {
    winningXORow.push(...arguments);
  }
  return {xoArray, winningXORow, pushToWinningArray};
})();

const renderer = (() => {
  const boardSquares = document.querySelectorAll(".xo");
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
  const playerScore = document.getElementById("stats-player-score");
  const computerScore = document.getElementById("stats-computer-score");
  const updateGameStats = () => {
    playerScore.innerHTML = player.score;
    computerScore.innerHTML = computer.score;
  };
  const difficultyButton = document.querySelector(".difficulty-button");
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
  const playerStats = document.getElementById("stats-player");
  const computerStats = document.getElementById("stats-computer");
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
    xo.style.animationDuration = "0.4s"
    xo.style.animationName = "grow";
    setTimeout(function () {
      if (gameBoard.winningXORow.length === 0) {
        xo.style.animationName = "none";
      }
    }, "400");
  };
  const bannerText = document.querySelector(".banner-text");
  const updateBannerDisplay = (message) => {
    bannerText.style.animationName = "appear";
    bannerText.innerHTML = message;
    setTimeout(function () {
      bannerText.style.animationName = "none";
    }, "400");
  };
  let winningColor = "";
  const endGameAnimation = (name) => {
    switch (name) {
      case "player":
        winningColor = "#73C767";
        break;
      case "computer":
        winningColor = "#ff3e3e";
        break;
    };
  if (gameBoard.winningXORow.length === 3) {
    boardSquares[gameBoard.winningXORow[0]].style.color = winningColor;
    boardSquares[gameBoard.winningXORow[1]].style.color = winningColor;
    boardSquares[gameBoard.winningXORow[2]].style.color = winningColor;
  }
  };
  const clearBoardAnimation = () => {
    for (let i = 0; i < 9; i++) {
      boardSquares[i].style.animationDuration = "2s"
      boardSquares[i].style.animationName = "shrink";
    };
  if (gameBoard.winningXORow.length === 3) {
    boardSquares[gameBoard.winningXORow[0]].style.animationName = "shrinkGrow";
    boardSquares[gameBoard.winningXORow[1]].style.animationName = "shrinkGrow";
    boardSquares[gameBoard.winningXORow[2]].style.animationName = "shrinkGrow";
  } else if (gameBoard.winningXORow.length === 9) {
    for (let i = 0; i < 9; i++) {
      boardSquares[gameBoard.winningXORow[i]].style.animationName = "shrinkGrow";
    }
  }
    setTimeout(function () {
      for (let i = 0; i < 9; i++) {
        boardSquares[i].style.animationName = "none";
      };
    }, "2000");
  };
  return {boardSquares, updateBoard, difficultyButtonEvent, disableButtons,
          enableButtons, changeStatsColor, xoAnimation, updateBannerDisplay,
          endGameAnimation, clearBoardAnimation};
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

  const easyMove = () => {
    let xoArrayCopy = copyXOarray();
    let availableSquares = getAvailableSquares(xoArrayCopy);
    const computerChoice = availableSquares[Math.random() * availableSquares.length | 0];
    gameBoard.xoArray[computerChoice] = computer.symbol;
    renderer.xoAnimation(renderer.boardSquares[computerChoice]);
  }

  const copyXOarray = () => {
    let xoArrayCopy = [...gameBoard.xoArray];
    for (let i = 0; i < 9; i++) {
      if (xoArrayCopy[i] === "") {
        xoArrayCopy[i] = i;
      } else {
      };
    };
    return xoArrayCopy;
  }

  const getAvailableSquares = (xoArrayCopy) => {
    return xoArrayCopy.filter(s => s != "o" && s != "x");
  };

  const unbeatableMove = () => {
    let xoArrayCopy = copyXOarray();
    const computerChoice = miniMax(xoArrayCopy, computer.symbol);
    gameBoard.xoArray[computerChoice.index] = computer.symbol;
    renderer.xoAnimation(renderer.boardSquares[computerChoice.index]);
  }

  const miniMax = (xoArrayCopy, currentPlayer) => {
    let availableSquares = getAvailableSquares(xoArrayCopy);
    if (checkIfWinner(player.symbol, xoArrayCopy)) {
      return {score: -10};
    } else if (checkIfWinner(computer.symbol, xoArrayCopy)) {
      return {score: 10};
    } else if (availableSquares.length === 0) {
      return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availableSquares.length; i++) {
      let move = {};
      move.index = xoArrayCopy[availableSquares[i]];
      xoArrayCopy[availableSquares[i]] = currentPlayer;
      if (currentPlayer === computer.symbol) {
        let result = miniMax(xoArrayCopy, player.symbol);
        move.score = result.score;
      } else {
        let result = miniMax(xoArrayCopy, computer.symbol);
        move.score = result.score;
      };
      xoArrayCopy[availableSquares[i]] = move.index;
      moves.push(move);
    };
    let bestMove;
    if(currentPlayer === computer.symbol){
      let bestScore = -10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        };
      };
    } else {
      let bestScore = 10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        };
      };
    };
    return moves[bestMove];
  };

  const checkIfWinner = (xo, arr) => {
    if ((arr[0] === xo && arr[1] === xo && arr[2] === xo) ||
      (arr[3] === xo && arr[4] === xo && arr[5] === xo) ||
      (arr[6] === xo && arr[7] === xo && arr[8] === xo) ||
      (arr[0] === xo && arr[3] === xo && arr[6] === xo) ||
      (arr[1] === xo && arr[4] === xo && arr[7] === xo) ||
      (arr[2] === xo && arr[5] === xo && arr[8] === xo) ||
      (arr[0] === xo && arr[4] === xo && arr[8] === xo) ||
      (arr[2] === xo && arr[4] === xo && arr[6] === xo)) {
      return true;
      } else {
      return false;
      };
    };
  
  const computerMove = (difficulty) => {
    if (difficulty === "easy") {
      easyMove();
    } else if (difficulty === "medium") {
    } else if (difficulty === "unbeatable") {
      unbeatableMove();
    };
  };
  return {name, symbol, color, score, difficulty, computerMove};
})();

const game = (() => {
  let isWinner = false;
  let currentPlayer;
  const loop = () => {
    for (let i = 0; i < 9; i++) {
      renderer.boardSquares[i].addEventListener("click", () => {
        if (gameBoard.xoArray[i] === "") {
          game.currentPlayer = player.symbol;
          renderer.changeStatsColor("player");
          gameBoard.xoArray[i] = player.symbol;
          renderer.disableButtons();
          renderer.updateBoard();
          renderer.xoAnimation(renderer.boardSquares[i]);
          renderer.updateBannerDisplay(`${computer.symbol.toUpperCase()} turn`);
          isWinner = checkIfWinner(player.symbol, gameBoard.xoArray);
          endGame(isWinner, player.name);
          if (isWinner === true || isWinner === "tie") {
            setTimeout(() => {
              renderer.boardSquares[i].focus();
            }, "2000");
            return;
          };
          game.currentPlayer = computer.symbol;
          renderer.changeStatsColor("computer");
          setTimeout(() => {
            computer.computerMove(computer.difficulty);
            renderer.updateBannerDisplay(`${player.symbol.toUpperCase()} turn`);
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
    if (arr[0] === xo && arr[1] === xo && arr[2] === xo) {
      gameBoard.pushToWinningArray(0, 1, 2);
      return true;
      } else if (arr[3] === xo && arr[4] === xo && arr[5] === xo) {
      gameBoard.pushToWinningArray(3, 4, 5);
      return true;
      } else if (arr[6] === xo && arr[7] === xo && arr[8] === xo) {
      gameBoard.pushToWinningArray(6, 7, 8);
      return true;
      } else if (arr[0] === xo && arr[3] === xo && arr[6] === xo) {
      gameBoard.pushToWinningArray(0, 3, 6);
      return true;
      } else if (arr[1] === xo && arr[4] === xo && arr[7] === xo) {
      gameBoard.pushToWinningArray(1, 4, 7);
      return true;
      } else if (arr[2] === xo && arr[5] === xo && arr[8] === xo) {
      gameBoard.pushToWinningArray(2, 5, 8);
      return true;
      } else if (arr[0] === xo && arr[4] === xo && arr[8] === xo) {
      gameBoard.pushToWinningArray(0, 4, 8);
      return true;
      } else if (arr[2] === xo && arr[4] === xo && arr[6] === xo) {
      gameBoard.pushToWinningArray(2, 4, 6);
      return true;
      } else if (!arr.includes("")) {
      gameBoard.pushToWinningArray(0, 1, 2, 3, 4, 5, 6, 7, 8);
      return "tie";
      } else {
      return false;
      };
    };
  const endGame = (isWinner, name) => {
    if (isWinner != false) {
      if (isWinner === true && name === "player") {
        player.score += 1;
        renderer.updateBannerDisplay(`${player.symbol.toUpperCase()} wins`);
        renderer.endGameAnimation("player");
        console.log(name + " won");
      } else if (isWinner === true && name === "computer") {
        computer.score += 1
        renderer.updateBannerDisplay(`${computer.symbol.toUpperCase()} wins`);
        renderer.endGameAnimation("computer");
        console.log(name + " won");
      } else if (isWinner === "tie") {
        renderer.updateBannerDisplay(`tie`);
        console.log("no one won");
      }
      renderer.clearBoardAnimation();
      setTimeout(() => {
        renderer.changeStatsColor("none");
        changePlayerSymbol(player.symbol);
        renderer.changeStatsColor("player");
        renderer.updateBannerDisplay(`Tic-Tac-Toe`);
        renderer.enableButtons();
        for (let i = 0; i < 9; i++) {
          gameBoard.xoArray[i] = "";
        };
        gameBoard.winningXORow.length = 0;
        renderer.updateBoard();
      }, "2000");
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
  return {loop, checkIfWinner, currentPlayer};
})();

renderer.difficultyButtonEvent();
renderer.updateBoard();
game.loop();
renderer.changeStatsColor("player");
