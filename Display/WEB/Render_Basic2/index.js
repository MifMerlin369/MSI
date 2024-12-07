var canvas = document.querySelector("canvas");
var draw = canvas.getContext("2d");
//fabricas
var line = (x1,y1,x2,y2,c) => {//linha
    draw.beginPath();
    draw.moveTo(x1,y1);
    draw.lineTo(x2,y2);
    draw.strokeStyle = `rgb(${x1},${y1},${x1/y1})`;
   // draw.strokeStyle =c ||"lime"
    draw.stroke();
};
var text = (t,x,y) => {
    draw.fillStyle="white"
    draw.font = "10px Arial";
    draw.fillText(t, x,y);
};
var loop = (f) => {//repetir
    window.requestAnimationFrame(f);
};
var rect = (x,y,w,h,c) => {
    draw.fillStyle = c ;
    draw.fillRect(x,y,w,h)
};
 var w = 0 ;
 var h = 0 ;
 function triangle(p1,p2,p3){
     draw.beginPath();
    draw.moveTo(p1[0],p1[1]);
    draw.lineTo(p2[0],p2[1]);
    draw.lineTo(p3[0],p3[1])
    draw.lineTo(p1[0],p1[1])
    draw.strokeStyle = "#D9D6C7"
    draw.fillStyle = "#FDFFD2"
    //draw.fillStyle = `rgb(${p1[0]+p2[0]+p3[0]},${p1[1]+p2[1]+p3[1]},${p1[2]+p2[2]+p3[2]})`
    draw.fill();
    draw.stroke()
    
 }
 function triangleShadow(p1,p2,p3,i1,i2,i3){
     draw.beginPath();
    draw.moveTo(p1[0],p1[1]);
    draw.lineTo(p2[0],p2[1]);
    draw.lineTo(p3[0],p3[1])
    draw.lineTo(p1[0],p1[1])
    draw.strokeStyle = "#FFC74A"
    draw.fillStyle = "#FDFFD2"
    
    draw.fillStyle = `rgb(${p1[0]+p2[0]+p3[0]},${p1[1]+p2[1]+p3[1]},${p1[2]+p2[2]+p3[2]})`
    draw.fillStyle = `rgb(${ 255 -Math.abs(point[i1][1]*100)},${255 -Math.abs(point[i2][1]*100)},${255 -Math.abs(point[i3][1]*100)})`
    draw.strokeStyle = draw.fillStyle
   //console.log(draw.fillStyle)
    draw.fill();
    draw.stroke()
 }
//3d function
var mx = 1,mnx = -1 , my = 1 , mny = -1 ;
 function perspective(p){
     var x = p[0];
     var y = p[1];
     var z = p[2];
     var perspective = 5
     
     return [
         x / ( z + perspective ) ,
         y / ( z + perspective )
     ];
 }
 function project(p){
     var perspectivePoint = perspective(p);
     var x = perspectivePoint[0];
     var y = perspectivePoint[1];
     return [
        w * ( x - (-2))/(2 -(-2)),
        h * ( 1 - ( y - (-2))/(2-(-2)))
    ];
 }
 var view = 0
 var cont = 0
 var z = 0
 function renderPoints(p,i){
    // p[2] += z
     var projectedPoint = project(p);
     var x = projectedPoint[0];
     var y = projectedPoint[1];
     
         //console.log(cont)
    
    //this.den = function(){
     if(view == 0){
     line(x,y,x+1,y+1)
     }
     
     var p1 = renderedPoints[i+c]
     var p2  = undefined
     if(cont < c){
     var p2 = renderedPoints[i+1]
     }
     //console.log(c-1,cont)
     p3 = undefined
     if(cont <c){
     var p3 = renderedPoints[i+c+1]
     }
     if(view == 1){
         cor ="#fff"
     if(p1 !== undefined  ){
        if(p1[2] <=flow && p1[2] >=fliw){
        line(x,y,p1[0],p1[1],cor)
        }
     }
     if(p2 !== undefined){
         if(p2[2] <= flow && p2[2] >= fliw){
      line(x,y,p2[0],p2[1],cor)
         }
     }
     if(p3 !== undefined){
         if(p3[2] <= flow && p3[2] >= fliw){
         line(x,y,p3[0],p3[1],cor)
         }
     }
     
     //line(x,y,x+1,y+1,"red")
     }
     if(view == 2){
         p2 = undefined 
         p3 = undefined
         p1 = renderedPoints[i]
         if(cont < c){
         p2 = renderedPoints[i+1]
         
         
         p3 = renderedPoints[i+c+1]
         }
         p4 = renderedPoints[i+c]
         if(p1 !== undefined && p2 !== undefined && p3 !== undefined&& p4 !== undefined && p1[2] <= flow && p1[2] >= fliw&&p2[2] <= flow && p2[2] >= fliw && p3[2] <= flow && p3[2] >= fliw && p4[2] <= flow && p4[2] >= fliw ){
             triangle(p1,p2,p3)
             triangle(p1,p4,p3)
         }
     }
     if(view == 3){
         p2 = undefined 
         p3 = undefined
         p1 = renderedPoints[i]
         
         if(cont < c){
         p2 = renderedPoints[i+1]
         
         p3 = renderedPoints[i+c+1]
         }
         p4 = renderedPoints[i+c]
         if(p1 !== undefined && p2 !== undefined && p3 !== undefined&& p4 !== undefined && p1[2] <= flow && p1[2] >= fliw&&p2[2] <= flow && p2[2] >= fliw && p3[2] <= flow && p3[2] >= fliw && p4[2] <= flow && p4[2] >= fliw ){
             triangleShadow(p1,p2,p3,i,i+1,i+c+1)
             triangleShadow(p1,p4,p3,i,i+c,i+c+1)
         }
     }
    
    return [x,y,p[2]]
 }
 function returnPoints(p,i){
     var projectedPoint = project(p);
     var x = projectedPoint[0];
     var y = projectedPoint[1];
     
    return [x,y,p[2]]
 }
 function cos(n){
     return Math.cos(n);
 }
 function sin(n){
     return Math.sin(n);
 }
 function rotateX(p,r){
    x = p[0] 
    y = p[1]
    z = p[2]
    return [
        cos(r) * x - sin(r) * z,
        y,
        sin(r) * x + cos(r) * z
        
    ]
}
 function rotateY(p,r){
    x = p[0] 
    y = p[1]
    z = p[2]
    return [
        x,
        cos(r) * y - sin(r) * z,
        sin(r) * y + cos(r) * z
        
    ]
}
//FPs
var before,now,fps;
before=Date.now();
fps=0;
requestAnimationFrame(
    function loop(){
        now=Date.now();
        fps=Math.round(1000/(now-before));
        before=now;
        requestAnimationFrame(loop);
        
    }
 );
//function
var point = [];
function Vector3(x,y,z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    point.push([this.x,this.y,this.z])
}
var renderedPoints = [] ;
c = 0
seed = 0
function perlin(x,y){
    nn = Math.pow(x - 0.5,2)+Math.pow(y-0.5,2)
    n = sin(Math.sqrt(nn))
    n += sin(x)
    n += sin(x+y)
    n-= cos(x+y)
    n*=seed
    return n
}
function initPoint(X,Y,Z){
    var s = 0.5
    var mp = 3

    a = 1
    seed = Math.random()*Math.random()*Math.E
    for(var x = -mp; x <= mp;x+=s){
            for(var z = -mp; z <= mp;z+=s){
               y = cos(x*seed)*sin(z*seed)*(Math.random()*a*Math.random())
              // y +=  cos(x*seed)+sin(z*seed) *Math.random()**3  
              y = perlin(x,z)
              // y += cos(x*2)+sin(z*2)
             // y = perlin(x,z)
               // y = 0
                point.push([x+X+seed ,y+Y,z+Z+seed]);
            }
    }
    
    c = mp*(s*10-1)+1
    
}
function cube(){
    s = 2
    for(var x = - 1; x <= 1;x+=s){
        for(var y = - 1; y <=1;y+=s){
            for(var z = - 1; z <= 1;z+=s){
                new Vector3(x,y,z) 
    }
    }
    }
}
var rx= 0;
var ry = -0.45
var flow = 5
var fliw = -5
var opera = 0
var obg = ""
function loadObg(file){
        //file = file.replaceAll(":","()")
        file = file.replaceAll(";",");")
        file = file.replaceAll("v","Vector3(")
        eval(file)
        return file
    }
function main(){
    //renderedPoints=[]
   rx+=0.005
    opera++
     w = innerWidth ;
     h = innerHeight ;
     
     //rx += 0.01;
    canvas.width = w ;
    canvas.height = h ;
    rect(0,0,w,h,"black");//background
    text("pontos "+point.length,10,10)
    text("FPS "+fps+"    "+Math.floor((fps*100)/70)+" % do fps completo",10,20)
    text("opera "+Math.floor(opera/10)+" seg",10,30)
    text("seed "+seed+" ",10,70)
    text("ver 0.0.2",w-60,h-20)
    text("alpha",w-60,h-30)
    
    
    cont=0
    obg = ""
    
    point.forEach(function(p,i){
        obg+=`v  ${p[0]} , ${p[1]} , ${p[2]} ;`
        if(cont >c-1){
        cont = 0
        // i-=1
          }
        cont++

     
       // p[2]-=0.03
        p = rotateX(p,rx)
        p = rotateY(p,ry) 
        renderedPoints[i] = returnPoints(p)
        
        if(p[2] <= flow&& p[2] >= fliw && p[0] > -w/2 && p[0] < w/2 ){
        renderPoints(p,i)
        }
        
    })
    if(ry > 1.50){
        ry = 1.49
    }else if(ry < -1.50){
        ry = -1.49
    }
    
    loop(main)
}

//cube()

initPoint(0,0,0)
//initPoint(5,0,0)
main()
var ax = 0,ay = 0 ,nx = 0, ny = 0
canvas.addEventListener("touchmove",function(e){
    nx = e.touches[0].clientX 
    ny = e.touches[0].clientY
    
    if(ny > ay){
      ry-=0.04
    }else{
      ry+=0.04
    }
    if(nx > ax){
        rx+=0.03
        
    }else{
        rx-=0.03
        
    }
    
    
    
    ax = nx 
    ay = ny
    
    
    
})
function set(){
   view+=1 
    if(view > 3){
        view = 0
    }
    //Vector3(event.pageX/100,0,0)
}