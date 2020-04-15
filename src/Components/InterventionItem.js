import React from "react";
import { Badge, Icon, Tooltip, Typography } from "antd";
import moment from "moment";

const getStatusText = state => {
  switch (state) {
    case "error":
      return "Incident";
    case "success":
      return "Ok";
    case "default":
      return "Non fait";
  }
};
const getStatus = stateCode => {
  switch (stateCode) {
    case "Incident":
      return "error";
    case "OK":
      return "success";
    case "NonFait":
      return "default";
  }
};
export default ({ intervention, onClick, selected = false }) => {
  return (
    <div
      className={`intervention-item container ${selected && "selected"}`}
      onClick={onClick}
    >
      <span className="col-4 noPadding">
        <Tooltip
          title={moment(intervention.StartDateTime).format("DD/MM/YYYY HH:mm")}
        >
          <b>{`${moment(intervention.StartDateTime).format("dddd")} ${moment(
            intervention.StartDateTime
          ).format("DD MMM")}`}</b>
        </Tooltip>
      </span>
      <span className="col-3 noPadding">
        <Icon className="small-icon" type="clock-circle" />
        <b>{moment(intervention.StartDateTime).format("HH:mm")}</b>
        <Tooltip title={intervention.State}>
          {intervention.State == "Incident" && <Badge status="error" />}
          {intervention.State == "OK" && <Badge status="success" />}
          {intervention.State == "NonFait" && <Badge status="default" />}
        </Tooltip>
      </span>
      <span className="col-4 noPadding text">{intervention.Commentaire}</span>
      <span className="col-1 noPadding">
        {
          //intervention.active && <span className="active"></span>
        }
      </span>
    </div>
  );
};
