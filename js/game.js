
//Key Controls//
var leftLifted=true;
var rightLifted=true;
var spaceLifted=true;
var rLifted=true;
var sLifted=true;
var cLifted=true;
var downLifted = true;

var leftPressed, rightPressed, spacePressed, rPressed, sPressed, cPressed, downPressed, gameStarted, gameEnded, cMode;

//Game State//
var playerRotation = 0;
var drops = {top:[], left:[], bot:[], right:[]};

var lastUpdate = 0;
var dropTimer = 0;
var gameTimer = 0;
var lives = 4;
var curscore = 10;
var highscore = 10;
var infMode = false;
var infHigh = 10;
var lastScores = 10;

var dropsClone = document.getElementById("drops").innerHTML;
var boardClone = document.getElementById("board").innerHTML;

//Game scailing
function scale(){
	if(window.innerHeight < 880){
		var s = (window.innerHeight/880)*100;
		document.querySelector("html").style.zoom = s+"%";
	}else{
		document.querySelector("html").style.zoom = "100%";
	}
}

// simple WASD listeners
document.addEventListener("keydown", function(e){
	switch(e.keyCode){
		case 32:
			spacePressed=true;
			spaceLifted=false;
			break;
		case 37:
			leftPressed=true;
			leftLifted=false;
			break;
		case 39:
			rightPressed=true;
			rightLifted=false;
			break;
		case 40:
			downPressed=true;
			downLifted=false;
			break;
		case 82:
			rPressed=true;
			rLifted=false;
			break;
		case 83:
			sPressed=true;
			sLifted=false;
			break;
		case 67:
			cPressed=true;
			cLifted=false;
			break;
	}
}, false);

document.addEventListener("keyup", function(e){
	switch(e.keyCode){
		case 32:
			spacePressed=false;
			spaceLifted=true;
			break;
		case 37:
			leftLifted = true;
			leftPressed = false;
			break;
		case 39:
			rightPressed = false;
			rightLifted = true;
			break;
		case 82:
			rPressed=false;
			rLifted=true;
			break;
		case 40:
			downPressed=false;
			downLifted=true;
			break;
		case 83:
			sPressed=false;
			sLifted=true;
			break;
		case 67:
			cPressed=false;
			cLifted=true;
			break;
	}
}, false);


//Game Loop
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000/60);
	};
})();

function updateBoard(){
	// updating speed according to key pressed
	if(leftPressed){
		playerRotation -= 1;
		leftPressed = false;
	}else if (rightPressed){
		playerRotation += 1
		rightPressed = false;
	}else if(downPressed && cMode){
		playerRotation += 2;
		downPressed = false;
	}

	var deg = playerRotation*90;

   	getElemAndRotate('board',deg);

    deg *= -1;
    getElemAndRotate('base-circle',deg);
    getElemAndRotate('pod0',deg);
    getElemAndRotate('pod1',deg);
    getElemAndRotate('pod2',deg);
    getElemAndRotate('pod3',deg);

}

function getElemAndRotate(id, deg){
	var div = document.getElementById(id);
    div.style.webkitTransform = 'rotate('+deg+'deg)'; 
    div.style.mozTransform    = 'rotate('+deg+'deg)'; 
    div.style.msTransform     = 'rotate('+deg+'deg)'; 
    div.style.oTransform      = 'rotate('+deg+'deg)'; 
    div.style.transform       = 'rotate('+deg+'deg)'; 

}

function updateNumbers(){

	var deleted = false;

	if((spacePressed || (downPressed && !cMode)) && !gameEnded){
		if(addNumber(drops.top[0].val)){
			dropTimer = 0;
			drops.top[0].pos.y = 400;
			drops.top[0].opacity = "0";
			if(spacePressed) spacePressed = false;
			if(downPressed) downPressed = false;

			for(var i=0; i<drops.top.length; ++i){	
				drops.top[i].pos.y +=55;
	    	}

	    	deleted = true;
    	}

	}

	//Actually draw the stuff
	for(var i=0; i<drops.top.length; ++i){	
		var drop = drops.top[i];
		var div = document.getElementById(drop.id);
		var text = document.getElementById(drop.valID);
		if(gameEnded){
			div.style.top = 550+'px'; 
			div.style.opacity = 0;
		}else{
	    	div.style.top = drop.pos.y+'px'; 
	    	div.style.opacity = drop.opacity;
		}
	    text.innerHTML = drops.top[i].val;
    }

    if(deleted){
    	var last = drops.top[drops.top.length -1];
    	var newCount = last.count + 1;

    	drops.top.push(makeDrop(newCount, 6, 0));  

		// dropsDiv.removeChild(document.getElementById(drops.top[0].id));
    	drops.top.splice(0,1);
    }

}

function startGame(){
	// drops.top.push({id:"drop1", pos:{x:50, y:25}, opacity:"1"});
	for(var i=0; i<7; ++i){
		drops.top.push(makeDrop(i,i,0));
	}

	highscore = localStorage.getItem("highscore");
	infhigh = localStorage.getItem("infhigh");
	lastScores = localStorage.getItem("lastScores");

	if(highscore === null){
		highscore = 10;
		localStorage.setItem("highscore", highscore);
	}
	document.getElementById("highscore").innerHTML = "Timed Best: " + highscore;

	if(infhigh === null){
		infhigh = 10;
		localStorage.setItem("infhigh", infhigh);
	}
	document.getElementById("infhigh").innerHTML = "Infinite Best: " + infhigh;

	if(lastScores === null){
		lastScores = 10;
		localStorage.setItem("lastScores",lastScores);
	}
	document.getElementById("lastScores").innerHTML = "Last Score: " + lastScores;

}

function makeDrop(count, pos, val){
	var d = document.createElement('div');
	document.getElementById("drops").appendChild(d);
	d.style.top = '-30px'; 
	d.style.opacity = '0';
	d.id = "drop"+count;
	d.classList.add("drop");

	val = randomDrop();
	var text = document.createElement('div');
	d.appendChild(text);
	var valID = text.id = "val"+count;
	text.classList.add("val");
	text.innerHTML = val;
	return {id:"drop"+count, pos:{x:50, y:340 - 55*pos}, opacity:"1", count: count, valID:valID, val: val};

}    

function randomDrop(){
	var r = getRandomInt(0,100);


	if(r <= 25){
		return 1;
	}else if(r <= 50){
		return 2;
	}else if(r <= 68){
		return 3;
	}else if(r <= 86){
		return 4;
	}else{
		return 5;
	}

}

function addNumber(num){
	var curRot = (playerRotation%4 + 4)%4;

	var text = document.getElementById("valpod"+curRot);
	if(text.innerHTML != "#"){
		var newnum = parseInt(text.innerHTML) + num;
		text.innerHTML = newnum;

		if(newnum == 10){
			//Drop and rinse
			var score = document.getElementById("score");
			text.innerHTML = "0";
			score.innerHTML = parseInt(score.innerHTML) + 10;
			document.getElementById('pingSound').play();

			curscore += 10;
			if(infMode && curscore > infhigh){
				infhigh = curscore;
				document.getElementById("infhigh").innerHTML = "Infinite Best: " + infhigh;
				localStorage.setItem("infhigh", infhigh);
			
			}else if(!infMode &&curscore > highscore){
				highscore = curscore;
				document.getElementById("highscore").innerHTML = "Timed Best: " + highscore;
				localStorage.setItem("highscore", highscore);
			
			}

		}else if(newnum > 10){
			//Lose
			text.innerHTML = "#";
			lives -= 1;
			document.getElementById('badSound').play();
		}

		if(lives == 0){
			// if(highscore > curscore){
			// 	localStorage.setItem("highscore", highscore);
			// }
			gameEnded = true;
		}

		return true;
	}else{
		return false;

	}
}

function updateClock(){
	var text = document.getElementById("timer");

	if(infMode){
		text.innerHTML = "Time: Inf.";
	}else{
		var time = 60 - Math.round(gameTimer/1000);
		text.innerHTML = "Time: " + time;
	}
}

function updateGame() {
	var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    scale();

    if(cPressed){
    	cPressed = false;
    	cMode = !cMode;
    }

	if(rPressed || ((spacePressed || (downPressed && !cMode)) && !gameStarted) || ((spacePressed || (downPressed && !cMode)) && gameEnded)){
		if(gameStarted){
			// location.reload();
			rPressed = false;
			spacePressed = false;
			downPressed = false;
			resetGame();
		}else{
			gameStarted = true;
			rPressed = false;
			spacePressed = false;
			downPressed = false;
		}
	}

	if(sPressed){
		if(gameStarted){
			resetGame();
		}

		infMode = !infMode;

		sPressed = false;
	}

	if(gameStarted && !gameEnded){
		dropTimer += dt;
		gameTimer += dt;

		if(gameTimer >= 60000 && !infMode){
			gameEnded = true;
		}

		updateNumbers();

	}

	updateBoard();
	updateClock();

	// update the game in about 1/60 seconds
	requestAnimFrame(function() {
		updateGame();
	});
}

function resetGame(){
	document.getElementById("drops").innerHTML = dropsClone;
	document.getElementById("board").innerHTML = boardClone;
	setLastScores();
	gameStarted=false;
	gameEnded=false;

	playerRotation += 4;
	drops = {top:[], left:[], bot:[], right:[]};

	dropTimer = 0;
	gameTimer = 0;
	lives = 4;
	curscore = 10;
	startGame();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setLastScores(){
	lastScores = curscore;
	document.getElementById("lastScores").innerHTML = "Last Score: " + lastScores;
	localStorage.setItem("lastScores",lastScores);
}

//Run the Game
startGame();
updateGame();



