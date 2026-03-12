const { exec } = require('child_process');

exec('npx jest', { cwd: __dirname }, (error, stdout, stderr) => {
  console.log(stdout);
  console.error(stderr);
  if (error) {
    console.error(`Error: ${error.message}`);
  }
});
