
var shell = require('shelljs')

function exec(bin, args, callback) {

    const command = bin + ' ' + args.join(' ')

    console.log(command)

    return shell.exec(command, {

        silent: false

    }, (exitCode, stdout, stderr) => {

        // TODO check exit code

        const stderrLines = stderr.split('\n')

        const warningPrefix = 'Warning: '

        function isWarning(line) {
            return line.indexOf(warningPrefix) === 0
        }

        const warnings = stderrLines
            .filter((line) => isWarning(line))
            .map((line) => line.slice(warningPrefix.length))

        const outputStderr = stderrLines
            .filter((line) => !isWarning(line))
            .join('\n')
            .trim()

        callback({

            warnings: warnings,
            output: stdout,
            outputStderr: outputStderr
                
        })

    })
}

module.exports = exec

