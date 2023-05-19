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
        // 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
        this.isCardeXing = 0;
        this.caedeSize1 = 0;
        this.caedeSize2 = 0;
        this.caedeSize3 = 0;

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
    //获取牌面和座位
    getPlayerMyCarde()
    {
        return {
            user_seatIndex:this.seatIndex,
            user_myCarde:this.myCarde,
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
                case "compare":
                    this.room.onCompare(data,this);
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

    getCard()
    {
        console.log(this.userID,"<玩家的牌型",this.myCarde)
        //豹子
        this.baoZi(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //同花顺
        this.tongHuaShun(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //同花
        this.tongHua(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //顺子
        this.shunZi(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //散牌
        this.sanPai(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //235
        this.erSanWu(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);
        //对子
        this.duiZi(this.myCarde.carde0,this.myCarde.carde1,this.myCarde.carde2);


        console.log(this.userID,"玩家>>>>>>>牌型>>>>>",this.isCardeXing,">>>>>>大小",this.caedeSize1,this.caedeSize2,this.caedeSize3);

    }
    //判断是不是豹子
    // 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    baoZi(carde0,carde1,carde2)
    {
        let board1 = carde0 % 10;
        let board2 = carde1 % 10;
        let board3 = carde2 % 10;
        if (board1 == board2 && board2 == board3)
        {
            this.isCardeXing = 5;
            //牌的大小
            if (board3 == 0 )
            {
                board3 = 10;
            }
            this.caedeSize1 = board3;
        }

    }
    //同花顺
    // 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    tongHuaShun(carde0,carde1,carde2)
    {
        let board1 = carde0 / 100;
        let board2 = carde1 / 100;
        let board3 = carde2 / 100;
        if (board1 == board2 && board1 == board3)
        {
            let board4 = carde0 % 10;
            let board5 = carde1 % 10;
            let board6 = carde2 % 10;
            let arr = [board4,board5,board6];
            for (let i = 0; i <arr.length; i++) {
                if (arr[i] == 0)
                {
                    arr[i] = 10;
                }
            }
            arr.sort();
            if (arr[0] < arr[1] && arr[1]<arr[2])
            {
                this.isCardeXing = 4;
                //顺子相加
                let num = arr[0]+arr[1]+arr[2];
                this.caedeSize1 = num;
            }
        }
    }
    //同花    // 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    tongHua(carde0,carde1,carde2)
    {
        let board1 = carde0 / 100;
        let board2 = carde1 / 100;
        let board3 = carde2 / 100;

        if (board1 == board2 && board1 == board3)
        {
            let board4 = carde0 % 10;
            let board5 = carde1 % 10;
            let board6 = carde2 % 10;
            let arrtarget = [carde0,carde1,carde2];
            let arr = [board4,board5,board6];
            for (let i = 0; i <arr.length; i++) {
                if (arr[i] == 0)
                {
                    arr[i] = 10;
                }
                if (arrtarget[i] == 111 || arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
                {
                    arr[i] = 11;
                }
                if (arrtarget[i] == 112|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
                {
                    arr[i] = 12;
                }
                if (arrtarget[i] == 113|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
                {
                    arr[i] = 13;
                }
                if (arrtarget[i] == 114|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
                {
                    arr[i] = 14;
                }
            }
            arr.sort(function(a,b){
                return a - b;
            });
            console.log("牌的排序>>>>>>>>>>>>",arr);
            this.isCardeXing = 3;
            //顺子相加
            this.caedeSize1 = arr[2];
            this.caedeSize2 = arr[1];
            this.caedeSize3 = arr[0];
        }
    }
    //顺子// 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    shunZi(carde0,carde1,carde2)
    {
        let board1 = carde0 %100;
        let board2 = carde1 %100;
        let board3 = carde2 %100;
        let arrtarget = [carde0,carde1,carde2];
        let arr = [board1,board2,board3];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == 0 )
            {
                arr[i] = 10;
            }
            if (arrtarget[i] == 111 || arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
            {
                arr[i] = 11;
            }
            if (arrtarget[i] == 112|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
            {
                arr[i] = 12;
            }
            if (arrtarget[i] == 113|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
            {
                arr[i] = 13;
            }
            if (arrtarget[i] == 114|| arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
            {
                arr[i] = 14;
            }
        }

        arr.sort();
        if (arr[0] < arr[1] && arr[1]<arr[2])
        {
            this.isCardeXing = 2;
            //顺子相加
            let num = arr[0]+arr[1]+arr[2];
            this.caedeSize1 = num;
        }
    }

    //对子// 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    duiZi(carde0,carde1,carde2)
    {
        let board1 = carde0 %100;
        let board2 = carde1 %100;
        let board3 = carde2 %100;
        if (board1 == board2 || board1 == board3 || board2 == board3)
        {
            this.isCardeXing = 1;
            //对子相加   之后比大小
            let num = board1 + board2 + board3;
            this.caedeSize1 = num;
        }
    }

    //散牌
    sanPai(carde0,carde1,carde2) {
        let board1 = carde0 % 10;
        let board2 = carde1 % 10;
        let board3 = carde2 % 10;

        let arrtarget = [carde0,carde1,carde2];


        let arr = [board1,board2,board3];
        for (let i = 0; i <arr.length; i++) {
            if (arr[i] == 0)
            {
                arr[i] = 10;
            }
            if (arrtarget[i] == 111 || arrtarget[i] == 211 || arrtarget[i] == 311 || arrtarget[i] == 411)
            {
                arr[i] = 11;
            }
            if (arrtarget[i] == 112|| arrtarget[i] == 212 || arrtarget[i] == 312 || arrtarget[i] == 412)
            {
                arr[i] = 12;
            }
            if (arrtarget[i] == 113|| arrtarget[i] == 213 || arrtarget[i] == 313 || arrtarget[i] == 413)
            {
                arr[i] = 13;
            }
            if (arrtarget[i] == 114|| arrtarget[i] == 214 || arrtarget[i] == 314 || arrtarget[i] == 414)
            {
                arr[i] = 14;
            }
        }
        let arr2 =  arr.sort(function(a,b){
            return a - b;
        });
        console.log("牌的排序>>>>>>>>>>>>",arr2);
        this.isCardeXing = 0;

        this.caedeSize1 = arr[2];
        this.caedeSize2 = arr[1];
        this.caedeSize3 = arr[0];

    }


    //235// 0:散牌  1：对子  2：顺子  3: 同色 4:同花顺 5:豹子  6: 235
    erSanWu(carde0,carde1,carde2)
    {
        let board1  = carde0 % 10 ;
        let board2  = carde1 % 10 ;
        let board3  = carde2 % 10 ;
        if (board1 == 2 || board2 == 2 ||board3 == 2)
        {
            if (board1 == 3 || board2 == 3 ||board3 == 3)
            {
                if (board1 == 5 || board2 == 5 || board3 == 5)
                {
                    this.isCardeXing = 6;
                }
            }
        }
    }



    getIsAbandon()
    {
        return this.isAbandon;
    }


}
module.exports = Player;