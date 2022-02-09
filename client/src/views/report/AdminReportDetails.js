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
import Grid from "@mui/material/Grid";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import Info from "components/Typography/Info";
import { AddComment, Close } from "@material-ui/icons";
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@material-ui/core";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import modalStyles from "assets/jss/material-kit-react/modalStyle";
import { Autocomplete, createFilterOptions } from "@mui/material";
const useStyles = makeStyles(styles);
const modalStyle = makeStyles(modalStyles);
const filter = createFilterOptions();
function AdminReportDetail(props) {
  const classes = useStyles();
  const modalClasses = modalStyle();
  const { ...rest } = props;
  const { id } = useParams(); // 게시글 아이디

  const [deleteModal, setDeleteModal] = useState(false); // 모달
  const [answerDeleteModal, setAnswerDeleteModal] = useState(false); // 모달
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [foundDate, setFoundDate] = useState(null);
  const [isAnswer, setIsAnswer] = useState(false);

  const [classification, setClass] = useState([]); // 생물종 셀렉트 option (한번 세팅하고 안바뀜) ex) 포유류 , 양서 파충류 , 어류
  const [selectClass, setSelectClass] = useState(""); // 관리자가 선택한  생물 종류 값

  const [species, setSpecies] = useState([]); // 종류별 생물이름 리스트  (생물종 셀렉트 값에 따라 바뀜)
  const [selectSpcs, setSelectSpcs] = useState({
    // 선택한 생물 번호와 이름
    spcs_num: 0,
    name: "",
  });

  const [answerContent, setAnswerContent] = useState("");
  const [update, setUpdate] = useState(false);

  //////////////////////////////////////////////
  const nav = useNavigate();

  //value
  const [values, setValues] = useState({
    name: "",
    phone: "",
    foundLocation: "",
    content: "",
  });

  const [imgurl, setImgurl] = useState(null); // 제보 이미지 url

  // const [writerId, setWriterId] = useState(null); // 제보글이 비로그인으로 작성된 글인지 확인용도

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
          //setWriterId(data.report_writer_id);
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

        setFoundDate(new Date(data.report_date_discovery)); //발견날짜 세팅
        // 이미지url 이 있으면 세팅
        if (data.report_img) {
          setImgurl(data.imgurl);
        }

        setIsAnswer(data.report_check);
        if (data.report_check) {
          setAnswerContent(data.answer_content);
          setSelectSpcs(
            data.spcs_num
              ? { spcs_num: data.spcs_num, name: data.spcs_name }
              : { ...selectSpcs }
          );
          setSelectClass(data.spcs_class ? data.spcs_class : "");
        }
      });
  };

  async function getSession() {
    await axios
      .get("http://10.10.10.168:3001/session", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setIsLoggedIn(true);
          if (response.data.is_admin === 0) {
            nav("/");
          }
          setUserObj(response.data);
          getReport(true, response.data);
        } else {
          nav("/");
          setIsLoggedIn(false);
          getReport(false, null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getSession();
    getClass();
  }, []);

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
        //console.log(response.data);
        setSpecies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const answer = async () => {
    if (answerContent.trim() === "") {
      alert("답변내용을 입력해주세요.");
      return;
    } else {
      await axios
        .post(
          "http://10.10.10.168:3001/answer",
          {
            id: id,
            spcs_num: selectSpcs.spcs_num,
            spcs_name: selectSpcs.name,
            spcs_class: selectClass,
            content: answerContent,
          },
          { withCredentials: true }
        )
        .then((response) => {
          alert("등록되었습니다.");
          nav(-1);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const updateAnswer = async () => {
    if (answerContent.trim() === "") {
      alert("답변내용을 입력해주세요.");
      return;
    } else {
      await axios
        .put(
          "http://10.10.10.168:3001/answer",
          {
            id: id,
            spcs_num: selectSpcs.spcs_num,
            spcs_name: selectSpcs.name,
            spcs_class: selectClass,
            content: answerContent,
          },
          { withCredentials: true }
        )
        .then((response) => {
          alert("수정되었습니다.");
          nav(0);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const deleteAnswer = async () => {
    await axios
      .delete(
        "http://10.10.10.168:3001/answer",

        {
          data: {
            id: id,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        alert("삭제되었습니다.");
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

  // 수정 세팅
  const answerUpdateSet = () => {
    setUpdate(true);
    if (selectClass !== "") getSpecies(selectClass);
  };
  //생물 삭제
  const resetSpcs = () => {
    setSelectSpcs({
      spcs_num: 0,
      name: "",
    });
    setSpecies([]);
    setSelectClass("");
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

          <input type={"hidden"} value={id} name="id" />

          <div>
            <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
            <br></br>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <h5 style={{ textAlign: "center" }}>발견자</h5>
              </Grid>
              <Grid item xs={5}>
                <OutlinedInput
                  readOnly={true}
                  fullWidth
                  name="name"
                  value={values.name}
                />
              </Grid>
            </Grid>
          </div>

          <div>
            <h3 style={{ fontWeight: "bold" }}>인적사항</h3>
            <br></br>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <h5 style={{ textAlign: "center" }}>발견자</h5>
              </Grid>
              <Grid item xs={5}>
                <OutlinedInput
                  readOnly={true}
                  fullWidth
                  name="name"
                  value={values.name}
                />
              </Grid>
              <Grid item xs={1}>
                <h5 style={{ textAlign: "center" }}>연락처</h5>
              </Grid>
              <Grid item xs={5}>
                <OutlinedInput
                  readOnly={true}
                  fullWidth
                  variant="outlined"
                  name="phone"
                  value={values.phone}
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
                    readOnly={true}
                    inputFormat={"yyyy-MM-dd"}
                    mask={"____-__-__"}
                    onChange={(value) => setFoundDate(value)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        value={foundDate}
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
                  readOnly={true}
                  fullWidth
                  name="foundLocation"
                  value={values.foundLocation}
                />
              </Grid>

              <Grid item xs={1}>
                <h5 style={{ textAlign: "center" }}>내용</h5>
              </Grid>
              <Grid item xs={11}>
                <OutlinedInput
                  readOnly={true}
                  fullWidth
                  name="content"
                  value={values.content}
                  multiline
                  rows={8}
                />
              </Grid>

              <Grid item xs={1}>
                <h5 style={{ textAlign: "center" }}>첨부파일</h5>
              </Grid>
              <Grid item xs={11}>
                <img src={imgurl} width={"100%"} height={"100%"} alt="" />
              </Grid>

              <Grid item xs={10}></Grid>
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

              {isAnswer ? (
                <>
                  {update ? (
                    <>
                      <Grid item xs={12}>
                        <hr></hr>
                      </Grid>
                      <Grid item xs={2}>
                        <h5 style={{ textAlign: "left" }}>생물 종류</h5>
                      </Grid>
                      <Grid item xs={10} />
                      <Grid item xs={2}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          sx={{ m: 1, minWidth: 120 }}
                        >
                          <Select
                            value={selectClass}
                            onChange={(e) => {
                              setSelectClass(
                                e.target.value,
                                getSpecies(e.target.value)
                              );
                            }}
                            displayEmpty
                            name="cls"
                          >
                            <MenuItem value="" selected>
                              선택
                            </MenuItem>
                            {classification.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <Autocomplete
                          value={selectSpcs}
                          selectOnFocus
                          clearOnBlur
                          options={species}
                          onChange={(event, newValue) => {
                            if (!newValue) {
                              setSelectSpcs({ spcs_num: 0, name: "" });
                            } else {
                              setSelectSpcs({
                                spcs_num: newValue.spcs_num,
                                name: newValue.name,
                              });
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
                              variant="outlined"
                              label="선택"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          color="info"
                          style={{ width: "100%" }}
                          onClick={resetSpcs}
                        >
                          초기화
                        </Button>
                      </Grid>
                      <Grid item xs={6} />
                      <Grid item xs={2}>
                        <h5 style={{ textAlign: "left" }}>관리자 답변</h5>
                      </Grid>
                      <Grid item xs={10} />
                      <Grid item xs={12}>
                        <OutlinedInput
                          fullWidth
                          name="content"
                          multiline
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          rows={8}
                        />
                      </Grid>
                      <Grid item xs={8}></Grid>
                      <Grid item xs={2}>
                        <Button
                          color="success"
                          style={{ width: "100%" }}
                          onClick={() => updateAnswer()}
                        >
                          저장
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          color="danger"
                          style={{ width: "100%" }}
                          onClick={() => setUpdate(false)}
                        >
                          취소
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    //일반
                    <>
                      <Grid item xs={12}>
                        <hr></hr>
                      </Grid>

                      {selectSpcs.name ? (
                        <>
                          {" "}
                          <Grid item xs={1}>
                            <h5 style={{ textAlign: "left" }}>생물 종류</h5>
                          </Grid>
                          <Grid item xs={5}>
                            <OutlinedInput
                              fullWidth
                              readOnly
                              value={selectSpcs.name}
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
                          readOnly={true}
                          fullWidth
                          value={answerContent}
                          name="content"
                          multiline
                          rows={8}
                        />
                      </Grid>
                      <Grid item xs={8}></Grid>

                      <Grid item xs={2}>
                        <Button
                          color="info"
                          style={{ width: "100%" }}
                          onClick={answerUpdateSet}
                        >
                          수정
                        </Button>
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          color="danger"
                          style={{ width: "100%" }}
                          onClick={() => setAnswerDeleteModal(true)}
                        >
                          삭제
                        </Button>
                      </Grid>
                    </>
                  )}
                </>
              ) : (
                // 작성
                <>
                  <Grid item xs={12}>
                    <hr></hr>
                  </Grid>
                  <Grid item xs={2}>
                    <h5 style={{ textAlign: "left" }}>생물 종류</h5>
                  </Grid>
                  <Grid item xs={10} />
                  <Grid item xs={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      sx={{ m: 1, minWidth: 120 }}
                    >
                      <Select
                        value={selectClass}
                        onChange={(e) => {
                          setSelectClass(
                            e.target.value,
                            getSpecies(e.target.value)
                          );
                        }}
                        displayEmpty
                        name="cls"
                      >
                        <MenuItem value="" selected>
                          선택
                        </MenuItem>
                        {classification.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      value={selectSpcs}
                      selectOnFocus
                      clearOnBlur
                      options={species}
                      onChange={(event, newValue) => {
                        if (!newValue) {
                          setSelectSpcs({ spcs_num: 0, name: "" });
                        } else {
                          setSelectSpcs({
                            spcs_num: newValue.spcs_num,
                            name: newValue.name,
                          });
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
                          variant="outlined"
                          label="선택"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <Button
                      color="info"
                      style={{ width: "100%" }}
                      onClick={resetSpcs}
                    >
                      초기화
                    </Button>
                  </Grid>
                  <Grid item xs={6} />
                  <Grid item xs={2}>
                    <h5 style={{ textAlign: "left" }}>관리자 답변</h5>
                  </Grid>
                  <Grid item xs={10} />
                  <Grid item xs={12}>
                    <OutlinedInput
                      fullWidth
                      name="content"
                      multiline
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      rows={8}
                    />
                  </Grid>
                  <Grid item xs={10}></Grid>
                  <Grid item xs={2}>
                    <Button
                      color="info"
                      style={{ width: "100%" }}
                      onClick={() => answer()}
                    >
                      답변
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </div>

        <Footer />
      </div>

      {/* ##########################제보 삭제 모달############################ */}
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
              deleteReport();
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

      {/* ##########################답변 삭제 모달############################ */}
      <Dialog
        classes={{
          root: classes.center,
          paper: modalClasses.modal,
        }}
        maxWidth="sm"
        fullWidth={true}
        open={answerDeleteModal}
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
            onClick={() => setAnswerDeleteModal(false)}
          >
            <Close className={modalClasses.modalClose} />
          </IconButton>
          <h3 className={modalClasses.modalTitle}>답변 삭제</h3>
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
              deleteAnswer();
            }}
          >
            확인
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setAnswerDeleteModal(false);
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminReportDetail;
