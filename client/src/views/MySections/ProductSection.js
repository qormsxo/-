import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import VerifiedUser from "@material-ui/icons/VerifiedUser";

import ReportProblemIcon from "@material-ui/icons/ReportRounded";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>멸종위기 야생생물이란?</h2>
          <h5 className={classes.description}>
            야생생물 보호 및 관리에 관한 법률에 따라 야생생물을 대상으로
            효과적인 보호를 위하여 환경부가 지정 보호하는 생물들을 말합니다.
            멸종위기 야생생물은 자연적 또는 인위적 위협요인으로 인하여 개체 수가
            현격히 감소하거나 소수만 남아 있어 가까운 장래에 절멸될 위기에 처해
            있는 야생생물을 말하며, 법으로 지정하여 보호 · 관리하는
            법정보호종으로, 현재 멸종위기 야생생물 I급과 멸종위기 야생생물
            II급으로 나누어 지정 관리하고 있습니다.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="멸종위기 야생생물 2급(현재 207종 지정)"
              description="자연적 또는 인위적 위협 요인으로 개체 수가 크게 줄어들고 있어 현재의 위협요인이 제거되거나 완화되지 아니할 경우 가까운 장래에 멸종위기에 처할 우려가 있는 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종"
              icon={ReportProblemIcon}
              iconColor="warning"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="멸종위기 야생생물 1급(현재 60종 지정)"
              description="자연적 또는 인위적 위협요인으로 인하여 개체 수가 크게 줄어들어 멸종위기에 처한 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종"
              icon={ReportProblemIcon}
              iconColor="danger"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="제보하기"
              description="멸종위기 야생생물 보호와 연구에 지속적인 관심과 참여 부탁드립니다."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
