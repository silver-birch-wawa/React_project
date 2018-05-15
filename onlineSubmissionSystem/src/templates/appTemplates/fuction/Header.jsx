import React, { Component } from 'react';
import '../../../css/Header.css';

import 'antd/dist/antd.css';
class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            'name':'xss',
            'logo_img':'http://static.samsph.com/images/logo.png',
            'Title':'四川省人民医院编辑部'
        };
    }
    render(){
        return(
			<header className='appHeader'>
				<logo><img src={this.state.logo_img} style={{width:'100%'}}/></logo>
				<div style={{fontSize:'1.5rem',paddingRight:'35rem'}}>{this.state.Title}</div>
			</header>
        )
    }
}

export default Header;