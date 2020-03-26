import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {
  selectInterventions,
  setCurrentIntervention
} from "../Redux/MainReducer";

import EntretienItem from "../Components/EntretienItem";
import {
  Breadcrumb,
  Icon,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Collapse,
  Card,
  List,
  Badge,
  Checkbox,
  Empty,
  message
} from "antd";

import moment from "../moment";

import "../styles/App.css";

export default ({ match }) => {
  const dispatch = useDispatch();
  

  console.log("id = ", match.params.id);

  return (
    <div>
      <div className="row" style={{ margin: "0 10px"}}>
          Detail of room group
      </div>
    </div>
  );
};
