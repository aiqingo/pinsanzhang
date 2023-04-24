const  db = require("../comment/Db");

class LoginDb extends db {
    static getInstance()
    {
        //实现的单例
        if (!LoginDb.instance)
        {
            LoginDb.instance = new LoginDb();
            return LoginDb.instance;
        }
        else
        {
            return LoginDb.instance;
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


}

global.loginServerMgr .loginDbMgr = LoginDb.getInstance();

module.exports = LoginDb;