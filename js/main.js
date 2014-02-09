/** マップオブジェクト */
var map;
/** 現在地から表示する反映 */
var RANGE = 1000;
/** 画像ファイルがあるフォルダ */
var IMG_FOLDER = "img/"
/** CSVファイルがあるフォルダ */
var CSV_FOLDER = "csv/"

/**
 * 初期処理
 */
function initialize() {
    if (navigator.geolocation) {
        // 現在の位置情報取得を実施
        navigator.geolocation.getCurrentPosition(
			// 位置情報取得成功時
			function (pos) {
				// 現在位置の読み込み
				var current_p = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				markPicture(current_p);
			},
			function (pos) {
        		window.alert("本ブラウザではGeolocationが使えません");
			});
			
    } else {
        window.alert("本ブラウザではGeolocationが使えません");
    }
}

/**
 * 地図にふるさと百景を表示する処理
 * @param current_p 現在の表示位置
 */
function markPicture(current_p) {
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

		if( mm <= RANGE ){
			var title = data[1][3];
			var imgPath = IMG_FOLDER + data[k][0] + " " + data[k][1] + "/" + data[k][2] + " " + data[k][3] + ".jpg";
			var marker = MapUtils.mark( target_p , map, "<div>"  + title + "</div><div class='nailthumb-container square-thumb'><img src='" + imgPath +"'></div>");
		}
	}

	setTimeout(function (){$(".nailthumb-container").nailthumb();}, 1000);
}

google.maps.event.addDomListener(window, 'load', initialize);