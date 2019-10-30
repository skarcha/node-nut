var Nut = require('../node-nut');

nut = new Nut(3493, '10.30.21.11');

nut.on('error', err => {
    console.log('There was an error: ' + err);
});

nut.on('close', () => {
    console.log('Connection closed.');
});

nut.on('ready', async () => {
    let upslist = await nut.GetUPSList();
    let upsname = Object.keys(upslist)[0];

    let vars = await nut.GetUPSVars(upsname);
    console.log(vars);
});

nut.start();