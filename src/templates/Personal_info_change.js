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

class Container extends Component{
   constructor(props){
   	 super(props);
   	 this.state={
   	 	'role':'author',
   	 	'author':['收寄地址','办公室电话','所在地邮编','所在地中文名','所在地英文名','研究方向'],
   	     };   	 	
   	 this.upload={};
   	 this.icon={}
   	 this.icon['联系方式']=<img class='img-icon' src={require('../img/mobilephone_fill.png')}/>
   	 this.icon['办公室电话']=<img class='img-icon' src={require('../img/phone.png')}/>
   	 this.icon['收寄地址']=<img class='img-icon' src={require('../img/mail_fill.png')}/>
   	 this.icon['性别']=<img class='img-icon' src={require('../img/性别.png')}/>
     this.icon['所在地邮编']=<img class='img-icon' src={require('../img/mail.png')}/>
     this.icon['研究方向']=<img class='img-icon' src={require('../img/search.png')}/>
     this.icon['所在地中文名']=<img class='img-icon' src={require('../img/homepage.png')}/>
     this.icon['所在地英文名']=<img class='img-icon' src={require('../img/homepage_fill.png')}/>
     this.icon['姓名']=<img class='img-icon' src={require('../img/wxb账户.png')}/>
     this.icon['个人介绍']=<img class='img-icon' src={require('../img/edit.png')}/>
     this.icon['职称']=<img class='img-icon' src={require('../img/职称.png')}/>
   	 this.subjects=['外科','内科','妇科']
	}
	handlechange(item,e){
		// let value=`${item}[0]`;
		// console.log(item);
		let object_name=item['item'];
		// console.log(object_name);

		if(object_name=='研究方向'){
			this.upload['研究方向']=[];
			{
				e.map((item,i)=>{
				   //console.log(item['label']);
				   this.upload['研究方向'].push(item['label']);
			    })
		    }
		    console.log(this.upload);
		}
		else if(object_name=='性别'){
			this.upload['性别']=e['label']
		    console.log(this.upload);	
		}
		else{
			let value=e.target.value;
			console.log(object_name);
			this.upload[object_name]=value;
		    console.log(this.upload);		    
		}
//		console.log(value);
	}
	handleClick(e){
		alert(this.upload);
		window.location.reload();
	}
	render(){
		 return(
		 	<html style={{paddingLeft:'90px'}}>
				<middleForm>
				  <div class='form-section'>
				     {this.icon['职称']}
				    <p>职称：&nbsp;{this.state.role}</p>
				  </div>
				  <div class='form-section' style={{border:'1px bold black'}}>
				    {this.icon['性别']}
				    <p>性别：&nbsp;</p>
				    <Select defaultValue="" onChange={this.handlechange.bind(this,{'item':'性别'})} labelInValue defaultValue={{key:this.subjects[0]}} style={{width:60}}>
				      <Option value="male">男</Option>
				      <Option value="female">女</Option>
				    </Select>
				  </div>
				  <div class='form-section'>
				    {this.icon['姓名']}
				    <p>姓名：&nbsp;</p>
					<Input placeholder="必填" style={{width:'30%'}} onChange={this.handlechange.bind(this,{'item':'姓名'})}/>
				  </div>			  
				  <div class='form-section'>
				    {this.icon['联系方式']}
				    <p>联系方式：&nbsp;</p>
					<Input placeholder="必填" style={{width:'60%'}} onChange={this.handlechange.bind(this,{'item':'联系方式'})}/>
				  </div>

				  {
				  	this.state[this.state.role].map((item,i)=>{
				  	if(item!='研究方向'){return (
													  <div class='form-section'>
													    {this.icon[item]}
													    <p>{item}：&nbsp;</p>
														<Input placeholder="必填" style={{width:'60%'}} onChange={this.handlechange.bind(this,{item})}/>
													  </div>
				  								)
				  						}
				  	else{return(
								  <div class='form-section'>
								    {this.icon[item]}
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
				    {this.icon['个人介绍']}
				    <p>个人介绍：&nbsp;</p>
					<TextArea style={{width:'70%'}} rows={4} placeholder="个人介绍" onChange={this.handlechange.bind(this,{'item':'个人介绍'})}/>
				  </div>				    
				  <div class='form-section'>
				     <Button type="primary" id='Tab_submit' style={{float:'right',marginTop:'30px',marginLeft:'0px'}} onClick={this.handleClick.bind(this)}>提交</Button>
				  </div>
				</middleForm>
			</html>
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
		      <Container/>
	    );
	}
}
export default Personal_info_change;