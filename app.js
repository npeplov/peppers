const fieldWrapper = document.querySelector(".field__wrapper");

// v 1 timer, уровень вверху
// v 2 после окончания таймера - итоги
// v верстка дива, v кнопка стили
// v 4 рандомный цвет бэкграунда
// v 5 вращение
// - выписать на каком уровне появляется
// - какой градус
// 7 страница старта
// 8 страница правил
// v 10 при лвлапе вывести
// v модалка position: absolute,
// v zindex 2
// v transform: translate()
// v 11 при неправильном X и новый экран
// v 13 вывести итоги если таймер закончен
// v поместить в модалку
// v overflow hidden

// 9 таймер 3-2-1 
// - старт игры

// 8d3dca
// 3 подсчет очков
// - нейронов синим - добавляются в прогрессбар
// - прогрессбар
// 6 рефактор
// - без харкод величин в контейнере
// - тустринг ===

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const results = {
  current: 105,
  attempts: 4,
  right: 2,
  ip: 100,
  neurons: 3,
};

const showSummary = () => {
  const summaryModal = document.querySelector(".summary");
  summaryModal.classList.add("slidein");

  const resultCurrentSpan = document.querySelector("#result__current");
  const resultRightSpan = document.querySelector("#result__right");
  const resultAccuracySpan = document.querySelector("#result__accuracy");
  const resultIpSpan = document.querySelector("#result__ip");
  const resultNeuronsSpan = document.querySelector("#result__neurons");

  resultCurrentSpan.innerText = results.current;
  resultRightSpan.innerText = `${results.right} из ${results.attempts}`;
  resultAccuracySpan.innerText = `${(
    (results.right / results.attempts) *
    100
  ).toFixed(0)}%`;
  resultIpSpan.innerText = results.ip;
  resultNeuronsSpan.innerText = results.neurons;
};

class TimerClass {
  constructor(seconds) {
    this.seconds = seconds;
  }

  timer() {
    const timerSpan = document.querySelector("#timer");
    let timerId = setInterval(() => {
      timerSpan.innerText = `00:${this.seconds.toString().padStart(2, "0")}`;
      if (this.seconds > 0) {
        this.seconds -= 1;
      } else {
        clearInterval(timerId);
      }
    }, 1000);
  }
}

const timerObj = new TimerClass(2);

const createField = (level = 1) => {
  const appWrapper = document.querySelector(".app__wrapper");
  const field = document.createElement("div");
  field.classList.add("grid-container");
  fieldWrapper.appendChild(field);
  appWrapper.style.background = getRndColor(4);

  const { numbers } = levels[level];

  if (numbers === 6) field.classList.add("cols3");
  if (numbers === 12) field.classList.add("cols4");
  if (numbers === 16) field.classList.add("cols4");
  if (numbers === 25) field.classList.add("cols5");
};

const removeField = () => {
  const field = document.querySelector(".grid-container");
  fieldWrapper.removeChild(field);
};

const fillField = (level = 1) => {
  const field = document.querySelector(".grid-container");

  const goal = document.querySelector("#goal");
  const { numbers, digits, animation } = levels[level];

  const numbersArr = getRndNumbersArr(digits, numbers);
  const targetInd = getRndNumber(numbers - 1, 0);
  targetNum = numbersArr[targetInd];

  goal.innerText = targetNum;

  for (let i = 0; i < numbersArr.length; i++) {
    const button = document.createElement("button");
    const span = document.createElement("span");
    button.style.background = getRndColor();
    button.classList.add("game__button");
    button.appendChild(span);

    if (i === targetInd) span.innerText = targetNum;
    else span.innerText = numbersArr[i];

    field.appendChild(button);

    span.style.animationName = animation;
  }

  field.addEventListener("click", checkNumber);
};

function checkNumber({ target }) {
  const answerStatusModal = document.querySelector(".answer-status");
  answerStatusModal.style.animationName = "";

  notcorrectImg = document.querySelector(".notcorrect");
  correctImg = document.querySelector(".correct");

  correctImg.style.display = "none";
  notcorrectImg.style.display = "none";

  if (target.innerText == targetNum) {
    level < 9 ? (level += 1) : (level = 9);

    const levelSpan = document.querySelector("#level");
    levelSpan.innerText = `${level}-9`;

    correctImg.style.display = "block";
  } else {
    notcorrectImg.style.display = "block";
  }

  answerStatusModal.style.animationName = "slideInOut";
  removeField();
  createField(level);
  fillField(level);
  checkGameOver();
}

const checkGameOver = async () =>{
  if (timerObj.seconds === 0) {
    await delay(1000)
    showSummary();
  }
}

const getRndColor = (max = 5) => {
  const colors = {
    0: "#e97dad",
    1: "#874bbf",
    2: "#6db7e8",
    3: "#a0c65d",
    4: "transparent",
  };

  // TODO: задать мин число
  const ind = Math.floor(Math.random() * max);
  return colors[ind];
};

const getRndNumber = (max, min = 1) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (num === undefined) console.log(max, min);
  return num;
};

const getRndNumbersArr = (max, items) => {
  const arr = [];

  while (arr.length < items) {
    const rndNumber = getRndNumber(max);
    if (!arr.includes(rndNumber)) arr.push(rndNumber);
  }

  return arr;
};

const levels = {
  1: { numbers: 6, digits: 9 },
  2: { numbers: 6, digits: 9 },
  3: { numbers: 6, digits: 9, animation: "scale" }, // мигание размера чисел и button с фоном
  4: { numbers: 12, digits: 99, animation: "scale" }, // 3/12
  5: { numbers: 12, digits: 99, animation: "scale" }, // 3/12 4*3
  6: { numbers: 16, digits: 999, animation: "scale-rotate" }, // 3/16 - вращение на 30гр чисел
  7: { numbers: 16, digits: 999, animation: "scale-rotate" }, // 4/16 4*4
  8: { numbers: 25, digits: 999, animation: "scale-rotate" }, // 4/25
  9: { numbers: 25, digits: 9999, animation: "scale-rotate" }, // 4/25 5*5
};

let targetNum;
let level = 1;

const startGame = () => {
  level = 1;
  createField(level);
  fillField(level);
  timerObj.timer();
}

window.onload = async () => {
  startGame();
};
