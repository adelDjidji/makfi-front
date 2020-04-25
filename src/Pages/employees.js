import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link} from "react-router-dom";

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

import * as Selectors from "../Redux/MainReducer";
import Api from "../Api/api";

const { Option } = Select;

const InitialEmployeeObject = {
  FirstName: null,
  LastName: null,
  SocialInsurranceNumber: null,
  State: null,
  Disponible: false
};

export default () => {
  const [currentEmployee, setcurrentEmployee] = useState({});
  const currentuser= useSelector(Selectors.selectCurrentUser)
  const [EmployeeObject, setEmployeeObject] = useState(InitialEmployeeObject);
  const [Employees, setEmployees] = useState([]);
  const [modalNew, setmodalNew] = useState(false);
  const [modalEdit, setmodalEdit] = useState(false);

  const [listeEmployee, setlisteEmployee] = useState([])
  listeEmployee.length==0 &&
  Api.get("Employees/GetEmployeesByGroup?employeesGroupID="+ currentuser.EmployeesGroupID)
  .then(res=>{
    console.log("res employees ", res.data);
    setlisteEmployee(res.data)
    setEmployees(res.data)
    setcurrentEmployee(res.data[0])
  });

  const supprimerEmployee = () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer cet employé?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        Api.delete("Employees/DeleteEmployee/"+ currentEmployee.ID)
          .then(res=>{
            console.log("res delete =",res)

            let listnew = listeEmployee.filter(
              item => currentEmployee.ID !== item.ID
            );
            setEmployees(listnew);
            listnew.length > 0
              ? setcurrentEmployee(listnew[0])
              : setcurrentEmployee(null);
              message.success("L'employé a été supprimé avec succès")

          })
      },
      onCancel() {
        console.log("Cancel");
      }
    });

  const newEmployeeClick = () => {
    setmodalNew(true);
  };

  const addEmployee = () => {
    Api.post("Employees/PostEmployee",
    {
      FirstName: EmployeeObject.FirstName,
      LastName: EmployeeObject.LastName,
      SocialInsurranceNumber: EmployeeObject.SocialInsurranceNumber,
      ProfilePictureUrl: "https://cdn1.vectorstock.com/i/thumb-large/46/55/person-gray-photo-placeholder-woman-vector-22964655.jpg",
      Username: EmployeeObject.FirstName + EmployeeObject.LastName,
      Password: "password",
      EmployeeGroupID: currentuser.EmployeesGroupID
    })
    .then(res=>{
      console.log("res insert", res);
      Api.get("Employees/GetEmployeesByGroup?employeesGroupID="+ currentuser.EmployeesGroupID)
      .then(res=>{
        setEmployees(res.data)
        message.success("Employé ajouté avec succès");
      })
     hideModalNew();      
    })

  };

  const hideModalNew = () => {
    setmodalNew(false);
    setEmployeeObject(InitialEmployeeObject);
  };

  //change numero securite
  const handleChangeNumSec = e => {
    var val = e.target.value;
    setEmployeeObject({ ...EmployeeObject, SocialInsurranceNumber: val });
  };
  //change nom
  const handleChangeNom = e => {
    console.log("change nom", e.target.value);
    var val = e.target.value;
    setEmployeeObject({ ...EmployeeObject, LastName: val });
  };
  //change prenom
  const handleChangePrenom = e => {
    var val = e.target.value;
    console.log("change prenom", e.target.value);
    setEmployeeObject({ ...EmployeeObject, FirstName: val });
  };
  //change status
  function handleChangeStatus(value) {
    setEmployeeObject({ ...EmployeeObject, State: value });
  }
  //change disponible
  function handleChangeDisponible(value) {
    setEmployeeObject({ ...EmployeeObject, Disponible: value });
  }

  const menu = () => {
    return (
      <Menu>
        <Menu.Item onClick={newEmployeeClick}><Icon type="plus-circle" /> Nouveau</Menu.Item>
        <Menu.Item onClick={editEmployeeClick}><Icon type="edit" /> Modifier</Menu.Item>
        {currentEmployee.ID !== null && (
          <Menu.Item className="red" onClick={supprimerEmployee}>
          <Icon type="delete" /> Supprimer
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const DropdownMenu = () => {
    return (
      <Dropdown key="more" overlay={menu} placement="topLeft">
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
    Api.put("Employees/PutEmployee", { ...EmployeeObject, ID: currentEmployee.ID })
    .then(res=>{
      console.log("res update ", res);
      message.success("les informations de l'employé ont été enregistré avec succès")
    })
    let tmp = listeEmployee.map(item => {
      if (item.ID === currentEmployee.ID)
        return { ...EmployeeObject, ID: currentEmployee.ID };
      else return item;
    });
    console.log("tmp after edit =", tmp);
    setcurrentEmployee({ ...EmployeeObject, ID: currentEmployee.ID });
    setEmployees(tmp);
    setmodalEdit(false);
    
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
            value={EmployeeObject.LastName}
          />
        </div>
        <div>
          <small>Prénom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangePrenom}
            value={EmployeeObject.FirstName}
          />
        </div>
        <div>
          <small>Numero sécurité</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNumSec}
            type="number"
            value={EmployeeObject.SocialInsurranceNumber}
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
            value={EmployeeObject.LastName}
          />
        </div>
        <div>
          <small>Prénom</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangePrenom}
            value={EmployeeObject.FirstName}
          />
        </div>
        <div>
          <small>Numero sécurité</small>
          <br />
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNumSec}
            type="number"
            value={EmployeeObject.SocialInsurranceNumber}
          />
        </div>

        <div>
          <small>Etat</small>
          <br />
          <Select
            placeholder="selectionner un état"
            onChange={handleChangeStatus}
            defaultValue={EmployeeObject.State}
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
                className={`employee-item ${currentEmployee.ID === item.ID &&
                  "selected"}`}
                onClick={() => setcurrentEmployee(item)}
              >
                {item.FirstName} {item.LastName}
              </List.Item>
            )}
          />
        </div>
        <div className="col-9 noPadding">
          <Row style={{ margin: "0 58px 0 19px" }}>
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
                <p>{currentEmployee.LastName}</p>
              </Col>
            </div>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>Prénom</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.FirstName}</p>
              </Col>
            </div>
            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>N° Sécu</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.SocialInsurranceNumber}</p>
              </Col>
            </div>

            <div className="info-row">
              <Col span={8}>
                <p>
                  <b>État</b>
                </p>
              </Col>
              <Col span={16}>
                <p>{currentEmployee.State}</p>
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
