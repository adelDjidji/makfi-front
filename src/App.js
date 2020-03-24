import React , { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentHotel,
  setCurrentHotel,
  selectHotels,
  selectInterventions,
  setListeInterventions,
  selectAuthLogged,
  setLoggedOut,
  setLogged,
  increment,
  selectCount,
  getIsAuth,
  setAuthenticated,
} from "./Redux/MainReducer";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Interventions from "./Pages/interventions";
import InterventionDetail from "./Pages/interventionDetail";
import InterventionDuJour from "./Pages/todayintervention";
import Login from "./Pages/Login";
import Dashbord from "./Pages/Dashbord";
import synthese from "./Pages/synthese";
import Rooms from "./Pages/rooms";
import Employees from "./Pages/employees";


import MessageItem from "./Components/MessageItem";
import { Card, PageHeader, Icon, Dropdown, Button, Menu } from "antd";
import { list2_Interventions } from "./mocks";

import "antd/dist/antd.css";

import "./styles/App.css";


const { Meta } = Card;

const DropdownMenuMessagerie = () => {
  return (
    <Dropdown key="more" overlay={menuMessagerie}>
      <Button
        style={{
          border: "none",
          padding: 0
        }}
      >
        <Icon
          type="ellipsis"
          style={{
            fontSize: 20,
            verticalAlign: "top"
          }}
        />
      </Button>
    </Dropdown>
  );
};
const menuMessagerie = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
      >
        marquer comme lu
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="#"
      >
        archiver
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">
        editer
      </a>
    </Menu.Item>
  </Menu>
);

export default props => {
  const dispatch = useDispatch();
  const hotels = useSelector(selectHotels);
  const ISLogged = useSelector(selectAuthLogged)
  const listInterventions = useSelector(selectInterventions);
  const currentHotel = useSelector(selectCurrentHotel);
  const [logged, setlogged]= useState(ISLogged)

  const count = useSelector(selectCount);
  const isAuth = useSelector(getIsAuth);

  const switchHotel = idHotel => {
    switch (idHotel) {
      case 1:
        dispatch(setListeInterventions(listInterventions));
        break;
      case 2:
      default:
        dispatch(setListeInterventions(list2_Interventions));
        break;
    }
    dispatch(setCurrentHotel(hotels.filter(item => item.id === idHotel)[0]));
  };

  const menuHotels = (
    <Menu>
      {hotels.map(hotel => (
        <Menu.Item onClick={switchHotel.bind(this, hotel.id)}>
          <span>{hotel.name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  const menuUser = (
    <Menu>
    <Menu.Item onClick={()=>dispatch(setLoggedOut())}>
    <span>deconnexion</span>
  </Menu.Item>
    </Menu>
  );

  const getPageTitle=()=>{
    let currentPath= window.location.pathname
    switch(currentPath){
      case "/employess" :
        return "Gestion des employés";
      case "/" :
      case "/":
        return "Accueil"
      case "/interventions" :
        return "Liste des interventions"
      case "/todayintervention" :
        return "Intervention du jour"
      case "/synthese" :
        return "Synthèse mensuelle"
      case "/rooms" :
        return "Gestion des chambres"
      default:
        break;
    }
  }
  // if(!isAuth) return <button onClick={()=>dispatch(setAuthenticated())}>login babe {count} {JSON.stringify(isAuth)}</button>
  if(!isAuth) return <Login />
  return (
    <div>
    <Router>
      <div className="row">
        <div className="col-2">
        <Dropdown overlay={menuUser} placement="bottomCenter">

          <Card
            hoverable
            style={{ borderRadius: "5pt", margin: "auto", marginLeft: '15pt', marginTop: "4pt" }}
            cover={
              <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              />
            }
          >
            <Meta title="Daniéle Lopez" />
          </Card>
          </Dropdown>
        </div>
        <div className="col-8 noPadding">
        <h4 className="title-head">
          <Switch>
          <Route exact path="/">
            Accueil
          </Route>
          <Route exact path="/">
            Accueil
          </Route>
          <Route exact path="/interventions">
              Planning des interventions
          </Route>
          <Route exact path="/todayintervention" >
            Intervention du jour
          </Route>
          <Route exact path="/synthese" >
            Synthèse mensuelle
          </Route>
          <Route exact path="/rooms" >
            Gestion des chambres
          </Route>
          <Route exact path="/employess">
            Gestion des employés
          </Route>
        </Switch>

        </h4>
        
          <PageHeader
            style={{
              border: "1px solid rgb(246, 242, 208)"
            }}
            title={
              <span>
                <Icon
                  type="mail"
                  style={{ color: "#bba802", position: "relative", bottom: 3 }}
                />
                Messagerie
              </span>
            }
            extra={[<DropdownMenuMessagerie key="more" />]}
          />
          <div className="table-body">
            <MessageItem
              title="centrale"
              text="mettre le netoyage de la reception en priorite."
              active={true}
            />
            <MessageItem
              title="reception"
              text="Merci de controler la roubine de la chmbre109 et la chambre a cote aussi bien sur."
              active={true}
            />
            <MessageItem
              title="reception"
              text="Merci de controler la roubine de la chmbre109 et la chambre a cote aussi bien sur."
              danger={true}
            />
          </div>
        </div>
        <div className="col-2">
          <Dropdown overlay={menuHotels} placement="bottomCenter">
            <Card
              hoverable
              style={{ borderRadius: "5pt", margin: "auto", marginRight: '10pt', marginTop: "4pt" }}
              cover={<img alt="hotel image" src={currentHotel.image} />}
            >
              <Meta
                title={
                  <span>
                    {currentHotel.name} <Icon type="down" />
                  </span>
                }
              />
            </Card>
          </Dropdown>
        </div>
      </div>
      
        <Switch>
          <Route exact path="/" component={Dashbord} />
          <Route exact path="/interventions" component={Interventions} />
          <Route exact path="/intervention/:id" component={InterventionDetail} />
          <Route
            exact
            path="/todayintervention"
            component={InterventionDuJour}
          />
          <Route exact path="/synthese" component={synthese} />
          <Route exact path="/rooms" component={Rooms} />
          <Route exact path="/employess" component={Employees} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    </div>
  );
};
