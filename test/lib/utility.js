var utility = require('../../lib/utility');

var intermediateCheck = utility.intermediateCheck;

exports['intermediateCheck'] = {
    '100,200ならばfalsyであること': function(test){
        test.ok(!intermediateCheck(100,200));
        test.done();
    },
    '800,1200ならばtrueであること': function(test){
        test.ok(intermediateCheck(800,1200));
        test.done();
    },
    '1200,2000ならばtrueであること': function(test){
        test.ok(intermediateCheck(1200,2000));
        test.done();
    },
    '2000,2100ならばfalsyであること': function(test){
        test.ok(!intermediateCheck(2000,2100));
        test.done();
    }
};

