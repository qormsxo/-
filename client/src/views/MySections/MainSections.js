import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
// import GridContainer from "components/Grid/GridContainer.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";

const useStyles = makeStyles(styles);

export default function SectionBasics() {
  const classes = useStyles();

  return (
    <div className={classes.sections}>
      <div className={classes.container}>
        <div className={classes.title}>
          <h2>메인화면</h2>
        </div>
        <div id="buttons">
          <div className={classes.title}>
            <h3>
              여기다 뭘넣지
              <br />
              <small>Pick your style</small>
            </h3>
          </div>

          <div className={classes.title}>
            <h3>
              <small>Pick your size</small>
            </h3>
          </div>

          <div className={classes.title}>
            <h3>
              <small>Pick your color</small>
            </h3>
          </div>
        </div>
        <div className={classes.space50} />
        <div id="inputs">
          <div className={classes.title}>
            <h3>Inputs</h3>
          </div>
        </div>
        <div className={classes.space70} />
        <div id="checkRadios"></div>
        <div className={classes.space70} />
        <div id="progress"></div>
        <div id="sliders"></div>
      </div>
    </div>
  );
}
