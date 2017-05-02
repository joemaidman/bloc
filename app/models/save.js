var mongoose = require('mongoose');

// define the schema for our user model
var saveSchema = mongoose.Schema({

        blocks     : String,
        grid       : String,
        userForSave: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Save', saveSchema);
