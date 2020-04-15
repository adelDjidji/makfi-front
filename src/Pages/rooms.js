import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import * as Selectors from "../Redux/MainReducer";
import Api from "../Api/api"
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
  Select, 
  Spin
} from "antd";

import { listeEtat } from "../mocks";

const { Option } = Select;

const { Panel } = Collapse;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const InitialEntetienObject = {
  Name: null,
  RoomGroup: null,
  RoomGroupID: null,
  Comment: null,
  Status: null,
  Employee: null,
  EmployeeID:null
};




const listeEtatsOptions = listeEtat.map(i => {
  return { label: i.text, value: i.state };
});



export default () => {
  const dispatch = useDispatch();

  const currentuser= useSelector(Selectors.selectCurrentUser)


  // const listInterventions = useSelector(Selectors.selectChambreInterventions);
  const [interventions, setinterventions] = useState([]);
  const [checkedEtats, setcheckedEtats] = useState(listeEtatsOptions);
  const [checkedEtatsString, setcheckedEtatsString] = useState("");
  const [checkedEtages, setcheckedEtages] = useState([]);
  const [checkedEmployee, setcheckedEmployee] = useState([]);
  const [selectedInterventions, setselectedInterventions] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [InterventionObject, setInterventionObject] = useState(
    InitialEntetienObject
  );

  const  [loading, setloading] = useState(true)
  const  [stop, setstop] = useState(false)
  const currentHotel = useSelector(Selectors.selectCurrentHotel);

  const [listInterventions, setlistInterventions] = useState([])
  useEffect(()=>{
    // listInterventions.length === 0 && !stop &&
    Api.get("Rooms/GetRooms?HotelID="+ currentHotel.ID)
    .then(res=>{
      console.log("res chmbres=", res.data);
      if(res.data.length==0) setstop(true)
      setlistInterventions(res.data)
      setinterventions(res.data)
    })
  },[currentHotel.ID])
  

  const [listEtages, setlistEtages] = useState([])
  const [listeEtagesOptions, setlisteEtagesOptions] = useState([])
  // var listeEtagesOptions = []
  listEtages.length==0 && 
  Api.get("RoomGroups/GetRoomGroups?HotelID="+ currentHotel.ID)
  .then(res=>{
    console.log("res rooms groups ", res.data);
    setlistEtages(res.data)
    let tmp  = res.data.map(i => {
      return { label: i.Name, value: i.ID };
    });
    setlisteEtagesOptions(tmp)
    console.log("rooms groups options",tmp);
    setcheckedEtages(tmp)
    setloading(false)
  })
  


  const [listeEmployee, setlisteEmployee] = useState([])
  var listeEmployeeOptions = []
  listeEmployee.length==0 && 
  Api.get("Employees/GetEmployeesByGroup?employeesGroupID="+ currentuser.EmployeesGroupID)
  .then(res=>{
    console.log("res employees ", res.data);
    setlisteEmployee(res.data)
    listeEmployeeOptions = res.data.map(i => {
        return {
          label: `${i.FirstName} ${i.LastName}`,
          value: i.ID
        };
    });
    console.log("listeEmployeeOptions",listeEmployeeOptions);
    setcheckedEmployee(listeEmployeeOptions)
  })



  /**
   * filtre entretiens by Etage
   * @param {liste of checked etages} checkedValues
   */
  const onChangeEtageFilter = checkedValues => {
    console.log("checked values =", checkedValues);
    let tmp = listInterventions.filter(item => {
      return checkedValues.indexOf(item.RoomGroup.ID) >= 0;
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

  const updateInterventionState = async newStatus => {
    console.log('selectedInterventions', selectedInterventions)
    if (selectedInterventions.length > 0) {
      setloading(true)
      await selectedInterventions.map(item=>{
        Api.put("Rooms/ChangeStatus/"+ item +"?status="+ newStatus)
        .then(res=>{
          console.log("res update =",res)
          if(res.status==204){//update item success
            Api.get("Rooms/GetRooms?HotelID=" + currentHotel.ID).then(
              res => {
                setinterventions(res.data);
                setlistInterventions(res.data)
                message.success("Etat modifié avec succès");
                setselectedInterventions([]);
                setloading(false)
              }
            );
          }
        })
      })

      // let tmp = listInterventions.map(item => {
      //   if (selectedInterventions.indexOf(item.id) >= 0)
      //     return { ...item, Status: newStatus };
      //   else return item;
      // });
      // console.log("tmp", tmp);
      // setinterventions(tmp);
      
      
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
        <Menu.Item onClick={newIntervention}><Icon type="plus-circle" />  Nouveau</Menu.Item>

        {selectedInterventions.length === 1 && (
          <Menu.Item>
            <Link to={"/room/" + idIntervention}><Icon type="bulb" />  Détails</Link>
          </Menu.Item>
        )}
        {selectedInterventions.length >= 1 && (
          <Menu.Item onClick={editComment}><Icon type="edit" /> Modifier commentaire</Menu.Item>
        )}
        {selectedInterventions.length >= 1 && (
          <Menu.Item className="red" onClick={supprimerIntervention}>
            <Icon type="delete" /> Supprimer
          </Menu.Item>
        )}
        <Menu.Item onClick={selectAllIntervention}><Icon type="unordered-list" /> Sélectionner tous</Menu.Item>
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
        setloading(true)
        selectedInterventions.map(item=>{
          Api.delete("Rooms/DeleteRoom/"+ item)
          .then(res=>{
            console.log("res delete =",res)
            Api.get("Rooms/GetRooms?HotelID="+ currentHotel.ID)
            .then(res=>{
              setinterventions(res.data);
              setlistInterventions(res.data);
              setselectedInterventions([]);
              setloading(false)
            })
          })
        })
        
      },
      onCancel() {
        console.log("Cancel");
      }
    });

  const editComment = () => {
    setmodalEdit(!modalEdit);
    let { Comment } = listInterventions.filter(
      e => e.ID == selectedInterventions[0]
    )[0];
    console.log("id=", selectedInterventions[0]);
    console.log("comment=", Comment);
    setcommentText(Comment);
  };

  /**
   * update comment of selected interventions
   */
  const saveComment = async () => {

    await selectedInterventions.map(item=>{
      Api.put("Rooms/ChangeComment/"+ item +"?comment="+ commentText)
      .then(res=>{
        console.log("res update =",res)

        let tmp = listInterventions.map(item => {
          if (selectedInterventions.indexOf(item.ID) >= 0)
            return { ...item, Comment: commentText };
          else return item;
        });
        setinterventions(tmp);
        setlistInterventions(tmp);
        message.success("commentaire modifié avec succès");
        setselectedInterventions([]);
        hideModal();
        setcommentText("");

      })
    })

  };

  const hideModal = () => {
    setmodalEdit(false);
  };

  const newIntervention = () => {
    setmodalNew(true);
  };

  const addIntervention = () => { 
    var newID = listInterventions.length + 2;
    setloading(true)
    Api.post("Rooms/PostRoom",
      {
        RoomGroupID:InterventionObject.RoomGroupID,
        Name:InterventionObject.Name,
        Status: InterventionObject.Status,
        Comment: InterventionObject.Comment,
        EmployeeID: InterventionObject.EmployeeID
      })
    .then(res=>{
      console.log("res ajout room", res);
      hideModalNew();
      Api.get("Rooms/GetRooms?HotelID="+ currentHotel.ID)
      .then(res=>{
        setinterventions(res.data)
        setlistInterventions(res.data)
        message.success("intervention ajoutée avec succès");
        setloading(false)
      })
      
    })
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
    setInterventionObject({ ...InterventionObject, Name: val });
  };

  //change Room group
  const handleChangeRoomGroup = val => {
    setInterventionObject({ ...InterventionObject, RoomGroupID: val });
  };

  //change Employee
  const handleChangeEmployee = val => {
    setInterventionObject({ ...InterventionObject, EmployeeID: val });
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
          <small>Libélé de chambre</small>
          <br/>
          <Input
            style={{ width: 230 }}
            onChange={handleChangeNumero}
            value={InterventionObject.Name}
          />
        </div>

        <div>
          <small>Etage</small>
          <br />
          <Select placeholder="selectionner un étage" onChange={handleChangeRoomGroup} style={{ width: 230 }}>
            {listEtages.map(item => (
              <Option value={item.ID}>{item.Name}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Employé</small>
          <br />
          <Select placeholder="selectionner l'employé" onChange={handleChangeEmployee} style={{ width: 230 }}>
            {listeEmployee.map(item => (
              <Option value={item.ID}>{item.FirstName} {item.LastName}</Option>
            ))}
          </Select>
        </div>
        <div>
          <small>Etat</small>
          <br />
          <Select placeholder="selectionner un état" onChange={handleChangeStatus} style={{ width: 230 }}>
            <Option value="Incident">Incident</Option>
            <Option value="OK">Ok</Option>
            <Option value="NonFait">Non fait</Option>
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
                onClick={updateInterventionState.bind(this, item.state)}
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
            <Spin indicator={antIcon} spinning={loading}>
            <div className="table-body">
              {interventions.map(item => (
                <InterventionRoomItem
                  intervention={item}
                  selected={selectedInterventions.indexOf(item.ID) >= 0}
                  onClick={selectIntervention.bind(this, item.ID)}
                />
              ))}
              {interventions.length == 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
            </Spin>
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
              {
              //   <Panel
              //   header={
              //     checkedEmployee.length == listeEmployee.length
              //       ? "Tous les employés"
              //       : `${checkedEmployee}`
              //   }
              //   key="1"
              // >
              //   <Checkbox.Group
              //     options={listeEmployeeOptions}
              //     defaultValue={listeEmployeeOptions.map(i => i.value)}
              //     onChange={onChangeEmployeeFilter}
              //   />
              // </Panel>
            }
              <Panel
                header={
                  checkedEtages.length == listEtages.length
                    ? "Tous les étages"
                    : `Étages :`
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
                    : `${checkedEtats}`
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
