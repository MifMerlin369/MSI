import { imgsEnemy } from "../JumperBase/grafics.js";
import { ctx, coins } from "../JumperBase/base.js";

const width = 64;
const height = 64;
const x = 0;
const y = 4;


export function enemy_going(chr)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(imgsEnemy, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);
    ctx.restore();
    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 1;
            break;

        case 4:
            chr.textureImg = 2;
            break;

        case 6:
            chr.textureImg = 3;
            break;

        case 8:
            chr.textureImg = 4;
            break;

        case 10:
            chr.textureImg = 5;
            break;

        case 12:
            chr.textureImg = 6;
            break;

        case 14:
            chr.textureImg = 7;
            break;

        case 16:
            chr.textureImg = 8;
            chr.textureCounter = -5;
            break;

        default:
            break;
    }
}

export function enemy_killed(chr)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(imgsEnemy, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);
    ctx.restore();
    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 10;
            break;

        case 4:
            chr.textureImg = 11;
            break;

        case 8:
            chr.textureImg = 12;
            break;

        default:
            break;
    }
}

export function enemy_stoped(chr)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(imgsEnemy, 0, 0, 200, 200, 0, 0, width, height);
    ctx.restore();
}
