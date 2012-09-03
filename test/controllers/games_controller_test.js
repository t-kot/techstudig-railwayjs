require('../test_helper.js').controller('games', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        ownerId: '',
        ownerName: '',
        title: '',
        type: '',
        createdAt: ''
    };
}

exports['games controller'] = {

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

    'GET edit': function (test) {
        var find = Game.find;
        Game.find = sinon.spy(function (id, callback) {
            callback(null, new Game);
        });
        test.get('/games/42/edit', function () {
            test.ok(Game.find.calledWith('42'));
            Game.find = find;
            test.success();
            test.render('edit');
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

    'PUT update': function (test) {
        Game.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/games/1', new ValidAttributes, function () {
            test.redirect('/games/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Game.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/games/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
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

