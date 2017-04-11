var socket = io();
socket.on('connect',function() {
    console.log('connected to server');

    socket.emit('createEmail',{
        to: 'mayank@aisle.co',
        text: 'hey this is mayank...'
    });

    socket.emit('createMessage',{
        to: 'himangi',
        text: 'hey this is mayank...'
    });
});
socket.on('disconnect',function() {
    console.log('disconnected from server');
});
socket.on('newEmail', function(email) {
    console.log('new email: ',email);
});
socket.on('newMessage', function(message) {
    console.log('new message: ',message);
});
