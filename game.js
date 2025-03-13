const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const GRID_SIZE = 32;
const ROWS = canvas.height / GRID_SIZE;
const COLS = canvas.width / GRID_SIZE;
let money = 100;
const SEED_COST = 5;
const SELL_PRICE = 10;

let soil = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
let crops = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

canvas.addEventListener("click", (event) => {
    const col = Math.floor(event.offsetX / GRID_SIZE);
    const row = Math.floor(event.offsetY / GRID_SIZE);

    if (event.button === 0) { // Left Click: Plant
        if (soil[row][col] && !crops[row][col] && money >= SEED_COST) {
            crops[row][col] = true;
            money -= SEED_COST;
        }
    }
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const col = Math.floor(event.offsetX / GRID_SIZE);
    const row = Math.floor(event.offsetY / GRID_SIZE);
    soil[row][col] = true;
});

canvas.addEventListener("auxclick", (event) => {
    if (event.button === 1) { // Middle Click: Harvest
        const col = Math.floor(event.offsetX / GRID_SIZE);
        const row = Math.floor(event.offsetY / GRID_SIZE);
        if (crops[row][col]) {
            crops[row][col] = false;
            money += SELL_PRICE;
        }
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);

            if (soil[row][col]) {
                ctx.fillStyle = "brown";
                ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }

            if (crops[row][col]) {
                ctx.fillStyle = "green";
                ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Money: $${money}`, 10, 20);

    requestAnimationFrame(draw);
}

draw();
