var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

var config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 550 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
const pipeWidth = 52; // ширина трубы, об которую может ударяться птица. Может пригодится в геймдизайне
var game = new Phaser.Game(config); //создаем экземпляр нашей игры
var gameOver = false;
var score = 0;
var birdX = gameWidth / 2 - 50;
var birdY = gameHeight / 2 - 50;

function preload() {
  this.load.images("sky", "assets/sky.png");
  this.load.images("pipeb", "assets/pipeb.png");
  this.load.images("pipet", "assets/pipet.png");
  this.load.spritesheet("birdy", "assets/birdy.png", {
    frameWidth: 34,
    frameHeight: 24,
  });

  this.load.audio("flap", "./assets/sounds/sfx_wing.ogg");
  this.load.audio("hit", "./assets/sounds/sfx_hit.ogg");
  this.load.audio("die", "./assets/sounds/sfx_die.ogg");
  this.load.audio("score", "./assets/sounds/sfx_point.ogg");
}

var platforms, spacebar, player, scoreText;
var gap = 150;// расстнояние по вертикали между нашими тубами
var xGap = 250; // расстояние по горизонтали
var music;

function create(){
    
}
