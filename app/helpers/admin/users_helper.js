module.exports = {
    displayUserTitle: function(star){
        if(star < 10) {return "Prince";}
        if(10<=star && star< 30){ return "Ace";}
        if(30<=star && star < 100){ return "Knight";}
        if(100<=star){return "Jack";}
    }
};
