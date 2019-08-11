
import MainScene from "./MainScene";
import Character from "./../objects/Character";
import { ControlsInterface } from "./../managers/ControlsManager";

export default class MenuScene extends Phaser.Scene implements ControlsInterface {

    private character: Character;

    constructor() {
        super({ key: "MenuScene" });
    }

    init(data) {
        this.character = data.character;
    }

    create() {
        let test = this.add.graphics();
        test.fillCircle(50, 50, 200);
    }

    actionButtonReleased(playerNum?: number): void {
        this.character.endPlay();
        let mainScene: MainScene = this.scene.get('MainScene') as MainScene;
        mainScene.controlsManager.setCallbackContext(mainScene, mainScene);
        this.scene.stop();
    }

    upButtonReleased(playerNum?: number): void {

    }

    downButtonReleased(playerNum?: number): void {

    }

    leftButtonReleased(playerNum?: number): void {

    }

    rightButtonReleased(playerNum?: number): void {

    }

    cancelButtonReleased(playerNum?: number): void {
        this.character.cancel();
        let mainScene: MainScene = this.scene.get('MainScene') as MainScene;
        mainScene.controlsManager.setCallbackContext(mainScene, mainScene);
        this.scene.stop();
    }
}