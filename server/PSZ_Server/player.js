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
        this.ready = undefined;
    }

    getPlayerInfo()
    {
        return {
            user_id:this.userID,
            user_name:this.userName,
            user_head_url: this.userHeadUrl,
            user_seatIndex :this.seatIndex,
            user_ready:this.ready,
        }
    }


}
module.exports = Player;