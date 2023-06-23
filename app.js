/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint linebreak-style: ["error", "windows"] */

function GuesNumber() {
  const getRndColor = (max = 5) => {
    const colors = {
      0: '#e97dad',
      1: '#874bbf',
      2: '#6db7e8',
      3: '#a0c65d',
      4: 'transparent',
    };
    const ind = Math.floor(Math.random() * max);
    return colors[ind];
  };

  const getRndNumber = (max, min = 1) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRndNumbersArr = (max, items) => {
    const arr = [];

    while (arr.length < items) {
      const rndNumber = getRndNumber(max);
      if (!arr.includes(rndNumber)) arr.push(rndNumber);
    }

    return arr;
  };

  const fieldWrapper = document.querySelector('.field__wrapper');
  class TimerClass {
    constructor(seconds) {
      this.seconds = seconds;
    }

    start() {
      const timerSpan = document.querySelector('#timer');
      const timerId = setInterval(() => {
        timerSpan.innerText = `00:${this.seconds.toString().padStart(2, '0')}`;
        if (this.seconds > 0) {
          this.seconds -= 1;
        } else {
          clearInterval(timerId);
        }
      }, 1000);
    }
  }

  class Player {
    constructor() {
      this.results = {
        current: 10,
        attempts: 0,
        right: 0,
        ip: 0,
        neurons: 0,
      };
    }

    setAttempt(attempts) {
      this.attempts = attempts;
    }

    setRight(right) {
      this.right = right;
    }

    getSummary() {
      return this.results;
    }
  }

  class Game {
    constructor(level, timerObj, player) {
      this.results = player.results;
      this.timerObj = timerObj;
      this.level = level;
      this.targetNum = 0;
      this.levels = {
        1: { numbers: 6, digits: 9 },
        2: { numbers: 6, digits: 9 },
        3: { numbers: 6, digits: 9, animation: 'scale' }, // мигание размера чисел и button с фоном
        4: { numbers: 12, digits: 99, animation: 'scale' }, // 3/12
        5: { numbers: 12, digits: 99, animation: 'scale' }, // 3/12 4*3
        6: { numbers: 16, digits: 999, animation: 'scale-rotate' }, // 3/16 - вращение на 30гр чисел
        7: { numbers: 16, digits: 999, animation: 'scale-rotate' }, // 4/16 4*4
        8: { numbers: 25, digits: 999, animation: 'scale-rotate' }, // 4/25
        9: { numbers: 25, digits: 9999, animation: 'scale-rotate' }, // 4/25 5*5
      };
    }

    createField() {
      const gameWrapper = document.querySelector('.game__wrapper');
      const field = document.createElement('div');
      field.classList.add('grid-container');
      fieldWrapper.appendChild(field);
      gameWrapper.style.background = getRndColor(4);

      const { numbers } = this.levels[this.level];

      if (numbers === 6) field.classList.add('cols3');
      if (numbers === 12) field.classList.add('cols4');
      if (numbers === 16) field.classList.add('cols4');
      if (numbers === 25) field.classList.add('cols5');
    }

    removeField() {
      const field = document.querySelector('.grid-container');
      fieldWrapper.removeChild(field);
    }

    fillField() {
      const field = document.querySelector('.grid-container');

      const goal = document.querySelector('#goal');
      const { numbers, digits, animation } = this.levels[this.level];

      const numbersArr = getRndNumbersArr(digits, numbers);
      const targetInd = getRndNumber(numbers - 1, 0);
      this.targetNum = numbersArr[targetInd];

      goal.innerText = this.targetNum;

      for (let i = 0; i < numbersArr.length; i += 1) {
        const button = document.createElement('button');
        const span = document.createElement('span');
        button.style.background = getRndColor();
        button.classList.add('game__button');
        button.appendChild(span);

        if (i === targetInd) span.innerText = this.targetNum;
        else span.innerText = numbersArr[i];

        field.appendChild(button);

        span.style.animationName = animation;
      }

      field.addEventListener('click', this.checkNumber);
    }

    updateLvl() {
      const levelSpan = document.querySelector('#level');
      levelSpan.innerText = `${this.level}-9`;
    }

    checkNumber = ({ target }) => {
      const answerStatusModal = document.querySelector('.answer-status');
      answerStatusModal.style.animationName = '';

      const notcorrectImg = document.querySelector('.notcorrect');
      const correctImg = document.querySelector('.correct');

      correctImg.style.display = 'none';
      notcorrectImg.style.display = 'none';

      if (target.innerText === this.targetNum.toString()) {
        if (this.level < 9) {
          this.level += 1;
        }

        this.updateLvl();

        correctImg.style.display = 'block';
        this.results.right += 1;
      } else {
        notcorrectImg.style.display = 'block';
      }
      this.results.attempts += 1;

      answerStatusModal.style.animationName = 'slideInOut';
      if (this.checkGameOver()) {
        this.showSummary();
      } else {
        this.removeField();
        this.createField(this.level);
        this.fillField(this.level);
      }
    };

    checkGameOver() {
      if (this.timerObj.seconds === 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
      }
      return false;
    }

    showSummary() {
      const { results } = this;
      const summaryModal = document.querySelector('.summary');
      summaryModal.classList.toggle('slidein');
      summaryModal.classList.toggle('slideout');

      const resultCurrentSpan = document.querySelector('#result__current');
      const resultRightSpan = document.querySelector('#result__right');
      const resultAccuracySpan = document.querySelector('#result__accuracy');
      const resultIpSpan = document.querySelector('#result__ip');
      const resultNeuronsSpan = document.querySelector('#result__neurons');

      resultCurrentSpan.innerText = results.current;
      resultRightSpan.innerText = `${results.right} из ${results.attempts}`;
      resultAccuracySpan.innerText = `${(
        (results.right / results.attempts) *
        100
      ).toFixed(0)}%`;
      resultIpSpan.innerText = results.ip;
      resultNeuronsSpan.innerText = results.neurons;
    }

    start() {
      this.updateLvl();
      this.createField(this.level);
      this.fillField(this.level);
    }
  }

  const gameLogic = () => {
    const player = new Player();

    const startGame = () => {
      const level = 1;

      const timer = new TimerClass(60);
      timer.start();

      const game = new Game(level, timer, player);

      game.start();
    };

    const buttonStart = document.querySelector('.btn-start');
    const buttonStartAgain = document.querySelector('.btn-again');

    buttonStartAgain.addEventListener('click', () => {
      const oldField = document.querySelector('.field__wrapper');
      oldField.removeChild(oldField.children[0]);

      const summaryModal = document.querySelector('.summary');
      summaryModal.classList.toggle('slidein');
      summaryModal.classList.toggle('slideout');
      startGame();
    });

    buttonStart.addEventListener('click', () => {
      const startGameModal = document.querySelector('.start-game');
      startGameModal.style.display = 'none';

      startGame();
    });
  };
  gameLogic();
}
window.onload = async () => {
  GuesNumber();
};
