import React from "react";
import { Checkbox } from "antd";

export default ({ entretien, onClick, selected = false, onchangeState }) => {
  return (
    <div
      className={`intervention-item container ${selected && "selected"}`}
      onClick={onClick}
    >
      <span className="col-3 noPadding">
        <b>{entretien.RoomGroup.Name}</b>
      </span>
      <span className="col-3 noPadding">
        {entretien.Employee!=null && <b>{entretien.Employee.FirstName} {entretien.Employee.LastName}</b>}
      </span>
      <span className="col-3 noPadding">
        <Checkbox value={entretien.ID} checked={entretien.State} onChange={onchangeState} />
      </span>
      <span className="col-5 noPadding text">{entretien.Comment}</span>
      <span className="col-1 noPadding">
        {entretien.selected && <span className="active"></span>}
      </span>
    </div>
  );
};
