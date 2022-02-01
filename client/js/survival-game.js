import MainScene from "./MainScene.js";
//Mainscene에서 받아오는 것 

const config ={
    width:512,
    height:512,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    // 이거 오토로 하면 페이저에서 자동으로 알맞은 컨버스 생성해줌
    parent: 'survival-game',
    scene:[MainScene], //받아온 mainScence 을 가져옴 
    scale:{
        zoom:2,
    },
    physics:{
        default:'matter',
        matter:{
            debug:true,
            gravity:{y:0},
        }
    },
    plugins:{
        scene:[
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping:'matterCollision'
            }
        ]
    }
}

new Phaser.Game(config);