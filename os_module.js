const os = require('os');
const fs = require('fs');

console.log(os.type());
fs.readFile('file.txt','utf-8', (err,data) => {
    if (err) throw err;
    console.log(data);
});

