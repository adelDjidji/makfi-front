import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Spin,
  Icon,
  Typography,
  message
} from "antd";

import { setAuthenticated, setCurrentUser } from "../Redux/MainReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";

import CodePINForm from "../Components/CodePinForm";

import "../styles/login.min.css";

import Api from "../Api/api";

const { Title } = Typography;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  // wrapperCol: {
  //   offset: 8,
  //   span: 16
  // }
};


export default ({match, id})=>{
  // const history = useHistory();
  const dispatch = useDispatch();
  const [pending, setpending] = useState(false);

  // console.log("id ===",match.params.id);
  console.log("id ===",id);
  const onSubmit = e => {
    e.preventDefault();
    setpending(true)
    Api.post("Users/Login", {
      UserName: id,//"admin",
      Password: "9999", //"3V#YMuJ$=m?yGN4V"
    })
      .then(function(response) {
        window.localStorage.setItem("at", response.data.token);
        console.log("reponse", response);
        
        dispatch(setCurrentUser(response.data.employee))
        dispatch(setAuthenticated());
      })
      .catch(function(error) {
        message.error(error.message)
        console.log("err=", error.message);
      });
      setpending(false)
    console.log("Success submit");
  };

  const FormLoginPassword = () => {
    return (
      <Form
        {...layout}
        style={{ padding: "28pt", textAlign: "center" }}
        name="basic"
        initialValues={{
          remember: true,
          username:"daniellopezem"
        }}
        onSubmit={onSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!"
            }
          ]}
        >
          <Input placeholder="daniellopezem" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          defaultValue="password"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            }
          ]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
          {pending?
            <Spin indicator={antIcon}></Spin>:
           <span>Se connecter <Icon type="login" /></span> }
            
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const onPinSuccess = () => {
    setTimeout(() => {
      dispatch(setAuthenticated());
    }, 500);
    // history.push("/");
  };
  const onPINChange = (pin) => {
    console.log("PIN is ", pin);
    setpending(true)
    Api.post("Users/Login", {
      UserName: id,
      Password: pin, 
    })
      .then(function(response) {
        window.localStorage.setItem("at", response.data.token);
        window.localStorage.setItem("code",id);
        console.log("reponse", response);
        dispatch(setCurrentUser(response.data.employee))
        dispatch(setAuthenticated());
      })
      .catch(function(error) {
        // message.error(error.message)
        message.error("code incorrect")
        console.log("err=", error.message);
      }).finally(function(){
        setpending(false)
      })
      
  }
  return (
    <div style={{ padding: "0 9pt", height: "100%" }}>
      <Title className="head-title center" level={2}>
        MAKFI
      </Title>
      <div className="center">
        <FontAwesomeIcon
          style={{ fontSize: "41pt", color: "#1e74b9" }}
          icon={faUserLock}
        />
        <Title style={{ fontWeight: "normal", paddingTop: "11pt" }} level={3}>
          Authentification
        </Title>
      </div>

      <Spin indicator={antIcon} spinning={pending}>
        <div>
              <CodePINForm onChange={onPINChange} onSuccess={onPinSuccess} />
        </div>
      </Spin>
    </div>
  );
}

