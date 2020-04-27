class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Hypothesis of triangle
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(value) {
    const fact = value / this.len;

    this.x *= fact;
    this.y *= fact;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }

  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.vel = new Vec();
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this.ball = new Ball();

    this.players = [new Player(), new Player()];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;

    this.players.forEach((player) => (player.pos.y = this._canvas.height / 2));

    // RequestAnimationFrame give back the time elapsed since the last time
    // we refreshed the page and take in a callback
    let lastTime;
    const callback = (millis) => {
      if (lastTime) {
        // We calculate the time difference in seconds
        this.update((millis - lastTime) / 1000);
      }

      // update lastTime with millis
      lastTime = millis;

      // RequestAnimationFrame calls the callback only once so we attach it again
      requestAnimationFrame(callback);
    };

    callback();

    /*
    111
    101
    101 - For score 0
    101
    111

    we save all the numbers from 0 - 9 
    */
    this.CHAR_PIXEL = 10;
    this.CHARS = [
      "111101101101111",
      "010010010010010",
      "111001111100111",
      "111001111001111",
      "101101111001001",
      "111100111001111",
      "111100111101111",
      "111001001001001",
      "111101111101111",
      "111101111001111",
    ].map((str) => {
      const canvas = document.createElement("canvas");
      canvas.height = this.CHAR_PIXEL * 5;
      canvas.width = this.CHAR_PIXEL * 3;

      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      str.split("").forEach((fill, i) => {
        // A little tricky here. We are asking to fill the pixel only if
        // it has "1".
        if (fill === "1") {
          context.fillRect(
            (i % 3) * this.CHAR_PIXEL,
            ((i / 3) | 0) * this.CHAR_PIXEL,
            this.CHAR_PIXEL,
            this.CHAR_PIXEL
          );
        }
      });
    });

    this.reset();
  }

  drawRect(rect) {
    // Add the white ball
    this._context.fillStyle = "#fff";
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  collide(player, ball) {
    if (
      player.left < ball.right &&
      player.right > ball.left &&
      player.top < ball.bottom &&
      player.bottom > ball.top
    ) {
      const len = ball.vel.len;
      ball.vel.x = -ball.vel.x;
      ball.vel.y += 300 * (Math.random() - 0.5);
      ball.vel.len = len * 1.05;
    }
  }

  draw() {
    // Fill the box with black color
    this._context.fillStyle = "#000";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);

    this.players.forEach((player) => this.drawRect(player));

    this.drawScore();
  }

  drawScore()
  {
      const align = this._canvas.width / 3;
      const cw = this.CHAR_PIXEL * 4;
      this.players.forEach((player, index) => {
          const chars = player.score.toString().split('');
          const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
          chars.forEach((char, pos) => {
              this._context.drawImage(this.CHARS[char|0], offset + pos * cw, 20);
          });
      });
  }

  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.vel.y = 300 * (Math.random() * 2 - 1);

      this.ball.vel.len = 200;
    }
  }

  // We use the time delta to calculate how much movement should the
  // ball have
  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      // Concise way to check if something is true and assign it to an integer
      const playerId = (this.ball.vel.x < 0) | 0;

      // Long way of doing the same thing
      //   if (this.ball.vel.x < 0) {
      //     playerId = 1;
      //   } else {
      //     playerId = 0;
      //   }

      this.players[playerId].score++;
      this.reset();
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.players.forEach((player) => this.collide(player, this.ball));

    this.draw();
  }
}

const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

canvas.addEventListener("mousemove", (event) => {
  pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener("click", (event) => pong.start());
