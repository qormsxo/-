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
import Typography from "./MySections/TypographySection";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/components.js";
import { PaginationItem } from "@mui/material";

const useStyles = makeStyles(styles);

function Report(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});

  const [rows, setRows] = useState([]);
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
    getReport();
  }, []);
  const getReport = async () => {
    //목록 가져오기
    await axios
      .get("http://10.10.10.168:3001/report", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const columns = [
    {
      field: "report_id",
      headerName: "번호",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      //   width: 100,
      flex: 1,
    },
    {
      field: "report_date_discovery",
      headerName: "발견일",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      //   width: 100,
      flex: 2,
    },
    {
      field: "writer",
      headerName: "제보자",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      //   width: 200,
      flex: 2,
    },
    {
      field: "report_title",
      headerName: "제목",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      //   width: 538,
      flex: 4,
    },
    {
      field: "report_date",
      headerName: "제보일",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      //   width: 200,
      flex: 2,
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
      <Parallax image={require("assets/img/bg.jpg")} style={{ height: "30vh" }}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h3 className={classes.subtitle}>멸종위기 야생생물 발견제보</h3>
                {/* <h2 className={classes.title}>야생생물이 살아납니다!</h2> */}
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container} style={{ padding: "70px 0" }}>
          <Typography />
          <div style={{ height: 750, width: "100%" }}>
            <DataGrid
              sx={{
                "& .th": {
                  backgroundColor: "#D8D8D8",
                },
              }}
              rows={rows}
              getRowId={(row) => row.report_id}
              columns={columns}
              pageSize={12}
              rowsPerPageOptions={[12]}
              disableColumnMenu // 컬럼 메뉴 비활성화
              components={{ Pagination: CustomPagination }}
              headerHeight={50} // th 크기
              // checkboxSelection
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Report;
