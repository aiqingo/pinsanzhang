import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PSZ_Client')
export class PSZ_Client extends Component {
    private _ws:any = null;

    start() {
        this._init();
       
    }

    update(deltaTime: number) {
        
    }

    private _init()
    {
        globalThis._PSZClientMgr=this;
        this._connectServer();
    }

    private _connectServer()
    { 
        const ws = new WebSocket("ws://127.0.0.1:4000"); 
        this._ws = ws;

        ws.onopen = ()=>{
            console.log("<PSZ---->连接服务端成功");
            // ws.send("你好服务端");    
            this.requestRoomInfo();
        }
        ws.onmessage = (result)=>{
            console.log("<PSZ---->服务端发来是消息",result);
            let message = JSON.parse(result.data)
            let type = message.type;
            let data = message.data
            this.responseServerMessage(type,data);
        }
        ws.onclose = ()=>{
            console.log("<PSZ---->与服务器断开连接");
        }
        ws.onerror = (err)=>{
            console.log("<PSZ---->网络连接出错",err);
        }
    }

    //相应服务器消息
    public responseServerMessage(type,data)
    {
        console.log("<PSZ--->服务端发送消息类型：",type,"数据：",data);
        globalThis._eventTarget.emit(type,data);
    }

    private _sendMessage(_type,_data)
    {
        let sendData ={
            type : _type,
            data : _data,
        }
        this._ws.send(JSON.stringify(sendData));
    } 

    public requestRoomInfo()
    {
        let data = {
            roomID:globalThis._userInfo.room_id,
            userID:globalThis._userInfo.user_id,
        }
        this._sendMessage("request_room_info",data);

    }



}


