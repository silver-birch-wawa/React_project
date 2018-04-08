import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Button, Radio, Icon ,Modal} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
const Option = Select.Option;
const { TextArea } = Input;

class Header extends Component{
    constructor(props){
    	super(props);
        this.state={
        	'name':'xss',
        	'Personal_info_change':'/#/Personal_info_change',
        	'logo_img':'http://static.samsph.com/images/logo.png',
        	'Title':'四川省人民医院编辑部'
        };
    }
    logout(){

    }
    render(){
		    return(
		      <header className='header'>
		        <title>主编页面</title>
		        <logo><img src={this.state.logo_img} style={{width:'100%'}}></img></logo>
		        <headtitle style={{fontSize:'1rem'}}>{this.state.Title}</headtitle>
		        <nav>
		       	  <ul>
		       	  	<li style={{}}>
		       	  		<p style={{fontSize:'0.7rem',marginTop:'0.5rem'}}><home><a href="/Home#/">Home</a></home></p>
		       	  	</li>
		       	  	<a href="#" style={{position:'relative',textAlign:'left',marginTop:'0.1rem'}}>
			       	  	<Icon type="user" style={{color:'#337ab7',fontSize:'0.8rem'}}/>
			       	  	<li style={{}}>
			       	  		<name><p style={{fontSize:'0.6rem',marginTop:'0.5rem'}} onClick={this.logout}><a href={this.state.Personal_info_change}>{this.state.name}</a></p></name>
			       	  	</li>
		       	  	</a>
		       	  </ul>
		        </nav>
		      </header>
		)
    }
}

class Container extends Component{
   constructor(props){
   	 super(props);
   	 this.state={
   	 	'role':'author',
   	 	'author':['收寄地址','办公室电话','所在地邮编','所在地中文名','所在地英文名','研究方向'],
   	     };   	 	
   	 this.upload={};
   	 this.subjects=['外科','内科','妇科']
	}
	handlechange(item,e){
		// let value=`${item}[0]`;
		// console.log(item);
		let object_name=item['item'];
		// console.log(object_name);

		if(object_name!='研究方向'){
			let value=e.target.value;
			console.log(object_name);
			this.upload[object_name]=value;
		    console.log(this.upload);		    
		}
		else{
			this.upload['研究方向']=[];
			{
				e.map((item,i)=>{
				   //console.log(item['label']);
				   this.upload['研究方向'].push(item['label']);
			    })
		    }
		    console.log(this.upload);
		}
//		console.log(value);
	}
	handleClick(e){
		alert(this.upload);
	}
	render(){
		 return(
		 	<container>
				<middleForm>
				  <div class='form-section'>
				    <p>职称：&nbsp;{this.state.role}</p>
				  </div>
				  <div class='form-section' style={{border:'1px bold black'}}>
				    <p>性别：&nbsp;</p>
				    <Select defaultValue="" onChange={this.handlechange.bind(this,{'item':'性别'})} style={{width:60}}>
				      <Option value="male">男</Option>
				      <Option value="female">女</Option>
				    </Select>
				  </div>
				  <div class='form-section'>
				    <p>姓名：&nbsp;</p>
					<Input placeholder="必填" style={{width:'30%'}} onChange={this.handlechange.bind(this,{'item':'姓名'})}/>
				  </div>			  
				  <div class='form-section'>
				    <p>联系方式：&nbsp;</p>
					<Input placeholder="必填" style={{width:'60%'}} onChange={this.handlechange.bind(this,{'item':'联系方式'})}/>
				  </div>



				  {
				  	this.state[this.state.role].map((item,i)=>{
				  	if(item!='研究方向'){return (
													  <div class='form-section'>
													    <p>{item}：&nbsp;</p>
														<Input placeholder="必填" style={{width:'60%'}} onChange={this.handlechange.bind(this,{item})}/>
													  </div>
				  								)
				  						}
				  	else{return(
								  <div class='form-section'>
								    <p>研究方向：&nbsp;</p>
								      <Select
									    mode="multiple"
									    style={{ width: '60%' }}
									    placeholder="必填"
									    defaultValue={{key:this.subjects[0]}}
									    labelInValue
									    onChange={this.handlechange.bind(this,{item})}
									  >
									  {this.subjects.map((items,i)=>{return (<Option key={i} value={items}>{items}</Option>)})}
									  </Select>
								  </div>
				  		)}
				  											  }
				  										   )
				  }


				  <div class='form-section'>
				    <p>个人介绍：&nbsp;</p>
					<TextArea style={{width:'70%'}} rows={4} placeholder="个人介绍"/>
				  </div>				    

				  <Button type="primary" id='Tab_submit' style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>

				</middleForm>
			</container>
		 )
	}
}
class Personal_info_change extends Component{
   constructor(props){
   	 super(props);
	}

	render() {
	  	//alert('alert:\n'+this.state.data);
	  	
	    return (
	        <div className='html'>
		      <Header/>
		      <Container/>
		    </div>
	    );
	}
}
export default Personal_info_change;