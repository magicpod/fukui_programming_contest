/**
 * 地図に関数ユティリティクラス
 */
var MapUtils = {
	/**
	 * Map上にマーカーを付ける
	 * @param target_p 緯度・経度(LatLng)
 	 * @param imgFileName
 	 */
		mark :
			function ( target_p, imgFileName){
				var marker = new google.maps.Marker({
					position: target_p,
					map: map
					});
				marker.setMap(map);
				return marker;
			},

	/**
	 * map上のマーカーにインフォメーションを表示
	 */
	infoWindow : 
		function (map, marker, contentHtml) {
			var infoWindow = new google.maps.InfoWindow({content: contentHtml});
			infoWindow.open(map, marker);
		},

	/**
	 * ２つの経度緯度から距離(単位:メートル）を算出する。
	 * ※ fromとtoはLatLngクラス
	 */
	toDistance :
		function (from, to) {
			if (!from || !to) {
				return 0;
			}
			var R = 6371; // Radius of the Earth in km
			var dLat = (to.lat() - from.lat()) * Math.PI / 180;
			var dLon = (to.lng() - from.lng()) * Math.PI / 180;
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(from.lat() * Math.PI / 180) * Math.cos(to.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			
			//単位はキロメートル。メートルにするときは１０００掛けること
			return (d * 1000);
		}
}