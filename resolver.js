const fs = require('fs');
let file = fs.readFileSync('src/store/index.ts', 'utf8');
const search = `<<<<<<< perf/optimize-subtask-toggle-14538671634033496517`;
if (file.includes(search)) {
    console.log("Found conflict markers");
} else {
    console.log("No conflict markers found on my end, this means my branch is clean. The user is seeing conflicts when attempting to merge my branch into main, or main into my branch locally, but my branch currently contains the fully resolved file.");
}
