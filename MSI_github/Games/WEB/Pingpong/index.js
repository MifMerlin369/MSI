let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 800
  },
  physics: {
    default: 'arcade',
    gravity: false,
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
let ball;
let pad1;
let pad2;
let gameStarted = false;
let paddleSpeed = 350;
let bar;
let score1 = 0;
let victoryTxt1;
let victoryTxt2;
let score2 = 0;
let restartmsg;
let gamepaused = false;

function preload() {
  this.load.image('ball', './assets/ball.png');
  this.load.image('paddle1', './assets/pad1.png');
  this.load.image('paddle2', './assets/pad2.png');
  this.load.image('bar', './assets/bar.png');

}

function create() {

  bar = this.physics.add.sprite(this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'bar');
  ball = this.physics.add.sprite(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'ball'
  );
  ball.setCollideWorldBounds(true);
  ball.setBounce(1.02, 2);

  pad1 = this.physics.add.sprite(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 1 - 40,
    'paddle1'
  );
  pad1.setImmovable(true);
  pad1.setCollideWorldBounds(true);

  pad2 = this.physics.add.sprite(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 20,
    'paddle2'
  );
  pad2.setImmovable(true);
  pad2.setCollideWorldBounds(false, true, false, true);

  this.physics.add.collider(ball, pad1);
  this.physics.add.collider(ball, pad2);

  this.input.on('pointermove', (pointer) => {
    if (pointer.y > bar.y) {
      pad1.x = pointer.x
    }
  })
  victoryTxt2 = this.add.text(this.physics.world.bounds.width / 4, this.physics.world.bounds.height / 2, 'CPU wins');
  victoryTxt2.setVisible(false);
  victoryTxt2.setScale(5);
  victoryTxt1 = this.add.text(this.physics.world.bounds.width / 4, this.physics.world.bounds.height / 2, 'You win');
  victoryTxt1.setVisible(false);
  victoryTxt1.setScale(5);

  restartmsg = this.add.text(this.physics.world.bounds.width / 12, this.physics.world.bounds.height / 2, 'click to restart')
  restartmsg.setScale(6);
  restartmsg.setVisible(false);


}

function update() {
  if (gamepaused && score1 == 1 | score2 == 1) {
    this.scene.restart();

  }


  if (score1 == 1) {
    victoryTxt2.y = bar.y / 2
    victoryTxt2.setVisible(true);
    this.scene.pause();
    gamepaused = true

  }
  if (score2 == 1) {
    victoryTxt1.y = bar.y * 1.5;
    victoryTxt1.setVisible(true);
    this.scene.pause();
    gamepaused = true;
  }

  if (!(gameStarted)) {
    let initVelocityX = (Math.random() * 150) + 100;
    let initVelocityY = (Math.random() * 150) + 100;
    ball.setVelocityX(initVelocityX);
    ball.setVelocityY(initVelocityY);
    gameStarted = true;
    gamepaused = false;

  }
  if (ball.y > pad1.y) {
    score1 += 1;
  }
  if (ball.y < pad2.y / 2) {
    score2 += 1;
  }


  if (ball.body.velocity.y > -paddleSpeed) {
    ball.body.setVelocityY(paddleSpeed)
  }
  if (ball.body.velocity.y < paddleSpeed) {
    ball.body.setVelocityY(-paddleSpeed)
  }
  if (ball.y < bar.y - 100) {

    pad2.x = ball.x + 50

  }
  else {
    pad2.setVelocityX(100)
    pad2.x = this.physics.world.bounds.width / 2;

  }
}