const ws = require("nodejs-websocket");
const  message = require("../comment/Message");
let roomMgr = require("./roomMgr");
class PSZMessage /*extends message*/ {
    constructor() {
        // super();
    }

    static getInstance()
    {
        //实现的单例
        if (!PSZMessage.instance)
        {
            PSZMessage.instance = new PSZMessage();
            return PSZMessage.instance;
        }
        else
        {
            return PSZMessage.instance;
        }
    }

    createServer(port)
    {
        let websocket =  ws.createServer((client)=>{
            client.on("text",(result)=>{
                console.log("《PSZ---》客户端发来的消息",result);
                // client.send("你好客户端");
                let message = JSON.parse(result);

                let type = message.type;
                let data = message.data;

                this.recvMessage(type,data,client);
                console.log("《PSZ---》登入服务器接受的消息消息类型-》",type,"数据-》",data);
            });
            client.on("error",(err)=>{
                console.log("《PSZ---》连接错误",err);
            });
            client.on("close",(err)=>{
                console.log("《PSZ---》连接断开",err);
            });
        });

        websocket.listen(port);
        console.log("《PSZ---》登入服务器启动成功，端口号：",port);
    }
    //接收消息 and 处理  --type = 消息类型 data = 消息内容 client = 某个客户端
    recvMessage(type,data,client)
    {

        switch (type)
        {
            case "request_room_info":
                this.onRequestRoomInfo(type,data,client);
                break;
            case "ready_ok":
                this.onReady(type,data,client);
                break;
            default:
                break;
        }

    }
    sendMessage(type,data,client)
    {
        let result = {
            type:type,
            data:data,
        }
        client.send(JSON.stringify(result));

    }
    onRequestRoomInfo(type,data,client)
    {
        console.log("《PSZ---》请求服务器信息 类型--",type,"数据--",data)

        let roomIsExist = false;
        if (roomMgr.getInstance()._roomList.length == 0)
        {
            roomIsExist = true;
            global.PSZServerMgr.PSZDbMgr.getRoomInfo(data.roomID).then((result)=>{
                let roomData = result[0];
                console.log("《PSZ---》从数据库查询信息并创建");
                roomMgr.getInstance().createRoom(type,roomData,client);
            }).catch((err)=>{
                console.log("《PSZ---》查询服务器房间出错",err)
            });
        }
        else
        {
            for (let i = 0; i <roomMgr.getInstance()._roomList.length;i++)
            {
                let tmpRoom =  roomMgr.getInstance()._roomList[i];
                if (tmpRoom.roomID == data.roomID)
                {
                    roomIsExist = true;
                    global.PSZServerMgr.PSZServerMgr.sendMessage(type,tmpRoom.getRoomInfo(),client);
                    //todo
                    tmpRoom.addPlayer(data.userID,client);
                }
            }
        }
        //没有房间信息
        if(!roomIsExist)
        {

        }


    }
    //想用客户端发送登入请求的消息
    responseUserLoginMessage(id)
    {
        return  new Promise((resolve, reject)=>{
            global.loginServerMgr.loginDbMgr.getUserInfo(id).then((resuit)=>{
                console.log("《PSZ---》从数据库取出的信息",resuit);
                resolve(resuit);
            }).catch((err)=>{
                console.log("《PSZ---》数据库获取数据失败",err);
                reject(err);
            });
        });
    }

    onReady(type,data,client)
    {
        console.log(data);
        // if (roomMgr.getInstance()._roomList.length == 0)
        // {
        //
        // }
        // else
        // {
        //     for (let i = 0; i <roomMgr.getInstance()._roomList.length;i++)
        //     {
        //         let tmpRoom =  roomMgr.getInstance()._roomList[i];
        //         if (tmpRoom.roomID == data.roomID)
        //         {
        //             tmpRoom.setPlayerReady(data.userID,client);
        //         }
        //     }
        // }
    }



}
global.PSZServerMgr.PSZServerMgr = PSZMessage.getInstance();
module.exports = PSZMessage;
// module.exports = PSZMessage;