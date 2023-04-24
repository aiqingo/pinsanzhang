import { _decorator, Component, log, Node,EventTarget } from 'cc';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();
globalThis._eventTarget = eventTarget;

@ccclass('loginClient')
export class loginClient extends Component {

    private _ws:any = null;

    start() {
        this._init();
       
    }

    update(deltaTime: number) {
        
    }

    private _init()
    {
        globalThis._loginClientMgr=this;
        this._connectServer();
    }

    private _connectServer()
    { 
        const ws = new WebSocket("ws://127.0.0.1:3000"); 
        this._ws = ws;

        ws.onopen = ()=>{
            console.log("<login---->连接服务端成功");
            // ws.send("你好服务端");    
        }
        ws.onmessage = (result)=>{
            console.log("<login---->服务端发来是消息",result);
            let message = JSON.parse(result.data)
            let type = message.type;
            let data = message.data
            this.responseServerMessage(type,data);
        }
        ws.onclose = ()=>{
            console.log("<login---->与服务器断开连接");
        }
        ws.onerror = (err)=>{
            console.log("<login---->网络连接出错",err);
        }
    }

    //相应服务器消息
    public responseServerMessage(type,data)
    {
        console.log("<login---->服务端发送消息类型：",type,"数据：",data);
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


}


