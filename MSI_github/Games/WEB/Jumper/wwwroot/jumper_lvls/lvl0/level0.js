"use strict";
const plm1 = { x: 250, y: 0, width: 100, height: 60,     type: "simple", color: "green",                texture: "grass",  visible: true };
const plm2 = { x: 400, y: 110, width: 360, height: 40,   type: "simple", color: "rgb(0, 0, 0, 0.1)",    texture: "planks", visible: true, changecolor: false };
const plm3 = { x: 0, y: 90, width: 50, height: 40,       type: "simple", color: "green",                texture: "grass",  visible: true };
const plm4 = { x: 100, y: 200, width: 70, height: 50,    type: "simple", color: "green",                texture: "grass",  visible: true };
const plm5 = { x: 230, y: 290, width: 80, height: 40,    type: "simple", color: "rgb(0, 0, 0, 0.1)",    texture: "planks", visible: true, changecolor: false };
const plm6 = { x: 600, y: 240, width: 350, height: 40,   type: "simple", color: "green",                texture: "grass",  visible: true };
const plm7 = { x: 1100, y: 350, width: 100, height: 150, type: "simple", color: "green",                texture: "grass",  visible: true };
const plm8 = { x: 1050, y: 480, width: 50, height: 20,   type: "simple", color: "green",                texture: "grass",  visible: true };
const plm9 = { x: 980, y: 0, width: 100, height: 30,     type: "lifting", color: "rgb(0, 0, 0, 0.1)",   texture: "lift",   visible: true, changecolor: false,  speed: 2, direction: "down", heightMax: 290, heightMin: 30};
const plm10 = { x: 800, y: 280, width: 100, height: 30,  type: "lifting", color: "rgb(0, 0, 0, 0.1)",   texture: "lift",   visible: true, changecolor: false, speed: 1.5, direction: "down", heightMax: 150, heightMin: 30};
const plm11 = { x: 250, y: 460, width: 40, height: 40,   type: "breakable", color: "rgb(0, 0, 0, 0.1)", texture: "box",    visible: true, changecolor: false};
const plm12 = { x: 430, y: 290, width: 40, height: 40,   type: "breakable", color: "rgb(0, 0, 0, 0.1)", texture: "box",    visible: true, changecolor: false};
const plm13 = { x: -15, y: 90, width: 15, height: 500,   type: "simple", color: "rgb(2, 110, 20)",                         visible: true };
const plm14 = { x: -10, y: 0, width: 15, height: 90,     type: "simple", color: "rgb(2, 110, 20)",                         visible: true };
const plm15 = { x: -500, y: 0, width: 15, height: 90,    type: "simple", color: "orange",                                  visible: true };

const lvlend = { x: 1190, y: 500, width: 10, height: 90, type: "ghost", color: "orange", changecolor: false, visible: false };

const platforms = [plm1, plm2, plm3, plm4, plm5, plm6, plm7, plm8, plm9, plm10, plm11, plm12, plm13, plm14, plm15];
const World_edge_left = -500;
const World_edge_right = 1200;
let WScreen_edge_left = 0;
let WScreen_edge_right = World_edge_right;

coins.y = 550;

//===============
SPL_cord_read(0)
redrawAll();
//===============



function redrawAll()
{
    SPL_special();

    if (DEVgravity)
    {
        Cgravity(jumper);
        Cmovement(jumper);
    }
    moveScreen();

    SPL_UnD();
    SPL_cord_write(0);

    ctx.save();

    ctx.fillStyle = "red"
    ctx.fillRect(0, -10, canva.width, canva.height);
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, 1200, canva.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0, -10, 1200, 10);

    if (Misha.grafics)
    {
        GRC_background();
    }

    ctx.restore();


    ctx.save();
    ctx.translate(WorldAnchor.x, WorldAnchor.y);

    PLM_logics(platforms)
    drawJumper();

    if (Misha.grafics)
    {
        GRC_textures();
    }

    SPL_lvl_end();

    ctx.restore();


    ctx.save();

    drawCoins();

    ctx.restore();
    if (Misha.musics)
    {
        MUS_drawAll();
    }
    plinks();
    requestAnimationFrame(redrawAll);
}

function SPL_lvl_write()
{

}

function SPL_lvl_read()
{

}

function SPL_special()
{
    if (plm11.visible == false)
    {
        plm14.visible = false;
        WScreen_edge_left = World_edge_left;
    }
}


function drawCoins()
{
    ctx.save();
    ctx.translate(coins.x, coins.y);
    ctx.scale(1, -1);


    ctx.fillStyle = coins.color;
    ctx.font = "30px Arial";
    ctx.fillText("Coins: " + coins.value, 0, 0);

    ctx.restore();
}
