// nodejs library that concatenates classes
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
// import { Link } from "react-router-dom";
import { DataGrid, useGridApiContext, useGridState } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Pagination from "@mui/material/Pagination";
import Footer from "components/Footer/Footer";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";

import styles from "assets/jss/material-kit-react/views/components.js";
import {
  FormControl,
  InputLabel,
  MenuItem,
  PaginationItem,
  TextField,
} from "@mui/material";
import Info from "components/Typography/Info";
import { Grid } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import Select from "@mui/material/Select";

const useStyles = makeStyles(styles);

function Species(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0); //처음 페이지는 0
  const [keyword, setKeyword] = useState("");
  const [sortModel, setSortModel] = useState([
    { field: "spcs_num", sort: "asc" },
  ]);
  useEffect(async () => {
    await axios
      .get("http://10.10.10.168:3001/session", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        if (response.data) {
          setIsLoggedIn(true);
          setUserObj(response.data);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    getClass();
    getSpecies(page);
    // 목록 가져오기
  }, []);

  const onChange = (e) => {
    let value = e.target.value;
    setKeyword(value);
  };
  //////////////////////////////////////////////////////
  const [select, setSelect] = useState("");
  const [classification, setClass] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelect(value, getSpecies(page, null, value));
  };
  /////////////////////////////////////////////////////////
  const getSpecies = async (page, newModel, selectVal) => {
    let params = {
      page: page,
      keyword: keyword,
      select: selectVal ? selectVal : select,
    };
    if (newModel) {
      Object.assign(params, newModel[0]);
    } else {
      Object.assign(params, sortModel[0]);
    }
    //console.log(params);
    await axios
      .get("http://10.10.10.168:3001/species", {
        withCredentials: true,
        params: params,
      })
      .then((response) => {
        //console.log(response.data);
        setRowCount(response.data.count);
        setRows(response.data.rows);
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

  const columns = [
    {
      field: "classification",
      headerName: "분류군",
      headerAlign: "center",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 2,
    },
    {
      field: "grade",
      headerName: "멸종위기 등급",
      headerAlign: "center",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 1,
    },
    {
      field: "name",
      headerName: "이름",
      headerAlign: "center",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 3,
    },
    {
      field: "scientific",
      headerName: "학명",
      headerAlign: "center",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 4,
    },
  ];
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);

    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        page={state.pagination.page + 1}
        count={state.pagination.pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }
  const rowClick = (e) => {
    console.log(e);
    window.open(
      "https://www.nie.re.kr/endangered_species/home/enspc/enspc06002i.do?sch_keyword=" +
        e.id
    );
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
                <h3 className={classes.subtitle}>멸종위기종</h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container} style={{ padding: "70px 0" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Info
                children={
                  <h3>
                    <GppMaybeIcon /> &nbsp; 멸종위기종
                  </h3>
                }
              />
            </Grid>
            <Grid item xs={9}></Grid>
            <Grid item xs={5}></Grid>
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
            <Grid item xs={3}>
              <TextField
                style={{ bottom: "-25px" }}
                fullWidth
                variant="standard"
                value={keyword}
                name="keyword"
                onChange={onChange}
                inputProps={{ maxLength: 20 }}
                //style={{ float: "right" }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                style={{ width: "100%", marginTop: "20px", height: "60%" }}
                onClick={() => getSpecies(page)}
              >
                검색
              </Button>
            </Grid>
          </Grid>

          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={rows}
              getRowId={(row) => row.name}
              columns={columns}
              pageSize={10}
              rowCount={rowCount}
              paginationMode="server"
              rowsPerPageOptions={[10]}
              onPageChange={(newPage) => {
                //console.log(newPage);
                setPage(newPage);
                getSpecies(newPage, sortModel);
              }}
              sortingMode="server"
              sortingOrder={["desc", "asc"]}
              onSortModelChange={(newModel) => {
                getSpecies(page, newModel);
                setSortModel(newModel);
              }}
              components={{ Pagination: CustomPagination }}
              headerHeight={50}
              rowsPerPageOptions={[12]}
              onCellClick={rowClick}
              disableColumnMenu
              // checkboxSelection
            />
          </div>
          {/* <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={4}>
          
          </GridItem>
        </GridContainer> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Species;
