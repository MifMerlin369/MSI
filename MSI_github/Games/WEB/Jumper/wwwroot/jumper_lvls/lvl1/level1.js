"use strict";
import {changeLevel, jumper, levelOnStart} from "../../JumperBase/base.js"
import {TRG_lever_door} from "../../JumperBase/triggers.js"
import { level, restoreLevel } from "../../start.js";
const platforms = [
    { id: 1, x: 400, y: 160, width: 40, height: 40, type: "breakable",   color: "rgb(0, 0, 0, 0.1)", texture: "box", visible: true },
    { id: 2, x: 700, y: 80, width: 160, height: 40, type: "simple",      color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 3, x: 760, y: 260, width: 40, height: 40, type: "breakable",   color: "rgb(0, 0, 0, 0.1)", texture: "box", visible: true },
    { id: 4, x: 1100, y: 0, width: 128, height: 60, type: "simple",      color: "green", texture: "grass", visible: true },
    { id: 5, x: 1228, y: 0, width: 128, height: 120, type: "simple",     color: "green", texture: "grass", visible: true },
    { id: 6, x: 1356, y: 100, width: 128, height: 80, type: "simple",    color: "green", texture: "grass", visible: true },
    { id: 7, x: 1484, y: 50, width: 128, height: 190, type: "simple",    color: "green", texture: "grass", visible: true },
    { id: 10.5, x: 1400, y: 40, width: 40, height: 40, type: "star",     color: "rgb(0, 0, 0, 0.1)", texture: "star", visible: false, colected: false },
    { id: 7.5, x: 1356, y: 0, width: 256, height: 100, type: "fake",     color: "green", texture: "dirt", visible: false },
    { id: 8, x: 1220, y: 300, width: 120, height: 40, type: "simple",    color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 9, x: 980, y: 370, width: 120, height: 40, type: "simple",     color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 10, x: 1020, y: 480, width: 40, height: 40, type: "star",      color: "rgb(0, 0, 0, 0.1)", texture: "star", visible: false, colected: false },

    { id: 11, x: 2100, y: 0, width: 80, height: 70, type: "simple",      color: "green", texture: "grass", visible: true },
    { id: 12, x: 2600, y: 0, width: 80, height: 70, type: "simple",      color: "green", texture: "grass", visible: true },
    { id: 13, x: 2800, y: 0, width: 96, height: 180, type: "simple",     color: "green", texture: "grass", visible: true },
    { id: 14, x: 2896, y: 0, width: 40, height: 60, type: "simple",      color: "green", texture: "grass", visible: true },
    { id: 15, x: 3000, y: 250, width: 160, height: 40, type: "simple",   color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 16, x: 3060, y: 410, width: 40, height: 40, type: "breakable", color: "rgb(0, 0, 0, 0.1)", texture: "box", visible: true },

    { id: 17, x: 3500, y: 0, width: 140, height: 50, type: "simple",   color: "green", texture: "grass", visible: true },
    { id: 18, x: 3770, y: 120, width: 160, height: 40, type: "simple", color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 19, x: 3510, y: 220, width: 160, height: 40, type: "simple", color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 20, x: 3790, y: 320, width: 160, height: 40, type: "simple", color: "rgb(0, 0, 0, 0.1)", texture: "planks", visible: true },
    { id: 21, x: 4060, y: 400, width: 380, height: 30, type: "simple", color: "green", texture: "WoodX", visible: true },
    { id: 22, x: 4424, y: 430, width: 16, height: 170, type: "simple", color: "green", texture: "WoodY", visible: true },
    { id: 23, x: 4304, y: 190, width: 16, height: 210, type: "simple", color: "green", texture: "WoodY", visible: true },
    { id: 24.5, x: 4294, y: 0, width: 36, height: 190, type: "ghost",  color: "transparent", texture: "clear", visible: true, blockHeight: 190, blockY: 0 },
    { id: 24, x: 4296, y: 0, width: 32, height: 190, type: "door",     color: "brown", texture: "wall", visible: true,
        doorState: "close", doorHeight: 190, doorY: 0, doorX: 4296, doorXd: "left" },
    { id: 25, x: 4370, y: 430, width: 20, height: 20, type: "lever",   color: "rgb(0, 0, 0, 0.1)", texture: "lever", visible: false, leverState: "off", leverChange: false },

];

const backscreen2 = [
    { id: 1, x: 4040, y: 0, width: 170, height: 140, type: "simple", texture: "grass" },
    { id: 2, x: 4080, y: 0, width: 160, height: 80, type: "simple", texture: "grass" },
    { id: 3, x: 4000, y: 0, width: 180, height: 50, type: "simple", texture: "grass" },
    { id: 4, x: 4100, y: 98, width: 16, height: 432, type: "simple", texture: "WoodY" },

]

const frontscreen = [
    { id: 1, x: 4360, y: -11, width: 90, height: 40, type: "simple", texture: "grass" },
    { id: 2, x: 4400, y: 34, width: 16, height: 261, type: "simple", texture: "WoodY" },

]
const enemys = []
const lvlend = { id: "END", x: 4700, y: 30, width: 50, height: 50, type: "ghost", color: "rgb(0, 0, 0, 0.05)", visible: false };

const World_edge_left = 0;
const World_edge_right = 5000;
let WScreen_edge_left = 0;
let WScreen_edge_right = World_edge_right;

function SPL_lvl_write()
{

}

function SPL_lvl_read()
{

}

function LVL_triggers()
{
    TRG_lever_door(25, 24);
}

const forLevelChange = {
    platforms, backscreen2, frontscreen, enemys, lvlend, World_edge_left,
    World_edge_right, WScreen_edge_left, WScreen_edge_right, SPL_lvl_write, SPL_lvl_read, LVL_triggers
}

export function start()
{
    console.log('level №' + level + ' started');

    changeLevel(forLevelChange);
    levelOnStart(2, platforms, level, 200, 0);
}