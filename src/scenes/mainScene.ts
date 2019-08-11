import TacticalScene from "./TacticalScene";
import Character from "./../objects/Character";
import Cursor from "./../objects/Cursor";
import { js as EasyStar } from 'easystarjs';

export default class MainScene extends TacticalScene {
    private finder: EasyStar;
    private map: Phaser.Tilemaps.Tilemap;
    private cursor: Cursor;
    public characters: Character[] = [];
    private grid: number[][] = [];

    constructor() {
        super("MainScene");
        // MAP
        // PERSOS

    }

    create(): void {

        this.map = this.make.tilemap({ key: 'map' });
        let tileset = this.map.addTilesetImage('tiles');
        this.map.createStaticLayer(0, tileset, 0, 0);
        this.cameras.main.setBounds(0, 0, 1024, 2048);
        this.cameras.main.setZoom(2);

        this.cursor = new Cursor(this, this.map.tileWidth, this.map.tileHeight);

        this.characters.push(new Character(this, this.map, { mvt: 5, weapon: { range: [2] } }));
        this.characters.push(new Character(this, this.map, { mvt: 7 }));
        this.characters.push(new Character(this, this.map, { mvt: 6, weapon: { range: [1] } }));

        this.cameras.main.startFollow(this.cursor, true, 0.09, 0.09);

        let charIndex = 0;
        for (var y = 0; y < this.map.height; y++) {
            var col = [];
            for (var x = 0; x < this.map.width; x++) {
                let tile = this.map.getTileAt(x, y);
                let hero = this.characters[charIndex];
                if (hero && tile.properties['start']) {
                    hero.addToScene(x * this.map.tileWidth, y * this.map.tileHeight);
                    charIndex++;
                }
                col.push(tile.index);
            }
            this.grid.push(col);
        }

        this.createFinder(tileset);
    }

    createFinder(tileset: Phaser.Tilemaps.Tileset) {

        this.finder = new EasyStar();
        this.finder.setGrid(this.grid);
        let tilesetJson = this.map.tilesets[0];
        let properties = tileset.tileProperties;
        let acceptableTiles = [];

        for (var i = tilesetJson.firstgid - 1; i < tileset.total; i++) {
            if (!properties.hasOwnProperty(i)) {
                acceptableTiles.push(i + 1);
                continue;
            }
            if (!properties[i].collide && !properties[i].character) acceptableTiles.push(i + 1);
            if (properties[i].cost) this.finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
        }
        this.finder.setAcceptableTiles(acceptableTiles);
    }


    update() {

    }

    checkCollision = (x, y) => {
        let tile = this.map.getTileAt(x, y);
        return tile.properties.collide == true;
    };

    actionButtonReleased() {
        let selected = this.characters.find(c => c.isSelected());
        if (selected) {
            this.getPath(selected, this.cursor).then((path: any) => {
                this.cursor.clearArrowDisplay();
                selected.move(path, () => {
                    let scene = this.scene.launch('MenuScene', { character: selected });
                    this.controlsManager.setCallbackContext(scene.get('MenuScene') as any, scene.get('MenuScene'));
                });
            });
        } else {
            this.characters.forEach((char: Character) => {
                if (char.x === this.cursor.x && char.y === this.cursor.y) {
                    char.select();
                }
            });
        }

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
        this.cursor.goDown(() => {
            this.updateCharacter();
        });
    }

    upButtonDown() {
        this.cursor.goUp(() => {
            this.updateCharacter();
        });
    }

    leftButtonDown() {
        this.cursor.goLeft(() => {
            this.updateCharacter();
        });
    }

    rightButtonDown() {
        this.cursor.goRight(() => {
            this.updateCharacter();
        });
    }

    cancelButtonDown() {
        let selected = this.characters.find(c => c.isSelected());
        if (selected) {
            selected.cancel();
            if (selected.x !== this.cursor.x || selected.y !== this.cursor.y) {
                selected.clearRange();
            }
            this.cursor.clearArrowDisplay();
        }
    }

    private updateCharacter() {
        let selected = this.characters.find(c => c.isSelected());
        if (selected) {
            selected.hover();
            this.getPath(selected, this.cursor).then((path: any) => {
                if (path.length - 1 <= selected.mvt) this.cursor.displayArrow(path);
            });
        } else {
            this.characters.forEach((char: Character) => {
                char.unHover();
                if (char.x === this.cursor.x && char.y === this.cursor.y) {
                    char.hover();
                }
            });
        }
    }

    private getPath(el1, el2) {
        return new Promise((resolve, reject) => {
            this.finder.findPath(
                Math.floor(el1.x / this.map.tileHeight),
                Math.floor(el1.y / this.map.tileWidth),
                Math.floor(el2.x / this.map.tileHeight),
                Math.floor(el2.y / this.map.tileWidth),
                (path) => {
                    if (path === null) {
                        reject("Path was not found.");
                    } else {
                        resolve(path);
                    }
                }
            );
            this.finder.calculate();
        });
    }
}
