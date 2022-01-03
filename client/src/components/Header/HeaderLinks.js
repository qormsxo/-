/*eslint-disable*/
import React from "react";
// import DeleteIcon from "@material-ui/icons/Delete";
// import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

import axios from "axios";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const { isLoggedIn, userObj } = props;
  // console.log(isLoggedIn, userObj);
  const logout = async () => {
    await axios
      .post("http://10.10.10.168:3001/logout", null, {
        withCredentials: true,
      })
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      {isLoggedIn ? (
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <Link to="/profile" className={classes.white}>
              <Button
                href=""
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>{userObj.user_name}</h6>
              </Button>
            </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              onClick={() => logout()}
              color="transparent"
              target="_blank"
              className={classes.navLink}
            >
              <h6 style={{ marginTop: "5px" }}>Logout</h6>
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Link to="/report" className={classes.white}>
              <Button
                href=""
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>제보 조회</h6>
              </Button>
            </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Link to="/species" className={classes.white}>
              <Button
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>멸종위기종 조회</h6>
              </Button>
            </Link>
          </ListItem>
        </List>
      ) : (
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <Link to="/sign-up" className={classes.white}>
              <Button
                href=""
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>Sign Up</h6>
              </Button>
            </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Link to="/log-in" className={classes.white}>
              <Button
                href=""
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>Log In</h6>
              </Button>
            </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Link to="/report" className={classes.white}>
              <Button
                href=""
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}> 제보 조회</h6>
              </Button>
            </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Link to="/species" className={classes.white}>
              <Button
                color="transparent"
                target="_blank"
                className={classes.navLink}
              >
                <h6 style={{ marginTop: "5px" }}>멸종위기종 조회</h6>
              </Button>
            </Link>
          </ListItem>
        </List>
      )}
    </div>
  );
}

/* <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Components"
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              1 components
            </Link>,
            <Link to="/" className={classes.dropdownLink}>
              2 components
            </Link>,
          ]}
        />
      </ListItem> */
