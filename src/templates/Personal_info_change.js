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
const URL='http://127.0.0.1:8080';

function isEmptyObject(obj){
    for (var n in obj) {
        return false
    }
    return true; 
} 

// 利用localstorage固定数据:
function obj_store(obj){
    localStorage.setItem('obj',JSON.stringify(obj));
}
function obj_get(){
   return JSON.parse(localStorage.getItem('obj'));
}

function ajax_post(url,data,that,callback){
	axios({
        method:"POST",
		headers:{'Content-type':'application/json',},
        url:URL+url,
        data:data,
        withCredentials:true
    }).then(function(res){
        console.log(res.data);
        console.log('post-response:'+res.data);
        callback(that,res);
        //ajax_get('/manage/getinfo',this);
    }).catch(function(error){
        alert('post失败')
        console.log(error);
    });
}

function ajax_post_params(url,data,that,callback=()=>{}){
	axios({
        method: 'post',
        url: URL+url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        params:data,
    })
	.then(function(res){
    	alert('post:'+res)
        console.log(res);
        //alert('post-response:'+res);
        callback(that,res);
        //ajax_get('/manage/getinfo',this);
    }).catch(function(error){
        alert('post失败')
        console.log(error);
    });
}

function ajax_get(url,that,callback){
	axios({
        method:"GET",
		headers:{'Content-type':'application/json',},
        url:URL+url,
        withCredentials:true
    }).then(function(res){
        console.log(res);
        //alert('get:'+this.res);
        callback(that,res);

    }).catch(function(error){
    	alert('get下载失败')
        console.log(error);
    });
}

class Container extends Component{
   constructor(props){
   	 super(props);
   	 this.state={
   	 	'role':'作者',
   	 	'作者':['学历','联系方式','收寄地址','办公室电话','职称','所在地邮编','所在地中文名','所在地英文名','研究方向'],
   	 	'主编':[],
   	 	'审稿人':['研究方向'],
   	 	'读者':[],
   	 	'编辑':[],
   	 	'data':'',
   	 	'education':[],
   	 	'academicsec':[]
   	     };   	 
   	 this.Personal_info={'姓名':'','个人介绍':'','职称':'','学历':'','性别':'','联系方式':'','办公室电话':'','研究方向':[''],'收寄地址':'','所在地邮编':'','所在地中文名':'','所在地英文名':''};
   	 //this.Personal_info={'姓名':'qqqq','个人介绍':'jlqjlqdjlldjlj','职称':'博士生导师','学历':'本科生','性别':'女','联系方式':'189192121','办公室电话':'1 979829382','研究方向':['内科','妇科'],'收寄地址':'成都','所在地邮编':'32323232','所在地中文名':'是继续开始进行筛选','所在地英文名':'kewhukwncwncdwc'};	
   	 this.url='';
	// axios.defaults.withCredentials=true;
	/*
	post:(res.data)
	{result: 1, name: "czl1"}

	get:(res.data)
	{name_pinyin: "czl1", address: "ww", education: "awdas", gender: 1, workspace_en: "1", …}
	academicsec:"qwe"
	address:"ww"
	education:"awdas"
	email:"ss"
	gender:1
	id:1
	introduction:"1"
	location:1
	major:1
	name:"czl1"
	name_pinyin:"czl1"
	officetel:"1"
	phonenum:"1"
	postcode:"1"
	researchdir:"1"
	title:"1"
	workspace_ch:"1"
	workspace_en:"1"
	*/
   	this.type_education={};
   	this.type_academicsec={};
   	this.education=[];        

	this.upload={};
	this.icon={}
	this.icon['密码']=<img class='img-icon' src={require('../img/passwd.png')}/>
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
	this.icon['学历']=<img class='img-icon' src={require('../img/cert.png')}/>
	//this.subjects=['外科','内科','妇科']
	this.subjects=[];

	this.gender={1:'男',2:'女'};
	this.password=['',''];
	this.reflect={'gender':'性别','name':'姓名','性别':'gender','姓名':'name','':''};
	}
	componentDidMount(){
			// 角色判断
			let role=obj_get()['role'];
			this.Personal_info['职称']=role; 
			this.setState({'role':role})

		   	// ajax_post('/common/login',{
		    // 	"username":"master",
		    // 	"password":"12345678",
		    // 	"role":2
		    //  },this,(that,res)=>{

			ajax_get('/manage/getinfo',this,(that,res)=>{
				    	let data=[];
				    	for(let l in res.data.information){
				    		this.Personal_info[this.reflect[l]]=res.data.information[l];
				    		if(l=='gender'){
				    			this.Personal_info[this.reflect[l]]=this.gender[res.data.information[l]];
				    		}
				    	}
						console.log(res.data.information);
			        })	 

			//{"result":1,"educationlist":[{"education":"高中生","id":1},{"education":"本科生","id":2},{"education":"研究生","id":3},{"education":"讲师","id":4},{"education":"副教授","id":5},{"education":"教授","id":6},{"education":"其他","id":7}]}
			    ajax_get('/common/gettype/type=education',this,(that,res)=>{
			    	let data=[];
			    	console.log(res.data.typelist);
			    	for(let l in res.data.typelist){
			    		console.log(l)
			    		let edu=res.data.typelist[l];
			    		data.push(edu['education']);
			    		console.log(edu['education']);
			    		that.type_education[edu['education']]=edu['id'];
			    	}
			    	that.setState({'education':data})
			    	that.education=data;
					console.log(data);
			    })
			//{"result":1,"academicseclist":[{"academicsec":"临床医学","id":1},{"academicsec":"麻醉学","id":2},{"academicsec":"医学影像学","id":3},{"academicsec":"口腔医学","id":4},{"academicsec":"其他","id":5}]}
				ajax_get('/common/gettype/type=academicsec',this,(that,res)=>{
					let data=[];
					let i=1;
					console.log(res);
					for(let l in res.data.typelist){
						let aca=res.data.typelist[l];
						data.push(aca['academicsec']);
						//alert(l['academicsec']);
						that.type_academicsec[aca['academicsec']]=aca['id'];
					}
					that.setState({'academicsec':data})
					that.subjects=data;
					console.log(data);
				})	

				ajax_get('/common/gettype/type=role',this,(that,res)=>{
					let data=[];
					console.log(res);
				})

		     // });

	}
	// data源数据this.education,target:'临床医学',key:'academicsec'
	search_id(data,target,key){
		console.log(data);
		console.log(target);
		console.log(key);
		for(let l in data){
			let name=l[key]
			if(name==target){
				return l['id'];
			}
		}
	}
	hangdlejson(data){
		let trans={};
		let upload={}
		trans['性别']='gender';  ///0 man 1 woman
		trans['收寄地址']='address';		
		trans['姓名']='name';
		trans['联系方式']='phonenum';
		trans['研究方向']='researchdir';
		trans['办公室电话']='officetel';
		trans['个人介绍']='introduction';
		trans['职称']='title'; 
		trans['学历']='education';
		trans['所在地邮编']='postcode';
		trans['所在地英文名']='workspace_en';
		trans['所在地中文名']='workspace_ch';
		//console.log(data);
		//trans['academicsec']='';	
		for(let l in data){
		    if(l=='性别'){
		    	upload[trans[l]]=data[l]=='男'?1:2;
		    }		
		    else if(l=='学历'){
		    	console.log(this.type_education);
		    	console.log(data[l]);
		    	upload[trans[l]]=this.type_education[data[l]];
		    	console.log(upload[trans[l]])
		    	// console.log(this.search_id(this.state.education,data[l],'education'));
		    	//data[l]=this.type_education[data[l]];
		    }
		    else if(l=='研究方向'){
		    	let search=[];
		    	for(let i in data[l]){
		    		console.log(data[l][i]);
		    		search.push(this.type_academicsec[data[l][i]]);
		    		// console.log(this.search_id(this.state.academicsec,data[l][i],'academicsec'));
		    	}
		    	upload[trans[l]]=search;
		    }
		    else{
		    	upload[trans[l]]=data[l];
		    }
		    //console.log(upload['researchdir'])
		    console.log(upload);
		    this.Personal_info[l]=data[l];
		}
		return upload;
		/*
		for(let l in data){
		    if(l=='性别'){
		    	data[l]=='男'?0:1;
		    };
		    if(l=='学历'){
		    	data[l]=this.type_education[data[l]];
		    }
		    if(l==''){
		    	data[l]=this.type_academicsec[data[l]]
		    }
		    this.Personal_info[trans[l]]=data[l];
		}
		this.subjects=data['academicsec'];
		*/
	}
	handlechange(item,e){
		// let value=`${item}[0]`;
		// console.log(item);
		let object_name=item['item'];
		console.log(this.upload);
		if(object_name=='研究方向'){
			this.upload['研究方向']=[];
			{
				e.map((item,i)=>{
				   //console.log(item['label']);
				   this.upload['研究方向'].push(item['label']);
			    })
		    }
			if(this.upload['研究方向']!=undefined){
				if(this.upload['研究方向'].length>=3){
			    	alert('最多上传三个');
			    	this.upload['研究方向']=this.upload['研究方向'].slice(0,3);
			    	//return;
			    }
			}
		    //this.upload['']
		    //this.upload['研究方向'].pop();
		    console.log(this.upload);
		}
		else if(object_name=='老密码'){
			this.password[0]=e.target.value;
			console.log(e.target.value);
		}
		else if(object_name=='新密码'){
			this.password[1]=e.target.value;
			console.log(e.target.value);
		}
		else if(object_name=='性别'){
			this.upload['性别']=e['label'];
		    console.log(this.upload);	
		}
		else if(object_name=='学历'){
			this.upload['学历']=e['label'];
		    console.log(this.upload);				
		}
		else if(e['label']==''){
			delete this.upload[object_name];
			alert('sdsdsds')
		}
		else{
			let value=e.target.value;
			console.log(object_name);
			this.upload[object_name]=value;
			if(value==''){
				delete this.upload[object_name];
				alert('sdsdsds')				
			}
		    console.log(this.upload);		    
		}
//		console.log(value);
	}

	is_tel(str,e){
		if(this.upload[str]==undefined){
			return 1;
		}
		let pat=/\d+/i;
    	let label=pat.exec(this.upload[str]);
    	if(label==null||label[0]!=e.target.value){
    		alert('请输入正确的电话号码');
    		return 0;
    	}
	}

	handleClick(e){
		let password={};
		console.log(this.upload);
		if(isEmptyObject(this.upload)&&this.password[0]==''&&this.password[1]==''){
			alert('表单为空！');
			return ;
		}
  		if(this.is_tel('联系方式',e)==0){
  			return;
  		}
    	// 内容上传点
    	this.upload=this.hangdlejson(this.upload);
    	console.log(this.upload);
    	// {学历: "副教授", 性别: "女", 姓名: "颠三倒四", 个人介绍: "出来看我每次离开面对市场上"}
    	if(isEmptyObject(this.upload)==false){
	    	ajax_post('/manage/modinfo',this.upload,this,(that,res)=>{});
    	}
    	if(this.password[0]!=''&&this.password[1]!=''){
    		password={'oldpwd':this.password[0],'newpwd':this.password[1]};
    	    ajax_post_params('/manage/resetpwd',password,this,(that,res)=>{});
    		console.log(typeof(this.password[0]))
    	}
		//window.location.reload();
	}

	render(){
	/*
	   	ajax_post('/common/login',{
	    	"username":"ss",
	    	"password":"11",
	    	"role":1
	     },()=>{ajax_get('/manage/getinfo',this,)});
	*/
	console.log(this.Personal_info);
	if(this.state.education[0]!=undefined&&this.state.academicsec[0]!=undefined){
		 return(
		 	<html style={{paddingLeft:'90px'}}>
				<middleForm>
				  <div class='form-section'>
				     {this.icon['职称']}
				    <p>角色：&nbsp;{this.state.role}</p>
				  </div>
				  <div class='form-section' style={{border:'1px bold black'}}>
				    {this.icon['性别']}
				    <p>性别：&nbsp;</p>
				    <Select onChange={this.handlechange.bind(this,{'item':'性别'})} labelInValue defaultValue={{key:this.Personal_info['性别']}} style={{width:'2rem'}}>
				      <Option value="male">男</Option>
				      <Option value="female">女</Option>
				    </Select>
				  </div>		  

				  <div class='form-section'>
				    {this.icon['姓名']}
				    <p>姓名：&nbsp;</p>
					<Input style={{width:'30%'}} placeholder={this.Personal_info['姓名']} onChange={this.handlechange.bind(this,{'item':'姓名'})}/>
				  </div>			  
				  
				  <div class='form-section'>
				    {this.icon['密码']}
				    <p>老密码：&nbsp;</p>
					<Input style={{width:'30%'}} onChange={this.handlechange.bind(this,{'item':'老密码'})}/>
				    &nbsp;&nbsp;
				    <p>新密码：&nbsp;</p>
					<Input style={{width:'30%'}} onChange={this.handlechange.bind(this,{'item':'新密码'})}/>					
				  </div>

				  {
				  	this.state[this.state.role].map((item,i)=>{
					if(item=='学历'){
						return(<div class='form-section' style={{border:'1px bold black'}}>
						    {this.icon['学历']}
						    <p>学历：&nbsp;</p>
						    <Select onChange={this.handlechange.bind(this,{'item':'学历'})} labelInValue defaultValue={{key:this.Personal_info['学历']}} style={{width:'4rem'}}>
							    {
							    	this.state.education.map((items,index)=>{
							      	  {return (<Option value={items}>{items}</Option>)}
							      })
							  	}
						    </Select>
						  </div>)
					}
					else if(item=='联系方式'){
						return(
						  <div class='form-section'>
						    {this.icon['联系方式']}
						    <p>联系方式：&nbsp;</p>
							<Input style={{width:'60%'}} placeholder={this.Personal_info['联系方式']} onChange={this.handlechange.bind(this,{'item':'联系方式'})}/>
						  </div>						
						)
					}	
				  	else if(item!='研究方向'&&item!='个人介绍'){return (
													  <div class='form-section'>
													    {this.icon[item]}
													    <p>{item}：&nbsp;</p>
														<Input style={{width:'60%'}} placeholder={this.Personal_info[item]} onChange={this.handlechange.bind(this,{item})}/>
													  </div>
				  								)
				  						}		  						
				  	else if(item!='个人介绍'){
				  		return(
								  <div class='form-section'>
								  	<author style={{display:'none'}}>UESTC-WQ</author>
								    {this.icon[item]}
								    <p>研究方向：&nbsp;</p>
								      <Select
									    mode="multiple"
									    style={{ width: '60%' }}
									    placeholder="必填"
									    placeholder={this.Personal_info['研究方向'].toString()}
									    labelInValue
									    onChange={this.handlechange.bind(this,{item})}
									  >
									  {this.state.academicsec.map((items,i)=>{return (<Option key={i} value={items}>{items}</Option>)})}
									  </Select>
								  </div>
				  		)}
				    else if(item=='个人介绍')
				    {
					    return(
						  <div class='form-section'>
						    {this.icon['个人介绍']}
						    <p>个人介绍：&nbsp;</p>
							<TextArea style={{width:'60%'}} rows={4} placeholder={this.Personal_info['个人介绍']} onChange={this.handlechange.bind(this,{'item':'个人介绍'})}/>
						  </div>
						)
				    }
				  											  }
				  										   )
				  }
				    
				  <div class='form-section'>
				     <Button type="primary" id='Tab_submit' style={{float:'right',marginTop:'30px',marginLeft:'0px'}} onClick={this.handleClick.bind(this)}>提交</Button>
				  </div>
				</middleForm>
			</html>
		 )
	   }
	   else{
	   	return(<p>loading.....</p>);
	   } 
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