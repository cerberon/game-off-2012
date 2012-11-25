/* File Name 	: boomba_v3.js
 * Game Title	: Boomba
 * Builder		: Timotius Kevin Levandi, Martha Monica
 * Description	: -
 */

 
/**=========================================**\
|** 	MAJOR PREPARATION SECTION			**|
\**=========================================**/

var c	= document.getElementById('myCanvas');
var ctx	= c.getContext('2d');

ctx.canvas.width 	= window.innerWidth;
ctx.canvas.height 	= window.innerHeight;

var images = {};
var meteors = new Array();
var blasts = new Array();
var numPanels = new Array();
var numPanels2 = new Array();
var oprPanels = new Array();
var oprPanels2 = new Array();

loadImage("start");
loadImage("sphere_0");
loadImage("sphere_1");
loadImage("sphere_2");
loadImage("sphere_3");
loadImage("sphere_4");
loadImage("sphere_5");
loadImage("satellite");
loadImage("result_panel");
loadImage("misc_panel1");
loadImage("misc_panel2");
for (var i=0; i<4; i++){
	blasts[i] = "blast";
	meteors[i] = "meteor";
	loadImage(blasts[i]);
	loadImage(meteors[i]);
}
for (var i=0; i<8; i++){
	numPanels[i] = "number_panel";
	loadImage(numPanels[i]);
}
for (var j=0; j<4; j++){
	oprPanels[j] = "operator_panel";
	oprPanels2[j] = "operator_panel2";
	loadImage(oprPanels[j]);
	loadImage(oprPanels2[j]);
}

//==========loadImage function==========//	
function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function(){
		resourceLoaded();
	}
	images[name].src = "img/"+name+".png";
}

//==========resourceLoaded function==========//
var totalResources = 14;
var numResourcesLoaded = 0;
var fps = 30;
function resourceLoaded(){
	numResourcesLoaded +=1;
	if(numResourcesLoaded == totalResources) {
		meteorInit();
		satelliteInit();
		setInterval(redraw, 1000/fps);
	}
}

//==========redraw function==========//
var enterGame = false;
function redraw(){
	if (enterGame==false){
		welcomeScreen();
	}
	else if (enterGame==true){
		if (pause == false){
			ctx.canvas.width = ctx.canvas.width; //clear canvas. Weird way, huh!
			//all about environment
			drawStatic();
			//all about satellite
			drawSatellite();
			//all about meteor update here:
			meteorMove();
			meteorLaunch();
			meteorDestroyMgr();
			drawBlast();
		} else {
			finalize();
		}
	}
}

//==========draw static object==========//
function drawStatic(){
	//background
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	//earth
	ctx.drawImage(images["sphere_" + earthHit.toString()],-400,window.innerHeight/20);
	//score
	drawText("20pt Courier New","white",30,40,"Score : " + score.toString());
}

//==========draw Satellite==========//
var xSatOrigin = 350;
var ySatOrigin = -30;
var satRatio = 30/100;
function drawSatellite(){
	//draw satellite main body
	ctx.drawImage(images["satellite"],xSatOrigin,ySatOrigin);
	//draw number panel
	drawNumPanels();
	//draw result panel
	drawResPanel();
	//draw operator panel
	drawOprPanels();
	//draw fill panel
	drawFillPanel();
	//draw shuffle panel
	drawShufPanel();
}


/**=========================================**\
|** 	MAJOR METEOR MANAGEMENT SECTION		**|
\**=========================================**/

//==========initialize meteor==========//
function meteorInit(){
	for (var i=0; i<4; i++){
		meteorResetPos(i);
		xBlast[i] = 0;
		yBlast[i] = 0;
		blastTime[i] = 30;
		triggerTime[i] = Math.floor((Math.random()*150)+30)
	}
	rndStart = 0;
	innerLv = 1;
	destroyCounter = 0;
	earthHit = 0;
	pause = false;
	destructionTime = 150;
}

//==========reset meteor position==========//
var xPos = new Array();
var yPos = new Array();
var activity = new Array();
var meteorValue = new Array();
function meteorResetPos(index){	
	xPos[index] = window.innerWidth;
	yPos[index] = 200+index*100;
	activity[index] = false;
	meteorValue[index] = Math.floor((Math.random()*20)+11);
	ctx.drawImage(images[meteors[index]], xPos[index], yPos[index]);
}

//==========launch meteor==========//
var rndStart;
var innerLv;
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
	for (var i=0; i<4; i++){
		if (activity[i]==true){
			meteorActive++;
		}
	}
}

//==========pick meteor to take off==========//
var rndPick;
function meteorPick(){
	rndPick = Math.floor(Math.random()*4);
	while (activity[rndPick]==true){
		rndPick = Math.floor(Math.random()*4);
	}
	activity[rndPick] = true;
	velocity[rndPick] = Math.floor((Math.random()*innerLv)+1);
}

//==========moving meteor==========//
var velocity = new Array();
function meteorMove(){
	for (var i=0; i<4; i++){
		if (activity[i] == true){
			xPos[i] -= velocity[i];
		}
		ctx.drawImage(images[meteors[i]], xPos[i], yPos[i]);
		drawText("25pt Cooper Black","yellow",xPos[i]+20,yPos[i]+70,meteorValue[i].toString());
	}
}

//==========check destroyed meteor function==========//
var destroyCounter;
var xBlast = new Array();
var yBlast = new Array();
var earthHit;
var pause;
function meteorDestroyMgr(){
	for (var i=0; i<4; i++){
		if (xPos[i] < 100){
			xBlast[i] = xPos[i];
			yBlast[i] = yPos[i];
			meteorResetPos(i);
			activity[i] = false;
			earthHit++;
			if (earthHit == 5){
				pause = true;
			}
			destroyCounter++;
		}
		if ((shoot==true)&&(meteorValue[i]==result)&&(activity[i]==true)){
			drawBeam(i);
			
			xBlast[i] = xPos[i];
			yBlast[i] = yPos[i];
			meteorResetPos(i);
			activity[i] = false;
			destroyCounter++;
		}
	}
	if (shoot==true){
		shoot = false;
		result = 0;
	}
	setLevel();
}

//==========determine Level==========//
function setLevel(){
	if (destroyCounter == 5){
		innerLv = 2;
	} else if (destroyCounter == 10){
		innerLv = 3;
	} else if (destroyCounter == 20){
		innerLv = 4;
	} else if (destroyCounter == 40){
		innerLv = 5;
	}
}

//==========load blast==========//
var blastTime = new Array();
function drawBlast(){
	for (var i=0; i<4; i++){
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


/**=========================================**\
|** 	MAJOR SATELLITE MANAGEMENT SECTION	**|
\**=========================================**/

//==========initialize satellite==========//
function satelliteInit(){
	for (var i=0; i<8; i++){
		number[i] =  Math.floor((Math.random()*9)+1);
	}
	for (var i=0; i<8; i++){
		clickable[i] = true;
		clickBanned[i] = false;
	}
	activeOpr = 0;
	shoot = false;
	result = 0;
	score = 0;
}

//==========update number panel==========//
var xNumPos = new Array();
var yNumPos = new Array();
function drawNumPanels(){	
	for (var i=0; i<8; i++){
		if (Math.floor(i/4)==0){
			xNumPos[i] = xSatOrigin+(190*satRatio)+(i*10*satRatio)+(i*160*satRatio);
			yNumPos[i] = ySatOrigin+(190*satRatio);
		} else if (Math.floor(i/4)==1){
			xNumPos[i] = xSatOrigin+(190*satRatio)+((i%4)*10*satRatio)+((i%4)*160*satRatio);
			yNumPos[i] = ySatOrigin+(190*satRatio)+(160*satRatio)+(10*satRatio);
		}
		if (clickable[i]==true){
			ctx.drawImage(images[numPanels[i]],xNumPos[i],yNumPos[i]);
			drawText("bold 20pt Garamond","white",xNumPos[i]+18,yNumPos[i]+32,number[i].toString());
		}
	} 
}

//==========update result panel==========//
var xResPos;
var yResPos;
var result;
function drawResPanel(){
	xResPos = xSatOrigin+(1000*satRatio);
	yResPos = ySatOrigin+(190*satRatio);
	ctx.drawImage(images["result_panel"],xResPos,yResPos);
	drawText("bold 30pt Garamond","white",xResPos+10,yResPos+42,result.toString());
}

//==========update operator panel==========//
var xOprPos = new Array();
var yOprPos = new Array();
var oprColor = new Array();
function drawOprPanels(){
	for (var i=0; i<4; i++){
		xOprPos[i] = xSatOrigin+(1400*satRatio)+(i*10*satRatio)+(i*200*satRatio);
		yOprPos[i] = ySatOrigin+(250*satRatio);
		if (i!=activeOpr){
			ctx.drawImage(images[oprPanels[i]],xOprPos[i],yOprPos[i]);
			oprColor[i] = "white";
		}else{
			ctx.drawImage(images[oprPanels2[i]],xOprPos[i],yOprPos[i]);
			oprColor[i] = "black"
		}
		
		if (i==0){
			drawText("bold 30pt Garamond",oprColor[i],xOprPos[i]+16,yOprPos[i]+42,"+");
		} else if (i==1){
			drawText("bold 30pt Garamond",oprColor[i],xOprPos[i]+23,yOprPos[i]+40,"-");
		} else if (i==2){
			drawText("bold 30pt Garamond",oprColor[i],xOprPos[i]+20,yOprPos[i]+47,"*");
		} else if (i==3){
			drawText("bold 30pt Garamond",oprColor[i],xOprPos[i]+20,yOprPos[i]+40,"/");
		} 
	}
}

//==========set number in panel==========//
var number = new Array();
function drawText(font, color, x, y, text){
	ctx.font = font
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

//==========fill panel==========//
var xFillPos;
var yFillPos;
function drawFillPanel(){
	xFillPos = xSatOrigin;
	yFillPos = ySatOrigin+(190*satRatio);
	ctx.drawImage(images["misc_panel1"],xFillPos,yFillPos);
	drawText("10pt Garamond","black",xFillPos,yFillPos+20,"Fill Blank");
	drawText("10pt Garamond","black",xFillPos+5,yFillPos+35,"(-800)");
}

//==========shuffle panel==========//
var xShufPos;
var yShufPos;
function drawShufPanel(){
	xShufPos = xSatOrigin;
	yShufPos = ySatOrigin+(190*satRatio)+(160*satRatio)+(10*satRatio);
	ctx.drawImage(images["misc_panel2"],xShufPos,yShufPos);
	drawText("10pt Garamond","black",xShufPos+5,yShufPos+20,"Shuffle");
	drawText("10pt Garamond","black",xShufPos+5,yShufPos+35,"(-200)");
}

//==========Add mouse events==========//
var activeOpr;
var clickBanned = new Array();
var clickable = new Array();
c.onclick = function (event) {
    event = event || window.event;
	
    x = event.pageX - c.offsetLeft,
    y = event.pageY - c.offsetTop;
	
	enterGame=true;
	
	if ((x > xFillPos)&&(x < xFillPos+160*satRatio)&&
		(y > yFillPos)&&(y < yFillPos+160*satRatio)){
		refillNumber();
	}
	
	if ((x > xShufPos)&&(x < xShufPos+160*satRatio)&&
		(y > yShufPos)&&(y < yShufPos+160*satRatio)){
		shuffleNumber();
	}
	
	for (var i=0; i<8; i++){
		if ((x > xNumPos[i])&&(x < xNumPos[i]+160*satRatio)&&
			(y > yNumPos[i])&&(y < yNumPos[i]+160*satRatio)&&
			(clickable[i]==true)){
			if (activeOpr==0){	 		//add
				result += number[i];
				clickable[i]=false;
				pluminCounter++;
			} else if (activeOpr==1){ 	//substract
				result -= number[i];
				clickable[i]=false;
				pluminCounter++;
			} else if (activeOpr==2){ 	//multiply
				result *= number[i];
				clickable[i]=false;
				muldivCounter++;
			} else if (activeOpr==3) { 	//divide
				if (result%number[i] == 0){
					result /= number[i];
					clickable[i]=false;
					muldivCounter++;
				}
			}
		}	
	}
	for (var j=0; j<4; j++){
		if ((x > xOprPos[j])&&(x < xOprPos[j]+160*satRatio)&&
			(y > yOprPos[j])&&(y < yOprPos[j]+160*satRatio)){
			activeOpr = j;
		}	
	}
	if ((x > xResPos)&&(x < xResPos+250*satRatio)&&
		(y > yResPos)&&(y < yResPos+200*satRatio)){
		var matchFound = false;
		var k=0;
		while ((k<4)&&(matchFound==false)){
			if (meteorValue[k]==result){
				matchFound = true;
			}
			k++;
		}
		if (matchFound == true){
			shoot = true;
			//regenerate number used
			regenNumber();
			scoreMgr();
		} else{
			result = 0;
			//ban number used
			banNumber();
		}
		activeOpr = 0;
	}
	redraw();
}


/**=============================================================**\
|** 	MAJOR SATELLITE-METEOR CONNECTION MANAGEMENT SECTION	**|
\**=============================================================**/

//==========draw destruction beam==========//
var shoot;
function drawBeam(index){
	ctx.strokeStyle = "white";
	ctx.lineJoin = "round";
	ctx.lineWidth = 5;
	
	ctx.beginPath();
	ctx.moveTo(xSatOrigin+1122*satRatio,ySatOrigin+642*satRatio);
	ctx.lineTo(xPos[index]+20, yPos[index]+70);
	ctx.closePath();
	ctx.stroke();
}
//==========set banned number==========//
function banNumber(){
	for (var i=0; i<8; i++){
		if (clickable[i]==false){
			clickBanned[i]=true;
		}
	}
}

//==========regenerate number==========//
function regenNumber(){
	for (var i=0; i<8; i++){
		if ((clickable[i]==false)&&(clickBanned[i]==false)){
			if (number[i]<6){
				numberLowCounter++;
			} else{
				numberHighCounter++;
			}
			number[i] = Math.floor((Math.random()*9)+1);
			clickable[i]=true;
		}
	}
}

//==========refill blank number==========//
function refillNumber(){
	var canBeFilled = false;
	for (var i=0; i<8; i++){
		if (clickBanned[i]==true){
			number[i] = Math.floor((Math.random()*9)+1);
			clickBanned[i]=false;
			clickable[i]=true;
			canBeFilled = true;
		}
	}
	if (canBeFilled==true){
		score -= 800;
	}
}

//==========shuffle number==========//
function shuffleNumber(){
	for (var i=0; i<8; i++){
		if (clickable[i]==true){
			number[i] = Math.floor((Math.random()*9)+1);
		}
	}
	score -= 200;
}

//==========score manager==========//
var score;
var numberHighCounter = 0;
var numberLowCounter = 0;
var pluminCounter = 0;
var muldivCounter = 0;
function scoreMgr(){
	score = score + numberHighCounter*125 + numberLowCounter*100 + pluminCounter*25 + muldivCounter*50;
	numberHighCounter = 0;
	numberLowCounter = 0;
	pluminCounter = 0;
	muldivCounter = 0;
}

//==========finalize==========//
var destructionTime;
var triggerTime = new Array();
function finalize(){
	if (destructionTime>0){	
		for (var i=0; i<4; i++){
			if (destructionTime == triggerTime[i]){
				xBlast[i] = Math.random()*235;
				yBlast[i] = (Math.random()*610)+65;
				ctx.drawImage(images[blasts[i]], xBlast[i]-50, yBlast[i]-50);
				images[blasts[i]].visible="true";
			}
		}
		destructionTime--;
	} else {
		var r = confirm("You Lose! Retry?\nScore: "+score.toString());
		if (r==true)
			{
			 meteorInit();
			 satelliteInit();
			 pause = false;
			}
		else
			{
			 meteorInit();
			 satelliteInit();
			 pause = false;
			 enterGame = false;
			}
	}
}


/**=========================================**\
|** 	MAJOR WELCOME SCREEN SECTION		**|
\**=========================================**/

//==========welcome==========//
var blackCounter = 50;
var blankCounter = 15;
function welcomeScreen(){
	ctx.drawImage(images["start"], 0, 0,window.innerWidth,window.innerHeight);
	if (blackCounter > 0){
		drawText("15pt Copperplate Gothic Light","white",400,600,"click anywhere to start the catastrophe...");
		blackCounter--;
		if (blackCounter==0){
			blankCounter = 15;
		}
	} else {
		blankCounter--;
		if (blankCounter==0){
			blackCounter = 50;
		}
	}
}
//window size 1280x736px