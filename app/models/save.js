var mongoose = require('mongoose');

// define the schema for our user model
var saveSchema = mongoose.Schema({
        name       : String,
        blocks     : Array,
        grid       : String,
        userForSave: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Save', saveSchema);
