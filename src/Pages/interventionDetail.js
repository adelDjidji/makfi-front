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
  message
} from "antd";

import moment from "../moment";

import "../styles/App.css";

import { listeEtat } from "../mocks";

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

export default ({match}) => {
  const dispatch = useDispatch();
  const listInterventions = useSelector(selectInterventions);

  const [interventions, setinterventions] = useState(listInterventions);
  const [checkedYears, setcheckedYears] = useState([2019, 2020]);
  const [checkedMonth, setcheckedMonth] = useState([1]);
  const [selectedInterventions, setselectedInterventions] = useState([]);

  console.log("id = ",match.params.id)
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
    console.log("res= ", selectedInterventions.indexOf(id))
    if (selectedInterventions.indexOf(id)>=0) {
      let tmp = selectedInterventions.filter(item=>item!==id)
      setselectedInterventions(tmp);
    } else {
      setselectedInterventions([...selectedInterventions, id]);
    }
  };
  const selectAllIntervention = () => {
    let Ids= interventions.map(item=>item.id)
    console.log("IDS=", Ids)
    if(Ids.length==selectedInterventions.length) setselectedInterventions([]);
    else setselectedInterventions(Ids);
    
  };

  const updateInterventionState = (newStatus) => {
    if (selectedInterventions.length !== 0) {
      let tmp = interventions.map(item => {
        if (selectedInterventions.indexOf(item.id)>=0) return { ...item, status: newStatus };
        else return item;
      });
      setinterventions(tmp);
      message.success("Etat modifié avec succès");
      setselectedInterventions([]);
    } else {
      message.warning(`Veuillez selectionner une intervention d'abord.`);
    }
  };
 

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="#"
      >
        Détails
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        rel="noopener noreferrer"
        href="#"
      >
        Modifer état
      </a>
    </Menu.Item>
    <Menu.Item>
      <a rel="noopener noreferrer" href="#">
        Modifier commentaire
      </a>
    </Menu.Item>
    <Menu.Item onClick={selectAllIntervention}>
        Sélectionner tous
    </Menu.Item>
  </Menu>
);

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

  return (
    <div>
      <div className="row" style={{margin:0}}>
        <div className="col-3">
          <div className="links">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home"><Icon type="home" /> Accueil</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/interventions">Interventions</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Detail</Breadcrumb.Item>
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
              onClick={updateInterventionState.bind(
                this,
                item.status
              )}
            >
              <Badge status={item.status} />
              {item.text}
            </List.Item>
          )}
        />
        </div>
        <div className="col-7">
        <hr className="transparent" />
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
            {
            //   interventions.map(item => (
            //   <InterventionItem
            //     intervention={item}
            //     selected={selectedInterventions.indexOf(item.id)>=0}
            //     onClick={selectIntervention.bind(this, item.id)}
            //   />
            // ))
          }
            {
            //   interventions.length == 0 && (
            //   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            // )
          }
          </div>
        </div>
        </div>
        <div className="col-3" style={{ width: "40%", display: "flex", flexDirection: "column" }}>
        
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
