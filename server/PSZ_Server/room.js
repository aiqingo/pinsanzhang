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
        this.playerList = [];
        this.roomCard = undefined;
    }

    getRoomInfo()
    {

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


    SendCard(player)
    {

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




    isStartGame()
    {
        let res = true;
        let index = 0;
        this.playerList.forEach((player)=>{
            if (!player.readyState)
            {
                res = false;
            }
            else
            {
                index++;
            }

        })
        return res;
    }

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

    syncStartGame()
    {
        let cardarr =  this.Shuffle();
        this.roomCard = cardarr;
        console.log("<房间内的牌》》",this.roomCard)
        this.playerList.forEach((player)=>{
            global.PSZServerMgr.PSZServerMgr.sendMessage("start_game",{data:"开始游戏"},player.client);

        })
        // this.allReadyOk()
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

