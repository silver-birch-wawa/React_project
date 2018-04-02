import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Button, Radio, Icon ,Modal} from 'antd';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Tabs } from 'antd';
import ReactDOM from 'react-dom'
import { DatePicker } from 'antd';
import axios from 'axios';
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
	});
}

function ajax_post(url,data,that){
	axios.post(url,data)
	  .then(function (response) {
	    console.log(response);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
}

class Header extends Component{
    constructor(props){
    	super(props);
        this.state={
        	'name':'xss',
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
			       	  		<name><p style={{fontSize:'0.6rem',marginTop:'0.5rem'}} onClick={this.logout}>{this.state.name}</p></name>
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
			// isdistributed(1/0),author_name,paper-name,paper-status,editor
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
		           <div class="catalog" id="check_paper" onClick={this.action.bind(this,'check_paper')} ref='check_paper'>
		                <Icon type="clock-circle-o" />&nbsp;
		                稿件审理
		           </div>
		           <div class="catalog" id="re_check_paper" onClick={this.action.bind(this,'re_check_paper')} ref='re_check_paper'>
		                <Icon type="clock-circle" />&nbsp;
		                稿件重审
		           </div>
			    </Panel>			    
			</Collapse>

        </aside>
   	    )
   }
}

class Re_check_paper extends Component{
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
class Check_paper extends Component{
		constructor(props){
	   	    super(props);
	   	    this.state={'contents':[],'container':[],'upload_data':[]};
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
	            		    
			                <td class="timetable-calendar">  
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
				                <th>时间</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
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
			        case "check_paper":return(
			        						<main>
			        							<div class='white-back'>
			        								<Check_paper content={this.props.content}/>
			        							</div>
			        						</main>
			        						);
			        case "re_check_paper":return(
			        							<main>
			        								<div class='white-back'>
			        									<Re_check_paper content={this.props.content}/>
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