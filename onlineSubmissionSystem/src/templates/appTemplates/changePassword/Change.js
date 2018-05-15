import React, { Component } from 'react';
import '../../../css/Forget.css'
import { Layout } from 'antd';
import  axios from 'axios';
import { Input } from 'antd';
import Header from "../fuction/Header";
import {Select} from 'antd';
import { Modal, Button } from 'antd';

const {  Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;


class Change extends Component
{
    constructor()
    {
        super()
        this.state = {username:'',password:'',passwod2:'',passwordSure:'',role:0,}
    }

    changeFuction = () =>
    {
        let self = this;
        axios(
            {
                method:'post',
                url:'/manage/repwd/getsafeque/verifysafeque/reset',
                data: JSON.stringify
                ({
                   username:self.state.username,
                    username:self.state.passwordSure,
                    username:self.state.role,
                }),
                headers:{
                    'Content-type':'application/json'
                },
            }
        )
            .then((response)=>
            {
                if(response.result==1)
                {
                    alert('修改成功');

                }})
            .catch((error) =>
            {console.log(error);})
    }


    check=()=>
    {
        if(this.checkPassword())
        {
            this.changeFuction();
        }
    }



    checkPassword=()=>
    {
        if(this.handleChange3(this.state.password,this.state.safeque2))
        {
            if (this.checkNumber1(this.state.passwordSure)) {
                if (this.checkNumber2(this.state.passwordSure)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else{
            return false;
        }
    }

    checkNumber1=(number)=>
    {
        let filter =  /^\s*$/g;
        if(number==""||filter.test(number))
        {
            alert('亲，密码不能为空哦');
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
                alert('密码必须为数字和字母组成')
                return false;
            }

        }
        else
        {
            alert('密码必须为八到十六位')
            return false;
        }
    }

    handleChange3=(e,e2)=>
    {
        if(e==e2)
        {
            this.setState
            ({
                passordSure:e.target.value
            })
            return true
        }
        else {
            Modal.error({
                title: '确认密码和密码不一致哟，小同志',
            })

            return false
        }
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
        this.setState(
            {
                password2:e.target.value
            }
        )
    }

    componentWillMount=()=>
    {
        this.setState({
            role:sessionStorage.key(0),
            username:sessionStorage.key(1)

        })
    }

    render()
    {return(
        <Layout id='beijing'>
            <Header/>
            <Layout>
                <Content>
                    <Layout>
                        <div id='ojbk'>
                            <Content>{this.state.username}
                                <div>
                                    <div style={{ margin: '24px 0'}} />
                                </div>
                            </Content>
                            <Content>{this.state.role}
                            </Content>
                            <div style={{ margin: '24px 0' }} />
                            <Content>
                                密码
                                <div>
                                    <Input type="password" placeholder="请输入密码" autosize style={{width:'20%'}} onChange={this.handleChange1} value={this.state.password}/>
                                    <div style={{ margin: '24px 0' }} />
                                </div>
                            </Content>
                            <Content>
                                确认密码
                                <div>
                                    <Input type="password" placeholder="请输入确认密码" autosize style={{width:'20%'}} onChange={this.handleChange2} value={this.state.password2}/>
                                    <div style={{ margin: '24px 0' }} />
                                </div>
                            </Content>
                            <Content>
                                <button type="button" onClick={()=>this.check()}>提交</button>
                            </Content>

                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )}

}

export  default Change;