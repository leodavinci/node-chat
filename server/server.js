const path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
const _ = require('lodash');

const publicPath = path.join(__dirname,'/../public');
console.log(publicPath);

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.static(publicPath));

// Get /1
// app.get('/1',(req, res) => {
//     return res.send('<p>dnkbldf</p>');
// });

app.listen(port, () => {
    console.log(`Started on port ${port}....`);
});
