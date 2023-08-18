document.addEventListener("DOMContentLoaded", () => {
  const newGame = document.createElement("div");
  newGame.classList.add("new-game");
  newGame.innerText = "New Game";
  document.body.appendChild(newGame);

  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  document.body.appendChild(wrapper);

  const counterResults = document.createElement("div");
  counterResults.classList.add("counter-results");
  document.body.appendChild(counterResults);

  function startGame() {
    const movesCounter = document.createElement("div");

    const movesWrapper = document.createElement("div");
    const movesHeader = document.createElement("h2");
    movesHeader.innerText = "Moves";
    movesWrapper.classList.add("counter-moves");
    movesCounter.classList.add("moves");
    counterResults.appendChild(movesWrapper);
    movesWrapper.appendChild(movesHeader);
    movesWrapper.appendChild(movesCounter);

    const timer = document.createElement("div");
    const timerHeader = document.createElement("h2");
    timerHeader.innerText = "Seconds";
    timer.classList.add("timer");
    counterResults.appendChild(timer);
    timer.appendChild(timerHeader);

    const flagCounter = document.createElement("div");
    const flagCounterSymbol = document.createElement("div");
    const flagAmount = document.createElement("div");

    flagCounterSymbol.innerText = "🚩";
    flagCounter.classList.add("flag-wrapper");
    flagAmount.classList.add("flag-amount");
    counterResults.appendChild(flagCounter);
    flagCounter.appendChild(flagCounterSymbol);
    flagCounter.appendChild(flagAmount);

    const bombWrapper = document.createElement("div");
    const bombCounterSymbol = document.createElement("div");
    const bombAmount = document.createElement("div");

    bombCounterSymbol.innerText = "💣";
    bombWrapper.classList.add("bomb-wrapper");
    counterResults.appendChild(bombWrapper);
    bombWrapper.appendChild(bombCounterSymbol);
    bombWrapper.appendChild(bombAmount);

    const second = document.createElement("div");
    second.classList.add("second");
    timer.appendChild(second);
    second.innerHTML = "00";

    let width = 10;
    let squares = [];
    let bombTotal = 10;
    let flags = 0;
    let isGameOver = false;
    let isWin = false;
    let calc = width * width;
    let moves = 0;
    let timeCounter = 0;
    let interval;
    let isTimerStart = false;
    let bombs = bombTotal;

    movesCounter.innerText = moves;
    flagAmount.innerText = flags;
    bombAmount.innerText = bombs;

    function createBoard() {
      // создаем доску

      // добавляем флаг
      function addFlag(square) {
        if (isGameOver || isWin) return;
        if (!square.classList.contains("checked")) {
          if (!square.classList.contains("flag")) {
            square.classList.add("flag");
            square.innerHTML = "🚩";
            flags += 1;
            bombs -= 1;
            flagAmount.innerText = flags;
            bombAmount.innerText = bombs;
          } else {
            square.classList.remove("flag");
            square.innerHTML = "";
            flags = flags - 1;
            bombs += 1;
            flagAmount.innerText = flags;
            bombAmount.innerText = bombs;
          }
        }
      }

      const bombsArr = Array(bombTotal).fill("bomb");
      const emptyArr = Array(width * width - bombTotal).fill("valid");

      const gameArr = emptyArr.concat(bombsArr);

      const mixArr = gameArr.sort(() => Math.random() - 0.5);

      for (let i = 0; i < width * width; i += 1) {
        const square = document.createElement("div");
        square.setAttribute("id", i);
        square.classList.add(mixArr[i]);
        wrapper.appendChild(square);
        squares.push(square);

        // правый клик
        square.addEventListener("click", function (e) {
          moves += 1;
          if (moves === 1 && square.classList.contains("bomb")) {
            wrapper.innerHTML = "";
            counterResults.innerHTML = "";
            startGame();
          } else {
            if (!isTimerStart) {
              interval = setInterval(startTimer, 1000);
              isTimerStart = true;
            }
            movesCounter.innerText = moves;
            click(square);
            setTimeout(() => {
              if (!isGameOver) {
                checkWin();
              }
            }, 10);
          }
        });

        // левый клик
        square.oncontextmenu = function (el) {
          el.preventDefault();
          addFlag(square);
        };
      }

      // add number square
      for (let i = 0; i < squares.length; i += 1) {
        const isEdgeLeft = i % width === 0; // правый край
        const isEdgeRight = i % width === width - 1; // левый край
        let numSquare = 0;
        if (squares[i].classList.contains("valid")) {
          if (
            i > 0 &&
            !isEdgeLeft &&
            squares[i - 1].classList.contains("bomb")
          ) {
            // не первый и  если не слевого края и контейнер слева с бомб
            numSquare += 1;
          }
          if (
            i > 9 &&
            !isEdgeRight &&
            squares[i + 1 - width].classList.contains("bomb")
          ) {
            // > 9 и не на правом краю правый верхний кравдрат с бомб
            numSquare += 1;
          }
          if (i > 10 && squares[i - width].classList.contains("bomb")) {
            // > 10 и верхний кравдрат с бомб
            numSquare += 1;
          }
          if (
            i > 11 &&
            !isEdgeLeft &&
            squares[i - 1 - width].classList.contains("bomb")
          ) {
            // > 11 и левый верхний кравдрат с бомб
            numSquare += 1;
          }
          if (
            i < 98 &&
            !isEdgeRight &&
            squares[i + 1].classList.contains("bomb")
          ) {
            // не последний и правый кравдрат с бомб
            numSquare += 1;
          }
          if (
            i < 90 &&
            !isEdgeLeft &&
            squares[i - 1 + width].classList.contains("bomb")
          ) {
            // не нижний ряд и левый нижний кравдрат с бомб
            numSquare += 1;
          }
          if (
            i < 90 &&
            !isEdgeRight &&
            squares[i + 1 + width].classList.contains("bomb")
          ) {
            // не нижний ряд и правый нижний кравдрат с бомб
            numSquare += 1;
          }
          if (i < 90 && squares[i + width].classList.contains("bomb")) {
            // не нижний ряд и правый нижний кравдрат с бомб
            numSquare += 1;
          }
          squares[i].setAttribute("data", numSquare);
          if (numSquare === 1) {
            squares[i].style.color = "#01161f";
          }
          if (numSquare === 2) {
            squares[i].style.color = "#1d0dfd";
          }
          if (numSquare === 3) {
            squares[i].style.color = "#9c0514";
          }
          if (numSquare === 4) {
            squares[i].style.color = "#641349";
          }
          if (numSquare === 5) {
            squares[i].style.color = "#8407ba";
          }
          if (numSquare === 6) {
            squares[i].style.color = "#2c9c06";
          }
          if (numSquare === 7) {
            squares[i].style.color = "#9c7b06";
          }
          if (numSquare === 8) {
            squares[i].style.color = "#cc2a02";
          }
        }
      }
    }
    createBoard();

    function startTimer() {
      timeCounter++;
      if (timeCounter < 9) {
        second.innerHTML = "0" + timeCounter;
      }
      if (timeCounter > 9) {
        second.innerHTML = timeCounter;
      }
    }

    function click(square) {
      let currentId = square.id;
      if (isGameOver || isWin) return;
      if (
        square.classList.contains("checked") ||
        square.classList.contains("flag")
      )
        return;
      if (square.classList.contains("bomb")) {
        clearInterval(interval);
        gameOver(square);
      } else {
        let numSquare = square.getAttribute("data");
        if (numSquare != 0) {
          square.classList.add("checked");
          square.innerHTML = numSquare;
          calc = calc - 1;
          return;
        }

        checkSquare(currentId);
      }
      calc = calc - 1;
      square.classList.add("checked");
      checkWin();
    }

    function checkSquare(currentId) {
      // функция раскрывающая при клике на пустую ячейку
      const isEdgeLeft = currentId % width === 0; // правый край
      const isEdgeRight = currentId % width === width - 1; // левый край

      setTimeout(() => {
        if (currentId > 0 && !isEdgeLeft) {
          // не 1 не левый край
          const newId = squares[parseInt(currentId) - 1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isEdgeRight) {
          const newId = squares[parseInt(currentId) + 1 - width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 10) {
          const newId = squares[parseInt(currentId) - width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 11 && !isEdgeLeft) {
          const newId = squares[parseInt(currentId) - 1 - width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 98 && !isEdgeRight) {
          const newId = squares[parseInt(currentId) + 1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isEdgeLeft) {
          const newId = squares[parseInt(currentId) - 1 + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 89 && !isEdgeRight) {
          const newId = squares[parseInt(currentId) + 1 + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 89) {
          const newId = squares[parseInt(currentId) + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 10);
    }

    function gameOver(square) {
      isGameOver = true;

      // show all bomb
      squares.forEach((square) => {
        if (square.classList.contains("bomb")) {
          square.innerHTML = "💣";
        }
      });
      setTimeout(() => {
        alert("Game over. Try again");
      }, 20);
    }

    function checkWin() {
      if (isWin || isGameOver) return;
      if (calc === bombTotal) {
        alert(
          `Hooray! You found all mines in ${timeCounter} seconds and ${moves} moves!`
        );
        isWin = true;
        clearInterval(interval);
      }
    }
  }

  startGame();

  newGame.addEventListener("click", function (e) {
    wrapper.innerHTML = "";
    counterResults.innerHTML = "";
    startGame();
  });
});
