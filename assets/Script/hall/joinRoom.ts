import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('joinRoom')
export class joinRoom extends Component {

    public inputStr = "";
    
    @property(Label)
    public showLabelList:Label[] = [];

    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onEnable(): void {
         this.inputStr = "";
        for (let i = 0; i < this.showLabelList.length; i++) {
            this.showLabelList[i].string = "-";
        }
    }

    onInputEvent(target,argStr)
    {   
        if (argStr=="esc")
        {
            this.inputStr =  this.inputStr.slice(0,this.inputStr.length-1);
            // console.log(this.inputStr);
            this.updateLabelList(this.inputStr);
            return;
        }
        if(argStr=="colse")
        {
            this.inputStr = ""
            // console.log(this.inputStr);
            this.updateLabelList(this.inputStr);
            return;
        }
        if(this.inputStr.length>=6)
        {
            console.log("已输入六位房间号");
            return;
        }
        this.inputStr += argStr;
        this.updateLabelList(this.inputStr);

        if(this.inputStr.length===6)
        {
            globalThis._hallClientMgr._sendMessage("join_room",{roomID:this.inputStr})
            this.node.active = false;
            this.inputStr = "";
            this.updateLabelList(this.inputStr);
        }
    }

    updateLabelList(str)
    {
        for (let i = 0; i < this.showLabelList.length; i++) {
            this.showLabelList[i].string = "-";
        }
        for (let i = 0; i < str.length; i++) {
            this.showLabelList[i].string = this.inputStr[i];
        }
    }


    onColseBtnClicked()
    {
        // this.node.destroy();
        this.node.active = false;
    }
}


