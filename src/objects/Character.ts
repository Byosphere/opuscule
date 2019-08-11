import { dilateByK } from "../utils/tools";
import { CHAR_ACTIF, CHAR_SELECTED, CHAR_MOVED, CHAR_INACTIF } from "../utils/Constants";
import Weapon from "./Weapon";
import MainScene from "../scenes/MainScene";

export interface CharacterData {
    mvt: number;
    weapon?: Weapon;
}

export default class Character {

    private scene: MainScene;
    private map: Phaser.Tilemaps.Tilemap;
    private sprite: Phaser.GameObjects.Image;
    private isMoving: boolean = false;
    private range: Phaser.GameObjects.Image[] = [];
    private state: number = CHAR_ACTIF;
    private data: CharacterData;
    private previousPos: { x: number, y: number };
    private isHover: boolean = false;

    public constructor(scene: MainScene, map: Phaser.Tilemaps.Tilemap, data: CharacterData) {
        this.scene = scene;
        this.map = map;
        this.data = data;
    }

    public addToScene(x: number, y: number) {
        this.sprite = this.scene.add.image(x, y, 'char');
        this.sprite.setDepth(1);
        this.sprite.setOrigin(0, 0);
    }

    public get x(): number {
        return this.sprite.x;
    }

    public get y(): number {
        return this.sprite.y;
    }

    public get mvt(): number {
        return this.data.mvt;
    }

    public move(path: { x: number; y: number; }[], callback?: () => void) {
        let blocked = Boolean(this.scene.characters.find((char) => char.x === path[path.length - 1].x * 32 && char.y === path[path.length - 1].y * 32));
        if (path.length - 1 > this.data.mvt || this.isMoving || this.state !== CHAR_SELECTED || blocked) {
            callback && callback();
        } else {
            this.previousPos = { x: path[0].x * 32, y: path[0].y * 32 };
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
                    this.showRange();
                    callback && callback();
                }
            });
        }
    }

    public select() {
        if (this.state === CHAR_ACTIF) {
            this.state = CHAR_SELECTED;
        }
    }

    public hover() {
        if (!this.isHover) {
            this.isHover = true;
            this.showRange();
        }
    }

    public unHover() {
        if (this.isHover) {
            this.isHover = false;
            this.clearRange();
        }
    }

    public isSelected(): boolean {
        return this.state === CHAR_SELECTED;
    }

    public cancel() {
        this.state = CHAR_ACTIF;
        if (this.previousPos)
            this.sprite.setPosition(this.previousPos.x, this.previousPos.y);
    }

    private showRange() {
        this.clearRange();
        let posX = this.map.worldToTileX(this.sprite.x);
        let posY = this.map.worldToTileY(this.sprite.y);
        let grid: number[][] = [];
        for (var y = 0; y < this.map.height; y++) {
            var col = [];
            for (var x = 0; x < this.map.width; x++) {
                let tile = this.map.getTileAt(x, y);
                col.push(y === posY && x === posX ? 1 : tile.properties['collide'] || tile.properties['character'] ? 20 : 0);
            }
            grid.push(col);
        }
        let mvt = this.state === CHAR_MOVED ? 0 : this.data.mvt;
        let rangeGrid = dilateByK(grid, mvt, this.data.weapon ? this.data.weapon.range : null);
        rangeGrid.forEach((line: number[], y: number) => {
            line.forEach((tile: number, x: number) => {
                let tileX = this.map.tileToWorldX(x);
                let tileY = this.map.tileToWorldY(y);
                if (this.scene.characters.find((char) => char.x === tileX && char.y === tileY)) return;
                if (tile === 1) {
                    let square = this.scene.add.image(tileX, tileY, 'moveTile');
                    square.setOrigin(0, 0);
                    this.range.push(square);
                }
                if (tile === 2) {
                    let square = this.scene.add.image(tileX, tileY, 'attackTile');
                    square.setOrigin(0, 0);
                    this.range.push(square);
                }
            });
        });
    }

    public endPlay() {
        this.state = CHAR_INACTIF;
        this.sprite.setAlpha(0.2);
    }

    public clearRange() {
        this.range.forEach((range) => {
            range.destroy();
        });
        this.range = [];
    }
}