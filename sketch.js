//=========================IGNORE======================+
var fft,            // Allow us to analyze the song    |
    numBars = 1024, // Power of 2 from 16 to 1024      |
    song;           // The p5 sound object             |
//=========================IGNORE======================+

//Custom frequency bands. 9 boundaries -> 8 channels
//(Would be able to have overlapping channels in the circuit)
let bands = [64,125,250,500,1000,2000,4000,8000,20000]


//=======================Load the song================================+
var loader = document.querySelector(".loader");                     //|
document.getElementById("audiofile").onchange = function(event) {   //|
    if(event.target.files[0]) {                                     //|
        // Catch already playing songs                              //|
        if(typeof song != "undefined") {                            //|
            song.disconnect()                                       //|
            song.stop()                                             //|
        }                                                           //|
        // Load our new song                                        //|
        song = loadSound(URL.createObjectURL(event.target.files[0]))//|
        loader.classList.add("loading")                             //|
    }                                                               //|
}                                                                   //|
//====================================================================+


var canvas
var started = false
function setup() { // Setup p5.js
    canvas = createCanvas(600,600)
}

//Runs every animation frame (60 fps)
function draw() {
    //Deal with playing song & do fft
    if(typeof song != "undefined" && song.isLoaded() && !started) { 
        started = true
        loader.classList.remove("loading")
        song.play()
        song.setVolume(0.5)
        fft = new p5.FFT()
        fft.waveform(numBars)
    }
    
    //Drawing settings
    background(51)
    stroke(200)
    strokeWeight(1)
    fill(0,128,128,100)

    //If the song is playing
    if(typeof song != "undefined" && started){
        //Get the fft data
        var spectrum = fft.analyze()
        //For each virtaul band
        for(let i=0; i<8; i++){
            //Get the value for that band
            let h = fft.getEnergy(bands[i],bands[i+1])
            //Draw a thing based on that value
            rect(i*width/8,height,width/8,-2*h)
        }
    }
}
