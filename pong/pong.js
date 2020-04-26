const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Fill the box with black color
context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

// Add the white ball
context.fillStyle = "#fff";
context.fillRect(0, 0, 10, 10);
