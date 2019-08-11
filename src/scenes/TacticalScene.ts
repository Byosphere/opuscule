import { ControlsInterface } from "./../managers/ControlsManager";
import ControlsManager from "./../managers/ControlsManager";

export default class TacticalScene extends Phaser.Scene implements ControlsInterface {

    public controlsManager: ControlsManager;

    constructor(key: string) {
        super({ key });
    }

    preload(): void {
        this.scene.launch('ControlsManager');
        this.controlsManager = this.scene.get('ControlsManager') as ControlsManager;
        this.controlsManager.setCallbackContext(this, this);
    }

    create(): void { }
    mouseOver(gameObject: Phaser.GameObjects.GameObject): void { }
    mouseOut(gameObject: Phaser.GameObjects.GameObject): void { }
    click(gameObject: Phaser.GameObjects.GameObject): void { }
    actionButtonReleased(playerNum?: number): void { }
    upButtonReleased(playerNum?: number): void { }
    downButtonReleased(playerNum?: number): void { }
    leftButtonReleased(playerNum?: number): void { }
    rightButtonReleased(playerNum?: number): void { }
    cancelButtonReleased(playerNum?: number): void { }
    actionButtonDown(playerNum?: number): void { }
    upButtonDown(playerNum?: number): void { }
    downButtonDown(playerNum?: number): void { }
    leftButtonDown(playerNum?: number): void { }
    rightButtonDown(playerNum?: number): void { }
    cancelButtonDown(playerNum?: number): void { }
}
