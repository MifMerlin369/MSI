"use strict";
import {ctx, canva} from "./base.js"
import { fileLoaded } from "./loading.js";

window.Misha = window.Misha || Object.create(null);
const music = {};
Misha.musics = true;

music.ost = document.createElement("AUDIO");
music.ost.src = "sounds/ost.mp3";
music.ost.volume = 0.5;
music.ost.autoplay = true;
music.ost.loop = true;
// music.ost.controls = true;
document.body.appendChild(music.ost);
ost_read();
music.ost.onloadeddata = function ()
{
    fileLoaded();
}
export const ost = music.ost;

export function change_ost_volume(num)
{
    music.ost.volume = num || 0.5;
}
export function get_ost_volume()
{
    return music.ost.volume;
}

function ost_read()
{
    if (sessionStorage.getItem("ost") != null)
    {
        music.ost.currentTime = parseInt(sessionStorage.getItem("ost"));
    }
}

export function ost_write()
{
    sessionStorage.setItem("ost", music.ost.currentTime);
}


music.button1 = { x: 275, y: 265, width: 250, height: 70, color: "lime", Tcolor: "black", value: "play", Tvalue: "Continue", Tx: 53, Ty: 23, Tscale: 35};
music.buttons = [music.button1]
music.pause = 1;
// if (sessionStorage.getItem("music.pause") != null)
// {
//     music.pause = parseInt(sessionStorage.getItem("music.pause"));
//     sessionStorage.setItem("music.pause", 1);
// }


export function drawAll()
{
    if (music.pause)
    {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, -10, canva.width, canva.height + 10);

        drawButton(music.button1)
        ctx.restore();
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

export function MUS_click(event, x, y)
{
    let clickButton = null;
    for (let i = 0; i < music.buttons.length; i++)
    {
        if (
            y > music.buttons[i].y &&
            y < music.buttons[i].y + music.buttons[i].height &&
            x > music.buttons[i].x &&
            x < music.buttons[i].x + music.buttons[i].width)
        {
            clickButton = music.buttons[i];
        }
    }
    if (clickButton != null)
    {
        switch (clickButton.value)
        {
            case "play":
                music.pause = 0;
                music.ost.play();
                // sessionStorage.setItem("music.pause", 1);
                break;

            default:
                break;
        }
    }
}