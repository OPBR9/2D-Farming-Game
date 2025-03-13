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
let seedCount = 5;

let soil = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
let crops = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

// Create shop button
const shopButton = document.createElement("button");
shopButton.innerText = "Buy Seed ($5)";
shopButton.style.position = "absolute";
shopButton.style.top = "10px";
shopButton.style.right = "10px";
document.body.appendChild(shopButton);

shopButton.addEventListener("click", () => {
    if (money >= SEED_COST) {
        money -= SEED_COST;
        seedCount++;
    }
});

canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / GRID_SIZE);
    const row = Math.floor((event.clientY - rect.top) / GRID_SIZE);

    if (event.button === 0) { // Left Click: Plant
        if (soil[row] && soil[row][col] && !crops[row][col] && seedCount > 0) {
            crops[row][col] = true;
            seedCount--;
        }
    } else if (event.button === 2) { // Right Click: Prepare soil
        event.preventDefault();
        if (soil[row]) soil[row][col] = true;
    } else if (event.button === 1) { // Middle Click: Harvest
        if (crops[row] && crops[row][col]) {
            crops[row][col] = false;
            money += SELL_PRICE;
        }
    }
});

document.addEventListener("contextmenu", (event) => event.preventDefault());

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
    ctx.fillText(`Seeds: ${seedCount}`, 10, 50);

    requestAnimationFrame(draw);
}

draw();
