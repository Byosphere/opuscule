import { dilateByK } from "../utils/tools";
import { CHAR_ACTIF, CHAR_SELECTED, CHAR_MOVED } from "../utils/Constants";


export default class Character {
    private scene: Phaser.Scene;
    private map: Phaser.Tilemaps.Tilemap;
    private sprite: Phaser.GameObjects.Image;
    private mvt: number = 6;
    private isMoving: boolean = false;
    private range: Phaser.GameObjects.Graphics[] = [];
    private state: number = CHAR_ACTIF;

    public constructor(x: number, y: number, scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
        this.scene = scene;
        this.map = map;
        this.sprite = scene.add.image(x, y, 'char');
        this.sprite.setDepth(1);
        this.sprite.setOrigin(0, 0);
    }


    public get x(): number {
        return this.sprite.x;
    }

    public get y(): number {
        return this.sprite.y;
    }

    public move(path: { x: number; y: number; }[], callback?: () => void) {
        if (path.length - 1 > this.mvt || this.isMoving || this.state !== CHAR_SELECTED) return;
        this.clearRange();
        var tweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            tweens.push({
                targets: this.sprite,
                x: { value: ex * 32, duration: 100 },
                y: { value: ey * 32, duration: 100 }
            });
        }

        this.scene.tweens.timeline({
            tweens: tweens,
            onStart: () => this.isMoving = true,
            onComplete: () => {
                this.isMoving = false;
                this.state = CHAR_MOVED;
                callback && callback()
            }
        });
    }

    public select() {
        if (this.state === CHAR_ACTIF) {
            this.state = CHAR_SELECTED;
            this.showRange();
        }
    }

    public isSelected(): boolean {
        return this.state === CHAR_SELECTED;
    }

    private showRange() {
        let posX = this.map.worldToTileX(this.sprite.x);
        let posY = this.map.worldToTileY(this.sprite.y);
        let grid: number[][] = [];
        for (var y = 0; y < this.map.height; y++) {
            var col = [];
            for (var x = 0; x < this.map.width; x++) {
                let tile = this.map.getTileAt(x, y);
                col.push(y === posY && x === posX ? 1 : tile.properties['collide'] ? 20 : 0);
            }
            grid.push(col);
        }

        let rangeGrid = dilateByK(grid, this.mvt);
        rangeGrid.forEach((line: number[], y: number) => {
            line.forEach((tile: number, x: number) => {
                if (tile === 1) {
                    let tileX = this.map.tileToWorldX(x);
                    let tileY = this.map.tileToWorldY(y);
                    let square = this.scene.add.graphics();
                    square.fillRect(tileX, tileY, this.map.tileWidth, this.map.tileHeight);
                    square.fillStyle(0xff0000, 0.4);
                    this.range.push(square);
                }
            });
        });
    }

    private clearRange() {
        this.range.forEach((square) => {
            square.destroy();
        });
        this.range = [];
    }
}