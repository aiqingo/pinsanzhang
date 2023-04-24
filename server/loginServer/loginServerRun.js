//npm init
// npm install nodejs-websocket
//初始化登入管理器对象
global.loginServerMgr = {}

const loginMessage =require("./loginMessage");
const loginDb = require("./loginDb");
loginMessage.createServer(3000);



