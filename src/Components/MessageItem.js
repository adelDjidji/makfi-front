import React from "react";
import {Row, Col} from "antd";
import moment from "../moment";

export default ({ message, selected = false, onClick, full = false }) => {
  if (!full)
    return (
      <div
        onClick={onClick}
        className={`message-item container ${selected ? "selected" : ""}`}
      >
        <span className="">
          <b>{message.From}</b>
        </span>
        <span className={`col-9 text ${message.urgent && "danger"}`}>
          {message.Contenu}
        </span>
      </div>
    )
  else
    return (
      <Row
        onClick={onClick}
        className={`message-item container ${selected ? "selected" : ""}`}
      >
        <Col span={4}>
          <b>{moment(message.Date).format("DD/MM/YYYY")}</b>
        </Col>
        <Col span={6}>
          <b>{message.From}</b>
        </Col>
        <Col span={14} className={`text ${message.urgent && "danger"}`}>
          {message.Contenu}
        </Col>
      </Row>
    );
};
