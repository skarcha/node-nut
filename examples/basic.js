var Nut = require('../index');

nut = new Nut(3493, '10.30.21.11');

nut.on('error', err => {
    console.log('There was an error: ' + err);
});

nut.on('disconnect', () => {
    console.log('Connection closed.');
});

nut.on('connect', () => {
    nut.getUpsList((upslist, err) => {
        if (err) console.log('Error: ' + err)
        console.log(upslist);

        let upsname = Object.keys(upslist)[0];
        
        nut.getUpsVars(upsname, (vars, err) => {
            if (err) console.err('Error:', err);
            console.log(vars);
        });
    });
});

nut.connect();