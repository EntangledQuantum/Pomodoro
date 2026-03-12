const fs = require('fs');
let file = fs.readFileSync('src/store/types.ts', 'utf8');
file = file.replace(/<<<<<<< HEAD[\s\S]*?=======\n/m, '');
file = file.replace(/>>>>>>>.*?\n/m, '');
file = file.replace('tasks: Task[];', 'tasks: Record<string, Task>;\n  tasksByProject: Record<string, string[]>;');
fs.writeFileSync('src/store/types.ts', file);
