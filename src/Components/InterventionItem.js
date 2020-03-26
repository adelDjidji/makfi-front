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
      <Tooltip title={moment(intervention.dateTime).format("DD/MM/YYYY HH:mm")}>
        <b>{`${moment(intervention.dateTime).format("dddd")} ${moment(intervention.dateTime).format("DD")}`}</b>
      </Tooltip>
      </span>
      <span className="col-3 noPadding">
        <Icon className="small-icon" type="clock-circle" />
        <b>{moment(intervention.dateTime).format("HH:mm")}</b>
        <Tooltip title={getStatusText.bind(this,intervention.status)}>
          <Badge status={intervention.status} />
        </Tooltip>
      </span>
      <span className="col-5 noPadding text">{intervention.comment}</span>
      <span className="col-1 noPadding">
        {intervention.active && <span className="active"></span>}
      </span>
      
    </div>
  );
};
