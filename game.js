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
var gap = 150; // расстнояние по вертикали между нашими тубами
var xGap = 250; // расстояние по горизонтали
var music;

function getRandom(arr) {
  rand = Math.floor(Math.random() * arr.length);
  return rand;
}

function create() {
  var colors = ["red", "green", "blue"]; //чтобы у нас как оригинале небо перекрашивалось
  this.cameras.main.setBackgroundColor(getRandom(colors));

  scoreText = this.add.text(birdX, gameHeight / 4, score, {
    fontFamily: "04b19",
    fontSize: 60,
    color: "#fff",
  });
  platforms = this.physics.add.staticGroup();
  var pipePos = gameWidth + 2 * xGap;
  let pos = random_pos();
  platforms.create(pipePos, pos[0], "pipeb").setScale(1).refreshBody();
  platforms.create(pipePos, pos[1], "pipet").setScale(1).refreshBody();

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
      key:"flap",
      frames: this.anims.generateFrameNumbers("birdy", {start: 0, end: 3}),
      frameRate: 20,
      repeat: -1,
  });

  player.body.setGravityY(300) // добавялем как бы "вес" нашему игроку

  this.physics.add.collider(player, platforms, playerHit, null, game)

  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.input.keyboard.on("keydown-"+"SPACE", flapNow);
  this.input.on("pointerdown", flapNow)
}


