"use strict";
import {Cgravity, Cmovement} from "./movement.js"
import {ctx, platforms, enemys, CharacterControl, gameWindow, selectedCharacter, controlCharacter} from "./base.js"
import { rectIntersect } from "./Functions.js";
import { jumperTextures } from "./grafics.js";
import { get_shot } from "./abilities.js";
window.Misha = window.Misha || Object.create(null);
Misha.enemy = true;


function drawEnemy(enemy)
{
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (Misha.grafics)
    {
        jumperTextures(enemy);
    }
    else
    {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "darkorange";
        ctx.beginPath();
        ctx.arc(enemy.width / 2, enemy.height / 2, 16, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
    if (enemy.isControled)
    {
        ctx.fillStyle = "orange";
        ctx.fillRect(enemy.width / 2 - 4, enemy.height + 5, 8, 8);
    }
    // ctx.strokeStyle = "white";
    // ctx.strokeRect(0, 0, enemy.width, enemy.height);

    ctx.restore();
}

export function startset()
{
    for (let i = 0; i < enemys.length; i++)
    {
        const el = enemys[i];
        platforms.push(el);
    }
}

export function gravity()
{
    for (let i = 0; i < enemys.length; i++)
    {
        const el = enemys[i];
        const newEl = { x: el.x - el.movementPath.width, y: el.y - el.movementPath.height, width: el.width + el.movementPath.width*2, height: el.height + el.movementPath.height*2};
        if (controlCharacter % 2 == 0 || selectedCharacter != i)
        {
            el.isControled = false
        }
        else
        {
            el.isControled = true;
        }

        if (el.alive && rectIntersect(newEl, gameWindow))
        {
            Cgravity(el);
            Cmovement(el);
            if (!el.isControled && !el.killed)
            {
                if (rectIntersect(el, get_shot()))
                {
                    el.killed = true;
                    CharacterControl(el, "right", "up");
                    CharacterControl(el, "left", "up");
                    el.height = 30;
                }
                enemyAI(el);
            }
            el.plinks();
        }
    }
}

export function drawEnemys()
{
    for (let i = 0; i < enemys.length; i++)
    {
        const el = enemys[i];
        drawEnemy(el);
    }
}

function enemyAI(chr)
{
    if (chr.x == chr.pastX && chr.pastCounter > 60)
    {
        if (chr.direction == "left")
        {
            CharacterControl(chr, "right", "down");
            chr.pastCounter = 0;
        }
        else if (chr.direction == "right")
        {
            CharacterControl(chr, "left", "down");
            chr.pastCounter = 0;
        }
        else
        {
            alert("function EMY_enemyAI: charter direction is wrong")
        }
    }
    chr.writePast();
    chr.pastCounter += 1;
}