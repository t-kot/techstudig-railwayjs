helper = require('../../app/helpers/users_helper');

//displayUserTitle(100);

exports['DisplayUserTitle'] = {
    '10未満ならばトロイであること': function(test){
        test.equal(helper.displayUserTitle(0),"トロイ");
        test.equal(helper.displayUserTitle(5),"トロイ");
        test.notEqual(helper.displayUserTitle(10),"トロイ");
        test.done();
    },
    '10以上30未満ならば馬であること': function(test){
        test.equal(helper.displayUserTitle(10),"馬");
        test.notEqual(helper.displayUserTitle(30),"馬");
        test.done();
    },
    '30以上100未満ならばかぼちゃであること': function(test){
        test.equal(helper.displayUserTitle(30),"かぼちゃ");
        test.equal(helper.displayUserTitle(50),"かぼちゃ");
        test.notEqual(helper.displayUserTitle(100),"かぼちゃ");
        test.done();
    },
    '100以上ならば候爵であること': function(test){
        test.equal(helper.displayUserTitle(100),"候爵");
        test.equal(helper.displayUserTitle(2000),"候爵");
        test.done();
    }
};
exports['DisplayUserType'] = {
    '１ならば一般ユーザであること': function(test){
        test.equal(helper.displayUserType(1),"一般ユーザ");
        test.done();
    },
    '2ならば管理者であること': function(test){
        test.equal(helper.displayUserType(2),"管理者");
        test.done();
    }
};
