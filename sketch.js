//=========================IGNORE======================+
var fft,            // Allow us to analyze the song    |
    numBars = 1024, // Power of 2 from 16 to 1024      |
    song;           // The p5 sound object             |
//=========================IGNORE======================+

//Custom frequency bands. 9 boundaries -> 8 channels
//(Would be able to have overlapping channels in the circuit)
let bands = [64,125,250,500,1000,2000,4000,8000,20000]

//=======================Load the song================================+
document.getElementById("audiofile").onchange = function(event) {   //|
    if(event.target.files[0]) {                                     //|
        // Catch already playing songs                              //|
        if(typeof song != "undefined") {                            //|
            song.disconnect()                                       //|
            song.stop()                                             //|
        }                                                           //|
        // Load our new song                                        //|
        song = loadSound(URL.createObjectURL(event.target.files[0]))//|
    }                                                               //|
}                                                                   //|
//====================================================================+


var canvas
var started = false
function setup() { // Setup p5.js
    canvas = createCanvas(600,200)
    colorMode(RGB,1,1,1,1)
}

//Runs every animation frame (60 fps)
function draw() {
    //Deal with playing song & do fft
    if(typeof song != "undefined" && song.isLoaded() && !started) { 
        started = true
        song.play()
        song.setVolume(1)
        fft = new p5.FFT()
        fft.waveform(numBars)
    }
    
    //Drawing settings
    background(0)
    stroke(51)
    strokeWeight(1)
    fill(0,128,128,100)

    //If the song is playing
    if(typeof song != "undefined" && started){
        //Get the fft data
        var spectrum = fft.analyze()
        //For each virtaul band
        for(let i=0; i<8; i++){
            //Get the value for that band
            let h = fft.getEnergy(bands[i],bands[i+1])/255
            //Draw a thing based on that value
            //       (r,g,b,a,x,y)
            drawLight(i/8, 0, 1-(i/8), h, (i+.5)*width/8, height-50)
        }
    }
}


function drawLight(r,g,b,trans,x,y){
    let size = 80*sqrt(r+g+b)
    strokeWeight(3)
    noFill()
    for(i=0; i < size; i+=1){
        stroke(r,g,b,Math.pow(trans*i/size,2))
        ellipse(x,y,(size-i)*2)
    }
}