import { _decorator, Component, director, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loginSceneMgr')
export class loginSceneMgr extends Component {

    @property(Node)
    my_EdiyBox:Node = null; 

    
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
            default:
                break;
        }
        globalThis._loginClientMgr._sendMessage("login",{id:senddata});
        console.log("登入了点击按钮")
    }

    public onLoginMessage(data)
    {
        if(data.err)
        {
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


