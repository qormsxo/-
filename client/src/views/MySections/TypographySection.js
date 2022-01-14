import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Success from "components/Typography/Success.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/typographyStyle.js";

const useStyles = makeStyles(styles);

export default function SectionTypography(props) {
  const { text, icon } = props;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Success
        children={
          <h3>
            {icon} &nbsp; {text}
          </h3>
        }
      />
    </div>
  );
}
