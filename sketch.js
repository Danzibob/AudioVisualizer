var fft, // Allow us to analyze the song
	numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
	song; // The p5 sound object

// Load our song
var loader = document.querySelector(".loader");
document.getElementById("audiofile").onchange = function(event) {
	if(event.target.files[0]) {
		if(typeof song != "undefined") { // Catch already playing songs
			song.disconnect()
			song.stop()
		}
		
		// Load our new song
		song = loadSound(URL.createObjectURL(event.target.files[0]))
		loader.classList.add("loading")
	}
}

var canvas;
var started = false
function setup() { // Setup p5.js
	canvas = createCanvas(600,600)
}

function draw() {
	if(typeof song != "undefined" && song.isLoaded() && !started) { 
		started = true
		loader.classList.remove("loading")
		song.play()
		song.setVolume(0.5)
		fft = new p5.FFT()
		fft.waveform(numBars)
		fft.smooth(0.85)
	}
	
	background(51)

	if(typeof song != "undefined" && started){//&& song.isPlaying()) {
		var spectrum = fft.analyze()

		stroke(200)
		strokeWeight(1)
		fill(0,128,128,100)

		beginShape()
		vertex(0,height)
		var angle = TWO_PI/numBars;

		for(var i = 0; i < numBars; i++) {
			vertex(width/numBars*i,height-spectrum[i]*2)
			angle += TWO_PI/numBars
		}
		vertex(width,height)
		endShape(CLOSE)
	}
}

function mousePressed(){
	if(started){
		if(song.isPlaying()){
			song.pause()
		} else {
			song.play()
		}
	}
}