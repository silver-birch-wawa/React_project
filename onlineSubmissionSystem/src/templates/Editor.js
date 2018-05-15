import React, { Component } from 'react';
import { Icon } from 'antd';

import { Collapse } from 'antd';

import 'antd/dist/antd.css'; 

const Panel = Collapse.Panel;

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
   	        'choose':'',
        	'content':'<p>content</p>'
        }
   }
   change_content(){
      
   }
   render(){
   	return(
   	     <container content={this.state.content} choose={this.state.choose}>
   	         <Aside/>
   	         <Main/>
   	     </container>
   	     )
   }
}

class Aside extends Component{
	action(word,e){
		   if(document.querySelector('body').offsetWidth>560)
		   {
	           for(var i in this.refs)
	           {
	              if(i!=word){
	              	   let rstyle=this.refs[i].style;
			           rstyle.color='grey';
			           rstyle.height='1.2rem';
			           rstyle.fontSize='0.7rem';
			           rstyle.paddingLeft='1.6rem';
			           //rstyle.paddingBottom='0.2rem';
	              }
	                   let rstyle=this.refs[word].style;
			           rstyle.color='#337ab7';
			           rstyle.paddingLeft='1.1rem';
			           if(word=='check'){
			           	  rstyle.paddingLeft='1.8rem';
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
		   }
   	    }
   render(){
   	    return(
   	    <aside>
	        <Collapse accordion defaultActiveKey={['1']}>
			    <Panel header={<p style={{marginBottom:'0em',marginRight:'1rem'}}>目录</p>} id="menu" key="1">
                   <div class="catalog" id="check-paper" onClick={this.action.bind(this,'check')} ref='check'>
		                <Icon type="edit" />&nbsp;
		                审稿
		           </div>
		           
		           <div class="catalog" id="distribute-paper" onClick={this.action.bind(this,'distribute')} ref='distribute'>
		                <Icon type="pie-chart" />&nbsp;
		                稿件分配
		           </div>

		           <div class="catalog" id="re" onClick={this.action.bind(this,'file')} ref='file'>
		                <Icon type="file" />&nbsp;
		                稿件排版
		           </div>
		           
			    </Panel>
			</Collapse>

        </aside>
   	    )
   }
}

class Main extends Component{
   constructor(props){
   	 super(props);
   }
   render(){
   	return(
   	<main>
   	   {this.props.content}
   	</main>)
   }
}
class Editor extends Component {
  render() {
    return (
        <html className='html'>
	      <Header/>
	      <Container/>
	    </html>
    );
  }
}

export default Editor;