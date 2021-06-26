var gameState = "WAIT";
var lifes = 3;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  //backgroundImg = loadImage("iceback.jpg");
  
  
  trex_running = loadAnimation("basketBall.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("iceback.jpg");
  
  cloudImage = loadImage("lazer.png");
  
  obstacle1 = loadImage("spikes.png");
  obstacle2 = loadImage("spikes.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  trex = createSprite(50,windowHeight-200,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  //trex.debug=true
  
  invisibleGround = createSprite(width/2,height-150,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height/2-30,width*4,height*2);
  ground.scale=3;
  
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  invisibleGround.visible =false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  
  if(gameState==="WAIT"){
    background("white");  
    textSize(20);
    fill("blue");
    text("TO PLAY THIS GAME YOU HAVE TO PRESS THE SPACE BAR AND TRY NOT TO MAKE THE BALL TOUCH THE OBSTACLES",10,50);
    text("YOU WILL BE HAVING A SCORE AND A LIFE COUNT ON YOUR SCREEN. WHEN THE LIFE COUNT GOES TO ZERO THE GAME FINISHES.",10,100);
    text("DURING THE GAME YOU WILL BE HAVING FEW HEARTS ON THE WAY.",10,150);
    text("ONCE YOU ARE OUT REFRESH THE PAGE TO START AGAIN.",10,200);
    if(touches.length > 0 || keyDown("SPACE")) {
      gameState="PLAY";
      touches = [];
    }
  }
  
  if (gameState==="PLAY"){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if( score%1000 === 0 && lifes>0 && lifes<3){
      lifes=lifes+1;
    }
  
    if(touches.length > 0 || keyDown("SPACE")) {
      jumpSound.play( )
      trex.velocityY = -20;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)||cloudsGroup.isTouching(trex) ){
        collidedSound.play() 
        gameState = "END"; 
        lifes = lifes-1;        
    }
    drawSprites();
    textSize(30);
    fill("white")
    text("Score: "+ score,30,50);
    text("lifes:" + lifes,1200,50);

  }
  else if (gameState === "END") {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
    drawSprites();
    textSize(30);
    fill("white")
    text("Score: "+ score,30,50);
    text("lifes:" + lifes,1200,50);

  }
  
  if(lifes===0){
    cloudsGroup.destroyEach();
    obstaclesGroup.destroyEach();
    trex.destroy();
    ground.destroy();
    gameOver.destroy();
    restart.destroy();
    background("red");
    textSize(40);
    text("BETTER LUCK NEXT TIME",500,400);
    
  }
  
  
}





function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(50,220));
    cloud.addImage(cloudImage);
    cloud.scale = -0.17;
    cloud.velocityX = -3;
    //cloud.debug=true
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-210,20,30);
    obstacle.setCollider('circle',0,0,45)
    //obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
