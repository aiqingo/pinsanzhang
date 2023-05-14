import { _decorator, Button, Component, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PSZ_SceneMgr')
export class PSZ_SceneMgr extends Component {

    @property(Label)
    roomID:Label = null;
    //局数
    @property(Label)
    gameCount:Label = null;

    @property(Node)
    seatList:Node[] = [];
    
    @property(Node)
    cardList:Node[] = [];

    @property(Prefab)
    headNodeprefab:Prefab = null;
    //准备node
    @property(Node)
    readyBtn:Node = null;
    //比牌node
    @property(Node)
    compareNode:Node = null;
    //弃牌node
    @property(Node)
    abandonNode:Node = null;

    QIPAI = "qipai";
    ZHUNBEIIMAGE = "ready_ok";
    LIXIAN = "offline";

    //牌的路径
    PAIDELUJING = "img/games/PSZ/card/";
    //类似后缀
    HOUZHUI = "/spriteFrame";
    //牌的缩放
    CARDSHUOFANG = 0.65;
    //第一张牌
    card0 = "card0";
    card1 = "card1";
    card2 = "card2";
    //牌的图片载体
    PAIDETUPIAN = "ddzBack";


    //房间内多少人
    roomPlayerNum:number = 0;
    
    @property(Prefab)
    cardNodeprefab:Prefab = null;
    //当前房间角色头像gameobgect
    private instantiateHeadNode:Node[] = [] ;
    //当前房间牌gameobgect
    private instantiateCardNode:Node[] = [] ;

    start() {
        this._init();
      
    }

 

    update(deltaTime: number) {
        
    }
    private _init()
    {
        globalThis._eventTarget.on("request_room_info",this.onRequestRoomInfo,this);
        globalThis._eventTarget.on("sync_all_player_info",this.onSyncAllPlayerInfo,this);
        globalThis._eventTarget.on("sync_all_player_score",this.onSyncAllPlayerScore,this);
        globalThis._eventTarget.on("sync_all_player_abandon",this.onSyncAllPlayerAbandon,this);
        globalThis._eventTarget.on("sync_all_player_win",this.onSyncAllPlayerWin,this);
        globalThis._eventTarget.on("sync_all_player_ready_state",this.onSyncAllPlayerReadyState,this);
        globalThis._eventTarget.on("start_game",this.onStartGame,this);
        globalThis._eventTarget.on("sync_game_num",this.onUpdateCurrent,this);

    }
  

    public onRequestRoomInfo(data)
    {
        if(data.current_numbers === null)
        {
            data.current_numbers = 0;
        }
        this.roomID.string = data.room_id;
        this.gameCount.string = data.current_numbers + "/" + data.game_numbers;
        this.SetNodeActive(this.abandonNode,false);
        this.SetNodeActive(this.compareNode,false);
    }
    //控制显示隐藏
    SetNodeActive(noed:Node,isshow:boolean)
    {
        noed.active = isshow;
     
    }
    public onSyncAllPlayerInfo(data)
    {

        for (let i = 0; i < this.seatList.length; i++) {
            this.seatList[i].active = false;
        }

        console.log("更新玩家信息");
        console.log(data);
        let mySeataIndex;
        for (let i = 0; i < data.length; i++) {
            let playerInfo = data[i];
            if(playerInfo.user_id==globalThis._userInfo.user_id)
            {
                mySeataIndex = playerInfo.user_seatIndex;
                globalThis._userInfo.SeataIndex = playerInfo.user_seatIndex;
            }
        }
        this.instantiateHeadNode.forEach(element => {
            element.destroy();
        });
      
        for (let i = 0; i < data.length; i++) {
            let playerInfo = data[i];
            let index = this.getLocalIndex(playerInfo.user_seatIndex,mySeataIndex,6)
            switch (index) {
                case  0:
                    this.updataUserInfo(0,playerInfo)
                    this.seatList[0].active = true;
                        this.updateOK(0,data[i].user_ready);
                    break;
                case  1:
                    this.updataUserInfo(1,playerInfo)
                    this.seatList[1].active = true;
                    if(data[i].user_ready == true)
                        this.updateOK(1,data[i].user_ready);
                    break;
                case  2:
                    this.updataUserInfo(2,playerInfo)
                    this.seatList[2].active = true;
                        this.updateOK(2,data[i].user_ready);
                    break;
                case  3:
                    this.updataUserInfo(3,playerInfo)
                    this.seatList[3].active = true;
                        this.updateOK(3,data[i].user_ready);
                    break;
                case  4:
                    this.updataUserInfo(4,playerInfo)
                    this.seatList[4].active = true;
                        this.updateOK(4,data[i].user_ready);
                    break;
                case  5:
                    this.updataUserInfo(5,playerInfo)
                    this.seatList[5].active = true;
                        this.updateOK(5,data[i].user_ready);
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
        //创建玩家头像
        let headNode = instantiate(this.headNodeprefab)
        this.instantiateHeadNode[seatIndex] = headNode;
        seatNode.addChild(headNode);
        let nameLabel = headNode.getChildByName("touxiangyuanjiao").getChildByName("NameLabel").getComponent(Label);
        nameLabel.string = userData.user_name;
        this.GengXinFenShu(seatIndex,userData.user_score)
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
        //用room里面的准备方法处理需要打开
        // globalThis._PSZClientMgr._sendMessage("ready_ok",{userID:globalThis._userInfo.user_id,roomID:globalThis._userInfo.room_id})
        //这是用服务器player里面的方法处理
        globalThis._PSZClientMgr._sendMessage("ready_ok",{userID:globalThis._userInfo.user_id})
    
    }
    //弃牌
    onAbandon()
    {
        let lcaolnode = this.instantiateCardNode[0].getChildByName(this.QIPAI);
        this.SetNodeActive(lcaolnode,true);

        //弃牌后关闭按钮点击功能
        this.compareNode.getComponent(Button).interactable = false;
        this.abandonNode.getComponent(Button).interactable = false;

        globalThis._PSZClientMgr._sendMessage("abandon",{userID:globalThis._userInfo.user_id})
    }

    //比牌
    onCompare()
    {
        
    }


    onSyncAllPlayerReadyState(data)
    {
        console.log("<玩家准备的数据---->",data)
        for (let i = 0; i < data.length; i++) {
            let playerInfo = data[i];
            let index = this.getLocalIndex(playerInfo.user_seatIndex,globalThis._userInfo.SeataIndex,6)
            this.instantiateHeadNode[index].getChildByName(this.ZHUNBEIIMAGE).active = data[i].ready_state;
     
        }
    }
    //更新以准备玩家OK
    updateOK(seatIndex,ready_state)
    {
        this.instantiateHeadNode[seatIndex].getChildByName(this.ZHUNBEIIMAGE).active = ready_state;
    }

    onStartGame(data)
    {
        console.log("<游戏开始------>",data)
        let len = this.instantiateHeadNode.length
        for( let i = 0; i <this.instantiateHeadNode.length; i ++ )
        {
           if (this.instantiateHeadNode[i] != undefined)
           {
                this.instantiateHeadNode[i].getChildByName(this.ZHUNBEIIMAGE).active = false;
                //创建玩家的牌
                let cardNode = instantiate(this.cardNodeprefab)
                cardNode.getChildByName(this.QIPAI).active = false;
                // cardNode.active = false
                this.instantiateCardNode[i] = cardNode;
                this.cardList[i].addChild(cardNode);
           }
        }
        //显示一组牌面
        this.XianShiPaiMian(this.card0,data.carde0);
        this.XianShiPaiMian(this.card1,data.carde1);
        this.XianShiPaiMian(this.card2,data.carde2);
        //显示弃牌按钮和比牌按钮
        this.SetNodeActive(this.abandonNode,true);
        this.SetNodeActive(this.compareNode,true);
    }

    // onPlayOne(data)
    // {
    //     console.log("<房间内只有一人无法开始了游戏------>",data)

    // }

    //显示牌面
    XianShiPaiMian(name:string,sum)
    {
        resources.load(this.PAIDELUJING+sum+this.HOUZHUI,SpriteFrame,(err,sprite)=>
        {
            this.instantiateCardNode[0].getChildByName(name).getChildByName(this.PAIDETUPIAN).getComponent(Sprite).spriteFrame = sprite
            this.instantiateCardNode[0].getChildByName(name).getChildByName(this.PAIDETUPIAN).scale = new Vec3(this.CARDSHUOFANG, this.CARDSHUOFANG, this.CARDSHUOFANG)
        })
    }
    //更新分数
    GengXinFenShu(index,scoresum)
    {
        let scoreLabel = this.instantiateHeadNode[index].getChildByName("touxiangyuanjiao").getChildByName("scoreLabel").getComponent(Label);
        scoreLabel.string = scoresum;
    }

    onSyncAllPlayerScore(dataInfo)
    {
        console.log("进入开始前更新所有玩家分数",dataInfo);
        for (let i = 0; i < dataInfo.length; i++) {
            let   data = dataInfo[i]
            let index = this.getLocalIndex(data.user_seatIndex,globalThis._userInfo.SeataIndex,6);
            console.log("index",index)
            this.GengXinFenShu(index,data.user_score);
        }

    }


    onSyncAllPlayerAbandon(dataInfo)
    {
        console.log("同步弃牌",dataInfo);
        for (let i = 0; i < dataInfo.length; i++) {
            let   data = dataInfo[i]
            let index = this.getLocalIndex(data.user_seatIndex,globalThis._userInfo.SeataIndex,6);
            let cardeNode = this.instantiateCardNode[index].getChildByName(this.QIPAI);
            this.SetNodeActive(cardeNode,data.user_isAbandon);
        }

    }



    onSyncAllPlayerWin(data)
    {
        console.log("<PSZ------结束>",data)
    }

    onUpdateCurrent(data)
    {
        this.gameCount.string = data.current_numbers + "/" + data.game_numbers;
    }





}






