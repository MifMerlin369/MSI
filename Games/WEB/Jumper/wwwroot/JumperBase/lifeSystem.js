import { rectIntersect } from "./Functions.js";
import { fileLoaded } from "./loading.js";
import { change_ost_volume, get_ost_volume } from "./music.js";
import { movie_toSavePoint } from "./movies.js";

const sounds = {};
sounds.shieldActivation = document.createElement("AUDIO");
sounds.shieldActivation.src = "sounds/jumper/shieldActivation.mp3";
sounds.shieldActivation.onloadeddata = function ()
{
    fileLoaded();
}

sounds.shield = document.createElement("AUDIO");
sounds.shield.src = "sounds/jumper/immortal.mp3";
sounds.shield.volume = 0;
sounds.shield.loop = true;
sounds.shield.onloadeddata = function ()
{
    fileLoaded();
}

const Vlife = { x: 685, y: 5, width: 90, height: 90, count: 4 };
export function get_Vlife()
{
    return {x: Vlife.x, y: Vlife.y, width: Vlife.width, height: Vlife.height, count: Vlife.count}
}
const savePoint = { current: 0, point: {x: 0, y: 0} };
export function requestChange_savePoint_current(newPoint)
{
    if (savePoint.current < newPoint.pointID)
    {
        savePoint.current = newPoint.pointID;
        savePoint.point = newPoint;
    }
}
export function get_savePoint_curent()
{
    return savePoint.current;
}
export function onlvlloadChange_savePoint_current(x, y)
{
    savePoint.point = {};
    savePoint.point.x = x;
    savePoint.point.y = y;
}

export function lifeSystem(chr, enemys)
{
    if (!chr.immortal.active)
    {
        const newChr = { x: chr.x - 2, y: chr.y - 2, width: chr.width + 4, height: chr.height + 4 };
        for (let i = 0; i < enemys.length; i++)
        {
            const el = enemys[i];
            if (rectIntersect(newChr, el) && !el.killed)
            {
                Vlife.count = Math.max(Vlife.count - 1, 0);
                chr.immortal.active = true;
                chr.immortal.activTime = 0;
                movie_toSavePoint(chr, savePoint.point);
            }
        }
    }
    if (chr.immortal.active)
    {
        if (chr.immortal.activTime != -1)
        {
            chr.immortal.activTime += 1;
            if (chr.immortal.activTime > 60)
            {
                chr.immortal.active = false;
            }
        }
    }

    if (!chr.shield.active)
    {
        sounds.shield.volume = Math.max(sounds.shield.volume - 0.02, 0);  // volume change
        change_ost_volume(Math.min(get_ost_volume() + 0.01, 0.5));
    }
    if (chr.shield.active)
    {
        sounds.shield.volume = Math.min(sounds.shield.volume + 0.005, 0.6);  // volume change
        change_ost_volume(Math.max(get_ost_volume() - 1, 0.001));
    }
    if (sounds.shield.volume == 0)
    {
        sounds.shield.pause();
    }
    else
    {
        sounds.shield.play();
    }
}

function shieldActivator()
{
    sounds.shieldActivation.currentTime = 0;
    sounds.shieldActivation.play();
    sounds.shield.currentTime = 0;
}
