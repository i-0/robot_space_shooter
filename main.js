/* 
 * Until now the working title of this game is "Robot Space Shooter", why 'cause robots are cool said a good friend of mine =]
 *
 * Based on a tutorial by Mike Thomas @ atomicrobotdesign.com
 * The sprites used are from http://www.widgetworx.com/widgetworx/portfolio/spritelib.html licensed under  Common Public License, credits go to Ari Feldman. I've croped and changed the background of the sprites I've used.
 *
 * This can be considered a playground for game ideas and a small example of what can be done with canvas. In no way do I want to brag with my super duper uber canvas and js skills, I am a bloody rookie.
 *
 * Only thing to say: Have fun!
 *
 * Christoph Gierling,
 * Madrid, 28/09/2012
 *
 * TODO:
 * 		Automatic resolve all magic numbers in the code
 * 		Move magic numbers into named constants
 * 		Refine collision model
 * 		Enemy AI model "can" be improved :D
 * 		More Sprites, more "enemies" the more "honor"
 * 		Lateral animations (booster or inclination of the ship)
 * 		Power-Ups
 * 		A background would be nice
 * 			parallax scrolling - CSS?
 * 			Collision with "walls"
 * 		...
 * 		Web sockets and multilayer sounds cool
 */
var enemy,
   	ship;
var laserTotal = 2,
   	lasers = [];
var score = 0,
	lives = 3,
    alive = true;
var rightKey = false,
    leftKey  = false,
	upKey    = false,
	downKey  = false;
var enemyTotal = 5,
	enemies    = [],
	enemy_x    = 50,
	enemy_y    = -45,
    enemy_w    = 32,
    enemy_h    = 26,
    speed      = 3;

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 40;
}

var canvas,
    ctx,
    width  = 300,
    height = 300

    ship_x = (width / 2) - 25,
    ship_y = height - 75,
    ship_w = 36,
    ship_h = 30;

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

function drawShip() {
  ship = ship_s;
  if      (rightKey) ship_x += 4;
  else if (leftKey) ship_x  -= 4;
  if      (upKey) ship_y    += 4;
  else if (downKey) {
	ship_y  -= 4;
	ship = ship_a;
  }
  if (ship_x <= 0) ship_x =0;
  if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
  if (ship_y <= 0) ship_y =0;
  if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
  ctx.drawImage(ship, ship_x, ship_y);
};

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
	ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
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

function drawLasers() {
  if (lasers.length)
	for (var i = 0; i < lasers.length; i++) {
	  ctx.drawImage(double_shot, lasers[i][0] - 5, lasers[i][1]);
	}
}

function moveLasers() {
  for (var i = 0; i < lasers.length; i++) {
	if (lasers[i][1] > -11) {
	  lasers[i][1] -= 10;
	} else if (lasers[i][1] < -10) {
	  lasers.splice(i, 1);
	}
  }
}

function init () {
  canvas    = document.getElementById('canvas');
  ctx       = canvas.getContext('2d');
  enemy     = new Image();
  enemy.src = 'enemy.png';
  ship_s      = new Image();
  ship_s.src  = 'ship_s.png';
  ship_a    = new Image();
  ship_a.src = 'ship_a.png';
  double_shot = new Image();
  double_shot.src = 'double_shot.png';
  // setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyUp'  , keyUp  , false);
  gameLoop();
}

function gameLoop() {
  clearCanvas();
  if (alive) {
	hitTest();
	shipCollision();
	moveEnemies();
	drawEnemies();
	moveLasers();
	drawLasers();
	drawShip();
  }
  scoreTotal();
  game = setTimeout(gameLoop, 1000 / 30);
}

function keyDown(e) {
  if      (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey  = true;
  if      (e.keyCode == 40) upKey    = true;
  else if (e.keyCode == 38) downKey  = true;
  if 	  (e.keyCode == 88 && lasers.length <= laserTotal) {
	lasers.push([ship_x + 13, ship_y - 10, 4, 20]);
  };
}

function keyUp(e) {
  if      (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey  = false;
  if      (e.keyCode == 40) upKey    = false;
  else if (e.keyCode == 38) downKey  = false;
}

function hitTest() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
	for (var j = 0; j < enemies.length; j++) {
	  if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
		remove = true;
		enemies.splice(j,1);
		score += 10;
		enemies.push([Math.random() * 270 + 50, 45, enemy_w, enemy_h, speed]);
	  }
	}
	if (remove == true) {
	  lasers.splice(i,1);
	  remove = false;
	}
  }
}

function shipCollision() {
  var ship_xw = ship_x + ship_w,
	  ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
	if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
	  checkLives();
	}
	if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
	  checkLives();
	}
	if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
	  checkLives();
	}
	if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
	  checkLives();
	}
  }
}

function checkLives() {
  lives -= 1;
  if (lives > 0) {
	reset();
  } else if (lives == 0) {
	alive = false;
  }
}

function reset() {
  var enemy_reset_x = 50;
  ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 36, ship_h = 30;
  for (var i = 0; i < enemies.length; i++) {
	enemies[i][0] = enemy_reset_x;
	enemies[i][1] = -45;
	enemy_reset_x = enemy_reset_x + enemy_w + 60;
  }
}

function scoreTotal() {
  if (!alive || enemies.length == 0) {
	ctx.fillText('Game Over', 100, height / 2);
	ctx.fillRect((width / 2) - 53, (height / 2) + 10,100,40);
	ctx.fillStyle = '#000';
	ctx.fillText('Continue?', 110, (height / 2) + 35);
	canvas.addEventListener('click', continueButton, false);
  }
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ', 190, 30);
  ctx.fillText(score, 265, 30);
  ctx.fillText('Lives:', 10, 30);
  ctx.fillText(lives, 68, 30);
}

function continueButton(e) {
  var cursorPos = getCursorPos(e);
  if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
	alive = true;
	lives = 3;
	reset();
	canvas.removeEventListener('click', continueButton, false);
  }
}

function getCursorPos(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
	x = e.pageX;
	y = e.pageY;
  } else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}

function cursorPosition(x, y) {
  this.x = x;
  this.y = y;
}
window.onload = init;
