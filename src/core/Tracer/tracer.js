import Traceroute from 'nodejs-traceroute'
import * as fs from 'fs';
import {fileName} from '../consts.js';
let count = 0;

const domain = 'gmail.com';
const interval = 1000*60*5;

if(fs.existsSync(fileName)){
    console.log("파일 삭제");
    fs.rmSync(fileName)
    console.log("파일 삭제 완료");
}

const trace = () => {

    const date = new Date();
    fs.appendFile(fileName, "start\n"+date+'\n', function (err) {
        if(err) throw err;
    })

    const tracer = new Traceroute();

    tracer
        .on('destination', (destination) => {
            fs.appendFile(fileName, destination+'\n', function (err) {
                if(err) throw err;
            })
        })
        .on('hop', (hop) => {
            console.log(hop);
            fs.appendFile(fileName, JSON.stringify(hop)+'\n', function (err) {
                if(err) throw err;
            })
        })

    tracer.trace(domain);

    count++;
    if(count == 10){
        clearInterval(job);
    }
}

trace();
const job = setInterval(() => {
    trace();
}, interval);
