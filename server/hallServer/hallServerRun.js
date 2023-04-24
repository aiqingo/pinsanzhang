//npm init
// npm install nodejs-websocket
//初始化登入管理器对象
global.hallServerMgr = {}

const hallMessage =require("./hallMessage");
const hallDb = require("./hallDb");
hallMessage.createServer(3001);



