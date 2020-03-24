import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Form, Input, Button, Checkbox, Tabs, Icon, Typography } from "antd";
import {
  setAuthenticated
} from "../Redux/MainReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from '@fortawesome/free-solid-svg-icons'

import  CodePINForm from "../Components/CodePinForm";

import "../styles/login.min.css";

const { Title } = Typography;


const { TabPane } = Tabs;
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

function Login() {
  const dispatch = useDispatch()
  const onFinish = values => {
    console.log("Success:", values);
  };
  const onSubmit = e => {
    e.preventDefault()
    dispatch(setAuthenticated())
    // window.location.href="/"
    console.log("Success submit");
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const FormLoginPassword = () => {
    return (
      <Form
        {...layout}
        style={{padding: '28pt',textAlign: "center"}}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item {...tailLayout}>
           <Button type="primary" htmlType="submit">
             Se connecter <Icon type="login" />
           </Button>
        </Form.Item>
        
        
      </Form>
    );
  };

  // <Link style={{color: 'white',
  //         background: '#1890ff',
  //         padding: '8pt 16pt',
  //         borderRadius: '5pt'}} to="/"><Icon type="login" /> Se connecter</Link>


//   <Form.Item {...tailLayout}>
//   <Button type="primary" htmlType="submit">
//     Se connecter <Icon type="login" />
//   </Button>
// </Form.Item>

  return (
    <div  style={{ padding: "0 9pt", height: "100%" }}>
    <Title className="head-title center" level={2}>MAKFI</Title>
      <div className="center">
        
        <FontAwesomeIcon style={{fontSize: '41pt', color: '#1e74b9'}} icon={faUserLock} />
        <Title style={{fontWeight: 'normal',paddingTop: '11pt'}} level={3}>Authentification</Title>
      </div>

      <div>
        <Tabs tabPosition="left">
          <TabPane tab="Mot de passe" key="1">
            <FormLoginPassword />
          </TabPane>
          <TabPane tab="Code PIN" key="2">
            <CodePINForm />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Login;
