function GetGameParam () {
    var instance;
    GetGameParam = function GetGameParam () {
        return instance;
    };
    instance = new GetGameParam();
    instance.constructor = GetGameParam;
    return instance;
}

GetGameParam.prototype.SCORE = 0;
GetGameParam.prototype.TIMER = 60;
GetGameParam.prototype.GAME_OVER = false;
GetGameParam.prototype.GAME_CLEAR = false;
GetGameParam.prototype.GAME_HANDLER = null;
GetGameParam.prototype.GAME_SYSTEM = null;

GetGameParam.prototype.initialize = function () {
    this.SCORE = 0;
    this.TIMER = 60;
    this.GAME_OVER = false;
    this.GAME_CLEAR = false;
};


// fake enumulation( so called name space lol )
var SCENE_TYPE = SCENE_TYPE || {};
SCENE_TYPE.TITLE = 0;
SCENE_TYPE.MAIN  = 1;
SCENE_TYPE.CLEAR = 2;
SCENE_TYPE.OVER  = 3;

function SceneManager() {
    this._title          = new SceneBase(),
    this._main           = new SceneBase(),
    this._clear          = new SceneBase(),
    this._over           = new SceneBase(),
    this._sceneContainer = [this._title, this._main, this._clear, this._over],
    this._current        = SCENE_TYPE.TITLE,
    this.initialize = function () {
        this.registerSceneData();
        this._sceneContainer[this._current].initialize();
    },
    this.update = function () {
        this._sceneContainer[this._current].update();
        this.changeScene();
    },
    this.registerSceneData = function () {
        console.log("register SceneData");
        var bg = new arc.display.Shape();
        bg.beginFill(0x000000);
        bg.drawRect(0,0,300,500);
        bg.endFill();
        GetGameParam.prototype.GAME_HANDLER.addChild(bg);
        // setting title scene data
        this._title.initialize = initializeTitle;
        this._title.update     = updateTitle;
        this._title.finish     = finishTitle;
        // setting main scene data
        this._main.initialize = initializeMain;
        this._main.update     = updateMain;
        this._main.finish     = finishMain;
        // setting game clear scene data
        this._clear.initialize = initializeClear;
        this._clear.update     = updateClear;
        this._clear.finish     = finishClear;
        // setting game over scene data
        this._over.initialize = initializeOver;
        this._over.update     = updateOver;
        this._over.finish     = finishOver;
    },
    this.changeScene = function () {
        if(this._sceneContainer[this._current].isChange()){
            this._sceneContainer[this._current].finish();
            if(this._current == SCENE_TYPE.TITLE) {
                this._current = SCENE_TYPE.MAIN;
            }
            if(this._current == SCENE_TYPE.OVER) {
                this._current = SCENE_TYPE.MAIN;
            }
            if(this._current == SCENE_TYPE.CLEAR) {
                this._current = SCENE_TYPE.TITLE;
            }
            this._sceneContainer[this._current].initialize();
            return;
        }
        if(GetGameParam.prototype.GAME_OVER) {
            console.log("Change scene type from game-over");
            this._sceneContainer[this._current].finish();
            this._current = SCENE_TYPE.OVER;
            this._sceneContainer[this._current].initialize();
            return;
        }

        if (GetGameParam.prototype.GAME_CLEAR) {
            this._sceneContainer[this._current].finish();
            this._current = SCENE_TYPE.CLEAR;
            this._sceneContainer[this._current].initialize();
        }
    }
}


function SceneBase() {
    this._objectManager = null,
    this._isNext        = false,
    this._frameTimer    = 0,
    this._scroll        = 0,
    this._text          = [],
    this._bg            = [],
    this.initialize = function () {
    },

    this.update = function () {
    },
    this.finish = function () {
    },

    this.isChange = function () {
        return this._isNext;
    }
}

function initializeTitle() {
    console.log("initialize Title");
    var x = [85,95];
    var y = [150,180];
    var text = ["Shooting Game!", "Click Start!"];
    var bg = new arc.display.Shape();
    bg.beginFill(0x000000);
    bg.drawRect(0,0,300,500);
    bg.endFill();
    GetGameParam.prototype.GAME_HANDLER.addChild(bg);
    for(var i =0; i<2; i++){
        console.log("init text");
        this._text[i] = new arc.display.TextField();
        this._text[i].setText(text[i]);
        this._text[i].setFont("Monotype Corsiva",20,true);
        this._text[i].setColor(0xFFFFFF);
        this._text[i].setX(x[i]);
        this._text[i].setY(y[i]);
        GetGameParam.prototype.GAME_HANDLER.addChild(this._text[i]);
    }
};

function updateTitle () {
    if(GetMouse.prototype.isPush) {
        this._isNext = true;
        GetMouse.prototype.isPush = false;
    }
};

function finishTitle () {
    console.log("finish title");
    for(var i=0; i<2; i++){
        GetGameParam.prototype.GAME_HANDLER.removeChild(this._text[i]);
    }
    this._isNext = false;
};

function initializeMain() {
    // create background data
    for (var i = 0; i < 2; i += 1) {
        this._bg[i] = new arc.display.Sprite(GetGameParam.prototype.GAME_SYSTEM.getImage("/images/bg.png"));
        console.log(this._bg[i]);
        this._bg[i].setX(0);
        this._bg[i].setY(0 + (i*500));
        GetGameParam.prototype.GAME_HANDLER.addChild(this._bg[i]);
    }

    // craete object manager
    this._objectManager = null;
    this._objectManager = new ObjectManager();

    // create player object
    var player = ObjectFactory.create("Player", "/images/player.png", GetGameParam.prototype.GAME_SYSTEM);
    player.initialize(new Vector2(120,400));
    player.setScale(new Vector2(0.5, 0.5));
    this._objectManager.push(player);
    this._frameTimer = 0;
    this._scroll = 0;

    // create score
    var x = [190, 0];
    var y = [20, 20];
    for(var i = 0; i < 2; i += 1) {
        console.log("init text");
        this._text[i] = new arc.display.TextField();
        this._text[i].setFont("Monotype Corsiva", 18, true);
        this._text[i].setColor(0xFFFFFF);
        this._text[i].setX(x[i]);
        this._text[i].setY(y[i]);
        GetGameParam.prototype.GAME_HANDLER.addChild(this._text[i]);
    }
    console.log("initialize main4");
};

function updateMain () {
    // update frame timer
    this._frameTimer += 1;

    // update background
    this._scroll += 5;
    this._bg[0].setY(this._scroll);
    this._bg[1].setY(this._scroll - 500);
    if (this._scroll == 500) {
        this._scroll = 0;
    }

    // create enemy
    if((this._frameTimer % 12) == 0 ){
        var texturePath = ["/images/enemy01.png", "/images/enemy02.png", "/images/enemy03.png"];
        var enemy = ObjectFactory.create("Enemy", texturePath[randInt(0, 3)], GetGameParam.prototype.GAME_SYSTEM);
        enemy.initialize(new Vector2(rand(0, 250), 0));
        randInt(0, 2) ? enemy.update = playerTargetUpdateFunc : enemy.update = rotateUpdateFunc;
        enemy.setScale(new Vector2(0.3, 0.3));
        this._objectManager.push(enemy);
    }

    // create bullet
    if((this._frameTimer % 10) == 0) {
        var bullet = ObjectFactory.create("Bullet", "/images/particle.png", GetGameParam.prototype.GAME_SYSTEM);
        bullet.initialize(new Vector2(GetMouse.prototype.x - 1, GetMouse.prototype.y));
        bullet.setScale(new Vector2(0.7, 0.7));
        bullet.update = bulletUpdateFunc;
        this._objectManager.pushBullet(bullet);
        GetMouse.prototype.isPush = false;
    }

    // update object
    this._objectManager.update();

    if((this._frameTimer % 60) == 0) {
        GetGameParam.prototype.TIMER -= 1;
        if (GetGameParam.prototype.TIMER == 0) {
            GetGameParam.prototype.GAME_CLEAR = true;
        }
    }

    // display score
    this._text[0].setText("Score : " + GetGameParam.prototype.SCORE);
    this._text[1].setText("Now Player : " + GetGameParam.prototype.NOW_PLAYING);
};

function finishMain () {
    this._objectManager.finish();
    this._isNext = false;
    GetGameParam.prototype.initialize();
    GetGameParam.prototype.GAME_HANDLER.removeChild(this._text[0]);
    GetGameParam.prototype.GAME_HANDLER.removeChild(this._text[1]);
    GetGameParam.prototype.GAME_HANDLER.removeChild(this._bg[0]);
    GetGameParam.prototype.GAME_HANDLER.removeChild(this._bg[1]);
};

function initializeOver () {
    console.log("initialize over");
    var x = [105,75];
    var y = [150,180];
    var text = ["Game Over.", "Click Start Again!"];

    for(var i=0; i <2; i++){
        this._text[i] = new arc.display.TextField();
        this._text[i].setFont("Monotype Corsiva", 20, true);
        this._text[i].setColor(0xFFFFFF);
        this._text[i].setX(x[i]);
        this._text[i].setY(y[i]);
        this._text[i].setText(text[i]);
        GetGameParam.prototype.GAME_HANDLER.addChild(this._text[i]);
    }
};

function updateOver () {
    if(GetMouse.prototype.isPush) {
        this._isNext = true;
        GetMouse.prototype.isPush = false;
    }
};

function finishOver () {
    console.log("finish over");
    for(var i=0; i< 2; i++){
        GetGameParam.prototype.GAME_HANDLER.removeChild(this._text[i]);
    }
    this._isNext = false;
    //GetGameParam.prototype.initialize();
};

function initializeClear () {
    console.log("initialize clear");
}

function updateClear () {
    if(GetMouse.prototype.isPush) {
        this._isNext = true;
        GetMouse.prototype.isPush = false;
    }
}

function finishClear () {
    console.log("finish clear");
    this._isNext = false;
    GetGameParam.prototype.initialize();
}


function ObjectBase(texture_path) {
    this._position = new Vector2(0, 0),
    this._velocity = 0,
    this._angle    = 0,
    this._texture  = new arc.display.Sprite(GetGameParam.prototype.GAME_SYSTEM.getImage(texture_path)),
    this._isDead   = false,

    this.initialize = function (position) {
        this._position.x = position.x;
        this._position.y = position.y;
        this._texture.setX(position.x);
        this._texture.setY(position.y);
        this._velocity = rand(2.0, 10.0);
        this._angle = rand(0.0, 100.0);
        GetGameParam.prototype.GAME_HANDLER.addChild(this._texture);
    },

    this.update = function () {
        // default update is player's update
        this._position.x = GetMouse.prototype.x;
        this._position.y = GetMouse.prototype.y;
        this._texture.setX(this._position.x);
        this._texture.setY(this._position.y);
    },

    this.collisionDetection = function (other) {
        if(collisionCircle(this._position, other._position)) {
            this.remove();
            other.remove();
            return true;
        }
        return false;
    },

    this.collisionBullet = function (container) {
        for(var i = 0; i < container.getLength();) {
            if(collisionCircle(this._position, container.item(i).getPosition())) {
                this.remove();
                container.item(i).remove();
                container.remove(i);
                return true;
            } else {
                i += 1;
            }
        } 
        return false;
    },

    this.remove = function () {
        this._isDead = true;
        GetGameParam.prototype.GAME_HANDLER.removeChild(this._texture);
    }
}

ObjectBase.prototype.setScale = function (v) {
    this._texture.setScaleX(v.x);
    this._texture.setScaleY(v.y);
};

ObjectBase.prototype.setRotate = function (angle) {
    this._texture.setRotation(angle);
};

ObjectBase.prototype.getPosition = function () {
    return this._position;
};

ObjectBase.prototype.isDead = function () {
    return this._isDead;
};

function playerTargetUpdateFunc (playerPosition) {
    if(playerPosition.x > this._position.x) {
        this._position.x += 0.5;
    }

    if(playerPosition.x < this._position.x) {
        this._position.x -= 0.5;
    }

    this._position.y += 4.5 * rand(0.5, 1.5);

    this._texture.setX(this._position.x);
    this._texture.setY(this._position.y);

    // range over
    if(this._position.y > 520) {
        this.remove();
    }
};

function rotateUpdateFunc (playerPosition) {
    this._position.x += Math.sin((this._angle += rand(0.02, 0.05))) * 0.8;
    this._position.y += this._velocity * 0.5;
    this._texture.setX(this._position.x);
    this._texture.setY(this._position.y);
};

function bulletUpdateFunc () {
    this._position.y -= 7.0;
    this._texture.setY(this._position.y);

    // range over
    if(this._position.y < -20) {
        this.remove();
    }
};
function ObjectFactory () {}

ObjectFactory.create = function (type, imagename, system) {
    if(type == "Player") {
        function Player () {}
        inherit(Player, ObjectBase, imagename, system);
        return new Player();
    }

    if(type == "Enemy") {
        function Enemy () {}
        inherit(Enemy, ObjectBase, imagename, system);
        return new Enemy();
    }

    if(type == "Bullet") {
        function Bullet () {}
        inherit(Bullet, ObjectBase, imagename, system);
        return new Bullet();
    }
};
function ObjectManager() {
    this._container       = new List(),
    this._bulletContainer = new List(),

    this.push = function (object) {
        this._container.add(object);
    },

    this.pushBullet = function (bullet) {
        this._bulletContainer.add(bullet);
    },

    // ここが何回も呼ばれる
    this.update = function () {
        this.updateContainer();
        this.removeContainer();
        this.collisionDetection();
    },

    this.finish = function () {
        for(var i = 0; i < this._container.getLength(); ) {
            this._container.item(i).remove();
            this._container.remove(i);
        }

        for(var i = 0; i < this._bulletContainer.getLength();) {
            this._bulletContainer.item(i).remove();
            this._bulletContainer.remove(i);
        }
    },

    this.updateContainer = function () {
        // object update
        for(var i = 0, size = this._container.getLength(); i < size; i += 1) {
            this._container.item(i).update(this._container.item(0).getPosition());
        }

        // bullet update
        for(var i = 0, size = this._bulletContainer.getLength(); i < size; i += 1) {
            this._bulletContainer.item(i).update();
        }
    },

    this.removeContainer = function () {
        // remove update
        for(var i = 0; i < this._container.getLength();) {
            if(this._container.item(i).isDead()) {
                this._container.remove(i);
            } else {
                i += 1;
            }
        }

        // remove update
        for(var i = 0; i < this._bulletContainer.getLength();) {
            if(this._bulletContainer.item(i).isDead()) {
                this._bulletContainer.remove(i);
            } else {
                i += 1;
            }
        }
    },

    this.collisionDetection = function () {
        // collision detection bullet vs enemy
        for(var i = 1; i < this._container.getLength();) {
            if(this._container.item(i).collisionBullet(this._bulletContainer)){
                this._container.remove(i);
                GetGameParam.prototype.SCORE += 10;
                if(i%5==0) TRANSCEIVER.sendScore(100);
            } else {
                i += 1;
            }
        }

        // collision detection enemy vs player
        for(var i = 1, size = this._container.getLength(); i < size; i += 1) {
            if(this._container.item(0).collisionDetection(this._container.item(i))) {
                GetGameParam.prototype.GAME_OVER = true;
            }
        }
    }
}
function List() {
    this._head   = null,
    this._length = 0
}

List.prototype = {
    add: function (data) {
        var node = { data: data, next: null },
            current;

        if(this._head === null) {
            this._head = node;
        } else {
            current = this._head;

            while(current.next) {
                current = current.next;
            }
            current.next = node;
        }

        this._length += 1;
    },

    item: function (index) {
        if(index > -1 && index < this._length) {
            var current = this._head,
                i       = 0;
            while(i++ < index) {
                current = current.next;
            }
            return current.data;
        } else {
            return null;
        }
    },

    remove: function (index) {
        if(index > -1 && index < this._length) {
            var current = this._head,
                prev,
                i       = 0;

            if(index === 0) {
                this._head = current.next;
            } else {
                while(i++ < index) {
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

/*------------mouse event ------------*/
function GetMouse () {
    var instance;
    GetMouse = function GetMouse () {
        return instance;
    };
    GetMouse.prototype = this;
    instance = new GetMouse();
    instance.constructor = GetMouse;
    return instance;
}

GetMouse.prototype.x = 120;
GetMouse.prototype.y = 400;
GetMouse.prototype.isPush = false;

/*------------utility ------------*/

function inherit (C, P) {
    C.prototype = new P(arguments[2], arguments[3]);
}

function rand (min, max) {
    return ((max - min) * Math.random()) + min;
}

function randInt (min, max) {
    return Math.floor(((max - min) * Math.random() ) + min);
}

function toRadian (degree) {
    return degree * (Math.PI / 180.0);
}

function toDegree (radian) {
    return radian * (180.0 / Math.PI);
}

function collisionCircle (circle1, circle2) {
    return ((Math.pow(circle1.x - circle2.x, 2) +
             Math.pow(circle1.y - circle2.y, 2)) < Math.pow(15.0, 2));
}


function Vector2 (x, y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector2.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
};

Vector2.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vector2.prototype.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

Vector2.prototype.mul = function (v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
};

Vector2.prototype.normalize = function () {
    var len = this.length();

    if(len == 0) {
        return this;
    }
    this.x /= len;
    this.y /= len;

    return this;
};

Vector2.prototype.computeTargetAngle = function (v) {
    return toDegree(Math.atan2(v.y - this.y, v.x - this.x));
};

Vector2.prototype.fromPitchYaw = function (ele, dir) {
    this.x =  toRadian(ele) * toRadian(dir);
    this.y = -toRadian(ele);

    return this;
};



(function () {
    var system;

    var GameApp = arc.Class.create(arc.Game, {
        initialize: function (params) {
            this.registerMouseEvents();

            GetGameParam.prototype.GAME_HANDLER = this;
            GetGameParam.prototype.GAME_SYSTEM = system;

            this._scene_manager = new SceneManager();
            this._scene_manager.initialize();
        },

        update: function () {
            // update scene
            this._scene_manager.update();
        },

        registerMouseEvents: function () {
            // register update mouse position function
            this.addEventListener(arc.Event.TOUCH_MOVE, function (e) {
                GetMouse.prototype.x = e.x - 10.0;
                GetMouse.prototype.y = e.y - 10.0;
            }, false);

            // register mouse push function
            this.addEventListener(arc.Event.TOUCH_START, function (e) {
                GetMouse.prototype.isPush = true;
            }, false);
            this.addEventListener(arc.Event.TOUCH_END, function (e) {
                GetMouse.prototype.isPush = false;
            }, false);
        }
    });

    window.addEventListener('DOMContentLoaded', function (event) {
        system = new arc.System(300, 500, "canvas");
        system.setGameClass(GameApp);
        system.load(["/images/player.png", "/images/enemy01.png", "/images/enemy02.png", "/images/enemy03.png", "/images/enemy04.png", "/images/particle.png", "/images/bg.png", "/images/title.png", "/images/over.png", "/images/clear.png", "/images/life.png", "/images/life_frame.png"]);
    }, false);
})();

