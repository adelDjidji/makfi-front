import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Breadcrumb, Icon} from "antd";

import {} from "../Redux/MainReducer";

export default () => {  
  return (
    <div>
    <div className="row">
      <div className="col-3">
      <Breadcrumb>
            <Breadcrumb.Item href="/">
              <Icon type="home" />
              <span>Accueil</span>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Gestion des chmabres</Breadcrumb.Item>
          </Breadcrumb>
          </div>
      <div className="col-6">
          <h1>gestion des chmabres</h1>
      </div>
      <div className="col-3">

      </div>
    </div>
    
    </div>
  );
};
