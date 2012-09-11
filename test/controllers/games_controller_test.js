require('../test_helper.js').controller('games', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        ownerId: '123abc',
        ownerName: 'kotohata',
        title: 'test title',
        type: 1,
        mode: 1,
        createdAt: new Date()
    };
}
function ValidUserAttributes (){
    return {
        id: 1,
        name: 'user1',
        password: 'password1',
        type: 1,
        createdAt: new Date()
    };
}

exports['games controller'] = {
    setUp: function (callback){
        User.find = sinon.spy(function (id, callback){
            callback(null, new ValidUserAttributes);
        });
        callback();
    },

    'GET new': function (test) {
        test.get('/games/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/games', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },
    'GET show': function (test) {
        var find = Game.find;
        Game.find = sinon.spy(function (id, callback) {
            callback(null, new Game);
        });
        test.get('/games/42', function (req, res) {
            test.ok(Game.find.calledWith('42'));
            Game.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var game = new ValidAttributes;
        var create = Game.create;
        Game.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, game);
            callback(null, game);
        });
        test.post('/games', {Game: game}, function () {
            test.redirect('/games');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var game = new ValidAttributes;
        var create = Game.create;
        Game.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, game);
            callback(new Error, game);
        });
        test.post('/games', {Game: game}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },


    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

