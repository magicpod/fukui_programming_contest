/** �}�b�v�I�u�W�F�N�g */
var map;

/** ���ݒn����\�����锽�f */
var RANGE = 1000;

/** �摜�t�@�C��������t�H���_ */
var IMG_FOLDER = "img/"

/** CSV�t�@�C��������t�H���_ */
var CSV_FOLDER = "csv/"

/**
 * ������
 */
function initialize() {
	//CSV�t�@�C���̓ǂݍ���
	var data = CsvUtils.csv2Array(CSV_FOLDER + 'hyakkei.csv');

	//���݈ʒu�̓ǂݍ���  �ŏI�I�ɂ̓f�o�C�X���猻�݂̈ʒu�����擾����B
	var current_p = new google.maps.LatLng(data[1][4],data[1][5]);
	//TODO:���� �����Ɍ��݈ʒu���擾���鏈�����L�ڂ���B

	//�n�}�\��
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