const fs = require('fs');
let file = fs.readFileSync('src/store/index.ts', 'utf8');

file = file.replace(/<<<<<<< HEAD[\s\S]*?=======\n/m, '');
file = file.replace(/>>>>>>> f94d32a.*?\n/m, '');

file = file.replace(/<<<<<<< HEAD[\s\S]*?=======\n/m, '');
file = file.replace(/>>>>>>> f94d32a.*?\n/m, '');

fs.writeFileSync('src/store/index.ts', file);
