/**
 * Created by fisch on 10.01.2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    email: String,
    translates: Array
});

module.exports = mongoose.model('User', UserSchema);