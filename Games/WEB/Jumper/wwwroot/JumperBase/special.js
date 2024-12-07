"use strict";
import {platforms, SPL_lvl_write, SPL_lvl_read, WorldAnchor, jumper, coins, lvlend, get_jumper_canUse} from "./base.js"
import {SPL_direction_write, SPL_direction_read} from "./grafics.js"
import {ost_write} from "./music.js"
import {rectIntersect} from "./Functions.js"
import { level, VlevelChange } from "../start.js";
import { starStaredSet, staredStarsCount } from "./overlay.js";
export function writeInMemory(lvl)
{
    sessionStorage.setItem("Anc.x" + lvl, WorldAnchor.x);
    sessionStorage.setItem("Anc.y" + lvl, WorldAnchor.y);

    sessionStorage.setItem("jmp.x" + lvl, jumper.x);
    sessionStorage.setItem("jmp.y" + lvl, jumper.y);

    sessionStorage.setItem("coins", coins.value);

    for (let i = 0; i < platforms.length; i++)
    {
        if (platforms[i].type == "breakable")
        {
            sessionStorage.setItem("breakable" + platforms[i].id + lvl, platforms[i].visible);
        }
        if (platforms[i].type == "star")
        {
            sessionStorage.setItem("star" + platforms[i].id + lvl, platforms[i].colected);
        }
        if (platforms[i].type == "door")
        {
            sessionStorage.setItem("door" + platforms[i].id + lvl, platforms[i].doorState);
        }
        if (platforms[i].type == "lever")
        {
            sessionStorage.setItem("lever" + platforms[i].id + lvl, platforms[i].leverState);
        }
    }

    SPL_lvl_write(lvl);

    if (Misha.grafics)
    {
        SPL_direction_write(jumper);
    }
    if (Misha.overlays)
    {
        sessionStorage.setItem("starsColected" + lvl, staredStarsCount());
    }
}

export function readMemory(lvl)
{
    if (
        sessionStorage.getItem("Anc.x" + lvl) != null &&
        sessionStorage.getItem("Anc.y" + lvl) != null &&
        sessionStorage.getItem("jmp.x" + lvl) != null &&
        sessionStorage.getItem("jmp.y" + lvl) != null)
    {
        WorldAnchor.x = parseInt(sessionStorage.getItem("Anc.x" + lvl));
        WorldAnchor.y = parseInt(sessionStorage.getItem("Anc.y" + lvl));

        jumper.x = parseInt(sessionStorage.getItem("jmp.x" + lvl));
        jumper.y = parseInt(sessionStorage.getItem("jmp.y" + lvl));
    }
    for (let i = 0; i < platforms.length; i++)
    {
        if (
            platforms[i].type == "breakable" &&
            sessionStorage.getItem("breakable" + platforms[i].id + lvl) != null)
        {
            platforms[i].visible = sessionStorage.getItem("breakable" + platforms[i].id + lvl);
        }
        if (
            platforms[i].type == "star" &&
            sessionStorage.getItem("star" + platforms[i].id + lvl) != null)
        {
            switch (sessionStorage.getItem("star" + platforms[i].id + lvl)) {
                case "true":
                    platforms[i].colected = true;
                    break;

                case "false":
                    platforms[i].colected = false;
                    break;

                default:
                    console.error("star.colected", readMemory);
                    break;
            }
        }
        if (
            platforms[i].type == "door" &&
            sessionStorage.getItem("door" + platforms[i].id + lvl) != null)
        {
            platforms[i].doorState = sessionStorage.getItem("door" + platforms[i].id + lvl);
        }
        if (
            platforms[i].type == "lever" &&
            sessionStorage.getItem("lever" + platforms[i].id + lvl) != null)
        {
            platforms[i].leverState = sessionStorage.getItem("lever" + platforms[i].id + lvl);
        }
    }
    if (sessionStorage.getItem("coins") != null)
    {
        coins.value = parseInt(sessionStorage.getItem("coins"));
    }
    if (sessionStorage.getItem("starsColected" + lvl) != null && Misha.overlays)
    {
        starStaredSet(parseInt(sessionStorage.getItem("starsColected" + lvl)));
    }

    SPL_lvl_read(lvl);

    if (Misha.grafics)
    {
        SPL_direction_read(jumper);
    }

}

export function lvl_end()
{
    let nowlvl = parseInt(sessionStorage.getItem("level"))
    if (rectIntersect(lvlend, jumper) && get_jumper_canUse())
    {
        if (level == nowlvl)
        {
            VlevelChange(-1)
            sessionStorage.setItem("Unlocklevel", nowlvl + 1);
        }
        sessionStorage.removeItem("Anc.x" + nowlvl);
        sessionStorage.removeItem("Anc.y" + nowlvl);
        sessionStorage.removeItem("jmp.x" + nowlvl);
        sessionStorage.removeItem("jmp.y" + nowlvl);
        sessionStorage.setItem("GRC_jumperDirection", "right");
        for (let i = 0; i < platforms.length; i++)
        {
            const el = platforms[i];
            if (el.type == "breakable")
            {
                sessionStorage.removeItem("breakable" + el.id + nowlvl);
            }
            if (el.type == "door")
            {
                sessionStorage.removeItem("door" + el.id + nowlvl);
            }
            if (el.type == "lever")
            {
                sessionStorage.removeItem("lever" + el.id + nowlvl);
            }
        }
    }
}
