import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import {
  selectInterventions,
  setListeInterventions
} from "../Redux/MainReducer";

import InterventionItem from "../Components/InterventionItem";
import {
  Breadcrumb,
  Icon,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Collapse,
  Card,
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

import moment from "../moment";
import { listeEtat } from "../mocks";

const { Option } = Select;
const { Panel } = Collapse;
const { Meta } = Card;

const YearsOptions = [
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" }
];

const MonthsOptions = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" }
];

function Home() {
  const dispatch = useDispatch();
  const listInterventions = useSelector(selectInterventions);

  const [interventions, setinterventions] = useState(listInterventions);
  const [checkedYears, setcheckedYears] = useState([2019, 2020]);
  const [checkedMonth, setcheckedMonth] = useState([1]);
  const [selectedInterventions, setselectedInterventions] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [InterventionObject, setInterventionObject] = useState({
    dateTime: null,
    status: null,
    comment: null,
    etage: null
  });

  const onChangeYear = checkedValues => {
    let tmp = listInterventions.filter(item => {
      return checkedValues.find(e => moment(item.dateTime).year() === e);
    });
    setinterventions(tmp);
    setcheckedYears(checkedValues);
    console.log("tmp = ", tmp);
    console.log("checked = ", checkedValues);
  };
  const onChangeMonth = checkedValues => {
    let tmp = listInterventions.filter(item => {
      return checkedValues.find(e => moment(item.dateTime).month() === e);
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    setcheckedMonth(checkedValues);
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
    let Ids = interventions.map(item => item.id);
    console.log("IDS=", Ids);
    if (Ids.length == selectedInterventions.length)
      setselectedInterventions([]);
    else setselectedInterventions(Ids);
  };

  const updateInterventionState = newStatus => {
    if (selectedInterventions.length !== 0) {
      let tmp = interventions.map(item => {
        if (selectedInterventions.indexOf(item.id) >= 0)
          return { ...item, status: newStatus };
        else return item;
      });
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
          <Menu.Item onClick={supprimerIntervention}>
            Supprimer
          </Menu.Item>
        )}
        {selectedInterventions.length === 1 && (
          <Menu.Item>
            <Link to={"intervention/" + idIntervention}>Détails</Link>
          </Menu.Item>
        )}
        {selectedInterventions.length >= 1 && (
          <Menu.Item onClick={editComment}>Modifier commentaire</Menu.Item>
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
      title: 'Etes-vous sur de supprimer cet intervention?',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        let listnew = interventions.filter(item=>selectedInterventions.indexOf(item.id)<0)
        setinterventions(listnew)
        setselectedInterventions([])
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  const editComment = () => {
    setmodalEdit(!modalEdit);
    let { comment } = interventions.filter(
      e => e.id == selectedInterventions[0]
    )[0];
    console.log("id=", selectedInterventions[0]);
    console.log("comment=", comment);
    setcommentText(comment);
  };

  const saveComment = () => {
    let tmp = interventions.map(item => {
      if (selectedInterventions.indexOf(item.id) >= 0)
        return { ...item, comment: commentText };
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
    var newID = interventions.length + 2;
    setinterventions([...interventions, { ...InterventionObject, id: newID }]);
    console.log("to add", { ...InterventionObject, id: newID });
    message.success("intervention ajoutée avec succès");
    hideModalNew();
  };

  const hideModalNew = () => {
    setmodalNew(false);
    setInterventionObject({
      dateTime: null,
      status: "",
      comment: "",
      etage: null
    });
    setcommentText("");
  };

  //change coment
  const handleChange = e => {
    var val = e.target.value;
    setcommentText(val);
    setInterventionObject({ ...InterventionObject, comment: val });
  };

  const onChangeDatetime = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setInterventionObject({ ...InterventionObject, dateTime: dateString });
  };

  function handleChangeStatus(value) {
    console.log(`selected ${value}`);
    setInterventionObject({ ...InterventionObject, status: value });
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
          <small>Date de l'intervention</small>
          <br />
          <DatePicker
            showTime={{ format: "HH:mm" }}
            placeholder="Select Time"
            format="YYYY-MM-DD HH:mm"
            onChange={onChangeDatetime}
            // onOk={onOk}
          />
        </div>

        <div>
          <small>Etat</small>
          <br />
          <Select onChange={handleChangeStatus} style={{ width: 230 }}>
            <Option value="Incident">Incident</Option>
            <Option value="Ok">Ok</Option>
            <Option value="Non fait">Non fait</Option>
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
          onClick={addIntervention}
          type="primary"
          className="login-form-button"
        >
          Ajouter
        </Button>
      </Modal>

      <div className="row" 
      // style={{ margin: 0 }}
      >
        <div className="col-2" style={{paddingLeft: "20pt"}}>
          <div className="links">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <Icon type="home" /> Accueil
                </Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item>Planning</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <List
            size="small"
            header={
              <div>
                <Icon type="swap" /> Etat
              </div>
            }
            bordered
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
          <hr className="transparent" />
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
                <InterventionItem
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
        <div className="col-2"
          // style={{ width: "40%", display: "flex", flexDirection: "column" }}
        >
          <div>
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              style={{ alignSelf: "flex-end", flex: 1 }}
            >
              <span className="filtre-title">
                <Icon type="funnel-plot" /> Filtres
              </span>
              <Panel header={`Année : ${checkedYears}`} key="1">
                <Checkbox.Group
                  options={YearsOptions}
                  defaultValue={[2019, 2020]}
                  onChange={onChangeYear}
                />
              </Panel>
              <Panel
                header={`${checkedMonth.map(i =>
                  moment()
                    .month(i - 1)
                    .format("MMM")
                )}`}
                key="2"
              >
                <Checkbox.Group
                  options={MonthsOptions}
                  defaultValue={[1]}
                  onChange={onChangeMonth}
                />
              </Panel>
              <Panel header="Semaine de 19" key="3">
                <Checkbox>Semaine de 19</Checkbox>
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
