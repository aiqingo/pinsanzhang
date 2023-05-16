let player = require("./player");
class Room{

    constructor(roomData,client) {
        console.log("创建房间参数为",roomData);
        this.roomID = roomData.room_id;
        this.createID = roomData.create_user_id;
        this.gameNumbers = roomData.game_numbers;
        this.current_numbers = roomData.current_numbers;
        this.jieSanType = roomData.jie_san;
        console.log("玩家id= ",this.createID);
        console.log("房间id= ",this.roomID);
        this.seatIndexList = [0,1,2,3,4,5];
        //当前房间内的玩家
        this.playerList = [];
        //当前房间内的牌堆
        this.roomCard = undefined;
        //当前房间的分数
        this.roomscore = 0;
        //当前操作的玩家
        this.leader = 0;
        //延迟存储的
        this.timeTimeout = undefined;
        //第一轮吗
        this.isOne = true;
        //延迟多少秒
        this.waitTime = 30;
        //跟注的分数
        this.heelscore = 0;
    }


    //进入房间的的玩家保存到本地房间信息
    async addPlayer(UserID, client) {
        let result =  await global.PSZServerMgr.PSZDbMgr.getUserInfo(UserID);
        if (result.length === 0)
        {

        }
        else
        {
            let tmpplayer = new player(result[0],client);
            tmpplayer.room = this;
            tmpplayer.seatIndex = (this.seatIndexList.splice(0,1))[0];
            global.PSZServerMgr.PSZDbMgr.updataRoomInfo(this.roomID,this.playerList);

            this.playerList.push(tmpplayer);
            this.syncPlayerInfo();
        }
    }
    // setPlayerReady(userID,client)
    // {
    //     console.log(this.playerList);
    //     // this.playerList[] = true;
    //     // this.syncPlayerInfo();
    // }

    //同步进去房间的玩家信息
    syncPlayerInfo()
    {
        let playerInfoList = [];
        for (let i = 0 ; i<this.playerList.length;i++)
        {
            let playerInfo = this.playerList[i].getPlayerInfo();
            playerInfoList.push(playerInfo);
        }
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            global.PSZServerMgr.PSZServerMgr.sendMessage("sync_all_player_info",playerInfoList,player.client);
        }
    }


    getRoomInfo()
    {
        return {
            room_id:this.roomID,
            create_id: this.createID,
            game_numbers:this.gameNumbers,
            current_numbers:this.current_numbers,
        }
    }

    //player脚本调用的准备
    StartGameOrSyncReadyMessage(player)
    {
        player.readyState = true;
        let isPlay = this.isStartGame()
        let index = this.isStartGameIndex()
        if(isPlay == true && index >=2)
        {
            this.syncStartGame();
        }
        else {
            this.syncPlayerReadyOkMessage(player);
        }
    }


    //同步玩家弃牌
    onAbandon(player)
    {
        player.isAbandon = true;
        let playerInfoList = [];
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let playerInfo = this.playerList[i].getPlayerAbandon();
            playerInfoList.push(playerInfo);
        }
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            global.PSZServerMgr.PSZServerMgr.sendMessage("sync_all_player_abandon",playerInfoList,player.client);
        }
        this.roomWin()
    }


    //弃牌胜利
    roomWin()
    {
        let index = 0;
        let noAbandon = undefined;
        for (let i = 0; i < this.playerList.length; i++) {

            if (this.playerList[i].getIsAbandon())
            {
                index++;
            }
            else
            {
                console.log("进入为弃牌的if")
                noAbandon = this.playerList[i]
            }
        }
        console.log("房间内弃牌的",index);
        console.log("房间内所有人",this.playerList.length-1);
        console.log("房间内noAbandon",noAbandon);

        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            if (index >= this.playerList.length-1 && noAbandon)
            {
                global.PSZServerMgr.PSZServerMgr.sendMessage("sync_all_player_win",{data:"结束"},player.client);
                //给胜利者加分
                noAbandon.score += this.roomscore;
                this.roomscore = 0;
                //同步给所有人
                this.sendScore();
                this.current_numbers += 1;
                //给所有人发送当前是第几局
                this.sendGameNum()
                //去掉定时器
                clearTimeout(this.timeTimeout);


            }
        }
    }


    //同步玩家准备状态
    syncPlayerReadyOkMessage(player)
    {
        //准备是同步消息
        // console.log("临时打印",this.playerList);
        // player.readyState = true;
        let playerInfoList = [];
        for (let i = 0 ; i<this.playerList.length;i++)
        {
            let playerReadyState = this.playerList[i].getPlayerReadyState();
            playerInfoList.push(playerReadyState);
        }
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            global.PSZServerMgr.PSZServerMgr.sendMessage("sync_all_player_ready_state",playerInfoList,player.client);
        }

        // this.allReadyOk();
    }

    //自己加 的处理玩家准备逻辑
    // 通过uid获取用户信息进行修改，在同步给其他玩家
    ReadyOk(data)
    {
        let player = this.getUserPlayer(data.userID)
        player.readyState = true;
        this.syncPlayerReadyOkMessage(player)
    }

    //获取用户数据方法
    getUserPlayer(uid)
    {

        for (let i = 0 ; i<this.playerList.length;i++)
        {
            let player = this.playerList[i];
            if(player.userID == uid)
            {
                return player;
            }
        }
    }


    //发牌
    SendCard()
    {
        let carde0 = this.roomCard.shift();
        let carde1 = this.roomCard.shift();
        let carde2 = this.roomCard.shift();

        let data =
        {
            carde0:carde0,
            carde1:carde1,
            carde2:carde2,
        }
        console.log("<房间内的牌》》",this.roomCard)
        return data
    }

    洗牌
    Shuffle()
    {
        //100 红方块
        /*
            103 方块3
            104 方块4
            105 方块5
            106 方块6
            107 方块7
            108 方块8
            109 方块9
            110 方块10
            111 方块J
            112 方块Q
            113 方块K
            114 方块A
        */
        //200 黑梅花
        //300 红桃
        //400 黑桃
        let  pokers = [
            102,103,104,105,106,107,108,109,110,111,112,113,114,
            202,203,204,205,206,207,208,209,210,211,212,213,214,
            302,303,304,305,306,307,308,309,310,311,312,313,314,
            402,403,404,405,406,407,408,409,410,411,412,413,414
        ];

        let  arr = this.Random(this.Random(this.Random(pokers)));

        console.log("<随机牌----->",arr)

        return  arr;

    }

    //随机数组
    Random(arr)
    {
        arr.sort(
            function ()
            {
                if (Math.random()<0.5) {
                    return -1;
                }
                return 1;
            }
        )
        return arr;
    }



    //是否开始游戏
    isStartGame()
    {
        let res = true;
        this.playerList.forEach((player)=>{
            if (!player.readyState)
            {
                res = false;
            }
        })
        return res;
    }

    //一人时无法开始
    isStartGameIndex()
    {
        let index = 0;
        this.playerList.forEach((player)=>{
            if (player.readyState)
            {
                index++;
            }
        })
        return index;
    }

    /*  1.全部准备了
        2.随机牌型
        3.本房间储存当前随机的牌型
        4.扣除所有玩家入场分数
        5.把扣除的玩家分数存到本房间分数内，给到胜利者
        6.给所有玩家发牌

        */
    syncStartGame()
    {
        //打乱牌堆
        let cardarr =  this.Shuffle();
        //存储当前方房间的牌
        this.roomCard = cardarr;
        //同步分数
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            this.playerList[i].score -= 10;
        }
        this.sendScore()

        //给每个玩家发牌和发送和开始消息
        this.playerList.forEach((player)=>{
            let data = this.SendCard();
            //保存每个玩家的牌
            player.myCarde = data;
            //保存入场条件   每个人十分，结束后归胜利者所有
            this.roomscore += 10;
            global.PSZServerMgr.PSZServerMgr.sendMessage("start_game",data,player.client);
        })

        // this.playerNum = this.playerList.length;
        this.leader = this.onRandomLeader();
        this.sendPlayerShowUI();
        this.onTimeout();
        this.isOne = false;
        console.log("<发牌结束后的牌堆》》",this.roomCard)
    }


    //给玩家发送消息显示按钮

    //定时器
    onTimeout()
    {
        // this.timeTimeout = setTimeout(this.sendPlayerShowUI,3000);

        this.timeTimeout = setInterval(() => {
            console.log("进入是哪位玩家操作的方法>>>>>>>");
            let data
            if (this.isOne)
            {
                data =
                    {
                        isOne : true,
                        time : 30,
                    }
            }
            else
            {
                data =
                    {
                        isOne : false,
                        time : 30,
                    }
            }

            console.log("定时30s房间内的人数>>>>>>>>>",this.playerList.length)
            console.log("定时30s随机的庄家>>>>>>>>",this.leader)
            // console.log(this.playerList)

            for(let i = 0 ;i < this.playerList.length;i++)

            {
                if(i == this.leader)
                {
                    let player = this.playerList[i];
                    if (player.isAbandon == true)
                    {
                        // global.PSZServerMgr.PSZServerMgr.sendMessage("show_ui",data,player.client);
                        this.leader += 1;
                        this.waitTime = 0;
                        if(this.leader == this.playerList.length)
                        {
                            this.leader = 0;
                        }
                        break;
                    }
                    else
                    {
                        global.PSZServerMgr.PSZServerMgr.sendMessage("show_ui",data,player.client);
                        this.leader += 1;
                        this.waitTime = 30000;
                        if(this.leader == this.playerList.length)
                        {
                            this.leader = 0;
                        }
                        break;
                    }
                }
            }

            //30s
        },this.waitTime);
        //window.clearTimeout(t1);//去掉定时器

    }
    //第一轮玩家显示ui
    sendPlayerShowUI()
    {
        console.log("进入是哪位玩家操作的方法>>>>>>>")
        let data
        if (this.isOne)
        {
            data =
                {
                    isOne : true,
                    time : 30,
                }
        }
        else
        {
            data =
                {
                    isOne : false,
                    time : 30,
                }
        }

        // console.log("房间内的人数>>>>>>>>>",this.playerList.length)
        console.log("随机的庄家>>>>>>>>>",this.leader)
        // console.log(this.playerList)

        for(let i = 0 ;i < this.playerList.length;i++)
        {
            if(i == this.leader)
            {
                let player = this.playerList[i];
                if (player.isAbandon == true)
                {
                    // global.PSZServerMgr.PSZServerMgr.sendMessage("show_ui",data,player.client);
                    this.leader += 1;
                    this.waitTime = 0;
                    if(this.leader == this.playerList.length)
                    {
                        this.leader = 0;
                    }
                    break;
                }
                else
                {
                    global.PSZServerMgr.PSZServerMgr.sendMessage("show_ui",data,player.client);
                    this.leader += 1;
                    this.waitTime = 30000;
                    if(this.leader == this.playerList.length)
                    {
                        this.leader = 0;
                    }
                    break;
                }
            }
        }

    }

    //下注第一位玩家点击下注
    onDownScore(data,player)
    {
        console.log("下注分数>>>>>>>>>>>>>>>>>>>>",data)
        this.heelscore = data.data;
        this.roomscore += data.data;
        player.down_score += data.data;
        player.score -= data.data;
        console.log("当前玩家所下分数>>>>>>>>>>>>",player.down_score)
        this.onMinAddScore();
        this.sendScore();
        console.log("房间内的分数>>>>>>>>>>>>>>>>>>>>>>>>",this.roomscore)
    }
    //跟注的
    onHeelScore(player)
    {
        console.log("跟注分数>>>>>>>>>>>>>>>>>>>>")
        this.roomscore += this.heelscore;
        player.down_score += this.heelscore;
        player.score -= this.heelscore;
        this.sendScore();
        console.log("当前玩家所下分数>>>>>>>>>>>>",player.down_score)
        console.log("房间内的分数>>>>>>>>>>>>>>>>>>>>>>>>",this.roomscore)
    }
    onAddScore(data,player)
    {
        console.log("加注分数>>>>>>>>>>>>>>>>>>>>",data)
        this.heelscore = data.data;
        this.roomscore += data.data;
        player.down_score += data.data;
        player.score -= data.data;
        console.log("当前玩家所下分数>>>>>>>>>>>>",player.down_score)
        this.onMinAddScore();
        this.sendScore();
        console.log("房间内的分数>>>>>>>>>>>>>>>>>>>>>>>>",this.roomscore)
    }


    //加注最低分同步
    onMinAddScore()
    {
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            global.PSZServerMgr.PSZServerMgr.sendMessage("min_add_score",this.heelscore,player.client);
        }
    }





    //随机庄家
    onRandomLeader() {
        // let random =  Math.floor(Math.random() * (0 - this.playerList.length + 1) + 1);
        let random = this.getRandomPlus(0,this.playerList.length-1);
        console.log("随机的数是>>>>>>>>",random)
        return random;
    }
    //   获得两个数之间的随机整数(可包含最大值max)
    getRandomPlus(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    //同步分数
    sendScore()
    {
        let playerInfoList = [];
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let playerInfo = this.playerList[i].getPlayerScore();
            playerInfoList.push(playerInfo);
        }
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            global.PSZServerMgr.PSZServerMgr.sendMessage("sync_all_player_score",playerInfoList,player.client);
        }

    }
    //同步游戏局数
    sendGameNum()
    {
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            let player = this.playerList[i];
            let data =
                {
                    game_numbers:this.gameNumbers,
                    current_numbers:this.current_numbers,
                }
            global.PSZServerMgr.PSZServerMgr.sendMessage("sync_game_num",data,player.client);
        }

    }


    allReadyOk()
    {
        let index = 0;
        for (let i = 0 ; i<this.playerList.length;i++)
        {
            if (this.playerList[i].getIsReadyOK())
            {
                index++;
            }
        }
        console.log("准备的人数",index);
        console.log("房间内所有人",this.playerList.length);
        for(let i = 0 ;i < this.playerList.length;i++)
        {
            if (index>=this.playerList.length)
            {
                let player = this.playerList[i];
                global.PSZServerMgr.PSZServerMgr.sendMessage("game_play_go",{data:"游戏开始"},player.client);
            }
        }

    }





}


module.exports = Room;

