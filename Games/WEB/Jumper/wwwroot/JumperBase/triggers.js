"use strict";
import {findWhithId} from "./Functions.js"
import {platforms} from "./base.js"
export function TRG_lever_door(leverID, doorID)
{
    const lever1 = findWhithId(platforms, leverID);
    const door1 = findWhithId(platforms, doorID);
    switch (platforms[lever1].leverState) {
        case "on":
            if (platforms[door1].doorState != "open")
            {
                platforms[door1].doorState = "opening";
            }
            break;

        case "off":
            if (platforms[door1].doorState != "close")
            {
                platforms[door1].doorState = "closing";
            }
            break;

        default:
            break;
    }
}