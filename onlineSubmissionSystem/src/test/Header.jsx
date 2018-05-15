import React, { Component } from 'react';
import { Icon,Button,Modal,message } from 'antd';
import axios from 'axios';
import '../css/Header.css';

function error(title,content) {
    Modal.error({
        okText: '确定',
        title: title,
        content:content
    });
}

class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            'name':localStorage.getItem("userName"),
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
			<header className='header'>
				<logo><img src={this.state.logo_img} style={{width:'100%'}}/></logo>
				<headtitle style={{fontSize:'1.5rem'}}>{this.state.Title}</headtitle>
				<nav>
					<ul>
						<li>
							<p style={{fontSize:'1rem',marginTop:'0.5rem'}}><home><a href="#/">Home</a></home></p>
						</li>
						<a href="#" style={{position:'relative',textAlign:'left',marginTop:'0.1rem'}}>
							<Icon type="user" style={{color:'#337ab7',fontSize:'0.8rem'}}/>
							<li style={{}}>
								<name><p style={{fontSize:'1rem',marginTop:'0.5rem'}} onClick={this.logout}>{this.state.name}</p></name>
							</li>
						</a>
						<li>
							<a onClick={this.modalOpen}><Icon type="logout" />logout</a>
						</li>
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