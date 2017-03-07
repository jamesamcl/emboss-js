
var extend = require('xtend')

var eof = require('./eof')

var exec = require('./exec')

const pepstats = 'pepstats'

function getProteinStats(proteinSequence, opts, callback) {

    opts = extend({
        'termini': true,
        'monoisotopicWeights': false
    }, opts)

   var args = [
       '-auto',
       '-filter',
       opts.termini ? '-termini' : '-notermini',
   ]

   if(opts.monoisotopicWeights)
       args.push('-mono')

    const process = exec(pepstats, args, (res) => {

        callback(null, parsePepstatOutput(res.output))

    }) 

    process.stdin.write(proteinSequence)
    process.stdin.write(eof)
    process.stdin.end()

}

function parsePepstatOutput(output) {

    var res = {
        dayhoff: [],
        properties: {}
    }

    var parser = parseMetadataLine

    output.split('\n').forEach((line) => {

        const tokens = line.split('\t')
            .map((token) => token.trim())
            .filter((token) => token !== '')

        parser = parser(tokens)

    })

    return res

    function parseMetadataLine(tokens) {

        if(tokens.length === 4 &&
            tokens[0] === 'Residue' &&
            tokens[1] === 'Number' &&
            tokens[2] === 'Mole%' &&
            tokens[3] === 'DayhoffStat') {

            return parseDayhoffTableLine

        }

        tokens.forEach((item) => {

            const keyValue = item.split('=')

            if(keyValue.length == 2) {

                const key = keyValue[0].trim()
                const value = keyValue[1].trim()

                if(key === 'Molecular weight') {

                    res.molecularWeight = parseFloat(value)

                } else if(key === 'Residues') {

                    res.numResidues = parseFloat(value)

                } else if(key === 'Average Residue Weight') {

                    res.averageResidueWeight = parseFloat(value)

                } else if(key === 'Charge') {

                    res.charge = parseFloat(value)

                } else if(key === 'Isoelectric Point') {

                    res.isoelectricPoint = parseFloat(value)

                } else if(key === 'A280 Molar Extinction Coefficients') {

                    res.a280MolarExtinctionCoefficients = coefficients(value)

                } else if(key === 'A280 Extinction Coefficients 1mg/ml') {

                    res.a280ExtinctionCoefficients1mgPerMl = coefficients(value)

                } else if(key === 'Improbability of expression in inclusion bodies') {

                    res.improbabilityOfExpressionInInclusionBodies = parseFloat(value)

                }
            }
        })

        return parseMetadataLine

        function coefficients(value) {

            const coefficients = value.split('   ')

            if(coefficients[0].indexOf('reduced') !== -1 &&
                coefficients[1].indexOf('cystine') !== -1) {

                return {
                    reduced: parseFloat(coefficients[0].split('(')[0].trim()),
                    cystineBridges: parseFloat(coefficients[1].split('(')[0].trim())
                }

            }

        }
    }

    function parseDayhoffTableLine(tokens) {

        if(tokens.length === 4) {

            if(tokens[0] === 'Property' &&
               tokens[1] === 'Residues' &&
               tokens[2] === 'Number' &&
               tokens[3] === 'Mole%') {

                   return parsePropertyTableLine

               }

            const residue = tokens[0]
            const number = parseInt(tokens[1])
            const molePc = parseFloat(tokens[2])
            const dayhoffStat = parseFloat(tokens[3])

            res.dayhoff.push({
                residue: residue,
                number: number,
                molePc: molePc,
                dayhoffStat: dayhoffStat
            })
        }

        return parseDayhoffTableLine
    }

    function parsePropertyTableLine(tokens) {

        if(tokens.length === 4) {

            const property = tokens[0]
            const residues = tokens[1]
            const number = parseInt(tokens[2])
            const molePc = parseFloat(tokens[3])

            res.properties[property] = {
                residues: residues,
                number: number,
                molePc: molePc
            }
        }

        return parsePropertyTableLine
    }
}

module.exports = getProteinStats



