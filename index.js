const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const [,, command, scriptName, outputName ] = process.argv;

console.dir(process.argv);

const executeShell = (command, arguments, options) => {
  return new Promise( (resolve, reject) => {
    const shell = spawn(command, arguments, options);
    const output = [];

    shell.stdout.on('data', data => output.push(data.toString()));
    shell.stderr.on('data', data => output.push(data.toString()));

    shell.on('exit', () => resolve(output));
  });
}

const main = async () => {
  // Run script
  let result = '';
  try {
    const [ cmd, ...args ] = command.split(' ');  
    result = await executeShell(cmd, args, { cwd: process.cwd() });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  // Generate output
  

  const output = `
## ${scriptName}
\`\`\`
${result.join('\n')}
\`\`\`
`;

  // Save File
  await writeFile(path.join(process.cwd(), outputName), output, 'utf8');

}

main();