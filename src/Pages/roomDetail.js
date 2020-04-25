import React from "react";
import { Link } from "react-router-dom";

import { Breadcrumb, Icon, Row, Col } from "antd";


export default ({ match }) => {

  const data = {
      id: 3,
      NumeroChambre: 22,
      RoomGroup:"Etage C",
      Comment: "comment 101",
      Status: "success",
      State:"a faire",
      Employee:"Daniel.B"
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
            <Link to="/rooms">
              Gestion des chambres
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Detail de chambre</Breadcrumb.Item>
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
            <p>Chambre {data.NumeroChambre}</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              <b>Groupe</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.RoomGroup}</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              <b>Etat actuel</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.State}</p>
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
              <b>Employés</b>
            </p>
          </Col>
          <Col span={16}>
            <p>{data.Employee}</p>
          </Col>
        </div>
      </Row>
    </div>
  );
};
