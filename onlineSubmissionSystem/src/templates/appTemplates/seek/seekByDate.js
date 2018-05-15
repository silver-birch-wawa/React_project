import React, { Component } from 'react';
import '../../../css/Forget.css'
import { Layout } from 'antd';
import  axios from 'axios';
import { Input } from 'antd';
import {Select} from 'antd';
import {Button, List, Avatar, Icon } from 'antd';
const {  Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;
const listData = [];

for (let i = 0; i < 23; i++) {
    listData.push(
        {
            href: 'http://ant.design',
            title: `ant design part ${i}`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        },
        {
            href: 'http://ant.design',
            title: `ant design part ${i}`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content: '大鸡巴'
        }

    );
}

const IconText = ({ type, text }) => (
    <span>
    <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

class seekByDate extends Component
{


    constructor()
    {
        super()
        this.state = {startyear:0,endyaar:0,keyword:'',typs:0,page:1,articlelist:[],year:0,term:0}
    }

    SeekByDateFuction = () =>
    {

        let self = this;
        axios(
            {
                method:'get',
                url:`/search/bydate/year=${this.state.year}&term=${this.state.term}&page=${this.state.page} `,
                headers:{
                    'Content-type':'application/json'
                },
            }
        )
            .then((response)=>{
                if(response.result==1){
                    this.setState({
                        articlelist:response.data.articlelist,
                    })
                }
                else{
                    alert('文章已经不存在');
                }
            })
            .catch((error) =>
            {alert('文章已经不存在或者出现未知问题');
                console.log(error);})
    }

    componentWillMount=()=>
    {
        this.setState({
            year:sessionStorage.key(21),
           term:sessionStorage.key(22)
        })
        this.SeekByDateFuction
    }



    //
    // render()
    // {
    //     return(
    //     <List
    //         itemLayout="vertical"
    //         size="large"
    //         pagination={{
    //             onChange: (page) => {
    //                 console.log(page);
    //             },
    //             pageSize: 13,
    //         }}
    //         dataSource={listData}
    //         footer={<div><b>ant design</b> footer part</div>}
    //         renderItem={item => (
    //             <List.Item
    //                 key={item.title}
    //                 actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
    //                 extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
    //             >
    //                 <List.Item.Meta
    //                     avatar={<Avatar src={item.avatar} />}
    //                     title={<a href={item.href}>{item.title}</a>}
    //                     description={item.description}
    //                 />
    //                 {item.content}
    //             </List.Item>
    //         )}
    //     />
    //     )
    // }
    //


    render()
    {
        const articlelist=this.state.articlelist;
        return(
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 13,
                }}
                dataSource={this.state.articlelist}
                footer={<div><b>ant design</b> footer part</div>}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                    >
                        <List.Item.Meta
                            title={item.title}
                            format={item.format}
                            keyword1_en={item.keyword1_en}
                            keyword3_cn={item.keyword3_cn}
                            keyword1_cn={item.keyword1_cn}
                            keyword2_cn={item.keyword2_cn}
                            date_pub={item.data_pub}
                            summary_en={item.summary_en}
                            academicsec={item.academicsec}
                            keyword2_en={item.keyword2_en}
                            keyword4_en={item.keyword4_en}
                            id={item.id}
                            writer_id={item.writer_id}
                            writers_info={item.writers_info}
                        />
                    </List.Item>
                )}
            />

        )}


}

export default seekByDate;