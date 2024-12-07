/*Main JS file*/
/*Defining Canvas start*/
var canvas = document.getElementById('canvas');
var ctxt = canvas.getContext('2d');
/*Defining canvas end*/
/*Importing elements start*/
var knb = document.getElementById("knb");
/*Importing elements end*/
/*Defining positioning variables start*/
var x = 100;
var y = 100;
var a = 800;
var b = 800;
let p = Math.random() * (945 - 70);
let q = Math.random() * (800 - 70);
var r = 70;
var s = 50;
var skill = 1;
var difficulty = 1;
/*Defining positioning variables end*/
/*Defining Image variables start*/
var img = new Image();
img.src = 'Point.png';
var img2 = new Image();
img2.src = 'bucket.png';
var sly = new Image();
sly.src = 'Enemy.png';
var img3 = new Image();
img3.src = 'iron_ingot.png';
/*Defining Image variables end*/
/*Defining stats start*/
var score = 0;
var health = 100;
/*Defining stats end*/
/*Drawing start*/
function drawCharacters() {
  ctxt.clearRect(0, 0, 1000, 1000);
  ctxt.beginPath();
  ctxt.rect(x, y, 10, 10);
  ctxt.beginPath();
  ctxt.rect(p, q, 0, 0);
  ctxt.beginPath();
  ctxt.drawImage(img, p - 30, q - 30, 70, 70);
  ctxt.beginPath();
  ctxt.drawImage(img2, x, y, 120, 120);
  ctxt.beginPath();
  ctxt.rect(a, b, 0, 0);
  ctxt.beginPath();
  ctxt.drawImage(sly, a, b, 120, 120);
  /*Drawing end*/
  /*Enemy start*/
  if (a >= x) {
    a--;
    a -= 17;
  }
  if (x >= a) {
    a++;
    a += 17;
  }
  if (b >= y) {
    b--;
    b -= 17;
  }
  if (y >= b) {
    b++;
    b += 17;
  }
  /*Enemy end*/
  /*Drawing and activating Score start*/
  ctxt.beginPath();
  ctxt.font = '30px times';
  ctxt.fillStyle = 'white';
  ctxt.fillText('Points: ' + score, 750, 100);
  if (p <= x + 100 && x <= p + 50 && q <= y + 120 && y <= q + 50) {
    score++;
    p = Math.random() * (945 - 50);
    q = Math.random() * (800 - 50);
  }
  /*Drawing and activating Score end*/
  /*Drawing Skill start*/
  ctxt.beginPath();
  ctxt.font = '30px times';
  ctxt.fillStyle = 'white';
  ctxt.fillText('Skill level: ' + skill, 60, 50);
  /*Drawing Skill end*/
  /*Drawing Difficulty start*/
  ctxt.beginPath();
  ctxt.font = '30px Times';
  ctxt.fillStyle = 'white';
  ctxt.fillText('Difficulty level: ' + difficulty, 60, 100);
  /*Drawing Difficulty end*/
  /*Drawing and activating Health reduction, Game over start*/
  /*ctxt.beginPath();
    ctxt.font='30px times';
    ctxt.fillStyle='white';
    ctxt.fillText('Health: '+ health,750,100);*/
  if (a <= x + 50 && x <= a + 5 && b <= y + 50 && y <= b + 5) {
    health--;
    health -= 10;
    img2.style.filter = 'grayscale(150)';
  }

  if (health <= 0) {
    alert('Game over. \nThe game will now restart.');
    x = 100;
    y = 100;
    a = 800;
    b = 800;
    score = 0;
    health = 100;
  }
  /*Drawing and activating health, Game over end*/
  /*ctxt.beginPath();
  ctxt.moveTo(0,400);
  ctxt.lineTo(400,400);
  ctxt.lineTo(700,800);
  ctxt.stroke();*/
  /*Heal up start*/
  var m = 50;
  var n = 50;
  var subhelt = function subhelt() {
    ctxt.beginPath();
    ctxt.drawImage(img3, m, n, 100, 100);
  };

  function helt() {

    if (score == 0) {
      subhelt;
    }
    else if (score == 20) {
      subhelt;
    }
    if (m <= x + 100 && x <= m + 50 && n <= y + 120 && y <= n + 50) {
      health += 20;
      img3.src = '';
      m = '';
      n = '';
    }
    if (health >= 100) {
      health = 100;
    }
  }


  /*Heal up end*/
  knb.value = health;
}

/*Activating buttons start*/

function up() {
  y++;
  y -= s;
  if (y <= 0) {
    y = 0;
  }
  if (score >= 20) {
    y++;
    y -= 20;
    skill = 2;
  }
  if (score >= 40) {
    y++;
    y -= 40;
    skill = 3;
  }
}

function right() {
  x++;
  x += r;
  if (x >= 845) {
    x = 845;
  }
  if (score >= 20) {
    x++;
    x += 20;
    skill = 2;
  }
  if (score >= 40) {
    x++;
    x += 40;
    skill = 3;
  }
}

function down() {
  y++;
  y += s;
  if (y >= 700) {
    y = 700;
  }
  if (score >= 20) {
    y++;
    y += 20;
    skill = 2;
  }
  if (score >= 40) {
    y++;
    y += 40;
    skill = 3;
  }
}

function left() {
  x++;
  x -= r;
  if (x <= 0) {
    x = 0;
  }
  if (score >= 20) {
    x++;
    x -= 20;
    skill = 2;
  }
  if (score >= 40) {
    x++;
    x -= 40;
    skill = 3;
  }
}
/*Activating buttons end*/
/*Difficulty statis start*/
/*Difficulty statis end*/
/*Draw function start*/
setInterval(drawCharacters, 100);
/*Draw function end*/