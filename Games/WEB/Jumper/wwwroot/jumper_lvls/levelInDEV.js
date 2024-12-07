"use strict";
window.Misha = window.Misha || Object.create(null);
Misha.lvl2 = {};
// Misha.noControl = true;

Misha.lvl2.background = ctx.createLinearGradient(canva.width, canva.height, 0, 200);
Misha.lvl2.background.addColorStop(0, 'rgba(255,251,18,1)');
Misha.lvl2.background.addColorStop(0.53, 'rgba(5,255,155,1)');
Misha.lvl2.background.addColorStop(1, 'rgba(0,255,255,1)');

Misha.lvl2.w = { x: 150, y: 150, width: 500, height: 300 };
Misha.lvl2.sprites = {};
Misha.lvl2.sprites.count = 500;
Misha.lvl2.sprites.width = 12;

Misha.lvl2.imgs = {};
Misha.lvl2.img = {};
Misha.lvl2.imgs.inDEV = new Image();
Misha.lvl2.imgs.inDEV.src = "pictures/inDEV.png";
Misha.lvl2.imgs.inDEV.onload = function ()
{
    Misha.lvl2.img.inDEV = true;
}

const platforms = [];
Misha.lvl2.buttons = [
    { x: 20, y: 400, width: 110, height: 50, color: "#f80", Tcolor: "#07f", value: "500sp", Tvalue: "500", Tx: 30, Ty: 13, Tscale: 30, id: 1 },
    { x: 20, y: 340, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "1000sp", Tvalue: "1000", Tx: 20, Ty: 13, Tscale: 30, id: 2 },
    { x: 20, y: 280, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "1500sp", Tvalue: "1500", Tx: 20, Ty: 13, Tscale: 30, id: 3 },
    { x: 20, y: 220, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "2000sp", Tvalue: "2000", Tx: 20, Ty: 13, Tscale: 30, id: 4 },
    { x: 20, y: 160, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "5000sp", Tvalue: "5000", Tx: 20, Ty: 13, Tscale: 30, id: 5 },
    { x: 350, y: 460, width: 110, height: 50, color: "transparent", Tcolor: "#07f", value: "sp", Tvalue: 0, Tx: 20, Ty: 13, Tscale: 30, id: "sp" },

    { x: 670, y: 400, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "2w", Tvalue: "2x2", Tx: 30, Ty: 13, Tscale: 30, id: 6 },
    { x: 670, y: 340, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "4w", Tvalue: "4x4", Tx: 30, Ty: 13, Tscale: 30, id: 7 },
    { x: 670, y: 280, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "8w", Tvalue: "8x8", Tx: 30, Ty: 13, Tscale: 30, id: 8 },
    { x: 670, y: 220, width: 110, height: 50, color: "#f80", Tcolor: "#07f", value: "12w", Tvalue: "12x12", Tx: 15, Ty: 13, Tscale: 30, id: 9 },
    { x: 670, y: 160, width: 110, height: 50, color: "#0f5", Tcolor: "#07f", value: "16w", Tvalue: "16x16", Tx: 15, Ty: 13, Tscale: 30, id: 10 },
];

const World_edge_left = -jumper.width - 10;
const World_edge_right = 510 + jumper.width;
let WScreen_edge_left = 0;
let WScreen_edge_right = World_edge_right;


class Platform
{
    constructor(x, y, width, height, type, color, visible)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = visible;
        this.type = type;
        this.color = color;
    }
}



jumper.x = 200;

//===============
LVL_background();

redrawAll();
//===============


function redrawAll()
{
    ctx.save();
    ctx.clearRect(0, -10, canva.width, canva.height + 10);
    LVL_background();
    lvl1_clip();
    ctx.translate(Misha.lvl2.w.x, Misha.lvl2.w.y);

    ctx.fillStyle = "lightblue";

    LVL_AI_jumper();
    LVL_platforms();
    PLM_logics(platforms);
    if (DEVgravity)
    {
        Jgravity(jumper);
        Jmovement(jumper);
    }
    drawJumper();
    platforms.forEach(el =>
    {
        if (el.visible == false)
        {
            drawPlatform(el);
        }
    });

    ctx.restore();

    ctx.save();

    Misha.lvl2.buttons.forEach(el =>
    {
        LVL_drawButton(el);
    });

    ctx.restore();
    Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, "sp")].Tvalue = platforms.length;
    requestAnimationFrame(redrawAll);
}

function lvl1_clip()
{
    const border = 2;
    const x = Misha.lvl2.w.x + border;
    const y = Misha.lvl2.w.y + border;
    const height = Misha.lvl2.w.height - border * 2;
    const width = Misha.lvl2.w.width - border * 2;
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.clip();
}

function LVL_AI_jumper()
{
    if (jumper.x < -jumper.width - 5)
    {
        jumper.x = 500;
    }

    if (jumper.x > 505)
    {
        jumper.x = -jumper.width;
    }
}

function LVL_drawButton(button)
{
    ctx.save();
    ctx.translate(button.x, button.y);

    ctx.lineWidth = 2;
    ctx.fillStyle = button.color;
    ctx.fillRect(0, 0, button.width, button.height);

    if (button.color != "transparent")
    {
        ctx.strokeStyle = "gray";
        ctx.strokeRect(0, 0, button.width, button.height);
    }

    ctx.translate(button.Tx, button.Ty);
    ctx.scale(1, -1);
    ctx.fillStyle = button.Tcolor;
    ctx.font = button.Tscale + "px Arial";
    ctx.fillText(button.Tvalue, 0, 0);

    ctx.restore();
}

function LVL_platforms()
{
    if (platforms.length < Misha.lvl2.sprites.count)
    {
        const red = random_num(0, 100);
        const green = random_num(90, 132);
        const blue = random_num(173, 256);
        const newColor = `rgb(${red}, ${green}, ${blue})`;
        platforms.push(new Platform(World_edge_right, 0, Misha.lvl2.sprites.width, Misha.lvl2.sprites.width, "ghost", newColor, random_true()));
    }

    if (platforms.length > Misha.lvl2.sprites.count)
    {
        platforms.pop();
    }
    Misha.lvl2.sprites.splice = false;
    for (let i = 0; i < platforms.length; i++)
    {
        const el = platforms[i];
        el.x -= 3;
        if (el.x + el.width < World_edge_left)
        {
            el.x = World_edge_right;
            el.visible = random_true();
            const red = random_num(0, 100);
            const green = random_num(90, 132);
            const blue = random_num(173, 256);
            el.color = `rgb(${red}, ${green}, ${blue})`;
        }
        el.y += random_upNdown(2)
        el.y = Math.max(Math.min(el.y, 200), -20);

        if (el.width != Misha.lvl2.sprites.width && Misha.lvl2.sprites.splice == false)
        {
            el.width = Misha.lvl2.sprites.width;
            el.height = Misha.lvl2.sprites.width;
            Misha.lvl2.sprites.splice = true;
        }
    }
}

function LVL_background()
{
    ctx.save();
    ctx.fillStyle = Misha.lvl2.background;
    ctx.fillRect(0, -10, canva.width, canva.height + 10);

    ctx.fillStyle = "rgba(256, 256, 256, 0.4)";
    ctx.fillRect(Misha.lvl2.w.x, Misha.lvl2.w.y, Misha.lvl2.w.width, Misha.lvl2.w.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(Misha.lvl2.w.x, Misha.lvl2.w.y, Misha.lvl2.w.width, Misha.lvl2.w.height);
    if (Misha.lvl2.img.inDEV)
    {
        ctx.translate(Misha.lvl2.w.x, Misha.lvl2.w.y + Misha.lvl2.w.height);
        ctx.scale(1, -1);
        ctx.drawImage(Misha.lvl2.imgs.inDEV, 0, 0);
    }
    ctx.restore();
}

canva.addEventListener('click', function (event) { LVL_click(event) })
function LVL_click(event)
{
    let x = event.pageX;
    let y = event.pageY;
    x -= canva.offsetLeft;
    y = Math.abs(y - canva.offsetTop - canva.height);
    let clickButton = null;
    for (let i = 0; i < Misha.lvl2.buttons.length; i++)
    {
        const btn = Misha.lvl2.buttons[i];
        if (
            y > btn.y &&
            y < btn.y + btn.height &&
            x > btn.x &&
            x < btn.x + btn.width)
        {
            clickButton = btn;
        }
    }
    if (clickButton != null)
    {
        const newColor = "#f80"
        switch (clickButton.value)
        {
            case "500sp":
                Misha.lvl2.sprites.count = 500;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 1)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 2)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 3)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 4)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 5)].color = "#0f5";
                break;

            case "1000sp":
                Misha.lvl2.sprites.count = 1000;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 1)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 2)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 3)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 4)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 5)].color = "#0f5";
                break;

            case "1500sp":
                Misha.lvl2.sprites.count = 1500;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 1)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 2)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 3)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 4)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 5)].color = "#0f5";
                break;

            case "2000sp":
                Misha.lvl2.sprites.count = 2000;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 1)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 2)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 3)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 4)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 5)].color = "#0f5";
                break;

            case "5000sp":
                Misha.lvl2.sprites.count = 5000;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 1)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 2)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 3)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 4)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 5)].color = newColor;
                break;

            case "2w":
                Misha.lvl2.sprites.width = 2;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 6)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 7)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 8)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 9)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 10)].color = "#0f5";
                break;

            case "4w":
                Misha.lvl2.sprites.width = 4;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 6)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 7)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 8)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 9)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 10)].color = "#0f5";
                break;

            case "8w":
                Misha.lvl2.sprites.width = 8;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 6)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 7)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 8)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 9)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 10)].color = "#0f5";
                break;

            case "12w":
                Misha.lvl2.sprites.width = 12;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 6)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 7)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 8)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 9)].color = newColor;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 10)].color = "#0f5";
                break;

            case "16w":
                Misha.lvl2.sprites.width = 16;
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 6)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 7)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 8)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 9)].color = "#0f5";
                Misha.lvl2.buttons[findWhithId(Misha.lvl2.buttons, 10)].color = newColor;
                break;

            default:
                break;
        }
    }
}