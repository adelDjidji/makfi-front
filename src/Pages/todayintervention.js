import React from "react";
import { Breadcrumb, Icon } from "antd";

import {} from "../Redux/MainReducer";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div>
      <div className="row" style={{ margin: "0 22px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Intervention du jour</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 noPadding">
          <h1>Intervention du jour</h1>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};
