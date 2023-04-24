import { _decorator, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hallSceneMgr')
export class hallSceneMgr extends Component {

    // @property(Node)
    // root:Node = null;

    @property(Label)
    playerName:Label = null;
    
    @property(Label)
    playerId:Label = null;

    @property(Sprite)
    playerImage:Sprite = null;

    @property(Prefab)
    crealeRoom:Prefab = null;

    crealeRoomnode = null;

    @property(Prefab)
    AddRoom:Prefab = null;
    AddRoomnode = null;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        
    }


    public _init()
    {
        globalThis._eventTarget.on("create_room",this.onCreateRoom,this);
        globalThis._eventTarget.on("join_room",this.onJoinRoom,this);
        this.playerId.string = globalThis._userInfo.user_id;
        this.playerName.string = "ID:"+globalThis._userInfo.user_name;
        this.crealeRoomnode = instantiate(this.crealeRoom);
        this.node.addChild(this.crealeRoomnode);
        this.crealeRoomnode.active = false;

        this.AddRoomnode = instantiate(this.AddRoom);
        this.node.addChild(this.AddRoomnode);
        this.AddRoomnode.active = false;
    }



    public onCreateRoomBtnClicked()
    {
        this.crealeRoomnode.active = true;
    }

    public onAddRoomBtnClicked()
    {
        this.AddRoomnode.active = true;
    }


    public onCreateRoom(room_id)
    {
        if(room_id === 0)
        {
            console.log("<create_room--->创建房间失败",room_id);
        }
        else
        {
            console.log("<create_room--->创建房间服务器返回的房间id",room_id);
            globalThis._userInfo.room_id = room_id;
            //todo 从大厅到游戏场景内
            director.loadScene("PSZ");
        }
    }
    public onJoinRoom(roomData)
    {
        if(!roomData)
        {
            console.log("为查找到房间信息");
            return;
        }
        console.log("<create_room--->创建房间失败",roomData);
        globalThis._userInfo.room_id = roomData.room_id;
        director.loadScene("PSZ");
    }

}


