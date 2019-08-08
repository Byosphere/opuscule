import { dilateByK } from "../utils/tools";


export default class Character {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Image;
    private mvt: number = 6;
    private isMoving: boolean = false;
    private range: Phaser.GameObjects.Graphics[] = [];

    public constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.sprite = scene.add.image(32, 32, 'char');
        this.sprite.setDepth(1);
        this.sprite.setOrigin(0, 0);
    }

    move(path: { x: number; y: number; }[], callback?: () => void) {
        if (path.length - 1 > this.mvt || this.isMoving) return;
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
            onComplete: () => { this.isMoving = false; callback && callback() }
        });
    }

    showRange(map: Phaser.Tilemaps.Tilemap) {
        let posX = map.worldToTileX(this.sprite.x);
        let posY = map.worldToTileY(this.sprite.y);
        let grid: number[][] = [];
        for (var y = 0; y < map.height; y++) {
            var col = [];
            for (var x = 0; x < map.width; x++) {
                let tile = map.getTileAt(x, y);
                col.push(y === posY && x === posX ? 1 : tile.properties['collide'] ? 20 : 0);
            }
            grid.push(col);
        }

        let rangeGrid = dilateByK(grid, this.mvt);
        rangeGrid.forEach((line: number[], y: number) => {
            line.forEach((tile: number, x: number) => {
                if (tile === 1) {
                    let tileX = map.tileToWorldX(x);
                    let tileY = map.tileToWorldY(y);
                    let square = this.scene.add.graphics();
                    square.fillRect(tileX, tileY, map.tileWidth, map.tileHeight);
                    square.fillStyle(0xff0000, 0.4);
                    this.range.push(square);
                }
            });
        });
    }

    clearRange() {
        this.range.forEach((square) => {
            square.destroy();
        });
        this.range = [];
    }

    get x(): number {
        return this.sprite.x;
    }

    get y(): number {
        return this.sprite.y;
    }
}