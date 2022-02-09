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
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer";
import Grid from "@mui/material/Grid";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import Info from "components/Typography/Info";
import { AddComment, Close } from "@material-ui/icons";
import { OutlinedInput, TextField } from "@material-ui/core";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useNavigate } from "react-router-dom";
import Kakaomap from "../Map";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import modalStyles from "assets/jss/material-kit-react/modalStyle";
const useStyles = makeStyles(styles);
const modalStyle = makeStyles(modalStyles);

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

function DoReport(props) {
  const classes = useStyles();
  const nav = useNavigate();
  const modalClasses = modalStyle();
  const { ...rest } = props;
  const [classicModal, setClassicModal] = useState(false); // 모달
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});

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
          setUserObj(response.data);
          if (response.data.is_admin) {
            nav(-1);
          }
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
  }, []);
  // 지도 관련
  const [searchKeyword, setSearchKeyword] = useState(""); // 지도 검색 인풋
  const keywordChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const [Place, setPlace] = useState(""); //
  const search = () => {
    // 검색
    //console.log(Place);
    setPlace(searchKeyword);
  };
  // 위도 경도
  const [coordinates, setCoordinates] = useState({
    position: {
      lat: "",
      lng: "",
    },
    content: "",
  });

  const [address, setAddress] = useState(""); //검색된 주소

  const setMarkers = (markers) => {
    //console.log(markers);
    if (markers.content) {
      setAddress(markers.content);
    } else {
      setAddress(markers.address);
    }
    setCoordinates(markers);
  };

  //////////////////////////////////////////////
  const [foundDate, setFoundDate] = useState(null);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    foundLocation: "",
    content: "",
    pass: "",
  });

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

  const report = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      if (values.name.trim() === "") {
        alert("이름을 입력해주세요");
        return;
      } else if (values.phone.trim() === "" || values.phone.length < 13) {
        alert("연락처를 입력해주세요");
        return;
      } else if (values.pass.trim() === "" || values.pass.trim().length < 4) {
        alert("비밀번호는 4자리 이상으로 입력해주세요");
        return;
      }
    }
    let foundDateFormat = dayjs(foundDate).format("YYYY-MM-DD");
    //console.log(foundDateFormat);
    if (foundDateFormat.trim() === "" || foundDateFormat.length < 10) {
      alert("발견날짜를 입력해주세요");
      return;
    } else if (values.foundLocation.trim() === "") {
      alert("발견장소를 입력해주세요");
      return;
    } else if (values.content.trim() === "") {
      alert("내용을 입력해주세요");
      return;
    }
    const formData = new FormData(document.getElementsByName("reportForm")[0]); // form data 다넣기 multipart/form-data form 임

    if (coordinates.position.lat !== "" && coordinates.position.lng !== "") {
      // 위도경도 추가
      formData.append("lat", coordinates.position.lat);
      formData.append("lng", coordinates.position.lng);
    }
    //formData.append("uploadedFile", file);
    await axios
      .post("http://10.10.10.168:3001/report", formData, {
        withCredentials: true,
      })
      .then((response) => {
        alert("등록되었습니다.");
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
                <AddComment /> 제보하기
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
            {isLoggedIn ? null : (
              <div>
                <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
                <br></br>
                <Grid container spacing={2}>
                  <Grid item xs={1}>
                    <h5 style={{ textAlign: "center" }}>발견자</h5>
                  </Grid>
                  <Grid item xs={5}>
                    <OutlinedInput
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
            )}

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
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    name="foundLocation"
                    readOnly
                    value={values.foundLocation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    color="info"
                    style={{ width: "100%" }}
                    onClick={() => setClassicModal(true)}
                  >
                    검색
                  </Button>
                </Grid>
                {/* <Grid item xs={2}></Grid> */}
                <Grid item xs={1}>
                  <h5 style={{ textAlign: "center" }}>내용</h5>
                </Grid>
                <Grid item xs={11}>
                  <OutlinedInput
                    fullWidth
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    multiline
                    rows={8}
                  />
                </Grid>
                <Grid item xs={1}>
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
                </Grid>
                {isLoggedIn ? null : (
                  <>
                    <Grid item xs={1}>
                      <h5 style={{ textAlign: "center" }}> 비밀번호</h5>
                    </Grid>
                    <Grid item xs={4}>
                      <OutlinedInput
                        fullWidth
                        type="password"
                        name="pass"
                        value={values.pass}
                        onChange={handleChange}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={10}></Grid>

                <Grid item xs={2}>
                  <Button
                    color="success"
                    style={{ width: "100%" }}
                    type="submit"
                  >
                    제보하기
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        </div>

        <Footer />
      </div>
      {/* ##########################지도############################ */}
      <Dialog
        classes={{
          root: classes.center,
          paper: modalClasses.modal,
        }}
        maxWidth="lg"
        fullWidth={true}
        open={classicModal}
        // TransitionComponent={Transition}
        keepMounted
        //onClose={() => setClassicModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={modalClasses.modalHeader}
        >
          <IconButton
            className={modalClasses.modalCloseButton}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => setClassicModal(false)}
          >
            <Close className={modalClasses.modalClose} />
          </IconButton>
          <h3 className={modalClasses.modalTitle}>지도 검색</h3>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={modalClasses.modalBody}
        >
          {/* -------------------------------------------- */}
          <div>
            <OutlinedInput
              style={{ width: "30%" }}
              name="keyword"
              onChange={keywordChange}
              value={searchKeyword || ""}
            />

            <Button onClick={search}>검색</Button>
            <OutlinedInput
              fullWidth
              name="location"
              readOnly
              value={address || ""}
            />
          </div>
          {/* -------------------------------------------- */}
          <Kakaomap searchPlace={Place} func={setMarkers} />
        </DialogContent>
        <DialogActions className={modalClasses.modalFooter}>
          <Button
            color="info"
            onClick={() => {
              setValues({
                ...values,
                foundLocation: address,
              });
              setClassicModal(false);
              setAddress("");
              setSearchKeyword("");
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DoReport;
