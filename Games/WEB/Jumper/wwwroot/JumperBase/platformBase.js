export class Platform_simple {
    constructor(id, x, y, width, height, type, color, texture, visible)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.texture = texture;
        this.visible = visible;
    }
}


export class Platform_box extends Platform_simple {
    constructor(id, x, y)
    {
        super(id, x, y, 40, 40, "breakable", "brown", "box", true);
        this.leverState = "off";
        this.leverChange = false;
    }
}

export class Platform_star extends Platform_simple {
    constructor(id, x, y)
    {
        super(id, x, y, 40, 40, "star", "yellow", "star", false);
        this.colected = false;
    }
}

export class Platform_lifting extends Platform_simple {
    constructor(id, x, y, width, height, visible, speed, heightMax, heightMin)
    {
        super(id, x, y, width, height, "lifting", "rgb(0, 0, 0, 0.1)", "lift", visible);
        this.speed = speed;
        this.direction = "down";
        this.heightMax = heightMax;
        this.heightMin = heightMin;
        this.liftStyle = 0;
        this.lift = 0;
    }
}

export class Platform_savePoint extends Platform_simple {
    constructor(id, savePointID, x, y)
    {
        super(id, x, y, 40, 10, "savePoint", "rgb(0, 256, 0)", "savePoint", false);
        this.pointID = savePointID;
        this.particles = [];
        this.counter = 0;
    }
}




export class Platform_lever extends Platform_simple {
    constructor(id, x, y)
    {
        super(id, x, y, 20, 20, "lever", "rgb(0, 0, 0, 0.1)", "lever", false);
        this.leverState = "off";
        this.leverChange = false;
    }
}

export class Platform_door extends Platform_simple {
    constructor(id, x, y, width, height, type, color, texture, visible, doorState)
    {
        super(id, x, y, width, height, type, color, texture, visible);
        this.doorState = doorState;
        this.doorHeight = height;
        this.doorY = y;
        this.doorX = x;
        this.doorXd = "left";
    }
}

export class Platform_door_border extends Platform_simple {
    constructor(door)
    {
        super(door.id + 0.5, door.x - 2, door.y, door.width + 4, door.height, "ghost", "transparent", "clear", true);
        this.blockHeight = door.height;
        this.blockY = door.y;
    }
}



export class Platform_screens extends Platform_simple {
    constructor(id, x, y, width, height, type, texture, tranparent)
    {
        super(id, x, y, width, height, type, "red", texture, false);
        this.tranparent = tranparent || false;

    }
}