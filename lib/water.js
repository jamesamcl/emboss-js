
var extend = require('xtend')

var eof = require('./eof')

var exec = require('./exec')

const water = 'water'


/* supports DNA & protein
 * so need to pass seq type as it can't always be determined
 */
function alignSequencePair(sequenceA, sequenceB, opts, callback) {

    opts = extend({

        gapOpen: 10.0,
        gapExtend: 0.5,
        scoringMatrix: null

    }, opts)

    var args = [
        '-auto',
        '-filter',
        '-gapopen ' + opts.gapOpen,
        '-gapextend ' + opts.gapExtend
    ]

    exec(water, args, (res) => {

    })

}

module.exports = alignSequencePair


