var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local            : {
        displayName  : String,
        password     : String,
        savesInUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Save'}]
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        displayName  : String,
        savesInUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Save'}]
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
