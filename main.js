var canvas,
    ctx,
    width  = 600,
    height = 600,

    ship_x = (width / 2) - 25,
    ship_y = height - 75,
    ship_w = 50,
    ship_h = 50;

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

function drawShip() {
  ctx.fillStyle = '#0f0';
  ctx.fillRect(ship_x, ship_y, ship_w, ship_h);
}

function init () {
  canvas = document.getElementById('canvas');
  ctx    = canvas.getContext('2d');
  setInterval(gameLoop, 25);
}

function gameLoop() {
  clearCanvas();
  drawShip();
}

window.onload = init;
