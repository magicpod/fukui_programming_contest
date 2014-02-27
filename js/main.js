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

/** ナビゲーションマップ */
var navi_map;
/** マップオブジェクト */
var map;
/** 初期の表示範囲 */
var INIT_RANGE = 300000;

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
/**　ナビゲーションマップのセンタの経度・緯度 */
var NAVI_MAP_CENTER = new google.maps.LatLng(36.0349,136.1306);
/** 地名 */
var PLACE_NAME = {
	/** あわら温泉屋台村 湯けむり横丁 */
	YUKEMURI :
		{
			LATING : new google.maps.LatLng(36.224214, 136.190476),
			INFO   : "あわら温泉屋台村 湯けむり横丁"
		},
	/** 東尋坊タワー */
	TOUJINN_BOU :
	    {
	    	LATING : new google.maps.LatLng(36.237026, 136.129969),
	    	INFO   : "東尋坊タワー"
	    },
	/** 越前松島水族館 */
	SUI_ZOKU_KAN :
		{
	    	LATING : new google.maps.LatLng(36.2527, 136.14707),
	    	INFO   : "越前松島水族館"
		},
	/** 福井県立恐竜博物館 */
	KYOURYU_HAKUBUTUKAN :
		{
	    	LATING : new google.maps.LatLng(36.083073, 136.509382),
	    	INFO   : "福井県立恐竜博物館"
		},
	/** 永平寺 */
	HEIHEIJI :
		{
	    	LATING : new google.maps.LatLng(36.055779, 136.354537),
	    	INFO   : "永平寺"
		},
	/** 赤レンガ倉庫 */
	HEIHEIJI :
		{
	    	LATING : new google.maps.LatLng(35.660444, 1136.076688),
	    	INFO   : "赤レンガ倉庫"
		}
};
/**
 * 初期処理
 */
function initialize() {
	//ナビゲーションマップ
	drawNaviMap();
	//詳細マップ	
	markPicture(currentObj.latlng, INIT_RANGE);
}

function drawNaviMap(){
	//地図表示
	navi_map = new google.maps.Map(document.getElementById('navimap-canvas'), {});
	//KMLを表示
	var ctaLayer = new google.maps.KmlLayer({
		url: 'https://dl.dropboxusercontent.com/u/270305421/fukui_programming_contest/fukui.kml',
		map : navi_map
	});
	// マーカを付ける
	for(var key in PLACE_NAME){
		var marker = new google.maps.Marker({
			position: PLACE_NAME[key]["LATING"],
			map: navi_map,
		    draggable:true,
    		animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(marker, 'click', function() {
			alert(PLACE_NAME[key]["LATING"]);		
  		});
	}
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

		if(data[k][6] != '○'){
			continue;			
		}

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