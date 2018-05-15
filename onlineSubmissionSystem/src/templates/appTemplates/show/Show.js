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


class Show extends Component
{
    constructor()
    {
        super()
        this.state = {username:'',role:1,artId:0, format:'',keyword1_en:'', keyword3_cn:'',keyword1_cn:'',keyword2_cn:'',
            title:'',data_pub:'',summary_en:'',keyword2_en:'', keyword4_en:'',id:'',writer_id:'',writers_info:''}
    }

    ShowFuction=()=>
    {
        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/manage/getarticle/id=${self.state.artId}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                if(response.result==1){
               this.setState({
                   format:response.data.article.format,
                   keyword1_en:response.data.article.keyword1_en,
                   keyword3_cn:response.data.article.keyword3_cn,
                   keyword1_cn:response.data.article.keyword1_cn,
                   keyword2_cn:response.data.article.keyword2_cn,
                   title:response.data.article.title,
                   data_pub:response.data.article.data_pub,
                   summary_en:response.data.article.summary_en,
                   keyword2_en:response.data.article.keyword2_en,
                   keyword4_en:response.data.article.keyword4_en,
                   id:response.data.article.id,
                   writer_id:response.data.article.writer_id,
                   writers_info:response.data.article.writers_info,
               })
                }})
            .catch((error) =>
            {console.log(error);})
    }




    componentWillMount=()=>
    {
        this.setState({
            artId:sessionStorage.key(2),
        })
        this.ShowFuction();
    }



    render()
    {return(<Layout id='beijing'>
            <Header/>
            <Layout>
                <Content>
                    <Layout>
                        <div id='ojbk'>
                            <Content>
                                <div>
                                   {this.state.title}
                                    <div style={{ margin: '24px 0'}} />
                                </div>
                            </Content>
                            <Content>
                                {this.state.keyword1_cn}&&{this.state.keyword2_cn}&&{this.state.keyword1_en}&&{this.state.keyword2_en}&&{this.state.keyword3_cn}&&{this.state.keyword4_en}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                            {this.state.data_pub}
                            <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                                {this.state.format}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                                {this.state.writer_id}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                                {this.state.writer_id}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                                {this.state.writers_info}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                            <Content>
                                {this.state.summary_en}
                                <div style={{ margin: '24px 0'}} />
                            </Content>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>)}

}

export  default Show;


