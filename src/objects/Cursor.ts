import { CURSOR_SPEED } from "../utils/Constants";

export default class Cursor {
    private scene: Phaser.Scene;
    private temp: number;
    private marker: Phaser.GameObjects.Graphics;
    private move: NodeJS.Timeout;
    private width: number;
    private height: number;

    public constructor(scene: Phaser.Scene, width: number, height: number) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.marker = scene.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, width, height);
    }

    stop() {
        this.temp = 0;
        clearInterval(this.move);
    }

    goRight() {
        this.marker.x = this.marker.x + this.width;

        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.x = this.marker.x + this.width;
            }
        }, CURSOR_SPEED);
    }

    goUp() {
        this.marker.y = this.marker.y - this.height;

        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.y = this.marker.y - this.height;
            }
        }, CURSOR_SPEED);
    }

    goDown() {
        this.marker.y = this.marker.y + this.height;

        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.y = this.marker.y + this.height;
            }
        }, CURSOR_SPEED);
    }

    goLeft() {
        this.marker.x = this.marker.x - this.height;

        if (this.move) this.stop();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                this.marker.x = this.marker.x - this.height;
            }
        }, CURSOR_SPEED);
    }

    get x(): number {
        return this.marker.x;
    }

    get y(): number {
        return this.marker.y;
    }
}