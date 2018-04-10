import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Button, Radio, Icon ,Modal} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import { Input} from 'antd';
import axios from 'axios';
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Panel = Collapse.Panel;

// 利用sessionstorage共享全局变量
function obj_store(obj){
	sessionStorage.setItem('obj', JSON.stringify(obj)); 
}
function obj_get(){
	var obj = JSON.parse(sessionStorage.getItem('obj'));
	return obj 
}

function ajax_get(url,that){
	axios.get(url)
		  .then(function (response) {
		  	let data=response.data;
		  	console.log(data);
		  	that.state.data=data;
		    that.setState({'data':data});
	}.bind(that))
		.catch(function (error) {
		    console.log(error);
		  	alert('下载失败');
	});
}

function ajax_post(url,data){
	axios.post(url,data)
	  .then(function (response) {
	    console.log(response);
	  })
	  .catch(function (error) {
	    console.log(error);
	    alert('上传失败');
	  });
}

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
			       	  		<name><p style={{fontSize:'0.6rem',marginTop:'0.5rem'}} onClick={this.logout}><a href={this.state.Personal_info_change} target="_blank">{this.state.name}</a></p></name>
			       	  	</li>
		       	  	</a>
		       	  </ul>
		        </nav>
		      </header>
		)
    }
}


class Person extends Component{

}

class Container extends Component{
   constructor(props){
   	    super(props);
   	    this.state={
   	        'content':[]
        }
   }

   change_content(content){
   	  this.state.content=content;
      // alert('content'+content);
      this.setState({'content':content});
   }

   render(){
   	return(
   	     <container>
   	         <Aside change_content={this.change_content.bind(this)}/>
   	         <Main content={this.state.content}/>
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

			content:["distributePaper",[[1,'Tom','java'],[7,'Jack','PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP','Jack`s editor'],[7,'Alex','PSIDPSIDPSIDSIDSODIS','Alex`s editor'],[4,'Jason','PythonPythonPythonPythonPythonPythonPython','Jason`s editor']],['none','Tom111111','Tom2','Tom3']]
			,data:[]
		}
		//sessionStorage.clear();
		//obj_store(this.state);
		// var t=obj_get();
		// this.state.content=t;
		// alert(t);
	}
	componentDidMount() {
        ajax_get('http://localhost:3000',this);
        //alert('xxxxx');
    }
	action(word,e){
        // 动画操作:
		   if(document.querySelector('body').offsetWidth>560)
		   {
	           for(var i in this.refs)
	           {
	              if(i!=word){
	              	   let rstyle=this.refs[i].style;
			           rstyle.color='grey';
			           rstyle.height='1.2rem';
			           rstyle.fontSize='0.7rem';
			           rstyle.paddingLeft='2.2rem';
			           //rstyle.paddingBottom='0.2rem';
	              }
	                   let rstyle=this.refs[word].style;
			           rstyle.color='#337ab7';
			           rstyle.paddingLeft='2.2rem';
			           if(word=='check'){
			           	  rstyle.paddingLeft='2.2rem';
			           }
			           rstyle.height='1.6rem';
			           rstyle.fontSize='0.8rem';
	                   //rstyle.paddingBottom='0.3rem';
	           }
		   }
		   else{
	           for(var i in this.refs)
	           {
	              if(i!=word){
	              	   let rstyle=this.refs[i].style;
			           rstyle.color='grey';
	              }
	                   let rstyle=this.refs[word].style;
			           rstyle.color='#337ab7';
	           }		   	
		   };
		      // alert(word)
		      this.state.content[0]=word;
		      // alert('state'+this.state.content['distributePaper']);
           	  this.props.change_content(this.state.content);
   	    }

   render(){
   	    // if(this.state.data!=[]){
   	    

   	    //this.state.content=this.state.data;
   	    //alert(this.state.content);


        //     alert(this.state.content);
   	    // }
   	    return(
   	    <aside>
	        <Collapse accordion defaultActiveKey={['1']}>
			    <Panel header={<p style={{marginBottom:'0em',marginRight:'1rem'}}>目录</p>} id="menu" key="1">		           
		           <div class="catalog" id="distributePaper" onClick={this.action.bind(this,'distributePaper')} ref='distributePaper'>
		                <Icon type="pie-chart" />&nbsp;
		                稿件分配
		           </div>
		           
		           <div class="catalog" id="timetable" onClick={this.action.bind(this,'timetable')} ref='timetable'>
		                <Icon type="calendar" />&nbsp;
		                稿件排期
		           </div>
		           <div class="catalog" id="paper-status" onClick={this.action.bind(this,'paper-status')} ref='paper-status'>
		                <Icon type="clock-circle-o" />&nbsp;
		                稿件状态
		           </div>
		           <div class="catalog" id="Personal_info_change" onClick={this.action.bind(this,'Personal_info_change')} ref='Personal_info_change'>
		                <Icon type="user-add" />&nbsp;
		                个人信息
		           </div>
			    </Panel>			    
			</Collapse>

        </aside>
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
	distributePaper(contents){
		    contents.map((item,index) => { 
		        // alert(contents);
		        //alert('调用更新');
		        /* table的行 */
		        var temp=item[0];
			    if(item[0]=='已分配'||item[0]!=1){
			    	item[0]='已分配';
			    	this.container_finished.push(
		            <tr>
             		   { 
             		   	 contents[index].map((item,i)=>{if(0<i){return (<td key={i} style={{'width':this.td_width[i]}}>{contents[index][i]}</td>)}})
             		   }
		            </tr>
		            )
             		item[0]=temp;
		            
		        }   
		})
             		   	//console.log(this.container_finished); 
   }

	render(){
	   		this.state.contents=this.props.content[1].slice(0);
	   		this.editors=this.props.content[2];
	   		//alert(this.state.contents);    
	        if(this.state.contents!=undefined){
		   			this.distributePaper(this.state.contents); 
		   	}
		   	// console.log('papapapa:'+this.props.content[1]);
		   	return (
		    	    	<div id='display-box'>
						    	<table id="customers">
					            <tr>
					    
		             	{
		             		/* table的标题 */
		             		this.title.map((item,i)=>{return (<th key={i} style={{'width':this.td_width[i]}}>{item}</th>)}
		             			)
		             	}
					            </tr>
					            {this.container_finished}
							    </table>
						</div>
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

	distributePaper(contents){
		    this.state.container_unfinished=[];
		    contents.map((item,index) => { 
		        // alert(contents);
		        /* table的行 */
		        //alert(item[0])
			    if(item[0]==1){
			    	item[0]='未分配';
			    	this.state.container_unfinished.push(
		            <tr>
             		   { 
             		   	contents[index].map((item,i)=>{if(i==0){return(<td key={i} style={{width:'2rem'}}>{contents[index][i]}</td>)}if(1<i){return(<td key={i}>{contents[index][i]}</td>)}})
             		   }
		                <td class='td-select'>
		                  <Select id={{index}} onChange={this.handleChange.bind(this)} labelInValue defaultValue={{key:this.state.none}}>
						 	      {this.editors.map((item,i)=>{ return (<Option value={index*10000+i} style={{width:'100%'}}  id={index}>{item}</Option>)})}
						  </Select>
						</td>
		            </tr>
		            )
             		item[0]=1;
		            //alert('container_unfinished'+this.container_unfinished.length)
		        }    
		})
   }
   // 调用该函数使两个相邻组件更新一致
   change_the_other_component(){
   	  this.props.change_the_other_component();
   }
   handleClick(e){
       this.contents=this.props.content[1].slice(0);
       // console.log(contents);
       // console.log(this.choosed_editors)
       for(let i in this.choosed_editors){
       	  this.upload_data[i]=this.contents[i].slice(1,);
       	  this.upload_data[i].push(this.choosed_editors[i]);
       	  this.props.content[1][i].push(this.choosed_editors[i]);
       	  //let senderName = ReactDOM.findDOMNode(this.refs['mytable'+i]);
       	  //alert(senderName.style)
       	  this.setState({'container_unfinished':this.state.container_unfinished,'none':'none'})
       }
       //console.log(this.props.contents)
       console.log(this.upload_data);
      // window.location.reload();
      //alert('已提交');
      this.change_the_other_component();
   }
	render(){
		    // let Type=this.props.content[0];
		    // let backup=this.props.content[1].slice(0);
		    //this.contents=Object.assign([],this.props.content[1]);
	   		this.state.contents=this.props.content[1].slice(0);
	   		this.editors=this.props.content[2];
	   		console.log(this.state.contents);    
	        if(this.state.contents!=undefined){
	        	    //console.log('AAAAA: '+this.contents)
		   			this.distributePaper(this.state.contents);
		   			// contents=backup;
		   			//console.log('BBBBB: '+this.props.content[1])
		   	}
		   	return (
		    	    	<div id='display-box'>
						    	<table id="customers">
					            <tr>
					    
		             	{
		             		/* table的标题 */
		             		this.title.map((item,i)=>{return (<th key={i} style={{'width':this.td_width[i]}}>{item}</th>)}
		             			)
		             	}
					            </tr>
					            {this.state.container_unfinished}
							    </table>
						    <Button type="primary" id='Tab_submit' style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
						</div>
		            );
	}
}

class Paper_status extends Component{
    constructor(props){
   	    super(props);
	   	this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认',7:'已缴费'}
	   	this.td_width=['3rem','3rem','9rem','3rem']
	   	this.title=['状态','作者名','稿件名','负责编辑']
   	    this.contents={};
   	    this.editors=[];
   	    this.container_finished=[]
    }
	show(contents){
		    //排序后输出
		    contents=contents.sort(function(a,b){return a[0]-b[0]});
		    contents.map((item,index) => { 
		        //console.log(contents);
		        //item[0]=1
		        /* table的行 */
		        //alert(item[0])
                var temp=item[0];
                item[0]=this.status_code[item[0]];
			    	this.container_finished.push(
		            <tr>
             		   { 
             		   	contents[index].map((item,i)=>{if(i<2){return (<td key={i} style={{'width':this.td_width[i]}}>{contents[index][i]}</td>)}else{return (<td key={i}>{contents[index][i]}</td>)}})
             		   }
		            </tr>
		            )
             	item[0]=temp;
		            //alert('container_unfinished'+this.container_unfinished.length)  
		})
   }
	render(){
		    //alert(this.props.content);
		    if(this.props.content!=undefined){
		    	    //console.log(this.props.content[1])
				    this.contents=this.props.content[1].slice(0);
			   		this.editors=this.props.content[2];    
			   		this.show(this.contents);
			}
			return (
				    	    	<div id='display-box'>
								    	<table id="customers">
							            <tr>
							    
				             	{
				             		/* table的标题 */
				             		this.title.map((item,i)=>{return (<th key={i} style={{'width':this.td_width[i]}}>{item}</th>)}
				             			)
				             	}
							            </tr>
							            {this.container_finished}
									    </table>
								</div>
				    );
				     // alert(this.props.content)
		    }
	
}

class Timetable extends Component{
		constructor(props){
	   	    super(props);
	   	    this.state={'contents':[],'container':[],'upload_data':[]};
	   	    this.upload_data={};
	   	    this.has_distributed={1:3,2:8}
	    }
	    onChange1(value,e){
	    	console.log(value);
	    	// console.log(e);
	    	let key=value['key'];
	    	key=(key-key%1000)/1000;
	    	let label=value['label'];

	    	//alert(label);
	    	if(this.upload_data[key]==undefined){
	    		this.upload_data[key]={};
	    	}
	    	this.upload_data[key]['期刊']=label;
	    	console.log(this.upload_data);
	    }
	    onChange2(value,e){
	    	console.log(value);
	    	// console.log(e);
	    	let key=value['key'];
	    	key=(key-key%1000)/1000;
	    	let label=value['label'];
	    	// label.replace(/[&nbsp;]*/g,'');
	    	//alert(label);
	    	let pat=/\d+/i
	    	label=pat.exec(label)[0];

	    	if(this.upload_data[key]==undefined){
	    		this.upload_data[key]={};
	    	}
	    	this.upload_data[key]['刊数']=label;
	    	console.log(this.upload_data);
	    }
		render(){
			//alert(this.props.content);
			if(this.props.content!=undefined){
				this.state.contents=this.props.content;
				//alert(this.state.contents);
		        {
		        this.state.contents[1].map((items,i)=>{ 
        		if(items[0]==7){
        			//alert(items);
        			this.state.upload_data.push(items);
        			//alert(this.state.upload_data);
	        		this.state.container.push(
	        			<tr key={i}>
	            			{
	            				items.map((item,j)=>{
	            				if(j>0){
		            				return(<td key={j}>{item}</td>)		    
		            		           }
		            		                        }
		            		              
	            		                            )
	            		    }
	            		    
			                <td class="timetable-calendar" style={{width:'7rem'}}>  
						        <InputGroup compact style={{display:'flex',flexDirection:'row'} }>
							          <Select labelInValue defaultValue={{key:""}} style={{width:'4rem'}} onChange={this.onChange1.bind(this)}>
							            <Option value={(i)*1000}>月刊</Option>
							            <Option value={(i)*1000+1}>半月刊</Option>
							          </Select>
							          <Select labelInValue defaultValue={{key:""}} style={{width:'3rem'}} onChange={this.onChange2.bind(this)}>
							            <Option value={(i)*1000}>1 &nbsp;已选{this.has_distributed[1]}</Option>
							            <Option value={(i)*1000+1}>2 &nbsp;已选{this.has_distributed[2]}</Option>
							          </Select>
						        </InputGroup>
							</td>

	                	</tr>										
	            	                          )
                            }
        	                                           })      
        	    }
			                                 }
			return(
				    <div class='white-back'>
				          <div id='display-box'>
				              <table id="customers">
				                <tr>
				                <th>作者名</th>
				                <th>稿件名</th>
				                <th>责任编辑</th>
				                <th>排期</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
				          </div>
				          <p style={{fontSize:'20px',marginTop:'20px',marginLeft:'10px'}}>注: *后为已分配数量</p>
				    </div>
				)
	        }
}
class Main extends Component{
   static defaultProps = {
      content:["":[['','','','']]]
    }
   constructor(props){
   	 super(props);

   	 this.status_code={1:'未分配',2:'审阅中',3:'未通过',4:'待修改',5:'通过',6:'格式确认',7:'已缴费'};
   	 this.td_width=['3rem','3rem','9rem','3rem'];
   	 this.title=['状态','作者名','稿件名','负责编辑'];
   	 this.state={'contents':[],'changed':true};
   }
   change_the_other_component(){
      // this.state.change=!this.state.changed;
      //alert(this.state.contents);
      //let i=this.props.content;
      this.setState({'changed':!this.state.changed});
   }
   render(){
   	    this.state.contents=this.props.content;
   	    if(this.state.contents[0]!=undefined){
   	    	//alert(this.props.content)
		   	switch(this.props.content[0]){
			        case "distributePaper":return (
							  <main>
							        <div class="white-back">
									  <Tabs defaultActiveKey="1">
									      <TabPane tab="未分配" key="1"><HasNotDistributed content={this.state.contents} change_the_other_component={this.change_the_other_component.bind(this)}/></TabPane>
									      <TabPane tab="已分配" key="2"><HasDistributed content={this.state.contents} key={Math.random()}/></TabPane>
									  </Tabs>
									  
								    </div>
							  </main>
			            );
			        case "timetable":return(
			        						<main>
			        							<div class='white-back'>
			        								<Timetable content={this.props.content}/>
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