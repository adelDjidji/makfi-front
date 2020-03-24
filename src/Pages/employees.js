import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {Breadcrumb, Icon} from "antd";

import {} from "../Redux/MainReducer";

export default () => {  
  return (
    <div className="row">
      <div className="col-3">
      <Breadcrumb>
            <Breadcrumb.Item >
            <Link to="/home"><Icon type="home" /> Accueil</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Gestion des employés</Breadcrumb.Item>
          </Breadcrumb>
          </div>
      <div className="col-6">
          <h1>gestion des Employés</h1>
      </div>
      <div className="col-3">

      </div>
    </div>
    
  );
};
