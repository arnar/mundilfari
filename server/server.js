var express = require('express'),
    app = express(),
    db = require('mongojs').connect('mundilfari');

app.configure(function () {
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.logger('dev'));
  app.use(app.router);
  app.use(express.static(__dirname + '/../app'));
  app.use(express.errorHandler({ dumpExceptions: true, 
                                 showStack: true, 
                                 showMessage: true }));
});

// Factory for a generic callback that relays mongodb responses to the client
var relay = function (req, res) {
    res.contentType('application/json');
    var fn = function (err, doc) { 
        if (err) { 
            if (err.message) {
                doc = {error : err.message} 
            } else {
                doc = {error : JSON.stringify(err)} 
            }
        }
        if (typeof doc === "number" || req.params.cmd === "distinct") { doc = {ok : doc}; } 
        res.send(doc); 
    };
    return fn;
};

app.get('/api/entries', function (req, res) {
  db.collection('entries').find({}, relay(req, res));
});

app.get('/api/entries/:id', function (req, res) {
  db.collection('entries').findOne({_id: db.ObjectId(req.params.id)}, relay(req, res));
});

app.post('/api/entries', function (req, res) {
  if (req.body._id) req.body._id = db.ObjectId(req.body._id);
  db.collection('entries').save(req.body, {safe: true}, relay(req, res));
});

app.get('/api/tags', function (req, res) {
  db.collection('entries').aggregate([
      { $project: { _id: 0, tags: 1 } },
      { $unwind: '$tags' },
      { $group: {_id: '$tags', count: { $sum : 1 }}},
      { $sort: { count: -1 }}
    ], relay(req, res));
});

app.listen(8000, function () {
  console.log("Listening on http://localhost:8000/");
});
