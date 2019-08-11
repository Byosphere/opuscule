import "phaser";
import MainScene from "./scenes/MainScene";
import ControlsManager from "./managers/ControlsManager";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: "game",
    scene: [BootScene, MainScene, ControlsManager, MenuScene],
    input: { gamepad: true },
    disableContextMenu: true,
    render: { antialias: true, pixelArt: true },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        },
    },
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    new Game(config);
});
