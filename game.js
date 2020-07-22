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
  this.load.image("sky", "assets/sky.png");
  this.load.image("pipeb", "assets/pipeb.png");
  this.load.image("pipet", "assets/pipet.png");
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
  var colors = ["#80ff80", "#000080", " #800080"]; //чтобы у нас как оригинале небо перекрашивалось
  this.cameras.main.setBackgroundColor(colors[getRandom(colors)]); // ЗДЕСЬ НЕМНОГО ПОПРАВИЛ

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

  player = this.physics.add.sprite(birdX, birdY, "birdy")
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

function random_pos(){
    let safePadding = 25; //безопасный вертикальный отступ
    let min = Math.ceil(safePadding + gap / 2);
    let max = Math.floor(game.canvas.height - safePadding - gap/2)
    let ran = Math.floor(Math.random() * (max - min  + 1)) + min
    let rantop = ran - (gap / 2 + 260) // 260 доп расстояние
    let ranbot = ran - (gap / 2 + 260) // 260 доп расстояние
    return [ranbot, rantop]
}

var countpipe = 0;
function update(){
    var children = platforms.getChildren(); //получаем детей наших платформ
    children.forEach((child) => {
        if(child instanceof Phaser.GameObjects.Sprite){
            child.refreshBody();
            child.x +=  -3;
            if(child.x <= gameWidth && !child.drawn){
                countpipe += 1;
                child.drawn = true;

                if (countpipe >= 2){
                    let pos = random_pos();
                    platforms
                    .create(gameWidth + xGap, pos[0], "pipeb")
                    .setScale(1)
                    .refreshBody();

                    platforms
                    .create(gameWidth + xGap, pos[1], "pipet")
                    .setScale(1)
                    .refreshBody();
                    countpipe = 0;
                }
            }
            if (child.x <= -50){
                child.destroy();
            }
            if(
                child.x < birdX &&
                !gameOver &&
                child.texture.key == "pipeb"&&
                !child.scored
            ){
                child.scored = true;
                score += 1;
                scoreText.setText(score)
                game.sound.play("score")
            }
        }
    }) ;
    if (player.y > Number(game.canvas.height) + 200){
        endGame();
    }
    if (player.y < -200){
        endGame();
    }
}
function flapNow(){
    if(gameOver) return;

    player.setVelocityY(-330);
    game.sound.play('flap');
    player.play("flap", true)
}
var hitFlag = false;
function playerHit(){
    if (hitFlag) return;
    var hitSound = game.sound.play("hit");
    hitflag = true;
    setTimeout(() => {
        playerDead
    }, 300);
}

