"use strict";
import {changeLevel, Character, levelOnStart} from "../JumperBase/base.js" // "../../JumperBase/base.js"
import {TRG_lever_door} from "../JumperBase/triggers.js" // "../../JumperBase/triggers.js"
import { level } from "../start.js"; // "../../start.js"
import { Platform_simple, Platform_lever, Platform_door, Platform_door_border, Platform_star, Platform_lifting, Platform_box, Platform_screens } from "../JumperBase/platformBase.js";
const platforms = [
 new Platform_simple(1, 100, 0, 100, 60, "simple", "green", "grass", true),
 new Platform_lifting(2, 250, 0, 100, 30, true, 2, 290, 30),
 new Platform_box(3, 400, 190),
//maximum height where box can be replaced
 new Platform_simple(4, 500, 110, 100, 40, "simple", "green", "grass", true),
//maximum height where platform can be replaced
 new Platform_simple(5, 700, 0, 100, 120, "simple", "green", "grass", true),
//maximum height of platform
 new Platform_door(6, 468, 0, 32, 150, "door", "brown", "wall", true, "close"),
 new Platform_lever(7, 540, 0),
//door and lever
 new Platform_star(8, 280, 400),
//star
 new Platform_star(9, 500, 260),
 new Platform_simple(10, 468, 230, 150, 100, "fake", "green", "dirt", false),
 //it works how ghost platform, but dissapiare when intersect with jumper
 //star must be behind fake platform
//fake platform and star combination

];
const backscreen2 = [
 new Platform_screens(1, 630, 0, 100, 60, "simple", "grass"),

]
const frontscreen = [
 new Platform_screens(1, 730, -11, 90, 40, "simple", "grass"),
 new Platform_screens(2, 760, 34, 16, 261, "simple", "WoodY", true),

]
const enemys = [
    new Character(400, 0, 1.7, 1.1, 1.5, 14, true, "1e", "enemy", 50, 0), //50 and 0 is width and height enemy's path

]


const lvlend = { x: 990, y: 0, width: 10, height: 90, type: "ghost", color: "rgb(0, 0, 0, 0.05)", visible: false };

const World_edge_left = 0;
const World_edge_right = 1000;
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
    TRG_lever_door(7, 6); // first number is lever id, second is door id
    //trigger for door with lever
}

const forLevelChange = {
    platforms, backscreen2, frontscreen, enemys, lvlend, World_edge_left,
    World_edge_right, WScreen_edge_left, WScreen_edge_right, SPL_lvl_write, SPL_lvl_read, LVL_triggers
}

function platforms_edit()
{
    for (let i = 0; i < platforms.length; i++) {
        const el = platforms[i];
        if (el.type == "door")
        {
            platforms.splice(i, 0, new Platform_door_border(el));
            i++;
        }
    }
}

export function start()
{
    console.log('level №' + level + ' started');

    platforms_edit();
    changeLevel(forLevelChange);
    levelOnStart(2, platforms, level, 50, 0);
 // levelOnStart(count of stars on level, don't change, don't change, jumper x, jumper y);
}
