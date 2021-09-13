import * as stats from 'stats-lite'

export class TraceData {
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

    getRTT1AVG(){
        const res = this.rtt1.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.sum(res)/this.rtt1.length;
    }

    getRTT2AVG(){
        const res = this.rtt2.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.sum(res)/this.rtt2.length;
    }

    getRTT3AVG(){
        const res = this.rtt3.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.sum(res)/this.rtt3.length;
    }

    getRTT1STDEV(){
        const res = this.rtt1.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.stdev(res);
    }

    getRTT2STDEV(){
        const res = this.rtt2.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.stdev(res);
    }

    getRTT3STDEV(){
        const res = this.rtt3.map((data) => {
            return this.formattingRTT(data);
        });
        return stats.stdev(res);
    }

}
