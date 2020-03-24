import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {Breadcrumb, Icon} from "antd";

import {} from "../Redux/MainReducer";

export default () => {  
  return (
    <div>
    <div className="row">
      <div className="col-2">
      <Breadcrumb>
            <Breadcrumb.Item >
            <Link to="/"><Icon type="home" /> Accueil</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Gestion des chmabres</Breadcrumb.Item>
          </Breadcrumb>
          </div>
      <div className="col-8 noPadding">
          <h1>gestion des chmabres</h1>
      </div>
      <div className="col-2">

      </div>
    </div>
    
    </div>
  );
};
