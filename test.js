'use strict';
var router = require('express').Router();
var AV = require('leanengine');

function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

function validate(res,req,type,data){
	for(var i in data){
		if(type == 'GET'){
			var value = req.query[i];
		}else{
			var value = req.body[i];
		}
		if(data[i]){
			//必须值
			if(!value){
				var result = {
					code : '302',
					message : data[i],
					data : []
				}
				res.send(result);
				return '';
			}
		}
		data[i] = value;
	}
	return data;
}

var test = AV.Object.extend('test');

// 新增
router.post('/add', function(req, res, next) {
	var data = {
    }
	var data = validate(res,req,'POST',data);
	if(!data){
		return;
	}
	var query = new AV.Query(test);
	query.equalTo('name',data.name);
	query.find().then(function(results) {
		//判断是否存在
		if(results.length){
			//存在
			var result = {
		   		code : 601,
		    	message : '项目已存在'
			}
			res.send(result);
		}else{
			//不存在
			//创建应用
			var addObj = new test();
			for(var key in data){
				addObj.set(key,data[key]);
			}
			addObj.save().then(function (addResult) {
		    	var result = {
		    		code : 200,
		    		data : addResult,
		    		message : 'success'
		    	}
		    	res.send(result);
			}, function (error) {
		    	var result = {
		    		code : 500,
		    		message : '保存出错'
		    	}
		    	res.send(result);
			});
		}
	}, function(err) {
		if (err.code === 101) {
			res.send(err);
  		} else {
      		next(err);
    	}
	}).catch(next);
}

// 删除
router.get('/delete', function(req, res, next) {
	var data = {
		id  : '缺少id'
    }
	var data = validate(res,req,'GET',data);
	if(!data){
		return;
	}
	var delObj = AV.Object.createWithoutData('test', data.id);
	delObj.destroy().then(function (success) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : [],
		    message : '项目已存在'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
}

// 编辑
router.post('/edit', function(req, res, next) {
	var data = {
		id  : '缺少id'
    }
	var data = validate(res,req,'POST',data);
	if(!data){
		return;
	}
	var editObj = AV.Object.createWithoutData('test', data.id);
	for(var key in data){
		editObj.set(key,data[key]);
	}
	editObj.save().then(function (editResult) {
		var result = {
		    code : 200,
		    data : editResult,
		    message : 'success'
		}
		res.send(result);
	}, function (error) {
		var result = {
		    code : 500,
		    message : '保存出错'
		}
		res.send(result);
	}).catch(next);
}

// 查找
router.get('/list', function(req, res, next) {
	var data = {
		limit : '',
       skip  : ''
    }
	var data = validate(res,req,'GET',data);
	if(!data){
		return;
	}
	data.limit ? data.limit : 1000;	data.skip ? data.skip : 0;	var query = new AV.Query('test');
   query.skip(data.skip);
   query.skip(data.limit);
	query.find().then(function (results) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
}

// 详情
router.get('/detail', function(req, res, next) {
	var data = {
		id  : '缺少id'
    }
	var data = validate(res,req,'GET',data);
	if(!data){
		return;
	}
	var query = new AV.Query('test');
	query.get(data.id).then(function(results){
		// 删除成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
}
