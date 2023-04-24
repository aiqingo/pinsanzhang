const  db = require("../comment/Db");

class PSZDb extends db {
    static getInstance()
    {
        //实现的单例
        if (!PSZDb.instance)
        {
            PSZDb.instance = new PSZDb();
            return PSZDb.instance;
        }
        else
        {
            return PSZDb.instance;
        }
    }

    constructor() {
        super();
        this.connectSql();
    }

    // getUserInfo(id)
    // {
    //     return new Promise((resolve, reject)=>{
    //         let sql = `select *from user_info where user_id = ${id}`;
    //         this.myQuery(sql,resolve,reject);
    //     })
    // }
    getRoomInfo (roomID)
    {
        return new Promise((resolve, reject)=>{
            let sql = `select *from room_info where room_id = ${roomID}`;
            this.myQuery(sql,resolve,reject);
        })
    }
    getUserInfo(id)
    {
        return new Promise((resolve, reject)=>{
            let sql = `select *from user_info where user_id = ${id}`;
            this.myQuery(sql,resolve,reject);
        })
    }
    updataRoomInfo(roomID,playerList)
    {

    }
}

global.PSZServerMgr.PSZDbMgr = PSZDb.getInstance();

module.exports = PSZDb;