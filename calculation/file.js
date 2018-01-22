const fs                    = require('fs');

let file = {};

file.getDataFromFile = (path) => {
    let json = fs.readFileSync(path, 'utf8');
    return JSON.parse(json);
};

module.exports = file;