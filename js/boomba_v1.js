var c	= document.getElementById('myCanvas');
var ctx	= c.getContext('2d');
ctx.canvas.width 	= window.innerWidth;
ctx.canvas.height 	= window.innerHeight;

//==========draw static object==========//
function drawStatic(){
	//background
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	//earth
	ctx.drawImage(images["sphere"],-400,50);
}

//==========loadImage function==========//	
var images = {};
var meteors = new Array();
var blasts = new Array();
for (var i=0; i<5; i++){
	blasts[i] = "blast";
	loadImage(blasts[i]);
	meteors[i] = "meteor";
	loadImage(meteors[i]);
}
loadImage("sphere");

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function(){
		resourceLoaded();
	}
	images[name].src = "img/"+name+".png";
}

//==========resourceLoaded function==========//
var totalResources = 3;
var numResourcesLoaded = 0;
var fps = 30;
function resourceLoaded(){
	numResourcesLoaded +=1;
	if(numResourcesLoaded == totalResources) {
		initialize();
		setInterval(redraw, 1000/fps);
	}
}

//==========redraw function==========//
function redraw(){
	ctx.canvas.width = ctx.canvas.width;
	drawStatic();
	//all about meteor update here:
	meteorMove();
	meteorLaunch();
	meteorDestroyMgr();
	drawBlast();
}

//==========initialize==========//
function initialize(){
	for (var i=0; i<5; i++){
		meteorResetPos(i);
		xBlast[i] = 0;
		yBlast[i] = 0;
	}
}

//==========reset meteor position==========//
var xPos = new Array();
var yPos = new Array();
var activity = new Array();
function meteorResetPos(index){	
	xPos[index] = window.innerWidth;
	yPos[index] = 100+index*120;
	activity[index] = false;
	ctx.drawImage(images[meteors[index]], xPos[index], yPos[index]);
}

//==========launch meteor==========//
var rndStart = 0;
var innerLv = 1;
function meteorLaunch(){
	getMeteorActive();
	if (meteorActive < innerLv){
		if (rndStart == 0){
			meteorPick();
			rndStart = Math.floor(Math.random()*(window.innerWidth/2));
			rndStart += window.innerWidth/2;
		} else {//rndStart != 0
			if ((xPos[rndPick] < rndStart) || (activity[rndPick]==false))
			rndStart = 0;
		}
	}
}
//==========get active meteor amount==========//
var meteorActive;
function getMeteorActive(){
	meteorActive = 0;
	for (var i=0; i<5; i++){
		if (activity[i]==true){
			meteorActive++;
		}
	}
}

//==========pick meteor to take off==========//
var rndPick;
function meteorPick(){
	rndPick = Math.floor(Math.random()*5);
	while (activity[rndPick]==true){
		rndPick = Math.floor(Math.random()*5);
	}
	activity[rndPick] = true;
	velocity[rndPick] = Math.floor((Math.random()*innerLv)+3);
}

//==========moving meteor==========//
var velocity = new Array();
function meteorMove(){
	for (var i=0; i<5; i++){
		if (activity[i] == true){
			xPos[i] -= velocity[i];
		}
		ctx.drawImage(images[meteors[i]], xPos[i], yPos[i]);
	}
}

//==========check destroyed meteor function==========//
var destroyCounter = 0;
var xBlast = new Array();
var yBlast = new Array();
for (var i=0; i<5; i++){
	xBlast[i] = 0;
	yBlast[i] = 0;
}
function meteorDestroyMgr(){
	for (var i=0; i<5; i++){
		if (xPos[i] < 100){
			xBlast[i] = xPos[i];
			yBlast[i] = yPos[i];
			meteorResetPos(i);
			activity[i] = false;
			destroyCounter++;
		}
	}
	setLevel();
}

//==========determine Level==========//
function setLevel(){
	if (destroyCounter == 2){
		innerLv = 2;
	} else if (destroyCounter == 10){
		innerLv = 3;
	} else if (destroyCounter == 25){
		innerLv = 4;
	} else if (destroyCounter == 50){
		innerLv = 5;
	}
}

//==========load blast==========//
var blastTime = new Array();
for (var i=0; i<5; i++){
	blastTime[i] = 30;
}
function drawBlast(){
	for (var i=0; i<5; i++){
		if (blastTime[i]<0){
			images[blasts[i]].visible="false";
			xBlast[i] = 0;
			yBlast[i] = 0;
			blastTime[i] = 30;
		}
		if ((xBlast[i] != 0) && (yBlast[i] != 0)){
			ctx.drawImage(images[blasts[i]], xBlast[i]-50, yBlast[i]-50);
			images[blasts[i]].visible="true";
			blastTime[i]--;
		}
	}
}