import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Button, Radio, Icon ,Modal} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import { Input , Table} from 'antd';
import axios from 'axios';
import Header from './Header';
import {Menu} from  'antd';

const MenuItemGroup = Menu.ItemGroup;

const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Panel = Collapse.Panel;
const { TextArea } = Input;

// 利用sessionstorage共享全局变量
function obj_store(obj){
	sessionStorage.setItem('obj', JSON.stringify(obj)); 
}
function obj_get(){
	var obj = JSON.parse(sessionStorage.getItem('obj'));
	return obj 
}

const URL='http://127.0.0.1:8080';

function ajax_post(url,data,that,callback){
	axios({
        method:"POST",
		headers:{'Content-type':'application/json',},
        url:URL+url,
        data:data,
        //withCredentials:true
    }).then(function(res){
    	//alert('post:'+res)
        console.log(url+'\tPost请求到:');
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
    	console.log(url+'\tGet请求到:')
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
        console.log(url+'\tPost请求到:');
        console.log(res);
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

   change_content(content,data){
   	  this.state.content=content;
   	  this.state.data=data;
      // alert('content'+content);
      this.setState({'content':content});
      this.setState({'data':data});
   }

   render(){
   	return(
   	     <container>
   	         <Aside change_content={this.change_content.bind(this)}/>
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
			// [Module_name,[author_name,paper-name,links]]
			//
			content:["Check_paper",[['Tom','java','#'],['Jack','PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP','#'],['Alex','PSIDPSIDPSIDSIDSODIS','#'],['Jason','PythonPythonPythonPythonPython','#']],['none','Tom111111','Tom2','Tom3']]
			,data:{}
		}
		//sessionStorage.clear();
		//obj_store(this.state);
		// var t=obj_get();
		// this.state.content=t;
		// alert(t);
		this.task={}
		//this.editors={};
		this.authors={};
		this.articles={'id_to_article':{},'id_to_stat':{},'id_to_task':{}};
	}
	componentDidMount() {
				ajax_post('/contribute/task/resource',{resource:{func:"authors"}},this,(that,res)=>{
					    //this.authors=res.data.data;
						let authors=res.data.data;
						let i=1
						for(let l in authors){
							this.authors[i]=authors[l].name;
							this.authors[authors[l].name]=i;
							i+=1;
						}
				
				        ajax_post_params('/contribute/task',{id_role:1,stat:0,role:4,flag:0,page:1},this,(that,res)=>{
				        	console.log(res.data.data);
				        	this.task=res.data.data;
					    /*
							article{
									academicsec:1
									column:1
									date_pub:1522511999000
									date_sub:1520044208000
									format:".docx;.rar"
									id:1
									keyword1_cn:"测试1"
									keyword1_en:"test1"
									keyword3_en:null
									keyword4_cn:null
									keyword4_en:null
									summary_cn:"测试1"
									summary_en:"test"
									title:"测试1"
									writer_avoid:null
									writer_id:1
									writer_prefer:null
									writers_info:"test1"
							}
							task:{
									0:{id: 3, id_article: 2, id_role: 1, content: null, stat: 7, …}
									1:{id: 4, id_article: 1, id_role: 1, content: null, stat: 1, …}
								}
					    */
						    let content=[];   // 存放
						    let title;
						    let id_article;
						    let id;
						    let writer_id;
						    let writer;
					        for(let l in this.task.task){
					        	    id=this.task.task[l]['id'];
					        	    id_article=this.task.task[l]['id_article'];
					        	    this.articles['id_to_stat'][id_article]={'stat':this.task.task[l]['stat'],'role':this.task.task[l]['role'],'flag':this.task.task[l]['flag']};

					        	    this.articles['id_to_task'][id_article]=id;
					        }						    
						    for(let l in this.task.article){
									title=this.task.article[l]['title'];
									id_article=this.task.article[l]['id'];
									
									writer_id=this.task.article[l]['writer_id'];
									writer=this.authors[writer_id];

									this.articles['id_to_article'][title]=id_article;
									this.articles['id_to_article'][id_article]=title;

									let section=[]
									section.push(writer);
									section.push(title);

									
									// 根据第三位0/1判断是初审数据还是再审
									if(this.articles['id_to_stat'][id_article]['stat']==1&&this.articles['id_to_stat'][id_article]['role']==4&&this.articles['id_to_stat'][id_article]['flag']==0){
										section.push(0);
									}
									else if(this.articles['id_to_stat'][id_article]['stat']==7&&this.articles['id_to_stat'][id_article]['role']==4&&this.articles['id_to_stat'][id_article]['flag']==0)
									{
										section.push(1)
									}
									content.push(section);
							}
							console.log(content);
							this.state.content[1]=content;
							this.state.data={'articles':this.articles,'authors':this.authors,'task':this.task};
				        })
				})
    }
    handleClick(e){
   	  console.log(e)
      console.log(this.state);

      this.state.content[0]=e['key'];
      // alert('state'+this.state.content['distributePaper']);
   	  this.props.change_content(this.state.content,this.state.data);   	  
    }

    render(){
   	    // if(this.state.data!=[]){
   	    

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
					<MenuItemGroup key="i1">
						<Menu.Item key="Check_paper"><Icon type="pie-chart" />&nbsp;稿件审理</Menu.Item>
						<Menu.Item key="Re_check_paper"><Icon type="calendar" />&nbsp;稿件重审</Menu.Item>
						<Menu.Item key="Personal_info_change"> <Icon type="user-add" />&nbsp;个人信息修改</Menu.Item>
					</MenuItemGroup>
				</Menu>			   
			</div>         
   	    )
   }
}

class Re_check_paper extends Component{
		constructor(props){
	   	    super(props);
	   	    this.state={'contents':[],'container':[],'upload_data':[]};
	   	    this.container=[];
	   	    this.upload_data=[]
	    }
	    handleChange(value){
           //console.log(value['key']); //2002
           //console.log(value['label']); //通过未通过
           let num=(value['key']-(value['key']%10000))/10000;
           let label=value['label'];
           //alert(this.container[num-1].length)
           console.log(this.container);
           console.log(num);

           let signal=this.container[num-1].length;
           //alert(signal)
           if(label=='不通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==3){
           	    	//alert('.,.,..,.,.');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('不通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('?????');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].pop();          	    	
           	    	this.container[num-1].push('不通过');
           	    }
           }
           if(label=='通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==3){
           	    	//alert('<<<<>>>>>>')
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('??/////');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].pop()
           	    	this.container[num-1].push('通过');
           	    }
           }
           console.log(num);
           document.getElementsByClassName('ant-collapse-header')[num-1].click()
	    }
	    handleClick(num,e){
	    	let number=num['temp'];
	    	// console.log(num['temp']);
	    	//alert('提交成功');
	    	let upload_data=[]
			for(let l=0;l<this.container.length;l++){
				if(this.container[l].length>3){
					//console.log(this.container[l])
					upload_data.push(this.container[l]);
				}
			}
			console.log(upload_data);
			// ["测试2", "测试2", "不通过", "dslkjncldslcsdcscs"]
			for(let l in upload_data){
				upload_data[l];
				let post_data={};

				//console.log(upload_data[0][1]);
				//console.log(this.props.data);
				let id_article=this.props.data.articles['id_to_article'][upload_data[l][1]];
				if(upload_data[l][2]=='通过'){
					post_data={"task":{id:this.props.data.articles['id_to_task'][id_article],id_article:id_article,id_role:1,content:upload_data[l][3],stat:4,role:4,flag:0}}
				}
				else if(upload_data[l][2]=='不通过'){
					post_data={"task":{id:this.props.data.articles['id_to_task'][id_article],id_article:id_article,id_role:1,content:upload_data[l][3],stat:2,role:4,flag:0}}
				}
				console.log(post_data);
				ajax_post('/contribute/task/judge',post_data,this,(that,res)=>{
					console.log(res);
				});
			}
            
            // this.upload_data.push();
	    }
	    handleShrink(value,e){
	    	//value-=1;
	    	console.log(value);  // 123

	    	//document.getElementsByClassName('ant-collapse-header')[value-1].click();

	    	// document.getElementById('TextArea-'+value).style.display='none';
	    	var text= document.getElementById('text-area'+value).value;
	    	//alert(text);
	    	if(this.container[value-1].length==3){
            	this.container[value-1].push(text);	    		
	    	}
	    	else if(this.container[value-1].length==4){
	    		this.container[3]=text;	
	    	}
            document.getElementsByClassName('ant-collapse-header')[value-1].click()

            //document.getElementById('click-button').click()
	    }
	    handleDownload(word,e){
	    	//alert('click');
	    	console.log(word);
	    	console.log(this.props.data);
	    	// console.log(this.props.data['articles'])
	    	let id_article=this.props.data['articles']['id_to_article'][word];
	    	console.log(id_article);
	    	console.log(this.props.data.articles['id_to_task'][id_article]);
	    	//console.log(e);

	    	window.open(window.location.origin+'/contribute/download/id='+this.props.data.articles['id_to_task'][id_article]+'&type=0');
	    }
		render(){
			let ii=0;
			//alert(this.props.content);
			if(this.props.content!=undefined){
				//console.log(this.props);
				this.state.contents=this.props.content;
				//alert(this.state.contents);
		        {
		        this.state.contents[1].map((items,i)=>{ 
        			//alert(items);
        			// 不能用i作为计数器，因为里面有些元素在筛选后要被废弃。
        			if(items[2]==1){
	        			this.container.push(items);
	        			this.state.upload_data.push(items);
	        			//alert(this.state.upload_data);
		        		this.state.container.push(
		        			<tr key={ii}>
		            			{
		            				items.map((item,j)=>{
			            				if(j<1){return(<td key={j}>{item}</td>)}	
			            				if(j==1){return(<td key={j}><a onClick={this.handleDownload.bind(this,item)}>{item}&nbsp;<Icon type="cloud-download" /></a></td>)}		    
			            		                        }
			            		              
		            		                )
		            		    }

									<td class='td-select'>
					                    <Select onChange={this.handleChange.bind(this)} labelInValue defaultValue={{key:this.state.none}}>
									 	      <Option value={(ii+1)*10000+1} style={{width:'100%'}}>通过</Option>
									 	      <Option value={(ii+1)*10000+2} style={{width:'100%'}}>不通过</Option>
									    </Select>
									</td>
		                	</tr>
		                	)
			            let temp=ii+1
		                this.state.container.push(
		                	<tr id={'TextArea-'+(ii+1)} style={{display:'none'}}>
		                	  <td colspan="3" width={{height:'0.1rem'}}>
		                	  <Collapse bordered={false}>
								    <Panel header="点击输入修改意见(必填)" key="3">
								      	    <TextArea id={'text-area'+(ii+1)} rows={4} placeholder="请输入本稿件不通过的理由(必填)"/>
		                					<Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleShrink.bind(this,temp)}>确定</Button>
								    </Panel>
								</Collapse>
		                	  </td>
		                	</tr>
		                	                      )
		                ii+=1;
		                	        }
                                           		        })
        	    }      
	            			}
        	    

			return(
				    <div class='white-back'>
				          <div id='display-box'>
				              <table id="customers" style={{border:'0'}}>
				                <tr>
				                <th>作者名</th>
				                <th>稿件名</th>
				                <th>审核结果</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
				              <Button type="primary" id='click-button' style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
				          </div>
				    </div>
				)
	        }
}
class Check_paper extends Component{
		constructor(props){
	   	    super(props);
	   	    this.state={'contents':[],'container':[],'upload_data':[]};
	   	    this.container=[];
	   	    this.upload_data=[]
	    }
	    handleChange(value){
           //console.log(value['key']); //2002
           //console.log(value['label']); //通过未通过
           let num=(value['key']-(value['key']%10000))/10000;
           let label=value['label'];
           //alert(this.container[num-1].length)
           let signal=this.container[num-1].length;
           //alert(signal)
           if(label=='不通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==3){
           	    	//alert('.,.,..,.,.');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('不通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('?????');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].pop();          	    	
           	    	this.container[num-1].push('不通过');
           	    }
           }
           if(label=='通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==3){
           	    	//alert('<<<<>>>>>>')
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('??/////');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].pop()
           	    	this.container[num-1].push('通过');
           	    }
           }
           console.log(num);
           document.getElementsByClassName('ant-collapse-header')[num-1].click()
	    }
	    handleClick(num,e){
	    	let number=num['temp'];
	    	// console.log(num['temp']);
	    	//alert('提交成功');
	    	let upload_data=[]
			for(let l=0;l<this.container.length;l++){
				if(this.container[l].length>3){
					//console.log(this.container[l])
					upload_data.push(this.container[l]);
				}
			}
			console.log(upload_data);
			// ["测试2", "测试2", "不通过", "dslkjncldslcsdcscs"]
			for(let l in upload_data){
				let post_data={};
				//console.log(upload_data[0][1]);
				//console.log(this.props.data);
				let id_article=this.props.data.articles['id_to_article'][upload_data[l][1]];
				if(upload_data[l][2]=='通过'){
					post_data={"task":{id:this.props.data.articles['id_to_task'][id_article],id_article:id_article,id_role:1,content:upload_data[l][3],stat:4,role:4,flag:0}}
				}
				else if(upload_data[l][2]=='不通过'){
					post_data={"task":{id:this.props.data.articles['id_to_task'][id_article],id_article:id_article,id_role:1,content:upload_data[l][3],stat:2,role:4,flag:0}}
				}
				console.log(post_data);
				ajax_post('/contribute/task/judge',post_data,this,(that,res)=>{
					console.log(res);
				});            
			}
            // this.upload_data.push();
	    }
	    handleShrink(value,e){
	    	//value-=1;
	    	console.log(value);  // 123

	    	//document.getElementsByClassName('ant-collapse-header')[value-1].click();

	    	// document.getElementById('TextArea-'+value).style.display='none';
	    	var text= document.getElementById('text-area'+value).value;
	    	//alert(text);
	    	if(this.container[value-1].length==3){
            	this.container[value-1].push(text);	    		
	    	}
	    	else if(this.container[value-1].length==4){
	    		this.container[3]=text;	
	    	}
            document.getElementsByClassName('ant-collapse-header')[value-1].click()

            //document.getElementById('click-button').click()
	    }
	    handleDownload(word,e){
	    	//alert('click');
	    	console.log(word);
	    	console.log(this.props.data);
	    	// console.log(this.props.data['articles'])
	    	let id_article=this.props.data['articles']['id_to_article'][word];
	    	console.log(id_article);
	    	console.log(this.props.data.articles['id_to_task'][id_article]);
	    	//console.log(e);

	    	window.open(window.location.origin+'/contribute/download/id='+this.props.data.articles['id_to_task'][id_article]+'&type=0');
	    }
		render(){
			let ii=0;
			//alert(this.props.content);
			if(this.props.content!=undefined){
				//console.log(this.props);
				this.state.contents=this.props.content;
				//alert(this.state.contents);
		        {
		        this.state.contents[1].map((items,i)=>{ 
        			//alert(items);
        			// 不能用i作为计数器，因为里面有些元素在筛选后要被废弃。
        			if(items[2]==0){
	        			this.container.push(items);
	        			this.state.upload_data.push(items);
	        			//alert(this.state.upload_data);
		        		this.state.container.push(
		        			<tr key={ii}>
		            			{
		            				items.map((item,j)=>{
			            				if(j<1){return(<td key={j}>{item}</td>)}	
			            				if(j==1){return(<td key={j}><a onClick={this.handleDownload.bind(this,item)}>{item}&nbsp;<Icon type="cloud-download" /></a></td>)}		    
			            		                        }
			            		              
		            		                )
		            		    }

									<td class='td-select'>
					                    <Select onChange={this.handleChange.bind(this)} labelInValue defaultValue={{key:this.state.none}}>
									 	      <Option value={(ii+1)*10000+1} style={{width:'100%'}}>通过</Option>
									 	      <Option value={(ii+1)*10000+2} style={{width:'100%'}}>不通过</Option>
									    </Select>
									</td>
		                	</tr>
		                	)
			            let temp=ii+1
		                this.state.container.push(
		                	<tr id={'TextArea-'+(ii+1)} style={{display:'none'}}>
		                	  <td colspan="3" width={{height:'0.1rem'}}>
		                	  <Collapse bordered={false}>
								    <Panel header="点击输入修改意见(必填)" key="3">
								      	    <TextArea id={'text-area'+(ii+1)} rows={4} placeholder="请输入本稿件不通过的理由(必填)"/>
		                					<Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleShrink.bind(this,temp)}>确定</Button>
								    </Panel>
								</Collapse>
		                	  </td>
		                	</tr>
		                	                      )
		                ii+=1;
		                	        }
                                           		        })
        	    }      
	            			}
        	    

			return(
				    <div class='white-back'>
				          <div id='display-box'>
				              <table id="customers" style={{border:'0'}}>
				                <tr>
				                <th>作者名</th>
				                <th>稿件名</th>
				                <th>审核结果</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
				              <Button type="primary" id='click-button' style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
				          </div>
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
			        case "Check_paper":return(
			        						<main>
			        							<div class='white-back'>
			        								<Check_paper content={this.props.content} data={this.props.data}/>
			        							</div>
			        						</main>
			        						);
			        case "Re_check_paper":return(
			        							<main>
			        								<div class='white-back'>
			        									<Re_check_paper content={this.props.content} data={this.props.data}/>
			        								</div>
			        							</main>
			        							);
			        case "Personal_info_change":return(
			        						<div class='iframe' style={{width:'80%'}}>
			        							<iframe src='/#/Personal_info_change' style={{width:'100%',height:'100%'}}>
			        							</iframe>
			        						</div>
			        	)
			        default:return null;
			    }
		}
		else{
			return(null);
		}
	}
}

class Previewer extends Component {
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

export default Previewer;