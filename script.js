// ==================== NAVIGATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Handle play button clicks
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            const gameId = card.dataset.game;
            showGame(gameId);
        });
    });

    // Handle back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showHub();
        });
    });
});

function showGame(gameId) {
    document.getElementById('mainHub').style.display = 'none';
    document.getElementById(gameId).style.display = 'block';
    
    // Initialize games when opened
    if (gameId === 'tictactoe') resetTicTacToe();
    if (gameId === 'memory') newMemoryGame();
    if (gameId === 'guess') newGuessGame();
    if (gameId === 'connect4') resetConnect4();
}

function showHub() {
    const games = document.querySelectorAll('.game-container');
    games.forEach(game => game.style.display = 'none');
    document.getElementById('mainHub').style.display = 'block';
}

// ==================== TIC TAC TOE ====================
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttPlayer = 'X';
let tttActive = true;
let tttVsAI = false;
let tttScores = { X: 0, O: 0, draw: 0 };

const tttWinPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function resetTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttPlayer = 'X';
    tttActive = true;
    
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach((cell, i) => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('winning');
        cell.onclick = () => handleTTTClick(i);
    });
    
    document.getElementById('ttt-status').textContent = "Player X's turn";
}

function handleTTTClick(index) {
    if (tttBoard[index] !== '' || !tttActive) return;
    
    makeTTTMove(index, tttPlayer);
    
    if (tttActive && tttVsAI && tttPlayer === 'O') {
        setTimeout(tttAIMove, 500);
    }
}

function makeTTTMove(index, player) {
    tttBoard[index] = player;
    const cells = document.querySelectorAll('.ttt-cell');
    cells[index].textContent = player;
    cells[index].disabled = true;
    
    if (checkTTTWin()) {
        document.getElementById('ttt-status').textContent = `Player ${player} wins! 🎉`;
        tttActive = false;
        tttScores[player]++;
        updateTTTScores();
        return;
    }
    
    if (tttBoard.every(cell => cell !== '')) {
        document.getElementById('ttt-status').textContent = "It's a draw! 🤝";
        tttActive = false;
        tttScores.draw++;
        updateTTTScores();
        return;
    }
    
    tttPlayer = tttPlayer === 'X' ? 'O' : 'X';
    document.getElementById('ttt-status').textContent = `Player ${tttPlayer}'s turn`;
}

function checkTTTWin() {
    for (let pattern of tttWinPatterns) {
        const [a, b, c] = pattern;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            const cells = document.querySelectorAll('.ttt-cell');
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
            return true;
        }
    }
    return false;
}

function tttAIMove() {
    if (!tttActive) return;
    
    let move = findTTTWinningMove('O');
    if (move === -1) move = findTTTWinningMove('X');
    if (move === -1) move = tttBoard[4] === '' ? 4 : -1;
    if (move === -1) {
        const available = tttBoard.map((cell, idx) => cell === '' ? idx : null).filter(val => val !== null);
        move = available[Math.floor(Math.random() * available.length)];
    }
    
    makeTTTMove(move, 'O');
}

function findTTTWinningMove(player) {
    for (let pattern of tttWinPatterns) {
        const [a, b, c] = pattern;
        const values = [tttBoard[a], tttBoard[b], tttBoard[c]];
        const playerCount = values.filter(v => v === player).length;
        const emptyCount = values.filter(v => v === '').length;
        
        if (playerCount === 2 && emptyCount === 1) {
            if (tttBoard[a] === '') return a;
            if (tttBoard[b] === '') return b;
            if (tttBoard[c] === '') return c;
        }
    }
    return -1;
}

function toggleAI() {
    tttVsAI = !tttVsAI;
    const btn = event.target;
    btn.textContent = tttVsAI ? 'vs Player' : 'vs AI';
    resetTicTacToe();
}

function updateTTTScores() {
    document.getElementById('ttt-scoreX').textContent = tttScores.X;
    document.getElementById('ttt-scoreO').textContent = tttScores.O;
    document.getElementById('ttt-scoreDraw').textContent = tttScores.draw;
}

// ==================== COIN FLIP ====================
let coinStats = { heads: 0, tails: 0, total: 0 };

function flipCoin() {
    const coin = document.getElementById('coin');
    const result = document.getElementById('coin-result');
    const flipBtn = document.getElementById('flipBtn');
    
    flipBtn.disabled = true;
    result.textContent = '';
    coin.classList.remove('flipping');
    
    const isHeads = Math.random() < 0.5;
    
    setTimeout(() => {
        coin.classList.add('flipping');
    }, 10);
    
    setTimeout(() => {
        if (isHeads) {
            result.textContent = '🎉 Heads!';
            coinStats.heads++;
        } else {
            result.textContent = '🎊 Tails!';
            coinStats.tails++;
        }
        coinStats.total++;
        
        updateCoinStats();
        flipBtn.disabled = false;
        coin.style.transform = isHeads ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }, 1000);
}

function updateCoinStats() {
    document.getElementById('coin-heads').textContent = coinStats.heads;
    document.getElementById('coin-tails').textContent = coinStats.tails;
    document.getElementById('coin-total').textContent = coinStats.total;
    
    if (coinStats.total > 0) {
        const headsPct = ((coinStats.heads / coinStats.total) * 100).toFixed(1);
        const tailsPct = ((coinStats.tails / coinStats.total) * 100).toFixed(1);
        document.getElementById('coin-heads-pct').textContent = `${headsPct}%`;
        document.getElementById('coin-tails-pct').textContent = `${tailsPct}%`;
    }
}

// ==================== DICE ====================
let diceHistory = [];

function rollDice() {
    const diceType = parseInt(document.getElementById('diceType').value);
    const numDice = parseInt(document.getElementById('numDice').value);
    const display = document.getElementById('diceDisplay');
    
    if (numDice < 1 || numDice > 10) {
        alert('Please choose between 1 and 10 dice');
        return;
    }
    
    display.innerHTML = '';
    const results = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
        const die = document.createElement('div');
        die.className = 'die rolling';
        die.textContent = '?';
        display.appendChild(die);
        
        setTimeout(() => {
            const result = Math.floor(Math.random() * diceType) + 1;
            results.push(result);
            total += result;
            die.textContent = result;
            die.classList.remove('rolling');
            
            if (results.length === numDice) {
                document.getElementById('diceTotal').textContent = `Total: ${total}`;
                updateDiceHistory(results, total, diceType);
            }
        }, 500);
    }
}

function updateDiceHistory(rolls, total, diceType) {
    diceHistory.unshift({ rolls, total, diceType });
    if (diceHistory.length > 5) diceHistory.pop();
    
    const historyEl = document.getElementById('diceHistory');
    historyEl.innerHTML = diceHistory.map(item => `
        <div class="history-item">
            <span>D${item.diceType}: [${item.rolls.join(', ')}]</span>
            <span style="color: #667eea; font-weight: bold;">${item.total}</span>
        </div>
    `).join('');
}

// ==================== NUMBER GUESSING ====================
let guessSecret;
let guessAttempts = 0;
let guessHistory = [];
let guessActive = true;

function newGuessGame() {
    guessSecret = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    guessHistory = [];
    guessActive = true;
    
    document.getElementById('guessAttempts').textContent = '0';
    document.getElementById('guessFeedback').textContent = 'Make your first guess!';
    document.getElementById('guessFeedback').className = 'guess-feedback';
    document.getElementById('guessHistoryItems').textContent = 'No guesses yet';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
}

function makeGuess() {
    if (!guessActive) return;
    
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('Please enter a number between 1 and 100');
        return;
    }
    
    if (guessHistory.includes(guess)) {
        alert('You already guessed that number!');
        return;
    }
    
    guessAttempts++;
    guessHistory.push(guess);
    document.getElementById('guessAttempts').textContent = guessAttempts;
    
    const feedback = document.getElementById('guessFeedback');
    
    if (guess === guessSecret) {
        feedback.textContent = `🎉 Correct! You found it in ${guessAttempts} attempts!`;
        feedback.className = 'guess-feedback correct';
        guessActive = false;
        input.disabled = true;
    } else if (guess < guessSecret) {
        feedback.textContent = '📈 Too Low! Try higher';
        feedback.className = 'guess-feedback low';
    } else {
        feedback.textContent = '📉 Too High! Try lower';
        feedback.className = 'guess-feedback high';
    }
    
    const historyEl = document.getElementById('guessHistoryItems');
    historyEl.innerHTML = guessHistory.map(g => {
        const className = g < guessSecret ? 'low' : g > guessSecret ? 'high' : '';
        return `<div class="guess-item ${className}">${g}</div>`;
    }).join('');
    
    input.value = '';
    input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') makeGuess();
        });
    }
});

// ==================== MEMORY MATCH ====================
const memoryEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryMoves = 0;
let memoryTimer = 0;
let memoryInterval;

function newMemoryGame() {
    clearInterval(memoryInterval);
    memoryTimer = 0;
    memoryMoves = 0;
    memoryMatched = 0;
    memoryFlipped = [];
    
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-matches').textContent = '0/8';
    document.getElementById('memory-timer').textContent = '0:00';
    document.getElementById('memoryWin').classList.remove('show');
    
    memoryCards = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
    
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${emoji}</div>
        `;
        card.onclick = () => flipMemoryCard(card, index);
        board.appendChild(card);
    });
}

function flipMemoryCard(cardEl, index) {
    if (memoryFlipped.length === 2) return;
    if (cardEl.classList.contains('flipped')) return;
    if (cardEl.classList.contains('matched')) return;
    
    if (memoryMoves === 0) {
        memoryInterval = setInterval(() => {
            memoryTimer++;
            const mins = Math.floor(memoryTimer / 60);
            const secs = memoryTimer % 60;
            document.getElementById('memory-timer').textContent = 
                `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    cardEl.classList.add('flipped');
    memoryFlipped.push({ element: cardEl, index: index });
    
    if (memoryFlipped.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').textContent = memoryMoves;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryFlipped;
    
    if (memoryCards[card1.index] === memoryCards[card2.index]) {
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            memoryMatched++;
            document.getElementById('memory-matches').textContent = `${memoryMatched}/8`;
            memoryFlipped = [];
            
            if (memoryMatched === 8) {
                clearInterval(memoryInterval);
                const win = document.getElementById('memoryWin');
                const mins = Math.floor(memoryTimer / 60);
                const secs = memoryTimer % 60;
                win.textContent = `🎉 You won in ${memoryMoves} moves and ${mins}:${secs.toString().padStart(2, '0')}!`;
                win.classList.add('show');
            }
        }, 500);
    } else {
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            memoryFlipped = [];
        }, 1000);
    }
}

// ==================== SIMON SAYS ====================
let simonSequence = [];
let simonPlayerSeq = [];
let simonRound = 0;
let simonPlaying = false;
let simonPlayerTurn = false;
let simonHigh = 0;

const simonColors = ['red', 'blue', 'green', 'yellow'];

function startSimon() {
    simonSequence = [];
    simonPlayerSeq = [];
    simonRound = 0;
    simonPlaying = true;
    
    document.getElementById('simonStartBtn').disabled = true;
    document.getElementById('simonDifficulty').disabled = true;
    
    nextSimonRound();
}

function nextSimonRound() {
    simonRound++;
    document.getElementById('simon-round').textContent = simonRound;
    simonPlayerSeq = [];
    simonPlayerTurn = false;
    
    const randomColor = simonColors[Math.floor(Math.random() * simonColors.length)];
    simonSequence.push(randomColor);
    
    document.getElementById('simonStatus').textContent = 'Watch the pattern...';
    
    const buttons = document.querySelectorAll('.simon-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    playSimonSequence();
}

async function playSimonSequence() {
    const difficulty = document.getElementById('simonDifficulty').value;
    const speed = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 600 : 400;
    
    for (let i = 0; i < simonSequence.length; i++) {
        await sleep(speed);
        await flashSimonButton(simonSequence[i]);
    }
    
    const buttons = document.querySelectorAll('.simon-btn');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.onclick = () => handleSimonClick(btn.dataset.color);
    });
    
    simonPlayerTurn = true;
    document.getElementById('simonStatus').textContent = 'Your turn!';
}

async function flashSimonButton(color) {
    const button = document.querySelector(`.simon-btn[data-color="${color}"]`);
    button.classList.add('active');
    await sleep(300);
    button.classList.remove('active');
}

function handleSimonClick(color) {
    if (!simonPlayerTurn || !simonPlaying) return;
    
    simonPlayerSeq.push(color);
    flashSimonButton(color);
    
    const currentIndex = simonPlayerSeq.length - 1;
    
    if (simonPlayerSeq[currentIndex] !== simonSequence[currentIndex]) {
        simonGameOver();
        return;
    }
    
    if (simonPlayerSeq.length === simonSequence.length) {
        simonPlayerTurn = false;
        const buttons = document.querySelectorAll('.simon-btn');
        buttons.forEach(btn => btn.disabled = true);
        document.getElementById('simonStatus').textContent = 'Correct! Next round...';
        
        setTimeout(() => {
            nextSimonRound();
        }, 1500);
    }
}

function simonGameOver() {
    simonPlaying = false;
    simonPlayerTurn = false;
    
    const buttons = document.querySelectorAll('.simon-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    document.getElementById('simonStatus').textContent = `Game Over! Final Round: ${simonRound}`;
    
    if (simonRound > simonHigh) {
        simonHigh = simonRound;
        document.getElementById('simon-high').textContent = simonHigh;
    }
    
    document.getElementById('simonStartBtn').disabled = false;
    document.getElementById('simonDifficulty').disabled = false;
    document.getElementById('simonStartBtn').textContent = 'Play Again';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== CONNECT 4 ====================
let c4Board = Array(6).fill(null).map(() => Array(7).fill(null));
let c4Player = 'red';
let c4Active = true;
let c4VsAI = false;
let c4Scores = { red: 0, yellow: 0, draw: 0 };

function resetConnect4() {
    c4Board = Array(6).fill(null).map(() => Array(7).fill(null));
    c4Player = 'red';
    c4Active = true;
    
    const board = document.getElementById('c4-board');
    board.innerHTML = '';
    
    // Create 7 columns with 6 rows each
    for (let col = 0; col < 7; col++) {
        const column = document.createElement('div');
        column.className = 'c4-column';
        column.dataset.col = col;
        column.onclick = () => dropC4Disc(col);
        
        for (let row = 0; row < 6; row++) {
            const cell = document.createElement('div');
            cell.className = 'c4-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            column.appendChild(cell);
        }
        
        board.appendChild(column);
    }
    
    document.getElementById('c4-status').textContent = "Red's turn";
}

function dropC4Disc(col) {
    if (!c4Active) return;
    
    // Find the lowest empty row in this column
    let row = -1;
    for (let r = 0; r < 6; r++) {
        if (c4Board[r][col] === null) {
            row = r;
            break;
        }
    }
    
    if (row === -1) return; // Column is full
    
    makeC4Move(row, col, c4Player);
    
    if (c4Active && c4VsAI && c4Player === 'yellow') {
        setTimeout(c4AIMove, 600);
    }
}

function makeC4Move(row, col, player) {
    c4Board[row][col] = player;
    
    const cell = document.querySelector(`.c4-cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(player);
    
    if (checkC4Win(row, col, player)) {
        document.getElementById('c4-status').textContent = `${player === 'red' ? 'Red' : 'Yellow'} wins! 🎉`;
        c4Active = false;
        c4Scores[player]++;
        updateC4Scores();
        return;
    }
    
    if (c4Board.every(row => row.every(cell => cell !== null))) {
        document.getElementById('c4-status').textContent = "It's a draw! 🤝";
        c4Active = false;
        c4Scores.draw++;
        updateC4Scores();
        return;
    }
    
    c4Player = c4Player === 'red' ? 'yellow' : 'red';
    document.getElementById('c4-status').textContent = `${c4Player === 'red' ? 'Red' : 'Yellow'}'s turn`;
}

function checkC4Win(row, col, player) {
    // Check horizontal
    let count = 1;
    // Check left
    for (let c = col - 1; c >= 0 && c4Board[row][c] === player; c--) count++;
    // Check right
    for (let c = col + 1; c < 7 && c4Board[row][c] === player; c++) count++;
    if (count >= 4) {
        highlightC4Win(row, col, player, 'horizontal');
        return true;
    }
    
    // Check vertical
    count = 1;
    // Check down
    for (let r = row - 1; r >= 0 && c4Board[r][col] === player; r--) count++;
    // Check up
    for (let r = row + 1; r < 6 && c4Board[r][col] === player; r++) count++;
    if (count >= 4) {
        highlightC4Win(row, col, player, 'vertical');
        return true;
    }
    
    // Check diagonal (top-left to bottom-right)
    count = 1;
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && c4Board[r][c] === player; r--, c--) count++;
    for (let r = row + 1, c = col + 1; r < 6 && c < 7 && c4Board[r][c] === player; r++, c++) count++;
    if (count >= 4) {
        highlightC4Win(row, col, player, 'diagonal1');
        return true;
    }
    
    // Check diagonal (bottom-left to top-right)
    count = 1;
    for (let r = row + 1, c = col - 1; r < 6 && c >= 0 && c4Board[r][c] === player; r++, c--) count++;
    for (let r = row - 1, c = col + 1; r >= 0 && c < 7 && c4Board[r][c] === player; r--, c++) count++;
    if (count >= 4) {
        highlightC4Win(row, col, player, 'diagonal2');
        return true;
    }
    
    return false;
}

function highlightC4Win(row, col, player, direction) {
    const cells = [];
    
    if (direction === 'horizontal') {
        for (let c = 0; c < 7; c++) {
            if (c4Board[row][c] === player) {
                cells.push(document.querySelector(`.c4-cell[data-row="${row}"][data-col="${c}"]`));
            } else if (cells.length >= 4) {
                break;
            } else {
                cells.length = 0;
            }
        }
    } else if (direction === 'vertical') {
        for (let r = 0; r < 6; r++) {
            if (c4Board[r][col] === player) {
                cells.push(document.querySelector(`.c4-cell[data-row="${r}"][data-col="${col}"]`));
            } else if (cells.length >= 4) {
                break;
            } else {
                cells.length = 0;
            }
        }
    }
    
    cells.slice(0, 4).forEach(cell => cell.classList.add('winning'));
}

function c4AIMove() {
    if (!c4Active) return;
    
    // Simple AI: Try to win, block player, or random
    let move = findC4WinningMove('yellow');
    if (move === -1) move = findC4WinningMove('red');
    if (move === -1) {
        // Try center column first
        if (canDropC4(3)) move = 3;
    }
    if (move === -1) {
        // Random available column
        const available = [];
        for (let c = 0; c < 7; c++) {
            if (canDropC4(c)) available.push(c);
        }
        if (available.length > 0) {
            move = available[Math.floor(Math.random() * available.length)];
        }
    }
    
    if (move !== -1) {
        dropC4Disc(move);
    }
}

function findC4WinningMove(player) {
    for (let col = 0; col < 7; col++) {
        if (!canDropC4(col)) continue;
        
        // Simulate drop
        let row = -1;
        for (let r = 0; r < 6; r++) {
            if (c4Board[r][col] === null) {
                row = r;
                break;
            }
        }
        
        c4Board[row][col] = player;
        const wins = checkC4WinSimple(row, col, player);
        c4Board[row][col] = null;
        
        if (wins) return col;
    }
    return -1;
}

function checkC4WinSimple(row, col, player) {
    // Horizontal
    let count = 1;
    for (let c = col - 1; c >= 0 && c4Board[row][c] === player; c--) count++;
    for (let c = col + 1; c < 7 && c4Board[row][c] === player; c++) count++;
    if (count >= 4) return true;
    
    // Vertical
    count = 1;
    for (let r = row - 1; r >= 0 && c4Board[r][col] === player; r--) count++;
    for (let r = row + 1; r < 6 && c4Board[r][col] === player; r++) count++;
    if (count >= 4) return true;
    
    // Diagonal 1
    count = 1;
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && c4Board[r][c] === player; r--, c--) count++;
    for (let r = row + 1, c = col + 1; r < 6 && c < 7 && c4Board[r][c] === player; r++, c++) count++;
    if (count >= 4) return true;
    
    // Diagonal 2
    count = 1;
    for (let r = row + 1, c = col - 1; r < 6 && c >= 0 && c4Board[r][c] === player; r++, c--) count++;
    for (let r = row - 1, c = col + 1; r >= 0 && c < 7 && c4Board[r][c] === player; r--, c++) count++;
    if (count >= 4) return true;
    
    return false;
}

function canDropC4(col) {
    return c4Board[5][col] === null;
}

function toggleConnect4AI() {
    c4VsAI = !c4VsAI;
    const btn = event.target;
    btn.textContent = c4VsAI ? 'vs Player' : 'vs AI';
    resetConnect4();
}

function updateC4Scores() {
    document.getElementById('c4-scoreRed').textContent = c4Scores.red;
    document.getElementById('c4-scoreYellow').textContent = c4Scores.yellow;
    document.getElementById('c4-scoreDraw').textContent = c4Scores.draw;
}
