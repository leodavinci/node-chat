// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date.getMonth());

var moment = require('moment');

var date = moment();
console.log(date.format('MMM Do, YYYY'));

var createdAt = 1234;
var date1 = moment(createdAt);
console.log(date1.format());

var timestampValue = moment().valueOf();
console.log(timestampValue);
