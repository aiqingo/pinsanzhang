import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('userInfo')
export class userInfo extends Component {

    //房间id
    public room_id;
    //玩家头像
    public user_head_url;
    //玩家id
    public user_id;
    //w玩家名字
    public user_name;
    //玩家房卡数量
    public user_room_cards;
    static instance: any;

    public SeataIndex;

    public static getInstance()
    {
        if(userInfo.instance == null)
        {
            userInfo.instance = new userInfo;
        }
        return userInfo.instance;
    }

    Awake()
    {
       
    }
    start() {
        globalThis._userInfo = userInfo.getInstance();
    }

    update(deltaTime: number) {
        
    }
}


