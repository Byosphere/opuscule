import TacticalScene from "./TacticalScene";
import Character from "./../objects/Character";
import Cursor from "./../objects/Cursor";
import { js as EasyStar } from 'easystarjs';

export default class MainScene extends TacticalScene {
    private finder: EasyStar;
    private map: Phaser.Tilemaps.Tilemap;
    private cursor: Cursor;
    private character: Character;

    constructor() {
        super("MainScene");
    }

    create(): void {
        this.map = this.make.tilemap({ key: 'map' });
        let tileset = this.map.addTilesetImage('tiles');
        this.map.createStaticLayer(0, tileset, 0, 0);

        this.cursor = new Cursor(this, this.map.tileWidth, this.map.tileHeight);
        this.character = new Character(this);
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

    actionButtonReleased() {
        this.finder.findPath(
            Math.floor(this.character.x / 32),
            Math.floor(this.character.y / 32),
            Math.floor(this.cursor.x / 32),
            Math.floor(this.cursor.y / 32),
            (path) => {
                if (path === null) {
                    console.warn("Path was not found.");
                } else {
                    this.character.move(path, () => this.character.showRange(this.map));
                }
            }
        );
        this.finder.calculate();
    }

    downButtonReleased() {
        this.cursor.stop();
    }
    upButtonReleased() {
        this.cursor.stop();
    }
    leftButtonReleased() {
        this.cursor.stop();
    }
    rightButtonReleased() {
        this.cursor.stop();
    }

    downButtonDown() {
        this.cursor.goDown();
    }

    upButtonDown() {
        this.cursor.goUp();
    }

    leftButtonDown() {
        this.cursor.goLeft();
    }

    rightButtonDown() {
        this.cursor.goRight();
    }
}
