const ws = require("nodejs-websocket");
const  message = require("../comment/Message");
class LonginMessage /*extends message*/ {
    constructor() {
        // super();
        //存储上线的所有玩家
        this.onLinePlayer = []
    }

    static getInstance()
    {
        //实现的单例
        if (!LonginMessage.instance)
        {
            LonginMessage.instance = new LonginMessage();
            return LonginMessage.instance;
        }
        else
        {
            return LonginMessage.instance;
        }
    }

    createServer(port)
    {
        let websocket =  ws.createServer((client)=>{
            client.on("text",(result)=>{
                console.log("《login---》客户端发来的消息",result);
                // client.send("你好客户端");
                let message = JSON.parse(result);

                let type = message.type;
                let data = message.data;

                this.recvMessage(type,data,client);
                console.log("《login---》登入服务器接受的消息消息类型-》",type,"数据-》",data);
            });
            client.on("error",(err)=>{
                console.log("《login---》连接错误",err);
            });
            client.on("close",(err)=>{
                console.log("《login---》连接断开",err);
            });
        });

        websocket.listen(port);
        console.log("《login---》登入服务器启动成功，端口号：",port);
    }
    //接收消息 and 处理  --type = 消息类型 data = 消息内容 client = 某个客户端
    recvMessage(type,data,client)
    {
        switch (type)
        {
            case "login":
                // if (this.linePlayer(data.id))
                // {
                //
                //     this.sendMessage(type,{data:"accountLine"},client);
                //     return;
                // }
                // else
                // {
                    this.onLinePlayer.push(data.id);
                    this.responseUserLoginMessage(data.id).then((result)=>{
                        this.sendMessage(type,result[0],client)
                    }).catch((err)=>{
                        this.sendMessage(type,{err:"《login---》获取不到对应数据"},client);
                    });
                    break;
                // }

            default:
                break;
        }

    }

    //获取玩家是否在线
    linePlayer(userId)
    {
        return  this.onLinePlayer.includes(userId);
    }

    sendMessage(type,data,client)
    {
        let result = {
            type:type,
            data:data,
        }
        client.send(JSON.stringify(result));

    }

    //想用客户端发送登入请求的消息
    responseUserLoginMessage(id)
    {
        return  new Promise((resolve, reject)=>{
            global.loginServerMgr.loginDbMgr.getUserInfo(id).then((resuit)=>{
                console.log("《login---》从数据库取出的信息",resuit);
                resolve(resuit);
            }).catch((err)=>{
                console.log("《login---》数据库获取数据失败",err);
                reject(err);
            });
        });
    }

}
module.exports = LonginMessage.getInstance(/*LonginMessage*/);