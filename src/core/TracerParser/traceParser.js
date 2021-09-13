import * as fs from 'fs'
import {fileName, ParsedTraceDatas} from '../consts.js'
import fetch from 'node-fetch';
import {ipstack_api_key} from '../../config.js';

if(!fs.existsSync(fileName)){
    throw new Error(`not exists ${fileName}`);
}

if(fs.existsSync(ParsedTraceDatas)){
    console.log("파일 삭제");
    fs.rmSync(ParsedTraceDatas)
    console.log("파일 삭제 완료");
}


export class TraceParser{
    date = "";
    ips = [];
    detailIps = [];
    rtt1 = [];
    rtt2 = [];
    rtt3 = [];

    constructor(traceData) {
        if(traceData != null){
            if(traceData.date == undefined) {
                throw new Error('can not create TraceData Instance.');
            }

            this.date = traceData.date || new Date();
            this.ips = traceData.ips || [];
            this.detailIps = traceData.detailIps || null;
            this.rtt1 = traceData.rtt1 || [];
            this.rtt2 = traceData.rtt2 || [];
            this.rtt3 = traceData.rtt3 || [];
        }
    }

    setDate(date){
        this.date = date;
    }

    insertIP(ip){
        this.ips.push(ip);
    }

    formattingRTT(rtt){
        return rtt.replace(/[^0-9]/g,"");
    }

    insertRTT1(rtt1){
        this.rtt1.push(this.formattingRTT(rtt1));
    }

    insertRTT2(rtt2){
        this.rtt2.push(this.formattingRTT(rtt2));
    }

    insertRTT3(rtt3){
        this.rtt3.push(this.formattingRTT(rtt3));
    }

    async findDetailIps(){
        for(let i = 0; i < this.ips.length; i++){
            console.log(this.ips[i]);
            if(!this.ips[i]){
                this.detailIps.push("");
            }else{
                const response = await fetch(`http://api.ipstack.com/${this.ips[i]}?access_key=${ipstack_api_key}`);
                this.detailIps.push(await response.json());
            }
        }
    }

}


const tracedDatas = fs.readFileSync(fileName, 'utf-8').split('\n');
const parseTracedDatas = []
for(let i = 0; i < tracedDatas.length; i++){
    if(tracedDatas[i] === 'start'){
        const traceData = new TraceParser();
        i++;
        traceData.setDate(tracedDatas[i]);
        parseTracedDatas.push(traceData);
        continue;
    }
    if(tracedDatas[i] === '')break;
    const hopData = JSON.parse(tracedDatas[i]);
    if(hopData.hop == null){
        throw new Error('hopData not hav property `hop`')
    }

    const traceData = parseTracedDatas[parseTracedDatas.length-1];
    traceData.insertIP(hopData.ip);
    traceData.insertRTT1(hopData.rtt1);
    traceData.insertRTT2(hopData.rtt2);
    traceData.insertRTT3(hopData.rtt3);
}

Promise.all(parseTracedDatas.map((parseTracedData) => {
    return parseTracedData.findDetailIps();
})).then(() => {
    fs.writeFileSync(ParsedTraceDatas, `const ParsedDatas = ${JSON.stringify(parseTracedDatas)}\n export default ParsedDatas`);
})
