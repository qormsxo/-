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
import { AddComment, Close } from "@material-ui/icons";
import { OutlinedInput, TextField } from "@material-ui/core";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useNavigate, useParams } from "react-router-dom";
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

function ReportDetail(props) {
  const classes = useStyles();
  const modalClasses = modalStyle();
  const { ...rest } = props;
  const { id } = useParams(); // 게시글 아이디
  const [classicModal, setClassicModal] = useState(false); // 모달
  const [deleteModal, setDeleteModal] = useState(false); // 모달
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [foundDate, setFoundDate] = useState(null); // 발견날짜
  const [isAnswer, setIsAnswer] = useState(false); // 답변 여부
  const [answerContent, setAnswerContent] = useState(""); // 답변 내용
  const [answerSpcs, setAnswerSpcs] = useState(""); // 답변 생물

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
  const [firstCoordinates, setFirstCoordinates] = useState({
    position: {
      lat: "",
      lng: "",
    },
    content: "",
  });
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
      //
      setAddress(markers.content);
    } else {
      setAddress(markers.address);
    }
    setCoordinates(markers);
  };

  //////////////////////////////////////////////

  //value
  const [values, setValues] = useState({
    name: "",
    phone: "",
    foundLocation: "",
    content: "",
  });

  //const [writerId, setWriterId] = useState("");
  const [btnHide, setBtnHide] = useState(true); // 수정삭제 버튼 하이드 true false

  const [imgurl, setImgurl] = useState(null); // 제보 이미지 url

  const [readOnly, setReadOnly] = useState(true); // readonly true false

  const [mode, setMode] = useState(""); // 비로그인 회원글의 수정, 삭제 구분

  const [file, setFile] = useState({
    file: "",
    filename: "",
  }); //파일

  const [beforeFileName, setBeforeFileName] = useState(""); // 파일 수정했는지 확인용도
  const [writerId, setWriterId] = useState(null); // 제보글이 비로그인으로 작성된 글인지 확인용도

  const [passInput, setPassInput] = useState(false); // 비밀번호
  const [password, setPassword] = useState(""); // 비밀번호

  // 수정또는 삭제를 눌렀을때
  const isReportLoggedIn = (boolean, func) => {
    if (writerId) {
      // 가입한사람이 쓴 제보글일때는 그냥 실행
      func(boolean);
    } else {
      setPassInput(true); // 아닐 시 비밀번호 체크
    }
  };
  // 비밀번호 체크
  const passwordCheck = () => {
    if (password === document.getElementById("password").value) {
      if (mode === "modify") {
        setPassInput(false, setReadOnly(false));
      } else if (mode === "delete") {
        deleteReport();
      } else {
        alert("에러");
        setPassInput(false);
      }
    } else {
      alert("비밀번호가 맞지 않습니다.");
      setPassInput(false);
    }
  };

  const fileChange = (event) => {
    const value = event.target.value;
    const extension = value.split(".").pop().toLowerCase();
    if (extension === "png" || extension === "jpg" || extension === "jpeg") {
      setFile({
        file: value,
        filename: value.substring(12),
      });
    } else {
      alert("사진을 넣어주세요");
    }
  };

  const resetFile = () => {
    // 파일 지우기
    setFile({ file: "", filename: "" });
  };
  const getReport = async (isLoggedIn, userObj) => {
    await axios
      .get("http://10.10.10.168:3001/reportdetail", {
        params: {
          id: id,
        },
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        var data = response.data;
        if (data.report_writer_id) {
          setWriterId(data.report_writer_id);
          // 글의 작성자아이디와 로그인한사람의 userId 가 같으면
          if (isLoggedIn && data.report_writer_id === userObj.user_id) {
            setBtnHide(false);
          } else {
            setBtnHide(true);
          }
          // 가져온 데이터로 세팅
          setValues({
            name: data.user_name,
            phone: data.user_phone,
            foundLocation: data.report_title,
            content: data.report_content,
          });
        } else {
          setBtnHide(false);
          setPassword(data.report_password);
          setValues({
            name: data.report_name,
            phone: data.report_writer_phone,
            foundLocation: data.report_title,
            content: data.report_content,
          });
        }

        setFoundDate(new Date(data.report_date_discovery)); //발견날짜 세팅
        // 이미지url 이 있으면 세팅
        if (data.report_img) {
          var filename = data.report_img.substring(
            data.report_img.indexOf("_") + 1
          );
          //console.log("?????");
          setBeforeFileName(filename);
          setFile({
            file: "",
            filename: filename,
          });
          setImgurl(data.imgurl);
        }
        // 위도 경도 정보가 있으면 세팅
        if (data.report_lat && data.report_lng) {
          let temp = {
            position: {
              lat: Number(data.report_lat),
              lng: Number(data.report_lng),
            },
            content: data.report_title,
          };

          setFirstCoordinates(temp);
          setAddress(data.report_title);
        }
        setIsAnswer(data.report_check);
        if (data.report_check) {
          setAnswerContent(data.answer_content);
          setAnswerSpcs(data.spcs_name);
        }
      });
  };

  useEffect(() => {
    async function getSession() {
      await axios
        .get("http://10.10.10.168:3001/session", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            setIsLoggedIn(true);
            setUserObj(response.data);
            getReport(true, response.data);
          } else {
            setIsLoggedIn(false);
            getReport(false, null);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    getSession();
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const nav = useNavigate();
  const updateReport = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      if (values.name.trim() === "") {
        return;
      } else if (values.phone.trim() === "") {
        return;
      }
    }
    let foundDateFormat = dayjs(foundDate).format("YYYY-MM-DD");
    //console.log(foundDateFormat);
    if (
      foundDateFormat.trim() === "" &&
      values.foundLocation.trim() === "" &&
      values.content.trim() === ""
    ) {
      return;
    }
    const formData = new FormData(document.getElementsByName("reportForm")[0]); // form data 다넣기 multipart/form-data form 임
    if (beforeFileName !== "" && beforeFileName !== file.filename) {
      // 있던 첨부 파일을 첨부파일을 수정함
      //console.log(beforeFileName, file.file , )
      formData.append("fileModify", true);
      formData.append("beforeImgName", imgurl.split("uploads/")[1]);
    } else if (file.file !== "" && beforeFileName === "") {
      // 없다가 생김
      formData.append("fileModify", true);
    } else {
      formData.append("fileModify", false);
    }

    if (coordinates.position.lat !== "" && coordinates.position.lng !== "") {
      // 위도경도 추가
      formData.append("lat", coordinates.position.lat);
      formData.append("lng", coordinates.position.lng);
    }

    await axios
      .put("http://10.10.10.168:3001/report", formData, {
        withCredentials: true,
      })
      .then((response) => {
        alert("수정되었습니다.");
        nav(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteReport = async () => {
    //console.log(imgurl);
    await axios
      .delete(
        "http://10.10.10.168:3001/report",

        {
          data: {
            id: id,
            filename: imgurl ? imgurl.split("uploads/")[1] : null,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        alert("삭제되었습니다.");
        nav(-1);
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
            onSubmit={updateReport}
          >
            <input type={"hidden"} value={id} name="id" />
            {readOnly ? (
              <div>
                <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
                <br></br>
                <Grid container spacing={2}>
                  <Grid item xs={1}>
                    <h5 style={{ textAlign: "center" }}>발견자</h5>
                  </Grid>
                  <Grid item xs={5}>
                    <OutlinedInput
                      readOnly={readOnly}
                      fullWidth
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div>
                {writerId ? null : ( // 비로그인 인지 아닌지
                  <>
                    <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
                    <br></br>
                    <Grid container spacing={2}>
                      <Grid item xs={1}>
                        <h5 style={{ textAlign: "center" }}>발견자</h5>
                      </Grid>
                      <Grid item xs={5}>
                        <OutlinedInput
                          readOnly={readOnly}
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
                          readOnly={readOnly}
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
                  </>
                )}
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
                      readOnly={readOnly}
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
                    readOnly
                    fullWidth
                    name="foundLocation"
                    value={values.foundLocation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    disabled={readOnly}
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
                    readOnly={readOnly}
                    fullWidth
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    multiline
                    rows={8}
                  />
                </Grid>
                {passInput ? (
                  <>
                    <Grid item xs={1}>
                      <h5 style={{ textAlign: "center" }}>비밀번호</h5>
                    </Grid>
                    <Grid item xs={5}>
                      <OutlinedInput
                        fullWidth
                        id="password"
                        type="password"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="info"
                        style={{ width: "100%" }}
                        onClick={passwordCheck}
                      >
                        확인
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="danger"
                        style={{ width: "100%" }}
                        onClick={() => setPassInput(false)}
                      >
                        취소
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    {readOnly ? (
                      <>
                        <Grid item xs={1}>
                          <h5 style={{ textAlign: "center" }}>첨부파일</h5>
                        </Grid>
                        <Grid item xs={11}>
                          <img
                            src={imgurl}
                            width={"100%"}
                            height={"100%"}
                            alt=""
                          />
                        </Grid>

                        {btnHide ? null : (
                          <>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={2}>
                              <Button
                                color="info"
                                onClick={() =>
                                  isReportLoggedIn(
                                    false,
                                    setReadOnly,
                                    setMode("modify")
                                  )
                                }
                                style={{ width: "100%" }}
                              >
                                수정하기
                              </Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button
                                color="danger"
                                style={{ width: "100%" }}
                                onClick={() => {
                                  setDeleteModal(true);
                                }}
                              >
                                삭제하기
                              </Button>
                            </Grid>
                          </>
                        )}
                        {isAnswer ? (
                          <>
                            <Grid item xs={12}>
                              <hr></hr>
                            </Grid>
                            {answerSpcs ? (
                              <>
                                <Grid item xs={1}>
                                  <h5 style={{ textAlign: "left" }}>
                                    생물 종류
                                  </h5>
                                </Grid>
                                <Grid item xs={5}>
                                  <OutlinedInput
                                    fullWidth
                                    readOnly
                                    value={answerSpcs}
                                  />
                                </Grid>
                                <Grid item xs={6} />
                              </>
                            ) : null}

                            <Grid item xs={2}>
                              <h5 style={{ textAlign: "left" }}>관리자 답변</h5>
                            </Grid>
                            <Grid item xs={10} />
                            <Grid item xs={12}>
                              <OutlinedInput
                                readOnly
                                value={answerContent}
                                fullWidth
                                name="content"
                                multiline
                                rows={8}
                              />
                            </Grid>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Grid item xs={1}>
                          <h5 style={{ textAlign: "center" }}> 첨부파일</h5>

                          <input
                            type="file"
                            hidden
                            value={file.file}
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
                            value={file.filename}
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

                        <Grid item xs={5}></Grid>
                        <Grid item xs={8}></Grid>

                        <Grid item xs={2}>
                          <Button
                            color="success"
                            style={{ width: "100%" }}
                            type="submit"
                          >
                            저장
                          </Button>
                        </Grid>

                        <Grid item xs={2}>
                          <Button
                            color="danger"
                            onClick={() => setReadOnly(true)}
                            style={{ width: "100%" }}
                          >
                            취소
                          </Button>
                        </Grid>
                      </>
                    )}
                  </>
                )}
                {/* ---------------------첨부파일------------------- */}
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
          <Kakaomap
            searchPlace={Place}
            func={setMarkers}
            position={firstCoordinates.position.lat ? firstCoordinates : null}
          />
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

      {/* ##########################삭제 모달############################ */}
      <Dialog
        classes={{
          root: classes.center,
          paper: modalClasses.modal,
        }}
        maxWidth="sm"
        fullWidth={true}
        open={deleteModal}
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
            onClick={() => setDeleteModal(false)}
          >
            <Close className={modalClasses.modalClose} />
          </IconButton>
          <h3 className={modalClasses.modalTitle}>제보삭제</h3>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={modalClasses.modalBody}
        >
          {/* -------------------------------------------- */}
          <p>정말 삭제하시겠습니까?</p>
          {/* -------------------------------------------- */}
        </DialogContent>
        <DialogActions className={modalClasses.modalFooter}>
          <Button
            color="info"
            onClick={() => {
              if (writerId) {
                deleteReport();
              } else {
                isReportLoggedIn(false, setReadOnly, setMode("delete"));
                setDeleteModal(false);
              }
            }}
          >
            확인
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ReportDetail;
