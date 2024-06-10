// Mendapatkan elemen HTML yang akan digunakan dalam game
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const foodSound = document.getElementById("foodSound");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Mendapatkan skor tertinggi dari local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Menentukan posisi makanan secara acak antara 1 - 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Menghentikan timer dan me-reload halaman saat game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    // Mengubah nilai kecepatan berdasarkan tombol panah yang ditekan
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Menambahkan event listener pada setiap tombol kontrol yang dipencet
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Mengecek apakah ular memakan makanan
    if(snakeX === foodX && snakeY === foodY) {
        foodSound.play(); // Memainkan suara saat makanan dimakan
        updateFoodPosition(); // Mengupdate posisi makanan
        snakeBody.push([foodY, foodX]); // Menambah panjang tubuh ular
        score++; // Menambah skor
        highScore = score >= highScore ? score : highScore; // Update skor tertinggi jika skor sekarang lebih tinggi
        localStorage.setItem("high-score", highScore); // Menyimpan skor tertinggi ke local storage
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Mengupdate posisi kepala ular berdasarkan kecepatan saat ini
    snakeX += velocityX;
    snakeY += velocityY;

    // Memindahkan nilai dari elemen-elemen di tubuh ular satu posisi maju
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Menempatkan elemen pertama tubuh ular ke posisi kepala ular saat ini

    // Mengecek apakah kepala ular keluar dari batas papan permainan
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Menambahkan div untuk setiap bagian tubuh ular
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Mengecek apakah kepala ular bertabrakan dengan tubuhnya sendiri
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html; // Menampilkan HTML yang telah diupdate ke dalam playBoard
}

updateFoodPosition(); // Mengupdate posisi makanan pertama kali
setIntervalId = setInterval(initGame, 100); // Menjalankan fungsi initGame setiap 100 milidetik
document.addEventListener("keyup", changeDirection); // Menambahkan event listener untuk perubahan arah berdasarkan tombol panah yang ditekan
