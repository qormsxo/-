import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import axios from "axios";
import { InputAdornment, TextField } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { Lock, People } from "@material-ui/icons";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

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

export default function ProfileUpdate(props) {
  const classes = useStyles();

  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  //const [classicModal, setClassicModal] = useState(false); // 모달

  // input state
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    pass: "",
  });

  const { name, phone, pass } = inputs;
  const nav = useNavigate();

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
          setUserObj(
            response.data,
            setInputs({
              name: response.data.user_name,
              phone: response.data.user_phone,
              pass: "",
            })
          );
        } else {
          setIsLoggedIn(false);
          nav("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getSession();
  }, []);

  // helperText State
  const [helperText, setHelperText] = useState({
    nameHepler: " ",
    phoneHelper: " ",
    passHepler: " ",
  });

  const { nameHepler, phoneHelper, passHepler } = helperText;

  // input error state
  const [boolean, setBoolean] = useState({
    nameError: false,
    phoneError: false,
    passError: false,
  });

  const { nameError, phoneError, passError } = boolean;

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
    let phone = validation(name === "phone", phoneError, value);
    let pass = validation(name === "pass", passError, value);

    setBoolean({
      nameError: userName ? false : nameError,
      phoneError: phone ? false : phoneError,
      passError: pass ? false : passError,
    });

    setHelperText({
      nameHepler: userName ? " " : nameHepler,
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
    let phoneCheck = !phone;
    let passCheck = !pass.trim();

    setBoolean({
      nameError: nameCheck ? true : false,
      phoneError: phoneCheck ? true : false,
      passError: passCheck ? true : false,
    });

    setHelperText({
      nameHepler: nameCheck ? "이름을 입력해주세요" : nameHepler,
      phoneHelper: phoneCheck ? "전화번호를 입력해주세요" : phoneHelper,
      passHepler: passCheck ? "비밀번호를 입력해주세요" : passHepler,
    });

    if (name && pass && phone) {
      userUpdate();
    }
  };

  const userUpdate = async () => {
    await axios
      .put("http://10.10.10.168:3001/user", {
        name: name,
        userId: userObj.user_id,
        phone: phone,
        userPw: pass,
      })
      .then((response) => {
        if (response.data.status) {
          //console.log("성공");
          axios
            .post("http://10.10.10.168:3001/logout", null, {
              withCredentials: true,
            })
            .then((response) => {
              nav("/log-in");
            })
            .catch((error) => {
              console.error(error);
            });
        } else if (!response.data.status) {
          setBoolean({
            nameError,
            phoneError,
            passError,
          });
          setHelperText({
            nameHepler,
            phoneError,
            passHepler,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      <Parallax small image={require("assets/img/profile-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h3 className={classes.subtitle} style={{ color: "white" }}>
                  프로필 수정
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container} style={{ maxWidth: "960px" }}>
            {/* <div style={{ marginTop: "30px", marginBottom: "30px" }}></div> */}
            <div style={{ paddingTop: "30px" }}>
              <h3>
                프로필 수정 <ManageAccountsRoundedIcon fontSize="large" />
              </h3>
            </div>
            <Card>
              <CardBody>
                <form>
                  <TextField
                    fullWidth
                    helperText={nameHepler}
                    variant="standard"
                    label="이름..."
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
                    helperText={phoneHelper}
                    variant="standard"
                    label="전화번호..."
                    name="phone"
                    InputLabelProps={{ shrink: phoneError ? false : true }}
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
                    label="비밀번호..."
                    name="pass"
                    error={passError}
                    InputProps={{
                      type: "password",
                      onChange: (e) => onChange(e),
                      value: pass,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Lock />
                        </InputAdornment>
                      ),
                      autoComplete: "off",
                    }}
                  />
                </form>
              </CardBody>
            </Card>

            <div className={classes.description}>
              {/* <h4>
                <b>{userObj.user_phone}</b>
              </h4> */}
              <Link to="/profile-update">
                <Button color="info" onClick={isNull}>
                  프로필 수정
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
