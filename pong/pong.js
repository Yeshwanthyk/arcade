class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.vel = new Vec();
  }
}

const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

const ball = new Ball();
ball.pos.x = 100;
ball.pos.y = 50;

ball.vel.x = 100;
ball.vel.y = 100;

// RequestAnimationFrame give back the time elapsed since the last time
// we refreshed the page and take in a callback
let lastTime;
function callback(millis) {
  if (lastTime) {
    // We calculate the time difference in seconds
    update((millis - lastTime) / 1000);
  }

  // update lastTime with millis
  lastTime = millis;

  // RequestAnimationFrame calls the callback only once so we attach it again
  requestAnimationFrame(callback);
}

// We use the time delta to calculate how much movement should the
// ball have
function update(dt) {
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  // Fill the box with black color
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add the white ball
  context.fillStyle = "#fff";
  context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callback();
