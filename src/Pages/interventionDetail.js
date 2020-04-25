import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as Selectors  from "../Redux/MainReducer";

import EntretienItem from "../Components/EntretienItem";
import {
  Breadcrumb,
  Icon,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Collapse,
  List,
  Modal,
  Checkbox,
  Input,
  message,
  Select,
  Spin
} from "antd";

import Api from "../Api/api";

const { Panel } = Collapse;
const { Option } = Select;

const InitialEntetienObject = {
  RoomGroupID: null,
  Comment: null,
  InterventionID: null,
  EmployeeID: null,
  State: false
};

const listeEtatsOptions = [
  { label: "valide", value: true },
  { label: "non-valide", value: false }
];



export default ({ match }) => {
  const currentuser= useSelector(Selectors.selectCurrentUser)
  const [checkedEtages, setcheckedEtages] = useState([]);
  const [checkedEtats, setcheckedEtats] = useState(listeEtatsOptions);
  const [checkedEtatsString, setcheckedEtatsString] = useState("");
  const [checkedEmployee, setcheckedEmployee] = useState([]);
  
  const [selectedEntretiens, setselectedEntretiens] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [EntretienObject, setEntretienObject] = useState(InitialEntetienObject);
  
  

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
    if (Ids.length === selectedEntretiens.length) setselectedEntretiens([]);
    else setselectedEntretiens(Ids);
  };

  console.log("id = ", match.params.id);



  const [Entretiens, setEntretiens] = useState([]);
  const [listEntretiens, setlistEntretiens] = useState([]);
  const [loading, setloading] = useState(true)
  listEntretiens.length==0 && loading &&
  Api.get("Entretiens/GetEntretiens?InterventionID="+ match.params.id)
  .then(res=>{
    console.log("res entretiens ", res.data);
    setlistEntretiens(res.data)
    setEntretiens(res.data)
    setloading(false)
    
  })

  const [listeEmployee, setlisteEmployee] = useState([])
  const  [listeEmployeeOptions, setlisteEmployeeOptions] = useState([])
  listeEmployee.length==0 && 
  Api.get("Employees/GetEmployeesByGroup?employeesGroupID="+ currentuser.EmployeesGroupID)
  .then(res=>{
    console.log("res employees ", res.data);
    setlisteEmployee(res.data)
    let tmp = res.data.map(i => {
        return {
          label: `${i.FirstName} ${i.LastName}`,
          value: i.ID
        };
    });
    setlisteEmployeeOptions(tmp)
    setcheckedEmployee(tmp)
  })

  const [listEtages, setlistEtages] = useState([])
  const [listeEtagesOptions, setlisteEtagesOptions] = useState([])
  const currentHotel = useSelector(Selectors.selectCurrentHotel)
  listEtages.length==0 && 
  Api.get("RoomGroups/GetRoomGroups?HotelID="+ currentHotel.ID)
  .then(res=>{
    console.log("res rooms groups ", res.data);
    setlistEtages(res.data)
    let tmp = res.data.map(i => {
      return { label: i.Name, value: i.ID };
    });
    setlisteEtagesOptions(tmp)
    console.log("rooms groups options",tmp);
    setcheckedEtages(tmp)
  })


  /**
   * filtre entretiens by Etage
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtageFilter = checkedValues => {
    console.log("checkedValues",checkedValues)
    let tmp = listEntretiens.filter(item => {
      return checkedValues.indexOf(item.RoomGroup.ID)>=0
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
    console.log("checked", checkedValues);
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
        e => item.Employee.ID === e 
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
      setloading(true)
      selectedEntretiens.map(item => { 
        Api.put("Entretiens/AffectToEmployee/"+ item +"?employeeId="+ employee.ID)
        .then(res=>{
          console.log("res update employee =",res)
          Api.get("Entretiens/GetEntretiens?InterventionID="+ match.params.id)
          .then(res=>{
            setlistEntretiens(res.data) 
            setEntretiens(res.data)
            message.success("employé affecté avec succès");
            setselectedEntretiens([]);
            setloading(false)
          })
        })
        
      });
      
      
    } else {
      message.warning(`Veuillez selectionner un entretien d'abord.`);
    }
  };

  const editComment = () => {
    setmodalEdit(!modalEdit);
    let { Comment } = Entretiens.filter(e => e.ID === selectedEntretiens[0])[0];
    console.log("id=", selectedEntretiens[0]);
    console.log("comment=", Comment);
    setcommentText(Comment);
  };

  const menu = () => {
    var entretienID
    var current
    if (selectedEntretiens.length >= 1) {
      entretienID = selectedEntretiens[0];
      current= Entretiens.filter(item=>item.ID==entretienID)[0]
    }
    return (
      <Menu>
        <Menu.Item onClick={newEntretien}><Icon type="plus-circle" /> Nouveau</Menu.Item>
        {selectedEntretiens.length === 1 && (
          <Menu.Item>
            <Link to={"/roomGroup/" + entretienID}><Icon type="bulb" /> Détails</Link>
          </Menu.Item>
        )}
        {selectedEntretiens.length >= 1 && (
          <Menu.Item onClick={editComment}><Icon type="edit" /> Modifier commentaire</Menu.Item>
        )}
        {selectedEntretiens.length >= 1 && (
          <Menu.Item className="red" onClick={supprimerEntretien}>
          <Icon type="delete" /> Supprimer
          </Menu.Item>
        )}
        <Menu.Item onClick={selectAllEntretien}><Icon type="unordered-list" /> Sélectionner tous</Menu.Item>
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
        selectedEntretiens.map(item=>{
          Api.delete("Entretiens/DeleteEntretien/"+ item)
          .then(res=>{
            console.log("res delete =",res)
            
          })
        })
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
    Api.put("Entretiens/ChangeState/"+ id +"?state="+ newState)
      .then(res=>{
        console.log("res update state =",res)
      })
    let tmp = Entretiens.map(item => {
      if (item.ID === id) return { ...item, State: newState };
      else return item;
    });
    setEntretiens(tmp);
    message.success("Etat d'entretien changé avec succès");
  };

  const saveComment = async () => {
    await selectedEntretiens.map(item=>{
      Api.put("Entretiens/EditComment/"+ item +"?comment="+ commentText)
      .then(res=>{
        console.log("res update =",res)
      })
    })

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
    setloading(true)
    Api.post("Entretiens/PostEntretien",{...EntretienObject, InterventionID:match.params.id})
    .then(res=>{
      console.log("res ajout entretien", res);
      Api.get("Entretiens/GetEntretiens?InterventionID="+ match.params.id)
      .then(res=>{
        console.log("res entretiens ", res.data);
        setlistEntretiens(res.data) 
        setEntretiens(res.data)
        setloading(false)
        message.success("intervention ajoutée avec succès");

      })
      hideModalNew();
    })
    
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
    setEntretienObject({ ...EntretienObject, EmployeeID: val });
  };
  const handleChangeEtage = val => {
    setEntretienObject({ ...EntretienObject, RoomGroupID: val });
  };

  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

return (
  <Spin indicator={antIcon} spinning={loading}>
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
              <Option value={emp.ID}>{emp.FirstName} {emp.LastName}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Etage</small>
          <br />
          <Select onChange={handleChangeEtage} style={{ width: 230 }}>
            {listEtages.map(etage => (
              <Option value={etage.ID}>{etage.Name}</Option>
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
                {item.FirstName} {item.LastName}
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
                //   Entretiens.length === 0 && (
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
                  checkedEmployee.length === listeEmployee.length
                    ? "Tous les employés"
                    : `Employé :`
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
                  checkedEtages.length === listEtages.length
                    ? "Tous les étages"
                    : `Étage :`
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
                  checkedEtats.length === 2
                    ? "Tous les états"
                    : `États :`
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
    </Spin>
  );
};
