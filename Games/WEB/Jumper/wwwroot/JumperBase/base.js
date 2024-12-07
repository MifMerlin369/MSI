"use strict";
import {Cgravity, Cmovement, moveScreen} from "./movement.js"
import {rectIntersect} from "./Functions.js"
import {level, levelLoaded, ChangeLevel, game, restoreLevel} from "../start.js"
import * as EMY from "./enemy.js"
import * as SPL from "./special.js"
import * as GRC from "./grafics.js"
import * as SCR from "./screens.js"
import * as PLM from "./platforms.js"
import * as MUS from "./music.js"
import * as OVL from "./overlay.js"
import { click as menuClick} from "../jumper_lvls/menu/menu.js";
import { loadingScreen, loadFiles} from "./loading.js";
import { FSC_AllLoaded } from "./firstScreen.js";
import { characterSounds } from "../jumperSounds/soundsEffects.js";
import { platformsSounds } from "../jumperSounds/platformsSounds.js";
import { lifeSystem, onlvlloadChange_savePoint_current } from "./lifeSystem.js";
import { movies, moviesDraw, onlvlload } from "./movies.js";
import { drawAbilities, abilitiesLogic, shotWithLeaf } from "./abilities.js";
window.Misha = window.Misha || Object.create(null);

export const canva = document.getElementById("canva");
export const ctx = canva.getContext('2d');

export const TheCounter = {};
TheCounter.counter = 0;
TheCounter.pastFrame = 0;
TheCounter.pastRedraw = 0;
export const DEVparametrs = { gravity: true, id: false, screens: false };
const parametrs = { movie: false, moveScreen: true, jumper: {visible: true, canUse: true} }
export function switchMovie(boolean)
{
    parametrs.movie = boolean;
}
export function switchMoveScreen(boolean)
{
    parametrs.moveScreen = boolean;

}
export function switchJumperVisible(boolean)
{
    parametrs.jumper.visible = boolean;
}
export function switchjumperCanUse(boolean)
{
    parametrs.jumper.canUse = boolean;
}
export function get_jumper_canUse()
{
    return parametrs.jumper.canUse;
}

export class Character
{
    constructor(x, y, mass, maxspeed, speedAcc, jumpForce, visible, id, AnimType, pathW, pathH)
    {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.mass = mass;
        this.speed = maxspeed;
        this.speedAcc = speedAcc;
        this.jumpForce = jumpForce;
        this.visible = visible;
        this.id = id;
        this.type = "character";
        this.AnimType = AnimType;
        this.jumpAcc = 0;
        this.jumpSpeed = 0;
        this.jnowIntersect = false;
        this.ground = 0;
        this.floor = 0;
        this.state = "null";
        this.statePast = "null";
        this.nowJump = false;
        this.jmSpeed = 0;
        this.moveSpeed = 0;
        this.moveAcc = 0;
        this.direction = "right";
        this.mnowIntersect = false;
        this.flattening = "null";
        this.mnowStrike = false;
        this.color = "transparent";
        this.massUnchange = mass;
        this.pastX = 0;
        this.pastY = 0;
        this.pastCounter = 0;
        this.sound_up = false;
        this.sound_side = false;
        this.snowding = false;
        this.snowbum = false;
        this.alive = true;
        this.movementPath = { width: pathW, height: pathH };
        this.scale = {};
        this.scale.x = 1;
        this.scale.y = 1;
        this.scale.counter = 0;
        this.translate = {};
        this.translate.x = 0;
        this.translate.y = 0;
        this.textureCounter = 0;
        this.textureImg = 0;
        this.restoreInformation = { x, y, visible, direction: this.direction };
        this.immortal = {active: false, activTime: -1 };
        this.shield = { active: false };
        this.killed = false;
    }
    writePast()
    {
        this.pastX = this.x;
        this.pastY = this.y;
    }
    plinks()
    {
        if (this.sound_up)
        {
            if (!this.snowding)
            {
                ding2.currentTime = 0;
                ding2.play();
                this.snowding = true;
            }
            this.sound_up = false;
        }
        else if (this.sound_side)
        {
            if (!this.snowbum)
            {
                bum.currentTime = 0;
                bum.play()
                    .catch(e =>
                    {
                        if (e.name != 'NotAllowedError')
                        {
                            console.error(e);
                        }
                    });
                this.snowbum = true;
            }
            this.sound_side = false;
        }
        else
        {
            this.snowding = false;
            this.snowbum  = false;
        }
    }
    moveTo(x, y)
    {
        this.x = x;
        this.y = y;
    }
    movement_resetToZero()
    {
        this.jumpAcc = 0;
        this.jmSpeed = 0;
        this.jumpSpeed = 0;
        this.moveAcc = 0;
        this.moveSpeed = 0;

    }
}

export let controlCharacter = 0;
export let selectedCharacter = 0;

export const ding = document.getElementById("ding");
const ding2 = document.getElementById("ding2");
const bum = document.getElementById("bum");
bum.onerror = function (e)
{
    console.log('audio error', e);
};

export const Fg = 0.05;
export const mainFloor = canva.height + 100;
export const jumper = new Character(150, 0, 1.7, 6, 1.5, 14, true, "jumper", "jumper");
export const WorldAnchor = { x: 0, y: 0};
export const Screen_edge_left = 150;
export const Screen_edge_right = canva.width - 400;


export const coins = { x: (canva.width / 2) - 60, y: 50, color: "red", value: 0 };

export let platforms = [

];
export let backscreen2 = [

]
export let frontscreen = [

]

export let enemys = [

]

export let lvlend = { };

export let World_edge_left = 0;
export let World_edge_right = 0;
export let WScreen_edge_left = 0;
export let WScreen_edge_right = 0;

export function SPL_lvl_write()
{

}

export function SPL_lvl_read()
{

}

function LVL_triggers()
{

}

// Misha.enemy = false;
// Misha.grafics = false;
// Misha.musics = false;
// Misha.overlays = false;
// Misha.screens = false;
// Misha.soundsEffect = false;
// Misha.noControl = false;
// Misha.noControlDown = false;

export const gameWindow = { x: 0, y: -10, width: 800, height: 610 }
export const gameWindowStatic = { x: Screen_edge_left, y: 0, width: Screen_edge_right - Screen_edge_left, height: 600 }
//===============
ctx.translate(0, canva.height - 10);
ctx.scale(1, -1);
redrawAll();
FSC_AllLoaded();
ChangeLevel();
loadFiles();
//===============

export function changeLevel(level)
{
    platforms = level.platforms;
    backscreen2 = level.backscreen2;
    frontscreen = level.frontscreen;
    enemys = level.enemys;
    lvlend = level.lvlend;
    World_edge_left = level.World_edge_left;
    World_edge_right = level.World_edge_right;
    WScreen_edge_left = level.WScreen_edge_left;
    WScreen_edge_right = level.WScreen_edge_right;
    SPL_lvl_write = level.SPL_lvl_write;
    SPL_lvl_read = level.SPL_lvl_read;
    LVL_triggers = level.LVL_triggers;
}

function redrawAll(time)
{
    TheCounter.interFrame = time - TheCounter.pastFrame;
    // console.log("redrawAll start", Math.round(TheCounter.interFrame));
    TheCounter.pastFrame = time;
    TheCounter.counter += 1;
    sessionStorage.setItem("counter", TheCounter.counter)
    if (game.state == "levelStarted")
    {
        redrawAll_level(time);
    }

    if (parseInt(sessionStorage.getItem("level")) != level)
    {
        sessionStorage.setItem("level", level);
        ChangeLevel();
    }
    if (game.state == "loading" || levelLoaded == false)
    {
        loadingScreen()
    }
    if (Misha.musics)
    {
        MUS.ost_write();
    }
    // ctx.save();
    // ctx.translate(20, 20);
    // ctx.scale(1, -1)
    // ctx.fillStyle = "black";
    // ctx.font = "30px Arial";
    // ctx.fillText(TheCounter.counter % 12, 35, 0);
    // ctx.restore();

    requestAnimationFrame(redrawAll);
}

function redrawAll_level(time)
{
    if (DEVparametrs.gravity)
    {
        if (!parametrs.movie)
        {
            Cgravity(jumper);
            Cmovement(jumper);
            if (Misha.soundsEffect)
            {
                characterSounds(jumper, platforms)
            }
            else
            {
                jumper.plinks();
            }
            lifeSystem(jumper, enemys);
        }
        abilitiesLogic();
        if (Misha.enemy)
        {
            EMY.gravity();
        }
    }

    if (parametrs.movie)
    {
        movies();
    }

    if (Misha.soundsEffect)
    {
        platformsSounds(platforms, lvlend, jumper);
    }
    if (parametrs.moveScreen)
    {
        moveScreen();
    }
    PLM.logics(platforms);
    LVL_triggers();
    if (Misha.grafics)
    {
        GRC.portal();
        GRC.savePoints(platforms);
    }
    gameWindow.x = -WorldAnchor.x;
    gameWindow.y = -WorldAnchor.y;

    GRC.character_animations_statePast(enemys, jumper);

    if (time > TheCounter.pastRedraw + 32)
    {
        redrawAll_level_frame(time);
    }
    if (levelLoaded && TheCounter.counter % 30 == 0 && !DEVparametrs.SSstop)
    {
        SPL.writeInMemory(level);
    }
    SPL.lvl_end();
    GRC.character_animations_statePast_write(enemys, jumper);
    jumper.writePast();
}

function redrawAll_level_frame(time)
{
    TheCounter.interRedraw = time - TheCounter.pastRedraw;
    TheCounter.pastRedraw = time;
    ctx.save();

    ctx.fillStyle = "red"
    ctx.fillRect(0, -10, canva.width, canva.height);
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, 1200, canva.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0, -10, 1200, 10);

    if (Misha.grafics)
    {
        GRC.background();
    }

    ctx.restore();

    ctx.save();
    ctx.translate(WorldAnchor.x, WorldAnchor.y);

    if (Misha.screens)
    {
        SCR.backscreen2(backscreen2);
    }

    PLM.drawPlatforms(platforms);

    if (Misha.enemy)
    {
        EMY.drawEnemys();
    }
    drawJumper();

    if (Misha.grafics)
    {
        GRC.textures();
    }
    drawAbilities();

    drawPlatform(lvlend);

    if (Misha.grafics)
    {
        GRC.drawPortal()
        GRC.drawSavePoints(platforms);
    }

    if (Misha.screens)
    {
        SCR.frontscreen(frontscreen);
    }

    moviesDraw();

    ctx.restore();

    if (Misha.musics)
    {
        MUS.drawAll();
    }
    if (Misha.overlays)
    {
        OVL.draw1();
    }

}
export function levelOnStart(starCount, p, l, jx, jy)
{
    restoreLevel(p, l);
    jumper.moveTo(jx, jy);
    onlvlloadChange_savePoint_current(jx, jy);
    onlvlload();
    if (Misha.overlays)
    {
        OVL.starStaredSet(0);
        OVL.starCountChange(starCount);
    }
    platforms.push(jumper);
    if (Misha.enemy)
    {
        EMY.startset();
    }
    SPL.readMemory(level);
}

function clipCanva()
{
    ctx.beginPath();
    ctx.moveTo(0, -10)
    ctx.lineTo(0, canva.height);
    ctx.lineTo(canva.width, canva.height);
    ctx.lineTo(canva.width, -10);
    ctx.lineTo(0, -10);
    ctx.clip();
}

function drawJumper()
{
    ctx.save();
    ctx.translate(jumper.x, jumper.y);

    // ctx.strokeStyle = "white";
    // ctx.strokeRect(0, 0, jumper.width, jumper.height);
    if (parametrs.jumper.visible)
    {
        if (!Misha.grafics)
        {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.arc(jumper.width / 2, jumper.height / 2, 16, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        if (Misha.grafics)
        {
            GRC.jumperTextures(jumper)
        }
    }
    ctx.restore();
}

export function drawPlatform(obj)
{
    ctx.save();
    ctx.translate(obj.x, obj.y);

    if (obj.changecolor == true)
    {
        const newObj = { x: obj.x - 2, y: obj.y - 1, width: obj.width + 4, height: obj.height + 2, };
        if (rectIntersect(newObj, jumper))
        {
            ctx.fillStyle = "lightgreen";
        }
        else
        {
            ctx.fillStyle = obj.color;
        }
    }
    else
    {
        ctx.fillStyle = obj.color;
    }
    if (!Misha.grafics)
    {
        ctx.fillRect(0, 0, obj.width, obj.height);
    }
    // ctx.strokeStyle = "black";
    // ctx.strokeRect(0, 0, obj.width, obj.height);

    if (Misha.grafics)
    {
        GRC.drawTexture(obj);
    }
    if (DEVparametrs.id)
    {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText(obj.id, 0, -4);
        ctx.restore();
    }
    ctx.restore();
}

function DEVdrawCord()
{
    ctx.save();
    ctx.strokeStyle = 'hsl(255, 255, 255)';
    ctx.beginPath();
    ctx.moveTo(-1, 200);
    ctx.lineTo(-1, -1);
    ctx.lineTo(200, -1);
    ctx.stroke();
    ctx.restore();
}



addEventListener('keydown', function (event) { KeyDown(event) })
function KeyDown(event)
{
    if (!Misha.noControl)
    {
        if (!Misha.noControlDown)
        {
            switch (event.code)
            {
                case 'ArrowUp':
                case 'Numpad8':
                case 'KeyW':
                case 'Space':
                    if (event.repeat == false)
                    {
                        KeyDownControl("up");
                    }
                    break;

                case 'ArrowRight':
                case 'Numpad6':
                case 'KeyD':
                    KeyDownControl("right");
                    break;

                case 'ArrowLeft':
                case 'Numpad4':
                case 'KeyA':
                    KeyDownControl("left");
                    break;

                case 'ArrowDown':
                case 'Numpad2':
                case 'KeyS':
                    KeyDownControl("down");
                    break;

                case 'ControlRight':
                case 'Numpad5':
                case 'KeyF':
                    KeyDownControl("extra1");
                    break;

                case 'Backslash':
                    // document.getElementById("canva2").style.display = "inline";
                    const panel = document.getElementById("canva2");
                    if (panel == null)
                    {
                        const el = document.createElement("canvas");
                        el.id = "canva2";
                        el.width = "300";
                        el.height = "600";
                        el.style = "border: 1px solid black; user-select: none; margin-left: 8px; display: inline;";
                        const cv = document.getElementById("canva");
                        cv.parentNode.insertBefore(el, cv.nextSibling);
                        // loadScript("jumperBase/DEVpanel.js");
                        import("./DEVpanel.js").then((m) =>
                        {
                            // m.start();
                        });
                    }
                    else
                    {
                        if (panel.style.display == "inline")
                        {
                            panel.style.display = "none";
                        }
                        else
                        {
                            panel.style.display = "inline";
                        }
                    }
                    break;

                case 'BracketRight':
                    if (event.repeat == false)
                    {
                        selectedCharacter = Math.min(selectedCharacter + 1, enemys.length - 1);
                    }
                    break;
                case 'BracketLeft':
                    if (event.repeat == false)
                    {
                        selectedCharacter = Math.max(selectedCharacter - 1, 0);
                    }
                    break;
                case 'Quote':
                    if (event.repeat == false)
                    {
                        controlCharacter += 1;;
                    }
                    break;

                default:
                    break;
            }
        }
    }
}

function KeyDownControl(event)
{
    switch (controlCharacter % 2) {
        case 0:
            CharacterControl(jumper, event, "down");
            break;

        case 1:
            if (Misha.enemy)
            {
                if (enemys.length > 0)
                {
                    if (selectedCharacter < enemys.length)
                    {
                        CharacterControl(enemys[selectedCharacter], event, "down");
                    }
                    else
                    {
                        console.error("base: function KeyDownControl: selected enemy %i don't exist", selectedCharacter);
                    }
                }
                else
                {
                    console.error("base: function KeyDownControl: enemy list is empty");
                }
            }
            else
            {
                console.error("base: function KeyDownControl: enemy is disable");
            }
            break;
        default:
            break;
    }
}


addEventListener('keyup', function (event) { KeyUp(event) })
function KeyUp(event)
{
    if (Misha.noControl != true)
    {
        switch (event.code)
        {
            case 'ArrowUp':
            case 'Numpad8':
            case 'KeyW':
            case 'Space':
                KeyUpControl("up");
                break;

            case 'ArrowRight':
            case 'Numpad6':
            case 'KeyD':
                KeyUpControl("right");
                break;

            case 'ArrowLeft':
            case 'Numpad4':
            case 'KeyA':
                KeyUpControl("left");
                break;

            case 'ArrowDown':
            case 'Numpad2':
            case 'KeyS':
                KeyUpControl("down");
                break;
            default:
                break;
        }
    }
}
function KeyUpControl(event)
{
    switch (controlCharacter % 2) {
        case 0:
            CharacterControl(jumper, event, "up");
            break;

        case 1:
            if (Misha.enemy)
            {
                if (enemys.length > 0)
                {
                    if (selectedCharacter < enemys.length)
                    {
                        CharacterControl(enemys[selectedCharacter], event, "up");
                    }
                    else
                    {
                        console.error("base: function KeyUpControl: selected enemy %i don't exist", selectedCharacter);
                    }
                }
                else
                {
                    console.error("base: function KeyUpControl: enemy list is empty");
                }
            }
            else
            {
                console.error("base: function KeyUpControl: enemy is disable")
            }
            break;
        default:
            break;
    }
}

export function CharacterControl(character, event, type)
{
    if (type == "down")
    {
        switch (event) {
            case "up":
                if (character.nowJump == false)
                {
                    character.nowJump = true;
                    character.jumpSpeed = character.jumpForce;
                    character.jmSpeed = character.moveSpeed;
                    character.state = "jumping";
                }
                break;

            case "right":
                character.moveAcc = character.speedAcc;
                break;

            case "left":
                character.moveAcc = -character.speedAcc;
                break;

            case "down":
                character.mass = character.massUnchange * 5;
                MUS.ost.play();
                break;

            case 'extra1':
                shotWithLeaf(character);
                break;

            default:
                console.error("base: function CharacterControl: type = 'down': event don't exist")
                break;
        }
    }
    else if (type == "up")
    {
        switch (event) {
            case "up":

                break;

            case "right":
                if (character.moveAcc == character.speedAcc)
                {
                    character.moveAcc = 0;
                }
                break;

            case "left":
                if (character.moveAcc == -character.speedAcc)
                {
                    character.moveAcc = 0;
                }
                break;

            case "down":
                character.mass = character.massUnchange;
                break;

            default:
                console.error("base: function CharacterControl: type = 'up': event don't exist")
                break;
        }
    }
    else
    {
        alert("ERROR: Wrong type of keyboard event");
    }
}

canva.addEventListener('click', function (event) { onClick(event) })
function onClick(event)
{
    let x = 0;
    let y = 0;
    if (fs_active)
    {
        x = event.pageX;
        y = event.pageY;

        x -= (screen.width - canva.width * fs_newScale) / 2;
        y = y / fs_newScale;

        x = x / fs_newScale;
        y = Math.abs(y - canva.height);
        console.log(x, y)
    }
    else
    {
        x = event.pageX;
        y = event.pageY;

        x -= canva.offsetLeft;
        y = Math.abs(y - canva.offsetTop - canva.height);
    }
    MUS.MUS_click(event, x, y)
    if (game.state == "inMenu")
    {
        menuClick(event, x, y);
    }
}


document.addEventListener('fullscreenchange', (event) => { fullScreen(); });
let fs_newScale = 0;
let fs_newTop = 0;
let fs_newLeft = 0;
let fs_active = false;
const fullScreenbutton = document.getElementById("fullScreenbutton");
fullScreenbutton.onclick = function () { document.documentElement.requestFullscreen(); };
function fullScreen()
{
    if (fs_active == false)
    {
        fs_newScale = screen.height / canva.height;
        fs_newTop = (canva.height * fs_newScale - canva.height) / 2;
        fs_newLeft = (canva.width * fs_newScale - canva.width) / 2 + (screen.width - canva.width * fs_newScale) / 2;
        fs_active = true;
        canva.style.transform = `scale(${fs_newScale})`;
        canva.style.position = "absolute";
        canva.style.top = `${fs_newTop - 3}px`;
        canva.style.left = `${fs_newLeft}px`;
        fullScreenbutton.style.display = "none";
    }
    else
    {
        fs_active = false;
        canva.style.transform = `scale(1)`;
        canva.style.position = "unset";
        fullScreenbutton.style.display = "inline";
    }
}