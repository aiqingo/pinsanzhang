
let room = require("./room");


class RoomMgr{
    static getInstance()
    {
        if (!RoomMgr.instance)
        {
            RoomMgr.instance = new RoomMgr();
            return RoomMgr.instance;
        }
        else
        {
            return RoomMgr.instance;
        }
    }

    constructor() {
        //管理房间的数组
        this._roomList = [];
    }

    createRoom(type,roomData,client)
    {
        let tmpRoom = new room(roomData,client);
        this._roomList.push(tmpRoom);
        global.PSZServerMgr.PSZServerMgr.sendMessage(type,tmpRoom.getRoomInfo(),client);
        tmpRoom.addPlayer(roomData.create_user_id,client);
    }

}



module.exports = RoomMgr;