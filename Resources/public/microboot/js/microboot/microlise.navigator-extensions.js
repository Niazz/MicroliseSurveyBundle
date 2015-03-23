////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////
//
// Oringinal code
//
// http://stackoverflow.com/questions/5916900/detect-version-of-browser
//
////////////////////////////////////////////////////////////////////////////////////////
// navigator.sayswho= (function(){
// 	var ua= navigator.userAgent, tem,
// 	M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
// 	if(/trident/i.test(M[1])){
// 		tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
// 		return 'IE '+(tem[1] || '');
// 	}
// 	M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
// 	if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
// 	return M.join(' ');
// })();

if (navigator.browser == undefined){
	navigator.browser = (function(){
		var ua = navigator.userAgent;
		var tem;
		var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];

		if(/trident/i.test(M[1])){
			tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		}
		M = M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
		if ((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];

		var temp = M.join(' '), pos;
		if (temp.indexOf('MSIE') == -1){
			pos = temp.indexOf(' ');
			temp = temp.substring(0,pos);
		}else{
			temp = temp.replace('MSIE', 'IE');
			temp = temp.replace(' ', '');
			pos = temp.indexOf('.');
			temp = temp.substring(0,pos);
		}
		return temp;
	})();
}