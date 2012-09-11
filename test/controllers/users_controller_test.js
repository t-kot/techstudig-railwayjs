require('../test_helper.js').controller('users', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        id: 1,
        name: 'user1',
        password: 'password1',
        type: 1,
        createdAt: new Date()
    };
}
function AnotherUserAttributes (){
    return {
        id: '2',
        name: 'user2',
        password: 'password2',
        type: '1',
        createdAt: new Date()
    };
}
function InValidAttributes (){
    return {
        id: '3',
        name: '',
        password: '',
        type: '',
        createdAt: new Date()
    };
}

exports['users controller'] = {

    'GET new': function (test) {
        test.get('/users/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },


    'GET edit': function (test) {
        var find = User.find;
        User.find = sinon.spy(function (id, callback) {
            callback(null, new ValidAttributes);
        });
        test.get('/users/1/edit', function () {
            test.ok(User.find.calledWith('1'));
            User.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },


    'GET show': function (test) {
        var find = User.find;
        User.find = sinon.spy(function (id, callback) {
            callback(null, new User);
        });
        test.get('/users/1', function () {
            test.ok(User.find.calledWith('1'));
            User.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },
    'POST create': function (test) {
        var user = new ValidAttributes;
        var create = User.create;
        User.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, user);
            callback(null, user);
        });
        test.post('/users', {User: user}, function () {
            test.redirect('/');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var user = new InValidAttributes;
        var create = User.create;
        User.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, user);
            callback(new Error, user);
        });
        test.post('/users', {User: user}, function () {
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        User.find = sinon.spy(function (id, callback) {
            id = id || 1;
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/users/1', new ValidAttributes, function () {
            test.flash('info');
            test.redirect('/users/1');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        User.find = sinon.spy(function (id, callback) {
            id = id || 1;
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/users/1', new InValidAttributes, function () {
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

