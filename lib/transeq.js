
var extend = require('xtend')

var eof = require('./eof')

var exec = require('./exec')

const transeq = 'transeq'

/* dna -> protein
 */
function translateSequence(sequence, opts, callback) {

    opts = extend({


    }, opts)

    var args = [
        '-auto',
        '-filter',
    ]

    exec(transeq, args, (res) => {

    })

}

module.exports = translateSequence


