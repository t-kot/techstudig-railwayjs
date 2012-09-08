module.exports = {
    displayType: function(type){
        switch(type){
            case 1:
                return "1000人耐久モード";
            case 2:
                return "サバイバル";
            default:
                return "";
        }
    },
    displayMode: function(mode){
        switch(mode){
            case 1:
                return "楽しくワイワイ";
            case 2:
                return "ガンガン賭ける";
            case 3:
                return "ノーレート";
            default:
                return "";
        }
    }

};
