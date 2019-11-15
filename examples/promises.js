var Nut = require('../index');

nut = new Nut(3493, '10.30.21.11');

nut.on('error', err => {
    console.log('There was an error: ' + err);
});

nut.on('disconnect', () => {
    console.log('Connection closed.');
});

nut.connect().then(async () => {
    let upslist = await nut.getUpsList();
    let upsname = Object.keys(upslist)[0];

    let vars = await nut.getUpsVars(upsname);
    console.log(vars);
});