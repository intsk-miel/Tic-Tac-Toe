const gameEventBox = document.querySelector('.game-main');
const checkedEventBoxes = document.querySelectorAll('.box');
const activeHeading = document.querySelector('.heading');
const resetButton = document.querySelector('button');

const playerStats = {
  player0Wins: 0,
  player1Wins: 0,
  draws: 0,
};

class App {
  #activePlayer = 0;
  #winnerState = 0;
  #boxFilled = 0;

  constructor() {
    gameEventBox.addEventListener('click', this._gameLogic.bind(this));
    resetButton.addEventListener('click', this._init.bind(this));
    this._init();
    this._initCharts();
    setInterval(this._updateCharts.bind(this), 1000);
  }

  _init = () => {
    gameEventBox.style.boxShadow = '0 0 30px 10px rgba(0, 0, 0, 0.2)';
    activeHeading.textContent = 'Active Player: 0';
    checkedEventBoxes.forEach((box) => {
      box.innerHTML = '';
      box.classList.remove('p-0', 'p-1');
    });
    gameEventBox.style.pointerEvents = 'all';
    resetButton.style.pointerEvents = 'none';
    this.#activePlayer = 0;
    this.#boxFilled = 0;
    this.#winnerState = 0;
  };

  _displayActive = () => {
    activeHeading.textContent = `Active Player: ${this.#activePlayer ? 0 : 1}`;
  };

  _endGame = () => {
    gameEventBox.style.boxShadow = '0 0 30px 10px rgba(0, 0, 0, 0.7)';
    gameEventBox.style.pointerEvents = 'none';
    resetButton.style.pointerEvents = 'all';
  };

  _gameLogic = (e) => {
    const targetBox = e.target.closest('.box');
    if (!targetBox) return;

    const isP0 = !targetBox.classList.contains('p-0');
    const isP1 = !targetBox.classList.contains('p-1');

    if ((this.#activePlayer === 0 && isP0 && isP1) || (isP0 && isP1)) {
      targetBox.classList.toggle(`p-${this.#activePlayer}`);
      targetBox.innerHTML = `<ion-icon class="icons" name="${this.#activePlayer ? 'sunny-outline' : 'moon-outline'}"></ion-icon>`;
      this._callAllFunc();
      this.#activePlayer ^= 1;
    }
  };

  _callAllFunc = () => {
    this.#boxFilled++;
    this._displayActive();
    this._checkWinner();
  };

  _checkWinner = () => {
    const winCombinations = [
      [0, 1, 2, 0],
      [3, 4, 5, 0],
      [6, 7, 8, 0],
      [0, 3, 6, 90],
      [1, 4, 7, 90],
      [2, 5, 8, 90],
      [0, 4, 8, 45],
      [2, 4, 6, -45],
    ];

    for (const combo of winCombinations) {
      const [a, b, c, d] = combo;
      const isP0 = this._checkClass(a, 'p-0') && this._checkClass(b, 'p-0') && this._checkClass(c, 'p-0');
      const isP1 = this._checkClass(a, 'p-1') && this._checkClass(b, 'p-1') && this._checkClass(c, 'p-1');

      if (isP0 || isP1) {
        this.#winnerState = 1;
        this._displayGameState(!isP0 && !isP1, isP0 ? 0 : 1, combo);
        return;
      }
    }

    if (this.#boxFilled === 9) {
      this._displayGameState(true);
    }
  };

  _displayGameState = (isDraw = false, winner = null, combo = []) => {
    if (isDraw) {
      activeHeading.textContent = 'DRAW';
      playerStats.draws++;
    } else {
      activeHeading.textContent = `Winner Player: ${winner}`;
      playerStats[winner === 0 ? 'player0Wins' : 'player1Wins']++;
      this._colorWinner(combo);
    }

    this._updateCharts();
    this._endGame();
  };

  _checkClass = (num, pl) => checkedEventBoxes[num].classList.contains(pl);

  _colorWinner = (combo) => {
    const [a, b, c, d] = combo;
    const comboBoxes = [checkedEventBoxes[a], checkedEventBoxes[b], checkedEventBoxes[c]];

    comboBoxes.forEach((box) => {
      box.children[0].style.transform = 'scale(1.4)';
      box.innerHTML += `<div class="line-main line${d}"></div>`;
    });
  };

  _initCharts = () => {
    const data = [{
      x: ['Player 0 Wins', 'Player 1 Wins', 'Draws'],
      y: [playerStats.player0Wins, playerStats.player1Wins, playerStats.draws],
      type: 'bar',
      marker: {
        color: ['green', 'red', 'blue'],
      },
    }];

    const layout = {
      title: 'Game Statistics',
      xaxis: {
        title: 'Outcome',
      },
      yaxis: {
        title: 'Count',
      },
    };

    Plotly.newPlot('chart-winner', data, layout);
  };

  _updateCharts = () => {
    const update = {
      y: [[playerStats.player0Wins, playerStats.player1Wins, playerStats.draws]],
    };

    Plotly.update('chart-winner', update);
  };
}

const app = new App();
