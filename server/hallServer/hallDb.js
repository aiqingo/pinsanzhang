const  db = require("../comment/Db");

class HallDb extends db {
    static getInstance()
    {
        //实现的单例
        if (!HallDb.instance)
        {
            HallDb.instance = new HallDb();
            return HallDb.instance;
        }
        else
        {
            return HallDb.instance;
        }
    }

    constructor() {
        super();
        this.connectSql();
    }

    getUserInfo(id)
    {
        return new Promise((resolve, reject)=>{
            let sql = `select *from user_info where user_id = ${id}`;
            this.myQuery(sql,resolve,reject);
        })
    }

    getRoomInfo(roomID)
    {
        return new Promise((resolve, reject)=>{
            let sql = `select *from room_info where room_id = ${roomID}`;
            this.myQuery(sql,resolve,reject);
        })
    }


    queryRoomIdIsUsable(roomID)
    {
        return new Promise((resolve, reject)=>{
            let sql = `select *from room_info where room_id = ${roomID}`;
            this.myQuery(sql,resolve,reject);
        })
    }


    seveRoomInfo(room_id, room_info) {
        return new Promise((resolve, reject)=>{
            //insert into room_info(room_id,create_user_id,game_numbers,jie_san)values(111111,666666,20,1)
            let jiesan = 0;
            if(!room_info.isBanShuJieSan)
            {
                jiesan = 1;
            }

            let sql = `insert into room_info(room_id,create_user_id,game_numbers,jie_san)values(${room_id},${room_info.createUserId},${room_info.gamNumbers},${jiesan})`;
            this.myQuery(sql,resolve,reject);
        })
        
    }
}

global.hallServerMgr.hallDbMgr = HallDb.getInstance();

module.exports = HallDb;