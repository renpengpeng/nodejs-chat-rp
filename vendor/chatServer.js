/**
 * chatServer
 * chat 聊天室核心文件
 */

const fs 			=	require('fs');
const path 			=	require('path');
const webSocket 	=	require('nodejs-websocket');

const chatParse 	=	require('./chatParse');
const config 		=	require('./config');

/**
 * chatServer 启动
 */
exports.chatStart 	=	function(){
	try{
		var chatServer 	=	webSocket.createServer(function(chatInfo){

			/**
			 * 当用户发来消息
			 */
			 chatInfo.on('text',function(text){
			 	// 解析该聊天
			 	chatParse.iniParse(chatServer,chatInfo,text);
			 });

			 /**
			  * 当用户关闭
			  */
			 chatInfo.on('close',function(code,reason){
			 	// 从用户列表里删除 * 用户下线
			 	chatParse.endParse(chatServer,chatInfo,reason);
			 });

			 /**
			  * 当出现了未知错误
			  */
			 chatInfo.on('error',function(){
			 	console.log('出现错误未知！');
			 });

		}).listen(config.chatServer.port);
	}catch(err){
		console.log('chatServer 启动失败');
	}
};

