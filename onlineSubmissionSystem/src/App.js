import React, {Component} from 'react';

import './css/App.css';
import { Button ,Icon} from 'antd';
import Header from "./templates/appTemplates/fuction/Header";
import { Input } from 'antd';
import { Layout } from 'antd';
import axios from "axios/index";
import Show from "./templates/appTemplates/show/Show";
import {Select} from 'antd';

const Option =Select.Option;
const { TextArea } = Input;
const { Content } = Layout;

class App extends Component
{
    constructor()
    {
        super()
        this.state = {anoucementlist:[],num:5,num2:3,articlelist:[],startyear:2013,endyaar:2018,keyword:'',typs:1,standardlist:[],year:2018,ddl:[],term:1}
    }
    appFuction = () =>
    {

        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/manage/announcementlist/num=${self.state.num}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                this.setState({
                  anoucementlist:response.data.anoucementlist,
                })})
            .catch((error) =>
            {console.log(error);})
    }

    appFuction2 = () =>
    {

        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/manage/articlelist/num=${this.state.num2}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                this.setState({
                    articlelist:response.data.articlelist,
                })})
            .catch((error) =>
            {console.log(error);})
    }

    appFuction3 = () =>
    {

        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/manage/articlelist/num=${this.state.num2}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                this.setState({
                    articlelist:response.data.articlelist,
                })})
            .catch((error) =>
            {console.log(error);})
    }

    appFuction4 = () =>
    {

        let self = this;
        axios
        (
            {
                method: 'get',
                url: '/search/getstandard',
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                this.setState({
                    standardlist:response.data.standardlist,
                })})
            .catch((error) =>
            {console.log(error);})
    }

    appFuction5 = () =>
    {

        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/search/getcontent/year=${this.state.year}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                this.setState({
                    ddl:response.data.ddl,
                })})
            .catch((error) =>
            {console.log(error);})
    }


    //
    // appFuction7 = () =>
    // {
    //
    //     let self = this;
    //     axios
    //     (
    //         {
    //             method: 'get',
    //             url: `/search/bydate/year=${this.state.year}&term=${term}&page=${page}`,
    //             headers:
    //                 {
    //                     'Content-type': 'application/json'
    //                 },
    //         }
    //     )
    //         .then((response) => {
    //             this.setState({
    //                 standardlist:response.data.standardlist,
    //             })})
    //         .catch((error) =>
    //         {console.log(error);})
    // }





    Jump=()=>
    {
        window.location.href="#/login"
    }

    Jump2=()=>
    {
        window.location.href="#/register"
    }



    Jump3=(id)=>
    {
        sessionStorage.setItem(2,id);
        window.location.href="#/show"
    }


    handleChange0=(e)=>
    {
        this.setState({
            keyword:e.target.value
        })
    }

    handleChange2=(e)=>
    {
        this.setState({
            startyear:e
        })
    }

    handleChange3=(e)=>
    {
        this.setState({
            endyear:e
        })
    }

    handleChange4=(e)=>
    {
        this.setState({
         type:e
        })
    }

    handleChange5=(e)=>
    {
        this.setState({
            year:e
        })
    }

    handleChange6=(e)=>
    {
        this.setState({
            term:e
        })
    }

    Jump4=()=>
    {
        window.location.href="#/seek"
    }

    Jump5=()=>
    {
        sessionStorage.setItem(21,this.state.year);

        sessionStorage.setItem(22,this.state.term);

        window.location.href="#/seekByDate"
    }



    check2=(e)=>
    {
        let filter =  /^\s*$/g;
        if(e==""||filter.test(e))
        {
            alert('亲.关键词不能为空哦');
        }
        else
        {
            sessionStorage.setItem(10,this.state.keyword);
            sessionStorage.setItem(11,this.state.startyear);
            sessionStorage.setItem(12,this.state.endyear);
            sessionStorage.setItem(13,this.state.type);
          this.Jump4();
        }
    }




    componentWillMount=()=>
    {
        this.appFuction();
        this.appFuction2();
        this.appFuction3();
        this.appFuction4();
        this.appFuction5()
    }



    render() {
        const anoucementlist=this.state.anoucementlist;
        const articlelist=this.state.articlelist;
        const standardlist=this.state.standardlist;

        return(
            <div id='body'>
                <Header/>
                <div id="mainfjj" >
                    <div id="first" >
                        <div id="firstLeft">
                            <Icon type="pause" />期刊搜索
                            <div style={{ margin: '5px 0' }} />
                            <div id="SearchBox">
                                <div>
                                    <Select  onChange={this.handleChange5} value={this.state.year} style={{width:'150px' }}>
                                        {this.state.standardlist.map(item =>(
                                            <Option value={item.year}>{item.year}年</Option>
                                        ))}
                                    </Select>
                                    <div style={{ margin: '5px 0' }} />
                                    <Select  onChange={this.handleChange6} value={this.state.term} style={{width:'150px'}} >
                                        {this.state.ddl.map((item,index) =>(
                                            <Option value={index+1}>第{index+1}期</Option>
                                        ))}
                                    </Select>
                                    <div style={{ margin: '5px 0' }} />
                                </div>
                                <Button type="primary"  onClick={this.Jump5} >搜索</Button>
                            </div>
                        </div>
                        <div id="firstMiddle">
                            <Icon type="pause" /> 信息公告
                            <div id="announcement">
                                <ul id="lineMiddle">
                                    {anoucementlist.map(item =>(
                                        <li className="anouce"> <Icon type="caret-right" />公告:{item.title}
                                            <div style={{ margin: '10px 0' }} /></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div id="firstRight">
                            <div id="login">
                            <Icon type="pause" /> 登录注册
                                <div style={{ margin: '5px 0' }} />
                                <div style={{ margin: '5px 0' }} />
                                <ul id="login2">
                                    <li>
                                    <Button type="primary"  onClick={this.Jump}>登陆</Button>
                                    </li>
                                    <div style={{ margin: '5px 0' }} />
                                    <li>
                                    <Button type="primary"  onClick={this.Jump2}>注册</Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="second" >

                        <div id="secondLeft" >
                            <Layout style={{background:'white'}}>
                                <Content>
                                    <Icon type="pause" /> 关键词搜索
                                    <div style={{ margin: '5px 0' }} />
                                </Content>
                                <Content>从
                                    <Select onChange={this.handleChange2} value={this.state.startyear} style={{width:'50%'}}>
                                        {this.state.standardlist.map(item =>(
                                            <Option value={item.year}>{item.year}年</Option>
                                        ))}
                                    </Select>
                                    <div style={{ margin: '5px 0' }} />
                                    到
                                    <Select onChange={this.handleChange3} value={this.state.endyear} style={{width:'50%'}}>
                                        {this.state.standardlist.map(item =>(
                                            <Option value={item.year}>{item.year}年</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '5px 0' }} />
                                <Content>
                                    <Input  placeholder="请输入关键词" autosize style={{width:'70%'}} onChange={this.handleChange0} value={this.state.keyword}/>
                                </Content>
                                <div style={{ margin: '5px 0' }} />
                                <Content>
                                    <Select onChange={this.handleChange4} value={this.state.type}  style={{width:'50%'}}>
                                        <Option value={1}>按标题搜索</Option>
                                        <Option value={2}>按学术领域搜索</Option>
                                        <Option value={3}>按中文关键词搜索</Option>
                                        <Option value={4}>按英文关键词搜索</Option>
                                        <Option value={5}>按作者名搜索</Option>
                                    </Select>
                                </Content>
                                <Content>
                                    <Button type="primary" onClick={()=>this.check2(this.state.keyword)}>搜索</Button>
                                </Content>
                        </Layout>
                        </div>

                        <div id="secondMiddle">
                            <Icon type="pause" />最新期刊
                            <div style={{ margin: '10px 0' }} />
                            <div id="qikan">
                                <ul className="headline">
                                    {articlelist.map(item =>(
                                        <li className="anouce"> <Icon type="caret-right" />期刊:  <a  onClick={()=>this.Jump3(item.id)}>{item.title}</a>
                                            <div style={{ margin: '10px 0' }} />
                                        </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default App;










