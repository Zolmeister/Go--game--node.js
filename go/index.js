//Author: Zoli Kahan http://schoolapedia.org
socket = io.connect(window.top.location.href+"m");
socket.on('new', function (data) {
	console.log(data);
	window.location=window.top.location.href+data;
	document.body.innerHTML+="<br><br>"+window.top.location.href+data;
});
function newGame(){
	socket.emit('new', "new");
}
