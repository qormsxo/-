import React, { useEffect, useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";

// const { kakao } = window;

function ReportMap(props) {
  const { func, infos } = props;
  //좌표
  const [{ lat, lng }, setGeometricData] = useState({
    lat: 36.2683,
    lng: 127.6358,
  });
  const [info, setInfo] = useState([]);
  const [infoWindow, setInfoWindow] = useState();
  const [windowOpen, setWindowOpen] = useState(false);

  useEffect(() => {
    //console.log(infos);
    setInfo(infos);
  }, [infos]);

  //var geocoder = new kakao.maps.services.Geocoder();

  return (
    <div>
      <Map
        center={{ lat: lat, lng: lng }}
        style={{ width: "100%", height: "400px" }}
        level={14}
        //onCreate={setMap}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={10} // 클러스터 할 최소 지도 레벨
        >
          {info.map((i) => (
            <MapMarker
              key={`${i.report_lat}-${i.report_lng}`}
              position={{
                lat: i.report_lat,
                lng: i.report_lng,
              }}
              onMouseOver={
                // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
                () => {
                  setWindowOpen(true);
                  setInfoWindow(i);
                }
              }
              // 마커에 마우스아웃 이벤트를 등록합니다
              onMouseOut={
                // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
                () => setWindowOpen(false)
              }
              onClick={() => {
                func(i.report_id);
              }}
            >
              {windowOpen &&
                infoWindow &&
                infoWindow.report_id === i.report_id && (
                  <div style={{ color: "#000", borderRadius: "5px" }}>
                    <p style={{ fontSize: "1rem", paddingTop: "10px" }}>
                      발견 생물 : <b>{i.name}</b>
                    </p>
                    <p style={{ fontSize: "1rem" }}>
                      장소 : <b>{i.report_title}</b>
                    </p>
                  </div>
                )}
            </MapMarker>
          ))}
        </MarkerClusterer>
      </Map>
    </div>
  );
}

export default ReportMap;
