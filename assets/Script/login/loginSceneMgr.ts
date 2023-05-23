import { _decorator, Component, director, EditBox, input, instantiate, Label, Node, Prefab,  Sprite, SpriteFrame } from 'cc';
import { MessageData } from '../common/MessageData';
const { ccclass, property } = _decorator;


@ccclass('loginSceneMgr')
export class loginSceneMgr extends Component {

    @property(Node)
    my_EdiyBox:Node = null; 
    @property(Prefab)
    message:Prefab = null; 
    
    start() {
       
        globalThis._eventTarget.on("login",this.onLoginMessage,this);
    }

    update(deltaTime: number) {
        
    }

    /**
     * onLoginBtnClicked
     */
    public onLoginBtnClicked() {
     
        let str = this.my_EdiyBox.getComponent(EditBox).string;
        let senddata;
        switch (str) {
            case "1":
                senddata = 555555;
                break;
            case "2":
                senddata = 666666;
                break;
            case "3":
                senddata = 777777;
                break;
            case "4":
                senddata = 888888;
                break;
            case "5":
                senddata = 999999;
                break;
            default:
                break;
        }
        globalThis._loginClientMgr._sendMessage("login",{id:senddata});
    

    }

    public onLoginMessage(data)
    {
        if(data)
        {
            let message = instantiate(this.message);
            console.log("< MessageData[data.err]>", MessageData[data])
            message.getChildByName("MssageLable").getComponent(Label).string = MessageData[data];
            this.node.addChild(message);
            console.log("暂无当前输入测试账户");
            return;
        }
        console.log("处理玩家登入");
        globalThis._userInfo.room_id = data.room_id;
        globalThis._userInfo.user_head_url = data.user_head_url;
        globalThis._userInfo.user_id = data.user_id;
        globalThis._userInfo.user_name = data.user_name;
        globalThis._userInfo.user_room_cards = data.user_room_cards;

        director.loadScene("HallScene");



    }


}


