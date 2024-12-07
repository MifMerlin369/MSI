"use strict";
import {rectIntersect, rectXIntersectINF} from "./Functions.js"
import {Fg, Screen_edge_left, Screen_edge_right, WorldAnchor, jumper, mainFloor, platforms, World_edge_left, World_edge_right, WScreen_edge_left, WScreen_edge_right} from "./base.js"

export function Cgravity(obj)
{
    obj.jumpAcc -= Fg * obj.mass;
    obj.jumpSpeed += obj.jumpAcc;

    obj.jnowIntersect = false;
    for (let i = 0; i < platforms.length; i++)
    {
        const plt = platforms[i];
        if (!obj.jnowIntersect && (plt.visible == true || plt.visible == "true") && plt.id != obj.id)
        {
            let newObj = { x: obj.x, y: obj.y - 2, width: obj.width, height: obj.height, };
            CgravityPlatforms(newObj, obj, plt);

            newObj.y = obj.y + obj.jumpSpeed;
            if (rectIntersect(newObj, plt))
            {
                obj.ground = plt.y + plt.height;
                if (obj.jumpSpeed > 0)
                {
                    obj.floor = plt.y;
                }
                obj.jnowIntersect = true;
            }
            else
            {
                obj.ground = 0;
                obj.floor = mainFloor;
            }

        }
    }
    if (obj.jumpSpeed < 0)                   //GRC element
    {
        obj.state = "falling";                   //GRC element
    }
    obj.jnowIntersect = false;
    for (let i = 0; i < platforms.length; i++)
    {
        const plt = platforms[i];
        if (!obj.jnowIntersect && plt.visible == true && plt.id != obj.id)
        {
            let newObj = { x: obj.x, y: obj.y + obj.jumpSpeed, width: obj.width, height: obj.height, };
            if (rectIntersect(newObj, plt))
            {
                obj.ground = plt.y + plt.height;
                if (obj.jumpSpeed > 0)
                {
                    obj.floor = plt.y;
                }
                obj.jnowIntersect = true;
            }
            else
            {
                obj.ground = 0;
                obj.floor = mainFloor;
            }
        }
    }

    obj.y = Math.min(Math.max(obj.y + obj.jumpSpeed, obj.ground), obj.floor - obj.height);

    if (obj.y == obj.ground || obj.y + obj.height == obj.floor)
    {
        obj.nowJump = false;
        obj.jumpAcc = 0;
        obj.jumpSpeed = -obj.mass * 4.5;
    }
    else
    {
        obj.nowJump = true;
    }
    if (obj.y == obj.ground)
    {
        obj.jmSpeed = 0;
        obj.state = "stoped";                //GRC element
    }
}
function CgravityPlatforms(newObj, obj, platform)
{
    if (rectIntersect(newObj, platform))
    {
        if (obj.id != "jumper" || !Misha.soundsEffect)
        {
            obj.sound_up = true;
        }

        if (platform.fallOnEdge == null)            //fall on edge
        {
            let objX = obj.x;
            if (obj.x + obj.width / 2 < platform.x)
            {
                newObj.x = platform.x - obj.width - 1;
                obj.jmSpeed = obj.moveSpeed;
            }
            else if (obj.x + obj.width / 2 > platform.x + platform.width)
            {
                newObj.x = platform.x + platform.width + 1;
                obj.jmSpeed = obj.moveSpeed
            }
            obj.x = newObj.x;

            for (let i = 0; i < platforms.length; i++)
            {
                const plt = platforms[i];
                if (rectIntersect(newObj, plt) && plt.id != obj.id)
                {
                    obj.x = objX;
                }
            }
        }

        obj.jnowIntersect = true;
    }
    else
    {
        obj.ground = 0;
        // sound_up = false;
    }
}
export function Cmovement(obj)
{
    if (obj.moveAcc > 0)
    {
        if (obj.moveSpeed < obj.speed)
        {
            obj.moveSpeed += obj.moveAcc;
        }
        if (obj.jmSpeed == 0)           //GRC element
        {
            obj.direction = "right";
            obj.state = "going";                //GRC element
        }
    }
    else if (obj.moveAcc < 0)
    {
        if (obj.moveSpeed > -obj.speed)
        {
            obj.moveSpeed += obj.moveAcc;
        }
        if (obj.jmSpeed == 0)           //GRC element
        {
            obj.direction = "left";
            obj.state = "going";                //GRC element
        }
    }
    else
    {
        if (obj.moveSpeed != 0)
        {
            if (obj.moveSpeed > 0)
            {
                obj.moveSpeed += -1
            }
            else
            {
                obj.moveSpeed += 1
            }
            if (obj.moveSpeed > -1 && obj.moveSpeed < 1)
            {
                obj.moveSpeed = 0;
            }
        }
    }
    if (obj.moveAcc > 0)
    {
        if (obj.moveSpeed > obj.speed)
        {
            obj.moveSpeed -= 1;
        }
    }
    else if (obj.moveAcc < 0)
    {
        if (obj.moveSpeed < -obj.speed)
        {
            obj.moveSpeed += 1;
        }
    }
    let newX = 0;
    if (obj.y > obj.ground)
    {
        newX = Math.min(Math.max(obj.x + obj.jmSpeed, World_edge_left), World_edge_right - obj.width);
    }
    else
    {
        newX = Math.min(Math.max(obj.x + obj.moveSpeed, World_edge_left), World_edge_right - obj.width);
    }
    const newObj = { x: newX, y: obj.y, width: obj.width, height: obj.height, };
    obj.mnowIntersect = false;
    let intersectObj = null;

    for (let i = 0; i < platforms.length; i++)
    {
        if (!obj.mnowIntersect)
        {
            const plt = platforms[i];
            if ((plt.visible == true || plt.visible == "true") && plt.id != obj.id) // && plt.type != "enemy"
            {
                if (rectIntersect(newObj, plt))
                {
                    if (obj.id != "jumper" || !Misha.soundsEffect)
                    {
                        obj.sound_side = true;
                    }
                    obj.mnowIntersect = true;
                    intersectObj = plt;
                    obj.jmSpeed *= 0.8;
                    obj.flattening = "hit";                //GRC element
                }
            }
        }
    }
    if (!obj.mnowIntersect)
    {
        obj.x = newX;
        obj.mnowStrike = false;
    }
    else
    {
        if (rectXIntersectINF(newObj, intersectObj) == "left")
        {
            obj.x = Math.min(newX, intersectObj.x - obj.width);

        }
        else if (rectXIntersectINF(newObj, intersectObj) == "right")
        {
            obj.x = Math.max(newX, intersectObj.x + intersectObj.width);
        }
        if (!obj.mnowStrike)
        {
            obj.nowJump *= 0.5;
            obj.mnowStrike = true;
        }
    }
}

export function moveScreen()
{
    if (jumper.x < Screen_edge_left + -WorldAnchor.x)
    {
        WorldAnchor.x = Math.max(Math.min(-jumper.x + Screen_edge_left, -WScreen_edge_left), -(WScreen_edge_right - canva.width));
    }
    if (jumper.x > Screen_edge_right + -WorldAnchor.x)
    {
        WorldAnchor.x = Math.max(Math.min(-jumper.x + Screen_edge_right, -WScreen_edge_left), -(WScreen_edge_right - canva.width));
    }
}

export function moveScreenTo(x, y)
{
    const newX = -x || WorldAnchor.x;
    const newY = -y || WorldAnchor.y;
    WorldAnchor.x = Math.max(Math.min(newX, -WScreen_edge_left), -(WScreen_edge_right - canva.width));
    WorldAnchor.y = newY;
}
