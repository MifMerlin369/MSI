"use strict";

import { changeLevel, TheCounter, jumper, Character } from "./JumperBase/base.js";
import { requestGameChange } from "./JumperBase/loading.js";
import { findWhithId } from "./JumperBase/Functions.js";
import { PLM_forLevelRestore } from "./JumperBase/platforms.js";
import { portal_clearParticles } from "./JumperBase/grafics.js";

if (sessionStorage.getItem("level") == null)
{
    sessionStorage.setItem("level", -1);
}

if (sessionStorage.getItem("Unlocklevel") == null)
{
    sessionStorage.setItem("Unlocklevel", 0);
}

export let level = parseInt(sessionStorage.getItem("level"));
export let levelLoaded = false;
export let levelLoadTime = 0;
// window.level = level;

export function VlevelChange(newlevel)
{
    level = newlevel;
}

export function levelLoadedChange(newBoolean)
{
    levelLoaded = newBoolean;
}

export const game = {};
game.state = "loading";


function clearLevel()
{
    let platforms = [ ];
    let backscreen2 = [];
    let frontscreen = [];
    let enemys = [];
    let lvlend = {};
    let World_edge_left = 0;
    let World_edge_right = 0;
    let WScreen_edge_left = 0;
    let WScreen_edge_right = 0;
    function SPL_lvl_write() { };
    function SPL_lvl_read() { };
    function LVL_triggers() { };
    const forLevelChange = {
        platforms, backscreen2, frontscreen, enemys, lvlend, World_edge_left,
        World_edge_right, WScreen_edge_left, WScreen_edge_right, SPL_lvl_write, SPL_lvl_read, LVL_triggers
    };
    changeLevel(forLevelChange);
    jumper.moveTo(50, 0);
    console.log('level cleared');
}


export function ChangeLevel()
{
    console.groupCollapsed("%cChange level", 'color: gray;');
    if (level == -1)
    {
        console.log('load module №', level);
        game.state = "loading";
        levelLoadTime = TheCounter.counter;
        levelLoaded = false;
        clearLevel();
        import("./jumper_lvls/menu/menu.js").then((m) =>
        {
            console.log('%cmodule №' + level + ' loaded', 'color: gray;');
            requestGameChange("inMenu", m);
        });
        console.log('load module 2 №', level);
    }
    else if (level == -2)
    {
        game.state = "loading";
        levelLoadTime = TheCounter.counter;
        levelLoaded = false;
        clearLevel();
        import("./jumper_lvls/levelBase.js").then((m) =>
        {
            console.log('%cmodule №' + level + ' loaded', 'color: gray;');
            requestGameChange("levelStarted", m);
        });
    }
    else
    {
        game.state = "loading";
        levelLoadTime = TheCounter.counter;
        levelLoaded = false;
        console.log('load module №', level);
        clearLevel();
        import(`./jumper_lvls/lvl${level}/level${level}.js`).then((m) =>
        {
            console.log('%cmodule №' + level + ' loaded', 'color: gray;');
            requestGameChange("levelStarted", m);
        });

        console.log('load module 2 №', level);
    }
    console.groupEnd();
}


export function restoreLevel(platforms, lvl)
{
    console.log('%clevel №' + lvl + ' restored', 'color: gray;');
    for (let i = platforms.length - 1; i >= 0; i--) {
        const el = platforms[i];
        if (el.type == "door")
        {
            el.doorState = "close";
        }
        if (el.type == "lever")
        {
            el.leverState = "off";
        }
        if (el.type == "breakable")
        {
            el.visible = true;
        }
        if (el.type == "star")
        {
            el.colected = false;
        }
        if (el instanceof Character)
        {
            const index = findWhithId(platforms, el.id);
            platforms.splice(index, 1);

            el.jumpAcc = 0;
            el.jumpSpeed = 0;
            el.ground = 0;
            el.floor = 0;
            el.jmSpeed = 0;
            el.moveSpeed = 0;
            el.moveAcc = 0;
            el.alive = true;

            el.x = el.restoreInformation.x;
            el.y = el.restoreInformation.y;
            el.visible = el.restoreInformation.visible;
            el.direction = el.restoreInformation.direction;
        }
        PLM_forLevelRestore();
        portal_clearParticles();
    }
}