import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Breadcrumb, Icon, Collapse, Checkbox, Radio, Row, Col } from "antd";
import {} from "../Redux/MainReducer";
import moment from "../moment";

const { Panel } = Collapse;

const YearsOptions = [
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" }
];

const MonthsOptions = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" }
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
const listTriPar = [
  {
    label: "Employé",
    value: 1
  },
  {
    label: "Qantité de travail",
    value: 2
  },
  {
    label: "Date",
    value: 3
  }
];

export default () => {
  const [checkedYears, setcheckedYears] = useState([2019, 2020]);
  const [checkedMonth, setcheckedMonth] = useState([1]);
  const [checkedEmployee, setcheckedEmployee] = useState(listeEmployeeOptions);
  const [triModes, settriModes] = useState(3)

  const onChangeYear = checkedValues => {
    // let tmp = listInterventions.filter(item => {
    //   return checkedValues.find(e => moment(item.dateTime).year() === e);
    // });
    // setinterventions(tmp);
    // setcheckedYears(checkedValues);
    // console.log("tmp = ", tmp);
    // console.log("checked = ", checkedValues);
  };

  const onChangeMonth = checkedValues => {
    // let tmp = listInterventions.filter(item => {
    //   return checkedValues.find(e => moment(item.dateTime).month() === e);
    // });
    // setinterventions(tmp);
    // console.log("tmp = ", tmp);
    // setcheckedMonth(checkedValues);
  };

  /**
   * filtre by employee
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEmployeeFilter = checkedValues => {
    // console.log("checkedValues", checkedValues);
    // let tmp = listInterventions.filter(item => {
    //   return checkedValues.find(
    //     e => item.Employee === e || item.Employee === ""
    //   );
    // });
    // setinterventions(tmp);
    // console.log("tmp = ", tmp);
    // setcheckedEmployee(checkedValues);
  };

  /**
   *
   * @param {liste de} checkedValues
   */
  const onChangeTriMode = ({target}) => {
    console.log("checked = ",target.value)
    settriModes(target.value)
  };
  return (
    <div>
      <div className="row" style={{ margin: "0 22px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home" /> Accueil
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Synthèse</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="row main-container" style={{  }}>
        <div className="col-2 noPadding filtre-zone">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            // style={{ alignSelf: "flex-end", flex: 1 }}
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
          </Collapse>
        </div>
        <div className="col-8 noPadding ">
        <Row style={{ margin: "0 19px" }}>
        <Col span={24}>
          <h5 className="title-head" style={{ textAlign: "left" }}>
            Temps travailé
          </h5>
        </Col>
        <div className="info-row">
          <Col span={8}>
            <p>
              Lundi 13
            </p>
          </Col>
          <Col span={4}>
            <p>
              45
            </p>
          </Col>
          <Col span={12}>
            <p>11:23</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              Lundi 13
            </p>
          </Col>
          <Col span={4}>
            <p>
              45
            </p>
          </Col>
          <Col span={12}>
            <p>11:23</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              Samedi 16
            </p>
          </Col>
          <Col span={4}>
            <p>
              45
            </p>
          </Col>
          <Col span={12}>
            <p>11:23</p>
          </Col>
        </div>
        <div className="info-row">
          <Col span={8}>
            <p>
              Mercredi 20
            </p>
          </Col>
          <Col span={4}>
            <p>
              25
            </p>
          </Col>
          <Col span={12}>
            <p>11:23</p>
          </Col>
        </div>
        <div className="info-row total">
          <Col span={8}>
            <p>
             <b>Total</b>   
            </p>
          </Col>
          <Col span={4}>
            <p>
              214
            </p>
          </Col>
          <Col span={12}>
            <p>432:10</p>
          </Col>
        </div>

      </Row>
   
        </div>
        <div className="col-2 noPadding filtre-zone">
          <Collapse bordered={false} defaultActiveKey={["1"]}>
            {
              //   <span className="filtre-title">
              //   <Icon type="funnel-plot" /> Tri
              // </span>
            }
            <Panel
              header={
                `Trier par ${listTriPar[triModes-1].label }`
              }
              key="1"
            >
              <Radio.Group onChange={onChangeTriMode} value={triModes}>
                <Radio value={1}>
                  Employé
                </Radio>
                <Radio value={2}>
                  Quantité de travail
                </Radio>
                <Radio value={3}>
                  Date
                </Radio>
              </Radio.Group>
            </Panel>
          </Collapse>
          <Collapse bordered={false} defaultActiveKey={["1"]}>
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
          </Collapse>
        </div>
      </div>
    </div>
  );
};
