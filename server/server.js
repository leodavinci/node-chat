const path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
const _ = require('lodash');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'/../public');
// console.log(publicPath);

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.static(publicPath));

// Get /1
// app.get('/1',(req, res) => {
//     return res.send('<p>dnkbldf</p>');
// });

var server = http.createServer(app);
var io = socketIO(server);
io.on('connection',(socket)=>{
    console.log('New user connected');

    // socket.emit('newEmail',{
    //     from: 'maxmayank9@gmail.com',
    //     text: 'hello...',
    //     createdAt: 23
    // });
    //
    // socket.emit('newMessage',{
    //     from: 'himangi',
    //     text: 'hello how r u...?',
    //     createdAt: 23
    // });

    socket.on('disconnect',() =>{
        console.log('user disconnected');
    });

    // socket.on('createEmail', function(email) {
    //     console.log('new email: ',email);
    // });

    socket.on('createMessage', function(message) {
        console.log('new message: ',message);
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}....`);
});
