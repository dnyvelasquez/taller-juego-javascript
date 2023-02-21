const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnRestart = document.querySelector('#re_start');
const livesSpan = document.querySelector('#lives');
const timeSpan = document.querySelector('#time');
const clockSpan = document.querySelector('#clock');
const recordSpan = document.querySelector('#record');
const flagSpan = document.querySelector('#flag');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let playerTime;
let timeInterval;

clockSpan.innerHTML = emojis['CLOCK'];
flagSpan.innerHTML = emojis['FLAG'];

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);



function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  
  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    ShowRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  showLives();

  enemiesPositions = [];
  game.clearRect(0,0,canvasSize,canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);
      if (col == 'O') {
        if(!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X") {
        enemiesPositions.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  movePlayer();
}

function gameWin(){
  pResult.innerHTML = 'YOU WIN!!!';
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time')
  const playerTime = Date.now() - timeStart;
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time',  playerTime);
      pResult.innerHTML = "RECORD REACHED!!!";
    } else {
      pResult.innerHTML = "RECORD HAVEN'T REACHED!!!";
    }
  } else {
    localStorage.setItem('record_time',  playerTime);
  }
  console.log({recordTime, playerTime});
}

function levelWin () {
  pResult.innerHTML = 'LEVEL COMPELETE!!!'
  level++;
  startGame();
};

function levelFail() {
  pResult.innerHTML =  'BOOM!!!';
  lives--;  
  if (lives <= 0) {
    pResult.innerHTML = 'YOU LOST!!!';
    level = 0;
    lives = 3;
    timeStart = undefined
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  
  
  const map = maps[level];

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  startGame();
}

function showLives () {
  const heartsArray = Array(lives).fill(emojis['HEART']);
  livesSpan.innerHTML = "";
  heartsArray.forEach(heart => livesSpan.append (heart));
}

function showTime () {
  timeSpan.innerHTML = Date.now() - timeStart;
}

function ShowRecord() {
    recordSpan.innerHTML = localStorage.getItem('record_time');
}

function movePlayer() {
  const giftCollissionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollissionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollission = giftCollissionX && giftCollissionY;
  if (giftCollission) {
    levelWin();
  }
  const enemyCollission = enemiesPositions.find(enemy => {
    const enemyCollissionX = enemy.x.toFixed() == playerPosition.x.toFixed();
    const enemyCollissionY = enemy.y.toFixed() == playerPosition.y.toFixed();
    return enemyCollissionX && enemyCollissionY;
  });
  if (enemyCollission) {
    levelFail();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnRestart.addEventListener('click', re_start);

function moveByKeys(event) {
  switch (event.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  };
};

function moveUp() {
  if ((playerPosition.y - elementsSize) > 1) {
    playerPosition.y -= elementsSize;
    startGame();
  };
};

function moveLeft() {
  if ((playerPosition.x - elementsSize) > 1) {
    playerPosition.x -= elementsSize;
    startGame();
  };
};

function moveRight() {
  if ((playerPosition.x - elementsSize) < (canvasSize - elementsSize)) {
    playerPosition.x += elementsSize;
    startGame();
  };
};

function moveDown() {
  if ((playerPosition.y - elementsSize) < (canvasSize - elementsSize)) {
    playerPosition.y += elementsSize;
    startGame();
  };
};

function re_start() {
  location.reload();
};
