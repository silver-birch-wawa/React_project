import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Table,Button, Radio, Icon ,Modal, message} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import { Input} from 'antd';
import axios from 'axios';
import { Badge } from 'antd';

class Header extends Component{
    constructor(props){
    	super(props);
        this.state={
            'name':localStorage.getItem("userName"),
        	'Personal_info_change':'/#/Personal_info_change',
        	'logo_img':'http://static.samsph.com/images/logo.png',
        	'Title':'四川省人民医院编辑部',
            visible: false,
        };
    }
    logout = () =>{
        axios.get("/logout").then(()=>{
            sessionStorage.clear();
            window.location.href = "/";
        }).catch(function () {
            message.error('连接失败，请稍候重试！');
        });
    }
    modalOpen = () => {
        this.setState({
            visible: true,
        });
    }
    modalClose = () => {
        this.setState({
            visible: false,
        });
    }
    render(){
		    return(
		      <header className='appHeader'>
		        <author style={{display:'none'}}>UESTC-WQ</author>
		        <logo><img src={this.state.logo_img} style={{width:'100%'}}></img></logo>
		        <headtitle style={{fontSize:'1rem'}}>{this.state.Title}</headtitle>
		        <nav>
		       	  <ul>
		       	  	<li style={{}}>
		       	  		<p style={{fontSize:'1.2rem',marginTop:'1.4rem'}}><home><a href="#/">首页</a></home></p>
		       	  	</li>
		       	  	<a href="#" style={{position:'relative',textAlign:'left',marginTop:'0.1rem'}}>
			       	  	<Icon type="user" style={{color:'#337ab7',fontSize:'1.2rem'}}/>
			       	  	<li style={{}}>
			       	  		<name><p style={{fontSize:'0.6rem',marginTop:'0.5rem'}} onClick={this.logout}><a href={this.state.Personal_info_change} target="_blank">{this.state.name}</a></p></name>
			       	  	</li>
		       	  	</a>
		       	  </ul>
		        </nav>
				  <Modal
					  visible={this.state.visible}
					  maskClosable = {false}
					  onCancel={this.modalClose}
					  title="注销登陆确认"
					  footer={[
						  <Button key="submit" type="primary" size="large" onClick={this.logout}>
							  确定
						  </Button>,
						  <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
					  ]}
				  >
					  <p>您确定要注销并退出吗？</p>
				  </Modal>
		      </header>
		)
    }
}
export default Header;