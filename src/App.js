import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Selectors from "./Redux/MainReducer";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Interventions from "./Pages/interventions";
import InterventionDetail from "./Pages/interventionDetail";
import InterventionDuJour from "./Pages/todayintervention";
import Login from "./Pages/Login";
import Dashbord from "./Pages/Dashbord";
import synthese from "./Pages/synthese";
import Rooms from "./Pages/rooms";
import Employees from "./Pages/employees";
import roomGroupDetail from "./Pages/roomGroupDetail";
import roomDetail from "./Pages/roomDetail";

import MessageItem from "./Components/MessageItem";
import { Card, PageHeader, Icon, Dropdown, Button, Menu } from "antd";
import { list2_Interventions } from "./mocks";

import "antd/dist/antd.css";

import "./styles/App.css";
import moment from "moment";
import Api from "./Api/api"

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
      <a target="_blank" rel="noopener noreferrer">
        marquer comme lu
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">
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

   const [hotels, sethotels] = useState([])
 
  const currentuser= useSelector(Selectors.selectCurrentUser)
  const currentIntervention = useSelector(Selectors.selectCurrentIntervention);
  const ISLogged = useSelector(Selectors.selectAuthLogged);
  const listInterventions = useSelector(Selectors.selectInterventions);
  const currentHotel = useSelector(Selectors.selectCurrentHotel);

  const isAuth = useSelector(Selectors.getIsAuth);
  hotels.length==0 && 
  Api.get("Hotels/GetHotels?employeesGroupID="+currentuser.EmployeesGroupID)
  .then(res=>{
    console.log("hotells=",res.data);
    sethotels(res.data)
    dispatch(Selectors.setCurrentHotel(res.data[0]));
  })


  // const hotels = useSelector(Selectors.selectHotels);
  const switchHotel = idHotel => {
    Api.get("Interventions/GetInterventions?hotelId="+idHotel)
    .then(res=>{
      console.log("ress==",res.data);
      dispatch(Selectors.setListeInterventions(res.data));
    })

    dispatch(Selectors.setCurrentHotel(hotels.filter(item => item.ID === idHotel)[0]));
  };

  const menuHotels = (
    <Menu>
      {hotels.map(hotel => (
        <Menu.Item onClick={switchHotel.bind(this, hotel.ID)}>
          <span>{hotel.Name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  const menuUser = (
    <Menu>
      <Menu.Item onClick={() => dispatch(Selectors.setLoggedOut())}>
        <span>deconnexion</span>
      </Menu.Item>
    </Menu>
  );

  
  if (!isAuth) return <Login />;
  return (
    <div>
      <Router>
        <div className="row" style={{marginRight: -36}}>
          <div className="col-2">
            <Dropdown overlay={menuUser} placement="bottomCenter">
              <Card
                hoverable
                style={{
                  borderRadius: "5pt",
                  margin: "auto",
                  marginLeft: "15pt",
                  marginTop: "4pt"
                }}
                cover={
                  <img
                    alt="user picture"
                    src={currentuser.ProfilePictureUrl}
                  />
                }
              >
                <Meta title={`${currentuser.FirstName} ${currentuser.LastName}`} />
              </Card>
            </Dropdown>
          </div>
          <div className="col-8 noPadding">
            <h5 className="title-head">
              <Switch>
                <Route exact path="/">
                  Accueil
                </Route>
                <Route exact path="/intervention/:id">
                  Intervention du {currentIntervention}
                </Route>
                <Route exact path="/roomGroup/:id">
                  Group de chambres - Détail
                </Route>
                <Route exact path="/room/:id">
                  Chambre - Détail
                </Route>
                <Route exact path="/interventions">
                  Planning des interventions
                </Route>
                <Route exact path="/todayintervention">
                  Intervention du jour
                </Route>
                <Route exact path="/synthese">
                  Synthèse - {moment().month(moment().month()).format("MMMM")} {moment().year()}
                </Route>
                <Route exact path="/rooms">
                  Gestion des chambres
                </Route>
                <Route exact path="/employess">
                  Gestion des employés
                </Route>
              </Switch>
            </h5>

            <PageHeader
              style={{
                border: "1px solid rgb(246, 242, 208)"
              }}
              title={
                <span>
                  <Icon
                    type="mail"
                    style={{
                      color: "#bba802",
                      position: "relative",
                      bottom: 3
                    }}
                  />
                  Messagerie
                </span>
              }
              extra={[<DropdownMenuMessagerie key="more" />]}
            />
            <div className="table-body">
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
                style={{
                  borderRadius: "5pt",
                  margin: "auto",
                  marginRight: "10pt",
                  marginTop: "4pt"
                }}
                cover={<img alt="hotel image" src="https://pix10.agoda.net/hotelImages/5043346/-1/c489e0e38444ad6e31453efb5d732e7f.jpg?s=1024x768" />}
              >
                <Meta
                  title={
                    <span>
                      {currentHotel.Name}{" "}
                      <Icon style={{ fontSize: "8pt" }} type="down" />
                    </span>
                  }
                />
              </Card>
            </Dropdown>
          </div>
        </div>
        <hr className="transparent" />
        <Switch>
          <Route exact path="/" component={Dashbord} />
          <Route exact path="/interventions" component={Interventions} />
          <Route
            exact
            path="/intervention/:id"
            component={InterventionDetail}
          />
          <Route exact path="/roomGroup/:id" component={roomGroupDetail} />
          <Route exact path="/room/:id" component={roomDetail} />
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
