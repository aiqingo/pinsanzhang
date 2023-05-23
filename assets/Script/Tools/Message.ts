import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Message')
export class Message extends Component {
  
    onClick()
    {
        this.node.destroy();
    }

   
}


