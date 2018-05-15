import React, { Component } from 'react';
import '../../../css/Forget.css'
import { Layout } from 'antd';
import  axios from 'axios';
import { Input } from 'antd';
import Header from "../fuction/Header";
import {Select} from 'antd';
const {  Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;


class SafeQuestion extends Component
{
    constructor()
    {
        super()
        this.state = {username:'',role:1,que1:'',que2:'',que3:'',answer1:'',answer2:'',answer3:''}
    }

    safeQuestionFuction = () =>
    {
        let self = this;
        axios(
            {
                method:'post',
                url:`/manage/repwd/getsafeque/username=${self.state.username}&role=${self.state.role}`,

                headers:{
                    'Content-type':'application/json'
                },
            }
        )
            .then((response)=>{
                if(response.result==1){
                    this.setState({
                        que1: response.data.safeque.que1,
                        que2:response.data.safeque.que2,
                        que3:response.data.safeque.que3,
                    })
                }
            })
            .catch((error) =>
            {alert('该用户邮箱不存在或者出现异常，请重新输入');
                console.log(error);})
    }
    safeQuestionFuction2 = () =>
    {
        let self = this;
        axios(
            {
                method:'post',
                url:'/manage/repwd/getsafeque/verifysafeque',
                data: JSON.stringify
                ({
                    username:self.state.username,
                    answer1:self.state.answer1,
                    answer2:self.state.answer2,
                    answer3:self.state.answer3,
                    role:self.state.role,
                }),
                headers:{
                    'Content-type':'application/json'
                },
            }
        )
            .then((response)=>{
                if(response.result==1){
                    this.state.jump()
                }
                {alert('回答不正确');}
            })
            .catch((error) =>
            {console.log(error);})
    }

    check=()=>
    {
        if(this.checkUsername())
        {
            this.RegiterFuction();
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



    handleChange1 = (e) =>
    {
        this.setState({
            answer1:e.target.value
        })
    }

    handleChange2 = (e) =>
    {
        this.setState({
            answer2:e.target.value
        })
    }

    handleChange3 = (e) =>
    {
        this.setState({
            answer3:e.target.value
        })
    }



    jump =()=>
    {
        window.location.href="#/change"
    }

    componentWillMount=()=>
    {
        this.setState({
            role:sessionStorage.key(0),
            username:sessionStorage.key(1)
        })
        this.safeQuestionFuction()
    }


    render()
    {return(
        <Layout id='beijing'>
            <Header/>
            <Layout>
                <Content>
                    <Layout>
                        <div id='ojbk'>
                            <div style={{ margin: '24px 0'}} />
                            <div style={{ margin: '24px 0'}} />
                            {this.safeQuestionFuction()}
                            <Content>{this.state.que1}
                                <div>
                                    <Input  placeholder="请输入问题一答案" autosize style={{width:'20%'}} onChange={this.handleChange1} value={this.state.answer1}/>
                                    <div style={{ margin: '24px 0'}} />
                                </div>
                            </Content>
                            <div style={{ margin: '24px 0'}} />
                            <Content>{this.state.que2}
                                <div>
                                    <Input  placeholder="请输入问题二答案" autosize style={{width:'20%'}} onChange={this.handleChange2} value={this.state.answer2}/>
                                    <div style={{ margin: '24px 0'}} />
                                </div>
                            </Content>
                            <div style={{ margin: '24px 0'}} />
                            <Content>{this.state.que2}
                                <div>
                                    <Input  placeholder="请输入问题三答案" autosize style={{width:'20%'}} onChange={this.handleChange3} value={this.state.answer3}/>
                                    <div style={{ margin: '24px 0'}} />
                                </div>
                            </Content>
                            <Content>
                                <button type="button" onClick={()=>this.safeQuestionFuction2()}>提交</button>
                            </Content>

                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )}


}

export   default SafeQuestion;