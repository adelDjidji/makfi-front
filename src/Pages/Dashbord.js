import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from '@fortawesome/free-solid-svg-icons'


import "../styles/dashbord.min.css";


export default () => {

  const todayInterventionID= "d1f3f9e2-d87d-ea11-aa77-0003ff0b7602";
  
  return (
    <div>
      <div className="row container dash-links" style={{ marginLeft: '7pt'}}>
        <div className="" style={{width:"50%"}}>
          <Link to={"/intervention/"+todayInterventionID}><FontAwesomeIcon icon={icons.faConciergeBell} /> Intervention du jour</Link>
          <Link to="/interventions"><FontAwesomeIcon icon={icons.faCalendarAlt} /> Planning des interventions</Link>
          <Link to="/synthese"><FontAwesomeIcon icon={icons.faTable} />  Synthèse mensuelle</Link>
        </div>
        <div className="" style={{width:"50%"}}>
          <Link to="/rooms"><FontAwesomeIcon icon={icons.faBed} /> Gestion des chambres</Link>
          <Link to="/employess"><FontAwesomeIcon icon={icons.faUser} /> Gestion des employés</Link>
        </div>
      </div>
    </div>
  );
};
