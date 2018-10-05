
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var users = require('./routes/users'); 
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());


app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));



var session = require('express-session');
 
var cookieParser = require('cookie-parser');
 
var flash = require('connect-flash');
 
var app = express();
 
app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
 
app.use(flash());


app.use(
    
    connection(mysql,{
        
        host: "localhost",
        user: "root",
        password : "password",
        port : 3306, 
        database:"nodejs"

    },'pool')

);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', routes.index);
app.get('/list', users.list);
app.get('/add', users.add);
app.post('/add', users.save);
app.get('/delete/:id', users.delete_customer);
app.get('/edit/:id', users.edit);
app.post('/edit/:id',users.save_edit);

app.get('/test.html', function (req, res) {
    res.header('Content-Type', 'text/html').send("<html>my html code</html>");
 });

app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})
