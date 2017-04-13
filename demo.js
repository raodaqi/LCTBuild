/**
 * Created by 面向不对象 on 2017/4/13.
 */
var LCT = require('./lib/lctbuild');
console.log(LCT);
var LCT = new LCT({
	path:"test.js",
	name:"test"
})
LCT.build();