/**
 * CSV���[�e�B���e�B�N���X
 */
var CsvUtils = {
	/**
	 * csv�t�@�C���̓ǂݍ��݁A2�����z��ŕԂ��B
	 * filePath csv̧��ɑ����߽or����߽
	 */
	csv2Array : 
		function(filePath) {
			var csvData = new Array();
			var data = new XMLHttpRequest();	
			data.open("GET", filePath, false); //true:�񓯊�,false:����
			data.send(null);

			var LF = String.fromCharCode(10); //���s����
			var lines = data.responseText.split(LF);
			for (var i = 0; i < lines.length;++i) {
				var cells = lines[i].split(",");
				if( cells.length != 1 ) {
					csvData.push(cells);
				}
			}
			return csvData;
		}
}