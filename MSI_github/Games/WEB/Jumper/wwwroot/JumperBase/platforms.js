"use strict";
import {ctx, coins, ding, platforms, drawPlatform, jumper, gameWindow, get_jumper_canUse} from "./base.js"
import {rectIntersect, findWhithId} from "./Functions.js"
import { starStaredChange, starColected } from "./overlay.js";
import { requestChange_savePoint_current } from "./lifeSystem.js";
import { get_shot } from "./abilities.js";
window.Misha = window.Misha || Object.create(null);
const sounds = {}
function PLM_lifting(plm)
{
    if (plm.height < plm.heightMax && plm.direction == "up")
    {
        plm.height += plm.speed
    }
    else
    {
        plm.direction = "down"
    }

    if (plm.height > plm.heightMin && plm.direction == "down")
    {
        plm.height -= plm.speed
    }
    else
    {
        plm.direction = "up"
    }
}

function PLM_breakable(plm)
{
    if (plm.visible == true || plm.visible == "true")
    {
        const newPlm = { x: plm.x + 1, y: plm.y - 1, width: plm.width - 2, height: 1, };
        if (rectIntersect(newPlm, jumper) && get_jumper_canUse())
        {
            coins.value += 1;
            jumper.jumpSpeed = -jumper.mass * 4.5
            ding.currentTime = 0;
            ding.play();
            plm.visible = false;
        }
    }
}
sounds.doorOpen = {};
sounds.doorOpen.s = document.createElement("AUDIO");
sounds.doorOpen.s.src = "sounds/doorOpen.mp3";
sounds.doorOpen.played = false;

sounds.doorClose = {};
sounds.doorClose.s = document.createElement("AUDIO");
sounds.doorClose.s.src = "sounds/doorClose.mp3";
sounds.doorClose.played = false;

sounds.doorCloseEnd = {};
sounds.doorCloseEnd.s = document.createElement("AUDIO");
sounds.doorCloseEnd.s.src = "sounds/doorCloseEnd.mp3";
sounds.doorCloseEnd.played = true;

export function PLM_forLevelRestore()
{
    sounds.doorCloseEnd.played = true;
}

function PLM_door(plm)
{
    const speed = 0.7;
    let blockN = findWhithId(platforms, plm.id + 0.5);
    switch (plm.doorState) {
        case "close":
            if (!sounds.doorCloseEnd.played)
            {
                sounds.doorCloseEnd.s.play();
                sounds.doorCloseEnd.played = true;
            }

            plm.height = plm.doorHeight;
            plm.y = plm.doorY;
            plm.x = plm.doorX;
            sounds.doorOpen.played = false;
            break;

        case "open":
            plm.height = 20;
            plm.y = plm.doorHeight - 20;
            plm.x = plm.doorX;
            platforms[blockN].y = plm.doorHeight - 20;
            platforms[blockN].height = 20;
            break;

        case "opening":
            sounds.doorCloseEnd.played = false;
            sounds.doorClose.played = false;
            if (plm.y < plm.doorHeight - 20)
            {
                plm.y += speed;
                plm.height -= speed;
                PLM_door_shake(plm);
                platforms[blockN].y += speed;
                platforms[blockN].height -= speed;
                if (!sounds.doorOpen.played)
                {
                    sounds.doorClose.s.pause();
                    sounds.doorClose.s.currentTime = 0;

                    sounds.doorOpen.s.play();
                    sounds.doorOpen.played = true;
                }
            }
            else
            {
                plm.height = 20;
                plm.y = plm.doorHeight - 20;
                plm.doorState = "open";
                plm.x = plm.doorX;
                platforms[blockN].y = plm.doorHeight - 20;
                platforms[blockN].height = 20;
            }
            break;

        case "closing":
            sounds.doorOpen.played = false;
            platforms[blockN].y = platforms[blockN].blockY;
            platforms[blockN].height = platforms[blockN].blockHeight;
            if (plm.y > plm.doorY)
            {
                plm.y -= speed;
                plm.height += speed;
                PLM_door_shake(plm);
                if (sounds.doorClose.played == false)
                {
                    sounds.doorOpen.s.pause();
                    sounds.doorOpen.s.currentTime = 0;

                    sounds.doorClose.s.play();
                    sounds.doorClose.played = true;
                }
            }
            else
            {
                plm.height = plm.doorHeight;
                plm.y = plm.doorY;
                plm.doorState = "close";
                plm.x = plm.doorX;
            }

            break;

        default:
            break;
    }
}

function PLM_door_shake(plm)
{
    if (plm.doorXd == "right")
    {
        plm.x += 0.1;
        if (plm.x > plm.doorX + 1)
        {
            plm.doorXd = "left";
        }
    }
    else
    {
        plm.x -= 0.1;
        if (plm.x < plm.doorX - 1)
        {
            plm.doorXd = "right";
        }
    }
}

sounds.lever = document.createElement("AUDIO");
sounds.lever.src = "sounds/leverClick.mp3";

function PLM_lever(plm)
{
    if ((rectIntersect(plm, jumper) || rectIntersect(plm, get_shot())) && get_jumper_canUse())
    {
        if (plm.leverChange == false)
        {
            switch (plm.leverState)
            {
                case "off":
                    plm.leverState = "on";
                    sounds.lever.play();
                    break;

                case "on":
                    plm.leverState = "off";
                    sounds.lever.play();
                    break;

                default:
                    break;
            }
            plm.leverChange = true;
        }
    }
    else
    {
        plm.leverChange = false;
    }
}

function PLM_star(plm)
{
    if (plm.colected == false && Misha.overlays == true)
    {
        if (rectIntersect(plm, jumper) && get_jumper_canUse())
        {
            starStaredChange(1)
            ding.currentTime = 0;
            starColected.play();
            plm.colected = true;
        }
    }
}

function PLM_fake(plm)
{
    ctx.save();
    // if (Misha.grafics)
    // {
    //     plm.visible = false;
    // }
    // else
    // {
    //     plm.visible = true;
    // }
    ctx.restore();
}

function PLM_savePoint(plm)
{
    if (rectIntersect(plm, jumper) && get_jumper_canUse())
    {
        requestChange_savePoint_current(plm);
    }
}

export function logics(platforms)
{
    for (let plt of platforms)
    {
        switch (plt.type)
        {
            case "simple":
                break;

            case "lifting":
                PLM_lifting(plt);
                break;

            case "breakable":
                PLM_breakable(plt);
                break;

            case "door":
                PLM_door(plt);
                break;

            case "ghost":
                break;

            case "lever":
                PLM_lever(plt);
                break;

            case "star":
                PLM_star(plt);
                break;

            case "fake":
                PLM_fake(plt);
                break;

            case "savePoint":
                PLM_savePoint(plt);
                break;

            default:
                break;
        }
    }
}

export function drawPlatforms(platforms)
{
    for (let plt of platforms)
    {
        switch (plt.type)
        {
            case "ghost":
                if (rectIntersect(plt, gameWindow))
                {
                    drawPlatform(plt);
                }
                break;

            case "lever":
                if (rectIntersect(plt, gameWindow))
                {
                    drawPlatform(plt);
                }
                break;

            case "fake":
                if (rectIntersect(plt, gameWindow))
                {
                    drawPlatform(plt);
                }

            case "star":
                if (rectIntersect(plt, gameWindow))
                {
                    drawPlatform(plt);
                }

            case "savePoint":
                if (rectIntersect(plt, gameWindow))
                {
                    drawPlatform(plt);
                }
                break;

            default:
                break;
        }
        if ((plt.visible == true || plt.visible == "true") && rectIntersect(plt, gameWindow))
        {
            drawPlatform(plt);
        }
    }
}