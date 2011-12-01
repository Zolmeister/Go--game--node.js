//Author: Zoli Kahan http://schoolapedia.org
socket = io.connect(window.top.location.href);
socket.on('map', function (data) {
	//console.log(data);
	map=data;
	drawMap(data);
	//socket.emit('my other event', { my: 'data' });
});
socket.on('p2', function (data) {
document.getElementById("p2url").value="http://"+window.top.location.host+"/"+data;
document.getElementById("p2urlContainer").style.display="block";
});

myTurn=false;
socket.on('turn', function (data) {
	myTurn=data;
	if(data){
		document.getElementById("turn").innerHTML="Your Turn";
	}
	else{
		document.getElementById("turn").innerHTML="Other Players Turn";
	}
});
socket.on('scores', function (data) {
	mine=data[0];
	other=data[1];
	document.getElementById("myScore").innerHTML="My Score: "+mine;
	document.getElementById("opponentScore").innerHTML="Opponents Score: "+other;
});
socket.on('pass', function (data) {
	alert("Other Player Passed.");
});
socket.on('winner', function (data) {
	/*if(data[0]>data[1])alert("YOU WON!\n "+data[0]+"-"+data[1]);
	if(data[0]<data[1])alert("you lost.\n "+data[0]+"-"+data[1]);
	if(data[0]==data[1])alert("tie\n "+data[0]+"-"+data[1]);*/
	alert("game over, idk how u wana score so u can do it.");
	
});
function pass(){
	socket.emit('pass',true);
}