
window.Misha = window.Misha || Object.create(null);
const canva = document.getElementById("canva");
const ctx = canva.getContext('2d');

let loadingScreenPastCounter = 0;
let loadingScreenCounter = 0
let loadingScreentext = "Загрузка";
const ls = { x: 40, y: 250, width: 720, height: 100 }
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
let programmLoaded = false;
loadingScreen();
function loadingScreen()
{
    const background = ctx.createLinearGradient(canva.width, canva.height, 0, 200);
    background.addColorStop(0, 'rgba(255,251,18,1)');
    background.addColorStop(0.53, 'rgba(5,255,155,1)');
    background.addColorStop(1, 'rgba(0,255,255,1)');

    ctx.save();
    ctx.translate(0, 590);
    ctx.scale(1, -1);
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
    if (loadingScreenPastCounter + 20 < loadingScreenCounter)
    {
        if (loadingScreentext.length < 11)
        {
            loadingScreentext += ".";
        }
        else
        {
            loadingScreentext += " ";
        }
        loadingScreenPastCounter = loadingScreenCounter;
        if (loadingScreentext.length > 13)
        {
            loadingScreentext = "Загрузка";
        }
    }
    ctx.fillText(loadingScreentext, 40, 70);
    ctx.restore();
    ctx.restore();
    loadingScreenCounter += 1;
    if (!programmLoaded)
    {
        requestAnimationFrame(loadingScreen);
    }
}
function random_upNdown(count)
{
    if (Math.random() > 0.5)
    {
        return count;
    }
    else
    {
        return -count;
    }

}

function random_num(min, max)
{
    return min + Math.floor((max - min) * Math.random());
}
function drawParticle(p)
{
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
}

export function FSC_AllLoaded()
{
    programmLoaded = true;
}