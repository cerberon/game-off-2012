var c	= document.getElementById('myCanvas');
var ctx	= c.getContext('2d');
ctx.canvas.width 	= window.innerWidth;
ctx.canvas.height 	= window.innerHeight;

//==========draw static object==========//
var xSatOrigin = 350;
var ySatOrigin = -30;
var satRatio = 30/100;
function drawStatic(){
	//background
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	//earth
	ctx.drawImage(images["sphere"],-400,50);
}
//==========draw Satellite==========//
function drawSatellite(){
	//draw satellite main body
	ctx.drawImage(images["satellite"],xSatOrigin,ySatOrigin);
	//draw number panel
	drawNumPanels();
	//draw result panel
	drawResPanel();
	//draw operator panel
	drawOprPanels();
}

//==========loadImage function==========//	
var images = {};
var numPanels = new Array();
var numPanels2 = new Array();
var oprPanels = new Array();
var oprPanels2 = new Array();
loadImage("sphere");
loadImage("satellite");
loadImage("result_panel");
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
//==========
function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function(){
		resourceLoaded();
	}
	images[name].src = "../img/"+name+".png";
}

//==========resourceLoaded function==========//
var totalResources = 8;
var numResourcesLoaded = 0;
var fps = 30;
function resourceLoaded(){
	numResourcesLoaded +=1;
	if(numResourcesLoaded == totalResources) {
		setInterval(redraw, 1000/fps);
	}
}

//==========redraw function==========//
function redraw(){
	ctx.canvas.width = ctx.canvas.width;
	drawStatic();
	drawSatellite();
	}
}

//==========initialize number panel==========//
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
//==========initialize result panel==========//
var xResPos;
var yResPos;
var result = 0;
function drawResPanel(){
	xResPos = xSatOrigin+(1000*satRatio);
	yResPos = ySatOrigin+(190*satRatio);
	ctx.drawImage(images["result_panel"],xResPos,yResPos);
	drawText("bold 30pt Garamond","white",xResPos+10,yResPos+42,result.toString());
}
//==========initialie operator panel==========//
var xOprPos = new Array();
var yOprPos = new Array();
var oprColor = new Array();
function drawOprPanels(){
	for (var i=0; i<4; i++){
		xOprPos[i] = xSatOrigin+(1400*satRatio)+(i*10*satRatio)+(i*200*satRatio);
		yOprPos[i] = ySatOrigin+(250*satRatio);
		if (i!=activeOpr){
			ctx.drawImage(images[oprPanels2[i]],xOprPos[i],yOprPos[i]);
			ctx.drawImage(images[oprPanels[i]],xOprPos[i],yOprPos[i]);
			oprColor[i] = "white";
		}else{
			ctx.drawImage(images[oprPanels[i]],xOprPos[i],yOprPos[i]);
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
for (var i=0; i<8; i++){
	number[i] =  Math.floor((Math.random()*9)+1);
}
function drawText(font, color, x, y, text){
	ctx.font = font
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

//==========Add mouse events==========//
var activeOpr = 0;
var clickable = new Array();
for (var i=0; i<8; i++){
	clickable[i] = true;
}
c.onclick = function (event) {
    event = event || window.event;
	
    x = event.pageX - c.offsetLeft,
    y = event.pageY - c.offsetTop;
	
	for (var i=0; i<8; i++){
		if ((x > xNumPos[i])&&(x < xNumPos[i]+160*satRatio)&&
			(y > yNumPos[i])&&(y < yNumPos[i]+160*satRatio)&&
			(clickable[i]==true)){
			calculate(number[i]);
			clickable[i]=false;
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
		result = 0;
	}
	redraw();
}
//==========calculating==========//
function calculate(numb){
	if (activeOpr==0){	 		//add
		result += numb;
	} else if (activeOpr==1){ 	//substract
		result -= numb;
	} else if (activeOpr==2){ 	//multiply
		result *= numb;
	} else if (activeOpr==3) { 	//divide
		if (result%numb == 0){
			result /= numb;
		}
	}
}

