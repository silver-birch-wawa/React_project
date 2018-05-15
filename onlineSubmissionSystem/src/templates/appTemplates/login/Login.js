import React, { Component } from 'react';
import '../../../css/Login.css'
import { Layout } from 'antd';
import  axios from 'axios';
import { Input } from 'antd';
import Header from "../fuction/Header";
import {Select} from 'antd';
import { message, Button } from 'antd';
import { Modal } from 'antd';


const {  Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;


class Login extends Component
{
    Jump=()=>
    {
        window.location.href="#/forget"
    }

    constructor()
    {
        super()
        this.state = {username:'',password:'',role:1,}
    }

    loginFuction = () =>
    {
      
            let self = this;
            axios
            (
                {
                    method: 'post',
                    url: '/common/login',
                    data: JSON.stringify
                    ({
                        username: self.state.username,
                        password: self.state.password,
                        role: self.state.role
                    }),
                    headers: 
                        {
                        'Content-type': 'application/json'
                    },
                }
            )
                .then((response) => {
                console.log(response);
                if(response.data.result == 1) {
                    message.success('登录成功');
                    localStorage.setItem("userName",response.data.name);
                    switch (self.state.role) {
                        case 0:
                            window.location.href = "#/adminCenter";
                            break;
                        case 1:
                            window.location.href = "#/authorCenter";
                            break;
                        case 2:
                            window.location.href = "#/MainEditor";
                            break;
                        case 3:
                            window.location.href = "#/editorCenter";
                            break;
                        case 4:
                            window.location.href = "#/Previewer";
                            break;
                        default:
                            break
                    }
                }else{Modal.error({title: '该用户不存在或者密码错误',});}

            })
                .catch((error) =>
                { Modal.error({
                    title: '登陆出现异常，请重新登录',
                });console.log(error);})
    }

    handleChange0 = (e) =>
    {
        this.setState(
            {
                username:e.target.value
            }
        )
    }

    handleChange1 = (e) =>
    {
        this.setState(
            {
                password:e.target.value
            }
        )
    }

    handleChange2 = (e) =>
    {
         this.setState({
             role: e
         })
    }

    check=()=>
    {
        if(this.checkUsername()&&this.checkPassword())
        {
            this.loginFuction();
        }
    }


    checkUsername =()=>
    {
        if(this.checkMail2(this.state.username))
        {
            if(this.checkMail1(this.state.username))
            {
                return true;
            }
            else{return false;}
        }
        else {return false;}
    }

    checkMail1 =(mail)=>
    {
        let filter  = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
        if (filter.test(mail) || this.state.role === 0)
        {return true;}
        else {
            Modal.error({
                title: '您的电子邮件格式不正确',
            });
            return false;}
    }

    checkMail2=(mail)=>
    {
        let filter =  /^\s*$/g;
        if(mail==""||filter.test(mail))
        {
            Modal.error({
                title: '亲，电子邮箱不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    checkPassword=()=>
    {
        if(this.checkNumber1(this.state.password))
        {
            if(this.checkNumber2(this.state.password))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    checkNumber1=(number)=>
    {
        let filter =  /^\s*$/g;
        if(number==""||filter.test(number))
        {
            Modal.error({
                title: '亲，密码不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    checkNumber2=(number)=>
    {
         let filter=/^[0-9a-zA-Z]+$/;

         if(number.length>=8&&number.length<=16)
         {
              if(filter.test(number))
              {
                  return true;
              }
              else
              {
                  Modal.error({
                      title: '密码必须为数字和字母组成',
                  });
                  return false;
              }

         }
         else
         {
             Modal.error({
                 title: '密码必须为八到十六位',
             });
             return false;
         }
    }





    render()
    {return(
        <Layout id='beijing'>
            <Header/>
            <Layout>
                <Content>
                    <Layout>
                        <div id='ojbk'>
                            <Content>账号\邮箱
                                <div>
                                    <Input type="email" placeholder="请输入用户邮箱" autosize style={{width:'20%'}} onChange={this.handleChange0} value={this.state.username}   />
                                    <div style={{ margin: '24px 0'}} />
                                </div></Content>
                            <Content>
                                密码
                                <div>
                                    <Input type="password" placeholder="请输入密码" autosize style={{width:'20%'}} onChange={this.handleChange1} value={this.state.password}/>
                                    <div style={{ margin: '24px 0' }} />
                                </div>
                            </Content>
                            <Content>选择你的身份：
                                <Select onChange={this.handleChange2} value={this.state.role}>
                                    <Option value={1}>作者</Option>
                                    <Option value={3}>编辑</Option>
                                    <Option value={2}>主编</Option>
                                    <Option value={4}>审稿人</Option>
                                    <Option value={0}>管理员</Option>
                                </Select>
                            </Content>
                            <div style={{ margin: '24px 0' }} />
                            <Content>
                                <Button type="primary" onClick={this.check}>登陆</Button>
                            </Content>
                            <div style={{ margin: '24px 0' }} />
                            <Content>
                                忘记密码？
                                <Button type="primary"  onClick={this.Jump}>点击此处</Button>
                            </Content>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )}}

export   default Login