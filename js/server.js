var fs         = require('fs'),
    path       = require('path'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express(),
    ansi       = require('ansi'),
    cursor     = ansi(process.stdout);

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/posts.json', function(req, res) {
    cursor.grey().write('GET /posts.json' + '\n').reset();
    fs.readFile(path.join(__dirname, '../conf/posts.json'), function(err, data) {

        res.setHeader('Content-Type', 'application/json');
        if (err)
        {
            cursor.red().write(err + '\n').reset();
            res.send(JSON.stringify(err, null, 4));
        }
        else
        {
            res.send(data);
        }
    });
});

app.post('/posts.json', function(req, res) {
    cursor.grey().write('POST /posts.json' + '\n').reset();
    fs.readFile(path.join(__dirname, '../conf/posts.json'), function(err, data) {
        var posts = JSON.parse(data);
        posts.push(req.body);
        fs.writeFile(path.join(__dirname, '../conf/posts.json'), JSON.stringify(posts, null, 4), function(err) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.send(JSON.stringify(posts));
        });
    });
});

app.listen(3000);

console.log('Server started: http://dev.ynote.hk:3000/');
