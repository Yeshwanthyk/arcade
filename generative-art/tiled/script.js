var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

let step = 30;

var size = window.innerHeight;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);

context.lineCap = 'square';
context.lineWidth = 2;

function draw(x, y, width, height) {
  const leftToRight = Math.random() >= 0.5;

  //   let colorh = Math.floor(Math.random() * 100) + 110;
  let colorh = Math.floor(Math.random() * 255) + 1;
  context.strokeStyle = `hsl(
        ${colorh},
        53%,
        77%,
        1`;
  context.beginPath();

  if (leftToRight) {
    context.moveTo(x, y);
    context.lineTo(x + width, y + height);
  } else {
    context.moveTo(x + width, y);
    context.lineTo(x, y + height);
  }

  console.log(context.strokeStyle);
  context.stroke();
  context.closePath();
}

for (let x = 0; x < size; x += step) {
  for (let y = 0; y < size; y += step) {
    draw(x, y, step, step);
  }
}
