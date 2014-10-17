// requireというのはJavaでいうimport文のようなものです
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

// 各種設定
app.set('port', (process.env.PORT || 5000))
  console.log('@@@@@@@@@@@@ PORT @@@@@@@@@@@@=' + process.env.PORT);
app.use(express.static(__dirname + '/public'))

// トップページへのリクエストをここで処理します
app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html')
})

// Socket.IOの処理
// 新しいユーザーが接続されるとこの処理が走ります
io.sockets.on('connection', function(socket) {
  console.log('a user connected');
  // クライアント側でユーザーがmove処理をemitするとこの処理が走ります
  socket.on('move', function(latLng) {
    console.log('@@@MOVE@@@=' + JSON.stringify(latLng));
    // move処理が実行されたことを他のユーザー全員に通知します
    socket.broadcast.emit('move', latLng);
  });;
  // クライアント側でユーザーがshake処理をemitするとこの処理が走ります
  socket.on('shake', function(latLng) {
    // shake処理が実行されたことを他のユーザー全員に通知します
    socket.broadcast.emit('shake', latLng);
  });
});

// 指定されたポートでアプリを公開します
// ※app.listenではSocket.IOがうまく動かないので注意
http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
