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
			       	  		<name><p style={{fontSize:'0.6rem',marginTop:'0.5rem'}} onClick={this.logout}><a href={this.state.Personal_info_change}>{this.state.name}</a></p></name>
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
			// [Module_name,[author_name,paper-name,links]]
			//
			content:["Check_paper",[['Tom','java','http://www.baidu.com'],['Jack','PHPPHPPHPPHPPHPPHPPHPPHPPHPPHP','http://www.baidu.com'],['Alex','PSIDPSIDPSIDSIDSODIS','http://www.126.com'],['Jason','PythonPythonPythonPythonPython','http://www.163.com']],['none','Tom111111','Tom2','Tom3']]
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
		           <div class="catalog" id="check_paper" onClick={this.action.bind(this,'Check_paper')} ref='Check_paper'>
		                <Icon type="clock-circle-o" />&nbsp;
		                稿件审理
		           </div>
		           <div class="catalog" id="re_check_paper" onClick={this.action.bind(this,'Re_check_paper')} ref='Re_check_paper'>
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
           if(label=='不通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==2){
           	    	//alert('.,.,..,.,.')
           	    	this.container[num-1].push('不通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('?????');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('不通过');
           	    }
           }
           if(label=='通过'){
           	    document.getElementById('TextArea-'+num).style.display='none';
           	    if(signal==2){
           	    	//alert('<<<<>>>>>>')
           	    	this.container[num-1].push('通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('??/////');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('通过');
           	    }
           }
	    }
	    handleClick(num,e){
	    	let number=num['temp'];
	    	// console.log(num['temp']);
	    	//alert('提交成功');
	    	let upload_data=[]
			for(let l=0;l<this.container.length;l++){
				if(this.container[l].length>2){
					console.log(this.container[l])
					upload_data.push(this.container[l]);
				}
			}
            // this.upload_data.push();
	    }
	    handleShrink(value,e){
	    	console.log(value);  // 123
	    	document.getElementsByClassName('ant-collapse-header')[value].click();
	    	// document.getElementById('TextArea-'+value).style.display='none';
	    	var text= document.getElementById('text-area'+value).value;
	    	//alert(text);
            this.container[value-1].push(text);
	    }
		render(){
			//alert(this.props.content);
			if(this.props.content!=undefined){
				this.state.contents=this.props.content;
				//alert(this.state.contents);
		        {
		        this.state.contents[1].map((items,i)=>{ 
        			//alert(items);
        			this.container.push(items);
        			this.state.upload_data.push(items);
        			//alert(this.state.upload_data);
	        		this.state.container.push(
	        			<tr key={i}>
	            			{

	            				items.map((item,j)=>{
		            				if(j<1){return(<td key={j}>{item}</td>)}
		            				if(j==1){return(<td key={j}><a href={this.container[i][2]} target="_blank">{item}</a></td>)}
		            		                        }
		            		              
	            		                )
	            		    }

								<td class='td-select'>
				                    <Select onChange={this.handleChange.bind(this)} labelInValue defaultValue={{key:this.state.none}}>
								 	      <Option value={(i+1)*10000+1} style={{width:'100%'}}>通过</Option>
								 	      <Option value={(i+1)*10000+2} style={{width:'100%'}}>不通过</Option>
								    </Select>
								</td>
	                	</tr>
	                	)
		            let temp=i+1
	                this.state.container.push(
	                	<tr id={'TextArea-'+(i+1)} style={{display:'none'}}>
	                	  <td colspan="3" width={{height:'0.1rem'}}>
	                	  <Collapse bordered={false}>
							    <Panel header="点击输入评论" key="3">
							      	    <TextArea id={'text-area'+(i+1)} rows={4} placeholder="请输入本稿件不通过的理由"/>
	                					<Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleShrink.bind(this,temp)}>确定</Button>
							    </Panel>
							</Collapse>
	                	  </td>
	                	</tr>
	                	                      )
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
				                <th>审核结果</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
				              <Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
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
           if(label=='不通过'){
           	    document.getElementById('TextArea-'+num).style.display='table-row';
           	    if(signal==3){
           	    	//alert('.,.,..,.,.')
           	    	this.container[num-1].push('不通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('?????');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('不通过');
           	    }
           }
           if(label=='通过'){
           	    document.getElementById('TextArea-'+num).style.display='none';
           	    if(signal==3){
           	    	//alert('<<<<>>>>>>')
           	    	this.container[num-1].push('通过');
           	    }
           	    // alert(this.container[num]);
           	    else{
           	    	//alert('??/////');
           	    	this.container[num-1].pop();
           	    	this.container[num-1].push('通过');
           	    }
           }
	    }
	    handleClick(num,e){
	    	let number=num['temp'];
	    	// console.log(num['temp']);
	    	//alert('提交成功');
	    	let upload_data=[]
			for(let l=0;l<this.container.length;l++){
				if(this.container[l].length>3){
					console.log(this.container[l])
					upload_data.push(this.container[l]);
				}
			}
            // this.upload_data.push();
	    }
	    handleShrink(value,e){
	    	//console.log(value);  // 123
	    	document.getElementsByClassName('ant-collapse-header')[value].click();
	    	// document.getElementById('TextArea-'+value).style.display='none';
	    	var text= document.getElementById('text-area'+value).value;
	    	//alert(text);
            this.container[value-1].push(text);
	    }
		render(){
			//alert(this.props.content);
			if(this.props.content!=undefined){
				this.state.contents=this.props.content;
				//alert(this.state.contents);
		        {
		        this.state.contents[1].map((items,i)=>{ 
        			//alert(items);
        			this.container.push(items);
        			this.state.upload_data.push(items);
        			//alert(this.state.upload_data);
	        		this.state.container.push(
	        			<tr key={i}>
	            			{
	            				items.map((item,j)=>{
		            				if(j<1){return(<td key={j}>{item}</td>)}	
		            				if(j==1){return(<td key={j}><a href={this.container[i][2]} target="_blank">{item}</a></td>)}		    
		            		                        }
		            		              
	            		                )
	            		    }

								<td class='td-select'>
				                    <Select onChange={this.handleChange.bind(this)} labelInValue defaultValue={{key:this.state.none}}>
								 	      <Option value={(i+1)*10000+1} style={{width:'100%'}}>通过</Option>
								 	      <Option value={(i+1)*10000+2} style={{width:'100%'}}>不通过</Option>
								    </Select>
								</td>
	                	</tr>
	                	)
		            let temp=i+1
	                this.state.container.push(
	                	<tr id={'TextArea-'+(i+1)} style={{display:'none'}}>
	                	  <td colspan="3" width={{height:'0.1rem'}}>
	                	  <Collapse bordered={false}>
							    <Panel header="点击输入评论" key="3">
							      	    <TextArea id={'text-area'+(i+1)} rows={4} placeholder="请输入本稿件不通过的理由"/>
	                					<Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleShrink.bind(this,temp)}>确定</Button>
							    </Panel>
							</Collapse>
	                	  </td>
	                	</tr>
	                	                      )
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
				                <th>审核结果</th>
				                </tr>
				                {
				                	this.state.container
				                }
				              </table>
				              <Button type="primary" style={{float:'right',marginTop:'10px',marginRight:'10px'}} onClick={this.handleClick.bind(this)}>提交</Button>
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
			        								<Check_paper content={this.props.content}/>
			        							</div>
			        						</main>
			        						);
			        case "Re_check_paper":return(
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