exports.users = {
    user1:{
        name: 'tanaka',
        password: 'kakuei',
        createdAt: new Date(),
        star: 10,
        type: 1
    },
    user2:{
        name: 'fukuda',
        password: 'takeo',
        createdAt: new Date(),
        star: 10,
        type: 2
    }
};
exports.games = {
    game1:{
        ownerId: 1,
        ownerName: 'tanaka',
        title: 'title1',
        type: 2,
        mode: 1,
        createdAt: new Date()
    },
    game2:{
        ownerId: 2,
        ownerName: 'fukuda',
        title: 'title2',
        type: 2,
        mode: 2,
        createdAt: new Date()
    }
};
