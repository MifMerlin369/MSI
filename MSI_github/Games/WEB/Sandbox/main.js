var canvas = document.getElementById("canvas");
var width = window.innerWidth;
var height = window.innerHeight/3*2;
var Ctx = initCanvas(canvas, width, height)

function initCanvas (canvas, width, height){
  canvas.width=width;
  canvas.height=height;
  return canvas.getContext("2d")
}

class pixel {
  sb;
  x;
  y;
  color = "black";
  update = function (){};
  type=0;
}

class sandbox {
  ctx;
  sizeX;
  sizeY;
  countX;
  cointY;
  empty = new pixel();
  
  box = [];
  
  init (ctx, sizeX, sizeY, countX, countY){
    this.ctx=ctx;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.countX = Math.floor(countX);
    this.countY = Math.floor(countY);
    this.setUpBox();
  }
  
  setUpBox (){
    for(var x = 0;x<=this.countX;x++){
      this.box.push([]);
      for(var y = 0;y<=this.countY;y++){
        var pxl = new pixel();
        pxl.sb=this;
        pxl.x=x;
        pxl.y=y;
        this.box[x].push(pxl);
      }
    }
  }
  
  update (){
    var update = [];
    for(var x = 0;x<this.box.length;x++){
      for(var y = 0;y<this.box[x].length;y++){
        update.push(this.box[x][y]);
      }
    }
    this.shuffleArray(update);
    for(var i = 0;i<update.length;i++){
      update[i].update();
    }
    this.render();
  }
  
  render (){
    for(var x = 0;x<this.box.length;x++){
      for(var y = 0;y<this.box[x].length;y++){
        this.ctx.fillStyle = this.box[x][y].color;
        this.ctx.fillRect(this.sizeX*x, this.sizeY*y, this.sizeX, this.sizeY)
      }
    }
  }
  
  setpxl (pxl, x, y){
    if(this.getpxl(x, y).type==-1){
      return;
    }
    this.box[x][y] = pxl;
    this.box[x][y].x = x;
    this.box[x][y].y = y;
    this.box[x][y].sb=this;
  }
  
  movepxl (x, y, nx, ny){
    if(this.getpxl(nx, ny).type==-1){
      return;
    }
    this.box[nx][ny] = this.box[x][y];
    this.box[x][y] = new pixel();
    this.box[nx][ny].x = nx;
    this.box[nx][ny].y = ny;
  }
  
  swappxl(x, y, ox, oy){
    var p1 = this.getpxl(x, y);
    var p2 = this.getpxl(ox, oy);
    this.setpxl(p1, ox, oy);
    this.setpxl(p2, x, y);
  }
  
  getpxl (x, y){
    if(x>=this.box.length || x<0 || y>=this.box[0].length || y<0){
      var p = new pixel();
      p.type = -1;
      return p
    }
    else{
      return this.box[x][y]
    }
  }
  
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}

const stdBlocks = {
  
  empty: function (){
    var p = new pixel()
    return p;
  },
  ground: function (){
    var p = new pixel();
    p.type=1;
    p.color = "#795548";
    p.update = function (){};
    return p;
  },
  water: function (){
    var p = new pixel();
    p.type=2;
    p.color = "#2196F3";
    p.update = function (){
      var r = false;
      var l = false;
      var d = false;
      if(this.sb.getpxl(this.x, this.y+1).type==0){
        d=true;
      }
      else if(this.sb.getpxl(this.x+1, this.y+1).type==0 && this.sb.getpxl(this.x+1, this.y).type==0){
        r=true;
      }
      else if(this.sb.getpxl(this.x-1, this.y+1).type==0 && this.sb.getpxl(this.x-1, this.y).type==0){
        l=true
      }
      
      if(d){
        this.sb.movepxl(this.x, this.y, this.x, this.y+1);
      }
      else if(r&&l){
        if(Math.floor(Math.random()*2)==0){
          this.sb.movepxl(this.x, this.y, this.x+1, this.y)
        }
        else{
          this.sb.movepxl(this.x, this.y, this.x-1, this.y)
        }
      }
      else if(r){
        this.sb.movepxl(this.x, this.y, this.x+1, this.y)
      }
      else if(l){
        this.sb.movepxl(this.x, this.y, this.x-1, this.y)
      }
      else{
        var r = Math.floor(Math.random()*3)
        if(r==0 && this.sb.getpxl(this.x-1, this.y).type==0){
          this.sb.movepxl(this.x, this.y, this.x-1, this.y)
        }
        if(r==2 && this.sb.getpxl(this.x+1, this.y).type==0){
          this.sb.movepxl(this.x, this.y, this.x+1, this.y)
        }
      }
      
    };
    return p;
  },
  oil: function (){
    var p = new pixel();
    p.type=3;
    p.color = "#9E9E9E";
    p.update = function (){
      var r = false;
      var l = false;
      var d = false;
      if(this.sb.getpxl(this.x, this.y-1).type==2){
        this.sb.swappxl(this.x, this.y, this.x, this.y-1)
      }
      if(this.sb.getpxl(this.x, this.y+1).type==0){
        d=true;
      }
      else if(this.sb.getpxl(this.x+1, this.y+1).type==0 && this.sb.getpxl(this.x+1, this.y).type==0){
        r=true;
      }
      else if(this.sb.getpxl(this.x-1, this.y+1).type==0 && this.sb.getpxl(this.x-1, this.y).type==0){
        l=true
      }
      
      if(d){
        this.sb.movepxl(this.x, this.y, this.x, this.y+1);
      }
      else if(r&&l){
        if(Math.floor(Math.random()*2)==0){
          this.sb.movepxl(this.x, this.y, this.x+1, this.y)
        }
        else{
          this.sb.movepxl(this.x, this.y, this.x-1, this.y)
        }
      }
      else if(r){
        this.sb.movepxl(this.x, this.y, this.x+1, this.y)
      }
      else if(l){
        this.sb.movepxl(this.x, this.y, this.x-1, this.y)
      }
      else{
        var r = Math.floor(Math.random()*3)
        if(r==0 && this.sb.getpxl(this.x-1, this.y).type==0){
          this.sb.movepxl(this.x, this.y, this.x-1, this.y)
        }
        if(r==2 && this.sb.getpxl(this.x+1, this.y).type==0){
          this.sb.movepxl(this.x, this.y, this.x+1, this.y)
        }
      }
      
    };
    return p;
  }
}

var s = 100;
var sb = new sandbox();
sb.init(Ctx, width/s, width/s, s, height/(width/s));

/*for(var i = 0;i<sb.box.length;i++){
  sb.setpxl(stdBlocks.ground(), i, 50);
}*/

//sb.setpxl(stdBlocks.water(), Math.floor(Math.random()*50), 0)
/*function water (){
for(var x = 0;x<10;x++){
  for(var y = 0;y<10;y++){
    sb.setpxl(stdBlocks.water(), x+20, y);
  }
}
window.setTimeout(water, 2000)
}
water()*/
sb.render();

function update (){
  sb.update();
  window.setTimeout(update.bind(this), 50)
}
update();

var select = "water";

canvas.addEventListener("touchstart", touchStart.bind(this), false);
  canvas.addEventListener("touchmove", touchMove.bind(this), false);

function touchStart(evt) {
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    for(var x = -1;x<2;x++){
      for(var y = -1;y<2;y++){
        sb.setpxl(stdBlocks[select](), Math.floor(touches[i].pageX/sb.sizeX)+x, Math.floor(touches[i].pageY/sb.sizeY)+y)
      }
    }
  }
}

function touchMove(evt) {
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    for(var x = -1;x<2;x++){
      for(var y = -1;y<2;y++){
        sb.setpxl(stdBlocks[select](), Math.floor(touches[i].pageX/sb.sizeX)+x, Math.floor(touches[i].pageY/sb.sizeY)+y)
      }
    }
  }
}