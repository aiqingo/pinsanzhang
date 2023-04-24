class Message {
    constructor() {
    }

    // static getInstance(any)
    // {
    //     //实现的单例
    //     if (!any.instance)
    //     {
    //         any.instance = new any();
    //         return any.instance;
    //     }
    //     else
    //     {
    //         return any.instance;
    //     }
    // }


    // sendMessage(type,data,client)
    // {
    //     let result = {
    //         type:type,
    //         data:data,
    //     }
    //     client.send(JSON.stringify(result));
    //
    // }

    // recvMessage(type,data,client,string,fun)
    // {
    //     switch (type)
    //     {
    //         case string:
    //             fun(data.id).then((result)=>{
    //                 this.sendMessage(type,result[0],client)
    //             }).catch((err)=>{
    //                 this.sendMessage(type,{err:"《login---》获取不到对应数据"},client);
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    //
    // }

}











module.exports = Message;