import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import EntretienItem from "../Components/EntretienItem";
import { Breadcrumb, Icon, Row, Col, Spin } from "antd";

import "../styles/App.css";
import Api from "../Api/api";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


export default ({ match }) => {
  const dispatch = useDispatch();
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(true);
  // const data = {
  //   nom: "Etage A2",
  //   comment: "k",
  //   employee: ["Angel.B", "Daniel.P"]
  // };
  console.log("id = ", match.params.id);
  loading &&
  Api.get("Entretiens/GetEntretien/" + match.params.id)
  .then((res) => {
    console.log("resss", res.data);
    setdata(res.data);
    setloading(false);
  });
  console.log("dataa",data);
  if(loading) return <Spin indicator={antIcon}></Spin>
  else  return (
    <Spin indicator={antIcon} spinning={loading}>
      <div>
        <div className="row" style={{ margin: "0 22px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">
                <Icon type="home" /> Accueil
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/interventions">liste des interventions</Link>
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
              <p>{data.RoomGroup.Name}</p>
            </Col>
          </div>
          <div className="info-row">
            <Col span={8}>
              <p>
                <b>Commentaire</b>
              </p>
            </Col>
            <Col span={16}>
              <p>{data.Comment}</p>
            </Col>
          </div>
          <div className="info-row">
            <Col span={8}>
              <p>
                <b>Employé</b>
              </p>
            </Col>
            <Col span={16}>
              <p>{data.Employee.FirstName} {data.Employee.LastName}</p>
            </Col>
          </div>
        </Row>
      </div>
    </Spin>
  );
};
