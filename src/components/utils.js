'use strict';

var utils={
	parseQuery:function(str){
		var ret = {},reg = /([^?=&]+)=([^&]*)(&|$)/ig,match;
		while (( match = reg.exec(str)) != null) {
			ret[match[1]] = decodeURIComponent(match[2]);
		}
		return ret;
	},
	strlen:function(str){
		var s = 0;
		for (var i = 0; i < str.length; i++) {
		    if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
		        s += 2;
		    } else {
		        s++;
		    }
		}
		return s;
	},
	randomString:function(len){
		var len = len || 32;
		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = chars.length;
		var tmpArr = [];
		for (var i = 0; i < len; i++) {
		    tmpArr.push(chars.charAt(Math.floor(Math.random() * maxPos)));
		}
		return tmpArr.join("");
	},
	titleCase:function(str){
		var tmpArr=[];
		tmpArr = str.split("");
		tmpArr[0] = tmpArr[0].toUpperCase();
		return tmpArr.join("");
	},
	extend:function(src,target){
		for (var name in target){
			if (target.hasOwnProperty(name)){
				src[name] = target[name];
			}
		}
		return src;
	},
};

module.exports = utils