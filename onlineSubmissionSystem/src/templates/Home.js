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
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Panel = Collapse.Panel;
const URL='http://127.0.0.1:8080';

function ajax_post(url,data,that,callback){
	axios({
        method:"POST",
		headers:{'Content-type':'application/json',},
        url:URL+url,
        data:data,
        withCredentials:true
    }).then(function(res){
        console.log(res.data);
        alert('post-response:'+res.data);
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

class Home extends Component{
    constructor(props){
    	super(props);
        this.state={'data':''
        };
    }

render(){
				let columns = [{
				  title: '作者名',
				  dataIndex: 'name',
				  key: 'name',
				  render:(text,record) => {record.name},
				}, {
				  title: '稿件名',
				  dataIndex: 'paper-name',
				  key: 'paper-name',
				  render:(text,record)=> {record.age},
				}, {
				  title: '审核结果',
				  dataIndex: 'result',
				  key: 'result',
				  render: (text, record) => (
				    <Select defaultValue="lucy" style={{ width: 120 }}>
				      <Option value="jack">Jack</Option>
				      <Option value="lucy">Lucy</Option>
				      <Option value="disabled" disabled>Disabled</Option>
				      <Option value="Yiminghe">yiminghe</Option>
				    </Select>
				  ),
				}];

				let data = [{
				  key: '1',
				  name: 'John Brown',
				  age: 32,
				  address: 'New York No. 1 Lake Park',
				}, {
				  key: '2',
				  name: 'Jim Green',
				  age: 42,
				  address: 'London No. 1 Lake Park',
				}, {
				  key: '3',
				  name: 'Joe Black',
				  age: 32,
				  address: 'Sidney No. 1 Lake Park',
				}];	
        ajax_get('/common/geteducation',this,(that,res)=>{alert(res)});
		        

		return(
			   <html>
				 <h2>Home Page</h2>
					<Table columns={columns} dataSource={data} />
			   </html>
			  );
	}
}
export default Home;