import Traceroute from 'nodejs-traceroute'
import * as fs from 'fs';

const fileName = 'trace.txt';

try {
    const tracer = new Traceroute();
    tracer
        .on('destination', (destination) => {
            const date = new Date();
            fs.appendFile(fileName, new Date()+'\n', function (err) {
                if(err) throw err;
            })
            fs.appendFile(fileName, destination+'\n', function (err) {
                if(err) throw err;
            })
            console.log(date, destination);
        })
        .on('hop', (hop) => {
            fs.appendFile(fileName, JSON.stringify(hop)+'\n', function (err) {
                if(err) throw err;
            })
            console.log(JSON.stringify(hop))
        })

    let count = 0;

    const job = setInterval(() => {
        count++;
        if(count == 10){
            clearInterval(job);
        }
        tracer.trace('github.com');
    }, 1000);


} catch (ex) {
    console.log(ex);
}