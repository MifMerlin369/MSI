import { ctx } from "../JumperBase/base.js";
import { imgsJumper } from "../JumperBase/grafics.js";

const width = 60;
const height = 60;

export function jumper_jumping(chr)
{
    ctx.drawImage(imgsJumper, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);

    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 1;
            break;

        case 3:
            chr.textureImg = 2;
            break;

        case 5:
            chr.textureImg = 3;
            break;

        case 7:
            chr.textureImg = 4;
            break;

        case 9:
            chr.textureImg = 5;
            break;

        default:
            break;
    }

}

export function jumper_falling(chr)
{
    ctx.drawImage(imgsJumper, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);
    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 9;
            break;

        case 2:
            chr.textureImg = 10;
            break;

        case 4:
            chr.textureImg = 11;
            break;

        case 6:
            chr.textureImg = 12;
            break;

        case 8:
            chr.textureImg = 13;
            break;

        case 10:
            chr.textureImg = 14;
            break;

        case 12:
            chr.textureImg = 15;
            break;

        case 14:
            chr.textureImg = 16;
            break;

        case 16:
            chr.textureImg = 17;
            chr.textureCounter = 0;
            break;

        default:
            break;
    }

}

export function jumper_going(chr)
{
    ctx.drawImage(imgsJumper, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);
    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 17;
            break;

        case 8:
            chr.textureImg = 18;
            break;

        case 12:
            chr.textureImg = 19;
            break;

        case 16:
            chr.textureImg = 20;
            break;

        case 20:
            chr.textureImg = 21;
            break;

        case 24:
            chr.textureImg = 22;
            break;

        case 28:
            chr.textureImg = 0;
            chr.textureCounter = -5;
            break;

        default:
            break;
    }
}

export function jumper_stoped(chr)
{
    ctx.drawImage(imgsJumper, 200 * chr.textureImg, 0, 200, 200, 0, 0, width, height);
    chr.textureCounter += 1;
    switch (chr.textureCounter)
    {
        case 1:
            chr.textureImg = 0;
            break;

        case 90:
            chr.textureImg = 23;
            break;

        case 95:
            chr.textureImg = 0;
            break;

        case 400:
            chr.textureCounter = 0;
            break;

        default:
            break;
    }
}
