import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {
  Breadcrumb,
  Icon,
  List,
  Row,
  Col,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Input,
  Modal,
  message,
  Select
} from "antd";

import {} from "../Redux/MainReducer";

const { Option } = Select;
const listeEmployee = [
  {
    id: 1,
    username: "Daniel.B",
    nom: "Daniel",
    prenom: "Bernard",
    Etat: "Ok",
    NumSec: 2341234123,
    Disponible: false
  },
  {
    id: 2,
    username: "Angela.B",
    nom: "Angela",
    prenom: "Bernard",
    Etat: "Ok",
    NumSec: 2300123,
    Disponible: true
  },
  {
    id: 3,
    username: "Sofia.D",
    nom: "Sofia",
    prenom: "Doulé",
    Etat: "Ok.",
    NumSec: 23004123,
    Disponible: true
  }
];

const InitialEmployeeObject = {
  username: null,
  nom: null,
  prenom: null,
  Etat: null,
  NumSec: null,
  Disponible: false
};

export default () => {
  const [currentEmployee, setcurrentEmployee] = useState(listeEmployee[0]);
  const [EmployeeObject, setEmployeeObject] = useState(InitialEmployeeObject);
  const [Employees, setEmployees] = useState(listeEmployee);
  const [modalNew, setmodalNew] = useState(false);
  const [modalEdit, setmodalEdit] = useState(false);

  const supprimerEmployee = () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer cet employé?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        let listnew = listeEmployee.filter(
          item => currentEmployee.id !== item.id
        );
        setEmployees(listnew);
        listnew.length > 0
          ? setcurrentEmployee(listnew[0])
          : setcurrentEmployee(null);
          message.success("L'employé a été supprimé avec succès")
      },
      onCancel() {
        console.log("Cancel");
      }
    });

  const newEmployeeClick = () => {
    setmodalNew(true);
  };

  const addEmployee = () => {
    var newID = listeEmployee.length + 2;
    setEmployees([
      ...listeEmployee,
      {
        ...EmployeeObject,
        id: newID,
        username: EmployeeObject.prenom + "." + EmployeeObject.nom[0]
      }
    ]);
    console.log("to add", { ...EmployeeObject, id: newID });
    message.success("Employé ajouté avec succès");
    hideModalNew();
  };

  const hideModalNew = () => {
    setmodalNew(false);
    setEmployeeObject(InitialEmployeeObject);
  };

  //change numero securite
  const handleChangeNumSec = e => {
    var val = e.target.value;
    setEmployeeObject({ ...EmployeeObject, NumSec: val });
  };
  //change nom
  const handleChangeNom = e => {
    console.log("change nom", e.target.value);
    var val = e.target.value;
    setEmployeeObject({ ...EmployeeObject, nom: val });
  };
  //change prenom
  const handleChangePrenom = e => {
    var val = e.target.value;
    setEmployeeObject({ ...EmployeeObject, prenom: val });
  };
  //change status
  function handleChangeStatus(value) {
    setEmployeeObject({ ...EmployeeObject, Etat: value });
  }
  //change disponible
  function handleChangeDisponible(value) {
    setEmployeeObject({ ...EmployeeObject, Disponible: value });
  }

  const menu = () => {
    return (
      <Menu>
        <Menu.Item onClick={newEmployeeClick}>Nouveau</Menu.Item>
        <Menu.Item onClick={editEmployeeClick}>Modifier</Menu.Item>
        {currentEmployee.id !== null && (
          <Menu.Item className="red" onClick={supprimerEmployee}>
            Supprimer
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const DropdownMenu = () => {
    return (
      <Dropdown key="more" overlay={menu}>
        <Button
          style={{
            border: "none",
            padding: 0,
            background: "transparent",
            color: "white"
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
  const oncancel = () => {
    setmodalEdit(false);
    setmodalNew(false);
  };
  const editEmployeeClick = () => {
    setmodalEdit(true);
    setEmployeeObject(currentEmployee);
  };
  const updateEmployee = () => {
    let tmp = listeEmployee.map(item => {
      if (item.id == currentEmployee.id)
        return { ...EmployeeObject, id: currentEmployee.id };
      else return item;
    });
    console.log("tmp after edit =", tmp);
    setcurrentEmployee({ ...EmployeeObject, id: currentEmployee.id });
    setEmployees(tmp);
    setmodalEdit(false);
    message.success("les informations de l'employé ont été enregistré avec succès")
  };
  return (
    <div>
      <Modal
        title="Ajouter un employé"
        visible={modalNew}
        onCancel={oncancel}
        footer={[]}
      >
        <div>
          <small>Nom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNom}
            value={EmployeeObject.nom}
          />
        </div>
        <div>
          <small>Prénom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangePrenom}
            value={EmployeeObject.prenom}
          />
        </div>
        <div>
          <small>Numero sécurité</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNumSec}
            type="number"
            value={EmployeeObject.NumSec}
          />
        </div>

        <div>
          <small>Etat</small>
          <br />
          <Select
            placeholder="selectionner un état"
            onChange={handleChangeStatus}
            style={{ width: 230 }}
          >
            <Option value="Incident">Incident</Option>
            <Option value="Ok">Ok</Option>
            <Option value="Non fait">Non fait</Option>
          </Select>
        </div>

        <div>
          <small>Disponible</small>
          <br />
          <Select
            placeholder="Disponibilité"
            onChange={handleChangeDisponible}
            style={{ width: 230 }}
          >
            <Option value={true}>Oui</Option>
            <Option value={false}>Non</Option>
          </Select>
        </div>

        <br />
        <Button
          onClick={addEmployee}
          type="primary"
          className="login-form-button"
        >
          Ajouter
        </Button>
      </Modal>
      <Modal
        title="Modifier les informations de l'employé"
        visible={modalEdit}
        onChange={oncancel}
        footer={[]}
      >
        <div>
          <small>Nom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNom}
            value={EmployeeObject.nom}
          />
        </div>
        <div>
          <small>Prénom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangePrenom}
            value={EmployeeObject.prenom}
          />
        </div>
        <div>
          <small>Numero sécurité</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNumSec}
            type="number"
            value={EmployeeObject.NumSec}
          />
        </div>

        <div>
          <small>Etat</small>
          <br />
          <Select
            placeholder="selectionner un état"
            onChange={handleChangeStatus}
            defaultValue={EmployeeObject.Etat}
            style={{ width: 230 }}
          >
            <Option value="Incident">Incident</Option>
            <Option value="Ok">Ok</Option>
            <Option value="Non fait">Non fait</Option>
          </Select>
        </div>

        <div>
          <small>Disponible</small>
          <br />
          <Select
            placeholder="Disponibilité"
            onChange={handleChangeDisponible}
            defaultValue={EmployeeObject.Disponible ? "Oui" : "Non"}
            style={{ width: 230 }}
          >
            <Option value={true}>Oui</Option>
            <Option value={false}>Non</Option>
          </Select>
        </div>

        <br />
        <Button
          onClick={updateEmployee}
          type="primary"
          className="login-form-button"
        >
          Enregistrer
        </Button>
      </Modal>

      <div className="row" style={{ margin: "0 22px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Gestion des employés</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="row main-container" style={{  }}>
        <div className="col-2 noPadding right-panel" style={{}}>
          <List
            size="small"
            header={
              <div>
                <Icon style={{ marginRight: 10 }} type="user" />
                <b>Employés</b>
              </div>
            }
            dataSource={Employees}
            renderItem={item => (
              <List.Item
                className={`employee-item ${currentEmployee.id == item.id &&
                  "selected"}`}
                onClick={() => setcurrentEmployee(item)}
              >
                {item.username}
              </List.Item>
            )}
          />
        </div>
        <div className="col-9 noPadding">
          <Row style={{ margin: "0 19px" }}>
            <Col span={24}>
              <PageHeader
                style={{
                  border: "1px solid rgb(228, 243, 255)"
                }}
                className="primary"
                title={
                  <span>
                    <Icon type="user" theme="twoTone" />
                    Détail
                  </span>
                }
                extra={[<DropdownMenu key="more" />]}
              />
            </Col>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>Nom</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.nom}</p>
              </Col>
            </div>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>Prénom</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.prenom}</p>
              </Col>
            </div>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>N° Sécu</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.NumSec}</p>
              </Col>
            </div>

            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>État</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.Etat}</p>
              </Col>
            </div>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>Disponible</b>
                </p>
              </Col>
              <Col span={16}>
                <p>
                  {currentEmployee.Disponible ? (
                    <b className="green">Oui</b>
                  ) : (
                    <b className="red">Non</b>
                  )}
                </p>
              </Col>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};
