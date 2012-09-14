/*
 * このgame描画用のコードは独立した部分をtakumi hattaが作成し、
 * それをオンライン用にtakaya kotohataが改造したものです
 *
 */


////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                          2d vector compute functions                               //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                useful functions                                    //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function inherit(C, P) {
    C.prototype = new P(arguments[2], arguments[3]);
};

function rand(min, max) {
    return ((max - min) * Math.random()) + min;
};

function randInt(min, max) {
    return Math.floor(((max - min) * Math.random()) + min);
};

function collisionCircle(circle1, circle2, r1, r2) {
    return ((Math.pow(circle1.x - circle2.x, 2) +
             Math.pow(circle1.y - circle2.y, 2)) < Math.pow((r1 + r2), 2));
};

function decToHex(d) {
    if (d == 0) {
        return "00";
    }
    var hex = Number(d).toString(16);
    return hex;
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                             simplex list structure                                 //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function List() {
    this._head = null,
    this._length = 0
}

List.prototype = {
    add: function (data) {
        var node = { data: data, next: null },
            current;

        if (this._head === null) {
            this._head = node;
        } else {
            current = this._head;

            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }

        this._length += 1;
    },

    item: function (index) {
        if (index > -1 && index < this._length) {
            var current = this._head,
                i = 0;
            while (i < index) {
                i += 1;
                current = current.next;
            }
            return current.data;
        } else {
            return null;
        }
    },

    remove: function (index) {
        if (index > -1 && index < this._length) {
            var current = this._head,
                prev,
                i = 0;

            if (index === 0) {
                this._head = current.next;
            } else {
                while (i < index) {
                    i += 1;
                    prev = current;
                    current = current.next;
                }
                prev.next = current.next;
            }
            this._length -= 1;
            return current.data;
        } else {
            return null;
        }
    },

    getLength: function () {
        return this._length;
    }
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                  mouse controller                                  //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function MouseCtrl() {
    var instance;

    MouseCtrl = function MouseCtrl() {
        return instance;
    };

    MouseCtrl.prototype = this;

    instance = new MouseCtrl();

    instance.constructor = MouseCtrl;

    return instance;
}

MouseCtrl.prototype.x = 130;
MouseCtrl.prototype.y = 350;
MouseCtrl.prototype.isPush = false;

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                             game parameter controller                              //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function GameCtrl() {
    var instance;

    GameCtrl = function GameCtrl() {
        return instance;
    };

    instance = new GameCtrl();

    instance.constructor = GameCtrl;

    return instance;
}

GameCtrl.prototype.BLEND_MODE = null;
GameCtrl.prototype.PLAYER_BREAK = false;
GameCtrl.prototype.GAME_OVER = false;
GameCtrl.prototype.GAME_CLEAR = false;
GameCtrl.prototype.GAME_HANDLER = null;
GameCtrl.prototype.GAME_SYSTEM = null;
GameCtrl.prototype.BOSS_FLAG = false;
GameCtrl.prototype.BOSS_DEAD = false;
GameCtrl.prototype.BOSS_EMERGE_TIME = 1200;
GameCtrl.prototype.ENABLE_BULLET = false;
GameCtrl.prototype.SOUND_LIST = [new Audio("/snd/stage.mp3")];
GameCtrl.prototype.BULLET_MODE = 0;
GameCtrl.prototype.IS_ITEM_GET = false;
GameCtrl.prototype.WITCH_ITEM = false;

// online elements
GameCtrl.prototype.SCORE = 0;
GameCtrl.prototype.LAP_SCORE = 0;
GameCtrl.prototype.STAR = null;
GameCtrl.prototype.NEWS = null;
GameCtrl.prototype.USER_NAME = "User1";
GameCtrl.prototype.GRADE = "";
GameCtrl.prototype.CONNECTS_NUM = 1;
GameCtrl.prototype.JACKPOT = null;

GameCtrl.prototype.initialize = function () {
    GameCtrl.prototype.SCORE = 0;
    GameCtrl.prototype.LAP_SCORE = 0;
    GameCtrl.prototype.GAME_OVER = false;
    GameCtrl.prototype.GAME_CLEAR = false;
    GameCtrl.prototype.BOSS_FLAG = false;
    GameCtrl.prototype.BOSS_DEAD = false;
    GameCtrl.prototype.ENABLE_BULLET = false;
    GameCtrl.prototype.BULLET_MODE = 0;
    GameCtrl.prototype.IS_ITEM_GET = false;
    GameCtrl.prototype.WITCH_ITEM = false;
    GameCtrl.prototype.PLAYER_BREAK = false;
};

GameCtrl.prototype.removeChildren = function (data) {
    for (var i = 0, size = data.length; i < size; i += 1) {
        this.GAME_HANDLER.removeChild(data[i]);
    }
};

GameCtrl.prototype.stopSound = function (num){
    GameCtrl.prototype.SOUND_LIST[num].pause();
    GameCtrl.prototype.SOUND_LIST[num].currentTime = 0;
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                               particle  controller                                 //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function ParticleCtrl() {
    var instance;

    ParticleCtrl = function ParticleCtrl() {
        return instance;
    };

    instance = new ParticleCtrl();

    instance.constructor = ParticleCtrl;

    return instance;
}

ParticleCtrl.prototype.GENERATOR = null;

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                          define particles behavior                                 //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function Particle(x, y) {
    this.position = new Vector2(x, y),
    this.v = new Vector2(rand(1.0, 8.0), rand(1.0, 8.0)),
    this.dir = 0.0,
    this.color = rand(0.8, 1.0),
    this.size = 15,
    this.scale = 1.0,
    this.timer = 0,
    this.texture = null,
    this.angle = randInt(0, 361),
    this.last = new Vector2(rand(0, 300), 520),

    this.initialize = function (texName) {
        this.texture = new arc.display.Sprite(GameCtrl.prototype.GAME_SYSTEM.getImage(texName));
        this.setScale(this.scale);
        GameCtrl.prototype.GAME_HANDLER.addChild(this.texture);
    },

    this.update = function () { },

    this.remove = function () {
        GameCtrl.prototype.GAME_HANDLER.removeChild(this.texture);
    },

    this.isEnd = function () {
        return (this.color <= 0 || this.position.y > 520);
    },

    this.setDirection = function (dir) {
        this.dir = dir;
    },

    this.setPosition = function (position) {
        this.texture.setX(this.position.x);
        this.texture.setY(this.position.y);
    },

    this.setScale = function (scale) {
        this.texture.setScaleX(scale);
        this.texture.setScaleY(scale);
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                       define boss attack particle behavior                         //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function updateSoulParticle(playerPosition) {
    if (this.timer < 30) {
        this.angle = Math.atan2(playerPosition.y - this.position.y, playerPosition.x - this.position.x);
        this.timer += 1;
    }

    this.position.x += 8.0 * Math.cos(this.angle);
    this.position.y += 8.0 * Math.sin(this.angle);

    this.setPosition(this.position);
};

function updateSpiralParticle(playerPosition) {
    this.position.x += Math.cos(this.dir) * 3.8;
    this.position.y += Math.sin(this.dir) * 3.8;

    this.setPosition(this.position);
};

function updateRaserParticle(playerPosition) {
    this.angle += 0.08;
    this.position.x += Math.sin(this.angle) * 4.8;
    this.position.y += 5.0;

    this.setPosition(this.position);
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                             define dead particle effect                            //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function updateEnemyBreakParticle() {
    this.position.x += Math.cos(this.dir) * 1.25;
    this.position.y += Math.sin(this.dir) * 1.25;

    this.setPosition(this.position);

    this.color -= 0.034;
    this.color = Math.max(0, this.color);
    this.texture.setAlpha(this.color);
};

function updateBossBreakParticle() {
    this.frameTimer += 0.5;

    this.position.x += Math.cos(this.dir) * 2.5 * 1.0;
    this.position.y += Math.sin(this.dir) * 2.5 * 1.0;

    this.scale += 0.05;
    this.scale = Math.min(2.0, this.scale);

    this.setPosition(this.position);

    this.color -= 0.025;
    this.color = Math.max(0, this.color);
    this.texture.setAlpha(this.color);
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                          particle management system                                //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function ParticleManager() {
    this.container = new List(),

    this.push = function (particle) {
        this.container.add(particle);
    },

    this.update = function (playerPosition) {
        for (var i = 0, size = this.container.getLength(); i < size; i += 1) {
            this.container.item(i).update(playerPosition);
        }

        for (var i = 0; i < this.container.getLength(); ) {
            if (this.container.item(i).isEnd()) {
                this.container.item(i).remove();
                this.container.remove(i);
            } else {
                i += 1;
            }
        }
    },

    this.finish = function () {
        for (var i = 0; i < this.container.getLength(); ) {
            this.container.item(i).remove();
            this.container.remove(i);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //        
//                             define object's behavior                               //
//                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////// 

function ObjectBase(texture_path) {
    this._position = new Vector2(0, 0),
    this._velocity = 0,
    this._angle = 0,
    this._radius = 10,
    this._texture = new arc.display.Sprite(GameCtrl.prototype.GAME_SYSTEM.getImage(texture_path)),
    this._isDead = false,
    this._animation = null,
    this._particleManager = new ParticleManager(),
    this._color = 1.0,
    this._isColor = false,

    this.initialize = function (position) {
        this._position.x = position.x;
        this._position.y = position.y;
        this._texture.setX(position.x);
        this._texture.setY(position.y);
        this._velocity = rand(2.0, 10.0);
        this._angle = rand(0.0, 100.0);
        GameCtrl.prototype.GAME_HANDLER.addChild(this._texture);
    },

    this.update = function () {
        this._position.x = MouseCtrl.prototype.x - 12;
        this._position.y = MouseCtrl.prototype.y - 35;
        this._position.x = Math.max(Math.min(this._position.x, 260), 0);
        this._position.y = Math.max(Math.min(this._position.y, 410), 0);
        this._texture.setX(this._position.x);
        this._texture.setY(this._position.y);

        if (GameCtrl.prototype.BOSS_FLAG) {
            this._radius = 5;
        }
    },

    this.damageEffect = function (texName) {
        for (var i = 0; i < 12; i += 1) {
            var p = new Particle(this._position.x, this._position.y);
            p.initialize(texName);
            p.setDirection(randInt(0, 360));
            p.setScale(1.5, 1.5);
            p.update = updateEnemyBreakParticle;
            ParticleCtrl.prototype.GENERATOR.push(p);
        }
    },

    // player vs other
    this.collisionDetection = function (other) {
        // player vs boss
        if (GameCtrl.prototype.BOSS_FLAG) {
            if (collisionCircle(this._position, new Vector2(other._position.x + 20, other._position.y + 10), this._radius, other._radius)) {
                this.damageEffect("/images/pop/effect03.png");
                GameCtrl.prototype.SCORE -= 50;
                GameCtrl.prototype.SCORE = Math.max(0, GameCtrl.prototype.SCORE);
                GameCtrl.prototype.LAP_SCORE -= 50;
                GameCtrl.prototype.LAP_SCORE = Math.max(0, GameCtrl.prototype.LAP_SCORE);
            }
            return false;
        }

        // player vs enemy
        if (collisionCircle(new Vector2(this._position.x + 2, this._position.y), other._position, this._radius, other._radius)) {
            this.damageEffect("/images/pop/effect03.png");
            GameCtrl.prototype.SCORE -= 50;
            GameCtrl.prototype.SCORE = Math.max(0, GameCtrl.prototype.SCORE);
            GameCtrl.prototype.LAP_SCORE -= 50;
            GameCtrl.prototype.LAP_SCORE = Math.max(0, GameCtrl.prototype.LAP_SCORE);
            //this.remove();
            other.remove();
            //return true;
        }
        return false;
    },

    // bullet vs enemy
    this.collisionBullet = function (container) {
        for (var i = 0; i < container.getLength(); ) {
            if (collisionCircle(this._position, container.item(i)._position, this._radius + 5, container.item(i)._radius)) {
                this.remove();
                container.item(i).remove();
                container.remove(i);
                this.damageEffect("/images/pop/effect02.png");
                return true;
            } else {
                i += 1;
            }
        }
        return false;
    },

    // boss particle vs player
    this.collisionParticle = function (container) {
        for (var i = 0; i < container.getLength(); i += 1) {
            if (collisionCircle(new Vector2(this._position.x + 10, this._position.y + 5), container.item(i).position, this._radius, 5)) {
                this.damageEffect("/images/pop/effect03.png");
                container.item(i).remove();
                container.remove(i);
            }
        }
    },

    this.remove = function () {
        this._isDead = true;
        GameCtrl.prototype.GAME_HANDLER.removeChild(this._texture);
    },

    this.setAnimation = function () {
        this._position = new Vector2(105, -110);
        this._animation = new arc.display.SheetMovieClip(GameCtrl.prototype.GAME_SYSTEM.getImage("/images/pop/boss.png"), 100, 6, true, false);
        this._animation.setX(this._position.x);
        this._animation.setY(this._position.y);
        GameCtrl.prototype.GAME_HANDLER.addChild(this._animation);
        this._animation.play();
    }
}

ObjectBase.prototype.setScale = function (v) {
    this._texture.setScaleX(v.x);
    this._texture.setScaleY(v.y);
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                   enemy behavior                                   //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function updatePlayerTargetFunc(playerPosition) {
    if (playerPosition.x > this._position.x) {
        this._position.x += 0.5;
    }

    if (playerPosition.x < this._position.x) {
        this._position.x -= 0.5;
    }

    this._position.y += 2.5 * rand(0.5, 2.5);

    this._texture.setX(this._position.x);
    this._texture.setY(this._position.y);

    if (!this._isColor) {
        this._color -= 0.015;
        this._color = Math.max(0, this._color);
        if (this._color <= 0) {
            this._isColor = true;
        }
    }

    if (this._isColor) {
        this._color += 0.015;
        this._color = Math.min(1, this._color);
        if (this.color >= 1) {
            this._isColor = false;
        }
    }

    this._texture.setAlpha(this._color);

    if (this._position.y > 520) {
        this.remove();
    }
};

function updateRotateFunc(playerPosition) {
    this._position.x += Math.sin((this._angle += rand(0.02, 0.08))) * 1.8;
    this._position.y += this._velocity * 0.8;
    this._texture.setX(this._position.x);
    this._texture.setY(this._position.y);
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                  bullet behavior                                   //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function updateBulletFunc() {
    this._position.y -= 5.0;
    this._texture.setY(this._position.y);

    if (this._position.y < -20) {
        this.remove();
    }
};

function updateWitchBullet() {
    this._angle += 0.08;
    this._position.x += Math.sin(this._angle) * 1.8;
    this._position.y -= 5.0;
    this._texture.setX(this._position.x);
    this._texture.setY(this._position.y);

    if (this._position.y < -20) {
        this.remove();
    }
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                    item behavior                                   //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function updateItem() {
    this._position.y += 5.0;
    this._texture.setY(this._position.y);

    if (this._position.y > 500) {
        this.remove();
    }
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                                   boss behavior                                    //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

var boss_parameter = {
    hitpoint: 600,
    timer: 0,
    current: 0,
    initialize: function () {
        this.hitpoint = 600;
        this.timer = 0;
    }
};

function updateBossFunc(playerPosition) {
    this._position.y += 0.5;
    this._position.y = Math.min(65, this._position.y);

    this._animation.setX(this._position.x);
    this._animation.setY(this._position.y);

    if (this._position.y <= 45) {
        return;
    }

    GameCtrl.prototype.ENABLE_BULLET = false;

    boss_parameter.timer += 1;

    if (boss_parameter.timer % 60 == 0) {
        //@ boss attack : mode1
        if (boss_parameter.timer < 600) {
            for (var i = 0; i < 5; i += 1) {
                var p = new Particle(randInt(0, 290), randInt(40, 45));
                p.initialize("/images/pop/particle02.png")
                p.update = updateSoulParticle;
                this._particleManager.push(p);
            }
        }

        //@ boss attack : mode2
        if (boss_parameter.timer >= 600 && boss_parameter.timer < 1800) {
            for (var i = 0; i < 18; i += 1) {
                var p = new Particle(120, 65);
                p.initialize("/images/pop/particle02.png");
                p.update = updateSpiralParticle;
                p.setDirection(randInt(0, 180)*Math.PI/180);
                this._particleManager.push(p);
            }
        }

        //@ boss attack : mode3
        if (boss_parameter.timer >= 1900) {
            if (boss_parameter.timer % 30 == 0) {
                for (var i = 0; i < 7; i += 1) {
                    var p = new Particle(randInt(0, 290), randInt(-40, 40));
                    p.initialize("/images/pop/particle02.png");
                    p.update = updateRaserParticle;
                    this._particleManager.push(p);
                }
            }
        }

        // boss attack : mode4
        if (boss_parameter.timer >= 2500) {
            for (var i = 0; i < 18; i += 1) {
                var p = new Particle(120, 65);
                p.initialize("/images/pop/particle02.png");
                p.update = updateSpiralParticle;
                p.setDirection(randInt(0, 180) * Math.PI / 180);
                this._particleManager.push(p);
            }
        }
    }

    this._particleManager.update(playerPosition);
};

function removeBoss() {
    boss_parameter.initialize();
    GameCtrl.prototype.GAME_HANDLER.removeChild(this._animation);
    GameCtrl.prototype.BOSS_DEAD = true;
    this._particleManager.finish();
};

function collisionBoss_Bullet(container) {
    for (var i = 0; i < container.getLength(); ) {
        if (collisionCircle(new Vector2(this._position.x + 20, this._position.y + 10), container.item(i)._position, this._radius, container.item(i)._radius)) {
            container.item(i).remove();
            container.remove(i);
            boss_parameter.hitpoint -= 1;
            GameCtrl.prototype.SCORE += 10;
            GameCtrl.prototype.LAP_SCORE += 10;
            if (boss_parameter.hitpoint == 0) {
                this.remove();
                return true;
            }
        } else {
            i += 1;
        }
    }
    return false;
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                              object generate process                               //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function ObjectFactory() {
    this.system = GameCtrl.prototype.GAME_SYSTEM;
}

ObjectFactory.create = function (type, imagename) {
    if (type == "Player") {
        function Player() { }
        inherit(Player, ObjectBase, imagename, this.system);
        return new Player();
    }

    if (type == "Enemy") {
        function Enemy() { }
        inherit(Enemy, ObjectBase, imagename, this.system);
        return new Enemy();
    }

    if (type == "Bullet") {
        function Bullet() { }
        inherit(Bullet, ObjectBase, imagename, this.system);
        Bullet.prototype.update = updateBulletFunc;
        return new Bullet();
    }

    if (type == "Boss") {
        function Boss() { }
        inherit(Boss, ObjectBase, imagename, this.system);
        Boss.prototype.update = updateBossFunc;
        Boss.prototype.remove = removeBoss;
        Boss.prototype.collisionBullet = collisionBoss_Bullet;
        return new Boss();
    }
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                              object management process                             //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function ObjectManager() {
    this._container = new List(),
    this._bulletContainer = new List(),
    this._itemContainer = new List(),

    this.push = function (object) {
        this._container.add(object);
    },

    this.pushBullet = function (bullet) {
        this._bulletContainer.add(bullet);
    },

    this.pushItem = function (item) {
        this._itemContainer.add(item);
    },

    this.update = function () {
        this.updateContainer();
        this.removeContainer();
        this.collisionDetection();
    },

    this.finish = function () {
        for (var i = 0; i < this._container.getLength(); ) {
            this._container.item(i).remove();
            this._container.remove(i);
        }

        for (var i = 0; i < this._bulletContainer.getLength(); ) {
            this._bulletContainer.item(i).remove();
            this._bulletContainer.remove(i);
        }
    },

    this.updateContainer = function () {
        for (var i = 0, size = this._container.getLength(); i < size; i += 1) {
            this._container.item(i).update(this._container.item(0)._position);
        }

        for (var i = 0, size = this._bulletContainer.getLength(); i < size; i += 1) {
            this._bulletContainer.item(i).update();
        }

        for (var i = 0, size = this._itemContainer.getLength(); i < size; i += 1) {
            this._itemContainer.item(i).update();
        }
    },

    this.removeContainer = function () {
        for (var i = 0; i < this._container.getLength(); ) {
            if (this._container.item(i)._isDead) {
                this._container.remove(i);
            } else {
                i += 1;
            }
        }

        for (var i = 0; i < this._bulletContainer.getLength(); ) {
            if (this._bulletContainer.item(i)._isDead) {
                this._bulletContainer.remove(i);
            } else {
                i += 1;
            }
        }
    },

    this.collisionDetection = function () {
        // bullet vs enemy
        for (var i = 1; i < this._container.getLength(); ) {
            if (this._container.item(i).collisionBullet(this._bulletContainer)) {
                this._container.remove(i);
                GameCtrl.prototype.SCORE += 10;
                GameCtrl.prototype.LAP_SCORE += 10;
            } else {
                i += 1;
            }
        }

        // enemy vs player
        for (var i = 1, size = this._container.getLength(); i < size; i += 1) {
            if (this._container.item(0).collisionDetection(this._container.item(i))) {
                GameCtrl.prototype.PLAYER_BREAK = true;
            }

            if (GameCtrl.prototype.BOSS_FLAG) {
                this._container.item(0).collisionParticle(this._container.item(i)._particleManager.container);
            }
        }

        // item vs player
        for (var i = 0; i < this._itemContainer.getLength(); ) {
            if (collisionCircle(this._container.item(0)._position, this._itemContainer.item(i)._position, 12, 12)) {
                this._itemContainer.item(i).remove();
                this._itemContainer.remove(i);
                if (GameCtrl.prototype.WITCH_ITEM) {
                    GameCtrl.prototype.BULLET_MODE = 2;
                } else {
                    GameCtrl.prototype.BULLET_MODE = 1;
                }
            } else {
                i += 1;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                               define scene's behavior                              //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function SceneBase() {
    this._objectManager = null,
    this._particleManager = null,
    this._isNext = false,
    this._frameTimer = 0,
    this._scroll = 0,
    this._text = [],
    this._texture = [],
    this._isFade = false,
    this._isFinish = false,
    this._plosionCnt = 0,
    this._cnt = 1,
    this._infoScroll = 0,

    this.initialize = function () { },

    this.update = function () { },

    this.finish = function () { },

    this.isChange = function () {
        return this._isNext;
    },

    this.fadeUpdate = function () {
        this._frameTimer += 0.0085;
        if (!this._isFade) {
            this._frameTimer = Math.min(1, this._frameTimer);
            this._texture[1].setAlpha(1 - this._frameTimer);
        } else {
            this._frameTimer = Math.min(1, this._frameTimer);
            this._texture[1].setAlpha(this._frameTimer);
            if (this._frameTimer >= 1) {
                this._isNext = true;
            }
        }

        if (this._frameTimer < 1 && !this._isFade) {
            return;
        }

        if (MouseCtrl.prototype.isPush && !this._isFade) {
            this._isFade = true;
            this._frameTimer = 0;
            MouseCtrl.prototype.isPush = false;
        }
    },

    this.initProperty = function () {
        this._isNext = false;
        this._frameTimer = 0;
        this._scroll = 0;
        this._isFade = false;
        this._isFinish = false;
        this._plosionCnt = 0;
        this._cnt = 1;
        this._objectManager = null;
        this._particleManager = null;
        this._infoScroll = 0;
    },

    this.createTextures = function (path, num) {
        for (var i = 0; i < num; i += 1) {
            this._texture[i] = new arc.display.Sprite(GameCtrl.prototype.GAME_SYSTEM.getImage(path[i]));
            GameCtrl.prototype.GAME_HANDLER.addChild(this._texture[i]);
        }
    },

    this.breakObject = function (texName, count, timer, x1, x2, y) {
        if (this._plosionCnt < 5) {
            if (timer % 10 == 0) {
                for (var i = 0; i < count; i += 1) {
                    var p = new Particle(randInt(x1, x2), y);
                    p.initialize(texName);
                    p.setDirection(0 + (i * 10));
                    p.update = updateBossBreakParticle;
                    this._particleManager.push(p);
                }
                this._plosionCnt += 1;
            }
        }

        this._particleManager.update();
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
//                             define main scene behavior                             //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

function initializeMain() {
    TRANSMITTER.enterGame();
    //GameCtrl.prototype.SOUND_LIST[0].play();

    // create textures
    var texPath = ["/images/pop/bg.png", "/images/pop/bg.png", "/images/pop/player_info.png", "/images/pop/black.png", "/images/pop/info_line.png"];
    for (var i = 0; i < 5; i += 1) {
        this._texture[i] = new arc.display.Sprite(GameCtrl.prototype.GAME_SYSTEM.getImage(texPath[i]));
        if (i < 2) {
            this._texture[i].setX(0);
            this._texture[i].setY(0 + (i * 800));
        } else{
            this._texture[i].setX(0);
            this._texture[i].setY(0);
        }
        GameCtrl.prototype.GAME_HANDLER.addChild(this._texture[i]);
    }
    this._texture[3].setAlpha(1.0);
    this._texture[4].setY(40);

    /***********************************************
        
    サーバサイドから受取ったデータに関連する物の読込み

    ************************************************/

    // create text(connects, score, runk, stars, other info)
    var text = [0, 0, "", 0, "","Jackpot:"];
    var position = [new Vector2(102, 2), new Vector2(250, 2), new Vector2(45, 20), new Vector2(235, 20), new Vector2(-500, 40),new Vector2(165,21)];
    for (var i = 0; i < 6; i += 1) {
        this._text[i] = new arc.display.TextField();
        this._text[i].setX(position[i].x);
        this._text[i].setY(position[i].y);
        this._text[i].setFont("Helvetica", 12, true);
        GameCtrl.prototype.GAME_HANDLER.addChild(this._text[i]);
    }
    this._text[4].setColor("0xFFFFFF");

    // create grade textures
    var t = ["/images/pop/grade1.png", "/images/pop/grade2.png", "/images/pop/grade3.png", "/images/pop/grade4.png"];
    for (var i = 0; i < 4; i += 1) {
        this._texture[5 + i] = new arc.display.Sprite(GameCtrl.prototype.GAME_SYSTEM.getImage(t[i]));
        this._texture[5 + i].setX(15);
        this._texture[5 + i].setY(18);
        this._texture[5 + i].setScaleX(0.6);
        this._texture[5 + i].setScaleY(0.6);
        GameCtrl.prototype.GAME_HANDLER.addChild(this._texture[5 + i]);
    }

    // create objects
    this.initProperty();
    this._objectManager = new ObjectManager();
    this._particleManager = new ParticleManager();
    var player = ObjectFactory.create("Player", "/images/pop/player.png");
    player.initialize(new Vector2(120, 300));
    player.setScale(new Vector2(1.15, 1.15));
    this._objectManager.push(player);
};

function updateMain() {
    this._frameTimer += 1;

    this._scroll += 5;
    this._texture[0].setY(this._scroll);
    this._texture[1].setY(this._scroll - 800);
    if (this._scroll == 800) {
        this._scroll = 0;
    }

    // is fade end
    if (this._cnt > 0) {
        this._cnt -= 0.025;
        this._cnt = Math.max(0, this._cnt);
        this._texture[3].setAlpha(this._cnt);
    }

    this._objectManager.update();

    // dead boss
    if (GameCtrl.prototype.BOSS_DEAD) {
        this.breakObject("/images/pop/particle01.png", 36, this._frameTimer, 100, 110, 40);
        if (this._plosionCnt == 5) {
            GameCtrl.prototype.BOSS_FLAG = false;
            GameCtrl.prototype.BOSS_DEAD = false;
            this._frameTimer = 0;
            GameCtrl.prototype.BULLET_MODE = 1;
            this._particleManager.finish();
            this._plosionCnt = 0;
        }
        return;
    }


    //サーバサイドに送信
    if (this._frameTimer % 300 == 0) {
        TRANSMITTER.sendScore(GameCtrl.prototype.LAP_SCORE,GameCtrl.prototype.SCORE);
        GameCtrl.prototype.LAP_SCORE = 0;
    }

    /***********************************************

      サーバーサイドから受取ったパラメータの表示場所

    ************************************************/
    GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._texture[2], GameCtrl.prototype.GAME_HANDLER.getSize() - 2); //@ player_info.png
    GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._texture[4], GameCtrl.prototype.GAME_HANDLER.getSize() - 1); //@ info_line.png
    for (var i = 0; i < 4; i += 1) {
        this._text[0].setText(GameCtrl.prototype.CONNECTS_NUM);
        this._text[1].setText(GameCtrl.prototype.SCORE);
        this._text[2].setText(GameCtrl.prototype.GRADE);
        this._text[3].setText(GameCtrl.prototype.STAR);
        //this._text[4].setText("こんばんは、琴畑です。みなさん元気ですか? " + GameCtrl.prototype.USER_NAME + "さんがLoginしました。 Let's play together!");
        //this._text[4].setText(GameCtrl.prototype.NEWS);
        //this._text[4].setX(500-this._infoScroll);
        // 描画順の再設定... 面倒だ…Canvasって…
        GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._text[i], GameCtrl.prototype.GAME_HANDLER.getSize() - 3 + i);
    }
    if(GameCtrl.prototype.NEWS !==null){
        this._text[4].setText(GameCtrl.prototype.NEWS);
        this._text[4].setX(300-this._infoScroll);
        GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._text[4], GameCtrl.prototype.GAME_HANDLER.getSize() - 3 + 4);
    };
    this._text[5].setText(GameCtrl.prototype.JACKPOT);
    GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._text[5], GameCtrl.prototype.GAME_HANDLER.getSize() - 3 + 4);

    // draw information on info_line.png
    if(GameCtrl.prototype.NEWS !== null){
        this._infoScroll += 1;
        if (this._infoScroll > 800) {
            this._infoScroll = 0;
            GameCtrl.prototype.NEWS = null;
            console.log("reset news");
        }
    }

    for (var i = 0; i < 4; i += 1) {
        GameCtrl.prototype.GAME_HANDLER.setChildIndex(this._texture[5 + i], GameCtrl.prototype.GAME_HANDLER.getSize() - 8 + i);
        this._texture[5 + i].setVisible(false);
    }

    // 称号の描画
    var s = GameCtrl.prototype.STAR;
    if (s >= 1 && s <= 9) {
        this._texture[5].setVisible(true);
    } else if (s >= 10 && s <= 29) {
        this._texture[6].setVisible(true);
    } else if (s >= 30 && s <= 99) {
        this._texture[7].setVisible(true);
    } else {
        this._texture[8].setVisible(true);
    }
    /***********************************************

              サーバーサイド関連終わり。

    ************************************************/  

    
    // create item 01
    if (this._frameTimer > 600 && randInt(0, 50) > 40 && GameCtrl.prototype.BULLET_MODE == 0 && !GameCtrl.prototype.IS_ITEM_GET) {
        GameCtrl.prototype.IS_ITEM_GET = true;
        var item = ObjectFactory.create("Enemy", "/images/pop/item01.png");
        item.initialize(new Vector2(randInt(50, 250), -40));
        item.update = updateItem;
        item.setScale(new Vector2(0.7, 0.7));
        this._objectManager.pushItem(item);
    }

    // create item 02
    //if (this._frameTimer > GameCtrl.prototype.BOSS_EMERGE_TIME + 2300 && !GameCtrl.prototype.WITCH_ITEM) {
    if (!GameCtrl.prototype.WITCH_ITEM) {
        GameCtrl.prototype.WITCH_ITEM = true;
        var item = ObjectFactory.create("Enemy", "/images/pop/item02.png");
        item.initialize(new Vector2(randInt(50, 250), -20));
        item.update = updateItem;
        item.setScale(new Vector2(0.7, 0.7));
        this._objectManager.pushItem(item);
    }

    // create enemy
    //if (this._frameTimer < GameCtrl.prototype.BOSS_EMERGE_TIME && !GameCtrl.prototype.BOSS_FLAG) {
    if (!GameCtrl.prototype.BOSS_FLAG) {
        if ((this._frameTimer % 12) == 0) {
            var t = randInt(0, 2);
            var texturePath = ["/images/pop/enemy01.png", "/images/pop/enemy02.png"];
            var enemy = ObjectFactory.create("Enemy", texturePath[t]);
            enemy.initialize(new Vector2(rand(0, 250), -60));
            enemy.setScale(new Vector2(0.8, 0.8));
            t == 1 ? enemy.update = updatePlayerTargetFunc : enemy.update = updateRotateFunc;
            this._objectManager.push(enemy);
        }
    }

    // create boss
    //if (this._frameTimer > GameCtrl.prototype.BOSS_EMERGE_TIME + 180) {
    if (GameCtrl.prototype.EMERGE_BOSS){
        GameCtrl.prototype.EMERGE_BOSS = false;
        //if (!GameCtrl.prototype.BOSS_FLAG) {
        GameCtrl.prototype.BOSS_FLAG = true;
        GameCtrl.prototype.ENABLE_BULLET = true;
        var boss = ObjectFactory.create("Boss", "/images/pop/boss.png");
        boss.update = updateBossFunc;
        boss.setAnimation();
        boss._radius = 50;
        this._objectManager.push(boss);
        //}
    }

    // create bullet
    if (((this._frameTimer % 12) == 0) && !GameCtrl.prototype.ENABLE_BULLET) {
        // bullet mode1
        if (GameCtrl.prototype.BULLET_MODE == 0) {
            var bullet = ObjectFactory.create("Bullet", "/images/pop/bullet01.png");
            bullet.initialize(new Vector2(MouseCtrl.prototype.x + 7, MouseCtrl.prototype.y - 4));
            bullet.setScale(new Vector2(0.7, 0.7));
            bullet.update = updateBulletFunc;
            this._objectManager.pushBullet(bullet);
        }

        // bullet mode2
        if (GameCtrl.prototype.BULLET_MODE == 1) {
            for (var i = 0; i < 2; i += 1) {
                var bullet = ObjectFactory.create("Bullet", "/images/pop/bullet01.png");
                bullet.initialize(new Vector2(MouseCtrl.prototype.x - 25 + (i * 55), MouseCtrl.prototype.y - 4));
                bullet.setScale(new Vector2(0.7, 0.7));
                this._objectManager.pushBullet(bullet);
            }
        }
    }

    // bullet mode3
    if (GameCtrl.prototype.BULLET_MODE == 2) {
        var textures = ["/images/pop/particle03.png", "/images/pop/particle06.png", "/images/pop/particle07.png"];
        var bullet = ObjectFactory.create("Bullet", textures[randInt(0, 3)]);
        bullet.initialize(new Vector2(MouseCtrl.prototype.x - 5, MouseCtrl.prototype.y - 35));
        bullet.setScale(new Vector2(1.5, 1.5));
        bullet.update = updateWitchBullet;
        this._objectManager.pushBullet(bullet);
    }
};

function finishMain() {
    GameCtrl.prototype.stopSound(0);
    this._objectManager.finish();
    this._particleManager.finish();
    MouseCtrl.prototype.isPush = false;
    GameCtrl.prototype.initialize();
    GameCtrl.prototype.removeChildren(this._text);
    GameCtrl.prototype.removeChildren(this._texture);
};

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //        
//                             scene management process                               //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////

var SCENE_TYPE = SCENE_TYPE || {};
SCENE_TYPE.MAIN = 0;

function SceneManager() {
    this._main = new SceneBase(),
    this._sceneContainer = [this._main],
    this._current = SCENE_TYPE.MAIN,

    this.initialize = function () {
        this.registerSceneData();

        this._sceneContainer[this._current].initialize();
    },

    this.update = function () {
        this._sceneContainer[this._current].update();

        ParticleCtrl.prototype.GENERATOR.update();

        // 保留
        //this.changeScene();
    },

    this.registerSceneData = function () {
        this._main.initialize = initializeMain;
        this._main.update = updateMain;
        this._main.finish = finishMain;
    },

    this.changeScene = function () {
        if (this._sceneContainer[this._current].isChange()) {
            this._sceneContainer[this._current].finish();
            this._sceneContainer[this._current].initialize();
            return;
        }
    }
}

(function () {
    var system;

    var GameApp = arc.Class.create(arc.Game, {
        initialize: function (params) {
            this.registerMouseEvents();

            GameCtrl.prototype.GAME_HANDLER = this;
            GameCtrl.prototype.GAME_SYSTEM = system;

            this._scene_manager = new SceneManager();
            this._scene_manager.initialize();

            ParticleCtrl.prototype.GENERATOR = new ParticleManager();

            GameCtrl.prototype.BLEND_MODE = GameCtrl.prototype.GAME_SYSTEM.getCanvas().getContext("2d");
        },

        update: function () {
            this._scene_manager.update();
        },

        registerMouseEvents: function () {
            this.addEventListener(arc.Event.TOUCH_MOVE, function (e) {
                MouseCtrl.prototype.x = e.x - 10;
                MouseCtrl.prototype.y = e.y - 10;
            }, false);

            this.addEventListener(arc.Event.TOUCH_START, function (e) {
                MouseCtrl.prototype.isPush = true;
            }, false);

            this.addEventListener(arc.Event.TOUCH_END, function (e) {
                MouseCtrl.prototype.isPush = false;
            }, false);
        }
    });

    window.addEventListener('DOMContentLoaded', function (event) {
        system = new arc.System(320, 480, "canvas");
        system.setGameClass(GameApp);
        system.load(["/images/pop/player.png", "/images/pop/boss.png", "/images/pop/bullet01.png","/images/pop/black.png", "/images/pop/bg.png","/images/pop/enemy01.png", "/images/pop/enemy02.png", "/images/pop/enemy03.png","/images/pop/particle01.png", "/images/pop/particle02.png", "/images/pop/particle03.png", "/images/pop/particle04.png", "/images/pop/particle05.png", "/images/pop/particle06.png", "/images/pop/particle07.png","/images/pop/item01.png", "/images/pop/item02.png","/images/pop/effect01.png", "/images/pop/effect02.png", "/images/pop/effect03.png","/images/pop/player_info.png","/images/pop/info_line.png","/images/pop/grade1.png", "/images/pop/grade2.png", "/images/pop/grade3.png", "/images/pop/grade4.png"]);
    }, false);
})();
