var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('fdlist',['fdlist']);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/fdlist',function (req,res) {
    console.log('Received GET request')

    db.fdlist.find(function (err,docs) {
        console.log(docs);
        res.json(docs);
    });
});


app.delete('/fdlist/:id',function (req,res) {
    var id = req.params.id;
    console.log(id);

    db.fdlist.remove({'_id' : mongojs.ObjectId(id)},function (err,doc) {
        res.json(doc);
    });
});

app.get('/fdlist/:id',function (req,res) {
    var id = req.params.id;
    console.log(id);

    db.fdlist.findOne({'_id' : mongojs.ObjectId(id)},function (err,doc) {
        console.log(doc);
        res.json(doc);
    });
});
app.put('/fdlist/:id',function (req,res) {
    console.log("Entered POST request");
    var id = req.params.id;
    console.log(id);
    db.fdlist.findAndModify({
            query:{'_id': mongojs.ObjectId(id)},
            update: {dtpr: req.body.dtpr, amtpr:req.body.amtpr , dtmt:req.body.dtmt, amtmt:req.body.amtmt, detail:req.body.detail, bank:req.body.bank, certi: req.body.certi, name:req.body.name, gain:req.body.gain, remarks:req.body.remark},
            new: true},
        function (err,doc) {
            if(err)
            {
                console.log("Some error occured");
            }
            else {
                console.log("Updated to " + doc);
                res.json(doc);
            }
        });

});

app.post('/fdlist',function (req,res) {
    console.log("Entered POST request");
    console.log(req.body);

    db.fdlist.insert(req.body,function (err,doc) {
        if(err)
        {

        }
        else
        {
            console.log("Error: " + err);
            console.log("Response: "+ doc);
            res.json(doc);
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
