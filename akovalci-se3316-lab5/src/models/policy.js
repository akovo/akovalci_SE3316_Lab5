

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var policySchema   = new Schema({
    name: { type: String, required: true},
    content: { type: String, required: true}
});
var conn = mongoose.createConnection('mongodb://localhost:27017/policy');
module.exports = conn.model('Policy', policySchema);