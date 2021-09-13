import usePagenation from "../component/pagenation";
import ParsedDatas from '../core/ParsedTraceData'
import {useMemo} from "react";
import MapItem from "../component/map";


const Maps = () => {
    const pageLength = useMemo(() => {
        return ParsedDatas.length;
    })

    const {pageNation, currentPage} = usePagenation({
        pageLength
    });
    return <>
        <MapItem data={ParsedDatas[currentPage-1]}/>
        {pageNation}
    </>
}

export default Maps;
