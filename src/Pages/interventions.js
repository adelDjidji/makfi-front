import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Link} from "react-router-dom";
import * as Selectors from "../Redux/MainReducer";

import InterventionItem from "../Components/InterventionItem";
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

import moment from "../moment";
import { listeEtat } from "../mocks";
import Api from "../Api/api";
import {MonthsOptions, YearsOptions} from "../mocks"


const listeEtatOptions = listeEtat.map(i => {
  return { label: i.text, value: i.state };
});

const { Option } = Select;
const { Panel } = Collapse;

const initialInterventionObject= {
  StartDateTime: null,
  State: null,
  Commentaire: null,
  etage: null
}
function Home() {
  const dispatch = useDispatch();
  const listInterventions = useSelector(Selectors.selectInterventions);

  const [interventions, setinterventions] = useState(listInterventions);
  const [checkedYears, setcheckedYears] = useState([2019, 2020]);
  // const [checkedMonth, setcheckedMonth] = useState([1]);
  const [checkedStatus, setcheckedStatus] = useState(listeEtatOptions);
  const [selectedInterventions, setselectedInterventions] = useState([]);
  const [modalEdit, setmodalEdit] = useState(false);
  const [modalNew, setmodalNew] = useState(false);
  const [commentText, setcommentText] = useState("");
  const currentHotel = useSelector(Selectors.selectCurrentHotel);

  const [InterventionObject, setInterventionObject] = useState(initialInterventionObject);

  useEffect(() => {
    console.log("changedd interventions liste",listInterventions);
    setinterventions(listInterventions);
  }, [listInterventions]);

  console.log("current hotel =",currentHotel);
  const [loading, setloading] = useState(true)
  currentHotel && listInterventions.length === 0 && loading &&
    Api.get("Interventions/GetInterventions?hotelId=" + currentHotel.ID).then(
      res => {
        dispatch(Selectors.setListeInterventions(res.data));
        setloading(false)
      }
    );

    useEffect(()=>{
      if(listInterventions.length > 0) setloading(false)
    },[listInterventions])
  
  const onChangeYear = checkedValues => {
    let tmp = listInterventions.filter(item => {
      return checkedValues.find(e => moment(item.StartDateTime).year() === e);
    });
    setinterventions(tmp);
    setcheckedYears(checkedValues);
    console.log("tmp = ", tmp);
    console.log("checked = ", checkedValues);
  };

  const onChangeMonth = checkedValues => {
    console.log("selected",checkedValues);
    let tmp = listInterventions.filter(item => {
      console.log("cheking month ",moment(item.StartDateTime).month()+1);
      return checkedValues.find(e => moment(item.StartDateTime).month()+1 === e);
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    // setcheckedMonth(checkedValues);
  };

  const onChangeStatusFilter = checkedValues => {
    console.log("checkedValues=", checkedValues);
    console.log("listInterventions=", listInterventions);
    let tmp = listInterventions.filter(item => {
      return checkedValues.find(e => item.State === e);
    });
    setinterventions(tmp);
    console.log("tmp = ", tmp);
    setcheckedStatus(checkedValues);
  };

  //selectionner une intervention
  const selectIntervention = id => {
    if (selectedInterventions.indexOf(id) >= 0) {
      let tmp = selectedInterventions.filter(item => item !== id);
      setselectedInterventions(tmp);
    } else {
      setselectedInterventions([...selectedInterventions, id]);
    }
    
  };

  useEffect(() => {
    if(selectedInterventions.length === 1){
      let intervention = interventions.filter(item=> item.ID === selectedInterventions[0])[0]
      dispatch(Selectors.setCurrentIntervention(`${moment(intervention.StartDateTime).format("dddd DD/MM/YYYY")}`)); //TODO:
      console.log("current intervention",intervention);
    }
 }, [selectedInterventions, interventions]);

  const selectAllIntervention = () => {
    let Ids = interventions.map(item => item.ID);
    console.log("IDS=", Ids);
    if (Ids.length === selectedInterventions.length)
      setselectedInterventions([]);
    else setselectedInterventions(Ids);
  };

  const  updateInterventionState = async  newStatus => {
    if (selectedInterventions.length !== 0) {
      await selectedInterventions.map(item=>{
        Api.put("Interventions/changeState/"+ item +"?state="+ newStatus)
        .then(res=>{
          console.log("res update =",res)
          if(res.status === 204){//update item success
            Api.get("Interventions/GetInterventions?hotelId=" + currentHotel.ID).then(
              res => {
                dispatch(Selectors.setListeInterventions(res.data));
              }
            );
          }
        });
        return item
      })
      
      let tmp = interventions.map(item => {
        if (selectedInterventions.indexOf(item.ID) >= 0)
          return { ...item, State: newStatus };
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
        <Menu.Item onClick={newIntervention}><Icon type="plus-circle" />  Nouveau</Menu.Item>

        {selectedInterventions.length === 1 && (
          <Menu.Item>
            <Link to={"intervention/" + idIntervention}><Icon type="bulb" />  Détails</Link>
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

  const supprimerIntervention =  () =>
    Modal.confirm({
      title: "Etes-vous sur de supprimer cet intervention?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk(){
         selectedInterventions.map(item=>{
          Api.delete("Interventions/DeleteIntervention/"+ item)
          .then(res=>{
            console.log("res delete =",res)
          })
          return item
        })

        let listnew = interventions.filter(
          item => selectedInterventions.indexOf(item.ID) < 0
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
    let { Commentaire } = interventions.filter(
      e => e.ID === selectedInterventions[0]
    )[0];
    console.log("id=", selectedInterventions[0]);
    console.log("comment=", Commentaire);
    setcommentText(Commentaire);
  };

  const saveComment = async () => {

    await selectedInterventions.map(item=>{
      Api.put("Interventions/EditComment/"+ item +"?comment="+ commentText)
      .then(res=>{
        console.log("res update =",res)
      })
      return item
    })

    let tmp = interventions.map(item => {
      if (selectedInterventions.indexOf(item.ID) >= 0)
        return { ...item, Commentaire: commentText };
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
    setloading(true)
    const newIntervention = {...InterventionObject, HotelID: currentHotel.ID }
    Api.post("Interventions/PostIntervention",newIntervention)
    .then(res=>{
      console.log("res add =",res)
      Api.get("Interventions/GetInterventions?hotelId=" + currentHotel.ID).then(
        res => {
          dispatch(Selectors.setListeInterventions(res.data));
          setinterventions(res.data);
          setloading(false)
          message.success("intervention ajoutée avec succès");
          
        }
      );
      hideModalNew();
    })
  };

  const hideModalNew = () => {
    setmodalNew(false);
    setInterventionObject(initialInterventionObject);
    setcommentText("");
  };

  //change coment
  const handleChange = e => {
    var val = e.target.value;
    setcommentText(val);
    setInterventionObject({ ...InterventionObject, Commentaire: val });
  };

  const onChangeDatetime = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setInterventionObject({ ...InterventionObject, StartDateTime: dateString });
  };

  function handleChangeStatus(value) {
    console.log(`selected ${value}`);
    setInterventionObject({ ...InterventionObject, State: value });
  }
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
        onOk={addIntervention}
        onCancel={hideModalNew}
        footer={[]}
      >
        <div>
          <small>Date de l'intervention</small>
          <br />
          <DatePicker
            style={{ width: 230 }}
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
          <Select
            placeholder="selectionner un état"
            onChange={handleChangeStatus}
            style={{ width: 230 }}
          >
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

      <div className="row" style={{ margin: "0 22px" }}>
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
      </div>
      <div className="row main-container" style={{}}>
        <div className="col-2 noPadding right-panel" style={{}}>
          <List
            size="small"
            header={
              <div>
                <Icon type="swap" style={{ marginRight: 10 }} /> Etat
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
            <div className="table-body">
              {interventions.map(item => (
                <InterventionItem
                  intervention={item}
                  selected={selectedInterventions.indexOf(item.ID) >= 0}
                  onClick={selectIntervention.bind(this, item.ID)}
                />
              ))}
              {interventions.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
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
              <Panel header={`Année : ${checkedYears}`} key="1">
                <Checkbox.Group
                  options={YearsOptions}
                  defaultValue={[2019, 2020]}
                  onChange={onChangeYear}
                />
              </Panel>
              <Panel
                // header={`${checkedMonth.map(i =>
                //   moment()
                //     .month(i - 1)
                //     .format("MMM")
                // )}`}
                header="Mois :"
                key="2"
              >
                <Checkbox.Group
                  options={MonthsOptions}
                  defaultValue={[1,2,3,4,5,6,7,8,9,10,11,12]}
                  onChange={onChangeMonth}
                />
              </Panel>
              <Panel
                header={
                  checkedStatus.length === 3
                    ? "Tous les états"
                    : `${checkedStatus}`
                }
                key="3"
              >
                <Checkbox.Group
                  options={listeEtatOptions}
                  defaultValue={listeEtatOptions.map(i => i.value)}
                  onChange={onChangeStatusFilter}
                />
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
    </Spin>
  );
}

export default Home;
