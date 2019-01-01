/**
 * 操作sql 封装模块
 */
const mysql 	=	require('mysql');
const config 	=	require('./config');

var connectMysql 	=	null;

// 首先链接数据库(mysql)
exports.conn =	function(){
	try{
		connectMysql 	=	mysql.createConnection(config.mysql);
		console.log('CREATEA MYSQL SUCCESS');
	}catch(err){
		console.log('CREATE MYSQL ERROR');
		console.log(err);return ;
	}

	connectMysql.connect(function(err){
		if(err){
			callback(err,'','');
			console.log('MYSQL CONNECT ERROR');return ;
		}
	});
}

// 查找
exports.query = function(sql,callback){

	this.conn();

	// 开始执行 查询
	connectMysql.query(sql,function(err,res,field){
		if(err){
			callback(err,'','');
			console.log('MYSQL SELECT ERROR');return ;
		}

		callback(err,res,field);
	});

	connectMysql.end();
}

