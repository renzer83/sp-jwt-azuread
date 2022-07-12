// library npm and read certificate file fs 
var jwt = require('jsonwebtoken');
var fs = require('fs');
var request = require('request');
var certificatefile = fs.readFileSync('path-certificate');
