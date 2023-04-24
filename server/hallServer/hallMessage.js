const ws = require("nodejs-websocket");
const message = require("../comment/Message");
const {setMaxBufferLength} = require("nodejs-websocket");
//TODO  把message通用方法抽象成message类，并吧其他的消息脚本继承
class HallMessage /*extends message*/ {
    constructor() {
        //super();
    }

    static getInstance()
    {
        //实现的单例
        if (!HallMessage.instance)
        {
            HallMessage.instance = new HallMessage();
            return HallMessage.instance;
        }
        else
        {
            return HallMessage.instance;
        }
    }

    createServer(port)
    {
        let websocket =  ws.createServer((client)=>{
            client.on("text",(result)=>{
                console.log("《hall---》客户端发来的消息",result);
                // client.send("你好客户端");
                let message = JSON.parse(result);

                let type = message.type;
                let data = message.data;

                this.recvMessage(type,data,client);
                console.log("《hall---》登入服务器接受的消息消息类型-》",type,"数据-》",data);
            });
            client.on("error",(err)=>{
                console.log("《hall---》连接错误",err);
            });
            client.on("close",(err)=>{
                console.log("《hall---》连接断开",err);
            });
        });

        websocket.listen(port);
        console.log("《hall---》登入服务器启动成功，端口号：",port);
    }
    //接收消息 and 处理  --type = 消息类型 data = 消息内容 client = 某个客户端
    recvMessage(type,data,client)
    {
        switch (type)
        {
            case "create_room":
                console.log("《hall---》创建房间请求");
                this.responseCreateRoomMessage(type,data,client);
                break;
            case "join_room":
                this.responsejoinRoomMessage(type,data,client);
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

    async responsejoinRoomMessage(type,data,client)
    {
        let roomID = data.roomID;
        // let resule = global.hallServerMgr.hallDbMgr.getRoomInfo(roomID);
        // // console.log(resule);
        // let sendData = {
        //     type:type,
        //     data:resule[0],
        // }
        // client.send(JSON.stringify(sendData));
        global.hallServerMgr.hallDbMgr.getRoomInfo(roomID).then((resultdata)=>{
        console.log("《hall---》房间数据保存到数据库成功");
        let result = {
            type:type,
            data:resultdata[0],
        }
        client.send(JSON.stringify(result));
    }).catch(()=>{
        console.log("《hall---》房间数据保存到数据库失败");
        let result = {
            type:type,
            data:0,
        }
        client.send(JSON.stringify(result));
    })
    }

    //响应客户端发送来的创建服务端请求
    async responseCreateRoomMessage(type,room_info,client) {
        let room_id = await this.getNewRoomId();/*.then(() => {})*/
        console.log("房间id = ",room_id,"房间信息 = ",room_info);
        global.hallServerMgr.hallDbMgr.seveRoomInfo(room_id,room_info).then(()=>{
            console.log("《hall---》房间数据保存到数据库成功");
            let result = {
                type:type,
                data:room_id,
            }
            client.send(JSON.stringify(result));
        }).catch(()=>{
            console.log("《hall---》房间数据保存到数据库失败");
            let result = {
                type:type,
                data:0,
            }
            client.send(JSON.stringify(result));
        })
    }

    //获取新房间id
    getNewRoomId()
    {
        return new Promise((resolve, reject)=>{
            this.getValidRoomID(resolve);
        })
    }
    //获取一个有效的id
    getValidRoomID(callback)
    {
        let str= "";
        for (let i = 0; i < 6; i++) {
            if (i===0)
            {
                let tmpStr = Math.round(Math.random()*9);
                if (tmpStr!== 0)
                {
                    str += tmpStr;
                    continue;
                }
                else
                {
                    str += 1;
                    continue;
                }
            }
             str += Math.round(Math.random()*9);
        }

        global.hallServerMgr.hallDbMgr.queryRoomIdIsUsable(str*1).then((result)=>{
            if(result.length > 0)
            {
                this.getValidRoomID(callback);
            }
            else
            {
                if (callback)
                {
                    callback(str);
                }
            }
        }).catch((err)=>{
            this.getValidRoomID(callback);
        });

        console.log("str = ",str)
    }

}
module.exports = HallMessage.getInstance(/*HallMessage*/);