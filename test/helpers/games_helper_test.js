require('../test_helper.js');
helper = require('../../app/helpers/games_helper');

exports['DisplayType'] = {
    '1ならばインベーダーであること': function(test){
        test.equal(helper.displayType(1),"インベーダー");
        test.done();
    },
    '2ならばハロウィーンであること': function(test){
        test.equal(helper.displayType(2),"ハロウィーン");
        test.done();
    }
};

exports['DisplayMode'] = {
    '1ならば"楽しくワイワイ"であること': function(test){
        test.equal(helper.displayMode(1),"楽しくワイワイ");
        test.done();
    },
    '2ならば"ガンガン賭ける"であること': function(test){
        test.equal(helper.displayMode(2),"ガンガン賭ける");
        test.done();
    },
    '3ならば"ノーレート"であること': function(test){
        test.equal(helper.displayMode(3),"ノーレート");
        test.done();
    }
};
