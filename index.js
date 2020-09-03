const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const core = require('@actions/core');
const github = require('@actions/github');

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
  const command = core.getInput('command');
  const reportName = core.getInput('custom-name');
  const outputName = core.getInput('custom-file-name');
  console.log(`${command} ${reportName} ${outputName}`)

  if (!command) {
    core.setFailed('Missing command!');
    return;
  }

  // Run script
  let result = '';
  try {
    const [ cmd, ...args ] = command.split(' ');
    result = await executeShell(cmd, args, { cwd: process.cwd() });
  } catch (err) {
    core.setFailed(err);
    return;
  }
  // Generate output
  

  const output = `
## ${reportName}
\`\`\`
${result.join('\n')}
\`\`\`
`;

  // Save File
  await writeFile(path.join(process.cwd(), outputName), output, 'utf8');

}

main();