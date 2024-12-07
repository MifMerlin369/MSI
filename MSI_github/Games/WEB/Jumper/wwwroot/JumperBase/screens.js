"use strict";
import {ctx, jumper, DEVparametrs, gameWindow} from "./base.js"
import {rectIntersect} from "./Functions.js"
import {drawTexture, GRC_grass} from "./grafics.js"
import { fileLoaded } from "./loading.js";
window.Misha = window.Misha || Object.create(null);
Misha.screens = true;
const screen = {};
screen.imgs = {};
screen.img = {};

screen.imgs.jumper = new Image();
screen.imgs.jumper.src = "pictures/jumperfront.png";
screen.imgs.jumper.onload = function ()
{
    screen.img.jumper = true;
    fileLoaded();
}



export function backscreen2(elements)
{
    elements.forEach(el =>
    {
        if (rectIntersect(el, gameWindow))
        {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.scale(0.7, 0.7);
            ctx.fillStyle = "rgb(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, el.width, el.height);
            if (Misha.grafics)
            {
                drawTexture(el);
                if (el.texture == "grass")
                {
                    ctx.translate(0, el.height - 1);
                    GRC_grass(el);
                }
            }
            ctx.restore();
            if (DEVparametrs.screens)
            {
                ctx.save();
                ctx.translate(el.x + el.width * 0.7, el.y - 30 + el.height * 0.7)
                ctx.scale(1, -1);
                ctx.fillStyle = "orange";
                ctx.font = "40px Arial";
                ctx.fillText(el.id, -20, 0);
                ctx.restore();
            }
        }
    });
}

export function frontscreen(elements)
{
    elements.forEach(el =>
    {
        if (rectIntersect(el, gameWindow))
        {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.scale(1.4, 1.4);
            const obj = { x: el.x, y: el.y, width: el.width * 1.4, height: el.height * 1.4 }
            if (rectIntersect(obj, jumper) && el.tranparent == true)
            {
                ctx.globalAlpha = 0.6;
            }

            ctx.fillStyle = "rgb(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, el.width, el.height);
            if (Misha.grafics)
            {
                drawTexture(el);
                if (el.texture == "grass")
                {
                    ctx.translate(0, el.height - 1);
                    GRC_grass(el);
                }
            }
            ctx.restore();
            ctx.save();
            obj.x = Math.min(obj.x + jumper.width, obj.x + obj.width / 2);
            obj.width = Math.max(obj.width - jumper.width * 2, 1);
            obj.y = Math.min(obj.y + jumper.height, obj.y + obj.height / 2);
            obj.height = Math.max(obj.height - jumper.height * 2, 1);
            if (DEVparametrs.screens)
            {
                ctx.save();
                ctx.translate(obj.x, obj.y)
                ctx.fillStyle = "red";
                ctx.fillRect(0, 0, obj.width, obj.height);
                ctx.scale(1, -1);
                ctx.fillStyle = "yellow";
                ctx.font = "40px Arial";
                ctx.fillText(el.id, -jumper.width, 0);
                ctx.restore();
            }
            if (rectIntersect(obj, jumper) && obj.width != 1 && screen.img.jumper == true)
            {
                ctx.translate(jumper.x + jumper.width / 2 - 20, jumper.y + jumper.height / 2 + 20);
                ctx.globalAlpha = 0.4;
                ctx.scale(1, -1);
                ctx.lineWidth = 5;
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(jumper.width / 2, jumper.height / 2 + 3.5, 15, 0, Math.PI * 2, true);
                ctx.fill();

                ctx.globalAlpha = 0.6;
                ctx.drawImage(screen.imgs.jumper, 0, 0, 40, 40);
            }
            ctx.restore();
        }
    });
}
