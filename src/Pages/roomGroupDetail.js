import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {
  selectInterventions,
  setCurrentIntervention
} from "../Redux/MainReducer";

import EntretienItem from "../Components/EntretienItem";
import { Breadcrumb, Icon, Row, Col } from "antd";

import "../styles/App.css";

export default ({ match }) => {
  const dispatch = useDispatch();

  const data = {
    nom: "Etage A2",
    comment: "k",
    employee: ["Angel.B", "Daniel.P"]
  };
  console.log("id = ", match.params.id);

  return (
    <div>
      <div className="row" style={{ margin: "0 22px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/interventions">
              liste des interventions
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Detail de group de chambre</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row style={{ margin: "0 19px" }}>
        <Col span={24}>
          <h5 className="title-head" style={{ textAlign: "left" }}>
            Détail
          </h5>
        </Col>
        <div className="info-row">
          <Col span={8}>
            <p>
              <b>Nom</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.nom}</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              <b>Commentaire</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.comment}</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              <b>Employé</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.employee}</p>
          </Col>
        </div>
      </Row>
    </div>
  );
};
