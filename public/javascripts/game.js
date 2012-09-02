(function () {
    // game system property
    var system;
    var GameApp = arc.Class.create(arc.Game, {
        initialize: function (params) {
            // register mouse event 
            this.registerMouseEvents();
            // register audio event
            this.registerAudioEvents();
            // set scene data
            this._scene_manager = new SceneManager(system, this);
            this._scene_manager.initialize();
        },
        /**
         * update game data
         */
        update: function () {
            // update scene 
            this._scene_manager.update();
        },
        /**
         * register mouse events
         */
        registerMouseEvents: function () {
            // add mouse prototype properties
            GetMouse.prototype.x = 120;
            GetMouse.prototype.y = 400;
            GetMouse.prototype.isPush = false;

            // register update mouse position function
            this.addEventListener(arc.Event.TOUCH_MOVE, function (e) {
                GetMouse.prototype.x = e.x - 10.0;
                GetMouse.prototype.y = e.y - 10.0;
            }, false);

            // register mouse push function
            this.addEventListener(arc.Event.TOUCH_START, function(e) {
                GetMouse.prototype.isPush = true;
            }, false);
            this.addEventListener(arc.Event.TOUCH_END, function(e) {
                GetMouse.prototype.isPush = false;
            }, false);
        },

        /**
         * register audio events
         */
        registerAudioEvents: function () {
            GetAudio.prototype.isPlay = false;
            GetAudio.prototype.isLoopPlay = false;
        }
    });

    /**
     * game entry point
     */
    window.addEventListener('DOMContentLoaded', function(event) {
        system = new arc.System(300, 500, "canvas");
        system.setGameClass(GameApp);
        system.load(["images/player.png", "images/enemy01.png", "images/enemy02.png", "images/enemy03.png", "images/enemy04.png", "images/particle.png"]);
        //system.start();
    }, false);

    function GetAudio () {
        var instance;
        GetAudio = function GetAudio () {
            return instance;
        };
        instance = new GetAudio();
        instance.constructor = GetAudio;
        return instance;
    }

    window.addEventListener("load", canvasApplication, false);

    /**
     * load canvas application
     */
    function canvasApplication () {
        var _canvas = document.getElementById("canvas");
        var context = _canvas.getContext("2d");
        (function () {
            // setting background
            context.fillStyle = "#ffffaa";
            context.fillRect(0, 0, 500, 500);
            // box
            context.strokeStyle = "#000000";
            context.strokeRect(0, 0, 490, 490);
        })();
    }

    function GetGameParam () {
        var instance;
        GetGameParam = function GetGameParam () {
            return instance;
        };
        return instance;
    }

    //@ set score
    GetGameParam.prototype.SCORE = 0;

    var Interface = function(ctor, m) {
        // function name
        this._name = ctor;
        // methods
        this._method = [];
        // set methods
        for(var i = 0, size = m.length; i < size; i += 1) {
            this._method.push(m[i]);
        }
    }

    function List() {
        // head
        this._head = null,
        // length
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

    function GetMouse () {
        var instance;
        GetMouse = function GetMouse () {
            return instance;
        };
        GetMouse.prototype = this;
        instance.constructor = GetMouse;
        return instance;
    }


    function ObjectBase(texture_path, system) {
        // position data
        this._position = new Vector2(0, 0),
        // target position
        this._targetPosition = new Vector2(0, 0),
        // taget angle
        this._targetAngle = 0,
        // velocity
        this._velocity = 0,
        // angle
        this._angle = 0,
        // texture data
        this._texture = new arc.display.Sprite(system.getImage(texture_path)),
        // dead flag
        this._isDead = false,
        // canvas data
        this._canvas = system.getCanvas(),
        // game handler
        this._game = null,
        this.initialize = function ( G, V ) {
            this._game = G;
            this._position.x = V.x;
            this._position.y = V.y;
            this._texture.setX(V.x);
            this._texture.setY(V.y);
            G.addChild(this._texture);
            this._velocity = rand(2.0, 10.0);
            this._angle = rand(0.0, 100.0);
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
            this._game.removeChild(this._texture);
        }
    }

    ObjectBase.prototype.setScale = function (v) {
        this._texture.setScaleX(v.x);
        this._texture.setScaleY(v.y);
    };

    ObjectBase.prototype.setRotate = function (angle) {
        this._texture.setRotation(angle);
    };

    ObjectBase.prototype.setPosition = function (position) {
        this._position.x = position.x;
        this._position.y = position.y;
        this._texture.setX(position.x);
        this._texture.setY(position.y);
    };

    ObjectBase.prototype.setTargetPosition = function (target) {
        this._targetPosition.x = target.x;
        this._targetPosition.y = target.y;
    };

    /**
     * no visible
     */
    ObjectBase.prototype.noVisible = function () {
        this._texture.setVisible(false);
    };

    ObjectBase.prototype.getPosition = function () {
        return this._position;
    };

    ObjectBase.prototype.isDead = function () {
        return this._isDead;
    };

    /****************************************
    下記の関数群は、各オブジェクトが生成された後に適応。
    player専用のinitialize, updateの定義が可能。
    [例]
    var player = factory.create("player");
    player.update = playerUpdate;

    update () {
        // playerUpdate is being called
        player.update();
    }
    ****************************************/

    function playerTargetUpdateFunc (playerPosition) {
        // rush at player
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
            this._isDead = true;
            this._game.removeChild(this._texture);
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
            this._isDead = true;
            this._game.removeChild(this._texture);
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
        // object container
        this._container = new List(),
        // bullet container
        this._bulletContainer = new List(),
        /**
         * push object data
         */
        this.push = function (object) {
            this._container.add(object);
        },
        /**
         * push bullet data
         * @param bullet bullet data
         */
        this.pushBullet = function (bullet) {
            this._bulletContainer.add(bullet);
        },
        /**
         * update
         */
        this.update = function () {
            this.updateContainer();
            this.removeContainer();
            this.collisionDetection();
        },
        /**
         * finish
         */
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
        /**
         * update containers
         */
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
        /**
         * remove container's items
         */
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
        /**
         * collision detection
         */
        this.collisionDetection = function () {
            // collision detection bullet vs enemy
            for(var i = 1; i < this._container.getLength();) {
                if(this._container.item(i).collisionBullet(this._bulletContainer)){
                    this._container.remove(i);
                    GetGameParam.prototype.SCORE += 10;
                    if (i%5==0) TRANSCEIVER.sendScore(GetGameParam.prototype.SCORE);
                } else {
                    i += 1;
                } 
            }
            // collision detection enemy vs player
            for(var i = 1, size = this._container.getLength(); i < size; i += 1) {
                if(this._container.item(0).collisionDetection(this._container.item(i))) {
                    GetSequence.prototype.GAME_OVER = true;
                }
            }
        }
    }

    function Particle(texture_path, system) {
        // position data
        this._position = new Vector2(0, 0),
        // velocity
        this._velocity = 0,
        // texture data
        this._texture = new arc.display.Sprite(system.getImage(texture_path)),
        // dead flag
        this.isDead = false,
        // alpha data
        this.alpha = 1.0
    }
    function ParticleManager() {
    }

    function SceneBase(system, game) {
        // game handler
        this._game = game,
        // game system
        this._system = system,
        // canvas data
        this._canvas = system.getCanvas(),
        // object manager
        this._objectManager = null,
        // scene sequence flag
        this._isNext = false,
        // frame timer
        this._frameTimer = 0,
        // clear limit
        this._clearLimit = 30,
        // text renderer
        this._text = [],
        // initialize
        this.initialize = function () {
        },
        // update
        this.update = function () {
        },
        // finish
        this.finish = function () {
        },

        // change scene flag
        this.isChange = function () {
            return this._isNext;
        }
    }

    /****************************************
    下記の関数群はSceneManagerで生成後に適応。
    各sceneのinitailize, update, finishの定義。
    ****************************************/

    /**
     * initialize title scene
     */
    function initializeTitle () {
        var x = [85, 95];
        var y = [150, 180];
        
        for(var i = 0; i < 2; i += 1) {
            this._text[i] = new arc.display.TextField()
            this._text[i].setFont("Monotype Corsiva", 20, true);
            this._text[i].setColor(0xFFFFFF);
            this._text[i].setX(x[i]);
            this._text[i].setY(y[i]);
            this._game.addChild(this._text[i]);
        }
    };

    /**
     * update title scene
     */
    function updateTitle () {
        var text = ["Shooting Game.", "Click Start!!", ""];
        for(var i = 0; i < 2; i += 1) {
            this._text[i].setText(text[i]);
        }
        if(GetMouse.prototype.isPush) {
            this._isNext = true;
            GetMouse.prototype.isPush = false;
        }
    };

    /**
     * finish title scene
     */
    function finishTitle () {
        this._game.removeChild(this._text[0]);
        this._game.removeChild(this._text[1]);
        this._isNext = false;
    };

    /**
     * initialize update scene
     */
    function initializeMain () {
         // craete object manager
         this._objectManager = null;
         this._objectManager = new ObjectManager();

         // create player object
         var player = ObjectFactory.create("Player", "images/player.png", this._system);
         player.initialize(this._game, new Vector2(120,400));
         player.setScale(new Vector2(0.5, 0.5));
         this._objectManager.push(player);

         // create enemy object
         var enemy = [4];
         for(var i = 0; i < 4; i += 1) {
             enemy[i] = ObjectFactory.create("Enemy", "images/enemy01.png", this._system);
             enemy[i].initialize(this._game, new Vector2(0 + (i * 100), 0));
             enemy[i].update = rotateUpdateFunc;
             enemy[i].setScale(new Vector2(0.3, 0.3));
             this._objectManager.push(enemy[i]);
        }

        this._frameTimer = 0;
        this._clearLimit = 30;

        // create score
        var x = [190, 0];
        var y = [20, 20];
        for(var i = 0; i < 2; i += 1) {
            this._text[i] = new arc.display.TextField()
            this._text[i].setFont("Monotype Corsiva", 18, true);
            this._text[i].setColor(0xFFFFFF);
            this._text[i].setX(x[i]);
            this._text[i].setY(y[i]);
            this._game.addChild(this._text[i]);
        }
    };

    /**
     * update main scene
     */
    function updateMain () {
        // update frame timer
        this._frameTimer += 1;

        // create enemy
        if((this._frameTimer % 12) == 0 ){
            var texturePath = ["images/enemy01.png", "images/enemy02.png", "images/enemy03.png"];
            var enemy = ObjectFactory.create("Enemy", texturePath[randInt(0, 3)], this._system);
            enemy.initialize(this._game, new Vector2(rand(0, 250), 0));
            randInt(0, 2) ? enemy.update = playerTargetUpdateFunc : enemy.update = rotateUpdateFunc;
            enemy.setScale(new Vector2(0.3, 0.3));
            this._objectManager.push(enemy);
        }

        // create bullet
        if(GetMouse.prototype.isPush) {
            var bullet = ObjectFactory.create("Bullet", "images/particle.png", this._system);
            bullet.initialize(this._game, new Vector2(GetMouse.prototype.x-1, GetMouse.prototype.y));
            bullet.setScale(new Vector2(0.7, 0.7));
            bullet.update = bulletUpdateFunc;
            this._objectManager.pushBullet(bullet);
            GetMouse.prototype.isPush = false;
        }

        // update object
        this._objectManager.update();

        if((this._frameTimer % 60) == 0) {
            this._clearLimit -= 1;
            if(this._clearLimit == 0) {
                GetSequence.prototype.GAME_CLEAR = true;
            }
        }

        // display score
        this._text[0].setText("Score : " + GetGameParam.prototype.SCORE);
        this._text[1].setText("ClearLimitTime : " + this._clearLimit);
    };

    /**
     * finish main scene
     */
    function finishMain () {
        this._objectManager.finish();
        this._isNext = false;
        GetSequence.prototype.GAME_OVER = false;
        GetSequence.prototype.GAME_CLEAR = false;
        this._game.removeChild(this._text[0]);
        this._game.removeChild(this._text[1]);
    };

    /**
     * initialize game over scene
     */
    function initializeOver () {
        var x = [105, 75];
        var y = [150, 180];

        for(var i = 0; i < 2; i += 1) {
            this._text[i] = new arc.display.TextField()
            this._text[i].setFont("Monotype Corsiva", 20, true);
            this._text[i].setColor(0xFFFFFF);
            this._text[i].setX(x[i]);
            this._text[i].setY(y[i]);
            this._game.addChild(this._text[i]);
        }
    };

    /**
     * update game over scene
     */
    function updateOver () {
        var text = ["Game Over.", "Click Start Again!!", ""];
        for(var i = 0; i < 2; i += 1) {
            this._text[i].setText(text[i]);
        }

        if(GetMouse.prototype.isPush) {
            this._isNext = true;
            GetMouse.prototype.isPush = false;
        }
    };

    /**
     * finish game over scene
     */
    function finishOver () {
        this._game.removeChild(this._text[0]);
        this._game.removeChild(this._text[1]);
        this._isNext = false;
        GetGameParam.prototype.SCORE = 0;
    };

    /**
     * initialize game clear scene
     */
    function initializeClear () {
        var x = [60, 65];
        var y = [150, 180];

        for(var i = 0; i < 2; i += 1) {
            this._text[i] = new arc.display.TextField()
            this._text[i].setFont("Monotype Corsiva", 20, true);
            this._text[i].setColor(0xFFFFFF);
            this._text[i].setX(x[i]);
            this._text[i].setY(y[i]);
            this._game.addChild(this._text[i]);
        }

        this._frameTimer = 0;
    }

    /**
     * update game clear scene
     */
    function updateClear () {
        var text = ["Congratulations(>M<)b", "Click Go Title Scene!!", ""];
        for(var i = 0; i < 2; i += 1) {
            this._text[i].setText(text[i]);
        }

        this._frameTimer += 1;

        if(GetMouse.prototype.isPush && this._frameTimer > 5) {
            this._isNext = true;
            GetMouse.prototype.isPush = false;
        }
    }

    /**
     * finish game clear scene
     */
    function finishClear () {
        this._game.removeChild(this._text[0]);
        this._game.removeChild(this._text[1]);
        this._isNext = false;
        GetGameParam.prototype.SCORE = 0;
    }


    var SCENE_TYPE = SCENE_TYPE || {};
    SCENE_TYPE.TITLE = 0;
    SCENE_TYPE.MAIN  = 1;
    SCENE_TYPE.CLEAR = 2;
    SCENE_TYPE.OVER  = 3;

    /**
     * scene manager
     * @param system game system
     * @param game   game handler
     */
    function SceneManager(system, game) {
        // title scene process
        this._title = new SceneBase(system, game),
        this._main = new SceneBase(system, game),
        // game clear scene process
        this._clear = new SceneBase(system, game),
        // game over scene process
        this._over = new SceneBase(system, game),
        // scene container
        this._sceneContainer = [this._title, this._main, this._clear, this._over],
        // currenct scene number
        this._current = SCENE_TYPE.TITLE,
        // game handler
        this._game = game,
        // game system
        this._system = system,
        // initialize
        this.initialize = function () {
            this.registerSceneData();
            this._sceneContainer[this._current].initialize();
        },
        // update
        this.update = function () {
            this._sceneContainer[this._current].update();
            this.changeScene();
        },
        // register scene data process
        this.registerSceneData = function () {
            // setting background
            var bg = new arc.display.Shape();
            bg.beginFill(0x000000);
            bg.drawRect(0, 0, 300, 500);
            bg.endFill();
            this._game.addChild(bg);
            // setting title scene data
            this._title.initialize = initializeTitle;
            this._title.update = updateTitle;
            this._title.finish = finishTitle;
            // setting main scene data
            this._main.initialize = initializeMain;
            this._main.update = updateMain;
            this._main.finish = finishMain;
            // setting game clear scene data
            this._clear.initialize = initializeClear;
            this._clear.update = updateClear;
            this._clear.finish = finishClear;
            // setting game over scene data
            this._over.initialize = initializeOver;
            this._over.update = updateOver;
            this._over.finish = finishOver;
        },
        // change scene
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
            if(GetSequence.prototype.GAME_OVER) {
                this._sceneContainer[this._current].finish();
                this._current = SCENE_TYPE.OVER;
                this._sceneContainer[this._current].initialize();
                return;
            }
            if(GetSequence.prototype.GAME_CLEAR) {
                this._sceneContainer[this._current].finish();
                this._current = SCENE_TYPE.CLEAR;
                this._sceneContainer[this._current].initialize();
            }
        }
    }


    function GetSequence () {
        var instance;
        GetSequence = function GetSequence () {
            return instance;
        };
        instance = new GetSequence();
        instance.constructor = GetSequence;
        return instance;
    }

    //@ set data of game over
    GetSequence.prototype.GAME_OVER = false;

    //@ set data of game clear
    GetSequence.prototype.GAME_CLEAR = false;

    //@ set data of stage data( in total three stages )
    GetSequence.prototype.STAGE_CLAER = [false, false, false];

    function inherit (C, P) { 
        C.prototype = new P( arguments[2], arguments[3] );
    }

    /**
     * random generate
     */
    function rand (min, max) {
        return ( ( max - min ) * Math.random() ) + min;
    }

    /**
     * randome generate
     * !caution: if you want get 0~3, you appoint randInt(0, 4); because of floor data.
     */
    function randInt (min, max) {
        return Math.floor(( ( max - min ) * Math.random() ) + min);
    }

    /**
     * to radian
     */
    function toRadian (degree) {
        return degree * ( Math.PI / 180.0 )
    }

    /**
     * to degree
     * @param radian radian data
     * @return degree
     */
    function toDegree (radian) {
        return radian * ( 180.0 / Math.PI );
    }

    /**
     * get key state
     * @return key code
     */
    function getKeyState () {
    }

    /**
     * collision detection of circle vs circle
     */
    function collisionCircle (circle1, circle2) {
        return ((Math.pow(circle1.x - circle2.x, 2) + 
                 Math.pow(circle1.y - circle2.y, 2)) < Math.pow(15.0, 2));
    }

    /**
     * collision detection of rect vs rect
     */
    function collisionRect () {
    }

    function Vector2 (x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * set position
     */
    Vector2.prototype.setPosition = function ( x, y ) {
        this.x = x;
        this.y = y;
    };

    /**
     * compute length
     */
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * compute dot product
     */
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };

    /**
     * add
     */
    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    /**
     * sub
     */
    Vector2.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    /**
     * mul
     */
    Vector2.prototype.mul = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };

    /**
     * normalize
     */
    Vector2.prototype.normalize = function () {
        var len = this.length();
        
        if(len == 0) {
            return this;
        }
        this.x /= len;
        this.y /= len;
        
        return this;
    };

    /**
     * compute angle
     */
    Vector2.prototype.computeTargetAngle = function (v) {
        return toDegree(Math.atan2(v.y - this.y, v.x - this.x));
    };

})();

