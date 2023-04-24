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
}


module.exports = Room;
