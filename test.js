

var protseq = 
['>sp|P29600|SUBS_BACLE Subtilisin Savinase OS=Bacillus lentus PE=1 SV=1',
'AQSVPWGISRVQAPAAHNRGLTGSGVKVAVLDTGISTHPDLNIRGGASFVPGEPSTQDGN',
'GHGTHVAGTIAALNNSIGVLGVAPSAELYAVKVLGASGSGSVSSIAQGLEWAGNNGMHVA',
'NLSLGSPSPSATLEQAVNSATSRGVLVVAASGNSGAGSISYPARYANAMAVGATDQNNNR',
'ASFSQYGAGLDIVAPGVNVQSTYPGSTYASLNGTSMATPHVAGAAALVKQKNPSWSNVQI',
'RNHLKNTATSLGSTNLYGSGLVNAEAATR'].join('\n')


var getProteinStats = require('./lib/pepstats')
var getChargeCurve = require('./lib/iep')

/*getProteinStats(protseq, {

    termini: true,
    monoisotopicWeights: false
   
}, (err, output, stats) => {

    console.log(stats)

})*/

getChargeCurve(protseq, {

   
}, (err, output, stats) => {

    console.log(err)
    console.log(stats)

})

