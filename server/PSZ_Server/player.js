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
    }

    getPlayerInfo()
    {
        return {
            user_id:this.userID,
            user_name:this.userName,
            user_head_url: this.userHeadUrl,
            user_seatIndex :this.seatIndex,
            user_ready:this.readyState,
        }
    }


    getPlayerReadyState()
    {
        return {
            user_seatIndex:this.seatIndex,
            ready_state:this.readyState,

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
                default:
                    break;

            }
        })
    }
    getIsReadyOK()
    {
        return this.readyState;
    }




}
module.exports = Player;