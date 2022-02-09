// nodejs library that concatenates classes
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import styles from "assets/jss/material-kit-react/views/components.js";
import Info from "components/Typography/Info";
import { Grid } from "@material-ui/core";
import ReportBarChart from "./ReportBarChart";
import {
  Autocomplete,
  createFilterOptions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Button from "components/CustomButtons/Button.js";
import ReportMap from "./ReportMapChart";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(styles);
const filter = createFilterOptions();

function ReportStatus(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});

  const [barData, setBarData] = useState([]); // 바차트 데이터
  const [mapData, setMapData] = useState([]); // 지도 데이터

  const [select, setSelect] = useState("all"); // 종 선택
  const [classification, setClass] = useState([]); // 종 리스트
  const [species, setSpecies] = useState([]); // 종류별 생물이름 리스트  (생물종 셀렉트 값에 따라 바뀜)
  const [keyword, setKeyword] = useState(""); // 이름 검색어

  const [isAdmin, setIsAdmin] = useState(false);
  // 세션 가져오기
  const getSession = async () => {
    await axios
      .get("http://10.10.10.168:3001/session", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        if (response.data) {
          setIsLoggedIn(true);
          if (response.data.is_admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setUserObj(response.data);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getSession();
    // 목록 가져오기
    getStatus(null, "");
    getClass();
    getMapStatus(null, "");
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelect(value, getSpecies(value)); // 셀렉트 input 값 변경
    setKeyword("");
    getStatus(value, "");
    getMapStatus(value, "");
  };

  const kewordChange = (e) => {
    const {
      target: { value },
    } = e;
    setKeyword(value);
  };

  // 차트
  const getStatus = async (selectParam, keywordParam) => {
    await axios
      .get("http://10.10.10.168:3001/report-status", {
        params: {
          select: selectParam ? selectParam : select,
          keyword: keywordParam,
        },
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        if (response.data) {
          setBarData(response.data);
        } else {
          console.error("ddd");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /// 지도 통계
  const getMapStatus = async (selectParam, keywordParam) => {
    await axios
      .get("http://10.10.10.168:3001/report-mapstatus", {
        params: {
          select: selectParam ? selectParam : select,
          keyword: keywordParam,
        },
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        if (response.data) {
          setMapData(response.data);
        } else {
          console.error("ddd");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getClass = async () => {
    await axios
      .get("http://10.10.10.168:3001/class", {
        withCredentials: true,
      })
      .then((response) => {
        setClass(response.data);
      });
  };

  const getSpecies = async (classification) => {
    await axios
      .get("http://10.10.10.168:3001/class-spcs", {
        withCredentials: true,
        params: {
          classification: classification,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSpecies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const nav = useNavigate();
  const rowClick = (id) => {
    if (isAdmin) {
      nav("/report-details/admin" + id);
    } else {
      nav("/report-details" + id);
    }
  };

  return (
    <div style={{ background: "white" }}>
      <Header
        brand="멸종위기 야생생물 포털"
        rightLinks={<HeaderLinks isLoggedIn={isLoggedIn} userObj={userObj} />}
        color="info"
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        {...rest}
      />
      <Parallax
        image={require("assets/img/bg3.jpg")}
        style={{ height: "40vh" }}
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h3 className={classes.subtitle}>제보현황</h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container} style={{ padding: "70px 0" }}>
          <Info
            children={
              <h3>
                <GppMaybeIcon /> &nbsp; 제보현황
              </h3>
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              <FormControl
                variant="standard"
                fullWidth
                sx={{ m: 1, minWidth: 120 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  분류군
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={select}
                  onChange={handleChange}
                  label="분류군"
                >
                  <MenuItem value="all" selected>
                    <em>전체</em>
                  </MenuItem>
                  {classification.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <h5
                style={{
                  marginTop: "30px",
                  float: "right",
                }}
              >
                이름검색
              </h5>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                value={keyword}
                selectOnFocus
                clearOnBlur
                options={species}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  if (!newValue) {
                    setKeyword("");
                  } else {
                    setKeyword(newValue.name);
                  }
                }}
                name="spcs"
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.name;
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  // const { inputValue } = params;
                  return filtered;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="선택"
                    onChange={kewordChange}
                    style={{ bottom: "-10px" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                style={{ width: "100%", marginTop: "20px", height: "60%" }}
                onClick={() => {
                  getStatus(select, keyword);
                  getMapStatus(select, keyword);
                }}
              >
                검색
              </Button>
            </Grid>

            <Grid item xs={12}>
              <ReportMap infos={mapData} func={rowClick} />
            </Grid>
            <Grid item xs={12}>
              <ReportBarChart data={barData} />
            </Grid>
          </Grid>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ReportStatus;
