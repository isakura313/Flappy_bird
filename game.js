var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    scale:{
        mode:Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y: 550},
            debug: false
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update,
    }
}
