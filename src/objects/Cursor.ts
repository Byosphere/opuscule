import { CURSOR_SPEED } from "../utils/Constants";
import MainScene from "../scenes/MainScene";

export default class Cursor {
    private scene: MainScene;
    private temp: number;
    private marker: Phaser.GameObjects.Graphics;
    private move: NodeJS.Timeout;
    private width: number;
    private height: number;
    private arrowDisplay: Phaser.GameObjects.Image[] = [];
    private enabled: boolean = true;

    public constructor(scene: MainScene, width: number, height: number) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.marker = scene.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, width, height);
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    stop() {
        this.temp = 0;
        clearInterval(this.move);
    }

    goRight(callback?: () => void) {
        if (!this.enabled) return;
        if (this.marker.x + this.width > this.scene.cameras.main.width) return;
        this.marker.x = this.marker.x + this.width;
        if (callback) callback();
        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.x = this.marker.x + this.width;
                if (callback) callback();
            }
        }, CURSOR_SPEED);
    }

    goUp(callback?: () => void) {
        if (!this.enabled) return;
        if (this.marker.y - this.height < 0) return;
        this.marker.y = this.marker.y - this.height;
        if (callback) callback();
        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.y = this.marker.y - this.height;
                if (callback) callback();
            }
        }, CURSOR_SPEED);
    }

    goDown(callback?: () => void) {
        if (!this.enabled) return;
        this.marker.y = this.marker.y + this.height;
        if (callback) callback();
        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.y = this.marker.y + this.height;
                if (callback) callback();
            }
        }, CURSOR_SPEED);
    }

    goLeft(callback?: () => void) {
        if (!this.enabled) return;
        if (this.marker.x - this.height < 0) return;
        this.marker.x = this.marker.x - this.height;
        if (callback) callback();
        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.x = this.marker.x - this.height;
                if (callback) callback();
            }
        }, CURSOR_SPEED);
    }

    displayArrow(path: { x: number; y: number; }[]) {
        this.clearArrowDisplay();
        if (!path.length || this.scene.characters.find((char) => char.x === path[path.length - 1].x * 32 && char.y === path[path.length - 1].y * 32)) return;
        for (let i = 0; i < path.length; i++) {
            let previous = path[i - 1];
            let next = path[i + 1];
            let current = path[i];
            let tileX = path[i].x * 32 + 16;
            let tileY = path[i].y * 32 + 16;
            let square: Phaser.GameObjects.Image;
            if (next) {
                if (previous) {
                    if (previous.x !== current.x) {
                        if (next && next.y !== current.y) {
                            square = this.scene.add.image(tileX, tileY, 'arrowCornerTile');
                            this.setRotation(square, previous.x, previous.y, current.x, current.y, next.x, next.y);
                        } else {
                            square = this.scene.add.image(tileX, tileY, 'arrowTile');
                            square.setRotation(Math.PI * 1 / 2);
                        }
                    } else if (previous.y !== current.y) {
                        if (next && next.x !== current.x) {
                            square = this.scene.add.image(tileX, tileY, 'arrowCornerTile');
                            this.setRotation(square, previous.x, previous.y, current.x, current.y, next.x, next.y);
                        } else {
                            square = this.scene.add.image(tileX, tileY, 'arrowTile');
                        }
                    }
                }
            } else {
                square = this.scene.add.image(tileX, tileY, 'targetTile');
                let xPrevDirection = current.x - previous.x;
                let yPrevDirection = current.y - previous.y;
                if (xPrevDirection === 1 && yPrevDirection === 0) square.setRotation(Math.PI * 1 / 2);
                if (xPrevDirection === 0 && yPrevDirection === 1) square.setRotation(Math.PI);
                if (xPrevDirection === -1 && yPrevDirection === 0) square.setRotation(-Math.PI * 1 / 2);
                if (xPrevDirection === 0 && yPrevDirection === -1) square.setRotation(0);
            }
            if (square) {
                square.setOrigin(0.5, 0.5);
                this.arrowDisplay.push(square);
            }
        }
    }

    private setRotation(square: Phaser.GameObjects.Image, prevX: number, prevY: number, currentX: number, currentY: number, nextX: number, nextY: number) {
        let xPrevDirection = currentX - prevX;
        let yPrevDirection = currentY - prevY;
        let xNextDirection = nextX - currentX;
        let yNextDirection = nextY - currentY;

        if (xPrevDirection === 1 && yPrevDirection === 0) {
            yNextDirection > 0 ? square.setRotation(Math.PI * 1 / 2) : square.setRotation(Math.PI);
        } else if (xPrevDirection === 0 && yPrevDirection === 1) {
            xNextDirection > 0 ? square.setRotation(-Math.PI * 1 / 2) : square.setRotation(Math.PI);
        } else if (xPrevDirection === -1 && yPrevDirection === 0) {
            yNextDirection > 0 ? square.setRotation(0) : square.setRotation(-Math.PI * 1 / 2);
        } else if (xPrevDirection === 0 && yPrevDirection === -1) {
            xNextDirection > 0 ? square.setRotation(0) : square.setRotation(Math.PI * 1 / 2);
        }
    }

    get x(): number {
        return this.marker.x;
    }

    get y(): number {
        return this.marker.y;
    }

    public clearArrowDisplay() {
        this.arrowDisplay.forEach((arrow) => {
            arrow.destroy();
        });
        this.arrowDisplay = [];
    }
}