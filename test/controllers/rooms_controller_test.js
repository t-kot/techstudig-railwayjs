require('../test_helper.js').controller('rooms', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        userId: '',
        createdAt: ''
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

exports['rooms controller'] = {
    setUp: function (callback){
        this.userfind = User.find;
        User.find = sinon.spy(function (id, callback){
            callback(null, new ValidUserAttributes);
        });
        callback();
    },
    tearDown: function (callback){
        User.find = this.userfind;
        callback();
    },

    'GET new': function (test) {
        test.get('/rooms/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/rooms', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Room.find;
        Room.find = sinon.spy(function (id, callback) {
            callback(null, new Room);
        });
        test.get('/rooms/42/edit', function () {
            test.ok(Room.find.calledWith('42'));
            Room.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Room.find;
        Room.find = sinon.spy(function (id, callback) {
            callback(null, new Room);
        });
        test.get('/rooms/42', function (req, res) {
            test.ok(Room.find.calledWith('42'));
            Room.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var room = new ValidAttributes;
        var create = Room.create;
        Room.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, room);
            callback(null, room);
        });
        test.post('/rooms', {Room: room}, function () {
            test.redirect('/rooms');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var room = new ValidAttributes;
        var create = Room.create;
        Room.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, room);
            callback(new Error, room);
        });
        test.post('/rooms', {Room: room}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Room.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/rooms/1', new ValidAttributes, function () {
            test.redirect('/rooms/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Room.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/rooms/1', new ValidAttributes, function () {
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

