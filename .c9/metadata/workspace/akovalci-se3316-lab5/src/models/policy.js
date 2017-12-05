{"filter":false,"title":"policy.js","tooltip":"/akovalci-se3316-lab5/src/models/policy.js","undoManager":{"mark":42,"position":42,"stack":[[{"start":{"row":0,"column":0},"end":{"row":17,"column":60},"action":"insert","lines":["","","var mongoose = require('mongoose'),","    Schema = mongoose.Schema;","    ","var collectionSchema   = new Schema({","    name: { type: String, required: true},","    description: { type: String, required: true},","    owner: { type: String, required: true},","    priv: {type: Boolean, required: true},","    enabled:{type: Boolean, required: true},","    raters:Array(),","    ratings:Array(),","    rating:{type:Number},","    images:Array()","});","var conn = mongoose.createConnection('mongodb://localhost:27017/collection');","module.exports = conn.model('Collection', collectionSchema);"],"id":1}],[{"start":{"row":17,"column":29},"end":{"row":17,"column":39},"action":"remove","lines":["Collection"],"id":2},{"start":{"row":17,"column":29},"end":{"row":17,"column":30},"action":"insert","lines":["P"]}],[{"start":{"row":17,"column":30},"end":{"row":17,"column":31},"action":"insert","lines":["o"],"id":3}],[{"start":{"row":17,"column":31},"end":{"row":17,"column":32},"action":"insert","lines":["l"],"id":4}],[{"start":{"row":17,"column":32},"end":{"row":17,"column":33},"action":"insert","lines":["i"],"id":5}],[{"start":{"row":17,"column":33},"end":{"row":17,"column":34},"action":"insert","lines":["c"],"id":6}],[{"start":{"row":17,"column":34},"end":{"row":17,"column":35},"action":"insert","lines":["y"],"id":7}],[{"start":{"row":17,"column":38},"end":{"row":17,"column":48},"action":"remove","lines":["collection"],"id":8},{"start":{"row":17,"column":38},"end":{"row":17,"column":39},"action":"insert","lines":["p"]}],[{"start":{"row":17,"column":39},"end":{"row":17,"column":40},"action":"insert","lines":["o"],"id":9}],[{"start":{"row":17,"column":40},"end":{"row":17,"column":41},"action":"insert","lines":["l"],"id":10}],[{"start":{"row":17,"column":41},"end":{"row":17,"column":42},"action":"insert","lines":["i"],"id":11}],[{"start":{"row":17,"column":42},"end":{"row":17,"column":43},"action":"insert","lines":["c"],"id":12}],[{"start":{"row":17,"column":43},"end":{"row":17,"column":44},"action":"insert","lines":["y"],"id":13}],[{"start":{"row":16,"column":64},"end":{"row":16,"column":74},"action":"remove","lines":["collection"],"id":14},{"start":{"row":16,"column":64},"end":{"row":16,"column":65},"action":"insert","lines":["p"]}],[{"start":{"row":16,"column":65},"end":{"row":16,"column":66},"action":"insert","lines":["o"],"id":15}],[{"start":{"row":16,"column":66},"end":{"row":16,"column":67},"action":"insert","lines":["l"],"id":16}],[{"start":{"row":16,"column":67},"end":{"row":16,"column":68},"action":"insert","lines":["i"],"id":17}],[{"start":{"row":16,"column":68},"end":{"row":16,"column":69},"action":"insert","lines":["c"],"id":18}],[{"start":{"row":16,"column":69},"end":{"row":16,"column":70},"action":"insert","lines":["y"],"id":19}],[{"start":{"row":5,"column":4},"end":{"row":5,"column":14},"action":"remove","lines":["collection"],"id":20},{"start":{"row":5,"column":4},"end":{"row":5,"column":5},"action":"insert","lines":["p"]},{"start":{"row":5,"column":5},"end":{"row":5,"column":6},"action":"insert","lines":["o"]}],[{"start":{"row":5,"column":6},"end":{"row":5,"column":7},"action":"insert","lines":["l"],"id":21}],[{"start":{"row":5,"column":7},"end":{"row":5,"column":8},"action":"insert","lines":["i"],"id":22}],[{"start":{"row":5,"column":8},"end":{"row":5,"column":9},"action":"insert","lines":["c"],"id":23}],[{"start":{"row":5,"column":9},"end":{"row":5,"column":10},"action":"insert","lines":["y"],"id":24}],[{"start":{"row":8,"column":3},"end":{"row":14,"column":18},"action":"remove","lines":[" owner: { type: String, required: true},","    priv: {type: Boolean, required: true},","    enabled:{type: Boolean, required: true},","    raters:Array(),","    ratings:Array(),","    rating:{type:Number},","    images:Array()"],"id":25}],[{"start":{"row":8,"column":2},"end":{"row":8,"column":3},"action":"remove","lines":[" "],"id":26}],[{"start":{"row":8,"column":1},"end":{"row":8,"column":2},"action":"remove","lines":[" "],"id":27}],[{"start":{"row":8,"column":0},"end":{"row":8,"column":1},"action":"remove","lines":[" "],"id":28}],[{"start":{"row":7,"column":49},"end":{"row":8,"column":0},"action":"remove","lines":["",""],"id":29}],[{"start":{"row":7,"column":48},"end":{"row":7,"column":49},"action":"remove","lines":[","],"id":30}],[{"start":{"row":7,"column":4},"end":{"row":7,"column":15},"action":"remove","lines":["description"],"id":31},{"start":{"row":7,"column":4},"end":{"row":7,"column":5},"action":"insert","lines":["c"]}],[{"start":{"row":7,"column":5},"end":{"row":7,"column":6},"action":"insert","lines":["o"],"id":32}],[{"start":{"row":7,"column":6},"end":{"row":7,"column":7},"action":"insert","lines":["n"],"id":33}],[{"start":{"row":7,"column":7},"end":{"row":7,"column":8},"action":"insert","lines":["e"],"id":34}],[{"start":{"row":7,"column":8},"end":{"row":7,"column":9},"action":"insert","lines":["n"],"id":35}],[{"start":{"row":7,"column":9},"end":{"row":7,"column":10},"action":"insert","lines":["t"],"id":36}],[{"start":{"row":7,"column":9},"end":{"row":7,"column":10},"action":"remove","lines":["t"],"id":37}],[{"start":{"row":7,"column":8},"end":{"row":7,"column":9},"action":"remove","lines":["n"],"id":38}],[{"start":{"row":7,"column":7},"end":{"row":7,"column":8},"action":"remove","lines":["e"],"id":39}],[{"start":{"row":7,"column":7},"end":{"row":7,"column":8},"action":"insert","lines":["t"],"id":40}],[{"start":{"row":7,"column":8},"end":{"row":7,"column":9},"action":"insert","lines":["e"],"id":41}],[{"start":{"row":7,"column":9},"end":{"row":7,"column":10},"action":"insert","lines":["n"],"id":42}],[{"start":{"row":7,"column":10},"end":{"row":7,"column":11},"action":"insert","lines":["t"],"id":43}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":10,"column":52},"end":{"row":10,"column":52},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1512363226433,"hash":"5f90734186fa16e989480806f5f37dc2a49617fb"}