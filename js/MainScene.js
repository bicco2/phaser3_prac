import Player from "./Player.js";

export default class MainScene extends Phaser.Scene{

    constructor(){
        super("MainScene");
    }

    preload(){
        this.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
        this.load.animation('female_anim','assets/images/female_anim.json');
 

        //맵 
        //this.load.image('tiles','assets/images/RPG Nature Tileset.png');
        //this.load.tilemapTiledJSON('map','assets/images/map.json');
        //맵

        // Player.preload(this);
         //아 여기서 에셋에 담겨있는 이미지와 애니매이션 등을 사용하기 위해 선언해주는 코드네 
        //밑에 update에서 this.player.anims
    }

    create(){
        //맵 
        // const map = this.make.tilemap({key:map});
        // const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles',32,32,0,0);
        // const layer1 = map.createStaticLayer('Tile Layer 1', tileset,0,0);
        // const layer2 = map.createStaticLayer('Tile Layer 2', tileset,0,0);
        // layer1.setCollisionByProperty({collides:true});
        // this.matter.world.convertTilemapLayer(layer1);
        //맵

        this.player = new Player({scene:this, x:0, y:0, texture:'female', frame :'townsfolk_f_idle_1'});
        let textPlayer = new Player({scene:this, x:100, y:100, texture:'female', frame :'townsfolk_f_idle_1'});
        //this.player = new Phaser.Physics.Matter.Sprite(this.matter.world,0,0,'female','townsfolk_f_idle_1');
        //player라는 js를 따로 만들어서 적용함 그리고 그 안에 객체를 약간 바꿔줌 scene : this 는 scene = this, x = 0 이런 뜻임 


        //  this.player.inputKeys = this.input.keyboard.addKeys({
        //     up : Phaser.Input.Keyboard.keyCodes.W,
        //     down : Phaser.Input.Keyboard.keyCodes.S,
        //     left : Phaser.Input.Keyboard.keyCodes.A,
        //     right : Phaser.Input.Keyboard.keyCodes.D
        // })
        

    }

    get velocity(){
        return this.body.velocity;
    }

    update(){
        this.player.update();
    }

}
