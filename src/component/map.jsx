import {useMemo} from "react";
import {TraceData} from "../core/TraceData";
import {CircleMarker, Marker, TileLayer, Popup, MapContainer, Tooltip, Polyline} from "react-leaflet";

const MapItem = ({data}) => {
    const renderedData = useMemo(() => {
        const traceData = new TraceData(data);
        const rtt1AVG = traceData.getRTT1AVG();
        const rtt2AVG = traceData.getRTT2AVG();
        const rtt3AVG = traceData.getRTT3AVG();
        const rtt1STDEV = traceData.getRTT1STDEV();
        const rtt2STDEV = traceData.getRTT2STDEV();
        const rtt3STDEV = traceData.getRTT3STDEV();
        const date = traceData.date;
        const ips = traceData.ips;
        const detailData = traceData.detailIps.map((d) => {
            return {
                regionName: d.region_name,
                latitude: d.latitude,
                longitude: d.longitude,
                countryFlagEmoji: d.country_flag_emoji_unicode,
                ip: d.ip,
            }
        })
        return {
            rtt1AVG,
            rtt2AVG,
            rtt3AVG,
            rtt1STDEV,
            rtt2STDEV,
            rtt3STDEV,
            date,
            ips,
            detailData,
        }
    }, [data])
    console.log(renderedData)
    const filteredData = renderedData.detailData.filter((data) => {
        return data.regionName != undefined;
    })

    const center = [
        filteredData[0].latitude,
        filteredData[0].longitude
    ]

    const Markers = filteredData.map((data) => {
        return (
            <CircleMarker
                center={[data.latitude, data.longitude]}
                pathOptions={{ color: 'red' }}
                radius={20}>
                <Tooltip opacity={1} permanent>{
                    <>
                        <p>지역이름 : {data.regionName}</p>
                        <p>ip : {data.ip}</p>
                    </>
                }</Tooltip>
            </CircleMarker>
        )
    })

    const lines = filteredData.map((data) => {
        return [data.latitude, data.longitude];
    })

    return (
        <>
            <p>time : {renderedData.date}</p>
            <p>rtt1 평균 : {renderedData.rtt1AVG}</p>
            <p>rtt1 표준편차 : {renderedData.rtt1STDEV}</p>
            <p>rtt2 평균 : {renderedData.rtt2AVG}</p>
            <p>rtt2 표쥰편차 : {renderedData.rtt2STDEV}</p>
            <p>rtt3 평균 : {renderedData.rtt3AVG}</p>
            <p>rtt3 표쥰편차 : {renderedData.rtt3STDEV}</p>
            <div>
                <MapContainer style={{height: 400}} center={center} zoom={100} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {Markers}
                    <Polyline pathOptions={ {color: 'black' } } positions={lines}></Polyline>
                </MapContainer>,
            </div>
        </>
    )

}

export default MapItem;
