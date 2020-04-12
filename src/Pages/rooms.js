import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {
  selectChambreInterventions,
  setListeInterventions
} from "../Redux/MainReducer";

import InterventionRoomItem from "../Components/InterventionRoomItem";
import {
  Breadcrumb,
  Icon,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Collapse,
  List,
  Badge,
  Checkbox,
  Empty,
  message,
  Modal,
  Input,
  DatePicker,
  Select
} from "antd";

import { listeEtat } from "../mocks";

const { Option } = Select;

const { Panel } = Collapse;

const InitialEntetienObject = {
  NumeroChambre: null,
  RoomGroup: null,
  Comment: null,
  Status: null,
  Employee: null
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

const listeEtagesOptions = listEtages.map(i => {
  return { label: i.title, value: i.title };
});

const listeEtatsOptions = [
  { label: "Ok", value: "success" },
  { label: "Incident", value: "error" },
  { label: "Non-fait", value: "default" }
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

export default () => {
  const dispatch = useDispatch();

  const listInterventions = useSelector(selectChambreInterventions);
  const [interventions, setinterventions] = useState(listInterventions);
  const [checkedEtages, setcheckedEtages] = useState(listeEtagesOptions);
  const [checkedEtats, setcheckedEtats] = useState(listeEtatsOptions);
  const [checkedEtatsString, setcheckedEtatsString] = useState("");
  const [checkedEmployee, setcheckedEmployee] = useState(listeEmployeeOptions);
  const [selectedInterventions, setselectedInterventions] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [InterventionObject, setInterventionObject] = useState(
    InitialEntetienObject
  );

  /**
   * filtre entretiens by Etage
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtageFilter = checkedValues => {
    let tmp = listInterventions.filter(item => {
      return checkedValues.indexOf(item.RoomGroup) >= 0;
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    setcheckedEtages(checkedValues);
  };

  /**
   * filtre entretiens by Etat
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtatFilter = checkedValues => {
    console.log("checkedValues", checkedValues);
    let tmp = listInterventions.filter(item => {
      return checkedValues.indexOf(item.Status) >= 0;
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    setcheckedEtats(checkedValues);
    setcheckedEtatsString(mapListeEtat(checkedValues));
  };

  const mapListeEtat = list => {
    /**
     * true = valide
     * false = non-valide
     */
    console.log("list =", list);
    let tmp = list.map(i => {
      switch (i) {
        case "error":
          return "Incident";
        case "success":
          return "Ok";
        case "default":
          return "Non-fait";
      }
    });
    return tmp.join(" ,");
  };

  /**
   * filtre entretiens by employee
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEmployeeFilter = checkedValues => {
    console.log("checkedValues", checkedValues);
    let tmp = listInterventions.filter(item => {
      return checkedValues.find(
        e => item.Employee === e || item.Employee === ""
      );
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    setcheckedEmployee(checkedValues);
  };

  //selectionner une intervention
  const selectIntervention = id => {
    console.log("res= ", selectedInterventions.indexOf(id));
    if (selectedInterventions.indexOf(id) >= 0) {
      let tmp = selectedInterventions.filter(item => item !== id);
      setselectedInterventions(tmp);
    } else {
      setselectedInterventions([...selectedInterventions, id]);
    }
  };

  const selectAllIntervention = () => {
    let Ids = listInterventions.map(item => item.id);
    console.log("IDS=", Ids);
    if (Ids.length == selectedInterventions.length)
      setselectedInterventions([]);
    else setselectedInterventions(Ids);
  };

  const updateInterventionState = newStatus => {
    console.log('selectedInterventions', selectedInterventions)
    if (selectedInterventions.length !== 0) {
      let tmp = listInterventions.map(item => {
        if (selectedInterventions.indexOf(item.id) >= 0)
          return { ...item, Status: newStatus };
        else return item;
      });
      console.log("tmp", tmp);
      setinterventions(tmp);
      message.success("Etat modifié avec succès");
      setselectedInterventions([]);
    } else {
      message.warning(`Veuillez selectionner une intervention d'abord.`);
    }
  };

  const menu = () => {
    var idIntervention;
    if (selectedInterventions.length >= 1) {
      idIntervention = selectedInterventions[0];
    }
    return (
      <Menu>
        <Menu.Item onClick={newIntervention}>Nouveau</Menu.Item>

        {selectedInterventions.length === 1 && (
          <Menu.Item>
            <Link to={"/room/" + idIntervention}>Détails</Link>
          </Menu.Item>
        )}
        {selectedInterventions.length >= 1 && (
          <Menu.Item onClick={editComment}>Modifier commentaire</Menu.Item>
        )}
        {selectedInterventions.length === 1 && (
          <Menu.Item className="red" onClick={supprimerIntervention}>
            Supprimer
          </Menu.Item>
        )}
        <Menu.Item onClick={selectAllIntervention}>Sélectionner tous</Menu.Item>
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

  const supprimerIntervention = () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer cet intervention?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        let listnew = listInterventions.filter(
          item => selectedInterventions.indexOf(item.id) < 0
        );
        setinterventions(listnew);
        setselectedInterventions([]);
      },
      onCancel() {
        console.log("Cancel");
      }
    });

  const editComment = () => {
    setmodalEdit(!modalEdit);
    let { Comment } = listInterventions.filter(
      e => e.id == selectedInterventions[0]
    )[0];
    console.log("id=", selectedInterventions[0]);
    console.log("comment=", Comment);
    setcommentText(Comment);
  };

  /**
   * update comment of selected interventions
   */
  const saveComment = () => {
    let tmp = listInterventions.map(item => {
      if (selectedInterventions.indexOf(item.id) >= 0)
        return { ...item, Comment: commentText };
      else return item;
    });
    setinterventions(tmp);
    message.success("commentaire modifié avec succès");
    setselectedInterventions([]);
    hideModal();
    setcommentText("");
  };

  const hideModal = () => {
    setmodalEdit(false);
  };

  const newIntervention = () => {
    setmodalNew(true);
  };

  const addIntervention = () => {
    var newID = listInterventions.length + 2;
    setinterventions([
      ...listInterventions,
      { ...InterventionObject, id: newID }
    ]);
    console.log("to add", { ...InterventionObject, id: newID });
    message.success("intervention ajoutée avec succès");
    hideModalNew();
  };

  const hideModalNew = () => {
    setmodalNew(false);
    setInterventionObject(InitialEntetienObject);
    setcommentText("");
  };

  //change coment
  const handleChange = e => {
    var val = e.target.value;
    setcommentText(val);
    setInterventionObject({ ...InterventionObject, Comment: val });
  };
  //change numero chambre
  const handleChangeNumero = e => {
    var val = e.target.value;
    setInterventionObject({ ...InterventionObject, NumeroChambre: val });
  };
  //change Room group
  const handleChangeRoomGroup = val => {
    setInterventionObject({ ...InterventionObject, RoomGroup: val });
  };
  //change Employee
  const handleChangeEmployee = val => {
    setInterventionObject({ ...InterventionObject, Employee: val });
  };
  //change status
  function handleChangeStatus(value) {
    setInterventionObject({ ...InterventionObject, Status: value });
  }

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
        onOk={addIntervention}
        onCancel={hideModalNew}
        footer={[]}
      >
        <div>
          <small>Numero de la chambre</small>
          <br />
          <Input
          style={{ width: 230 }}
            onChange={handleChangeNumero}
            type="number"
            value={InterventionObject.NumeroChambre}
          />
        </div>

        <div>
          <small>Etage</small>
          <br />
          <Select placeholder="selectionner un étage" onChange={handleChangeRoomGroup} style={{ width: 230 }}>
            {listEtages.map(item => (
              <Option value={item.title}>{item.title}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Employé</small>
          <br />
          <Select placeholder="selectionner l'employé" onChange={handleChangeEmployee} style={{ width: 230 }}>
            {listeEmployee.map(item => (
              <Option value={item.username}>{item.username}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Etat</small>
          <br />
          <Select placeholder="selectionner un état" onChange={handleChangeStatus} style={{ width: 230 }}>
            <Option value="error">Incident</Option>
            <Option value="success">Ok</Option>
            <Option value="default">Non fait</Option>
          </Select>
        </div>

        <div>
          <small>Commentaire</small>
          <br />
          <Input
          style={{ width: 230 }}
            onChange={handleChange}
            value={commentText}
            placeholder="Commentaire"
          />
        </div>
        <br />
        <Button
          onClick={addIntervention}
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

            <Breadcrumb.Item>Chambres</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="row main-container" style={{  }}>
        <div className="col-2 noPadding right-panel" style={{  }}>
          <List
            size="small"
            header={
              <div>
                <Icon type="swap" style={{ marginRight: 10 }}  /> Etat
              </div>
            }
            dataSource={listeEtat}
            renderItem={item => (
              <List.Item
                className="state-item"
                onClick={updateInterventionState.bind(this, item.status)}
              >
                <Badge status={item.status} />
                {item.text}
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
                  Calendrier des interventions
                </span>
              }
              extra={[<DropdownMenu key="more" />]}
            />
            <div className="table-body">
              {interventions.map(item => (
                <InterventionRoomItem
                  intervention={item}
                  selected={selectedInterventions.indexOf(item.id) >= 0}
                  onClick={selectIntervention.bind(this, item.id)}
                />
              ))}
              {interventions.length == 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        </div>
        <div className="col-2 noPadding filtre-zone">
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
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
                  checkedEtats.length == 3
                    ? "Tous les états"
                    : checkedEtats.length == 0
                    ? "Aucun état"
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
  );
};
