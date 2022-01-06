// nodejs library that concatenates classes
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// import Pagination from "@mui/material/Pagination";
import Footer from "components/Footer/Footer";
import Grid from "@mui/material/Grid";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/components.js";
// import { PaginationItem } from "@mui/material";
import Info from "components/Typography/Info";
import { AddComment } from "@material-ui/icons";
import { OutlinedInput, TextField } from "@material-ui/core";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { useNavigate, useParams } from "react-router-dom";

const phoneMask = React.forwardRef(function phoneMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="###-####-####"
      definitions={{
        "#": /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => {
        onChange({ target: { name: props.name, value } });
      }}
      overwrite
    />
  );
});
phoneMask.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles(styles);

function ReportDetail(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [foundDate, setFoundDate] = useState(null);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    foundLocation: "",
    content: "",
  });
  const [imgurl, setImgurl] = useState("");
  const { id } = useParams();

  const getReport = async () => {
    await axios
      .get("http://10.10.10.168:3001/reportdetail", {
        params: {
          id: id,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        var data = response.data;
        if (data.report_writer_id) {
          setValues({
            name: data.user_name,
            phone: data.user_phone,
            foundLocation: data.report_title,
            content: data.report_content,
          });
        } else {
          setValues({
            name: data.report_name,
            phone: data.report_writer_phone,
            foundLocation: data.report_title,
            content: data.report_content,
          });
        }
        setFoundDate(new Date(data.report_date_discovery));
        if (data.report_img) {
          setImgurl(data.imgurl);
        }
      });
  };

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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [file, setFile] = useState(""); //파일

  const fileChange = (event) => {
    const value = event.target.value;
    const extension = value.split(".").pop().toLowerCase();
    if (extension === "png" || extension === "jpg" || extension === "jpeg") {
      setFile(value);
    } else {
      alert("사진을 넣어주세요");
    }
  };
  const resetFile = () => {
    // 파일 지우기
    setFile("");
  };

  const nav = useNavigate();

  const report = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      if (values.name.trim() === "") {
        return;
      } else if (values.phone.trim() === "") {
        return;
      }
    }
    let foundDateFormat = dayjs(foundDate).format("YYYY-MM-DD");
    console.log(foundDateFormat);
    if (
      foundDateFormat.trim() === "" &&
      values.foundLocation.trim() === "" &&
      values.content.trim() === ""
    ) {
      return;
    }
    // console.log();
    const formData = new FormData(document.getElementsByName("reportForm")[0]); // form data 다넣기 multipart/form-data form 임
    //formData.append("uploadedFile", file);
    await axios
      .post("http://10.10.10.168:3001/report", formData, {
        withCredentials: true,
      })
      .then((response) => {
        nav("/report");
      })
      .catch((error) => {
        console.error(error);
      });
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
        image={require("assets/img/sign.jpg")}
        style={{ height: "40vh" }}
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h3 className={classes.subtitle}>멸종위기 야생생물 발견제보</h3>
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
                <AddComment /> 제보
              </h3>
            }
          />
          <form
            name="reportForm"
            encType="multipart/form-data"
            // action="http://10.10.10.168:3001/report"
            // method="post"
            onSubmit={report}
          >
            <div>
              <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>발견자</h5>
                </Grid>
                <Grid item xs={5}>
                  <OutlinedInput
                    readOnly
                    fullWidth
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>연락처</h5>
                </Grid>
                <Grid item xs={5}>
                  <OutlinedInput
                    readOnly
                    fullWidth
                    variant="outlined"
                    name="phone"
                    inputComponent={phoneMask}
                    value={values.phone}
                    onChange={handleChange}
                    inputProps={{ maxLength: 13 }}
                  />
                </Grid>
              </Grid>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold" }}>발견정보</h3>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>발견일</h5>
                </Grid>
                <Grid item xs={5}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      readOnly
                      value={foundDate}
                      inputFormat={"yyyy-MM-dd"}
                      mask={"____-__-__"}
                      onChange={(value) => setFoundDate(value)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          name="foundDate"
                          variant="outlined"
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>발견장소</h5>
                </Grid>
                <Grid item xs={5}>
                  <OutlinedInput
                    readOnly
                    fullWidth
                    helpertext="Incorrect entry."
                    name="foundLocation"
                    value={values.foundLocation}
                    onChange={handleChange}
                  />
                </Grid>
                {/* <Grid item xs={2}></Grid> */}
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>내용</h5>
                </Grid>
                <Grid item xs={11}>
                  <OutlinedInput
                    readOnly
                    fullWidth
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    multiline
                    rows={15}
                  />
                </Grid>
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>첨부파일</h5>
                </Grid>
                <Grid item xs={11}>
                  <img src={imgurl} width={"100%"} />
                </Grid>

                {/* <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}> 첨부파일</h5>

                  <input
                    type="file"
                    hidden
                    value={file}
                    id="uploadedFile"
                    name="uploadedFile"
                    onChange={fileChange}
                  />
                </Grid>
                <Grid item xs={5}>
                  <OutlinedInput
                    fullWidth
                    onFocus={(e) => {
                      document.getElementById("uploadedFile").click();
                      e.target.blur();
                    }}
                    value={file.substring(12)}
                    inputprops={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    color="danger"
                    style={{ width: "100%" }}
                    onClick={resetFile}
                  >
                    취소
                  </Button>
                </Grid> */}
                {/*}
                <Grid item xs={5}></Grid>
                <Grid item xs={10}></Grid>

                <Grid item xs={2}>
                  <Button
                    color="success"
                    style={{ width: "100%" }}
                    type="submit"
                  >
                    제보하기
                  </Button>
                </Grid> */}
              </Grid>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ReportDetail;
