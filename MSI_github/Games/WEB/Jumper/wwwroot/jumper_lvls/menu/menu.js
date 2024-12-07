"use strict";
import {ctx} from "../../JumperBase/base.js"
import { ost_write } from "../../JumperBase/music.js";
import { VlevelChange, ChangeLevel, game, level } from "../../start.js";
const button1 = { x: 80, y: 200, width: 150, height: 200, color: "blue", Tcolor: "yellow", value: "lvl1", Tvalue: "Level 1", Tx: 20, Ty: 85, Tscale: 35};
const button2 = { x: 310, y: 200, width: 150, height: 200, color: "blue", Tcolor: "yellow", value: "lvl2", Tvalue: "Level 2", Tx: 20, Ty: 85, Tscale: 35};
const lockerButton2 = { x: 310, y: 200, width: 150, height: 200, color: "rgb(0, 0, 0, 0.7)", Tcolor: "white", value: "lvl2", Tvalue: "Locked", Tx: 20, Ty: 15, Tscale: 35, visible: true};

const buttons = [button1, button2, lockerButton2];

let background = null;

export function start()
{
    console.log('module №' + level + ' started');
    game.state = "inMenu";
    background = ctx.createLinearGradient(canva.width, canva.height, 0, 200);
    background.addColorStop(0, 'rgba(255,251,18,1)');
    background.addColorStop(0.53, 'rgba(5,255,155,1)');
    background.addColorStop(1, 'rgba(0,255,255,1)');
    MN_remove_lockers();
    redrawAll();
}


function redrawAll()
{
    ctx.save();
    ctx.translate(0, -10);

    ctx.fillStyle = background
    ctx.fillRect(0, 0, canva.width, canva.height);

    for (let i = 0; i < buttons.length; i++)
    {
        if (buttons[i].visible != false)
        {
            drawButton(buttons[i]);
        }
    }

    ctx.restore();
}


function MN_remove_lockers()
{
    switch (parseInt(sessionStorage.getItem("Unlocklevel"))) {
        case 1:
            lockerButton2.visible = false;
            break;

        case 2:
            lockerButton2.visible = false;
            break;

        case 3:
            lockerButton2.visible = false;
            break;

        default:
            break;
    }
}

function drawButton(button)
{
    ctx.save();
    ctx.translate(button.x, button.y);

    ctx.fillStyle = button.color;
    ctx.fillRect(0, 0, button.width, button.height);

    ctx.translate(button.Tx, button.Ty);
    ctx.scale(1, -1);
    ctx.fillStyle = button.Tcolor;
    ctx.font = button.Tscale + "px Arial";
    ctx.fillText(button.Tvalue, 0, 0);

    ctx.restore();
}

// canva.addEventListener('click', function (event) { click(event) })
export function click(event, x, y)
{
    let clickButton = null;
    for (let i = 0; i < buttons.length; i++)
    {
        if (
            y > buttons[i].y &&
            y < buttons[i].y + buttons[i].height &&
            x > buttons[i].x &&
            x < buttons[i].x + buttons[i].width)
        {
            clickButton = buttons[i];
        }
    }
    if (clickButton != null)
    {
        switch (clickButton.value)
        {
            case "lvl1":
                if (Misha.musics == true)
                {
                    ost_write();
                }
                sessionStorage.setItem("music.pause", 0);           //music
                VlevelChange(1);
                break;

            case "lvl2":
                if (parseInt(sessionStorage.getItem("Unlocklevel")) > 0)
                {
                    if (Misha.musics == true)
                    {
                        ost_write();
                    }
                    sessionStorage.setItem("music.pause", 0);           //music
                    VlevelChange(2);
                }
                break;

            default:
                break;
        }
    }
}