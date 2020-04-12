import React from "react";
import { Badge, Icon, Tooltip, Typography } from "antd";
import moment from "moment";

const getStatusText =(statusCode)=>{
  switch(statusCode){
    case "error":
      return "Incident"
    case "success":
      return "Ok"
    case "default":
      return "Non fait"
  }
}


export default ({ intervention, onClick, selected= false }) => {
  return (
    <div className={`intervention-item container ${selected&& "selected"}`} onClick={onClick}>
      <span className="col-3 noPadding">
        <b>Chambre {intervention.NumeroChambre}</b>
      </span>
      <span className="col-3 noPadding">
        <b>{intervention.Employee}</b>
        <Tooltip title={getStatusText.bind(this,intervention.Status)}>
          <Badge status={intervention.Status} />
        </Tooltip>
      </span>
      <span className="col-5 noPadding text">{intervention.Comment}</span>
    </div>
  );
};
