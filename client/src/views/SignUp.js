import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import KeyIcon from "@mui/icons-material/Key";
import People from "@material-ui/icons/People";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";

//import TextField from "@mui/material/TextField";
import { TextField } from "@material-ui/core";
import LockIcon from "@mui/icons-material/Lock";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

import image from "assets/img/bg7.jpg";
import styles from "assets/jss/material-kit-react/views/loginPage.js";

import modalStyles from "assets/jss/material-kit-react/modalStyle";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
// import Slide from "@material-ui/core/Slide";

import Close from "@material-ui/icons/Close";
import { Link, useNavigate } from "react-router-dom";

import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";

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

export default function SignUp(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);

  const nav = useNavigate();
  useEffect(async () => {
    await axios
      .get("http://10.10.10.168:3001/session", {
        "Content-type": "application/json",
        Accept: "application/json",
        Cache: "no-cache",
        withCredentials: true,
      })
      .then((response) => {
        if (response.data !== "") {
          nav("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [classicModal, setClassicModal] = useState(false); // 모달

  // input state
  const [inputs, setInputs] = useState({
    name: "",
    userId: "",
    phone: "",
    pass: "",
  });

  const { name, userId, phone, pass } = inputs;

  // helperText State
  const [helperText, setHelperText] = useState({
    nameHepler: " ",
    userIdHelper: " ",
    phoneHelper: " ",
    passHepler: " ",
  });

  const { nameHepler, userIdHelper, phoneHelper, passHepler } = helperText;

  // input error state
  const [boolean, setBoolean] = useState({
    nameError: false,
    userIdError: false,
    phoneError: false,
    passError: false,
  });

  const { nameError, userIdError, phoneError, passError } = boolean;

  //  널 체크 후 텍스트 입력 시 원상복구
  const validation = (id, boolean, value) => {
    if (id && boolean && value) {
      return true;
    } else {
      //console.log(id, boolean, value);
      return false;
    }
  };

  // input onChange
  const onChange = (e) => {
    const { name, value } = e.target;
    //console.log(e);

    let userName = validation(name === "name", nameError, value);
    let userId = validation(name === "userId", userIdError, value);
    let phone = validation(name === "phone", phoneError, value);
    let pass = validation(name === "pass", passError, value);

    setBoolean({
      nameError: userName ? false : nameError,
      userIdError: userId ? false : userIdError,
      phoneError: phone ? false : phoneError,
      passError: pass ? false : passError,
    });

    setHelperText({
      nameHepler: userName ? " " : nameHepler,
      userIdHelper: userId ? " " : userIdHelper,
      phoneHelper: phone ? " " : phoneHelper,
      passHepler: pass ? " " : passHepler,
    });

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  // 널체크 및 요청 보내기
  const isNull = () => {
    let nameCheck = !name.trim();
    let userIdCheck = !userId.trim();
    let phoneCheck = !phone;
    let passCheck = !pass.trim();

    setBoolean({
      nameError: nameCheck ? true : false,
      userIdError: userIdCheck ? true : false,
      phoneError: phoneCheck ? true : false,
      passError: passCheck ? true : false,
    });

    setHelperText({
      nameHepler: nameCheck ? "이름을 입력해주세요" : nameHepler,
      userIdHelper: userIdCheck ? "아이디를 입력해주세요" : userIdHelper,
      phoneHelper: phoneCheck ? "전화번호를 입력해주세요" : phoneHelper,
      passHepler: passCheck ? "비밀번호를 입력해주세요" : passHepler,
    });
    const createUser = async () => {
      await axios
        .post("http://10.10.10.168:3001/user", {
          name: name,
          id: userId,
          phone: phone,
          password: pass,
        })
        .then((response) => {
          if (response.data.status) {
            console.log("성공");
            setClassicModal(true);
            // 이메일 중복일때
          } else if (!response.data.status) {
            setBoolean({
              nameError,
              userIdError: true,
              phoneError,
              passError,
            });
            setHelperText({
              nameHepler,
              userIdHelper: response.data.message,
              phoneError,
              passHepler,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    if (name && userId && pass && phone) {
      createUser();
    }
  };

  //   const [name, setName] = useState("");
  //   const [userId, setuserId] = useState("");
  //   const [pw, setPw] = useState("");

  const classes = useStyles();
  const modalClasses = modalStyle();
  const { ...rest } = props;
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="멸종위기 야생생물 포털"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="success" className={classes.cardHeader}>
                    <h3>회원가입</h3>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
                    <TextField
                      fullWidth
                      helperText={nameHepler}
                      variant="standard"
                      label="Name..."
                      name="name"
                      error={nameError}
                      InputProps={{
                        type: "text",
                        onChange: (e) => onChange(e),
                        value: name,
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />

                    <TextField
                      fullWidth
                      helperText={userIdHelper}
                      variant="standard"
                      label="ID..."
                      name="userId"
                      error={userIdError}
                      InputProps={{
                        type: "text",
                        onChange: (e) => onChange(e),
                        value: userId,
                        endAdornment: (
                          <InputAdornment position="end">
                            <KeyIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />
                    <TextField
                      fullWidth
                      helperText={phoneHelper}
                      variant="standard"
                      label="Phone..."
                      name="phone"
                      error={phoneError}
                      value={phone}
                      onChange={onChange}
                      inputProps={{ maxLength: 13 }}
                      InputProps={{
                        inputComponent: phoneMask,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneEnabledIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      helperText={passHepler}
                      variant="standard"
                      label="Password"
                      name="pass"
                      error={passError}
                      InputProps={{
                        type: "password",
                        onChange: (e) => onChange(e),
                        value: pass,
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="success"
                      size="lg"
                      onClick={() => {
                        isNull();
                      }}
                    >
                      가입
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>

      {/* ##########################성공모달############################ */}
      <Dialog
        classes={{
          root: classes.center,
          paper: modalClasses.modal,
        }}
        maxWidth="xs"
        fullWidth={true}
        open={classicModal}
        // TransitionComponent={Transition}
        keepMounted
        ///onClose={() => setClassicModal(false)}
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
          <h3 className={modalClasses.modalTitle}>회원가입</h3>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={modalClasses.modalBody}
        >
          <p>회원가입 되었습니다.</p>
        </DialogContent>
        <DialogActions className={modalClasses.modalFooter}>
          <Link to="/log-in">
            <Button
              color="success"
              simple
              onClick={() => setClassicModal(false)}
            >
              확인
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
