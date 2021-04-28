const os = require('os');// Built-in module to check about the Operating system.
// This module used to get information about the OS
const fs = require('fs');//Built -in module to do file operations (read and write)

console.log(os.type());//Call the type function
fs.readFile('file.txt','utf-8', (err,data) => {
    if (err) throw err;
    console.log(data);
});
