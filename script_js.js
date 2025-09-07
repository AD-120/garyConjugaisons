// French Verb Conjugation Trainer
// Game state variables
let gameState = 'loading'; // loading, verbSelection, playing, results
let verbData = {};
let selectedVerbs = [];
let currentQuestion = 0;
let totalQuestions = 8;
let questions = [];
let score = 0;
let showHelp = false;
let userInput = '';
let inputActive = false;
let feedback = '';
let feedbackTimer = 0;
let scrollOffset = 0;

// Game data
const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const verbList = [
    'être', 'avoir', 'parler', 's\'appeler', 'payer', 'aller', 'ouvrir', 'finir',
    'partir', 'dormir', 'venir', 'lire', 'connaître', 'écrire', 'faire', 'dire',
    'mettre', 'prendre', 'boire', 'savoir', 'voir', 'devoir', 'pouvoir', 'vouloir'
];

// Verb conjugation data (présent de l'indicatif)
const conjugations = {
    'être': ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    'avoir': ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    'parler': ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'],
    's\'appeler': ['m\'appelle', 't\'appelles', 's\'appelle', 'nous appelons', 'vous appelez', 's\'appellent'],
    'payer': ['paie/paye', 'paies/payes', 'paie/paye', 'payons', 'payez', 'paient/payent'],
    'aller': ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    'ouvrir': ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'],
    'finir': ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'],
    'partir': ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    'dormir': ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    'venir': ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    'lire': ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    'connaître': ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    'écrire': ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    'faire': ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    'dire': ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    'mettre': ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    'prendre': ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    'boire': ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    'savoir': ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    'voir': ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    'devoir': ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    'pouvoir': ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    'vouloir': ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent']
};

// P5.js setup function
function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    initializeGame();
}

function initializeGame() {
    // Initialize with verb selection screen
    gameState = 'verbSelection';
    selectedVerbs = [];
}

function generateQuestions() {
    questions = [];
    for (let i = 0; i < totalQuestions; i++) {
        const verb = random(selectedVerbs);
        const pronounIndex = floor(random(6));
        questions.push({
            verb: verb,
            pronoun: pronouns[pronounIndex],
            pronounIndex: pronounIndex,
            correctAnswer: conjugations[verb][pronounIndex],
            userAnswer: '',
            correct: null
        });
    }
}

// Main draw function
function draw() {
    // Animated background
    background(0);
    for (let i = 0; i < 100; i++) {
        let x = (frameCount * 0.5 + i * 50) % (width + 100);
        let y = (i * 37) % height;
        fill(100 + sin(frameCount * 0.01 + i) * 50, 50, 150, 100);
        noStroke();
        circle(x, y, 20);
    }

    if (gameState === 'verbSelection') {
        drawVerbSelection();
    } else if (gameState === 'playing') {
        drawGameplay();
    } else if (gameState === 'results') {
        drawResults();
    }
}

function drawVerbSelection() {
    // Title
    fill(255);
    textSize(48);
    textStyle(BOLD);
    text('French Verb Conjugation Trainer', width/2, 100);
    
    textSize(24);
    textStyle(NORMAL);
    text('Select verbs to practice (click to toggle)', width/2, 150);
    
    // Verb grid
    let cols = 4;
    let rows = Math.ceil(verbList.length / cols);
    let startX = width/2 - (cols * 200) / 2;
    let startY = 200;
    
    for (let i = 0; i < verbList.length; i++) {
        let col = i % cols;
        let row = floor(i / cols);
        let x = startX + col * 200;
        let y = startY + row * 80;
        
        let isSelected = selectedVerbs.includes(verbList[i]);
        
        // Button background
        if (isSelected) {
            fill(100, 200, 100, 200);
        } else {
            fill(100, 100, 200, 150);
        }
        
        rect(x - 80, y - 25, 160, 50, 10);
        
        // Text
        fill(255);
        textSize(18);
        text(verbList[i], x, y);
    }
    
    // Start button
    if (selectedVerbs.length > 0) {
        fill(200, 100, 100, 200);
        rect(width/2 - 100, height - 150, 200, 60, 15);
        fill(255);
        textSize(24);
        text(`Start Game (${selectedVerbs.length} verbs)`, width/2, height - 120);
    }
    
    // Instructions
    fill(255, 200);
    textSize(16);
    text('Selected: ' + selectedVerbs.length + ' verbs', width/2, height - 60);
    text('Press H during game to toggle help', width/2, height - 40);
}

function drawGameplay() {
    let q = questions[currentQuestion];
    
    // Progress bar
    fill(100, 200, 100);
    rect(50, 50, (width - 100) * (currentQuestion / totalQuestions), 20, 10);
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(50, 50, width - 100, 20, 10);
    
    // Question info
    fill(255);
    textSize(20);
    noStroke();
    text(`Question ${currentQuestion + 1} of ${totalQuestions}`, width/2, 100);
    text(`Score: ${score}/${currentQuestion}`, width/2, 130);
    
    // Main question
    textSize(48);
    textStyle(BOLD);
    fill(255, 255, 150);
    text(`${q.pronoun} __________ (${q.verb})`, width/2, height/2 - 50);
    
    // Input field
    fill(255, 255, 255, 200);
    rect(width/2 - 200, height/2 + 20, 400, 60, 10);
    
    fill(0);
    textSize(32);
    textStyle(NORMAL);
    text(userInput + (inputActive && frameCount % 60 < 30 ? '|' : ''), width/2, height/2 + 50);
    
    // Instructions
    fill(255, 180);
    textSize(18);
    text('Type your answer and press ENTER', width/2, height/2 + 120);
    text('Press H for help • Press ESC to return to verb selection', width/2, height/2 + 145);
    
    // Feedback
    if (feedbackTimer > 0) {
        if (feedback.includes('Correct')) {
            fill(100, 255, 100);
        } else {
            fill(255, 100, 100);
        }
        textSize(24);
        textStyle(BOLD);
        text(feedback, width/2, height/2 + 180);
        feedbackTimer--;
    }
    
    // Help overlay
    if (showHelp) {
        drawHelpOverlay();
    }
}

function drawHelpOverlay() {
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    // Help panel
    fill(255, 255, 255, 240);
    let panelWidth = min(800, width - 100);
    let panelHeight = min(600, height - 100);
    rect(width/2 - panelWidth/2, height/2 - panelHeight/2, panelWidth, panelHeight, 15);
    
    fill(0);
    textSize(28);
    textStyle(BOLD);
    text('Conjugation Reference', width/2, height/2 - panelHeight/2 + 40);
    
    // Show conjugations for selected verbs (scrollable)
    textSize(16);
    textStyle(NORMAL);
    let y = height/2 - panelHeight/2 + 80;
    let lineHeight = 25;
    
    for (let i = 0; i < selectedVerbs.length; i++) {
        let verbY = y + i * (lineHeight * 7) - scrollOffset;
        
        if (verbY > height/2 - panelHeight/2 + 60 && verbY < height/2 + panelHeight/2 - 40) {
            textStyle(BOLD);
            text(selectedVerbs[i].toUpperCase(), width/2, verbY);
            textStyle(NORMAL);
            
            for (let j = 0; j < 6; j++) {
                let conjY = verbY + (j + 1) * lineHeight;
                if (conjY < height/2 + panelHeight/2 - 40) {
                    text(`${pronouns[j]} ${conjugations[selectedVerbs[i]][j]}`, width/2, conjY);
                }
            }
        }
    }
    
    // Instructions
    fill(100);
    textSize(14);
    text('Press H again to close • Scroll with mouse wheel', width/2, height/2 + panelHeight/2 - 20);
}

function drawResults() {
    fill(255);
    textSize(48);
    textStyle(BOLD);
    text('Game Complete!', width/2, 150);
    
    textSize(36);
    let percentage = Math.round((score / totalQuestions) * 100);
    fill(score === totalQuestions ? color(100, 255, 100) : 
         percentage >= 70 ? color(255, 255, 100) : color(255, 150, 150));
    text(`Score: ${score}/${totalQuestions} (${percentage}%)`, width/2, 220);
    
    // Results breakdown
    fill(255);
    textSize(20);
    textStyle(NORMAL);
    text('Review:', width/2, 300);
    
    let y = 340;
    for (let i = 0; i < questions.length; i++) {
        let q = questions[i];
        fill(q.correct ? color(100, 255, 100) : color(255, 150, 150));
        textSize(16);
        text(`${q.pronoun} ${q.userAnswer || '(no answer)'} (${q.verb})`, width/2 - 150, y);
        if (!q.correct) {
            fill(255, 255, 100);
            text(`→ ${q.correctAnswer}`, width/2 + 50, y);
        }
        y += 25;
    }
    
    // Restart button
    fill(100, 200, 100, 200);
    rect(width/2 - 100, height - 150, 200, 60, 15);
    fill(255);
    textSize(24);
    text('Play Again', width/2, height - 120);
    
    // Back to selection
    fill(100, 100, 200, 200);
    rect(width/2 - 100, height - 80, 200, 50, 15);
    fill(255);
    textSize(18);
    text('Change Verbs', width/2, height - 55);
}

// Event handlers
function mousePressed() {
    if (gameState === 'verbSelection') {
        // Check verb selection
        let cols = 4;
        let startX = width/2 - (cols * 200) / 2;
        let startY = 200;
        
        for (let i = 0; i < verbList.length; i++) {
            let col = i % cols;
            let row = floor(i / cols);
            let x = startX + col * 200;
            let y = startY + row * 80;
            
            if (mouseX > x - 80 && mouseX < x + 80 && mouseY > y - 25 && mouseY < y + 25) {
                let verb = verbList[i];
                let index = selectedVerbs.indexOf(verb);
                if (index > -1) {
                    selectedVerbs.splice(index, 1);
                } else {
                    selectedVerbs.push(verb);
                }
            }
        }
        
        // Start button
        if (selectedVerbs.length > 0 && 
            mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height - 150 && mouseY < height - 90) {
            startGame();
        }
    } else if (gameState === 'results') {
        // Play again button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height - 150 && mouseY < height - 90) {
            startGame();
        }
        // Change verbs button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height - 80 && mouseY < height - 30) {
            gameState = 'verbSelection';
        }
    }
}

function startGame() {
    generateQuestions();
    currentQuestion = 0;
    score = 0;
    userInput = '';
    inputActive = true;
    gameState = 'playing';
}

function keyPressed() {
    if (gameState === 'playing') {
        if (key === 'h' || key === 'H') {
            showHelp = !showHelp;
        } else if (keyCode === ESCAPE) {
            gameState = 'verbSelection';
            showHelp = false;
        } else if (keyCode === ENTER && userInput.trim() !== '') {
            checkAnswer();
        } else if (keyCode === BACKSPACE) {
            userInput = userInput.slice(0, -1);
        } else if (key.length === 1 && userInput.length < 30) {
            userInput += key;
        }
    }
}

function mouseWheel(event) {
    if (showHelp) {
        scrollOffset += event.delta * 10;
        scrollOffset = constrain(scrollOffset, 0, max(0, selectedVerbs.length * 175 - 400));
    }
}

function checkAnswer() {
    let q = questions[currentQuestion];
    let userAnswer = userInput.trim().toLowerCase();
    let correctAnswers = q.correctAnswer.toLowerCase().split('/');
    
    let isCorrect = correctAnswers.some(answer => answer === userAnswer);
    
    q.userAnswer = userInput.trim();
    q.correct = isCorrect;
    
    if (isCorrect) {
        score++;
        feedback = 'Correct! ✓';
    } else {
        feedback = `Incorrect. Answer: ${q.correctAnswer}`;
    }
    
    feedbackTimer = 120; // 2 seconds at 60fps
    userInput = '';
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= totalQuestions) {
            gameState = 'results';
            showHelp = false;
        }
        feedbackTimer = 0;
        feedback = '';
    }, 2000);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}