var socket;
var latLngs = [];
var markers = [];
var map;
var marker1;
var marker2;

/**
 * クライアント側の初期設定を行います。
 */
function initialize() {
  // Socket.IOの初期設定
  socket = io.connect();
  // 他のユーザがmove処理を実行した時にこの処理が走るよう設定
  socket.on('move', function(data) {
    var latLng = new google.maps.LatLng(data.lat, data.lng);
    latLngs.push(latLng);
    writePolyline(latLng);
  });
  // 他のユーザがshake処理を実行した時にこの処理が走るよう設定
  socket.on('shake', function(data) {
    var latLng = new google.maps.LatLng(data.lat, data.lng);
    latLngs.push(latLng);
    writePolyline(latLng);
    addMarker(latLng);
  });

  // とりあえず現在地抜きでマップを表示
  var mapOptions = {
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($('#map_canvas')[0], mapOptions);

  // 現在地を取得して中心座標設定メソッドに渡す
  navigator.geolocation.getCurrentPosition(
    setCurrentPosition,
    function fail() {
      alert("位置情報APIが使用できないブラウザです");
    });
}

/**
 * Googleマップの中心座標を現在地に設定します。
 */
function setCurrentPosition(position) {
  latLngs[0] = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  map.setCenter(latLngs[0]);
  // マーカーも表示
  markers[0] = new google.maps.Marker({
    map: map,
    position: latLngs[0],
    icon: "images/daanger.png"
  });
}

/**
 * 移動時の処理を行います。
 */
function move() {
  var latLng = getLatLng();
  latLngs.push(latLng);
  writePolyline(latLng);
  var data = {
    lat: latLng.lat(),
    lng: latLng.lng()
  }
  socket.emit('move', data);
}

/**
 * シェイク時の処理を行います。
 */
function shake() {
  var latLng = getLatLng();
  latLngs.push(latLng);
  writePolyline(latLng);
  addMarker(latLng);
  var data = {
    lat: latLng.lat(),
    lng: latLng.lng()
  }
  socket.emit('shake', data);
}

/**
 * マップの指定された座標までポリラインを引きます。
 */
function writePolyline(latLng) {
  map.panTo(latLng);
  var line = new google.maps.Polyline({
    path: latLngs,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  line.setMap(map);
}

/**
 * マップの指定された座標にマーカーを追加します。
 */
function addMarker(latLng) {
  map.panTo(latLng);
  markers.push(new google.maps.Marker({
    map: map,
    position: latLng
  }));
}

/**
 * 入力された緯度と経度から座標オブジェクトを生成して返します。
 */
function getLatLng() {
  var lat = $('#lat').val();
  var lng = $('#lng').val();
  return new google.maps.LatLng(lat, lng);
}

/**
 * テストフォームの表示/非表示を切り替えます。
 */
function toggleTestForm() {
  $('#test_form').toggle();
}
