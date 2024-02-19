let song;
let fft;
let amp;
let sunSize = 80;
let sunX;
let sunY;
let playButton;
let frogImg;
let frogWidth;
let frogHeight;
let frogX = 0;
let frogY = 0;
let fishes = [];
let seaStars = [];
let numFishes = 5;
let numSeaStars = 3;

// Define some properties for our additional waves
let waves = [
    { wavelength: 200, amplitude: 30, speed: 0.01, phase: 0, color: [70, 130, 180, 150] },  // SteelBlue with some transparency
    { wavelength: 150, amplitude: 20, speed: 0.05, phase: 0, color: [100, 149, 237, 150] }, // CornflowerBlue with some transparency
    { wavelength: 300, amplitude: 40, speed: 0.015, phase: 0, color: [0, 191, 255, 150] }     // DeepSkyBlue with some transparency
];


function preload() {
    song = loadSound('assets/substitution.mp3');
    frogImg = loadImage('figures/frogImg.png'); // replace with the path to your frog image
}



function setup() {
    createCanvas(windowWidth, windowHeight);

    fft = new p5.FFT();
    fft.smooth(0.9);
    amp = new p5.Amplitude();
    frogWidth = 60;
    frogHeight = 60;
    sunX = width * 0.8;
    sunY = height * 0.15;
    for (let i = 0; i < numFishes; i++) {
        fishes.push({ x: random(width), y: random(height/2, height), size: random(10, 30), color: color(random(255), random(255), random(255)) });
    }

    for (let i = 0; i < numSeaStars; i++) {
        seaStars.push({ x: random(width), y: random(height/2, height), size: random(10, 20), color: color(random(255), random(255), random(255)) });
    }

    playButton = createButton('Play Song');
    playButton.style('padding', '10px 20px'); // Add some padding
    playButton.style('font-size', '16px'); // Increase font size
    playButton.style('cursor', 'pointer'); // Change cursor on hover
    playButton.style('border-radius', '5px'); // Rounded corners
    playButton.style('border', '2px solid rgba(0,0,0,0.2)'); // Add border
    playButton.style('background-color', '#FFFFFF'); // Set background color
    playButton.style('color', '#000000'); // Set text color
    playButton.style('transition', 'all 0.3s'); // Smooth transition for hover effect

    // Change button style on hover
    playButton.mouseOver(function() {
        playButton.style('background-color', '#F0F0F0'); // Lighter background on hover
        playButton.style('border-color', 'rgba(0,0,0,0.5)'); // Darker border on hover
    });

    playButton.mouseOut(function() {
        playButton.style('background-color', '#FFFFFF'); // Back to normal background
        playButton.style('border-color', 'rgba(0,0,0,0.2)'); // Back to normal border
    });

    playButton.position(8,10);
    playButton.mousePressed(togglePlay);
}


function togglePlay() {
    if (song.isPlaying()) {
        song.pause();
        playButton.html('Play Song');
    } else {
        song.loop();
        playButton.html('Pause Song');
    }
}



function draw() {
    drawSunsetGradient();
 
noStroke();
    fill(135, 206, 235, 150);
    //draw sun
    drawSun();
    // Draw the mountains
    drawMountains();
       drawBirds(width * 0.1, height * 0.1);
drawBirds(width * 0.15, height * 0.05);
drawBirds(width * 0.20, height * 0.07);



if (!song.isPlaying()) return;

    let level = amp.getLevel();

    fill(135, 206, 235, 150);
    // Draw additional waves
    for (let wave of waves) {
        wave.phase += wave.speed; // update phase for animation
        console.log("hi");
        drawWave(wave);
    }
 
    beginShape();

    // ... rest of your waveform drawing ...
     let spectrum = fft.analyze();
    curveVertex(0, height); 

    for (let i = 0; i < width; i++) {
        let index = floor(map(i, 0, width, 0, spectrum.length));
        let y = map(spectrum[index], 0, 255, height/2, height/4); 
        y = y - level * 200;

        curveVertex(i, y);

        // Determine the frog's y-coordinate when the x-coordinate matches
        if (i == frogX) {
            frogY = y - frogImg.height/4; // Adjusting by half of the image's height to make it sit on the waveform
        }
    }

    curveVertex(width, height); 
    endShape(CLOSE);


    for (let y = height/4; y < height; y++) {
        let inter = map(y, height/4, height, 0, 1);
        let c = lerpColor(color(135, 206, 235, 150), color(25, 25, 112), inter); 
        stroke(c);
        line(0, y, width, y);
    }

moveUnderSeaEntities();

for (let fish of fishes) {
    drawFish(fish);
}

for (let seaStar of seaStars) {
    drawSeaStar(seaStar);
}
    // Display the frog image
    image(frogImg, frogX, frogY,frogWidth,frogHeight);

    // Move the frog
    frogX += 2;
    if (frogX > width) {
        frogX = 0;
    }
}

// Function to draw an individual wave
function drawWave(wave) {
    fill(wave.color);
    beginShape();
    for (let x = 0; x < width; x += 5) {
        let y = sin((x / wave.wavelength + wave.phase) * TWO_PI) * wave.amplitude;
        curveVertex(x, y + height / 2);
    }
    curveVertex(width, height);
    curveVertex(0, height);
    endShape(CLOSE);
}
function drawSun() {
    fill(255, 204, 0); // Yellow color for the sun
    noStroke();
    ellipse(sunX, sunY, sunSize);
}

// Function to draw the mountains

// Function to draw the mountains with gradient brown
function drawMountains() {
    let startColor = color(139, 69, 19); // DarkBrown
    let endColor = color(210, 105, 30);  // Chocolate

    beginShape();
    let noiseOffset = 0; // Using Perlin noise for a natural mountain appearance
    for (let x = 0; x < width; x += 5) {
        let y = map(noise(noiseOffset), 0, 1, height * 0.05, height * 0.3); // Adjusted to make mountains appear higher
        
        let inter = map(y, height * 0.05, height * 0.3, 0, 1);
        let mountainColor = lerpColor(startColor, endColor, inter);
        
        fill(mountainColor);
        noStroke();
        
        vertex(x, y);
        noiseOffset += 0.05; // Adjusting this value will change the 'jaggedness' of the mountains
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
}
function drawSunsetGradient() {
    let topColor = color(252, 141, 89); // Sunset orange
    let bottomColor = color(255, 237, 160); // Light yellow

    for (let y = 0; y < height/4; y++) {
        let inter = map(y, 0, height/5, 0, 1);
        let c = lerpColor(topColor, bottomColor, inter);
        stroke(c);
        line(0, y, width, y);
    }
}
function drawBirds(x, y) {
    push(); // Save current drawing state

    stroke(0); // black color for birds
    strokeWeight(3);

    line(x, y, x + 10, y + 5);
    line(x, y, x - 10, y + 5);

    pop(); // Restore previous drawing state
}

function drawFish(fish) {
    fill(fish.color);
    ellipse(fish.x, fish.y, fish.size, fish.size / 2);
    triangle(fish.x - fish.size/2, fish.y, fish.x - 3*fish.size/2, fish.y - fish.size/4, fish.x - 3*fish.size/2, fish.y + fish.size/4);
}

function drawSeaStar(seaStar) {
    fill(seaStar.color);
    beginShape();
    for (let i = 0; i < 5; i++) {
        let angle = TWO_PI / 5 * i;
        let x = seaStar.x + cos(angle) * seaStar.size;
        let y = seaStar.y + sin(angle) * seaStar.size;
        vertex(x, y);
    }
    endShape(CLOSE);
}

function moveUnderSeaEntities() {
    for (let fish of fishes) {
        fish.x += random(-2, 2);  // Randomly move horizontally
        fish.y += sin(frameCount * 0.05) * 2;  // Sinusoidal vertical movement
    }
    
    for (let seaStar of seaStars) {
        seaStar.y += sin(frameCount * 0.05) * 1;  // Sinusoidal vertical movement
    }
}
