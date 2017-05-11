var mongoose = require('mongoose');

var saveSchema = mongoose.Schema({
        name       : String,
        blocks     : Array,
        grid       : String,
        userForSave: String
});

module.exports = mongoose.model('Save', saveSchema);
