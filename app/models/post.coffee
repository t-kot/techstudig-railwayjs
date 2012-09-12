Post.belongsTo User, {as: "user", foreignKey: 'userId'}
Post.belongsTo Room, {as: "room", foreignKey: 'roomId'}
