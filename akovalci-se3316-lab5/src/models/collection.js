

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var collectionSchema   = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    owner: { type: String, required: true},
    priv: {type: Boolean, required: true},
    enabled:{type: Boolean, required: true},
    raters:Array(),
    ratings:Array(),
    rating:{type:Number},
    images:Array()
});
var conn = mongoose.createConnection('mongodb://localhost:27017/collection');
module.exports = conn.model('Collection', collectionSchema);