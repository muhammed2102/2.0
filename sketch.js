var START = 0;
var PLAY = 1;
var END = 2;
var gamestate = 0;// start mode

var Ash,Ash_Running,ashimg,ash;
var pikachu,pikachu_running,pika,pikaimg;
var groundimg,groundimg2,backimg,ingrnd;
var hydrant,hydrantimg,clouds;
var restart,restartimg;
var start,startimg;
var score,power,powerimg,powerCount;

function preload(){

  Ash_Running = loadAnimation("Images/ash1.png","Images/ash2.png","Images/ash3.png","Images/ash4.png","Images/ash5.png","Images/ash6.png");
  
  pikachu_running = loadAnimation("Images/pika1.png","Images/pika2.png","Images/pika3.png","Images/pika4.png");
  
  groundimg = loadImage("Images/bg1.png");
  groundimg2 = loadImage("Images/bg2.png");
  pikaimg = loadAnimation("Images/pika2.png") 
  ashimg = loadAnimation("Images/ash5.png")
  hydrantimg = loadImage("Images/hydrant.png")
  restartimg = loadImage("Images/restart.png")
  startimg = loadImage("Images/start.png")
  clouds = loadImage("Images/clouds.png")
  powerimg = loadImage("Images/power.png")
}

function setup() {
 createCanvas(windowWidth,windowHeight);
  
  backimg = createSprite(width/2,height-126,width,20);
  backimg.addImage(groundimg2)
  backimg.scale = 2;
  
  
  Ash = createSprite(width-50,height-150,20,20);
  Ash.addAnimation("not running",ashimg);
  Ash.addAnimation("running",Ash_Running);
  Ash.scale = 0.9;
  Ash.setCollider("circle",-9,30,50);
  Ash.debug = false;
  
  pikachu = createSprite(150,height-87,20,20);
  pikachu.addAnimation("notrunnig",pikaimg);
  pikachu.addAnimation("running",pikachu_running);
  
  ingrnd = createSprite(width-40,height-58,width,10);
  ingrnd.visible = false;
  ingrnd.debug = false;
  
  hydrantGroup = createGroup();
  cloudsGroup = createGroup();
  powerGroup = createGroup();
  
  restart = createSprite(width/2,height/2,20,20);
  restart.addImage(restartimg);
  restart.scale = 0.2;
  
  start = createSprite(width/2,height/2,20,20);
  start.addImage(startimg);
  start.scale = 0.1;
  
  score = 0;
}

function draw() {
  background(groundimg);
  
  //score
  textSize(20);
  fill("black")
  text("Score : "+score,50,100)
  
  // in start mode
    if (gamestate === 0){
      
      restart.visible = false;
      start.visible = true;
      
      //changes gamestate into play mode
        if (keyDown("Enter") || mousePressedOver(start) || touches.Length > 0){
          gamestate = 1;
          touches = []
        }
      
    }  //end of gamestate 0
  
  
  //in play mode
    if (gamestate === 1){
      
      //power
      if(powerGroup.isTouching(Ash)){
        score = score + 1;
        powerGroup.destroyEach();
        backimg.velocityX = backimg.velocityX + 1;
        powerGroup.velocityX = powerGroup.velocityX + 1;
        cloudsGroup.velocityX = cloudsGroup.velocityX + 1;
        hydrantGroup.velocityX = hydrantGroup.velocityX + 1;
      }
      
      Ash.changeAnimation("running",Ash_Running);
      pikachu.changeAnimation("running",pikaimg);
      pikachu.velocityX = -2;
      
      //to escap from the obstacles
      if(keyDown("Up")||touches.Length > 0){
        Ash.velocityY = -18;
        touches = []
      }
      
      // gravity
      Ash.velocityY = Ash.velocityY + 0.8;
      
      //to make background move
      backimg.velocityX = 5;
      if(backimg.x > 385){
        backimg.x = backimg.width/8;
      }
      
      //spawn hydrant
      spawnHydrant();
      spawnClouds();
      spawnPower();
      
      //steps to get into the gamestate === 2
      if(hydrantGroup.isTouching(Ash)){
        gamestate = 2;
      }
      restart.visible = false;
      start.visible = false;
    }//end of gamestate 1
  
      if(gamestate === 2){
      
        Ash.changeAnimation("not running",ashimg);
        pikachu.changeAnimation("notrunnig",pikaimg);
        pikachu.velocityX = 0;

        backimg.velocityX = 0;

        hydrantGroup.setLifetimeEach(-1);
        hydrantGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        cloudsGroup.setVelocityXEach(0);
        powerGroup.setLifetimeEach(-1);
        powerGroup.setVelocityXEach(0);
        //basic stops here
        
        //code starts
        restart.visible = true;
        start.visible = false;
        if(mousePressedOver(restart) || touches.Length > 0 || keyDown("r")){
            reset();
          touches = []
          }
      }
  
  //always collide by the invisibleground
    Ash.collide(ingrnd);

  drawSprites();
}

function reset(){
  gamestate = 0;
  restart.visible = false
  hydrantGroup.destroyEach();
  cloudsGroup.destroyEach();
  powerGroup.destroyEach();
  pikachu.x = 150;
  score = 0;
}

function spawnHydrant() {
  if(frameCount % 120 === 0){
    var hydrant = createSprite(-1,height-100,20,20);
    hydrant.addImage(hydrantimg);
    hydrant.scale = 0.18;
    hydrant.lifetime = width;
    hydrant.velocityX = 5
    hydrant.debug = false;
    hydrant.setCollider("circle",0,0,200);
    
    hydrantGroup.add(hydrant);
  }
}

function spawnClouds(){
  if(frameCount % 190 === 0){
    var cloud = createSprite(-450,height/4,20,20);
    cloud.addImage(clouds)
    cloud.lifetime = -100;
    cloud.velocityX = 5;
    cloud.scale = 1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnPower(){
  if(frameCount % 100 === 0){
    var power = createSprite(-3,height-100,20,20);
    power.addImage(powerimg)
    power.lifetime = width;
    power.velocityX = 5
    power.scale = 0.1
    
    powerGroup.add(power)
  }
}
