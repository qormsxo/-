/* global kakao */
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const { kakao } = window;

function Kakaomap(props) {
  // const [ps, setPs] = useState(""); //
  const { searchPlace, func, position } = props;
  const [info, setInfo] = useState();
  //좌표
  const [{ lat, lng }, setGeometricData] = useState({
    lat: 37.554389125882096,
    lng: 126.9722955537647,
  });
  const [markers, setMarkers] = useState([
    {
      position: {
        lat: lat,
        lng: lng,
      },
    },
  ]);
  const [map, setMap] = useState();

  useEffect(() => {
    //console.log(position);
    if (position) {
      setGeometricData(position);
      setMarkers([{ position: position }]);
    }
  }, [position]);

  var geocoder = new kakao.maps.services.Geocoder();
  const mapClick = (mouseEvent) => {
    // 맵중 한곳을 클릭했을때
    searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
      // 좌표로 주소 검색
      const ps = new kakao.maps.services.Places();
      // console.log(result[0].address.address_name);
      ps.keywordSearch(
        result[0].address.address_name, // 주소로 장소 검색
        (data, status, _pagination) => {
          if (status === "OK") {
            // 검색결과가 있으면 장소명 , 업체명추가
            //console.log(data[0].place_name);
            setMarkers([
              {
                position: {
                  lat: mouseEvent.latLng.getLat(),
                  lng: mouseEvent.latLng.getLng(),
                },
                content: data[0].place_name,
                address: result[0].address.address_name,
              },
            ]);
            func({
              position: {
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
              },
              content: data[0].place_name,
              address: result[0].address.address_name,
            });
          } else {
            // 검색결과가 없으면
            // console.log(result[0].address.address_name);
            setMarkers([
              {
                position: {
                  lat: mouseEvent.latLng.getLat(),
                  lng: mouseEvent.latLng.getLng(),
                },
                address: result[0].address.address_name,
              },
            ]);
            func({
              position: {
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
              },
              address: result[0].address.address_name,
            });
          }
        }
      );
    });
  };

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  useEffect(async () => {
    //console.log("??");
    if (!searchPlace) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          // console.log(data[i]);
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });
  }, [searchPlace]);

  return (
    <div>
      <Map
        center={{ lat: lat, lng: lng }}
        style={{ width: "100%", height: "500px" }}
        level={5}
        onClick={(_t, mouseEvent) => {
          //console.log(mouseEvent);
          setGeometricData({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          });
          mapClick(mouseEvent);
        }}
        onCreate={setMap}
      >
        {markers.map((marker, index) => (
          <MapMarker
            key={`marker-${index}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => {
              //console.log(index);
              func(marker);
            }}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
        {/* <MapMarker position={{ lat: lat, lng: lng }}>
        </MapMarker> */}
      </Map>
    </div>
  );
}

export default Kakaomap;
