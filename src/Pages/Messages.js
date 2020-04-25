import React, {useState} from "react";
// import {  useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {} from "../Redux/MainReducer";
import MessageItem from "../Components/MessageItem";
import { Breadcrumb, Icon, Row, PageHeader, Dropdown, Button, Menu , Empty, Spin, Modal } from "antd";

import Api from "../Api/api";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const liste_messages = [
  {
    ID: "sdsd",
    From: "reception",
    Date: "2020-02-01 07:12:00",
    Contenu: "Bienvenus chez hotel ..",
    urgent: false,
  },
  {
    ID: "sds2d",
    From: "Administration",
    Date: "2020-02-10 17:12:00",
    Contenu: "Vos premiers pas avec nos",
    urgent: false,
  },
  {
    ID: "sd4sd",
    From: "reception",
    Date: "2020-02-11 19:12:00",
    Contenu: "Un travail vous a ete affecté [URGENT]",
    urgent: true,
  },
];

export default ({ match }) => {
  // const dispatch = useDispatch();

  const [selectedMessages, setselectedMessages] = useState([]);
  const [loading, setloading] = useState(false)

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
            Api.get("Rooms/GetRooms?HotelID=").then((res) => {
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
  const selectAllInMessages = () => {
    let Ids = liste_messages.map(item => item.ID);
    console.log("IDS=", Ids);
    if (Ids.length === selectedMessages.length)
      setselectedMessages([]);
    else setselectedMessages(Ids);
  };


  const menuMessagerie = (
    <Menu>
      <Menu.Item onClick={selectAllInMessages}>
      <Icon type="unordered-list" /> Sélectionner tous
        </Menu.Item>
      {selectedMessages.length >= 1 && (
        <Menu.Item className="red" onClick={supprimerMessage}>
          <Icon type="delete" /> Supprimer
        </Menu.Item>
      )}
    </Menu>
  );
  //selectionner un message
  const selectMessage = (id) => {
    if (selectedMessages.indexOf(id) >= 0) {
      let tmp = selectedMessages.filter((item) => item !== id);
      setselectedMessages(tmp);
    } else {
      setselectedMessages([...selectedMessages, id]);
    }
  };
  return (
    <Spin indicator={antIcon} spinning={loading}>
      <div className="row" style={{ margin: "0 22px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/rooms">
              Messagerie
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row style={{ margin: "0 19px" }}>
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
        {liste_messages.map((item) => (
          <MessageItem
            key={item.ID}
            message={item}
            selected={selectedMessages.indexOf(item.ID) >= 0}
            onClick={selectMessage.bind(this, item.ID)}
            full={true}
          />
        ))}
        {liste_messages.length === 0 && (
          <Empty description="Aucun message pour cet hotel" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        </Row>
    </Spin>
  );
};
