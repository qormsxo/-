import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import { Pagination, PaginationItem, Stack } from "@mui/material";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import axios from "axios";
import { DataGrid, useGridApiContext, useGridState } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0); //처음 페이지는 0
  const [sortModel, setSortModel] = useState([
    { field: "report_id", sort: "desc" },
  ]);
  const nav = useNavigate();
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
          getReport(page, sortModel, response.data.user_id);
        } else {
          setIsLoggedIn(false);
          nav("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const rowClick = (e) => {
    console.log(e);

    nav("/report-details" + e.row.report_id);
  };
  const getReport = async (page, newModel, user_id) => {
    //console.log(page);
    //목록 가져오기
    let params = {
      page: page,
      user_id: !user_id ? userObj.user_id : user_id,
    };
    if (newModel) {
      Object.assign(params, newModel[0]);
    }
    await axios
      .get("http://10.10.10.168:3001/report", {
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
  const columns = [
    {
      field: "report_id",
      hide: true,
    },
    {
      field: "report_num",
      headerName: "번호",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 1,
    },
    {
      field: "report_date_discovery",
      headerName: "발견일",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 2,
    },
    {
      field: "writer",
      headerName: "제보자",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 2,
    },
    {
      field: "report_title",
      headerName: "위치",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
      flex: 4,
    },
    {
      field: "report_date",
      headerName: "제보일",
      headerAlign: "center",
      headerClassName: "th",
      cellClassName: "MuiDataGrid-cell--textCenter",
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
    <div>
      <Header
        brand="멸종위기 야생생물 포털"
        rightLinks={<HeaderLinks isLoggedIn={isLoggedIn} userObj={userObj} />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justifyContent="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  {/* <div>
                    <img src={profile} alt="..." className={imageClasses} />
                  </div> */}
                  <div className={classes.name} style={{ marginTop: "30px" }}>
                    <h3 className={classes.title}>{userObj.user_name} </h3>
                    <h5>{userObj.user_id}</h5>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <h4>
                <b>{userObj.user_phone}</b>
              </h4>
              <Link to="/profile-update">
                <Button color="info">프로필 수정</Button>
              </Link>
            </div>
            <div className={classes.container} style={{ padding: "20px 0" }}>
              <div style={{ height: 650, width: "100%" }}>
                <DataGrid
                  sx={{
                    "& .th": {
                      backgroundColor: "#D8D8D8",
                    },
                  }}
                  rows={rows}
                  getRowId={(row) => row.report_id}
                  columns={columns}
                  pageSize={10}
                  rowCount={rowCount}
                  paginationMode="server"
                  rowsPerPageOptions={[10]}
                  onPageChange={(newPage) => {
                    //console.log(newPage);
                    setPage(newPage);
                    getReport(newPage, sortModel);
                  }}
                  sortingMode="server"
                  sortingOrder={["desc", "asc"]}
                  onSortModelChange={(newModel) => {
                    getReport(page, newModel);
                    setSortModel(newModel);
                  }}
                  onCellDoubleClick={rowClick}
                  disableColumnMenu // 컬럼 메뉴 비활성화
                  components={{
                    Pagination: CustomPagination,
                    NoRowsOverlay: () => (
                      <Stack
                        height="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        아직 제보를 하지 않았습니다.
                      </Stack>
                    ),
                  }}
                  headerHeight={50} // th 크기
                  // checkboxSelection
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
