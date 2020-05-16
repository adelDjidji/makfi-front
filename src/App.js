import React, { useState } from "react";
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
import Messages from "./Pages/Messages";

import MessageItem from "./Components/MessageItem";
import {
  Card,
  PageHeader,
  Icon,
  Dropdown,
  Button,
  Menu,
  Empty,
  Spin,
  Modal,
  Result
} from "antd";

import "antd/dist/antd.css";

import "./styles/App.css";
import moment from "moment";
import Api from "./Api/api";

const { Meta } = Card;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const liste_messages = [
  {
    ID: "sdsd",
    From: "reception",
    Date: "12-03-2020",
    Contenu: "hello",
    urgent: false,
  },
];

export default (props) => {
  const dispatch = useDispatch();

  const [hotels, sethotels] = useState([]);
  const currentuser = useSelector(Selectors.selectCurrentUser);
  const currentIntervention = useSelector(Selectors.selectCurrentIntervention);
  const currentHotel = useSelector(Selectors.selectCurrentHotel);
  const [selectedMessages, setselectedMessages] = useState([]);
  const [loading, setloading] = useState(false);

  const isAuth = useSelector(Selectors.getIsAuth);

  hotels.length === 0 &&
    currentuser != null &&
    Api.get(
      "Hotels/GetHotels?employeesGroupID=" + currentuser.EmployeesGroupID
    ).then((res) => {
      console.log("hotells=", res.data);
      sethotels(res.data);
      dispatch(Selectors.setCurrentHotel(res.data[0]));
    });

    //TODO:
  const supprimerMessage = () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer ce message?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        setloading(true);
        selectedMessages.map((item) => {
          Api.delete("Rooms/DeleteRoom/" + item).then((res) => {
            console.log("res delete =", res);
            Api.get("Rooms/GetRooms?HotelID=" + currentHotel.ID).then((res) => {
              // setinterventions(res.data);
              // setlistInterventions(res.data);
              setselectedMessages([]);
              setloading(false);
            });
          });
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });

  const DropdownMenuMessagerie = () => {
    return (
      <Dropdown key="more" overlay={menuMessagerie}>
        <Button
          style={{
            border: "none",
            padding: 0,
          }}
        >
          <Icon
            type="ellipsis"
            style={{
              fontSize: 20,
              verticalAlign: "top",
            }}
          />
        </Button>
      </Dropdown>
    );
  };
  const menuMessagerie = (
    <Menu>
      <Menu.Item>
        <Link to={"/messages"}>
          <Icon type="mail" /> Voir tous les messages
        </Link>
      </Menu.Item>
      {selectedMessages.length >= 1 && (
        <Menu.Item className="red" onClick={supprimerMessage}>
          <Icon type="delete" /> Supprimer
        </Menu.Item>
      )}
    </Menu>
  );

  // const hotels = useSelector(Selectors.selectHotels);
  const switchHotel = (idHotel) => {
    Api.get("Interventions/GetInterventions?hotelId=" + idHotel).then((res) => {
      console.log("ress==", res.data);
      dispatch(Selectors.setListeInterventions(res.data));
    });

    dispatch(
      Selectors.setCurrentHotel(hotels.filter((item) => item.ID === idHotel)[0])
    );
  };

  //selectionner un message
  const selectMessage = (id) => {
    if (selectedMessages.indexOf(id) >= 0) {
      let tmp = selectedMessages.filter((item) => item !== id);
      setselectedMessages(tmp);
    } else {
      setselectedMessages([...selectedMessages, id]);
    }
  };
  const menuHotels = (
    <Menu>
      {hotels.map((hotel) => (
        <Menu.Item key={hotel.ID} onClick={switchHotel.bind(this, hotel.ID)}>
          <span>{hotel.Name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  const menuUser = (
    <Menu>
      <Menu.Item onClick={() => {
        dispatch(Selectors.setLoggedOut())
        window.location.href="/"+window.localStorage.getItem("code");
      }
    }>
        <span>deconnexion</span>
      </Menu.Item>
    </Menu>
  );

  if (!isAuth) {
    console.log(window.location.pathname);
    let path = window.location.pathname
    let param = path.substr(1)
    console.log("param = ",param);
    console.log("param  search= ",param.search("room"));
    if(param==="") return <Result
    status="404"
    title="Identifiant manquant"
    subTitle="Veuillez SVP verifier votre identifiant dans l'url."
    // extra={<Button type="primary">Obtenir votre lien d'authentification.</Button>}
  />
    if(
      param.search("room")===-1 &&
      param.search("intervention") ===-1 &&
      param.search("synthese") ===-1 &&
      param.search("employes") ===-1 &&
      param.search("message") ===-1
      ){
        return <Login id={param} />
      }
    return <Result
  status="403"
  title="403"
  subTitle="Desolé, Vous devez etre authentifié pour acceder à cette page."
  extra={<Button type="primary">Obtenir votre lien d'authentification.</Button>}
/>;
}
  return (
    <div>
      <Router>
        <div className="row" style={{ marginRight: -36 }}>
          <div className="col-2">
            <Dropdown overlay={menuUser} placement="bottomCenter">
              <Card
                hoverable
                style={{
                  borderRadius: "5pt",
                  margin: "auto",
                  marginLeft: "15pt",
                  marginTop: "4pt",
                }}
                cover={
                  <img alt="user picture" src={currentuser.ProfilePictureUrl} />
                }
              >
                <Meta
                  title={`${currentuser.FirstName} ${currentuser.LastName}`}
                />
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
                  Intervention du {currentIntervention || " jour"}
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
                  Synthèse - {moment().month(moment().month()).format("MMMM")}{" "}
                  {moment().year()}
                </Route>
                <Route exact path="/rooms">
                  Gestion des chambres
                </Route>
                <Route exact path="/employess">
                  Gestion des employés
                </Route>
                <Route exact path="/messages">
                  Messagerie
                </Route>
              </Switch>
            </h5>

            <PageHeader
              style={{
                border: "1px solid rgb(246, 242, 208)",
              }}
              title={
                <span>
                  <Icon
                    type="mail"
                    style={{
                      color: "#bba802",
                      position: "relative",
                      bottom: 3,
                    }}
                  />
                  Messagerie
                </span>
              }
              extra={[<DropdownMenuMessagerie key="more" />]}
            />
            <Spin indicator={antIcon} spinning={loading}>
              <div className="table-body">
                {liste_messages.map((item) => (
                  <MessageItem
                    key={item.ID}
                    message={item}
                    selected={selectedMessages.indexOf(item.ID) >= 0}
                    onClick={selectMessage.bind(this, item.ID)}
                  />
                ))}
                {liste_messages.length === 0 && (
                  <Empty
                    description="Aucun message aujord'hui"
                    imageStyle={{
                      height: 20,
                    }}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </Spin>
          </div>
          <div className="col-2">
            <Dropdown overlay={menuHotels} placement="bottomCenter">
              <Card
                hoverable
                style={{
                  borderRadius: "5pt",
                  margin: "auto",
                  marginRight: "10pt",
                  marginTop: "4pt",
                }}
                cover={
                  <img
                    alt="hotel image"
                    src="https://pix10.agoda.net/hotelImages/5043346/-1/c489e0e38444ad6e31453efb5d732e7f.jpg?s=1024x768"
                  />
                }
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
          <Route exact path="/messages" component={Messages} />
          <Route path="/" component={Dashbord} />
        </Switch>
      </Router>
    </div>
  );
};
