import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Table,Button, Radio, Icon ,Modal} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import { Input} from 'antd';
import axios from 'axios';
import { Badge } from 'antd';
import {Menu} from  'antd';
import Header from './Header';
const MenuItemGroup = Menu.ItemGroup;

const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Panel = Collapse.Panel;

const URL='http://127.0.0.1:8080';

// 利用sessionstorage共享全局变量
function obj_store(obj){
	sessionStorage.setItem('obj', JSON.stringify(obj)); 
}
function obj_get(){
	var obj = JSON.parse(sessionStorage.getItem('obj'));
	return obj 
}

function ajax_post(url,data,that,callback){
	axios({
        method:"POST",
		headers:{'Content-type':'application/json',},
        url:URL+url,
        data:data,
        //withCredentials:true
    }).then(function(res){
    	//alert('post:'+res)
        console.log('post:'+res);
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
    	//alert('post:'+res)
        console.log('post:'+res);
        //alert('post-response:'+res);
        callback(that,res);
        //ajax_get('/manage/getinfo',this);
    }).catch(function(error){
        alert('post失败')
        console.log(error);
    });
}

class Container extends Component{
   constructor(props){
   	    super(props);
   	    this.state={
   	        'content':[],
   	        'data':{}
        }
   }

   change_content(content){
   	  this.state.content=content;
      // alert('content'+content);
      this.setState({'content':content});
   }

   change_distribute_content(data){
   	    this.state.data=data;
   	    console.log('105 $$$$$$$$$$$$$$$:')
   	    console.log(data);
   		this.setState({'data':data});
   }

   render(){
   	return(
   	     <container>
   	         <Aside change_content={this.change_content.bind(this)} change_distribute_content={this.change_distribute_content.bind(this)}/>
   	         <Main content={this.state.content} data={this.state.data}/>
   	     </container>
   	     )
   }
}

class Aside extends Component{
	constructor(props){
		super(props);
		this.state={
			// 如果是稿件分配，则
			// ['Module_name',[status(1/0),author_name,paper-name,(editor'sname)],[...]]

	content:["distributePaper",[[1,'Tom','java'],[7,'Jack','PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP','Jack`s editor'],[7,'Alex','PSIDPSIDPSIDSIDSODIS','Alex`s editor'],[7,'Jason','PythonPythonPythonPythonPythonPythonPython','Jason`s editor']],['none','Tom111111','Tom2','Tom3']]
			,data:[]
		}
		/*
		axios({
            method: 'post',
            url: URL+'/contribute/task',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            params: {
                id_role:1,
                role:2,
                //test
                stat:0,
                flag:0,
                page:1,
            },
        })
        */    

        // stat后台比我多1

		this.editors={};
		//  editors姓名与id的键值

		this.articles={};

		this.task;
		// task表里的所有数据

		this.authors={};
		// id与autho	rs的名字的键值
	}
	componentDidMount() {
	 		
	 		// 跑通了
	 		// {"result":1,"data":
	 		// [{"name_pinyin":"ceshizuozheyi","education":3,"gender":0,"academicsec1":1,"alive":1,
	 		// "workspace_en":"test1","academicsec3":null,"academicsec2":2,"title":"","password":"12234","major":1,
	 		// "workspace_ch":"测试1","id":1,"researchdir":"医学","email":"11111@test.com","introduction":"测试1","address":"测试1","postcode":"100000",
	 		// "safeque2":"2;测试1","safeque3":"3;测试1","phonenum":"12345678900","safeque1":"1;测试1","officetel":"123456","name":"测试作者一","location":1},
	 		
	 		// {"name_pinyin":"ceshizuozheer","education":5,"gender":0,"academicsec1":1,"alive":1,"workspace_en":"test2","academicsec3":2,"academicsec2":2,
	 		// "title":"","password":"123456","major":1,"workspace_ch":"测试2","id":2,"researchdir":"医学","email":"22222@test.com",
	 		// "introduction":"测试2","address":"测试2","postcode":"100000","safeque2":"2;测试2","safeque3":"3;测试2","phonenum":"12345678901",
	 		// "safeque1":"1;测试2","officetel":"123457","name":"测试作者二","location":1},
	 		
	 		// {"name_pinyin":"ceshizuozhesan","education":4,"gender":1,"academicsec1":1,"alive":1,
	 		// "workspace_en":"test","academicsec3":4,"academicsec2":3,"title":"","password":"123456","major":1,"workspace_ch":"测试3","id":3,"researchdir":"医学","email":"33333@test.com",
	 		// "introduction":"测试3","address":"测试3","postcode":"100000","safeque2":"2;测试3","safeque3":"3;测试3","phonenum":"12345678902","safeque1":"1;测试3",
	 		// "officetel":"123458","name":"测试作者三","location":1}]}
			ajax_post('/contribute/task/resource',{resource:{func:"authors"}},this,(that,res)=>{
				    //this.authors=res.data.data;
					let authors=res.data.data;
					let i=1
					for(let l in authors){
						this.authors[i]=authors[l].name;
						this.authors[authors[l].name]=i;
						i+=1;
					}
					console.log(this.authors)			
			})

			// {"result":1,"data":
			// {"standard":{"num":[20,20,20,20],"ddl":[1522511999000,1530374399000,1538323199000,1546271999000]},
			// "schedule":[0,0,0,0],"editor":[],"total":1,
			// "task":[{"id":1,"id_article":1,"id_role":1,"content":null,"stat":0,"role":2,"flag":0,"date":1524637974000}],
			// "invoice":[],
			// "article":[{"id":1,"title":"测试","format":".docx;.rar","academicsec":1,"column":1,
			// "keyword1_ch":"测试","keyword2_ch":null,"keyword3_ch":null,"keyword4_ch":null,"keyword1_en":"test","keyword2_en":null,"keyword3_en":null,"keyword4_en":null,
			// "summary_ch":"测试","summary_en":"test","writer_id":1,"writers_info":"","writer_prefer":null,"writer_avoid":null,"date_sub":1525314608000,"date_pub":null}]}}

			// bug is here
			ajax_post_params('/contribute/task',{id_role:1,role:2,stat:0,flag:0,page:1},this,(that,res)=>{
				let data=[]
				this.task=res.data.data;
				for(let l in this.task.article){
					console.log(l)
					this.articles[this.task.article[l]['title']]=this.task.article[l]['id'];
					this.articles[[this.task.article[l]['id']]]=this.task.article[l]['title'];
				}
				for(let l in this.task.task){
					let bug=[] 
					bug.push(this.task.task[l]['stat']+1);

					//console.log(this.task.article);
					//console.log(this.authors)
					//console.log(this.authors[this.task.article[l]['writer_id']])

					bug.push(this.authors[this.task.article[l]['writer_id']]);
					//alert(this.authors[this.task.article[l]['writer_id']])
					bug.push(this.task.article[l]['title']);
					data.push(bug);
				}
				this.state.content[1]=data;
				console.log(this.task);
			});					

			// 跑通了
			// {"result":1,"data":[{"role":0,"gender":0,"alive":1,"name":"主编","id":1,"username":"master"},
			// {"role":1,"gender":0,"alive":1,"name":"编辑1","id":2,"username":"editor1"},
			// {"role":1,"gender":0,"alive":1,"name":"编辑2","id":3,"username":"editor2"}]}
	        ajax_post('/contribute/task/resource',{resource:{func:"editors"}},this,(that,res)=>{
	        	//console.log(res)
	        	let data=res.data.data;
	        	//console.log(data);
	        	let editors=[]
	        	for(let l in data){
	        		if(l!=0){
		        		editors.push(data[l]['name']);
		        		this.editors[data[l]['name']]=data[l]['id'];
		        		this.editors[data[l]['id']]=data[l]['name'];
	        		}
	        	}
	        	this.state.content[this.state.content.length-1]=editors;
	        	console.log(editors);
	        })   

	}

	action(word,e){
        // 动画操作:
		      alert(word)
		      this.state.content[0]=word;
		      // alert('state'+this.state.content['distributePaper']);
           	  this.props.change_content(this.state.content);
   	    }
   handleClick(e){
   	  console.log(e)
      this.state.content[0]=e['key'];
      // alert('state'+this.state.content['distributePaper']);
   	  this.props.change_content(this.state.content);
   	  
   	  console.log(this.editors)
   	  this.props.change_distribute_content({'articles':this.articles,'editors':this.editors,'authors':this.authors});   	  
   }

   render(){
   	    // if(this.state.data!=[]){
   	    console.log(this.state.content)
 
   	    //this.state.content=this.state.data;
   	    //alert(this.state.content);


        //     alert(this.state.content);
   	    // }
   	    return(
   	    	<div style={{width:'20%',padding:'0px'}}>
	    		<Menu
					mode="inline"
					inlineCollapsed = "false"
					defaultSelectedKeys={[this.state.selectedKeys]}
					style={{ width:"80%",paddingLeft:'25px'}}
					onClick={this.handleClick.bind(this)}
				>
					<MenuItemGroup key="i1" style={{paddingLeft:'-50px!important'}} title={<span><Icon type="bars" /><span>功能菜单</span></span>}>
						<Menu.Item key="distributePaper"><Icon type="pie-chart" />&nbsp;稿件分配</Menu.Item>
						<Menu.Item key="timetable"><Icon type="calendar" />&nbsp;稿件排期</Menu.Item>
						<Menu.Item key="paper-status"><Icon type="clock-circle-o" />&nbsp;稿件状态</Menu.Item>
						<Menu.Item key="EditorWorkLoad"><Icon type="line-chart" />&nbsp;编辑工作量</Menu.Item>
						<Menu.Item key="PreviewerWorkLoad"><Icon type="laptop" />&nbsp;审稿人工作量</Menu.Item>
						<Menu.Item key="Personal_info_change"> <Icon type="user-add" />&nbsp;个人信息修改</Menu.Item>
					</MenuItemGroup>
				</Menu>			   
			</div> 
   	    )
   }
}
class HasDistributed extends Component{
   constructor(props){
   	 super(props);
   	 this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认',7:'已缴费'}
   	 this.td_width=['3rem','9rem','3rem']
   	 this.title=['作者名','稿件名','负责编辑']
   	 this.container_finished=[]
   	 this.editors=[]
   	 this.state={"contents":[]}
   }
   componentWillReceiveProps(nextProps) {
   	  alert('xss');
      this.setState({
        'contents':nextProps.content[1]
      });
    }
	render(){
			let columns = [{
			  title: '作者名',
			  dataIndex: 'name',
			  key: 'name',
			  render: (text,record) => <a href="#">{record.name}</a>,
			}, {
			  title: '稿件名',
			  dataIndex: 'paperName',
			  key: 'paperName',
			}, {
			  title: '负责编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			}];
			//columns=[];

			// let data = [{
			//   key: '1',
			//   name: 'John Brown1',
			//   paperName: '32', 
			//   editor:'New York1',
			// }, {
			//   key: '2',
			//   name: 'John Brown2',
			//   paperName: '320',
			//   editor:'New York2',
			// }, {
			//   key: '3',
			//   name: 'John Brown3',
			//   paperName: '3200',
			//   editor:'New York3',
			// }];	
			let data=[];

	   		this.state.contents=this.props.content[1].slice(0);
			
		if(this.state.contents!=undefined){
			console.log(this.state.contents)
			this.state.contents.map((item,i)=>{
		        var temp=item[0];
			    if(item[0]=='已分配'||item[0]!=1){
			    	item[0]='已分配';
					let temp={};
					temp['key']=i;
					temp['name']=item[1];
					temp['paperName']=item[2];
					temp['editor']=item[3];
					data.push(temp);
             		item[0]=temp;
             	}
				//alert(temp['name']);
				//console.log(item);
			}) 
		}
// content:["distributePaper",[[1,'Tom','java'],[7,'Jack','PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP','Jack`s editor']],['none','Tom111111','Tom2','Tom3']]


	   		//this.state.contents=this.props.content[1].slice(0);
	   		this.editors=this.props.content[2];
	   		//alert(this.state.contents);    
	     //    if(this.state.contents!=undefined){
		   	// 		this.distributePaper(this.state.contents); 
		   	// }

		   	// console.log('papapapa:'+this.props.content[1]);
		   	return (
				    	    <Table columns={columns} dataSource={data} />	
		           );
	}
}
class HasNotDistributed extends Component{
   constructor(props){
   	 super(props);
   	 this.contents=[]
   	 this.state={"contents":[],'container_unfinished':[],'none':'none'}
   	 this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认',7:'已缴费'}
   	 this.td_width=['3rem','9rem','3rem']
   	 this.title=['作者名','稿件名','负责编辑']
   	 this.container_unfinished=[]
   	 this.choosed_editors={}
   	 this.upload_data={}

   	 this.editor=this.props.editors;
   	 this.authors=this.props.authors;
   	 this.articles=this.props.articles;
   }

    handleChange(value,e) {
      this.contents=this.state.contents;
      var num=(value['key']-(value['key']%10000))/10000;
      if(value['label']!='none'){
		  this.choosed_editors[num]=value['label'];
		  //console.log(this.choosed_editors);
		  //alert(num);
		  console.log(this.state.container_unfinished)
		  this.state.container_unfinished.splice(num,1);
		  //console.log('****'+this.state.container_unfinished)
		  this.props.content[1][num][0]=2; 
      	  //this.setState({'contents':this.contents});
      } 
      else{
      	  delete this.choosed_editors[num];
      	  this.props.content[1][num][0]=1; 
      	  //this.setState({'contents':this.contents});
      }      
	}
   // 调用该函数使两个相邻组件更新一致
   change_the_other_component(){
   	  this.props.change_the_other_component();
   }
   handleClick(e){
       this.contents=this.props.content[1].slice(0);

		console.log(this.authors);
		console.log(this.articles);
		console.log(this.editor);   	  

       console.log(this.contents);
       console.log(this.choosed_editors)
       
       for(let i in this.choosed_editors){
       	  this.upload_data[i]=this.contents[i].slice(1,);
       	  this.upload_data[i].push(this.choosed_editors[i]);
       	  console.log(this.upload_data)
          // 0:["测试作者一", "测试文章1", "编辑1"]
          this.upload_data[i][0]=this.authors[this.upload_data[i][0]];
          this.upload_data[i][1]=this.articles[this.upload_data[i][1]];
          this.upload_data[i][2]=this.editor[this.upload_data[i][2]];

       	  console.log(this.upload_data)

       	  // obj_store(this.upload_data);

       	  this.props.content[1][i].push(this.choosed_editors[i]);
       	  //let senderName = ReactDOM.findDOMNode(this.refs['mytable'+i]);
       	  //alert(senderName.style)
       	  this.setState({'container_unfinished':this.state.container_unfinished,'none':'none'})
       }
       //console.log(this.props.contents)
       if(JSON.stringify(this.upload_data)!='{}'){
       		// this.upload_data=obj_get();
       		console.log(this.upload_data);   //稿件分配上传点
       		// 0:  ["测试作者一", "测试文章1", "编辑2"]
       		// 1:  ["测试作者二", "测试文章2", "编辑1"]
  			console.log(this.props.data);


       		for(let l in this.upload_data){
       			// 上传内容格式化
       			// this.upload_data[l][0]=this.authors[this.upload_data[l][1]];
       			// this.upload_data[l][1]=this.articles[this.upload_data[l][2]];       			
       			// this.upload_data[l][2]=this.editors[this.upload_data[l][3]];
       			alert(this.upload_data[l][0])
       			alert(this.upload_data[l][1])
       			alert(this.upload_data[l][2])
       		}
       		console.log(this.upload_data);   //稿件分配上传点
       }
      // window.location.reload();
      //alert('已提交');
      this.change_the_other_component();
   }
	render(){
			// 
		   	this.editor=this.props.data.editors;
		   	this.authors=this.props.data.authors;
		   	this.articles=this.props.data.articles;

		   	console.log(this.editor);

			let columns = [{
			  title: '作者名',
			  dataIndex: 'name',
			  key: 'name',
			  render: (text,record) => <a href="#">{record.name}</a>,
			}, {
			  title: '稿件名',
			  dataIndex: 'paperName',
			  key: 'paperName',
			}, {
			  title: '负责编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			},];
			let data=[];

		    //this.contents=Object.assign([],this.props.content[1]);
	   		this.state.contents=this.props.content[1].slice(0);

	   		this.editors=this.props.content[2];

		    this.state.contents.map((item,index) => { 
		        // alert(contents);
		        /* table的行 */
		        //alert(item[0])
			    if(item[0]==1){
			    	item[0]='未分配';

					let temp={};
					temp['key']=index;
					temp['name']=item[1];
					temp['paperName']=item[2];
					temp['editor']=  <Select id={{index}} onChange={this.handleChange.bind(this)} style={{width:'100%'}} labelInValue defaultValue={{key:this.state.none}}>
									 	      {this.editors.map((item,i)=>{ return (<Option value={index*10000+i} style={{width:'100%'}}>{item}</Option>)})}
									  </Select>
									;
					data.push(temp);

             		item[0]=1;
		            //alert('container_unfinished'+this.container_unfinished.length)
		        }    
			})


	   		//this.editors=this.props.content[2];
	   		console.log(this.state.contents);    
		   	return (
		    	    	<div>
		    	    		<Table columns={columns} dataSource={data} />
						    <Button type="primary" id='Tab_submit' style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
						</div>
		            );
	}
}

class Paper_status extends Component{
    constructor(props){
   	    super(props);
   	    this.state={'contents':[],sortedInfo: null};
	   	this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认',7:'已缴费'}
	   	this.td_width=['3rem','3rem','9rem','3rem']
	   	this.title=['状态','作者名','稿件名','负责编辑']
   	    this.contents={};
   	    this.editors=[];
   	    this.container_finished=[];
   	    this.value={'未分配':1,'审阅中':2,'未通过':3,'待修改':4,'通过':5,'格式确认':6,'已缴费':7}
    }
	render(){
		    //alert(this.props.content);
		    if(this.props.content!=undefined){
		    	    //console.log(this.props.content[1])
				    this.state.contents=this.props.content[1].slice(0);
			   		this.editors=this.props.content[2];    
			}
			this.state.contents=this.state.contents.sort(function(a,b){return a[0]-b[0]});

			let columns = [{
			  title: '状态',
			  dataIndex: 'status',
			  key: 'status',
			  sorter: (a, b) => this.value[a.status]-this.value[b.status],
			},{
			  title: '作者名',
			  dataIndex: 'name',
			  key: 'name',
			}, {
			  title: '稿件名',
			  dataIndex: 'paperName',
			  key: 'paperName',
			}, {
			  title: '负责编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			},{
			  title: '栏目',
			  dataIndex: 'lanmu',
			  key: 'lanmu',
			}];
			let data=[];

			
			
			//alert('辛苦索尼新款上线啊');

		    if(this.state.contents!=undefined){
		    	this.state.contents.map((item,index) => { 
		    		console.log(item)
		    		let Temp={};
		    		console.log('target');
		    		//console.log(this.state.content);
	                var temp=item[0];
	                //console.log(item[0]);
//	                item[0]=this.status_code[item[0]]?this.status_code[item[0]]:this.status_code[item[0]['key']];
					let status=(this.props.content[1][index][0]);
					console.log(status);
					//item[0]=this.status_code[item[0]];
					item[0]=this.status_code[status];					
					Temp['status']=item[0];
					Temp['key']=index;
					Temp['name']=item[1];
					//alert(Temp['name'])
					Temp['paperName']=item[2];
					Temp['editor']=item[3];

					// if(item[2]==undefined){
					// 	item[2]='undefined';
					// }
					if(item[3]==undefined){
						item[3]='undefined';
					}										
					data.push(Temp);
					console.log(data)
	             	item[0]=temp;
			            //alert('container_unfinished'+this.container_unfinished.length)  
			    });
			}

			//this.setState({'contents':this.state.contents});
			return (
						<div class='white-back' style={{border:'1px solid grey',borderRadius:'5px'}}>
					        <Table columns={columns} dataSource={data} onChange={this.handleChange} />	
					    </div>
				    );

		    }
	
}

class HasNotDate extends Component{
		constructor(props){
	   	    super(props);
	   	    // 编号从1--n
	   	    // download_data 已安排稿件对应刊数，has_distributed 各刊数对应已分配稿件数量
	   	    // 表格从1开始,下拉菜单从0开始
	   	    // 
	   	    this.state={'contents':[],'container':[],'upload_data':[],has_dated:{},has_distributed:{},changed:false,'download_data':{},visible:false,'none':''};
	   	    this.upload_data={};
	   	    this.get_data=4;  // 刊数  需要请求后端
	   	    for(let l=1;l<this.get_data+1;l++){
	   	    	this.state.has_distributed[l]=0;
	   	    }
//	   	    this.has_distributed={1:3,2:5,3:7,4:9};
//			this.has_distributed={};
	   	    this.has_distributed_length=0;
	   	    
	   	    this.has_dated={};
	   	    
	   	    this.columns;
	   	    this.data;

	   	    this.changed=false;

	   	    this.key='';
	   	    this.label='';
	   	    //this.state.has_distributed=this.has_distributed;
	   	    // this.state.has_distributed={1:3,2:8,3:19,4:9};
	    }
	    Pass(e){
	    	this.allow=true;
	    	//alert('Ok')
	    	this.setState({visible:false,});
	    	this.props.change_the_other_date_component(this.key,this.label);
	    	//this.Upload()
	    	console.log(this.upload_data[this.key]);
	    	//this.allow=true;
	    }
	    Cancel(e){
	    	this.allow=false;
	    	//alert('Cancel')
	    	this.setState({visible:false,});
	    	//this.allow=false;
	    }
	    handleChange(value,e) {
		      this.contents=this.state.contents;
		      let key=(value['key']-(value['key']%10000))/10000;
		      //key+=1;
		      console.log(value)
		      console.log(key)    
		      let lanmu=value['label']
		      if(this.upload_data[key]==undefined){
		    		this.upload_data[key]={};
			    	this.upload_data[key]['姓名']=this.props.has_dated[key]['data'][0];
			    	this.upload_data[key]['稿件名']=this.props.has_dated[key]['data'][1];
		      }
		      this.upload_data[key]['栏目']=lanmu;

	    	  if(this.upload_data[key]['刊数']!=undefined){
	    			this.setState({visible:true,});
	    			this.key=key;
	    			this.label=this.upload_data[key]['刊数'];
	    	  }
		      console.log(this.upload_data);
		}
	    onChange2(value,e){
	    	for(let l in this.props.has_dated){
	    		//alert('9829u28uchewouhew')
	    		this.has_dated[l]={}
	    		this.has_dated[l]['state']=this.props.has_dated[l]['state'];
	    	}
	    	//console.log(value);
	    	//console.log('pre:  '+e.target);
	    	let key=value['key'];
	    	key=(key-key%1000)/1000;
	    	key+=1;
	    	let label=value['label']; 
	    	// label.replace(/[&nbsp;]*/g,'');
	    	//alert(key);
	    	let pat=/\d+/i;
	    	let pre=0;
	    	label=pat.exec(label)[0];
	    	// console.log(label);

	    	if(this.upload_data[key]==undefined){
	    		this.upload_data[key]={};
	    	}
	    	alert(key)
	    	//console.log(this.has_dated);
	    	console.log(this.props.has_dated)
	    	this.upload_data[key]['刊数']=label;
	    	this.upload_data[key]['姓名']=this.props.has_dated[key]['data'][0];
	    	this.upload_data[key]['稿件名']=this.props.has_dated[key]['data'][1];
	    	if(this.props.has_dated[key]['state']==false){
	    		this.props.has_dated[key]['state']==1;
	    		
	    		//alert(this.has_dated[key+1]['state']);
	    		this.has_dated[key]['state']==label;
	    		//this.setState({'has_dated':this.state.has_dated})
	    		//alert('ckjdsnclkds');
	    		//alert(this.has_dated[key+1]['state']);
	    		
	    		//console.log(this.has_dated);
	    		if(this.upload_data[key]['栏目']!=undefined){
	    			this.setState({visible:true,});
	    			this.key=key;
	    			this.label=this.upload_data[key]['刊数'];
	    		}
	    	}
	    	//this.setState({'has_dated':this.state.has_dated});
	    	//this.setState({'has_dated':this.props.has_dated});
    		console.log(this.upload_data); // 稿件排期上传点
	    }
 		render(){
			let that=this;
			//alert('changed');
			//console.log(this.state.has_distributed);
			//alert(this.props.content);
			if(this.props.content!=undefined){
				this.state.contents=this.props.content;
				//this.state.has_dated=this.props.has_dated;
				//for(let i in this.state.has_dated){this.has_distributed_length=i;}
				console.log(this.props.has_dated);
				console.log(this.state.has_dated);
				// 统计各刊已选稿件数，
				for(let l=1;l<this.get_data+1;l++){
	   	    		this.state.has_distributed[l]=0;
	   	    	}
				for(let l in this.props.has_dated){
					//console.log(this.state.has_dated[l]);  
					//this.download_data[l]={};
					console.log(this.props.has_dated)
					if(this.props.has_dated[l]['state']!=false){
						this.state.download_data[l]=this.props.has_dated[l]['state'];
						this.state.has_distributed[this.props.has_dated[l]['state']]+=1;
					}
					//this.state.upload_data;
					/*
					{
						data:["Alex", "PSIDPSIDPSIDSIDSODIS", "Alex`s editor"]
						state:2
					}
					*/
				}
				// console.log('out!!!!!!!');
				// console.log(this.state.has_distributed);
				//alert(this.state.contents);
		        //console.log(this.props.has_dated);
			let columns = [{
			  title: '作者名',
			  dataIndex: 'name',
			  key: 'name',
			  render: (text,record) => <a href="#">{record.name}</a>,
			}, {
			  title: '稿件名',
			  dataIndex: 'paperName',
			  key: 'paperName',
			}, {
			  title: '责任编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			},{
			  title: '排期',
			  dataIndex: 'timetable',
			  key: 'timetable',
			},{
			  title: '栏目',
			  dataIndex: 'lanmu',
			  key: 'lanmu',
			},];
			let data=[];
			console.log(this.props.has_dated);
		    for(let i in this.props.has_dated){
			        let items=this.props.has_dated[i]; 
	        		if(items['state']==false){
	        			//console.log(items);
	        			this.state.upload_data.push(items);
	        			//console.log(this.state.upload_data);
					        	let Temp={};
						        let items=this.props.has_dated[i]; 
				        		if(items['state']==false){
				        			this.state.upload_data.push(items);
				        			//console.log(this.state.upload_data);
				        			Temp['name']=items['data'][0];
				        			Temp['paperName']=items['data'][1];
				        			Temp['editor']=items['data'][2];
				        			Temp['timetable']=<Select labelInValue defaultValue={{key:""}} style={{width:'100%'}} onChange={this.onChange2.bind(this)}>		
													{
														(function (that,i) {
															let k=-1;
															let myOption=[];
															while(k++<that.get_data-1) {
																myOption.push(<Option value={(i-1)*1000+k} key={k+100}>{k+1}&nbsp;<Badge style={{marginBottom:'4px'}}count={that.state.has_distributed[k+1]}/></Option>)
															//console.log(myOption);
															}
															return myOption;
													    })(that,i)
												    }
											    </Select>;
									Temp['lanmu']=<Select onChange={this.handleChange.bind(this)} style={{width:'100%'}} labelInValue defaultValue={{key:this.state.none}}>
									 	      			{this.props.lanmu.map((item,int)=>{ return (<Option value={i*10000+int} style={{width:'100%'}}>{item}</Option>)})}
									  			  </Select>;
									data.push(Temp);
				                          }
				                    }			        	                                                
	                    }
	                        //console.log(this.data);
        	             	this.data=data;
        					this.columns=columns;                                           
        	    }

			return(
				    <div class='white-back'>
				          <Table columns={this.columns} dataSource={this.data} />	
				          <Modal title='Warning' visible={this.state.visible} onOk={this.Pass.bind(this)} onCancel={this.Cancel.bind(this)}>
				          <p>提交之后就不能更改了哦。</p>
				          </Modal>
				          <p style={{fontSize:'20px',marginTop:'20px',marginLeft:'10px'}}>注: <span style={{'color':'red'}}>标红</span>数字为已分配稿件数量</p>
				    </div>
				)
	         }
}
class HasDate extends Component{
		constructor(props){
	   	    super(props);
	   	    // 编号从1--n
	   	    // download_data 已安排稿件对应刊数，has_distributed 各刊数对应已分配稿件数量
	   	    // 表格从1开始,下拉菜单从0开始
	   	    /*
	   	    download_data
				1: {data: Array(3), state: 4}
				2: {data: Array(3), state: 2}

			has_distributed是老的一套渲染体系,将download_data复制进去就好
	   	    
	   	    */
	   	    this.state={'contents':[],'container':[],'upload_data':[],has_dated:{},has_distributed:{},changed:false,'download_data':{}};
	   	    this.upload_data={};
	   	    //this.state.has_dated={};
	   	    this.get_data=4;  // 刊数  需要请求后端
	   	    for(let l=1;l<this.get_data+1;l++){
	   	    	this.state.has_distributed[l]=0;
	   	    }
//	   	    this.has_distributed={1:3,2:5,3:7,4:9};
//			this.has_distributed={};
	   	    this.has_distributed_length=0;
	   	    
	   	    this.columns;
	   	    this.data;

	   	    this.changed=false;
	   	    //this.state.has_distributed=this.has_distributed;
	   	    // this.state.has_distributed={1:3,2:8,3:19,4:9};
	    }

	    onChange2(value,e){
	    	this.state.has_dated = JSON.parse(JSON.stringify(this.props.has_dated))
	    	// this.state.has_dated=this.props.has_dated;
	    	// console.log(value);
	    	//console.log('pre:  '+e.target);
	    	let key=value['key'];
	    	key=(key-key%1000)/1000;
	    	let label=value['label'];
	    	// label.replace(/[&nbsp;]*/g,'');
	    	//alert(key);
	    	let pat=/\d+/i;
	    	let pre=0;
	    	label=pat.exec(label)[0];
	    	// console.log(label);

	    	if(this.upload_data[key]==undefined){
	    		this.upload_data[key]={};
	    	}
	    	console.log(this.props.has_dated);
	    	this.upload_data[key]['刊数']=label;
	    	this.upload_data[key]['姓名']=this.props.has_dated[key+1]['data'][0];
	    	this.upload_data[key]['稿件名']=this.props.has_dated[key+1]['data'][1];
	    	if(this.props.has_dated[key+1]['state']==false){
	    		this.props.has_dated[key+1]['state']==label;
	    		this.state.has_dated[key+1]['state']==label;
	    		this.props.change_the_other_date_component(key+1,label);
	    		//alert('ckjdsnclkds');
	    		console.log(this.state.has_dated);
	    	}
	    	//this.setState({'has_dated':this.state.has_dated});
	    	console.log(this.upload_data);
	    	//this.props.change_the_other_component(this.state.has_dated);
	    }
		render(){
			let that=this;
			let columns = [{
			  title: '作者名',
			  dataIndex: 'name',
			  key: 'name',
			  render: (text,record) => <a href="#">{record.name}</a>,
			}, {
			  title: '稿件名',
			  dataIndex: 'paperName',
			  key: 'paperName',
			}, {
			  title: '责任编辑',
			  dataIndex: 'editor',
			  key: 'editor',
			},{
			  title: '排期',
			  dataIndex: 'timetable',
			  key: 'timetable',
			  sorter: (a, b) => a.timetable-b.timetable,
			}];
			let data=[];
			console.log(this.props.has_dated);
		    for(let i in this.props.has_dated){
			        let items=this.props.has_dated[i]; 
	        		if(items['state']!=false){
	        			//console.log(items);
	        			this.state.upload_data.push(items);
	        			//console.log(this.state.upload_data);
			        	let Temp={};
				        let items=this.props.has_dated[i]; 
				        //alert('action');
				        //console.log(items);
		        		// if(items['state']!=false){
		        		// 	alert('pppp');
		        		//console.log(items);
	        			this.state.upload_data.push(items);
	        			//console.log(this.state.upload_data);
	        			Temp['name']=items['data'][0];
	        			Temp['paperName']=items['data'][1];
	        			Temp['editor']=items['data'][2];
	        			Temp['timetable']=items['state'];
						data.push(Temp);
			                                 }
				                    //}
			        	                                                
			        	    
	                        //console.log(this.data);
        	             	this.data=data;
        					this.columns=columns; 
	                                                              
        	    }

			return(
				    <div class='white-back'>
				          <Table columns={this.columns} dataSource={this.data} />	
				          <p style={{fontSize:'20px',marginTop:'20px',marginLeft:'10px'}}>注: <span style={{'color':'red'}}>标红</span>数字为已分配稿件数量</p>
				    </div>
				)
	        }
}
// 年度1、季度4、月度12
class EditorWorkLoad extends Component{
	constructor(props){
		super(props);
		this.Option=[];
		this.state={'年度':1,'季度':4,'月度':12,'value':1,'time':1,'contents':{'Editor1':12,'Editor2':43,'Editor3':19}}
    }
    handleChange(value){
    	console.log(value); //月度
    	this.setState({'value':value});
    }
    handleChange1(value){
    	console.log(value); //123456
    	this.setState({'time':value})
    }
    render(){
		let columns = [{
		  title: '姓名',
		  dataIndex: 'name',
		  key: 'name',
		}, {
		  title: '工作量',
		  dataIndex: 'load',
		  key: 'load',
		}];

		let dataSource = [{
		  key: '1',
		  name: '胡彦斌',
		}, {
		  key: '2',
		  name: '胡彦祖',
		},];
		dataSource=[];

    	return(
			<div class='white-back' style={{fontSize:'20px'}}>
				统计方法:&nbsp;&nbsp;
			    <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
			      <Option value="年度">年度</Option>
			      <Option value="季度">季度</Option>
			      <Option value="月度">月度</Option>
			    </Select>
			    &nbsp;时间段:&nbsp;&nbsp;
			    <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange1.bind(this)}>
			    	{
			    		(function (rows, i, len) {
						        while (++i<len) {
						         rows.push(<Option value={i}>{i}</Option>);
						        }
						        return rows;
						})([],0,this.state[this.state.value]+1)
						
			    	}
			    </Select>			
			    {
		    		(function (dataSource,that){
		    			for(let l in that.state.contents){
		    				//alert(l)
		 			        //return rows;
		    			   		}
						}
					)(dataSource,this)		    
			    } 
			    <Table style={{marginTop:'10px'}}  dataSource={dataSource} columns={columns} />	
		    </div>
    		);
    }
}
class PreviewerWorkLoad extends Component{
	constructor(props){
		super(props);
		this.Option=[];
		this.state={'年度':1,'季度':4,'月度':12,'value':1,'time':1,'contents':{'Editor1':12,'Editor2':43,'Editor3':19}}
    }
    handleChange(value){
    	console.log(value); //月度
    	this.setState({'value':value});
    }
    handleChange1(value){
    	console.log(value); //123456
    	this.setState({'time':value})
    }
    render(){
		let columns = [{
		  title: '姓名',
		  dataIndex: 'name',
		  key: 'name',
		}, {
		  title: '工作量',
		  dataIndex: 'load',
		  key: 'load',
		}];

		let dataSource = [{
		  key: '1',
		  name: '胡彦斌',
		}, {
		  key: '2',
		  name: '胡彦祖',
		},];
		dataSource=[];

    	return(
			<div class='white-back' style={{fontSize:'20px'}}>
				统计方法:&nbsp;&nbsp;
			    <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
			      <Option value="年度">年度</Option>
			      <Option value="季度">季度</Option>
			      <Option value="月度">月度</Option>
			    </Select>
			    &nbsp;时间段:&nbsp;&nbsp;
			    <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange1.bind(this)}>
			    	{
			    		(function (rows, i, len) {
						        while (++i<len) {
						         rows.push(<Option value={i}>{i}</Option>);
						        }
						        return rows;
						})([],0,this.state[this.state.value]+1)
						
			    	}
			    </Select>			
			    {
		    		(function (dataSource,that){
		    			for(let l in that.state.contents){
		    				//alert(l)
		 			        //return rows;
		    			   		}
						}
					)(dataSource,this)		    
			    } 
			    <Table style={{marginTop:'10px'}}  dataSource={dataSource} columns={columns} />	
		    </div>
    		);
    }
}
class Main extends Component{
   static defaultProps = {
      content:["":[['','','','']]],
      data:{}
    }
   constructor(props){
   	 super(props);

   	 this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认' ,7:'已缴费'};
   	 this.td_width=['3rem','3rem','9rem','3rem'];
   	 this.title=['状态','作者名','稿件名','负责编辑'];
   	 this.state={'contents':[],'changed':true,'has_dated':{},'lanmu':[]};
   	 this.test=1;
   	 // has_dated 记录所有数据及状态
   	 this.state.lanmu=['妇科','烧伤科','儿科'];
   }
   get_dated(){
   		if(this.test!=1){
   			return;
   		}
   		this.test+=1;
   	    // 获取时间和分配状态
   	    let k=1;
	    this.state.contents[1].map((items,i)=>{ 
    	if(items[0]==7){
    		this.state.has_dated[k]={}
    		this.state.has_dated[k]['data']=items.slice(1);
    		this.state.has_dated[k]['state']=parseInt(4*Math.random()+1)>2?false:2;   // 如果未分配则为false
    		//this.state.has_dated[k]['state']=false;   // 如果未分配则为false
    		k+=1;
    		console.log(this.state.has_dated)
    		//this.state.has_dated[i+1].unshift(i);
    		    	}
    		             
    		    							})
//	    this.state.has_dated[k-1]['state']=4;

	    //在此处获取相应的已分配数量
	    //this.
    	console.log(this.state.has_dated);  
    	/*
    	{
    	  1:["Jack", "PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP", "Jack`s editor"]
		  2:["Alex", "PSIDPSIDPSIDSIDSODIS", "Alex`s editor"]  
		}
        */
    }
   change_the_other_component(){
   		this.setState({'changed':!this.state.changed});
   }
   // 将修改的位置还有对应的值传到父类函数中执行，因为在
   change_the_other_date_component(key,data){
      // this.state.change=!this.state.changed;
      //alert(this.state.contents);
      //let i=this.props.content;
      //alert(data);
      console.log(data);
      //data[1]['state']=1;
      // for(let l in this.state.has_dated){
      // 	this.state.has_dated[l]['state']=data[l]['state'];
      // }
      this.state.has_dated[key]['state']=data;
      this.setState({'changed':!this.state.changed});
      this.setState({'has_dated':this.state.has_dated});
   }
   render(){
   	    this.state.contents=this.props.content;

   	    if(this.state.contents[0]!=undefined){

	   	    this.state.data=this.props.data;
	   	    //this.setState({'data':this.props.data});
	   	    console.log('!!!!!!!!!!');
	   	    console.log(this.props.data); 

   	    	//alert(this.props.content)
   	    	this.get_dated();
		   	switch(this.props.content[0]){
			        case "distributePaper":return (
							  <main>
							        <div class="white-back">
									  <Tabs defaultActiveKey="1">
									      <TabPane tab="未分配" key="1"><HasNotDistributed data={this.props.data} content={this.state.contents} change_the_other_component={this.change_the_other_component.bind(this)}/></TabPane>
									      <TabPane tab="已分配" key="2"><HasDistributed content={this.state.contents} key={Math.random()}/></TabPane>
									  </Tabs>									  
								    </div>
							  </main>
			            );
			        case "timetable":return(
			        						<main>
			        							<div class='white-back'>
			        								<Tabs defaultActiveKey="1">
												      <TabPane tab="未排期" key="1"><HasNotDate content={this.state.contents} lanmu={this.state.lanmu} has_dated={this.state.has_dated} change_the_other_date_component={this.change_the_other_date_component.bind(this)}/></TabPane>
												      <TabPane tab="已排期" key="2"><HasDate content={this.state.contents} has_dated={this.state.has_dated} key={Math.random()}/></TabPane>
												    </Tabs>
			        							</div>
			        						</main>
			        						);
			        case "paper-status":return(
			        							<main>
			        								<div class='white-back'>
			        									<Paper_status content={this.props.content}/>
			        								</div>
			        							</main>
			        							);
			        case "Personal_info_change":return(
			        						<div class='iframe' style={{width:'80%'}}>
			        							<iframe src='/#/Personal_info_change' style={{width:'100%',height:'100%'}}>
			        							</iframe>
			        						</div>
			        	);
			        case "EditorWorkLoad":return(
			        							<main>
			        								<div class='white-back'>
			        									<EditorWorkLoad content={this.props.content}/>
			        								</div>
			        							</main>
			        							);
			        case "PreviewerWorkLoad":return(
			        							<main>
			        								<div class='white-back'>
			        									<PreviewerWorkLoad content={this.props.content}/>
			        								</div>
			        							</main>
			        							);
			        default:return null;
			    }
		}
		else{
			return(null);
		}
	}
}

class Editor extends Component {
   constructor(props){
   	 super(props);
	}

	render() {
	  	//alert('alert:\n'+this.state.data);
	    return (
	        <html className='html'>
		      <Header/>
		      <Container/>
		    </html>
	    );
	}
}

export default Editor;