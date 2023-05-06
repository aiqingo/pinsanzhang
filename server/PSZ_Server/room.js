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
        if(this.isStartGame())
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

    syncStartGame()
    {

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
