
var extend = require('xtend')

var eof = require('./eof')

var exec = require('./exec')

const iep = 'iep'

function getChargeCurve(proteinSequence, opts, callback) {

    opts = extend({
    }, opts)

    var args = [
        '-auto',
        '-filter',
    ]

    return new Promise((resolve, reject) => {

        const process = exec(iep, args, (res) => {

            resolve({
                output: res.output,
                result: parseIepOutput(res.output)
            })

        }) 

        process.stdin.write(proteinSequence)
        process.stdin.write(eof)
        process.stdin.end()

    })
}

function parseIepOutput(output) {

    var res = {
        isoelectricPoint: null,
        chargeCurve: [],
    }

    var parser = parseMetadataLine

    output.split('\n').forEach((line) => {

        parser = parser(line)

    })

    return res

    function parseMetadataLine(line) {

        const tokens = line.split(/[ ]+/)
            .map((token) => token.trim())
            .filter((token) => token !== '')

        if(tokens.length === 3 &&
            tokens[0] === 'pH' &&
            tokens[1] === 'Bound' &&
            tokens[2] === 'Charge') {

            return parseChargeCurveTableLine

        }

        if(line.indexOf('Isoelectric Point') === 0) {

            res.isoelectricPoint = parseFloat(line.split('=')[1].trim())

        }


        return parseMetadataLine
    }

    function parseChargeCurveTableLine(line) {

        const tokens = line.split(/[ ]+/)
            .map((token) => token.trim())
            .filter((token) => token !== '')

        if(tokens.length === 3) {

            const pH = parseFloat(tokens[0])
            const bound = parseFloat(tokens[1])
            const charge = parseFloat(tokens[2])

            res.chargeCurve.push({
                pH: pH,
                bound: bound,
                charge: charge
            })
        }

        return parseChargeCurveTableLine
    }

}

module.exports = getChargeCurve



