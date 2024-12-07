import { fileLoaded } from "../JumperBase/loading.js";
import { random_num, rectIntersect } from "../JumperBase/Functions.js";
window.Misha = window.Misha || Object.create(null);
Misha.soundsEffect = true;

const sounds = {};

sounds.going = {};
sounds.going.files = [];
sounds.going.now = false;

sounds.jumping = {};
sounds.jumping.files = [];
sounds.jumping.now = false;

sounds.hit = {};
sounds.hit.files = [];
sounds.hit.now = false;

export function loadFiles()
{
    // sounds.going.files[0] = document.createElement("AUDIO");
    // sounds.going.files[0].src = "sounds/jumper/going.mp3";
    // sounds.going.files[0].onloadeddata = function ()
    // {
    //     fileLoaded();
    // }

    sounds.jumping.files[0] = document.createElement("AUDIO");
    sounds.jumping.files[0].src = "sounds/jumper/jumping.mp3";
    sounds.jumping.files[0].volume = 0.5;
    sounds.jumping.files[0].onloadeddata = function ()
    {
        fileLoaded();
    }

    sounds.hit.files[0] = document.createElement("AUDIO");
    sounds.hit.files[0].src = "sounds/jumper/hit.mp3";
    sounds.hit.files[0].onloadeddata = function ()
    {
        fileLoaded();
    }

    sounds.hit.files[1] = document.createElement("AUDIO");
    sounds.hit.files[1].src = "sounds/jumper/hit4.mp3";
    sounds.hit.files[1].onloadeddata = function ()
    {
        fileLoaded();
    }

}

export function characterSounds(chr, plts)
{
    if (chr.moveSpeed != 0)
    {
        const newChrX = { x: chr.x + chr.moveSpeed, y: chr.y, width: chr.width, height: chr.height };
        for (let i = 0; i < plts.length; i++) {
            const el = plts[i];
            if (el.id != chr.id && el.visible == true)
            {
                if (chr.x != chr.pastX && rectIntersect(newChrX, el))
                {
                    chr.sound_side = true;
                }
            }
        }
    }
    if (chr.jumpSpeed != 0)
    {
        const newChrY = { x: chr.x, y: chr.y + 2, width: chr.width, height: chr.height, };
        for (let i = 0; i < plts.length; i++)
        {
            const el = plts[i];
            if (el.id != chr.id && el.visible == true)
            {
                if (rectIntersect(newChrY, el))
                {
                    chr.sound_up = true;
                }
            }
        }
    }
    switch (chr.state) {
        // case "going":
        //     if (sounds.going.now == false)
        //     {
        //         sounds.going.files[0].currentTime = 0;
        //     }
        //     sounds.going.files[0].play();
        //     sounds.going.now = true;
        //     characterSounds_default("going");
        //     break;

        case "jumping":
            if (sounds.jumping.now == false)
            {
                // const r = random_num(0, 2);
                // console.log(r);
                sounds.jumping.files[0].currentTime = 0;
                sounds.jumping.files[0].play();
                sounds.jumping.now = true;
            }
            // characterSounds_default("jumping");
            break;

        default:
            sounds.jumping.now = false;
            // characterSounds_default();
            break;
    }
    if (chr.sound_up)
    {
        if (!chr.snowding)
        {
            // ding2.currentTime = 0;
            // ding2.play();
            // bum.currentTime = 0;
            // bum.play()
            sounds.jumping.files[0].pause();
            sounds.hit.files[0].play()
            chr.snowding = true;
        }
        chr.sound_up = false;
    }
    if (chr.sound_side)
    {
        if (!chr.snowbum)
        {
            sounds.hit.files[1].play()
                .catch(e =>
                {
                    if (e.name != 'NotAllowedError')
                    {
                        console.error(e);
                    }
                });
                chr.snowbum = true;
        }
        chr.sound_side = false;
    }
    else
    {
        chr.snowding = false;
        chr.snowbum  = false;
    }

    if (chr.statePast != chr.state)
    {
        if (chr.statePast == "falling")
        {
            bum.currentTime = 0;
            bum.play()
            // sounds.hit.files[random_num(0, 2)].play();
        }
    }

}

// function characterSounds_default(exclude)
// {
//     switch (exclude) {
//         // case "going":
//         //     sounds.jumping.now = false;
//         //     break;

//         case "jumping":
//             // sounds.going.now = false;
//             // sounds.going.files[0].pause();
//             break;

//         default:
//             // sounds.going.now = false;
//             // sounds.going.files[0].pause();
//             sounds.jumping.now = false;
//             break;
//     }

// }