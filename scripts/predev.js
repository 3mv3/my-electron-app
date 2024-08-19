const detect = require('detect-port');
const {spawn} = require('child_process')
const port = 3000;

detect(port)
  .then(_port => {
    if (port == _port) {      
      const subprocess = spawn('npm', ['run', 'start'], { shell: true, detached: true, cwd: process.cwd() });

      // https://nodejs.org/api/child_process.html#subprocessunref
      subprocess.unref()

      process.exit()
    }
    else {
        console.log(`port: ${port} was occupied. React server may already be running.`);
    }
  })
  .catch(err => {
    console.log(err);
  });