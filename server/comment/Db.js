const  Mysql = require("mysql");
class Db{
    constructor() {
    }
    connectSql() {
        let mysql = Mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"root123",
            port: '3306',
            database:"pinsanzhang",
        })
        mysql.connect();
        this._masql = mysql;
        console.log("db.js-->>数据库连接成功");
    }

    //自己封装的nysql方法负责查询sqL:sql语句，reso1ve:查询成功的回调函数reject:查询失败的回调函数
    myQuery(sql,resolve,reject)
    {
        this._masql.query(sql,(err,result)=>{
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(result)
            }
        })
    }


}

module.exports = Db;