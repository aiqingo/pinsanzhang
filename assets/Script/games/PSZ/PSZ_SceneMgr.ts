import { _decorator, Button, Component, instantiate, Label, math, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
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
    //加注
    @property(Node)
    addGoldButton:Node = null;
    //跟注
    @property(Node)
    heelGoldButton:Node = null;
    //下注
    @property(Node)
    downGoldButton:Node = null;
    
    //倒计时
    @property(Node)
    timeNode:Node = null;
    //倒计时字体
    @property(Label)
    timeLabel:Label = null;
    //下注界面
    @property(Node)
    downNode:Node = null;
    //加注界面
    @property(Node)
    addNode:Node = null;



    //弃牌image
    QIPAI = "qipai";
    //准备image
    ZHUNBEIIMAGE = "ready_ok";
    //离线image
    LIXIAN = "offline";
    //所下分数
    SUOXIAFENSHU = "currentScoreLabel";
    //所下分数父物体
    SUOXIAFENSHUFUWUTI = "bg_xiazhu";
    //玩家分数
    WANJIAFENSHU = "scoreLabel";
    //玩家分数父物体
    WANJIAFENSHUFUWUTI = "touxiangyuanjiao";

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
    //是否可以倒计时
    isTime = false;
    //倒计时变量
    Time = 0;
    //房间内多少人
    roomPlayerNum:number = 0;
    //下注分数
    downScore:number = 0;


    //当前最小注数

    minAddScore = 0;

    @property(Prefab)
    cardNodeprefab:Prefab = null;
    //当前房间角色头像gameobgect
    private instantiateHeadNode:Node[] = [] ;
    //当前房间牌gameobgect
    private instantiateCardNode:Node[] = [] ;

    start() {
        this._init();
        this.SetNodeActive(this.abandonNode,false);
        this.SetNodeActive(this.compareNode,false);
        this.SetNodeActive(this.addGoldButton,false);
        this.SetNodeActive(this.heelGoldButton,false);
        this.SetNodeActive(this.downGoldButton,false);
        this.SetNodeActive(this.timeNode,false);
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
        globalThis._eventTarget.on("show_ui",this.onShowUI,this);
        globalThis._eventTarget.on("min_add_score",this.onMinAddScore,this);

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
        let nameLabel = headNode.getChildByName(this.WANJIAFENSHUFUWUTI).getChildByName("NameLabel").getComponent(Label);
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
        //显示弃牌按钮
        this.SetNodeActive(this.abandonNode,true);
        // this.SetNodeActive(this.compareNode,true);
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
        let scoreLabel = this.instantiateHeadNode[index].getChildByName(this.WANJIAFENSHUFUWUTI).getChildByName(this.WANJIAFENSHU).getComponent(Label);
        scoreLabel.string = scoresum;
    }
    //更新所下分数
    GengXinSuoXiaFenShu(index,scoresum)
    {
        let scoreLabel = this.instantiateHeadNode[index].getChildByName(this.SUOXIAFENSHUFUWUTI).getChildByName(this.SUOXIAFENSHU).getComponent(Label);
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
            this.GengXinSuoXiaFenShu(index,data.user_playerDownScore);
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


    //结束
    onSyncAllPlayerWin(data)
    {
        console.log("<PSZ------结束>",data)
    }
    //更新第几局
    onUpdateCurrent(data)
    {
        this.gameCount.string = data.current_numbers + "/" + data.game_numbers;
    }

    //加注按钮事件
    onAddGoldClick()
    {
        this.SetNodeActive(this.addNode,true);
    }
    //加注
    onAddScoreClose(target,arg)
    {
        this.downScore = Number(arg);
        console.log("下注的分数>>>>>>>>"+this.downScore)
        // this.SetNodeActive(this.downNode,false);
    }
    //加注最小值
    onMinAddScore(data)
    {
        this.minAddScore = data;
    }

    onAddScoreNodeClose()
    {
        this.SetNodeActive(this.downNode,false);
    }
    //加注面板确定
    onAddScoreEnter()
    {
        if(this.minAddScore < this.downScore )
        {
            globalThis._PSZClientMgr._sendMessage("add_score",{data:this.downScore})
        }
        else
        {
            console.log("<PSZ------当前加注分数比上家小，无法加注>")
        }
    }
    //加注关闭
    onAddNodeClose()
    {
        this.SetNodeActive(this.downNode,false);
    }

    //跟注按钮事件
    onHeelGoldClick()
    {
        globalThis._PSZClientMgr._sendMessage("heel_score",{userID:globalThis._userInfo.user_id})
    }

    //下注按钮事件
    onDownGoldClick()
    {
        this.SetNodeActive(this.downNode,true);
    }

    //关闭
    onDownNodeClose()
    {
        this.SetNodeActive(this.downNode,false);
    }
    //点击分数
    onDownScoreClose(target,arg)
    {
        this.downScore = Number(arg);
        console.log("下注的分数>>>>>>>>"+this.downScore)
        // this.SetNodeActive(this.downNode,false);
    }
    //下注面板确定
    onDownEnter()
    {
        globalThis._PSZClientMgr._sendMessage("down_score",{data:this.downScore})
    }


    //显示玩家可控制的ui
    onShowUI(data)
    {
        this.Time = data.time
        this.isTime = true;

        this.SetNodeActive(this.timeNode,true);
        if(data.isOne)
        {
            //下注
            this.SetNodeActive(this.downGoldButton,true);
        }
        else
        { 
            // //下注
            // this.SetNodeActive(this.downGoldButton,true);
            //跟注
            this.SetNodeActive(this.heelGoldButton,true);
            //加注
            this.SetNodeActive(this.addGoldButton,true);
            //比牌
            this.SetNodeActive(this.compareNode,true);
        }
     
      
    }

  
    

    update(dt: number) {

        if(this.isTime)
        {
            if(this.Time > 0 )
            {
                this.Time -= dt;
            }

            this.timeLabel.string = Math.floor(this.Time)+"";

            if(this.Time <= 0 )
            {
                this.isTime = false;
                //倒计时结束自动下注
                this.SetNodeActive(this.timeNode,false);
                //下注
                this.SetNodeActive(this.downGoldButton,false);
                //跟注
                this.SetNodeActive(this.heelGoldButton,false);
                //加注
                this.SetNodeActive(this.addGoldButton,false);
                //比牌
                this.SetNodeActive(this.compareNode,true);
            }

        } 
      
        
    }
}






