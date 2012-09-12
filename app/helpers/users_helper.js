module.exports = {
    displayUserTitle: function(star){
        if(star < 10) {return "トロイ";}
        if(10<=star && star< 30){ return "馬";}
        if(30<=star && star < 100){ return "かぼちゃ";}
        if(100<=star){return "候爵";}
    },
    displayUserType: function(type){
        switch(type){
        case 1:
            return "一般ユーザ";
        case 2:
            return "管理者";
        }
    }
};
