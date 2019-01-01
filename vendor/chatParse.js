/**
 * 聊天解析文件
 * 信息接收格式：{type,message,frompic,fromuserid,fromusername,tou,time,tip,online}
 * 信息返回格式：{type:message,frompic,fromuserid,fromusername,tou,time,tip,online}
 */
const mysql 		=	require('./mysql');
const util 			=	require('util');
const library 		=	require('./library');


// 用户列表
var userList 		=	[];

/**
 * 开始解析
 * @param server resource 服务器
 * @param 
 */
exports.iniParse 	=	function(server,conn,text){

	text 			=	JSON.parse(text);
	var sendType 	=	text.to;

	// 检测是否有违禁词
	var hasLow 		=	this.hasLaw(text.message);
	if(hasLow){
		text.tip 	=	'含有违禁词';
	}else{
		text.tip 	=	'';
	}

	// 是否已经存在会员
	var hasUser  	=	this.hasUser(conn.key);
	if(hasUser == false){
		var newuser 			=	[];
		newuser['fromuserid'] 	=	text.fromuserid;
		newuser['frompic'] 		=	text.frompic;
		newuser['fromusername']	=	text.fromusername;
		newuser['conn'] 		=	conn;

		userList.push(newuser);
	}

	// 添加会员列表
	text.online 	=	this.onlineList();
	
	// 开始广播
	if(sendType == 'all'){
		var that 	=	this;
		// MYSQL 插入数据库 sql 语句
		var sql 	=	util.format('INSERT INTO chat_pub(type,fromuserid,fromusername,content,send_time)values("%s","%s","%s","%s","%s")',text.type,text.fromuserid,text.fromusername,text.message,text.time);
		// 开始插入
		mysql.query(sql,function(err,data,field){
			if(err){
				text.tip 	=	'发送失败:MYSQL ERROR';
			}

			// 发送给所有人
			that.sendAll(server,conn,text);
		});
		
	}else{
		// 单独发送
		this.sendOne(server,conn,text);
	}

}

/**
 * 广播消息 发送所有
 */
exports.sendAll 	=	function(server,conn,text){
	server.connections.forEach(function(connection){
		connection.sendText(JSON.stringify(text));
	});
}

/**
 * 广播消息 单独发送
 */
exports.sendOne 	=	function(server,conn,text){

}

/**
 * 检验是否有违法关键词
 */
exports.hasLaw 		=	function(message){
	if(/做爱|恶心/g.test(message)){
		return true;
	}else{
		return false;
	}
}

/**
 * 会员列表更新操作
 */
exports.upChatList 	=	function(){

}

/**
 * 获取当前会员列表  *  人数少不回调
 */
exports.onlineList 	=	function(){
	var online 		=	[];

	userList.forEach(function(data,index){
		var info 	=	{pic:data.frompic,username:data.fromusername,userid:data.fromuserid};

		online.push(info);
	});

	online 			=	JSON.stringify(online);

	return online;
}

/**
 * 判断用户ID 是否存在  * 根据 KEY
 */
exports.hasUser 	=	function(userparam){

	for(var i = 0;i<userList.length;i++){
		if(userList[i]['conn']['key'] == userparam){
			return true;
		}
	}

	return false;
}

/**
 * 删除用户  根据KEY
 */
exports.delUser 	=	function(userparam){
	userList.forEach(function(data,index){
		if(data['conn']['key'] == userparam){
			userList.splice(index);
		}
	});
}

/**
 * 当用户退出后
 */
exports.endParse 	=	function(server,conn,reason){
	// 关闭的key
	var userkey 	=	conn.key;


	this.delUser(userkey);
}