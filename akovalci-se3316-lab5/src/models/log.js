var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var logSchema   = new Schema({
    type: { type: String, required: true},
    description: { type: String, required: true}
});
var conn = mongoose.createConnection('mongodb://localhost:27017/log');
module.exports = conn.model('Log', logSchema);