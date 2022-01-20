var canvas;
var video;
var song;
var poseNet;
var leftWristX = 0;
var leftWristY = 0;
var rightWristX = 0;
var rightWristY = 0;
var scoreLeftWrist = 0;
var scoreRightWrist = 0;

function setup(){
    canvas = createCanvas(600, 500)
    canvas.center();

    video = createCapture(VIDEO)
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded)
    poseNet.on('pose', poses);
}

function modelLoaded(){
    console.log('Model is loaded');
}

function poses(results) {
    if(results.length > 0) {
        console.log(results)

        scoreLeftWrist = results[0].pose.keypoints[9].score;
        scoreRightWrist = results[0].pose.keypoints[10].score;

        leftWristX = results[0].pose.leftWrist.x;
        leftWristY = results[0].pose.leftWrist.y;

        rightWristX = results[0].pose.rightWrist.x;
        rightWristY = results[0].pose.rightWrist.y;
    }
}

function preload(){ 
    song = loadSound('music.mp3');
}

function draw(){
    image(video, 0, 0, 600, 500);

    
    fill('red');
    stroke('black');
    
    if(scoreRightWrist > 0.2) {
        circle(rightWristX, rightWristY, 20)
        
        if(rightWristY > 0 && rightWristY <= 100) {
            document.getElementById('speed').textContent = "Speed = 0.5x"
            song.rate(0.5)
        }
        else if(rightWristY > 100 && rightWristY <= 200) {
            document.getElementById('speed').textContent = "Speed = 1x"
            song.rate(1)
        }
        else if(rightWristY > 200 && rightWristY <= 300) {
            document.getElementById('speed').textContent = "Speed = 1.5x"
            song.rate(1.5)
        }
        else if(rightWristY > 300 && rightWristY <= 400) {
            document.getElementById('speed').textContent = "Speed = 2x"
            song.rate(2)
        }
        else if(rightWristY > 400 && rightWristY <= 500) {
            document.getElementById('speed').textContent = "Speed = 2.5x"
            song.rate(2.5)
        }
    }

    if(scoreLeftWrist > 0.2) {
        circle(leftWristX, leftWristY, 20);
        var isNumber = Number(leftWristY);
        var removedDecimals = floor(isNumber);
        var divided = removedDecimals/500;
        var volume = divided * 2;
        document.getElementById('volume_value').textContent = volume;
        song.setVolume(volume)
    }
}

async function music(){
    await document.getElementById('playBtn').setAttribute('disabled', 'true')
    if(document.getElementById('playBtn').getAttribute('disabled')){
        document.getElementById('playBtn').style.backgroundColor = 'darkgreen'
    }
    song.play()
    song.setVolume(1);
    song.rate(1);
}