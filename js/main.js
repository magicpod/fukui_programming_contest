function CurrentObj(currentLatitude, currentLongitude) {
	this.setCurrentPos(currentLatitude, currentLongitude);
}
CurrentObj.prototype.setCurrentPos = function(currentLatitude, currentLongitude) {
	this.latitude = currentLatitude;
	this.longitude = currentLongitude;
	this.latlng = new google.maps.LatLng(this.latitude, this.longitude);	
}
CurrentObj.prototype.moveCurrent = function() {
	var opts = {
    	zoom: 15,
    	center: this.latlng ,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	};
  	var map = new google.maps.Map(document.getElementById("map-canvas"), opts);
	map.panTo(latlng);
}

/** マップオブジェクト */
var map;
/** 初期の表示範囲 */
var INIT_RANGE = 1000;

/** 写真のパスの配列 */
var imgPathArray = [];

/** 画像ファイルがあるフォルダ */
var IMG_FOLDER = "img/"
/** CSVファイルがあるフォルダ */
var CSV_FOLDER = "csv/"
/** 初期位置 **/
var HOME_POS = [36.062128, 136.223321];// 福井駅
/** 現在位置を保持するオブジェクト */
var currentObj = new CurrentObj(HOME_POS[0], HOME_POS[1]);

/**
 * 初期処理
 */
function initialize() {
   //  if (navigator.geolocation) {
   //      // 現在の位置情報取得を実施
   //      navigator.geolocation.getCurrentPosition(
			// // 位置情報取得成功時
			// function (pos) {
			// 	// 現在位置の読み込み
			// 	var current_p = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			// 	markPicture(current_p, INIT_RANGE);
			// },
			// function (pos) {
   //      		window.alert("本ブラウザではGeolocationが使えません");
			// });
   //  } else {
   //      window.alert("本ブラウザではGeolocationが使えません");
   //  }
   //moveHomePoint();
   markPicture(currentObj.latlng, INIT_RANGE);
}

/**
 * 地図上のマークをつける範囲を変更する処理
 */
function changeMarkRange(range) {
	//-------------------------------------------------------------------------------------------------------------------------
	markPicture(currentObj.latlng, range);

    // 丸のオプションを設定   
    var circleOptions = {   
        center: currentObj.latlng,//基点となる座標
        radius: range,//円の半径 
        strokeWeight: 3,   
        strokeColor: "#000055",//円の線の色
        strokeOpacity: 0.5,   
        fillColor: "#0055ff",//円の内側の色   
        fillOpacity: 0.5   
    };   
  
    // 丸を描写   
    var circle = new google.maps.Circle(circleOptions);   
    circle.setMap(map);

}

/**
 * 地図にふるさと百景を表示する処理
 * @param current_p 現在の表示位置
 * @param range 距離(単位:m)
 */
function markPicture(current_p, range) {
	//CSVファイルの読み込み
	var data = CsvUtils.csv2Array(CSV_FOLDER + 'hyakkei.csv');

	//TODO:　現在地を取得すると、福井県のオープンデータをつかってテストできないので、一時的にCSVの１行目のデータを現在位置とする。
	current_p = new google.maps.LatLng(data[1][4], data[1][5]); 

	//地図表示
	var mapOptions = {
		zoom: 15,	
		center: current_p
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	for (var k = 1; k < data.length; k++) {
		var target_p = new google.maps.LatLng(data[k][4], data[k][5]);
		var mm = MapUtils.toDistance( current_p, target_p );

	
		if( mm <= range ){
			var title = data[k][3];
			var imgName = data[k][2] + " " + data[k][3] + ".jpg";
			var imgPath = IMG_FOLDER + data[k][0] + " " + data[k][1] + "/" + imgName;
			var thumPath = IMG_FOLDER + "thum/" + imgName;
			
			//画面下部に画像を表示するために、作成したimgPathをグローバルな配列へ格納
			imgPathArray.push(imgPath);
			var infoWindowTag = '<div><div ><a href="'+imgPath+'" rel="lightbox" alt="'+title+'" title="'+title+'"><img  alt="'+title+'" src="' + thumPath + '"></a></div><div><a href="http://www.google.co.jp/search?hl=ja&source=hp&q='+title+'" target="_blank">詳しく調べる</a></div></div>'
			var marker = MapUtils.mark( target_p , map, infoWindowTag);
		}
	}
}

function moveHomePoint() {
	currentObj.setCurrentPos(HOME_POS[0], HOME_POS[1]);
	currentObj.moveCurrent();
}

google.maps.event.addDomListener(window, 'load', initialize);