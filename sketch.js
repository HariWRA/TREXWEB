var PLAY=1;
var END=0;
var estadoJogo=PLAY;
var caixa;
var ground;
var treximg;
var groundimg;
var trex;
var solo;
var nuvem;
var nuvemimg;
var pyt;
var pytimg;
var trexabaixando;
var cacto1;
var cacto2;
var cacto3;
var cacto4;
var cacto5;
var cacto6;
var pontos=0;
//criando grupo de obstaculos e nuvens
var gruponuvens;
var grupoobstaculos;
var trexmorto;
var gameover;
var restart;
var gameoverimg;
var restartimg;
var sompulo;
var sommorte;
var somcheckp;

function preload () {
treximg=loadAnimation("trex1.png","trex3.png","trex4.png");
groundimg=loadImage("ground2.png");
nuvemimg=loadImage("cloud.png");
pytimg=loadAnimation("pyt1.png","pyt2.png");
trexabaixando=loadImage("trexabaixar.png");
cacto1=loadImage("obstacle1.png");
cacto2=loadImage("obstacle2.png");
cacto3=loadImage("obstacle3.png");
cacto4=loadImage("obstacle4.png");
cacto5=loadImage("obstacle5.png");
cacto6=loadImage("obstacle6.png");
trexmorto=loadImage("trex_collided.png");
gameover=loadImage("gameOver.png");
restart=loadImage("restart.png");
sompulo=loadSound("jump.mp3");
sommorte=loadSound("die.mp3");
somcheckp=loadSound("checkpoint.mp3");

}
function setup() {
  createCanvas(windowWidth, windowHeight);
  //criar sprite do t rex
  trex=createSprite(50,height-90,20,20);
  trex.addAnimation("correndo",treximg);
  trex.addImage("abaixando",trexabaixando);
  trex.addImage("colidiu",trexmorto);
  trex.scale=0.5;
  trex.setCollider("circle",0,0,40);
  //trex.debug=true;

  //criar o solo
  ground=createSprite(width/2, height-100, width, 2);
  ground.addImage("chao",groundimg);
  ground.x=ground.width/2;
  solo=createSprite(width/2, height-30, width, 125);
  solo.visible=false;
  gruponuvens=new Group();
  grupoobstaculos=new Group();
  gameoverimg=createSprite(width/2, height/2 -50);
  gameoverimg.addImage(gameover);
  restartimg=createSprite(width/2, height/2);
  restartimg.addImage(restart);
  restartimg.scale=0.7;
  gameoverimg.visible=false;
  restartimg.visible=false;
  
}

function draw() 
{
  background(255);
  
  //texto da pontuaçao
  text("Pontuação: "+pontos,500,40);
  if(estadoJogo===PLAY){

    if(pontos>0&&pontos%200===0){
      somcheckp.play();
    }
    //funçoes que geram os objetos do jogo
    gerarPyt(); 
    obstaculos();  
    nuvens();

    // velocidade do solo
    ground.velocityX=-(2+2*pontos/150);

    //gravidade e pulo do t-rex
    if((touches.length > 0 ||keyDown("space"))&&trex.y>=height-120 ){
      trex.velocityY=-10;
      sompulo.play();
      touches = [];
    }
  trex.velocityY=trex.velocityY+0.8;

  // soma da pontuaçao
  pontos=pontos+Math.round(getFrameRate()/60);

  //movimento do t-rex
  if(keyDown(DOWN_ARROW)){
    trex.changeAnimation("abaixando",trexabaixando);
    
  }else{
    trex.changeAnimation("correndo",treximg);
  }

  //faz o chao nao acabar
  if(ground.x<0){
    ground.x=ground.width/2 ;
  }
  if (trex.isTouching(grupoobstaculos)){
    estadoJogo=END;
    sommorte.play();
    //trex.velocityY=-12;
  }
  } else if (estadoJogo===END){
    ground.velocityX=0;
    gruponuvens.setVelocityXEach(0);
    grupoobstaculos.setVelocityXEach(0);
    trex.velocityY=0;
    trex.changeAnimation("colidiu",trexmorto);
    gruponuvens.setLifetimeEach(-1);
    grupoobstaculos.setLifetimeEach(-1);
    gameoverimg.visible=true;
    restartimg.visible=true;
    if(mousePressedOver(restartimg)){
      console.log("fimdejogo");
      resetar();
    }



  }
   

  trex.collide(solo);

  //console.log(trex.y);
  drawSprites();
}
function nuvens(){
    if(frameCount %100===0){
      nuvem=createSprite(width+20, height-300, 40, 10);
      nuvem.velocityX=-2;
      nuvem.addImage(nuvemimg);
      nuvem.scale=0.18;
      nuvem.y=Math.round(random(100,220));
      nuvem.depth=pyt.depth;
      pyt.depth=pyt.depth+1;
      nuvem.lifetime=320;
      gruponuvens.add(nuvem);
    }
}
function gerarPyt(){
  if (frameCount %100===0){
    pyt=createSprite(width+20, height-300, 40, 10);
    pyt.addAnimation("voar",pytimg);
    pyt.velocityX=-4;
    pyt.scale=0.5;
    pyt.y=Math.round(random(100,210));
    //ajustar profundidade
    pyt.depth=trex.depth;
    trex.depth=trex.depth+1;
    pyt.lifetime=170;
    

  }
  

  

}
function obstaculos(){
  if(frameCount %60===0){
    var obstaculo=createSprite(1200,height-110,20,30);
    obstaculo.velocityX=-(5+pontos/100);
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstaculo.addImage(cacto1);
              break;
      case 2:obstaculo.addImage(cacto2);
              break;
      case 3:obstaculo.addImage(cacto3);
              break
      case 4:obstaculo.addImage(cacto4);
              break;
      case 5:obstaculo.addImage(cacto5);
              break;
      case 6:obstaculo.addImage(cacto6);
              break;
      default:break;

      
    }
    obstaculo.scale=0.5;
    obstaculo.lifetime=240;
    grupoobstaculos.add(obstaculo);
  }
}
function resetar (){
  estadoJogo=PLAY;
  pontos=0;
  restartimg.visible=false;
  gameoverimg.visible=false;
  grupoobstaculos.destroyEach();
  gruponuvens.destroyEach();
}



