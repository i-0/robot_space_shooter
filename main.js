rightKey = false,
leftKey  = false,
upKey    = false,
downKey  = false;

enemyTotal = 5,
enemies    = [],
enemy_x    = 50,
enemy_y    = -45,
enemy_w    = 30,
enemy_h    = 30,
speed      = 3;

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 40;
}

var canvas,
    ctx,
    width  = 300,
    height = 300,

    ship_x = (width / 2) - 25,
    ship_y = height - 75,
    ship_w = 35,
    ship_h = 35;

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

function drawShip() {
  if      (rightKey) ship_x += 4;
  else if (leftKey) ship_x  -= 4;
  if      (upKey) ship_y    += 4;
  else if (downKey) ship_y  -= 4;
  if (ship_x <= 0) ship_x =0;
  if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
  if (ship_y <= 0) ship_y =0;
  if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
  ctx.fillStyle = '#0f0';
  ctx.fillRect(ship_x, ship_y, ship_w, ship_h);
};

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
	ctx.fillStyle = '#f00';
	ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);
  }
}

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
	if (enemies[i][1] < height) {
	  enemies[i][1] += enemies[i][4];
	} else if (enemies[i][1] > height -1) {
	  enemies[i][1] = -45;
	}
  }
}

function init () {
  canvas = document.getElementById('canvas');
  ctx    = canvas.getContext('2d');
  setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyUp'  , keyUp  , false);
}

function gameLoop() {
  clearCanvas();
  moveEnemies();
  drawEnemies();
  drawShip();
}

function keyDown(e) {
  if      (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey  = true;
  if      (e.keyCode == 40) upKey    = true;
  else if (e.keyCode == 38) downKey  = true;
}

function keyUp(e) {
  if      (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey  = false;
  if      (e.keyCode == 40) upKey    = false;
  else if (e.keyCode == 38) downKey  = false;
}


window.onload = init;
