class Player {
    constructor(playerData,client) {
        this.userID = playerData.user_id;
        this.userName = playerData.user_name;
        this.userHeadUrl = playerData.user_head_user;
        this.userRoomCards = playerData.user_room_cards;
        this.roomID = undefined;
        this.room = undefined;
        this.client = client;
        this.seatIndex = undefined;
        this.readyState = false;
        this.receviedPlayerMessage(this.client)
        this.score = playerData.user_score;
        this.down_score = 0;
        this.myCarde = undefined;
        this.isAbandon = false
    }

    //获取进入房间信息
    getPlayerInfo()
    {
        return {
            user_id:this.userID,
            user_name:this.userName,
            user_head_url: this.userHeadUrl,
            user_seatIndex :this.seatIndex,
            user_ready:this.readyState,
            user_score:this.score,
        }
    }
    //获取分数
    getPlayerScore()
    {
        return {
            user_score:this.score,
            user_seatIndex :this.seatIndex,
            user_playerDownScore : this.down_score,
        }
    }

    //获取准备
    getPlayerReadyState()
    {
        return {
            user_seatIndex:this.seatIndex,
            ready_state:this.readyState,
        }
    }

    //获取弃牌
    getPlayerAbandon()
    {
        return {
            user_seatIndex:this.seatIndex,
            user_isAbandon:this.isAbandon,
        }
    }

    receviedPlayerMessage(client)
    {
        client.on("text",(result)=>{
            console.log("《PlayerInfo---》客户端发来的消息",result);
            let message = JSON.parse(result);

            let type = message.type;
            let data = message.data;

            switch (type) {
                case "ready_ok":
                    this.room.StartGameOrSyncReadyMessage(this);
                    break;
                case "abandon":
                    this.room.onAbandon(this);
                    break;
                case "down_score":
                    this.room.onDownScore(data,this);
                    break;
                case "heel_score":
                    this.room.onHeelScore(this);
                    break;
                case "add_score":
                    this.room.onAddScore(data,this);
                    break;

                default:
                    break;

            }
        })
    }

    getIsReadyOK()
    {
        return this.readyState;
    }

    getIsAbandon()
    {
        return this.isAbandon;
    }


}
module.exports = Player;