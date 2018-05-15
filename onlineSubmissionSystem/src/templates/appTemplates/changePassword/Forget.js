import React, { Component } from 'react';
import '../../../css/Forget.css'
import { Layout } from 'antd';
import  axios from 'axios';
import { Input } from 'antd';
import Header from "../fuction/Header";
import {Select} from 'antd';
import SafeQuestion from "./SafeQuestion";
const {  Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;


class Forget extends Component
{
    constructor()
    {
        super()
        this.state = {username:'',role:1}
    }

    ForgetFuction = () =>
    {

        let self = this;
        axios(
            {
                method:'post',
                url:'/manage/register/isemailexist',
                data: JSON.stringify
                ({
                   email:self.state.username,
                }),
                headers:{
                    'Content-type':'application/json'
                },
            }
        )
            .then((response)=>{
                if(response.result==1){
                    sessionStorage.setItem(0,self.state.role);
                    sessionStorage.setItem(1,self.state.username);
                    this.jump();
                }
                else{'该邮箱不存在'};
            })
            .catch((error) =>
            {alert('该用户邮箱不存在，请重新输入');
                console.log(error);})
    }

    check=()=>
    {
        if(this.checkUsername())
        {
        this.ForgetFuction();
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
        if (filter.test(mail))
        {return true;}
        else {
            alert('您的电子邮件格式不正确');
            return false;}
    }

    checkMail2=(mail)=>
    {
        let filter =  /^\s*$/g;
        if(mail==""||filter.test(mail))
        {
            alert('亲，电子邮箱不能为空哦');
            return false;
        }
        else
        {
            return true;
        }
    }

       handleChange0 = (e) =>
    {
        this.setState(
            {
                username:e.target.value
            }
        )
    }

    handleChangeRole =(e)=>
    {
        this.setState({
            role:e.target.value
        })
    }

    jump =()=>
    {
        window.location.href="#/safeQuestion"
    }



    render()
    {return(
        <Layout id='beijing'>
            <Header/>
            <Layout>
                <Content>
                    <Layout>
                        <div id='ojbk'>
                            <Content>请输入用户邮箱
                                <div>
                                    <Input type="email" placeholder="请输入用户邮箱" autosize style={{width:'20%'}} onChange={this.handleChange0} value={this.state.username}/>
                                    <div style={{ margin: '24px 0'}} />
                                </div></Content>
                            <Content>
                                <Select onChange={this.handleChangeRole} value={this.state.role}>
                                    <Option value={1}>作者</Option>
                                    <Option value={2}>主编</Option>
                                    <Option value={3}>编辑</Option>
                                    <Option value={4}>审稿人</Option>
                                    <Option value={0}>管理员</Option>
                                </Select>
                            </Content>
                            <div style={{ margin: '24px 0'}} />
                            <Content>
                                <button type="button" onClick={this.check}>获取密保问题</button>
                            </Content>
                            <div style={{ margin: '24px 0'}} />
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )}


}

export   default Forget;