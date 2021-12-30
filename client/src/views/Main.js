// nodejs library that concatenates classes
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
// import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// import MainSections from "./MySections/MainSections";

import styles from "assets/jss/material-kit-react/views/components.js";
import ProductSection from "./MySections/ProductSection";
import TeamSection from "./MySections/TeamSection";
import Carousel from "./MySections/CarouselSection";
import Footer from "components/Footer/Footer";

const useStyles = makeStyles(styles);

function Main(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  useEffect(async () => {
    await axios
      .get("http://10.10.10.168:3001/session", {
        "Content-type": "application/json",
        Accept: "application/json",
        Cache: "no-cache",
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
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
  }, []);
  return (
    <div>
      <Header
        brand="멸종위기 야생생물 포털"
        rightLinks={<HeaderLinks isLoggedIn={isLoggedIn} userObj={userObj} />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      {/* <Parallax image={img}> */}
      <Parallax image={require("assets/img/landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h3 className={classes.subtitle}>서브 타이틀</h3>
                <h2 className={classes.title}>메인화면</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        {/* <MainSections /> */}
        <div className={classes.container}>
          <Carousel />
          <ProductSection />
          <TeamSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
