//Author: Zoli Kahan http://schoolapedia.org
window.onload=function(){
	drawBoard();
}
function drawMap(map){
	//console.log(map);
	for (x=0;x<19;x++){
		for (y=0;y<19;y++){
			try{
				document.body.removeChild(document.getElementById(x+"-"+y));
			}
			catch(e){}
			if(map[x][y]=="a"){
				drawBlack(x,y);
			}
			else if(map[x][y]=="b"){
				drawWhite(x,y);
			}
		}
	}
}
function drawBlack(x1,y1){
	var x=xStart+x1*25-2;
	var y=yStart+y1*25-2;
	var n=document.createElement("div");
	n.setAttribute("id",x1+"-"+y1);
	n.setAttribute("style", "-moz-border-radius: 40px;-webkit-border-radius: 40px;background-color:#000000;height:20;width:20;position:absolute;left:"+x+";top:"+y);
	document.body.appendChild(n);
}
function drawWhite(x1,y1){
	var x=xStart+x1*25-2;
	var y=yStart+y1*25-2;
	var n=document.createElement("div");
	n.setAttribute("id",x1+"-"+y1);
	n.setAttribute("style", "-moz-border-radius: 40px;-webkit-border-radius: 40px;background-color:#ffffff;height:20;width:20;position:absolute;left:"+x+";top:"+y);
	document.body.appendChild(n);
}
function drawBoard(){
	var boardSize = 18;                 
	var gridSpacing = 25;
	var gridSize = boardSize * gridSpacing;
	
	xStart = Math.floor((window.innerWidth / 2) - (gridSize / 2));
	yStart = Math.floor((window.innerHeight / 2) - (gridSize / 2));
	var xEnd = xStart + gridSize;
	var yEnd = yStart + gridSize;  
	canvas.width=window.innerWidth-20;
	canvas.height=window.innerHeight-20;
	var gridContext = canvas.getContext("2d");
	
	gridContext.beginPath();
	
	// Create new image object to use as pattern
	var img = new Image();
	img.src = 'bg_wood.jpg';
	img.onload = function()
	{
		gridContext.globalCompositeOperation = 'destination-over';
	    gridContext.drawImage(img, xStart, yStart, gridSize, gridSize);
	}
	
	// Draw the board x lines
	for (var x = xStart; x <= xEnd; x += gridSpacing)
	{
	    gridContext.moveTo(x, yStart);
	    gridContext.lineTo(x, yEnd);
	}
	
	// Draw the board y lines
	for (var y = yStart; y <= yEnd; y += gridSpacing)
	{
	    gridContext.moveTo(xStart, y);
	    gridContext.lineTo(xEnd, y);
	}
	
	gridContext.strokeStyle = "#000000";
	gridContext.stroke();
	for(x=0;x<boardSize+1;x++){
		for(y=0;y<boardSize+1;y++){
			var dx=xStart+x*gridSpacing-2;
			var dy=yStart+y*gridSpacing-2;
			var n=document.createElement("div");
			n.setAttribute("style", "height:20;width:20;position:absolute;left:"+dx+";top:"+dy);
			n.setAttribute("onclick","addPiece("+dx+","+dy+");");
			document.body.appendChild(n);
		}
	}
}
function addPiece(x,y){
	if(myTurn){
	socket.emit('move',[Math.ceil((x-xStart)/25),Math.ceil((y-yStart)/25)]);
	console.log(Math.ceil((x-xStart)/25)+" "+Math.ceil((y-yStart)/25));
	}
}
function passTurn(){
	
}