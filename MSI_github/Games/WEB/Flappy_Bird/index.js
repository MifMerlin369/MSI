alert('hello');
class Destination extends Phaser.Scene {
  constructor() {
    super('reached');
  }
  preload() {
    this.load.image('game-over', './assets/gameover.png')
  }
  create() {

    this.add.image(400, 300, 'game-over').setScale(2)
    this.time.addEvent({
      delay: 1000,
      callback: () => { this.add.text(200, 0, 'click to restart !', { font: '64px Arial' }).setOrigin(0) },
      callbackScope: this,
      loop: true
    });
    this.input.on('pointerdown', () => {
      this.scene.start('main')
    });

  }
}

class Main extends Phaser.Scene {
  constructor() {
    super('main')
    this.player;
    this.clicked;
    this.pipes;
    this.score;
    this.scoreText = 0;
    this.floor;
    this.hit;
    this.onhit = false;
    this.die;

  }
  init() {
    //this.scoreText = 0;
    this.onhit = false;

  }
  preload() {
    this.load.image('floor', './assets/base.png')
    this.load.image('background', './assets/background-day.png')
    this.load.image('green-pipe', './assets/pipe-green.png')
    this.load.image('red-pipe', './assets/pipe-red.png')
    this.load.image('bird-upflap', './assets/bluebird-upflap.png')
    this.load.image('bird-midflap', './assets/bluebird-midflap.png')
    this.load.image('bird-downflap', './assets/bluebird-downflap.png');
    this.load.audio('die', './assets/die.wav')
    this.load.audio('wing', './assets/wing.wav')
    this.load.audio('hit', './assets/hit.wav')
  }
  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setScale(3, 1).setScrollFactor(0);
    let wing = this.sound.add('wing')
    this.die = this.sound.add('die')
    this.hit = this.sound.add('hit')

    this.pipes = this.physics.add.staticGroup()
    for (let i = 0; i < 3; i++) {
      const x = 300 * i;
      const y = Phaser.Math.Between(340, 400);
      const pipe1 = this.pipes.create(x, y, 'green-pipe').setScale(2, 1)
      const pipe2 = this.pipes.create(x, -65, 'green-pipe').setScale(2, 1).setFlipY(true)
      const body1 = pipe1.body;
      body1.updateFromGameObject();
      const body2 = pipe2.body;
      body2.updateFromGameObject();
    }

    this.floor = this.physics.add.image(0, this.physics.world.bounds.height - 100, 'floor').setOrigin(0).setScale(2.39, 1).setScrollFactor(0)

    this.player = this.physics.add.sprite(100, 150, 'bird-upflap').setOrigin(0)
    this.physics.add.overlap(this.player, this.pipes)
    this.input.on('pointerdown', () => {
      wing.play()
      this.clicked = true;
      this.player.setTexture('bird-downflap')

    });
    this.input.on('pointerup', () => {

      this.clicked = false;
      this.player.setTexture('bird-upflap')
    })
    this.cameras.main.setBounds(0, 0, 10000, 50)
    this.cameras.main.startFollow(this.player);
    this.score = this.add.text(200, 0, `score: ${this.scoreText}`, { font: '64px Arial', color: '#f0000f' }).setScrollFactor(0);
    this.time.addEvent({
      delay: 3000,
      callback: this.handleScore,
      callbackScope: this,
      loop: true
    })
    this.physics.add.overlap(this.player, this.pipes, () => {
      this.onhit = true;

    })
    this.floor.setCollideWorldBounds(true)
  }
  update() {
    if (this.onhit == true) {
      this.player.setVelocityX(0);
      this.die.play()
      this.scene.pause(this)
      this.scene.start('reached')

    }
    if (this.player.y > this.floor.y - 50) {
      this.hit.play()
      setTimeout(() => { this.scene.start('reached') }, 16)
    }
    this.pipes.children.iterate(child => {
      const pipe = child;
      const scrollX = this.cameras.main.scrollX;
      if (pipe.x <= scrollX - 50) {
        pipe.x = scrollX + Phaser.Math.Between(800, 820);
        pipe.body.updateFromGameObject();
      }
    })

    if (this.clicked == true) {
      this.player.setVelocity(100, -200);
    }
  }
  handleScore() {
    this.scoreText++;
    this.score.text = `score: ${this.scoreText}`;
  }

}
class FirstScene extends Phaser.Scene {
  constructor() {
    super('firstScene')
  }
  preload() {
    this.load.image('message', './assets/message.png')
  }
  create() {
    this.add.image(220, 10, 'message').setOrigin(0).setScale(2)
    this.time.addEvent({
      delay: 2000,
      callback: () => { this.scene.start('main') },
      callbackScope: this,
      loop: false
    })
  }
}

const config = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  parent: 'phaser-game',
  pixelArt: true,
  scene: [FirstScene, Main, Destination]
};

const game = new Phaser.Game(config);