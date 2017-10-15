var fft, // Allow us to analyze the song
	numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
	song; // The p5 sound object

bands = [64,125,250,500,1000,2000,4000,8000,20000]


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
	stroke(200)
	strokeWeight(1)
	fill(0,128,128,100)

	if(typeof song != "undefined" && started){//&& song.isPlaying()) {
		var spectrum = fft.analyze()
		for(let i=0; i<8; i++){
			let h = fft.getEnergy(bands[i],bands[i+1])
			rect(i*width/8,height,width/8,-2*h)
		}
		

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