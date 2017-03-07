
var extend = require('xtend')

var eof = require('./eof')

var exec = require('./exec')

const pepinfo = 'pepinfo'

function plotAminoAcidProperties(proteinSequence, opts) {

    opts = extend({
        /*   -[no]generalplot    boolean    [Y] Plot histogram of general properties
             -[no]hydropathyplot boolean    [Y] Plot graphs of hydropathy
        */
    }, opts)

   var args = [
       '-auto',
       '-filter',
       '-graph', 'svg',
       '-goutfile', opts.svgFilename
   ]

    return new Promise((resolve, reject) => {
        
        const process = exec(pepinfo, args, (res) => {

            resolve({
                output: res.output
            })

        }) 

        process.stdin.write(proteinSequence)
        process.stdin.write(eof)
        process.stdin.end()

    })


}

module.exports = plotAminoAcidProperties



