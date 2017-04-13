'use strict';
var fs = require('fs');

var LCT = class LCT{
	init(option){
		this._path = option.path;
		this._name = option.class_name;
		if(!option.path && option.class_name) {
	      throw new Error('路径和表明不能为空');
	    }

	    this._build();
	}

	_build(){
		//生成文件
		var buildText = '';

		buildText = "'use strict';\n"+
					"var router = require('express').Router();\n"+
					"var AV = require('leanengine');\n\n"+
					"function sendError(res,code,message){\n"+
					"	var result = {\n"+
					"		code:code,\n"+
					"		message:message,\n"+
					"		data:[]\n"+
					"	}\n"+
					"	res.send(result);\n"+
					"}\n\n"+
					"function validate(res,req,type,data){\n"+
    				"	for(var i in data){\n"+
        			"		if(type == "GET"){\n"+
            		"			var value = req.query[i];\n"+
        			"		}else{\n"+
            		"			var value = req.body[i];\n"+
        			"		}\n"+
        			"		if(data[i]){\n"+
            		"			//必须值\n"+
            		"			if(!value){\n"+
                	"				var result = {\n"+
                    "					code : "302",\n"+
                    "					message : data[i],\n"+
                    "					data : []\n"+
                	"				}\n"+
                	"				res.send(result);\n"+
                	"				return "";\n"+
            		"			}\n"+
        			"		}\n"+
        			"		data[i] = value;\n"+
    				"	}\n"+
    				"	return data;\n"+
					"}\n\n"+
					"var APP = AV.Object.extend('APP');";
	}
}