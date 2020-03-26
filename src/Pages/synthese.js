import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Breadcrumb, Icon } from "antd";

import {} from "../Redux/MainReducer";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

export default () => {
  return (
    <div>
      <div className="row" style={{ margin: "0 10px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Synthese</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 noPadding">
          <h1>Synthese</h1>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};
