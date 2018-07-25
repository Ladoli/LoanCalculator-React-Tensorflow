const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('mysql');
const cors           = require('cors');
const app            = express();

const redis          = require('redis');
const REDIS_PORT     = process.env.REDIS_PORT;
const client         = redis.createClient(REDIS_PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(cors());


const port = 8000;

var con = db.createConnection({
  host: "my3300db.cpqjuav2elw2.us-west-2.rds.amazonaws.com",
  user: "masteruser",
  password: "masterpass",
  database: "csis3300project"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(port, () => {
  console.log('We are live on the ' + port);
});


app.get('/', cache, getFromDb);

function cache(req, res, next) {
  const org = req.query.query;
  client.get(org, function (err, data) {
      if (err) throw err;

      if (data != null) {
        console.log("pulled from cache");
        var pass = JSON.parse(data);
        res.json(pass);
      } else {
        next();
      }
  });
}

function getFromDb(req, res) {
  // get sql query
  var sql = req.query.query;

  // query database
  con.query(sql, function (err, result) {
    if (err) throw err;
    
    console.log(req.query.query);
    
    // the 86400 is the duration (in seconds) that the information will stay in the Redis server
    client.setex(req.query.query, 86400, JSON.stringify(result));
    console.log("pulled from db")
    res.json(result);
  });
}
