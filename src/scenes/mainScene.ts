import TacticalScene from "./TacticalScene";
import { js as EasyStar } from 'easystarjs';
import { CURSOR_SPEED, CURSOR_TAMPON } from "../utils/Constants";

export default class MainScene extends TacticalScene {
    private finder: EasyStar;
    private marker: Phaser.GameObjects.Graphics;
    private map: Phaser.Tilemaps.Tilemap;
    private move: NodeJS.Timeout;
    private temp: number = 0;

    constructor() {
        super("MainScene");
    }

    create(): void {
        this.map = this.make.tilemap({ key: 'map' });
        let tileset = this.map.addTilesetImage('tiles');
        this.map.createStaticLayer(0, tileset, 0, 0);

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

        this.finder = new EasyStar();

        var grid = [];
        for (var y = 0; y < this.map.height; y++) {
            var col = [];
            for (var x = 0; x < this.map.width; x++) {
                // In each cell we store the ID of the tile, which corresponds
                // to its index in the tileset of the map ("ID" field in Tiled)
                col.push(this.map.getTileAt(x, y).index);
            }
            grid.push(col);
        }
        this.finder.setGrid(grid);
        let tilesetJson = this.map.tilesets[0];
        let properties = tileset.tileProperties;
        let acceptableTiles = [];

        for (var i = tilesetJson.firstgid - 1; i < tileset.total; i++) {
            if (!properties.hasOwnProperty(i)) {
                acceptableTiles.push(i + 1);
                continue;
            }
            if (!properties[i].collide) acceptableTiles.push(i + 1);
            if (properties[i].cost) this.finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
        }
        this.finder.setAcceptableTiles(acceptableTiles);
        this.marker.setVisible(true);
    }


    update() {
        var worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

        // Rounds down to nearest tile
        // var pointerTileX = this.map.worldToTileX(worldPoint.x);
        // var pointerTileY = this.map.worldToTileY(worldPoint.y);
        // this.marker.x = this.map.tileToWorldX(pointerTileX);
        // this.marker.y = this.map.tileToWorldY(pointerTileY);
        // this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
    }

    checkCollision = (x, y) => {
        let tile = this.map.getTileAt(x, y);
        return tile.properties.collide == true;
    };

    downButtonReleased() {
        this.temp = 0;
        clearInterval(this.move);
    }
    upButtonReleased() {
        this.temp = 0;
        clearInterval(this.move);
    }
    leftButtonReleased() {
        this.temp = 0;
        clearInterval(this.move);
    }
    rightButtonReleased() {
        this.temp = 0;
        clearInterval(this.move);
    }

    downButtonDown() {
        var pointerTileY = this.map.worldToTileY(this.marker.y + this.map.tileHeight);
        this.marker.y = this.map.tileToWorldY(pointerTileY);

        if (this.move) this.downButtonReleased();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > 2) {
                var pointerTileY = this.map.worldToTileY(this.marker.y + this.map.tileHeight);
                this.marker.y = this.map.tileToWorldY(pointerTileY);
            }
        }, CURSOR_SPEED);
    }

    upButtonDown() {
        var pointerTileY = this.map.worldToTileY(this.marker.y - this.map.tileHeight);
        this.marker.y = this.map.tileToWorldY(pointerTileY);

        if (this.move) this.upButtonReleased();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > CURSOR_TAMPON) {
                var pointerTileY = this.map.worldToTileY(this.marker.y - this.map.tileHeight);
                this.marker.y = this.map.tileToWorldY(pointerTileY);
            }
        }, CURSOR_SPEED);
    }

    leftButtonDown() {
        var pointerTileX = this.map.worldToTileX(this.marker.x - this.map.tileWidth);
        this.marker.x = this.map.tileToWorldY(pointerTileX);

        if (this.move) this.leftButtonReleased();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > CURSOR_TAMPON) {
                var pointerTileX = this.map.worldToTileX(this.marker.x - this.map.tileWidth);
                this.marker.x = this.map.tileToWorldY(pointerTileX);
            }
        }, CURSOR_SPEED);
    }

    rightButtonDown() {
        var pointerTileX = this.map.worldToTileX(this.marker.x + this.map.tileWidth);
        this.marker.x = this.map.tileToWorldY(pointerTileX);

        if (this.move) this.rightButtonReleased();
        this.move = setInterval(() => {
            this.temp++;
            if (this.temp > CURSOR_TAMPON) {
                var pointerTileX = this.map.worldToTileX(this.marker.x + this.map.tileWidth);
                this.marker.x = this.map.tileToWorldY(pointerTileX);
            }
        }, CURSOR_SPEED);
    }
}
