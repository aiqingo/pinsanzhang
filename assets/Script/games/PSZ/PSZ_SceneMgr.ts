import { _decorator, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PSZ_SceneMgr')
export class PSZ_SceneMgr extends Component {

    @property(Label)
    roomID:Label = null;
    @property(Label)
    gameCount:Label = null;

    @property(Node)
    seatList:Node[] = [];
    
    @property(Node)
    cardList:Node[] = [];

    @property(Prefab)
    headNodeprefab:Prefab = null;

    @property(Node)
    readyBtn:Node = null;


    ZHUNBEIIMAGE = "ready_ok";
    LIXIAN = "offline";

    
    @property(Prefab)
    cardNodeprefab:Prefab = null;
    //当前房间角色头像gameobgect
    private instantiateHeadNode:Node[] = [] 
    //当前房间牌gameobgect
    private instantiateCardNode:Node[] = [] 

    start() {
        this._init();
    }

    update(deltaTime: number) {
        
    }
    private _init()
    {
        globalThis._eventTarget.on("request_room_info",this.onRequestRoomInfo,this);
        globalThis._eventTarget.on("sync_all_player_info",this.onSyncAllPlayerInfo,this);
        
    }

    public onRequestRoomInfo(data)
    {
        if(data.current_numbers === null)
        {
            data.current_numbers = 0;
        }
        this.roomID.string = data.room_id;
        this.gameCount.string = data.current_numbers + "/" + data.game_numbers;
    }

    public onSyncAllPlayerInfo(data)
    {

        for (let i = 0; i < this.seatList.length; i++) {
            this.seatList[i].active = false;
        }

        console.log("更新玩家信息");
        console.log(data);
        let mySeataIndex;
        let otherSeatIndex;
        for (let i = 0; i < data.length; i++) {
            let playerInfo = data[i];
            if(playerInfo.user_id==globalThis._userInfo.user_id)
            {
                mySeataIndex = playerInfo.user_seatIndex;
            }
        }
        for (let i = 0; i < data.length; i++) {
            let playerInfo = data[i];
            let index = this.getLocalIndex(playerInfo.user_seatIndex,mySeataIndex,6)
            switch (index) {
                case  0:
                    this.updataUserInfo(0,playerInfo)
                    this.seatList[0].active = true;
                    break;
                case  1:
                    this.updataUserInfo(1,playerInfo)
                    this.seatList[1].active = true;
                    break;
                case  2:
                    this.updataUserInfo(2,playerInfo)
                    this.seatList[2].active = true;
                    break;
                case  3:
                    this.updataUserInfo(3,playerInfo)
                    this.seatList[3].active = true;
                    break;
                case  4:
                    this.updataUserInfo(4,playerInfo)
                    this.seatList[4].active = true;
                    break;
                case  5:
                    this.updataUserInfo(5,playerInfo)
                    this.seatList[5].active = true;
                    break;
                default:
                    console.log("座位号计算错误")
                    break;
            }
        }
    }

    updataUserInfo(seatIndex,userData)
    {
        let seatNode = this.seatList[seatIndex];
        // let nameLabel = seatNode.getChildByName("headNode").getChildByName("touxiangyuanjiao").getChildByName("NameLabel").getComponent(Label);
        // nameLabel.string = userData.user_name;
        // let headNode = seatNode.getChildByName("headNode");
        let headNode = instantiate(this.headNodeprefab)
        this.instantiateHeadNode[seatIndex] = headNode;
        seatNode.addChild(headNode);
        let nameLabel = headNode.getChildByName("touxiangyuanjiao").getChildByName("NameLabel").getComponent(Label);
        nameLabel.string = userData.user_name;
        let cardNode = instantiate(this.cardNodeprefab)
        cardNode.active = false
        this.instantiateCardNode[seatIndex] = cardNode;
        this.cardList[seatIndex].addChild(cardNode);
   

    }

    getLocalIndex(otherIndex,thisIndex,playernumbers)
    {
        let ret = (otherIndex-thisIndex + playernumbers)%playernumbers;
        return ret;
    }

    //  准备按钮
    onReadyBynClick()
    {
        this.readyBtn.active = false;
        globalThis._PSZClientMgr._sendMessage("ready_ok",{userID:globalThis._userInfo.user_id})
    }


}

