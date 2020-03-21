import React, { Component } from "react";
export default ({ title, state, active }) => {
  return (
    <div className="state-item">
      <span>icon</span>
      <span>{title}</span>
      {active && <span>active</span>}
    </div>
  );
};
