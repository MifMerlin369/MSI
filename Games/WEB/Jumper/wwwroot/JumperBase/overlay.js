"use strict";
import {ctx, coins, canva} from "./base.js"
import { fileLoaded } from "./loading.js";
import { get_Vlife } from "./lifeSystem.js";
window.Misha = window.Misha || Object.create(null);
Misha.overlays = true;
const overlay = {};
overlay.files = {};

overlay.stars = { x: 20, y: 20, count: 3, stared: 0 };
export let star = null;
export let starColected = null;
export function starCountChange(newCount)
{
    overlay.stars.count = newCount;
}
export function starStaredChange(count)
{
    overlay.stars.stared += count;
}
export function starStaredSet(newCount)
{
    overlay.stars.stared = newCount;
}
export function staredStarsCount()
{
    return overlay.stars.stared;
}

OVL_loadFiles();
function OVL_loadFiles()
{
    overlay.files.star = {};
    overlay.files.star.f = new Image();
    overlay.files.star.f.src = "pictures/star.png";
    overlay.files.star.f.onload = function ()
    {
        star = overlay.files.star.f;
        overlay.files.star.loaded = true;
        fileLoaded();
    }

    overlay.files.starframe = {};
    overlay.files.starframe.f = new Image();
    overlay.files.starframe.f.src = "pictures/starframe.png";
    overlay.files.starframe.f.onload = function ()
    {
        overlay.files.starframe.loaded = true;
        fileLoaded();
    }

    overlay.files.starColected = {};
    overlay.files.starColected.f = document.createElement("AUDIO");
    overlay.files.starColected.f.src = "sounds/starColected.mp3";
    overlay.files.starColected.f.onloadeddata = function ()
    {
        starColected = overlay.files.starColected.f;
        fileLoaded();
    };

    overlay.files.Vlife = {};
    overlay.files.Vlife.f = new Image();
    overlay.files.Vlife.f.src = "pictures/Vlife.png";
    overlay.files.Vlife.f.onload = function ()
    {
        overlay.files.Vlife.loaded = true;
        fileLoaded();
    }

}

export function draw1()
{
    ctx.save();
    ctx.translate(0, canva.height);
    ctx.scale(1, -1);
    ctx.fillStyle = "rgba(256, 256, 256, 0.15)";
    // ctx.fillRect(0, 0, 262, 100);

    ctx.save();
    ctx.translate(coins.x, coins.y);
    ctx.fillStyle = coins.color;
    ctx.font = "30px Arial";
    ctx.fillText("Coins: " + coins.value, 0, 0);
    ctx.restore();

    if (overlay.files.starframe.loaded == true)
    {
        for (let i = 0; i < overlay.stars.count; i++)
        {
            ctx.drawImage(overlay.files.starframe.f, 20 + 74 * i, 20, 64, 64);
        }
    }

    if (overlay.files.star.loaded == true)
    {
        for (let i = 0; i < overlay.stars.stared; i++)
        {
            ctx.drawImage(overlay.files.star.f, 20 + 74 * i, 20, 64, 64);
        }
    }

    if (overlay.files.Vlife.loaded == true)
    {
        const vlife = get_Vlife();
        ctx.drawImage(overlay.files.Vlife.f, 250 * vlife.count, 0, 250, 250, vlife.x, vlife.y, vlife.width, vlife.height);
    }

    ctx.restore();
}
