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
        <b>{intervention.Name}</b>
      </span>
      <span className="col-4 noPadding">
        {intervention.Employee && <b>{intervention.Employee.FirstName} {intervention.Employee.LastName}</b>}
        <Tooltip title={intervention.Status}>
        {intervention.Status == "Incident" && <Badge status="error" />}
        {intervention.Status == "OK" && <Badge status="success" />}
        {intervention.Status == "NonFait" && <Badge status="default" />}
        </Tooltip>
      </span>
      <span className="col-5 noPadding text">{intervention.Comment}</span>
    </div>
  );
};
