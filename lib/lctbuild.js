'use strict';
var fs = require('fs');

var LCT = function(option){
	this._path = option.path;
	this._name = option.name;
	if(!option.path && option.name) {
	    throw new Error('路径和表明不能为空');
	}
} 
LCT.prototype = {
	build:function(){
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
					"function validate(res,req,data){\n"+
    				"	for(var i in data){\n"+
        			"		if(req.method == 'GET'){\n"+
            		"			var value = req.query[i];\n"+
        			"		}else{\n"+
            		"			var value = req.body[i];\n"+
        			"		}\n"+
        			"		if(data[i]){\n"+
            		"			//必须值\n"+
            		"			if(!value){\n"+
                	"				var result = {\n"+
                    "					code : '302',\n"+
                    "					message : data[i],\n"+
                    "					data : []\n"+
                	"				}\n"+
                	"				res.send(result);\n"+
                	"				return '';\n"+
            		"			}\n"+
        			"		}\n"+
        			"		data[i] = value;\n"+
    				"	}\n"+
    				"	return data;\n"+
					"}\n\n"+
					"var "+this._name+" = AV.Object.extend('"+this._name+"');\n\n";

		//新增
		buildText+=	"// 新增\n"+
					"router.post('/add', function(req, res, next) {\n"+
					"	var data = {\n"+
				    "    }\n"+
				    "	var data = validate(res,req,data);\n"+
    				"	if(!data){\n"+
        			"		return;\n"+
    				"	}\n"+
    				"	var query = new AV.Query("+this._name+");\n"+
    				"	query.equalTo('name',data.name);\n"+
    				"	query.find().then(function(results) {\n"+
				    "		//判断是否存在\n"+
				    "		if(results.length){\n"+
				    "			//存在\n"+
				    "			var result = {\n"+
					"		   		code : 601,\n"+
					"		    	message : '项目已存在'\n"+
					"			}\n"+
					"			res.send(result);\n"+
				    "		}else{\n"+
				    "			//不存在\n"+
				    "			//创建应用\n"+
				    "			var addObj = new "+this._name+"();\n"+
				    "			for(var key in data){\n"+
                	"				addObj.set(key,data[key]);\n"+
            		"			}\n"+
				    "			addObj.save().then(function (addResult) {\n"+
					"		    	var result = {\n"+
					"		    		code : 200,\n"+
					"		    		data : addResult,\n"+
					"		    		message : '保存成功'\n"+
					"		    	}\n"+
					"		    	res.send(result);\n"+
					"			}, function (error) {\n"+
					"		    	var result = {\n"+
					"		    		code : 500,\n"+
					"		    		message : '保存出错'\n"+
					"		    	}\n"+
					"		    	res.send(result);\n"+
					"			});\n"+                                              
				    "		}\n"+
				  	"	}, function(err) {\n"+
				    "		if (err.code === 101) {\n"+
					"			res.send(err);\n"+
					"  		} else {\n"+
					"      		next(err);\n"+
					"    	}\n"+
					"	}).catch(next);\n"+
					"}\n\n";
		//删除
		buildText+=	"// 删除\n"+
					"router.get('/delete', function(req, res, next) {\n"+
					"	var data = {\n"+
					"		id  : '缺少id'\n"+
				    "    }\n"+
				    "	var data = validate(res,req,data);\n"+
    				"	if(!data){\n"+
        			"		return;\n"+
    				"	}\n"+
    				"	var delObj = AV.Object.createWithoutData('"+this._name+"', data.id);\n"+
    				"	delObj.destroy().then(function (success) {\n"+
				    "		// 删除成功\n"+
				    "		var result = {\n"+
					"		   	code : 200,\n"+
					"		   	data : [],\n"+
					"		    message : '项目已存在'\n"+
					"		}\n"+
					"		res.send(result);\n"+
				  	"	}, function(error) {\n"+
					"		res.send(error);\n"+
					"	}).catch(next);\n"+
					"}\n\n";
		//编辑
		buildText+=	"// 编辑\n"+
					"router.post('/edit', function(req, res, next) {\n"+
					"	var data = {\n"+
					"		id  : '缺少id'\n"+
				    "    }\n"+
				    "	var data = validate(res,req,data);\n"+
    				"	if(!data){\n"+
        			"		return;\n"+
    				"	}\n"+
				    "	var editObj = AV.Object.createWithoutData('"+this._name+"', data.id);\n"+
				    "	for(var key in data){\n"+
                	"		editObj.set(key,data[key]);\n"+
            		"	}\n"+
				    "	editObj.save().then(function (editResult) {\n"+
					"		var result = {\n"+
					"		    code : 200,\n"+
					"		    data : editResult,\n"+
					"		    message : 'success'\n"+
					"		}\n"+
					"		res.send(result);\n"+
					"	}, function (error) {\n"+
					"		var result = {\n"+
					"		    code : 500,\n"+
					"		    message : '保存出错'\n"+
					"		}\n"+
					"		res.send(result);\n"+                                            
					"	}).catch(next);\n"+
					"}\n\n";
		//查找
		buildText+=	"// 查找\n"+
					"router.get('/list', function(req, res, next) {\n"+
					"	var data = {\n"+
					"		limit : '',\n"+
					"       skip  : ''\n"+
				    "    }\n"+
				    "	var data = validate(res,req,data);\n"+
    				"	if(!data){\n"+
        			"		return;\n"+
    				"	}\n"+
    				"	var limit = data.limit ? data.limit : 1000;\n"+
    				"	var skip  = data.skip ? data.skip : 0;\n"+
    				"	var query = new AV.Query('"+this._name+"');\n"+
    				"	query.skip(skip);\n"+
    				"	query.limit(limit);\n"+
    				"	query.find().then(function (results) {\n"+
				    "		// 删除成功\n"+
				    "		var result = {\n"+
					"		   	code : 200,\n"+
					"		   	data : results,\n"+
					"		    message : '获取成功'\n"+
					"		}\n"+
					"		res.send(result);\n"+
				  	"	}, function(error) {\n"+
					"		res.send(error);\n"+
					"	}).catch(next);\n"+
					"}\n\n";
		//详情
		buildText+=	"// 详情\n"+
					"router.get('/detail', function(req, res, next) {\n"+
					"	var data = {\n"+
					"		id  : '缺少id'\n"+
				    "    }\n"+
				    "	var data = validate(res,req,data);\n"+
    				"	if(!data){\n"+
        			"		return;\n"+
    				"	}\n"+
    				"	var query = new AV.Query('"+this._name+"');\n"+
    				"	query.get(data.id).then(function(results){\n"+
				    "		// 删除成功\n"+
				    "		var result = {\n"+
					"		   	code : 200,\n"+
					"		   	data : results,\n"+
					"		    message : '获取成功'\n"+
					"		}\n"+
					"		res.send(result);\n"+
				  	"	}, function(error) {\n"+
					"		res.send(error);\n"+
					"	}).catch(next);\n"+
					"}\n\n";

		//生成文件
		fs.writeFile(this._path, buildText, function(){
            console.log("生成文件成功");
        });
	}
}

module.exports = LCT;

