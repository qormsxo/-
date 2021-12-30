import React, { useState } from "react";
import axios from "axios";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";

import TextField from "@mui/material/TextField";
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
import { Link } from "react-router-dom";

const useStyles = makeStyles(styles);
const modalStyle = makeStyles(modalStyles);

export default function SignUp(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);

  const [classicModal, setClassicModal] = React.useState(false); // 모달

  // input state
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    pass: "",
  });

  const { name, email, pass } = inputs;

  // helperText State
  const [helperText, setHelperText] = useState({
    nameHepler: " ",
    emailHelper: " ",
    passHepler: " ",
  });

  const { nameHepler, emailHelper, passHepler } = helperText;

  // input error state
  const [boolean, setBoolean] = useState({
    nameError: false,
    emailError: false,
    passError: false,
  });

  const { nameError, emailError, passError } = boolean;

  //  널 체크 후 텍스트 입력 시 원상복구
  const validation = (id, boolean, value) => {
    if (id && boolean && value) {
      return true;
    } else {
      return false;
    }
  };

  // input onChange
  const onChange = (e) => {
    const { id, value } = e.target;

    let name = validation(id === "name", nameError, value);
    let email = validation(id === "email", emailError, value);
    let pass = validation(id === "pass", passError, value);

    setBoolean({
      nameError: name ? false : nameError,
      emailError: email ? false : emailError,
      passError: pass ? false : passError,
    });

    setHelperText({
      nameHepler: name ? " " : nameHepler,
      emailHelper: email ? " " : emailHelper,
      passHepler: pass ? " " : passHepler,
    });

    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  // 널체크 및 요청 보내기
  const isNull = () => {
    let nameCheck = !name.trim();
    let emailCheck = !email.trim();
    let passCheck = !pass.trim();

    setBoolean({
      nameError: nameCheck ? true : false,
      emailError: emailCheck ? true : false,
      passError: passCheck ? true : false,
    });

    setHelperText({
      nameHepler: nameCheck ? "이름을 입력해주세요" : nameHepler,
      emailHelper: emailCheck ? "이메일을 입력해주세요" : emailHelper,
      passHepler: passCheck ? "비밀번호를 입력해주세요" : passHepler,
    });
    const createUser = async () => {
      await axios
        .post("http://10.10.10.168:3001/user", {
          name: name,
          email: email,
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
              emailError: true,
              passError,
            });
            setHelperText({
              nameHepler,
              emailHelper: response.data.message,
              passHepler,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    if (name && email && pass) {
      createUser();
    }
  };

  //   const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
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
                    <h3>Sign Up</h3>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
                    <TextField
                      fullWidth
                      helperText={nameHepler}
                      variant="standard"
                      label="Name..."
                      id="name"
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
                      helperText={emailHelper}
                      variant="standard"
                      label="Email..."
                      id="email"
                      error={emailError}
                      InputProps={{
                        type: "email",
                        onChange: (e) => onChange(e),
                        value: email,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />
                    <TextField
                      fullWidth
                      helperText={passHepler}
                      variant="standard"
                      label="Password"
                      id="pass"
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
                      Sign Up
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
        onClose={() => setClassicModal(false)}
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
