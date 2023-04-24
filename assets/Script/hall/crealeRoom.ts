import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('crealeRoom')
export class crealeRoom extends Component {

    public _gamNumbers; //游戏局数
    public _isBanShuJieSan;

    start() {
        this._gamNumbers = 10;
        this._isBanShuJieSan = false;
    }

    update(deltaTime: number) {
        
    }


    onColseBtnClicked()
    {
        // this.node.destroy();
        this.node.active = false;
    }

    onCreateBtnClicked()
    {
        console.log("创建按钮被点击了");
        let data = {
            createUserId:globalThis._userInfo.user_id,
            gamNumbers:this._gamNumbers,
            isBanShuJieSan:this._isBanShuJieSan,
        }
        console.log("《crealeRoom---》创建房间信息",data)
        globalThis._hallClientMgr._sendMessage("create_room",data);
    }

    onGameNumbersBtnClikect(target,arg)
    {
        // this._gamNumbers = arg;
        switch (arg) {
            case "10":
                this._gamNumbers = 10;
                break;
            case "20":
                this._gamNumbers = 20;
                break;
            default:
                break;
        }
    }

    onIsQuanPiaoBtnCliked()
    {
        if( this._isBanShuJieSan)
        {
            this._isBanShuJieSan = false;
        }
        else
        {
            this._isBanShuJieSan = true;
        }
    }

}


