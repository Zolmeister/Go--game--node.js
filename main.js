//Author: Zoli Kahan http://schoolapedia.org
var app = require('http').createServer(handler), io = require('socket.io')
		.listen(app), fs = require('fs'), url = require('url'), md5 = require('./md5')
io.set('log level', 1);
app.listen(1702);
maps = {};
users = [];

function addMap(id) {
	maps[id] = newMap();
	console.log("added map");
}
function newMap() {
	s = [];
	for (x = 0; x < 19; x++) {
		s[x] = [];
		for (y = 0; y < 19; y++) {
			s[x][y] = 0;
		}
	}
	return s;
}

function handler(req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log(pathname);
	if (pathname == "/")
		pathname = "/index.html";
	if (pathname.match(/[\w]{16}/) != null)
		pathname = "/game.html";
	if (pathname.match(/\.{2}/) != null)
		pathname = "/index.html";
	fs.readFile(__dirname + pathname, function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

function unique() {
	return md5.hex_md5(Math.random() * 99999999 + "").substring(0, 16);
}

io.of('/m').on('connection', function(socket) {
	socket.on('new', function(data) {
		console.log("new game");
		var player1 = unique();
		var player2 = unique();
		newGame(player1, player2);
		users.push([ player1, player2 ]);
		socket.emit('new', player1);
	});
});
function clone(x){
    if (x.constructor == Array)
    {
        var r = [];
        for (var i=0,n=x.length; i<n; i++)
            r.push(clone(x[i]));
        return r;
    }
    return x;
}
function endGame(id,col,col2){
	var board = maps[id];
	var updatedBoard=clone(board);
	var count=0;
	for (var x = 0; x < board.length; x++) {
		for (var y = 0; y < board[x].length; y++) {
			if (board[x][y] != 0)
				continue;
			if (checkEndGame(board, x, y, col)) {
				console.log("point against "+col+" at x: " + x + " y: " + y);
				updatedBoard[x][y] = col2;
				board[x][y]=col2;
				count++;
			}
			board[x][y]=0;
		}
	}
	maps[id] = updatedBoard;
	return count;
}

function updateBoard(id, col) {
	var board = maps[id];
	var updatedBoard=clone(board);
	var count=0;
	//for(var i=0;i<maps[id].length;i++){
		//updatedBoard.push(maps[id][i]);
	//}
	for (var x = 0; x < board.length; x++) {
		for (var y = 0; y < board[x].length; y++) {
			if (board[x][y] != col)
				continue;
			if (check(board, x, y, col)) {
				console.log("REMOVED "+col+" at x: " + x + " y: " + y);
				updatedBoard[x][y] = 0;
				board[x][y]=col;
				count++;
			}
			board[x][y]=col;
		}
	}
	maps[id] = updatedBoard;
	return count;
}

function checkEndGame(board, x, y, col){
	try {
		center = board[x][y];
	} catch (e) {
		center = "x";
		console.log("BIG ERROR");
	}
	try {
		up = board[x][y - 1];
	} catch (e) {
		up = "x";
	}
	try {
		down = board[x][y + 1];
	} catch (e) {
		down = "x";
	}
	try {
		left = board[x - 1][y];
	} catch (e) {
		left = "x";
	}
	try {
		right = board[x + 1][y];
	} catch (e) {
		right = "x";
	}
	if (up == col || down == col || left == col || right == col)
		return false;
	board[x][y] = "y";
	if (right ==0){
		if (checkEndGame(board, x + 1, y, col) == false){
			board[x][y] = 0;
			return false;
			}
	}
		
	if (left == 0)
		if (checkEndGame(board, x - 1, y, col) == false){
			board[x][y] = 0;
			return false;
		}
	if (down == 0)
		if (checkEndGame(board, x, y + 1, col) == false){
			board[x][y] = 0;
			return false;
		}
	if (up == 0)
		if (checkEndGame(board, x, y - 1, col) == false){
			board[x][y] = 0;
			return false;
		}
	board[x][y] = 0;
	return true;//add 0 as point
}
function check(board, x, y, col) {
	try {
		center = board[x][y];
	} catch (e) {
		center = "x";
		console.log("BIG ERROR");
	}
	try {
		up = board[x][y - 1];
	} catch (e) {
		up = "x";
	}
	try {
		down = board[x][y + 1];
	} catch (e) {
		down = "x";
	}
	try {
		left = board[x - 1][y];
	} catch (e) {
		left = "x";
	}
	try {
		right = board[x + 1][y];
	} catch (e) {
		right = "x";
	}
	if (up == 0 || down == 0 || left == 0 || right == 0)
		return false;
	board[x][y] = "y";
	if (right == col){
		if (check(board, x + 1, y, col) == false){
			board[x][y] = col;
			return false;
			}
	}
		
	if (left == col)
		if (check(board, x - 1, y, col) == false){
			board[x][y] = col;
			return false;
		}
	if (down == col)
		if (check(board, x, y + 1, col) == false){
			board[x][y] = col;
			return false;
		}
	if (up == col)
		if (check(board, x, y - 1, col) == false){
			board[x][y] = col;
			return false;
		}
	board[x][y] = col;
	return true;//remove piece
}

function newGame(p1, p2) {
	addMap(p1);
	var p1s;//sockets
	var p2s;
	var p1Score=0;
	var p2Score=0;
	var turn = "p1";
	var passCount=0;
	io.of("/" + p1).on('connection', function(socket) {
		p1s = socket;
		p1s.emit('turn', turn == "p1");
		socket.set('user', p1, function() {
			socket.emit('ready');
		});
		socket.on('msg', function(data) {
			socket.get('user', function(err, name) {
				console.log('Chat message by ' + name + " - msg: " + data);
			});
		});

		socket.on('move', function(data) {
			if (p2s) {
				socket.get('user', function(err, name) {
					if (turn == "p1") {
						//check if valid move here
						maps[name][data[0]][data[1]] = "a";
						p1Score+=updateBoard(p1, "b");//remove b's (white)
						p2Score+=updateBoard(p1, "a");//remove a's (black)
						socket.emit('map', maps[name]);
						p2s.emit('map', maps[name]);
						turn = "p2";
						p2s.emit('scores', [p2Score,p1Score]);
						p1s.emit('scores', [p1Score,p2Score]);
						p2s.emit('turn', turn == "p2");
						p1s.emit('turn', turn == "p1");
						passCount=0;
					}
				});
			}
		});
		
		socket.on('pass', function(data) {
			passCount++;
			turn = "p2";
			p2s.emit('turn', turn == "p2");
			p1s.emit('turn', turn == "p1");
			p2s.emit('pass', true);
			if(passCount==2) {
				p1s.emit('winner', [p1Score,p2Score]);
				p2s.emit('winner', [p2Score,p1Score]);
				/*p1Score+=endGame(p1,"a","b");
				p2Score+=endGame(p1,"b","a");
				p1s.emit('winner', [p1Score,p2Score]);
				p2s.emit('winner', [p2Score,p1Score]);*/
			}
		});
		
		socket.emit('map', maps[p1]);
		socket.emit('p2', p2);

	});
	io.of("/" + p2).on('connection', function(socket) {
		p2s = socket;
		p2s.emit('turn', turn == "p2");
		socket.set('user', p2, function() {
			socket.emit('ready');
		});
		socket.on('msg', function(data) {
			socket.get('user', function(err, name) {
				console.log('Chat message by ' + name + " - msg: " + data);
			});
		});

		socket.on('move', function(data) {
			socket.get('user', function(err, name) {
				if (turn == "p2") {
					maps[p1][data[0]][data[1]] = "b";
					p2Score+=updateBoard(p1, "a");
					p1Score+=updateBoard(p1, "b");
					socket.emit('map', maps[p1]);
					p1s.emit('map', maps[p1]);
					turn = "p1";
					p2s.emit('scores', [p2Score,p1Score]);
					p1s.emit('scores', [p1Score,p2Score]);
					p2s.emit('turn', turn == "p2");
					p1s.emit('turn', turn == "p1");
					passCount=0;
					// console.log('Chat message by '+name+" - msg: "+data);
				}
			});
		});
		socket.on('pass', function(data) {
			passCount++;
			turn = "p1";
			p2s.emit('turn', turn == "p2");
			p1s.emit('turn', turn == "p1");
			p1s.emit('pass', true);
			if(passCount==2) {
				p1s.emit('winner', [p1Score,p2Score]);
				p2s.emit('winner', [p2Score,p1Score]);
				/*p1Score+=endGame(p1,"a","b");
				p2Score+=endGame(p1,"b","a");
				p1s.emit('winner', [p1Score,p2Score]);
				p2s.emit('winner', [p2Score,p1Score]);*/
			}
		});
		socket.emit('map', maps[p1]);
	});
}
