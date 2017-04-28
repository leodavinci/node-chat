var socket = io();

function scrollToBottom(){
    // selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // heights
    var clientheight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageheight = newMessage.prev().innerHeight();

    if(clientheight + scrollTop + newMessageHeight + lastMessageheight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect',function() {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(error) {
        if(error){
            alert(error);
            window.location.href = '/';
        } else {
            console.log('no error');
        }
    });

    // socket.emit('createEmail',{
    //     to: 'mayank@aisle.co',
    //     text: 'hey this is mayank...'
    // });

    // socket.emit('createMessage',{
    //     to: 'himangi',
    //     text: 'hey this is mayank...'
    // });
});
socket.on('disconnect',function() {
    console.log('disconnected from server');
});

socket.on('updateUserList', function(users) {
    console.log('Users list : ',users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});
// socket.on('newEmail', function(email) {
//     console.log('new email: ',email);
// });
socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // console.log('new message: ',message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});
// socket.emit('createMessage',{
//     from: 'Frank',
//     text: 'Hi...'
// }, function() {
//     console.log('Got it...!!!');
// });

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage',{
        text: messageTextBox.val()
    },function(){
        messageTextBox.val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geo-location not supported.');
    }
    locationButton.attr('disabled','disabled').text('sending location....');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('send location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function(){
        locationButton.removeAttr('disabled').text('send location');
        alert('unable to fetch location');
    });
});
