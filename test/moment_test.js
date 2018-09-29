const moment = require('moment');

console.log(moment.now());
const d = moment('1902-01-01 01:02:03', 'yyyy-MM-dd HH:mm:ss').toDate();
console.log(d);
console.log(moment(d.getTime()).format('hh:mm:ss'));

