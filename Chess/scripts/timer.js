const whiteTimerElem = document.getElementById("WhiteTimer");
const blackTimerElem = document.getElementById("BlackTimer");
const gameOverElem = document.getElementById("GameOver");
const gameOverMsg = document.getElementById("GameOverMessage");
const timeDelay = 1000;
var whiteTimerObj;
var blackTimerObj;
var timeManager;

var whiteTime = 180;
var blackTime = 180;

var countWhite = false;
var countBlack = false;





function setTimer(team){
	if(team =="white"){

		whiteTimerObj = setInterval(function(){
			countTime("white",countWhite);
		},timeDelay);
		whiteTimerElem.style.animationPlayState = 'paused';
		whiteTimerElem.style.boxShadow = '';


	}else{
		blackTimerObj = setInterval(function(){
			countTime("black",countBlack);
		},timeDelay);
		blackTimerElem.style.animationPlayState = 'paused';
		blackTimerElem.style.boxShadow = '';

	}
}




function countTime(team,countTime){

	if(team == "white"){
		if(countTime){
			whiteTime--;
			whiteTimerElem.firstChild.innerHTML=fromSecsToTxt(whiteTime);
			whiteTimerElem.style.animationPlayState = 'running';
		}else{
			whiteTimerElem.style.animationPlayState = 'paused';
			whiteTimerElem.style.boxShadow = '';

		}
	}else{
		if(countTime){
			blackTime--;
			blackTimerElem.firstChild.innerHTML=fromSecsToTxt(blackTime);
			blackTimerElem.style.animationPlayState = 'running';
		}else{
			blackTimerElem.style.animationPlayState = 'paused';
			blackTimerElem.style.boxShadow = '';

		}
	}

}


function fromSecsToTxt(secs){
	let mins = Math.floor(secs/60);
	let m;
	let sdif = (secs-(mins*60));
	let s;

	if(mins <10){
		m = "0"+mins;
	}else{
		m=mins;
	}
	if(sdif<10){
		s = "0"+sdif;
	}else{
		s=sdif;
	}


	return m+":"+s;
}


function gameOver(message){
		gameOverMsg.innerHTML=message;
		clearInterval(whiteTimerObj);
		clearInterval(blackTimerObj);
		gameOverElem.style.top="0";
		whiteTimerElem.style.animationPlayState = 'paused';
		whiteTimerElem.style.boxShadow = '';
		blackTimerElem.style.animationPlayState = 'paused';
		blackTimerElem.style.boxShadow = '';
}


setTimer("white");
setTimer("black");

//game over byTimer;
timeManager = setInterval(function(){

	if(whiteTime*blackTime == 0){
		countWhite = false;
		countBlack = false;
		clearInterval(timeManager);
		let teamWinner = (whiteTime==0)?"negras":"blancas";
		let teamLoser = (whiteTime!=0)?"negras":"blancas";
		gameOver("Ganan las " + teamWinner +" : las "+teamLoser+" se quedaron sin tiempo");
	}

},500);





