const path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
const _ = require('lodash');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

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
var users = new Users();
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
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left the chat`));
        }
    });

    // socket.on('createEmail', function(email) {
    //     console.log('new email: ',email);
    // });
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
    // socket.broadcast.emit('newMessage',generateMessage('Admin', 'New User Joined'));

    socket.on('join', (params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and roomname are required.')
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('new message: ',message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
        // io.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}....`);
});
