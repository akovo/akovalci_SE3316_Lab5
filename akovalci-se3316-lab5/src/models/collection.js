// app/models/courseDescription.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var collectionSchema   = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    owner: { type: String, required: true},
    priv: {type: Boolean, required: true},
    rating:{type:Number,required:true},
    images:[]
    
    
   
});
var conn = mongoose.createConnection('mongodb://localhost:27017/collection');
module.exports = conn.model('User', collectionSchema);