

export default class Player extends Phaser.Physics.Matter.Sprite{
    
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 12,{isSensor:false, label:'playerCollider'});
        var playerSensor = Bodies.circle(this.x, this.y, 24, {isSensor:true, label:'playerSensor'});
        const compoundBody = Body.create({
            parts:[playerCollider, playerSensor],
            frictionAir : 0.35,
        });
        //약간 캐릭터 바이너리 만드는 코드임 
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        //그니까 메인씬에서 특정 함수의 로직을 가져올 때 create에서 선언한 변수는 여기 (constructor) 에서 선언해줘야 update 에서 사용할 수 있음  
    }


    
    static preload(scene){
        scene.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
        scene.load.animation('female_anim','assets/images/female_anim.json');
    } //여기 static으로 하는 이유는 mainscene에 create에 asset을 시용하는 코드가 있기 때문에 거기까지 닿을 수 있도록 하기 위함 

    update(){
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.cursors.left.isDown){
            playerVelocity.x = -1;
        } else if(this.cursors.right.isDown){
            playerVelocity.x = 1;
        }
        if(this.cursors.up.isDown){
            playerVelocity.y = -1;
        }else if(this.cursors.down.isDown){
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        if(Math.abs(playerVelocity.x) > 0.1 || Math.abs(playerVelocity.y) > 0.1){
            this.anims.play('female_walk', true);
        }else {
            this.anims.play('female_idle', true);
        }
    }
    


}