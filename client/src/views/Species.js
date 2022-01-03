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
import Navs from "./MySections/NavbarsSection";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/components.js";
import { PaginationItem } from "@mui/material";

const useStyles = makeStyles(styles);

function Species(props) {
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
    // 목록 가져오기
    await axios
      .get("http://10.10.10.168:3001/species", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const columns = [
    { field: "classification", headerName: "분류군", width: 200 },
    { field: "grade", headerName: "멸종위기 등급", width: 200 },
    { field: "name", headerName: "이름", width: 200 },
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
        {...rest}
      />
      <div className={classes.container}>
        <div style={{ height: 740, width: "100%" }}>
          <DataGrid
            rows={rows}
            getRowId={(row) => row.name}
            columns={columns}
            pageSize={12}
            disableColumnMenu
            hideFooterSelectedRowCount
            components={{ Pagination: CustomPagination }}
            headerHeight={50}
            rowsPerPageOptions={[12]}
            // checkboxSelection
          />
        </div>
        {/* <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={4}>
          
          </GridItem>
        </GridContainer> */}
      </div>
      <Footer />
    </div>
  );
}

export default Species;
