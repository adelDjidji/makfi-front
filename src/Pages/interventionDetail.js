import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { selectEntretiens, setCurrentIntervention } from "../Redux/MainReducer";

import EntretienItem from "../Components/EntretienItem";
import {
  Breadcrumb,
  Icon,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Collapse,
  DatePicker,
  List,
  Modal,
  Checkbox,
  Input,
  message,
  Select
} from "antd";

import moment from "../moment";

const { Panel } = Collapse;
const { Option } = Select;

const YearsOptions = [
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" }
];

const MonthsOptions = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" }
];
const InitialEntetienObject = {
  RoomGroup: null,
  Comment: null,
  InterventionID: null,
  Employee: null,
  State: false
};

const listEtages = [
  {
    ID: 1,
    title: "Reception"
  },
  {
    ID: 2,
    title: "Etage A1"
  },
  {
    ID: 3,
    title: "Etage A2"
  },
  {
    ID: 4,
    title: "Etage B1"
  },
  {
    ID: 5,
    title: "Etage B2"
  },
  {
    ID: 6,
    title: "Etage C"
  }
];

const listeEmployee = [
  {
    id: 1,
    username: "Daniel.B",
    nom: "Daniel",
    prenom: "Bernard"
  },
  {
    id: 2,
    username: "Angela.B",
    nom: "Angela",
    prenom: "Bernard"
  },
  {
    id: 3,
    username: "Sofia.D",
    nom: "Sofia",
    prenom: "Doulé"
  }
];

const listEntretiens = [
  {
    ID: 1,
    RoomGroup: "Etage A1",
    Comment: "commentaire 1",
    InterventionID: 23,
    Employee: "Sofia.D",
    State: false
  },
  {
    ID: 2,
    RoomGroup: "Etage A2",
    Comment: "commentaire",
    InterventionID: 23,
    Employee: "Daniel.B",
    State: true
  },
  {
    ID: 3,
    RoomGroup: "Etage C",
    Comment: "",
    InterventionID: 23,
    Employee: "",
    State: true
  }
];

const listeEtagesOptions = listEtages.map(i => {
  return { label: i.title, value: i.title };
});

const listeEtatsOptions = [
  { label: "valide", value: true },
  { label: "non-valide", value: false }
];

const listeEmployeeOptions = listeEmployee.map(i => {
  if (i.username !== "")
    return {
      label: i.username,
      value: i.username
    };
  else
    return {
      label: "NUL",
      value: ""
    };
});

export default ({ match }) => {
  const dispatch = useDispatch();

  const [checkedEtages, setcheckedEtages] = useState(listeEtagesOptions);
  const [checkedEtats, setcheckedEtats] = useState(listeEtatsOptions);
  const [checkedEtatsString, setcheckedEtatsString] = useState("");
  const [checkedEmployee, setcheckedEmployee] = useState(listeEmployeeOptions);
  
  const [selectedEntretiens, setselectedEntretiens] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [EntretienObject, setEntretienObject] = useState(InitialEntetienObject);
  
  console.log("id = ", match.params.id);

  dispatch(setCurrentIntervention(`of ID ${match.params.id}`));

  //selectionner une intervention
  const selectEntretien = id => {
    if (selectedEntretiens.indexOf(id) >= 0) {
      let tmp = selectedEntretiens.filter(item => item !== id);
      setselectedEntretiens(tmp);
    } else {
      setselectedEntretiens([...selectedEntretiens, id]);
    }
  };

  const selectAllEntretien = () => {
    let Ids = Entretiens.map(item => item.ID);
    if (Ids.length == selectedEntretiens.length) setselectedEntretiens([]);
    else setselectedEntretiens(Ids);
  };

  const [Entretiens, setEntretiens] = useState(listEntretiens);

  /**
   * filtre entretiens by Etage
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtageFilter = checkedValues => {
    console.log("checkedValues",checkedValues)
    let tmp = listEntretiens.filter(item => {
      return checkedValues.indexOf(item.RoomGroup)>=0
    });
    setEntretiens(tmp);
    console.log("tmp = ", tmp);
    setcheckedEtages(checkedValues);
  };

  /**
   * filtre entretiens by Etat
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtatFilter = checkedValues => {
    let tmp= listEntretiens.filter(item=>{
      return checkedValues.indexOf(item.State)>=0
    })

    setEntretiens(tmp);
    console.log("tmp = ", tmp);
    setcheckedEtats(checkedValues);
    setcheckedEtatsString(mapListeEtat(checkedValues));

  };

  const mapListeEtat=(list)=>{
    console.log("liste", list)
    /**
     * true = valide
     * false = non-valide
     */
    let tmp = list.map(i=>{
      if(i) return "valide" 
      else return "non-valide"
    })
    return tmp.join(" ,");
  }

  /**
   * filtre entretiens by employee
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEmployeeFilter = checkedValues => {
    console.log("checkedValues", checkedValues);
    let tmp = listEntretiens.filter(item => {
      return checkedValues.find(
        e => item.Employee === e || item.Employee === ""
      );
    });
    setEntretiens(tmp);
    console.log("tmp = ", tmp);
    setcheckedEmployee(checkedValues);
  };

  /**
   * update the employee affected to entretien
   * @param {object of employe} employee
   */
  const updateEntretienEmployee = employee => {
    if (selectedEntretiens.length > 0) {
      let tmp = Entretiens.map(item => {
        if (selectedEntretiens.indexOf(item.ID) >= 0)
          return { ...item, Employee: employee.username };
        else return item;
      });
      setEntretiens(tmp);
      message.success("employé affecté avec succès");
      setselectedEntretiens([]);
    } else {
      message.warning(`Veuillez selectionner un entretien d'abord.`);
    }
  };

  const editComment = () => {
    setmodalEdit(!modalEdit);
    let { Comment } = Entretiens.filter(e => e.ID == selectedEntretiens[0])[0];
    console.log("id=", selectedEntretiens[0]);
    console.log("comment=", Comment);
    setcommentText(Comment);
  };

  const menu = () => {
    var entretienID;
    if (selectedEntretiens.length >= 1) {
      entretienID = selectedEntretiens[0];
    }
    return (
      <Menu>
        <Menu.Item onClick={newEntretien}>Nouveau</Menu.Item>
        {selectedEntretiens.length === 1 && (
          <Menu.Item>
            <Link to={"/roomGroup/" + entretienID}>Détails</Link>
          </Menu.Item>
        )}
        {selectedEntretiens.length >= 1 && (
          <Menu.Item onClick={editComment}>Modifier commentaire</Menu.Item>
        )}
        {selectedEntretiens.length === 1 && (
          <Menu.Item className="red" onClick={supprimerEntretien}>
            Supprimer
          </Menu.Item>
        )}
        <Menu.Item onClick={selectAllEntretien}>Sélectionner tous</Menu.Item>
      </Menu>
    );
  };

  const DropdownMenu = () => {
    return (
      <Dropdown key="more" overlay={menu}>
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

  const supprimerEntretien = () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer cet entretien?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        let listnew = Entretiens.filter(
          item => selectedEntretiens.indexOf(item.ID) < 0
        );
        setEntretiens(listnew);
        setselectedEntretiens([]);
      },
      onCancel() {
        console.log("Cancel");
      }
    });

  const changeENtretienState = e => {
    var newState = e.target.checked;
    var id = e.target.value;
    let tmp = Entretiens.map(item => {
      if (item.ID == id) return { ...item, State: newState };
      else return item;
    });
    setEntretiens(tmp);
    message.success("Etat d'entretien changé avec succès");
  };

  const saveComment = () => {
    let tmp = Entretiens.map(item => {
      if (selectedEntretiens.indexOf(item.ID) >= 0)
        return { ...item, Comment: commentText };
      else return item;
    });
    setEntretiens(tmp);
    message.success("commentaire modifié avec succès");
    setselectedEntretiens([]);
    hideModal();
    setcommentText("");
  };

  const hideModal = () => {
    setmodalEdit(false);
  };

  const newEntretien = () => {
    setmodalNew(true);
  };

  const addEntretien = () => {
    var newID = Entretiens.length + 2;
    setEntretiens([...Entretiens, { ...EntretienObject, ID: newID }]);
    console.log("to add", { ...EntretienObject, ID: newID });
    message.success("intervention ajoutée avec succès");
    hideModalNew();
  };

  const hideModalNew = () => {
    setmodalNew(false);
    setEntretienObject(InitialEntetienObject);
    setcommentText("");
  };

  //change coment
  const handleChange = e => {
    var val = e.target.value;
    setcommentText(val);
    setEntretienObject({ ...EntretienObject, Comment: val });
  };

  const handleChangeEmp = val => {
    setEntretienObject({ ...EntretienObject, Employee: val });
  };
  const handleChangeEtage = val => {
    setEntretienObject({ ...EntretienObject, RoomGroup: val });
  };

  return (
    <div>
      <Modal
        title="Modifier le commentaire"
        visible={modalEdit}
        onOk={saveComment}
        onCancel={hideModal}
      >
        <small>Introduire un commentaire</small>
        <Input
          onChange={handleChange}
          value={commentText}
          placeholder="commentaire"
        />
      </Modal>
      <Modal
        title="Ajouter une intervention"
        visible={modalNew}
        onOk={addEntretien}
        onCancel={hideModalNew}
        footer={[]}
      >
        <div>
          <small>Employé</small>
          <br />
          <Select onChange={handleChangeEmp} style={{ width: 230 }}>
            {listeEmployee.map(emp => (
              <Option value={emp.username}>{emp.username}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Etage</small>
          <br />
          <Select onChange={handleChangeEtage} style={{ width: 230 }}>
            {listEtages.map(etage => (
              <Option value={etage.title}>{etage.title}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Commentaire</small>
          <br />
          <Input
            onChange={handleChange}
            value={commentText}
            placeholder="commentaire"
          />
        </div>
        <br />
        <Button
          onClick={addEntretien}
          type="primary"
          className="login-form-button"
        >
          Ajouter
        </Button>
      </Modal>

      <div className="row" style={{ margin: "0 22px" }}>
        <div className="links">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">
                <Icon type="home" /> Accueil
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/interventions">liste des interventions</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Detail</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="row main-container" style={{  }}>
        <div className="col-2 noPadding right-panel">
          <List
            size="small"
            header={
              <div>
                <Icon style={{ marginRight: 10}} type="user" /><b>Employés</b> 
              </div>
            }
            dataSource={listeEmployee}
            renderItem={item => (
              <List.Item
                className="state-item"
                onClick={updateEntretienEmployee.bind(this, item)}
              >
                {item.username}
              </List.Item>
            )}
          />
        </div>
        <div className="col-8 noPadding">
          <div className="">
            <PageHeader
              style={{
                border: "1px solid rgb(228, 243, 255)"
              }}
              title={
                <span>
                  <Icon type="calendar" theme="twoTone" />
                  Entretien des chambres
                </span>
              }
              extra={[<DropdownMenu key="more" />]}
            />
            <div className="table-body">
              {Entretiens.map(item => (
                <EntretienItem
                  entretien={item}
                  onchangeState={changeENtretienState}
                  selected={selectedEntretiens.indexOf(item.ID) >= 0}
                  onClick={selectEntretien.bind(this, item.ID)}
                />
              ))}
              {
                //   Entretiens.length == 0 && (
                //   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                // )
              }
            </div>
          </div>
        </div>
        <div
          className="col-2 noPadding filtre-zone"
          // style={{ width: "40%", display: "flex", flexDirection: "column" }}
        >
          <div>
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              // style={{ alignSelf: "flex-end", flex: 1 }}
            >
              <span className="filtre-title">
                <Icon type="funnel-plot" /> Filtres
              </span>

              <Panel
                header={
                  checkedEmployee.length == listeEmployee.length
                    ? "Tous les employés"
                    : `${checkedEmployee}`
                }
                key="1"
              >
                <Checkbox.Group
                  options={listeEmployeeOptions}
                  defaultValue={listeEmployeeOptions.map(i => i.value)}
                  onChange={onChangeEmployeeFilter}
                />
              </Panel>
              <Panel
                header={
                  checkedEtages.length == listEtages.length
                    ? "Tous les étages"
                    : `${checkedEtages}`
                }
                key="2"
              >
                <Checkbox.Group
                  options={listeEtagesOptions}
                  defaultValue={listeEtagesOptions.map(i => i.value)}
                  onChange={onChangeEtageFilter}
                />
              </Panel>
              <Panel
                header={
                  checkedEtats.length == 2
                    ? "Tous les états"
                    : `${checkedEtatsString}`
                }
                key="3"
              >
                <Checkbox.Group
                  options={listeEtatsOptions}
                  defaultValue={listeEtatsOptions.map(i => i.value)}
                  onChange={onChangeEtatFilter}
                />
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};
