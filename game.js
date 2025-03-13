const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const GRID_SIZE = 32;
const ROWS = canvas.height / GRID_SIZE;
const COLS = canvas.width / GRID_SIZE;
let money = 100;
const SEED_TYPES = {
    wheat: { cost: 5, sellPrice: 15, color: "gold" },
    corn: { cost: 7, sellPrice: 20, color: "yellow" },
    carrot: { cost: 10, sellPrice: 25, color: "orange" }
};
let seeds = { wheat: 0, corn: 0, carrot: 0 };

let soil = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
let crops = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let growthStage = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const player = {
    x: 5,
    y: 5,
    speed: 1
};

function buySeed(type) {
    if (money >= SEED_TYPES[type].cost) {
        money -= SEED_TYPES[type].cost;
        seeds[type]++;
    }
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
        player.x = newX;
        player.y = newY;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") movePlayer(0, -1);
    if (event.key === "ArrowDown") movePlayer(0, 1);
    if (event.key === "ArrowLeft") movePlayer(-1, 0);
    if (event.key === "ArrowRight") movePlayer(1, 0);
});

function growCrops() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (crops[row][col] && growthStage[row][col] < 3) {
                growthStage[row][col]++;
            }
        }
    }
}

setInterval(growCrops, 3000);

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
                let color = SEED_TYPES[crops[row][col]].color;
                let alpha = growthStage[row][col] / 3;
                ctx.fillStyle = `rgba(${color === "gold" ? "255, 215, 0" : color === "yellow" ? "255, 255, 0" : "255, 140, 0"}, ${alpha})`;
                ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * GRID_SIZE, player.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Money: $${money}`, 10, 20);
    ctx.fillText(`Wheat Seeds: ${seeds.wheat} | Corn Seeds: ${seeds.corn} | Carrot Seeds: ${seeds.carrot}`, 10, 50);

    requestAnimationFrame(draw);
}

draw();
