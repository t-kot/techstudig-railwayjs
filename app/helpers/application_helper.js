var moment = require('moment');
module.exports = {
    date_format: function(date){
        if(date instanceof Date){
            return moment(date).format("YYYY/MM/DD");
        }else{
            return "";
        }
    }
};

