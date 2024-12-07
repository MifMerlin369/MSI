import { ctx, platforms, gameWindow } from "./base.js";
import { rectIntersect, random_num } from "./Functions.js";
import { fileLoaded } from "./loading.js";
import { Particle } from "./particles.js";

export function loadFiles()
{
    images.leaf = new Image();
    images.leaf.src = "pictures/leaf.png";
    images.leaf.onload = function ()
    {
        images.Loaded += 1;
        fileLoaded();
    }
}
const images = {All: 1, Loaded: 0};

const shot = { x: 0, y: 0, sx: 0, sy: 0, ex: 0, ey: 0, power: 250, speed: 10, done: true, width: 20, height: 20, particles: [], drawingEnd: true };
export function get_shot()
{
    return { x: shot.x, y: shot.y, width: shot.width, height: shot.height };
}

export function abilitiesLogic()
{
    if (!shot.done)
    {
        shoting();
    }
}

function shoting()
{
    if (shot.sx < shot.ex)
    {
        shot.x = Math.min(shot.x + shot.speed, shot.ex);
    }
    else
    {
        shot.x = Math.max(shot.x - shot.speed, shot.ex);
    }
    if (shot.x == shot.ex)
    {
        shot.done = true;
    }

    let canContinue = false;
    for (let i = 0; i < platforms.length; i++)
    {
        const plt = platforms[i];
        if (rectIntersect(shot, plt) && plt.type != "character" && plt.type != "savePoint" && plt.type != "fake" && plt.type != "lever")
        {
            shot.done = true;
        }
        const newObj = { x: shot.x, y: shot.y - 1, width: shot.width, height: shot.height };
        if ((plt.type == "simple" && rectIntersect(newObj, plt)) || shot.y == 0)                           //zero cord check
        {
            canContinue = true;
        }
    }
    if (!canContinue)
    {
        shot.done = true;
    }

    if (true)
    {
        for (let i = 0; i < 3; i++)
        {
            const width = random_num(6, 12);
            const p = new Particle(0, 0, width, width, "ghost", "red", false);
            p.x = shot.x + shot.width / 2 + random_num(-10, 10);
            if (shot.ex - shot.sx > 0)
            {
                p.x = Math.max(p.x - p.x % 30, shot.sx);
            }
            else
            {
                p.x = Math.min(p.x - p.x % 30, shot.sx);
            }
            p.y = shot.y;
            p.rotate = random_num(0, 360);
            p.alpha = 1;
            p.Ydirection = 1;
            p.speed = random_num(-6, 6) / 3;
            p.direction = random_num(0, 2);
            shot.particles.push(p);
        }
    }
}

export function drawAbilities()
{
    if (!shot.done || !shot.drawingEnd)
    {
        drawShot();
    }
}

function drawShot()
{
    ctx.save();
    if (!shot.done)
    {
        // ctx.fillStyle = "green";
        // ctx.fillRect(shot.x, shot.y, shot.width, shot.height);

        ctx.fillStyle = "lightgreen";
        ctx.fillRect(shot.x + shot.width / 4, shot.y + shot.width / 4, shot.width / 2, shot.height / 2);
    }
    for (let i = shot.particles.length - 1; i >= 0; i--) {
        const el = shot.particles[i];
        if (rectIntersect(el, gameWindow))
        {
            el.alpha = Math.max(el.alpha - 0.02, 0);
            if (el.alpha == 0)
            {
                shot.particles.splice(i, 1);
            }
            else
            {
                if (random_num(0, 10) == 0)
                {
                    el.direction = random_num(0, 2);
                }
                if (el.direction)
                {
                    el.rotate += random_num(0, 20);
                }
                else
                {
                    el.rotate -= random_num(0, 20);
                }

                el.x += el.speed;
                if (el.Ydirection)
                {
                    el.y += random_num(5, 8);
                    if (el.y > shot.y + 20)
                    {
                        el.Ydirection = 0;
                    }
                }
                else
                {
                    el.y -= random_num(0, 3) / 2;
                }

                ctx.save()
                ctx.translate(el.x, el.y);
                ctx.rotate(el.rotate * Math.PI / 180);
                ctx.globalAlpha = el.alpha;
                if (Misha.grafics)
                {
                    ctx.drawImage(images.leaf, -el.width / 2, -el.height / 2, el.width, el.height);
                }
                else
                {
                    const red = random_num(0, 160);
                    const green = random_num(255, 255);
                    const blue = random_num(0, 102);
                    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                    // ctx.fillStyle = "lightgreen";
                    ctx.fillRect(-el.width / 2, -el.height / 2, el.width, el.height);
                }
                ctx.restore();
            }
        }
    }
    if (shot.particles.length == 0)
    {
        shot.drawingEnd = true;
    }
    ctx.restore();
}




export function shotWithLeaf(chr)
{
    if (shot.done)
    {
        shot.x = chr.x;
        shot.y = chr.y;
        shot.sx = chr.x;
        shot.sy = chr.y;
        switch (chr.direction)
        {
            case "right":
                shot.ex = chr.x + shot.power;
                break;

            case "left":
                shot.ex = chr.x - shot.power;
                break;

            default:
                break;
        }
        shot.ey = chr.y;
        shot.done = false;
        shot.drawingEnd = false;
    }
}