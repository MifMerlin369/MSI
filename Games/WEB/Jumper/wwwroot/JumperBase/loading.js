"use strict";

import { ctx, TheCounter } from "./base.js";
import { levelLoadTime, game, levelLoadedChange } from "../start.js";
import { random_num, random_upNdown } from "./Functions.js";
import { crateImges, cratePatterns } from "./grafics.js";
import {loadFiles as SloadFiles} from "../jumperSounds/soundsEffects.js"
import {loadFiles as SPloadFiles, stopAllSounds} from "../jumperSounds/platformsSounds.js"
import {loadFiles as MloadFiles} from "./movies.js"
import {loadFiles as AloadFiles} from "./abilities.js"

let loadingScreenPastCounter = 0;
let loadingScreentext = "Загрузка";
class LoadingParticle
{
    constructor(x, y, width, height, color)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}
const loadingParticles = {};
loadingParticles.count = 0;
loadingParticles.particles = [];
const ls = { x: 40, y: 250, width: 720, height: 100 }

export function loadingScreen()
{
    const background = ctx.createLinearGradient(canva.width, canva.height, 0, 200);
    background.addColorStop(0, 'rgba(255,251,18,1)');
    background.addColorStop(0.53, 'rgba(5,255,155,1)');
    background.addColorStop(1, 'rgba(0,255,255,1)');

    ctx.save();
    ctx.fillStyle = background;
    ctx.fillRect(0, -10, 800, 600);

    ctx.beginPath();
    ctx.moveTo(ls.x - 2, ls.y - 2)
    ctx.lineTo(ls.x - 2, ls.y - 2 + ls.height + 4);
    ctx.lineTo(ls.x - 2 + ls.width + 4, ls.y - 2 + ls.height + 4);
    ctx.lineTo(ls.x - 2 + ls.width + 4, ls.y - 2);
    ctx.lineTo(ls.x - 2, ls.y - 2);
    ctx.clip();

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(ls.x, ls.y, ls.width, ls.height);

    if (loadingParticles.particles.length < 210)
    {
        const red = random_num(0, 256);
        const green = random_num(0, 256);
        const blue = random_num(0, 256);
        const newColor = `rgb(${red}, ${green}, ${blue})`;
        loadingParticles.particles.push(new LoadingParticle(ls.x - 20, ls.y + ls.height/2 - 10, 20, 20, newColor));
    }
    for (let i = 0; i < loadingParticles.particles.length; i++) {
        const el = loadingParticles.particles[i];
        el.x += random_num(3, 5);
        drawParticle(el);
        el.y += random_upNdown(3);
        el.y = Math.max(Math.min(el.y, ls.y + ls.height - el.height/2), ls.y - el.height/2);
        if (el.x > ls.x + ls.width)
        {
            el.x = ls.x - el.width;
            const red = random_num(0, 256);
            const green = random_num(0, 256);
            const blue = random_num(0, 256);
            el.color = `rgb(${red}, ${green}, ${blue})`;
        }
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(ls.x, ls.y, ls.width, ls.height);

    ctx.save();
    ctx.translate(180, 350);
    ctx.scale(1, -1)
    ctx.fillStyle = "white";
    ctx.font = "80px Arial";
    if (loadingScreenPastCounter + 20 < TheCounter.counter)
    {
        if (loadingScreentext.length < 11)
        {
            loadingScreentext += ".";
        }
        else
        {
            loadingScreentext += " ";
        }
        loadingScreenPastCounter = TheCounter.counter;
        if (loadingScreentext.length > 13)
        {
            loadingScreentext = "Загрузка";
        }
    }
    ctx.fillText(loadingScreentext, 40, 70);
    ctx.restore();

    ctx.restore();
}
function drawParticle(p)
{
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
}

let filesLoaded = 0;
let allFiles = 38;
export function fileLoaded()
{
    filesLoaded += 1;
}
export function requestGameChange(toMode, m)
{
    stopAllSounds();
    if (levelLoadTime + 50 < TheCounter.counter && filesLoaded == allFiles)
    {
        game.state = toMode;
        m.start();
        levelLoadedChange(true);
    }
    else
    {
        setTimeout(requestGameChange, 100, toMode, m);
        if (levelLoadTime + 200 < TheCounter.counter && TheCounter.counter < levelLoadTime + 210)
        {
            console.groupCollapsed("%crequestGameChange", "color: yellow");
            console.warn("%cCheck count of files in '%cfunction requestGameChange%c' in '%cfilesLoaded == %c%i%c'", "color: yellow", "color: green", "color: yellow", "color: green", "color: red", allFiles, "color: yellow" )
            console.warn("%cRed number %cMUST%c be equivalent to this number: %c%i", "color: yellow", "color: red", "color: yellow", "color: lime", filesLoaded);
            console.groupEnd();
        }
    }
}

export async function loadFiles()
{
    cratePatterns();
    crateImges();
    SloadFiles();
    SPloadFiles();
    MloadFiles();
    AloadFiles();
}
