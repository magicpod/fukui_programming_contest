/**
 * �n�}�Ɋ֐����e�B���e�B�N���X
 */
var MapUtils = {
	/**
	 * Map��Ƀ}�[�J�[��t����
	 * @param target_p �ܓx�E�o�x(LatLng)
 	 * @param imgFileName
 	 */
	mark :
		function ( target_p, imgFileName){
			//TODO: �����ɃT���l�C�������鏈����ǉ�����B
			var marker = new google.maps.Marker({
				position: target_p,
				map: map,
				icon: imgFileName});
			marker.setMap(map);
		},

	/**
	 * �Q�̌o�x�ܓx���狗��(�P��:���[�g���j���Z�o����B
	 * �� from��to��LatLng�N���X
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
			
			//�P�ʂ̓L�����[�g���B���[�g���ɂ���Ƃ��͂P�O�O�O�|���邱��
			return (d * 1000);
		}
}