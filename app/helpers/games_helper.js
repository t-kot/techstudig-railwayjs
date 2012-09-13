module.exports = {
    displayType: function(type){
        return Game.typeFormatJa[type];
    },
    displayMode: function(mode){
        switch(mode){
            case 1:
                return "楽しくワイワイ";
            case 2:
                return "ガンガン賭ける";
            case 3:
                return "ノーレート";
        }
    }

};
