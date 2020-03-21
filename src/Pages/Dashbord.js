import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from '@fortawesome/free-solid-svg-icons'


import "../styles/dashbord.min.css";


export default () => {

  return (
    <div>
      <div className="row container dash-links" style={{ maxWidth: '100%'}}>
        <div className="flex-1">
          <Link to="/todayintervention"><FontAwesomeIcon icon={icons.faConciergeBell} /> Intervention du jour</Link>
          <Link to="/interventions"><FontAwesomeIcon icon={icons.faCalendarAlt} /> Planning des interventions</Link>
          <Link to="/synthese"><FontAwesomeIcon icon={icons.faTable} />  Synthèse mensuelle</Link>
        </div>
        <div className="flex-1">
          <Link to="/rooms"><FontAwesomeIcon icon={icons.faBed} /> Gestion des chambres</Link>
          <Link to="/employess"><FontAwesomeIcon icon={icons.faUser} /> Gestion des employés</Link>
        </div>
      </div>
    </div>
  );
};
