import Compositor from './Compositor.js'
import { loadLevel } from './loaders.js';
import { loadMarioSprite, loadBackgroundSprites } from './sprites.js';
import { createBackgroundLayer } from './layers.js'


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


function createSpriteLayer(entity){
    return function drawSpriteLayer(context){
            entity.draw(context);
    };
}

class Vec2 {
    constructor(x, y){
        this.set(x, y);
    }
    set(x, y){
        this.x = x;
        this.y = y;
    }
}

class Entity{
    constructor(){
        this.pos = new Vec2(0,0);
        this.vel = new Vec2(0,0);
    }
}

Promise.all([
    loadMarioSprite(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
])
.then(([marioSprite, backgroundSprites, level]) => {
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);

    comp.layers.push(backgroundLayer);

    const gravity = 0.5;

    const mario = new Entity();
    mario.pos.set(64, 180);
    mario.vel.set(2, -10);


    mario.draw = function drawMario(context) {
        marioSprite.draw('idle', context, this.pos.x, this.pos.y);
    }
    mario.update = function updateMario(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    function update(){
        comp.draw(context);
        mario.update();
        mario.vel.y += gravity;
        requestAnimationFrame(update);
    }

    update();
});