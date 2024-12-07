import { rectIntersect } from "./Functions.js";
import { gameWindow, ctx } from "./base.js";

export class Particle
{
    constructor(x, y, width, height, type, color, counter)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.counter = counter || 0;
    }
}

export function drawParticles(plist)
{
    for (let p of plist)
    {
        if (rectIntersect(p, gameWindow))
        {
            drawParticle(p);
        }
    }
}

function drawParticle(obj)
{
    ctx.save();

    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

    ctx.restore();
}