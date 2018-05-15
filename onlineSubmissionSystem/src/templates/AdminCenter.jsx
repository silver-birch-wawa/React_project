/*
* @Author: lixiwei
* @Date:   2018-03-18 17:09:17
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-27 11:21:24
*/
import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Button, message, Modal, Input, Select, Form, Row, Col, Table, List, Card, Upload, Divider, InputNumber, DatePicker, Cascader, Switch } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';
import sha256 from 'crypto-js/sha256'
import base64 from 'crypto-js/enc-base64'
import axios from 'axios';
import Header from './Header';
import { dateFormat,error,setTimeFormat,setDateFormat } from './judgeTask';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../css/AdminCenter.css';

const { Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function professorInfo(record) {
    Modal.info({
        title: "审稿人详细信息",
        content: (
            <div>
                <p><span className="proInfoLabelSpan">姓名：</span>{record.detail.name}</p>
                <p><span className="proInfoLabelSpan">邮箱：</span>{record.detail.username}</p>
                <p><span className="proInfoLabelSpan">性别：</span>{record.detail.gender==1?'男':'女'}</p>
                <p><span className="proInfoLabelSpan">学术领域：</span>{record.academicsec.join("、")}</p>
                <p><span className="proInfoLabelSpan">银行卡号：</span>{record.detail.card}</p>
                <p><span className="proInfoLabelSpan">邮寄地址：</span>{record.detail.address}</p>
            </div>
        ),
        okText: '确定',
        onOk() {
        },
    });
}

function authorInfo(record) {
    Modal.info({
        title: "作者详细信息",
        content: (
            <div>
                <p><span className="authorInfoLabelSpan">姓名：</span>{record.detail.name}</p>
                <p><span className="authorInfoLabelSpan">姓名拼音：</span>{record.detail.name_pinyin}</p>
                <p><span className="authorInfoLabelSpan">邮箱：</span>{record.detail.email}</p>
                <p><span className="authorInfoLabelSpan">性别：</span>{record.detail.gender==1?'男':'女'}</p>
                <p><span className="authorInfoLabelSpan">联系方式：</span>{record.detail.phonenum}</p>
                <p><span className="authorInfoLabelSpan">所在地区：</span>{record.location}</p>
                <p><span className="authorInfoLabelSpan">通讯地址：</span>{record.detail.address}</p>
                <p><span className="authorInfoLabelSpan">邮编：</span>{record.detail.postcode}</p>
                <p><span className="authorInfoLabelSpan">专业：</span>{record.major}</p>
                <p><span className="authorInfoLabelSpan">研究方向：</span>{record.detail.researchdir}</p>
                <p><span className="authorInfoLabelSpan">学术领域：</span>{record.academicsec.join("、")}</p>
                <p><span className="authorInfoLabelSpan">学历：</span>{record.education}</p>
                <p><span className="authorInfoLabelSpan">职称：</span>{record.detail.title}</p>
                <p><span className="authorInfoLabelSpan">单位（中文）：</span>{record.detail.workspace_ch}</p>
                <p><span className="authorInfoLabelSpan">单位（英文）：</span>{record.detail.workspace_en}</p>
                <p><span className="authorInfoLabelSpan">办公室电话：</span>{record.detail.officetel}</p>
            </div>
        ),
        okText: '确定',
        onOk() {
        },
    });
}

class AddAccount extends Component {
	constructor(){
		super();
		this.state = {
            visible:false,
            academicsecList:[],
            safeQue:[],
		}
	}

    checkError = (id) => {
        // Only show error after a field is touched.
        return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
    }

    addSubmit = () => {
		let self = this;
        this.props.form.validateFieldsAndScroll((err) => {
            if(!err){
                self.props.addSubmit(this.props.form.getFieldsValue());
            }
        });
	}

    checkAcademicsec = (rule, value, callback) => {
	    if(value === undefined || value.length === 0){
	        callback("学术领域不能为空!");
        }else if(value.length > 3){
            callback('学术领域最多可选三个!');
        }else {
            callback();
            return;
        }
    }

    checkSafeQue = (rule, value, callback) => {
	    if(value === undefined){
	        callback("密保问题不能为空!");
        }else{
            const userInfo = this.props.form.getFieldsValue();
            const { safeQue } = this.state;
            safeQue.map(item => {
                if(item.id === userInfo.safeque1 || item.id === userInfo.safeque2 || item.id === userInfo.safeque3){
                    item.disabled = true;
                }else{
                    delete item.disabled;
                }
            })
            this.setState({
                safeQue:safeQue,
            })
            callback();
            return;
        }
    }

    checkUsername = (rule, value, callback) => {
        const patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(typeof (value) === 'string' && !!value.match(patternEmail) && value.length < 255){
            if(this.props.account.some(item => item.username == value)){
                callback("该邮箱已被注册使用!");
                return;
            }else{
                callback();
                return;
            }
        }else{
            callback("请输入正确的邮箱格式!");
            return;
        }
    }

    clearSubmit = () => {
        this.props.form.resetFields();
        this.modalClose();
    }

    modalOpen = () => {
        this.setState({
            visible:true,
        })
    }

    modalClose = () => {
        this.setState({
            visible: false,
        })
    }

    componentDidUpdate() {
	    const userInfo = this.props.form.getFieldsValue();
        console.log(userInfo);
    }

    componentWillMount() {
        const self = this;
        const getAcademicsec = new Promise((resolve, reject) => {
            axios.get('/common/gettype/type=academicsec').then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        academicsecList: response.data.typelist,
                    })
                } else {
                    message.error("失败",response.data.error?response.data.error+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            })
        });
        const getSafeQue = new Promise((resolve, reject) => {
            axios.get('/common/gettype/type=safeque').then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        safeQue: response.data.typelist,
                    })
                } else {
                    message.error("失败",response.data.error?response.data.error+'<br>获取安全问题列表失败，请稍候重试！':'获取安全问题列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
        Promise.all([getAcademicsec,getSafeQue]).catch(() =>{
            message.error('连接失败，请稍候重试！');
        })
    }

	render(){
        const { getFieldDecorator  } = this.props.form;
        const { academicsecList,safeQue } = this.state;
        const {accountType} = this.props;
		return(
			<Form id="addProfessorForm">
				<FormItem
					label={(
						<span>
						  帐号（邮箱）
						</span>
                    )}
				>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, type:'email', validator: this.checkUsername }],
                    })(
						<Input placeholder="account(email)"/>
                    )}
				</FormItem>
				<FormItem
					label={(
						<span>
						  姓名
						</span>
                    )}
				>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '姓名不能为空!', whitespace: true }],
                    })(
						<Input placeholder="name"/>
                    )}
				</FormItem>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={(
								<span>
								  性别
								</span>
                            )}
						>
                            {getFieldDecorator('gender', {
                                rules: [{ required: true, message: '性别不能为空!', type:'number' }],
                                initialValue: 1,
                            })(
								<Select getPopupContainer={() => document.getElementById('addProfessorForm')}>
									<Option value={1}>男</Option>
									<Option value={2}>女</Option>
								</Select>
                            )}
						</FormItem>
					</Col>
					<Col span={12}>
                    {
                        accountType === 'professor' ?
								<FormItem
									label={(
										<span>
										  学术领域
										</span>
									)}
								>
									{getFieldDecorator('academicsec', {
										rules: [{ required: true, type:'array', validator: this.checkAcademicsec }],
									})(
										<Select mode="multiple" getPopupContainer={() => document.getElementById('addProfessorForm')}>
                                            {academicsecList.map(item => (<Option value={item.id} key={item.id}>{item.academicsec}</Option>))}
										</Select>
									)}
								</FormItem> :
                                <FormItem
                                    label={(
                                        <span>
                                              是否为主编
                                        </span>
                                    )}
                                >
                                    {getFieldDecorator('isChief', {
                                        rules: [{ type:'boolean' }],
                                    })(
                                        <Switch checkedChildren="是" unCheckedChildren="否" />
                                    )}
                                </FormItem>
                    }
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={(
								<span>
								  密保问题一
								</span>
                            )}
						>
                            {getFieldDecorator('safeque1', {
                                rules: [{ required: true, type:'number', validator: this.checkSafeQue }],
                            })(
								<Select getPopupContainer={() => document.getElementById('addProfessorForm')}>
                                    {safeQue.map(item => (<Option value={item.id} key={item.id} disabled={item.disabled}>{item.safeque}</Option>))}
								</Select>
                            )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem
							label={(
								<span>
								  答案一
								</span>
							)}
						>
							{getFieldDecorator('answer1', {
								rules: [{ required: true, message: '答案不能为空!', whitespace: true }],
							})(
								<Input />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={(
								<span>
								  密保问题二
								</span>
                            )}
						>
                            {getFieldDecorator('safeque2', {
                                rules: [{ required: true, type:'number', validator: this.checkSafeQue }],
                            })(
								<Select getPopupContainer={() => document.getElementById('addProfessorForm')}>
                                    {safeQue.map(item => (<Option value={item.id} key={item.id} disabled={item.disabled}>{item.safeque}</Option>))}
								</Select>
                            )}
						</FormItem>
					</Col>
					<Col span={12}>
                        <FormItem
							label={(
								<span>
								  答案二
								</span>
							)}
						>
							{getFieldDecorator('answer2', {
								rules: [{ required: true, message: '答案不能为空!', whitespace: true }],
							})(
								<Input />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={(
								<span>
								  密保问题三
								</span>
                            )}
						>
                            {getFieldDecorator('safeque3', {
                                rules: [{ required: true, type:'number', validator: this.checkSafeQue }],
                            })(
								<Select getPopupContainer={() => document.getElementById('addProfessorForm')}>
                                    {safeQue.map(item => (<Option value={item.id} key={item.id} disabled={item.disabled}>{item.safeque}</Option>))}
								</Select>
                            )}
						</FormItem>
					</Col>
					<Col span={12}>
                        <FormItem
							label={(
								<span>
								  答案三
								</span>
							)}
						>
							{getFieldDecorator('answer3', {
								rules: [{ required: true, message: '答案不能为空!', whitespace: true }],
							})(
								<Input />
							)}
						</FormItem>
					</Col>
				</Row>
				<div className="ant-modal-footer">
                    <Button key="submit" type="primary" size="large" onClick={this.addSubmit} loading={this.props.confirmLoading}>
                        确定
                    </Button>
                    <Button key="restore" size="large" onClick={this.modalOpen}>
                        重置
                    </Button>
					<Button key="back" size="large" onClick={this.props.addCancel}>取消</Button>
				</div>
                <Modal
                    visible={this.state.visible}
                    maskClosable = {false}
                    onCancel={this.modalClose}
                    title="重置确认"
                    footer={[
                        <Button key="submit" type="primary" size="large" onClick={this.clearSubmit}>
                            确定
                        </Button>,
                        <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
                >
                    <p>您确定要重置已填信息吗？</p>
                </Modal>
			</Form>
		)
	}
}
const AddAccountForm = Form.create()(AddAccount);

class Account extends Component{
	constructor(){
		super();
		this.state = {
			visibleRestore: false,
            visibleDelete: false,
            visibleAddProfessor: false,
            visibleAddEditor: false,
            visibleConfirmAdd: false,
            confirmLoading: false,
			professorLoading: true,
			editorLoading: true,
            authorLoading: true,
            operationArg: [],
            professorAccount: [],
        	editorAccount: [],
            authorAccount: [],
            academicsec:[],
            currentProfessor: 1,
            totalProfessor: 1,
            currentEditor: 1,
            totalEditor: 1,
            currentAuthor: 1,
            totalAuthor: 1,
            pageSize: 10,
		};
        this.columnsProfessor = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '帐号（邮箱）',
            dataIndex: 'username',
            key: 'username',
        },{
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
            render: (text, record) => (
                <span>{text.join("、")}</span>
            ),
        },{
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            width: '5rem',
        },{
            title: '操作',
            key: 'action',
            width: '21rem',
            render: (text, record) => (
				<span>
					<Button onClick={() => professorInfo(record)}>信息详情</Button>
					<span className="ant-divider" />
					<Button onClick={() => this.modalOpen('restore',record,4)}>重置密码</Button>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen('delete',record,4)}>删除帐号</Button>
				</span>
            ),
        },];
        this.columnsEditor = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '帐号（邮箱）',
            dataIndex: 'username',
            key: 'username',
        },{
            title: '身份',
            dataIndex: 'role',
            key: 'role',
        },{
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            width: '5rem',
        },{
            title: '操作',
            key: 'action',
            width: '15rem',
            render: (text, record) => (
				<span>
					<Button onClick={() => this.modalOpen('restore',record,23)}>重置密码</Button>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen('delete',record,23)}>删除帐号</Button>
				</span>
            ),
        },];
        this.columnsAuthor = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '帐号（邮箱）',
            dataIndex: 'username',
            key: 'username',
        },{
            title: '联系方式',
            dataIndex: 'phoneNum',
            key: 'phoneNum',
        },{
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            width: '5rem',
        },{
            title: '操作',
            key: 'action',
            width: '21rem',
            render: (text, record) => (
                <span>
					<Button onClick={() => authorInfo(record)}>信息详情</Button>
					<span className="ant-divider" />
					<Button onClick={() => this.modalOpen('restore',record,1)}>重置密码</Button>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen('delete',record,1)}>删除帐号</Button>
				</span>
            ),
        },];
	}

    addAccount = () => {
        let self = this;
        const { operationArg } = this.state;

        this.confirmClose();
        this.setState({
            confirmLoading: true,
        });
        if(operationArg[1] === 'editor'){
            const url = operationArg[2].isChief?'/admin/createuser/role=2':'/admin/createuser/role=3';
            axios.post(url, {
                username:operationArg[2].username,
                password:sha256(operationArg[2].username+12345678).toString(),
                name:operationArg[2].name,
                gender:operationArg[2].gender,
                role:!operationArg[2].isChief,
                safeque1:operationArg[2].safeque1+";"+operationArg[2].answer1,
                safeque2:operationArg[2].safeque2+";"+operationArg[2].answer2,
                safeque3:operationArg[2].safeque3+";"+operationArg[2].answer3,
                alive:1,
            }).then(function (response) {
                if(response.data.result == 1) {
                    self.modalClose();
                    self.setState({
                        professorLoading: true,
                        editorLoading: true,
                        confirmLoading: false,
                    });
                    message.success('编辑添加成功！');
                    self.getType();
                }else{
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",response.data.error?response.data.error+'<br>编辑添加失败，请稍候重试！':'编辑添加失败，请稍候重试！');
                }
            }).catch(function () {
                self.confirmClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",'连接失败，请稍候重试！');
            });
        }else{
            axios.post('/admin/createuser/role=4', {
                username:operationArg[2].username,
                password:sha256(operationArg[2].username+12345678).toString(),
                name:operationArg[2].name,
                gender:operationArg[2].gender,
                academicsec1:operationArg[2].academicsec[0],
                academicsec2:operationArg[2].academicsec.length > 1?operationArg[2].academicsec[1]:null,
                academicsec3:operationArg[2].academicsec.length > 2?operationArg[2].academicsec[2]:null,
                safeque1:operationArg[2].safeque1+";"+operationArg[2].answer1,
                safeque2:operationArg[2].safeque2+";"+operationArg[2].answer2,
                safeque3:operationArg[2].safeque3+";"+operationArg[2].answer3,
                alive:1,
            }).then(function (response) {
                if(response.data.result == 1) {
                    self.modalClose();
                    self.setState({
                        professorLoading: true,
                        editorLoading: true,
                        confirmLoading: false,
                    });
                    message.success('审稿人添加成功！');
                    self.getType();
                }else{
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",response.data.error?response.data.error+'<br>审稿人添加失败，请稍候重试！':'审稿人添加失败，请稍候重试！');
                }
            }).catch(function (e) {
                console.log(e)
                self.confirmClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",'连接失败，请稍候重试！');
            });
        }
    }

    submitRestore = () => {
		const self = this;
		const {operationArg} = this.state;
		let role;

		this.setState({
            confirmLoading: true,
		});
        if(operationArg[2]===4){
            role = 4;
        }else if(operationArg[2]===23&&operationArg[1].role==='主编'){
            role = 2;
        }else if(operationArg[2]===23&&operationArg[1].role==='编辑'){
            role = 3;
        }else if(operationArg[2]===1){
            role = 1;
        }
        axios.get('/admin/resetpwd/username='+operationArg[1].username+'&role='+role).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                message.success('重置密码成功！');
            }else{
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",response.data.error?response.data.error+'<br>重置密码失败，请稍候重试！':'重置密码失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
            error("失败",'连接失败，请稍候重试！');
        });
	}

    submitDelete = () => {
        const { operationArg,currentProfessor,currentEditor,currentAuthor } = this.state;
        const self = this;
        let role;
        let type;

        this.setState({
            confirmLoading: true,
        });
        if(operationArg[2]===4){
            role = 4;
            type = [4,'currentProfessor'];
        }else if(operationArg[2]===23&&operationArg[1].role==='主编'){
            role = 2;
            type = [23,'currentEditor'];
        }else if(operationArg[2]===23&&operationArg[1].role==='编辑'){
            role = 3;
            type = [23,'currentEditor'];
        }else if(operationArg[2]===1){
            role = 1;
            type = [1,'currentAuthor'];
        }
        axios.get('/admin/deleteuser/username='+operationArg[1].username+'&role='+role).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                self.getType(...type);
                message.success('删除帐号成功！');
            }else{
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",response.data.error?response.data.error+'<br>删除帐号失败，请稍候重试！':'删除帐号失败，请稍候重试！');
                error("失败",'删除帐号失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
            error("失败",'连接失败，请稍候重试！');
        });
    }

	modalOpen = (...arg) => {
		switch(arg[0]){
			case 'restore':
				this.setState({
					visibleRestore: true,
					operationArg: arg,
				});
				break;
			case 'delete':
				this.setState({
					visibleDelete: true,
					operationArg: arg,
				});
				break;
			case 'addProfessor':
                this.setState({
                    visibleAddProfessor: true,
                    operationArg: arg,
                });
                break;
			case 'addEditor':
                this.setState({
                    visibleAddEditor: true,
                    operationArg: arg,
                });
                break;
            case 'confirmAdd':
                this.setState({
                    visibleConfirmAdd: true,
                    operationArg: arg,
                });
                break;
			default:
				break;
		}
	}

    modalClose = () => {
		this.setState({
			visibleRestore: false,
			visibleDelete: false,
			visibleAddProfessor: false,
			visibleAddEditor: false,
		})
    }

    confirmClose = () => {
        const arg = this.state.operationArg;
		if(arg[1] === 'professor'){
			this.setState({
				visibleAddProfessor: true,
				visibleConfirmAdd: false,
			})
		}else{
			this.setState({
				visibleAddEditor: true,
				visibleConfirmAdd: false,
			})
		}
	}

	getType = (role,page) => {
        const self = this;
        let academicsec;
        let major;
        let education;
        let location;
        let getAcademicsec;
        let getMajor;
        let getEducation;
        let getLocation;
	    switch (role){
            case 1:
                self.setState({
                    authorLoading: true,
                });
                getAcademicsec = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=academicsec').then(function (response) {
                        if (response.data.result == 1) {
                            academicsec = response.data.typelist;
                            self.setState({
                                academicsec: academicsec,
                            })
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取学术领域信息失败，请稍候重试！' : '获取学术领域信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getMajor = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=major').then(function (response) {
                        if (response.data.result == 1) {
                            major = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取专业信息失败，请稍候重试！' : '获取专业信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getEducation = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=education').then(function (response) {
                        if (response.data.result == 1) {
                            education = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取学历信息失败，请稍候重试！' : '获取学历信息列表失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getLocation = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=location').then(function (response) {
                        if (response.data.result == 1) {
                            location = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取国家/地区信息失败，请稍候重试！' : '获取国家/地区信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                Promise.all([getAcademicsec,getMajor,getEducation,getLocation]).then(() =>{
                    axios.get('/admin/getuser/role=1&page=1').then(function (response) {
                        if (response.data.result == 1) {
                            const authorAccount = [];
                            response.data.userlist.map(item => {
                                const author = {
                                    key:item.id,
                                    name:item.name,
                                    gender:item.gender==1?'男':'女',
                                    phoneNum:item.phonenum,
                                    academicsec:[],
                                    major:'',
                                    education:'',
                                    location:'',
                                    username:item.email,
                                    detail:item,
                                }
                                academicsec.some(k => {
                                    if(k.id == item.academicsec1 || k.id == item.academicsec2 || k.id == item.academicsec3){
                                        author.academicsec.push(k.academicsec);
                                        return true;
                                    }
                                })
                                major.some(k => {
                                    if(k.id == item.major){
                                        author.major=k.major;
                                        return true;
                                    }
                                })
                                education.some(k => {
                                    if(k.id == item.education){
                                        author.education=k.education;
                                        return true;
                                    }
                                })
                                location.some(k => {
                                    if(k.id == item.location){
                                        author.location=k.location;
                                        return true;
                                    }
                                })
                                authorAccount.push(author);
                            })
                            self.setState({
                                authorAccount: authorAccount,
                                authorLoading: false,
                            })
                        } else {
                            message.error(response.data.error?response.data.error+'<br>获取作者列表失败，请稍候重试！':'获取作者列表失败，请稍候重试！');
                        }
                    }).catch(function (e) {
                        console.log(e);
                        self.setState({
                            authorLoading: false,
                        });
                        message.error('连接失败，请稍候重试！');
                    });
                }).catch((e) =>{
                    console.log(e);
                    message.error('连接失败，请稍候重试！');
                });
                break;
            case 23:
                self.setState({
                    editorLoading: true,
                });
                const getHeadEditor = new Promise((resolve, reject) => {
                    axios.get('/admin/getuser/role=2&page=1').then(function (response) {
                        if (response.data.result == 1) {
                            const editorAccount = [];
                            response.data.userlist.map(item => {
                                editorAccount.push({
                                    key:item.id,
                                    name:item.name,
                                    gender:item.gender==1?'男':'女',
                                    role:'主编',
                                    username:item.username,
                                })
                            })
                            self.setState({
                                editorAccount: editorAccount,
                                editorLoading: false,
                            })
                        } else {
                            message.error(response.data.error?response.data.error+'<br>获取编辑列表失败，请稍候重试！':'获取编辑列表失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    });
                });
                const getEditor = new Promise((resolve, reject) => {
                    axios.get('/admin/getuser/role=3&page=1').then(function (response) {
                        if (response.data.result == 1) {
                            const editorAccount = [];
                            response.data.userlist.map(item => {
                                editorAccount.push({
                                    key:item.id,
                                    name:item.name,
                                    gender:item.gender==1?'男':'女',
                                    role:'编辑',
                                    username:item.username,
                                })
                            })
                            self.setState({
                                editorAccount: [...self.state.editorAccount,...editorAccount],
                                editorLoading: false,
                            })
                        } else {
                            message.error(response.data.error?response.data.error+'<br>获取编辑列表失败，请稍候重试！':'获取编辑列表失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    });
                });
                Promise.all([getEditor,getHeadEditor,]).catch((e) =>{
                    console.log(e);
                    self.setState({
                        editorLoading: false,
                    })
                    message.error('连接失败，请稍候重试！');
                })
                break;
            case 4:
                self.setState({
                    professorLoading: true,
                });
                axios.get('/common/gettype/type=academicsec').then(function (response) {
                    const academicsec = response.data.typelist;
                    if (response.data.result == 1) {
                        self.setState({
                            academicsec: academicsec,
                        })
                        axios.get('/admin/getuser/role=4&page=1').then(function (response) {
                            if (response.data.result == 1) {
                                const professorAccount = [];
                                response.data.userlist.map(item => {
                                    const pro = {
                                        key:item.id,
                                        name:item.name,
                                        gender:item.gender==1?'男':'女',
                                        academicsec:[],
                                        username:item.username,
                                        detail:item,
                                    };
                                    academicsec.some(k => {
                                        if(k.id == item.academicsec1 || k.id == item.academicsec2 || k.id == item.academicsec3){
                                            pro.academicsec.push(k.academicsec);
                                        }
                                    })
                                    professorAccount.push(pro);
                                })
                                self.setState({
                                    professorAccount: professorAccount,
                                    professorLoading: false,
                                })
                            } else {
                                message.error(response.data.error?response.data.error+'<br>获取审稿人列表失败，请稍候重试！':'获取审稿人列表失败，请稍候重试！');
                            }
                        }).catch(function (e) {
                            console.log(e);
                            self.setState({
                                professorLoading: false,
                            })
                            message.error('连接失败，请稍候重试！');
                        })
                    } else {
                        message.error(response.data.error?response.data.error+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                    }
                }).catch(function (e) {
                    console.log(e);
                    self.setState({
                        professorLoading: false,
                    })
                    message.error('连接失败，请稍候重试！');
                })
                break;
            case 0:
                getAcademicsec = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=academicsec').then(function (response) {
                        if (response.data.result == 1) {
                            academicsec = response.data.typelist;
                            self.setState({
                                academicsec: academicsec,
                            })
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取学术领域信息失败，请稍候重试！' : '获取学术领域信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getMajor = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=major').then(function (response) {
                        if (response.data.result == 1) {
                            major = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取专业信息失败，请稍候重试！' : '获取专业信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getEducation = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=education').then(function (response) {
                        if (response.data.result == 1) {
                            education = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取学历信息失败，请稍候重试！' : '获取学历信息列表失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                getLocation = new Promise((resolve, reject) => {
                    axios.get('/common/gettype/type=location').then(function (response) {
                        if (response.data.result == 1) {
                            location = response.data.typelist;
                        } else {
                            message.error(response.data.error ? response.data.error + '<br>获取国家/地区信息失败，请稍候重试！' : '获取国家/地区信息失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function () {
                        reject();
                    })
                });
                Promise.all([getAcademicsec,getMajor,getEducation,getLocation]).then(() =>{
                    const getProfessor = new Promise((resolve, reject) => {
                        axios.get('/admin/getuser/role=4&page=1').then(function (response) {
                            if (response.data.result == 1) {
                                const professorAccount = [];
                                response.data.userlist.map(item => {
                                    const pro = {
                                        key:item.id,
                                        name:item.name,
                                        gender:item.gender==1?'男':'女',
                                        academicsec:[],
                                        username:item.username,
                                        detail:item,
                                    };
                                    academicsec.some(k => {
                                        if(k.id == item.academicsec1 || k.id == item.academicsec2 || k.id == item.academicsec3){
                                            pro.academicsec.push(k.academicsec);
                                            return true;
                                        }
                                    })
                                    professorAccount.push(pro);
                                })
                                self.setState({
                                    professorAccount: professorAccount,
                                    professorLoading: false,
                                })
                            } else {
                                message.error(response.data.error?response.data.error+'<br>获取审稿人列表失败，请稍候重试！':'获取审稿人列表失败，请稍候重试！');
                            }
                            resolve();
                        }).catch(function () {
                            reject();
                        })
                    });
                    const getHeadEditor = new Promise((resolve, reject) => {
                        axios.get('/admin/getuser/role=2&page=1').then(function (response) {
                            if (response.data.result == 1) {
                                const editorAccount = [];
                                response.data.userlist.map(item => {
                                    editorAccount.push({
                                        key:item.id,
                                        name:item.name,
                                        gender:item.gender==1?'男':'女',
                                        role:'主编',
                                        username:item.username,
                                    })
                                })
                                self.setState({
                                    editorAccount: editorAccount,
                                    editorLoading: false,
                                })
                            } else {
                                message.error(response.data.error?response.data.error+'<br>获取编辑列表失败，请稍候重试！':'获取编辑列表失败，请稍候重试！');
                            }
                            resolve();
                        }).catch(function () {
                            reject();
                        });
                    });
                    const getEditor = new Promise((resolve, reject) => {
                        axios.get('/admin/getuser/role=3&page=1').then(function (response) {
                            if (response.data.result == 1) {
                                const editorAccount = [];
                                response.data.userlist.map(item => {
                                    editorAccount.push({
                                        key:item.id,
                                        name:item.name,
                                        gender:item.gender==1?'男':'女',
                                        role:'编辑',
                                        username:item.username,
                                    })
                                })
                                self.setState({
                                    editorAccount: [...self.state.editorAccount,...editorAccount],
                                    editorLoading: false,
                                })
                            } else {
                                message.error(response.data.error?response.data.error+'<br>获取编辑列表失败，请稍候重试！':'获取编辑列表失败，请稍候重试！');
                            }
                            resolve();
                        }).catch(function () {
                            reject();
                        });
                    });
                    const getAuthor = new Promise((resolve, reject) => {
                        axios.get('/admin/getuser/role=1&page=1').then(function (response) {
                            if (response.data.result == 1) {
                                const authorAccount = [];
                                response.data.userlist.map(item => {
                                    const author = {
                                        key:item.id,
                                        name:item.name,
                                        gender:item.gender==1?'男':'女',
                                        phoneNum:item.phonenum,
                                        academicsec:[],
                                        major:'',
                                        education:'',
                                        location:'',
                                        username:item.email,
                                        detail:item,
                                    }
                                    academicsec.some(k => {
                                        if(k.id == item.academicsec1 || k.id == item.academicsec2 || k.id == item.academicsec3){
                                            author.academicsec.push(k.academicsec);
                                            return true;
                                        }
                                    })
                                    major.some(k => {
                                        if(k.id == item.major){
                                            author.major=k.major;
                                            return true;
                                        }
                                    })
                                    education.some(k => {
                                        if(k.id == item.education){
                                            author.education=k.education;
                                            return true;
                                        }
                                    })
                                    location.some(k => {
                                        if(k.id == item.location){
                                            author.location=k.location;
                                            return true;
                                        }
                                    })
                                    authorAccount.push(author);
                                })
                                self.setState({
                                    authorAccount: authorAccount,
                                    authorLoading: false,
                                })
                            } else {
                                message.error(response.data.error?response.data.error+'<br>获取作者列表失败，请稍候重试！':'获取作者列表失败，请稍候重试！');
                            }
                            resolve();
                        }).catch(function () {
                            reject();
                        });
                    });
                    Promise.all([getProfessor,getEditor,getHeadEditor,getAuthor]).catch((e) =>{
                        console.log(e);
                        self.setState({
                            professorLoading: false,
                            editorLoading: false,
                            authorLoading: false,
                        })
                        message.error('连接失败，请稍候重试！');
                    })
                }).catch((e) =>{
                    console.log(e);
                    message.error('连接失败，请稍候重试！');
                })
                break;
            default:
                break;
        }
    }

    componentWillMount(){
        this.getType(0,1);
	}

    pageChange = (role,page) => {
        this.getType(role,page);
    }

	render(){
		return(
			<div>
				<Tabs animated={false} tabPosition="top" defaultActiveKey='0' style={{ paddingTop:'1rem' }}>
					<TabPane tab="审稿人" key="0">
						<Button type="primary" className="adminBasisAddBtn" onClick={() => this.modalOpen('addProfessor')}>添加帐号</Button>
						<Table
                            pagination={{
                                pageSize: this.state.pageSize,
                                total:this.state.totalProfessor,
                                current:this.state.currentProfessor,
                                onChange: (page) => this.pageChange(4,page),
                            }}
							loading={this.state.professorLoading}
							columns={this.columnsProfessor}
							dataSource={this.state.professorAccount}
							bordered scroll={{ x: '31rem' }}
						/>
					</TabPane>
					<TabPane tab="编辑" key="1">
						<Button type="primary" className="adminBasisAddBtn" onClick={() => this.modalOpen('addEditor')}>添加帐号</Button>
						<Table
                            pagination={{
                                pageSize: this.state.pageSize,
                                total:this.state.totalEditor,
                                current:this.state.currentEditor,
                                onChange: (page) => this.pageChange(23,page),
                            }}
							loading={this.state.editorLoading}
							columns={this.columnsEditor}
							dataSource={this.state.editorAccount}
							bordered scroll={{ x: '31rem' }}
						/>
					</TabPane>
                    <TabPane tab="作者" key="2">
                        <Table
                            pagination={{
                                pageSize: this.state.pageSize,
                                total:this.state.totalAuthor,
                                current:this.state.currentAuthor,
                                onChange: (page) => this.pageChange(1,page),
                            }}
                            loading={this.state.authorLoading}
                            columns={this.columnsAuthor}
                            dataSource={this.state.authorAccount}
                            bordered scroll={{ x: '31rem' }}
                        />
                    </TabPane>
				</Tabs>
				<Modal
					visible={this.state.visibleRestore}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="提交确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.submitRestore} loading={this.state.confirmLoading}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
				>
					<p>您确定要重置该帐号的密码吗？</p>
				</Modal>
				<Modal
					visible={this.state.visibleDelete}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="提交确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.submitDelete} loading={this.state.confirmLoading}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
				>
					<p>您确定要删除该帐号吗？</p>
				</Modal>
				<Modal
					visible={this.state.visibleConfirmAdd}
					maskClosable = {false}
					zIndex={1001}
					onCancel={this.confirmClose}
					title="提交确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.addAccount}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.confirmClose}>取消</Button>
                    ]}
				>
					<p>您确定要添加该帐号吗？</p>
				</Modal>
				<Modal
					visible={this.state.visibleAddProfessor}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="添加帐号"
					footer={null}
				>
					<AddAccountForm
						accountType='professor'
						confirmLoading={this.state.confirmLoading}
						addSubmit={(userInfo) => this.modalOpen('confirmAdd','professor',userInfo)}
						addCancel={this.modalClose}
                        account={this.state.professorAccount}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleAddEditor}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="添加帐号"
					footer={null}
					>
					<AddAccountForm
						accountType='editor'
						confirmLoading={this.state.confirmLoading}
						addSubmit={(userInfo) => this.modalOpen('confirmAdd','editor',userInfo)}
						addCancel={this.modalClose}
                        account={this.state.editorAccount}
					/>
				</Modal>
			</div>
		)
	}
}

class Announcement extends Component{
    constructor(){
        super();
        this.state = {
            loading: true,
            confirmLoading: false,
            subLoading: false,
			isShowDetail: false,
			operationArg: [],
            visibleDelete: false,
			announcementsDetail: {},
            announcements: [],
            announcementTitle: '',
            editorState: EditorState.createEmpty(),
            file: {},
            pic: [],
        }
        this.columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title: '发布时间',
            dataIndex: 'date_pub',
            key: 'date_pub',
            render: (text, record) => (<span>{new Date(text).toLocaleDateString()}</span>)
        },{
            title: '操作',
            key: 'action',
            width: '12rem',
            render: (text, record) => (
				<span>
					<Button type="primary" onClick={() => this.announcementDetail(record,true)}>查看</Button>
					<span className="ant-divider" />
					<Button onClick={() => this.modalOpen('delete',record)}>删除</Button>
				</span>
            ),
        }];
    }

    announcementDetail = (record,isShowDetail) => {
    	if(isShowDetail){
            const self = this;
            axios.get('/common/getannouncement/id='+record.key).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        announcementsDetail: response.data.announcement,
                        isShowDetail: true,
                    })
                } else {
                    error("失败",response.data.error?response.data.error+'<br>获取公告详情失败，请稍候重试！':'获取公告详情失败，请稍候重试！');
                }
            }).catch(function (e) {
                console.log(e);
                message.error('连接失败，请稍候重试！');
            })
		}else{
            this.setState({
                isShowDetail: false,
            })
		}
	}

    onEditorStateChange = (editorState) => {
        // console.log(convertToRaw(editorState.getCurrentContent()).blocks);
        this.setState({
            editorState,
        });
    };

    submitDelete = () => {
    	const { announcements, operationArg } = this.state;
        let self = this;
        this.setState({
            confirmLoading: true,
        });
        axios.get('/admin/deleteannouncement/id='+operationArg[1].key).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                    announcements: announcements.filter(data => data.key !== operationArg[1].key)
                })
                self.getAnnouncements();
                message.success('删除公告成功！');
            }else{
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",response.data.error?response.data.error+'<br>删除公告失败，请稍候重试！':'删除公告失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
            error("失败",'连接失败，请稍候重试！');
        });
    }

    titleChange = (e) => {
    	this.setState({
            announcementTitle: e.target.value,
		})
	}

    subAnnouncement = () => {
        let { file, announcementTitle, editorState, pic } = this.state;
        const formData = new FormData();
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const self = this;

        if(announcementTitle === '' || !convertToRaw(editorState.getCurrentContent()).blocks.some(item => item.text.replace(/\s+/g, "") !== '')){
            error("失败",'提交失败，请确认公告标题和内容不能为空！');
            return false;
        }

        pic.map((p,index) => {
            if(content.indexOf(p) < 0){
                pic.splice(index,1);
            }
        })
        formData.append("file", file);
        formData.append("title", announcementTitle);
        formData.append("content", content);
        formData.append("pic", pic.join("|"));
        this.setState({
            subLoading: true,
        });
        axios.post('/admin/createannouncement1', formData).then(function (response) {
            if(response.data.result == 1) {
                self.setState({
                    file: {},
                    subLoading: false,
                });
                message.success('公告发布成功！',2,()=>{
                    window.location.reload()
                });
            }else{
                self.modalClose();
                self.setState({
                    subLoading: false,
                });
                error("失败",response.data.error?response.data.error+'<br>上传失败，请稍候重试！':'上传失败，请稍候重试！');
            }
        }).catch(function () {
            self.modalClose();
            self.setState({
                subLoading: false,
            });
            error("失败",'连接失败，请稍候重试！');
        });
	}

	beforeUpload = (file) => {
		this.setState({
			file: file,
		})
		return false;
	}

    uploadImageCallBack = (file) => {
        const { pic } = this.state;
        const self = this;
        return new Promise(
            (resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);
                axios.post('/admin/uploadpic', formData).then(function (response) {
                    pic.push(response.data.url);
                    self.setState({
                        pic: pic,
                    });
                    resolve({
                        data:{
                            link:'http://localhost:8080/images/'+response.data.url,
                        }
                    });
                }).catch(function (e) {
                    console.log(e);
                    message.error("连接失败，图片上传失败，请稍候尝试！");
                    reject(e);
                });
            }
        );
    }

    modalOpen = (...arg) => {
    	if(arg[0]){
            this.setState({
				operationArg: arg,
                visibleDelete: true,
            })
    	}
	}

    modalClose = () =>{
    	this.setState({
            visibleDelete: false,
		})
	}

	getAnnouncements = () => {
        const self = this;
        axios.get('/common/announcementlist/num=-1').then(function (response) {
            if (response.data.result == 1) {
                const announcements = [];
                response.data.announcementlist.map(item => {
                    announcements.push({
                        key:item.id,
                        title:item.title,
                        date_pub:item.date_pub,
                    })
                })
                self.setState({
                    announcements: announcements,
                    loading: false,
                })
            } else {
                self.setState({
                    loading: false,
                })
                error("失败",response.data.error?response.data.error+'<br>获取公告列表失败，请稍候重试！':'获取公告列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e)
            self.setState({
                loading: false,
            })
            error("失败", '连接失败，请稍候重试！');
        })
    }

    componentWillMount(){
        this.getAnnouncements();
    }

    render(){
    	const { loading, isShowDetail, announcements, announcementsDetail, visibleDelete, confirmLoading, announcementTitle, editorState, file, subLoading} = this.state;
        return(
			<Tabs animated={false} tabPosition="top" defaultActiveKey='1' className="centerTab">
				<TabPane tab="公告列表" key="1">
					{
						isShowDetail ?
							<div id="announcementDetailDiv">
								<Card id="announcementsDetailCard">
									<p>{ announcementsDetail.title }</p>
									<p dangerouslySetInnerHTML={{__html: announcementsDetail.content}}></p>
                                    { announcementsDetail.upload ? <a href={"/download/id="+announcementsDetail.id+"&type=3"}>{ announcementsDetail.upload }</a> : null}
								</Card>
								<List
									size="small"
									header={<div>公告列表：</div>}
									footer={<Button type="primary" onClick={() => this.announcementDetail(null,false)}>返回</Button>}
									bordered
									dataSource={announcements}
									renderItem={item => (
										<List.Item
											key={item.key}
											onClick={() => this.announcementDetail(item,true)}
											className="clickHover"
										>
											{item.title}
										</List.Item>
									)}
								/>
							</div> :
							<Table
								loading={loading}
								columns={this.columns}
								dataSource={announcements}
								bordered scroll={{ x: '1rem' }}
							/>
					}
					<Modal
						visible={visibleDelete}
						maskClosable = {false}
						onCancel={this.modalClose}
						title="删除确认"
						footer={[
							<Button key="submit" type="primary" size="large" onClick={this.submitDelete} loading={confirmLoading}>
								确定
							</Button>,
							<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
					>
						<p>您确定要删除该公告吗？</p>
					</Modal>
				</TabPane>
				<TabPane tab="公告发布" key="2">
					<Input addonBefore="标题" placeholder="title" defaultValue={announcementTitle} onChange={this.titleChange}/>
					<p/>
					<Editor
						editorState={editorState}
						toolbarClassName="toolbarEditor"
						editorClassName="contentEditor"
						toolbar={{
							options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'remove', 'history'],
                            image: { defaultSize: {height: '100%',width: '100%'}, previewImage: true, uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: false } },
						}}
						localization={{
                            locale: 'zh',
                        }}
						onEditorStateChange={this.onEditorStateChange}
					/>
					<div id="announcementSubDiv">
						<Upload
							showUploadList={false}
							beforeUpload = {this.beforeUpload}
						>
							<Button title="上传公告附件，多文件请打包成压缩文件上传">
								<Icon type="upload" />{file.name ? file.name : '上传附件'}
							</Button>
						</Upload>
						<Button type="primary" loading={subLoading} onClick={this.subAnnouncement}>提交</Button>
					</div>
				</TabPane>
			</Tabs>
        )
    }
}

class BasisAdd extends Component {
    constructor(){
        super();
        this.state = {

        }
    }

    checkError = (id) => {
        // Only show error after a field is touched.
        return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
    }

    addSubmit = () => {
        let self = this;
        this.props.form.validateFieldsAndScroll((err) => {
            if(!err){
                self.props.addSubmit(this.props.form.getFieldsValue());
            }
        });
    }

    componentDidUpdate() {
        console.log(this.props.form.getFieldsValue());
    }

    render(){
        const { getFieldDecorator  } = this.props.form;
        const { confirmLoading, operationArg } = this.props;
        return(
			<Form>
				{operationArg[2] === 'academicsec' ?
					<FormItem
						label={(
							<span>
							  学术领域
							</span>
						)}
					>
						{getFieldDecorator('academicsec', {
							rules: [{ required: true, message: '学术领域不能为空!', whitespace: true }],
						})(
							<Input />
						)}
					</FormItem> : null}
                {operationArg[2] === 'column'?
					<FormItem
						label={(
							<span>
							  期刊栏目
							</span>
                        )}
					>
                        {getFieldDecorator('column', {
                            rules: [{ required: true, message: '期刊栏目不能为空!', whitespace: true }],
                        })(
							<Input />
                        )}
					</FormItem> : null}
				<div className="ant-modal-footer">
					<Button key="submit" type="primary" size="large" onClick={this.addSubmit} loading={confirmLoading}>
						确定
					</Button>
					<Button key="back" size="large" onClick={this.props.addCancel}>取消</Button>
				</div>
			</Form>
        )
    }
}
const BasisAddForm = Form.create()(BasisAdd);

const EditableCell = ({ editable, value, onChange, type }) => {
    switch (type){
        case 'input':
            return (
                <div>
                    {editable?<Input className="adminBasisInput" value={value} onChange={e => onChange(e.target.value)}/>:value}
                </div>
            )
        case 'datePicker':
            return (
                <div>
                    {editable
                        ?<DatePicker
                            allowClear={false}
                            value={value?moment(value):''}
                            disabledDate={(current) => (current < moment().startOf('day') || current > moment().endOf('year'))}
                            showTime={{format: 'HH:mm'}}
                            format={dateFormat}
                            style={{minWidth:'12rem'}}
                            onChange={onChange}/>
                        :(value!=null?setDateFormat(value):'')}
                </div>
            )
        case 'inputNumber':
            return (
                <div>
                    {editable
                        ?<InputNumber
                            value={value}
                            min={0}
                            onChange={onChange}/>
                        :value}
                </div>
            )
        default:
            return (
                <div>{value}</div>
            )
    }
};
class Basis extends Component{
    constructor(){
        super();
        this.state = {
            visibleDelete: false,
            visibleAdd: false,
            visibleSave: false,
            visibleCancel: false,
            visibleConfirmAdd: false,
            visibleBasisSave: false,
            confirmLoading: false,
            periodicalLoading: false,
            academicsecLoading: false,
            columnLoading: false,
            operationArg: ['',[],''],
            periodical: [],
            academicsec: [],
			column:[],
            cacheAcademicsec : [],
            cacheColumn : [],
            cachePeriodical: [],
            newsroomInfo:[],
            periodicalTypes: [],
            periodicalType: [],
            reviewFee: '',
            pageCharges: '',
            articleNum: '',
            toYear: '',
            contentYear: '',
        };
        this.columnsAcademicsec = [{
            title: '编号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
        },{
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
            render: (text, record) => this.renderColumns(text, record, 'academicsec','input'),
        },{
            title: '操作',
            key: 'action',
            width: '12rem',
            render: (text, record) => (
            	<span>
					{record.editable ?
						<Button type="primary" onClick={() => this.modalOpen('save',record,'academicsec')}>保存</Button>
						:
						<Button type="primary" onClick={() => this.edit(record.key,'academicsec')}>修改</Button>
					}
					<span className="ant-divider" />
					<Button disabled={!record.editable} onClick={() => this.modalOpen('cancel',record,'academicsec')}>取消</Button>
				</span>
			)
        },];
        this.columnsColumn = [{
            title: '编号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
        },{
            title: '期刊栏目',
            dataIndex: 'column',
            key: 'column',
            render: (text, record) => this.renderColumns(text, record,'column','input'),
        },{
            title: '操作',
            key: 'action',
            width: '12rem',
            render: (text, record) => (
				<span>
					{record.editable ?
						<Button type="primary" onClick={() => this.modalOpen('save',record,'column')}>保存</Button>
                        :
						<Button type="primary" onClick={() => this.edit(record.key,'column')}>修改</Button>
                    }
					<span className="ant-divider" />
					<Button disabled={!record.editable} onClick={() => this.modalOpen('cancel',record,'column')}>取消</Button>
				</span>
            )
        },];
        this.columnsPeriodical = [{
            title: '编号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
        },{
            title: '发刊日期',
            dataIndex: 'datePub',
            key: 'datePub',
            render: (text, record) => this.renderColumns(text, record,'datePub','datePicker'),
        },{
            title: '文章数量上限',
            dataIndex: 'maxNum',
            key: 'maxNum',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record,'maxNum','inputNumber'),
        },{
            title: '操作',
            key: 'action',
            width: '12rem',
            render: (text, record) => (
                <span>
					{record.editable ?
                        <Button type="primary" onClick={() => this.modalOpen('save',record,'periodical')}>保存</Button>
                        :
                        <Button type="primary" onClick={() => this.edit(record.key,'periodical')}>修改</Button>
                    }
                    <span className="ant-divider" />
					<Button disabled={!record.editable} onClick={() => this.modalOpen('cancel',record,'periodical')}>取消</Button>
				</span>
            )
        }];
    }

    renderColumns(text, record, data, type) {
        return (
			<EditableCell
				editable={record.editable}
				value={text}
                type={type}
				onChange={value => this.basisTargetChange(value, record, data)}
			/>
        );
    }

    add = () => {
        const self = this;
        const { operationArg } = this.state;

        this.confirmClose();
        this.setState({
            confirmLoading: true,
        });

        switch (operationArg[2]){
			case 'academicsec':
                axios({
                    method: 'post',
                    url: '/admin/createacademicsec',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    params: {academicsec:operationArg[1].academicsec},
                }).then(function (response) {
                    if(response.data.result == 1) {
                        self.modalClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        this.getBasis();
                        message.success('学术领域添加成功！');
                    }else{
                        self.confirmClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        error("失败",response.data.error?response.data.error+'<br>操作失败，请稍候重试！':'操作失败，请稍候重试！');
                    }
                }).catch(function () {
                    self.confirmClose();
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",'连接失败，请稍候重试！');
                });
                break;
            case 'column':
                axios({
                    method: 'post',
                    url: '/admin/createcolumn',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {column:operationArg[1].column}
                }).then(function (response) {
                    if(response.data.result == 1) {
                        self.modalClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        this.getBasis();
                        message.success('期刊栏目添加成功！');
                    }else{
                        self.confirmClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        error("失败",response.data.error?response.data.error+'<br>操作失败，请稍候重试！':'操作失败，请稍候重试！');
                    }
                }).catch(function () {
                    self.confirmClose();
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",'连接失败，请稍候重试！');
                });
                break;
			default:
				break;
		}
    }

    basisTargetChange(value, record, data) {
        const {toYear} = this.state;
    	let newData = [];
        let target = [];
		switch (data){
			case 'academicsec':
				newData = [...this.state.academicsec];
				target = newData.filter(item => record.key === item.key)[0];
				if (target) {
					target[data] = value;
					this.setState({academicsec: newData});
				}
				break;
			case 'column':
				newData = [...this.state.column];
				target = newData.filter(item => record.key === item.key)[0];
				if (target) {
					target[data] = value;
					this.setState({column: newData});
				}
				break;
            case 'datePub':
                newData = [...this.state.periodical];
                target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target[data] = new Date(moment(value).year(toYear));
                    this.setState({periodical: newData});
                }
                break;
            case 'maxNum':
                newData = [...this.state.periodical];
                target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target[data] = value;
                    this.setState({periodical: newData});
                }
                break;
            default:
				break;
		}
    }

    edit = (key,data) => {
        let newData = [];
        let target = [];
		switch (data){
			case 'academicsec':
				newData = [...this.state.academicsec];
				target = newData.filter(item => key === item.key)[0];
				if (target) {
					target.editable = true;
					this.setState({ academicsec: newData });
				}
				break;
			case 'column':
				newData = [...this.state.column];
				target = newData.filter(item => key === item.key)[0];
				if (target) {
					target.editable = true;
					this.setState({ column: newData });
				}
				break;
            case 'periodical':
                newData = [...this.state.periodical];
                target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.editable = true;
                    this.setState({ periodical: newData });
                }
                break;
			default:
				break;
		}
    }

    save = () => {
        const { operationArg,contentYear } = this.state;
    	const key = operationArg[1].key;
        const self = this;
        let newData = [];
        let cacheData = [];
        let target = [];
        let cacheTarget = [];

        switch (operationArg[2]){
            case 'academicsec':
                newData = [...this.state.academicsec];
                cacheData = [...this.state.cacheAcademicsec];
                target = newData.filter(item => key === item.key)[0];
                cacheTarget = cacheData.filter(item => key === item.key)[0];
                if (target) {
                    this.setState({
                        confirmLoading: true,
                    });
                    axios({
                        method: 'post',
                        url: '/admin/updateacademicsec',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                        },
                        params: {
                            id:operationArg[1].key,
                            academicsec:operationArg[1].academicsec,
                        },
                    }).then(function (response) {
                        if(response.data.result == 1) {
                            delete target.editable;
                            Object.assign(cacheTarget, target);
                            self.setState({
                                confirmLoading: false,
                                academicsec: newData,
                                cacheAcademicsec: cacheData,
                                visibleSaveAcademicsec: false,
                            });
                            self.modalClose();
                            message.success('保存成功！');
                            if(!newData.some(item => item.editable)){
                                self.getAcademicsec();
                            }
                        }else {
                            self.modalClose();
                            self.setState({
                                confirmLoading: false,
                            });
                            error("失败",response.data.error?response.data.error+'<br>操作失败，请稍候重试！':'操作失败，请稍候重试！');
                        }
                    }).catch(function () {
                        self.modalClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        error("失败", '连接失败，请稍候重试！');
                    });
                }
                break;
            case 'column':
                newData = [...this.state.column];
                cacheData = [...this.state.cacheColumn];
                target = newData.filter(item => key === item.key)[0];
                cacheTarget = cacheData.filter(item => key === item.key)[0];
                if (target) {
                    this.setState({
                        confirmLoading: true,
                    });
                    axios({
                        method: 'post',
                        url: '/admin/updatecolumn',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                        },
                        params: {
                            id: operationArg[1].key,
                            column: operationArg[1].column,
                        }
                    }).then(function (response) {
                        if(response.data.result == 1) {
                            delete target.editable;
                            Object.assign(cacheTarget, target);
                            self.setState({
                                confirmLoading: false,
                                column: newData,
                                cacheColumn: cacheData,
                                visibleSave: false,
                            });
                            self.modalClose();
                            message.success('保存成功！');
                            if(!newData.some(item => item.editable)){
                                self.getColumn();
                            }
                        }else {
                            self.modalClose();
                            self.setState({
                                confirmLoading: false,
                            });
                            error("失败",response.data.error?response.data.error+'<br>操作失败，请稍候重试！':'操作失败，请稍候重试！');
                        }
                    }).catch(function () {
                        self.modalClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        error("失败", '连接失败，请稍候重试！');
                    });
                }
                break;
            case 'periodical':
                newData = [...this.state.periodical];
                cacheData = [...this.state.cachePeriodical];
                target = newData.filter(item => key === item.key)[0];
                cacheTarget = cacheData.filter(item => key === item.key)[0];
                if (target) {
                    this.setState({
                        confirmLoading: true,
                    });
                    axios({
                        method: 'post',
                        url: '/admin/updatecontent',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                        },
                        params: {
                            year: operationArg[1].year,
                            which: operationArg[1].key,
                            date: setTimeFormat(operationArg[1].datePub),
                            num: operationArg[1].maxNum,
                        }
                    }).then(function (response) {
                        if(response.data.result == 1) {
                            delete target.editable;
                            Object.assign(cacheTarget, target);
                            self.setState({
                                confirmLoading: false,
                                periodical: newData,
                                cachePeriodical: cacheData,
                                visibleSave: false,
                            });
                            self.modalClose();
                            message.success('保存成功！');
                            if(!newData.some(item => item.editable)){
                                self.getContent(contentYear);
                            }
                        }else {
                            self.modalClose();
                            self.setState({
                                confirmLoading: false,
                            });
                            error("失败",response.data.error?response.data.error+'<br>操作失败，请稍候重试！':'操作失败，请稍候重试！');
                        }
                    }).catch(function () {
                        self.modalClose();
                        self.setState({
                            confirmLoading: false,
                        });
                        error("失败", '连接失败，请稍候重试！');
                    });
                }
                break;
            default:
                break;
        }
    }

    cancel = () => {
        const { operationArg } = this.state;
        const key = operationArg[1].key;
        let cacheData = [];
        let newData = [];
        let target = [];
        switch (operationArg[2]){
			case 'academicsec':
				newData = [...this.state.academicsec];
                target = newData.filter(item => key === item.key)[0];
                cacheData = [...this.state.cacheAcademicsec];
                if (target) {
                    Object.assign(target, cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.setState({
                        academicsec: newData,
                        visibleCancel: false,
                    });
                }
                break;
            case 'column':
                newData = [...this.state.column];
                target = newData.filter(item => key === item.key)[0];
                cacheData = [...this.state.cacheColumn];
                if (target) {
                    Object.assign(target, cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.setState({
                        column: newData,
                        visibleCancel: false,
                    });
                }
                break;
            case 'periodical':
                newData = [...this.state.periodical];
                target = newData.filter(item => key === item.key)[0];
                cacheData = [...this.state.cachePeriodical];
                if (target) {
                    Object.assign(target, cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.setState({
                        periodical: newData,
                        visibleCancel: false,
                    });
                }
                break;
			default:
				break;
		}
    }

    itemChange = (value,type) => {
        const {newsroomInfo} = this.state;
        switch (type){
            case 'periodicalType':
                if(!newsroomInfo.some(item => {
                    if(item.year == value[0]){
                        this.setState({
                            periodicalType: value,
                            reviewFee: item.reviewfee,
                            pageCharges: item.pagecharges,
                            articleNum: item.articlenum,
                        })
                        return true;
                    }
                })){
                    this.setState({
                        periodicalType: value,
                    })
                }
                break;
            case 'reviewFee':
                if(value === undefined){
                    value = 0
                }
                this.setState({
                    reviewFee: value,
                })
                break;
            case 'pageCharges':
                if(value === undefined){
                    value = 0
                }
                this.setState({
                    pageCharges: value,
                })
                break;
            case 'articleNum':
                if(value === undefined){
                    value = 0
                }
                this.setState({
                    articleNum: value,
                })
                break;
            default:
                break;
        }
    }

    basisSave = () => {
        const self = this;
        const { periodicalType,reviewFee,pageCharges,articleNum,toYear,contentYear } = this.state;

        self.setState({
            confirmLoading: true,
        });
        axios({
            method: 'post',
            url: '/admin/updatestandard',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            params: {
                year: periodicalType[0],
                standard: periodicalType[0]==toYear?0:periodicalType[1],
                reviewfee: reviewFee,
                pagecharges: pageCharges,
                articlenum: articleNum,
            }
        }).then(function (response) {
            if(response.data.result == 1) {
                self.setState({
                    confirmLoading: false,
                });
                axios.get('/admin/getstandardlist').then(function (response) {
                    if (response.data.result == 1) {
                        self.setState({
                            newsroomInfo:response.data.standardlist,
                            toYear:response.data.year,
                        });
                    }
                }).catch(function (e) {
                    console.log(e)
                });
                self.getContent(contentYear);
                self.modalClose();
                message.success('保存成功！');
            }else {
                self.setState({
                    confirmLoading: false,
                });
                self.modalClose();
                error("失败",response.data.error?response.data.error+'<br>基本配置保存失败，请稍候重试！':'基本配置保存失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
            error("失败", '连接失败，请稍候重试！');
        });
    }

    contentYearChange = (year) => {
        const { periodicalTypes } = this.state;
        if(year === undefined){
            year = periodicalTypes[1].value;
        }
        this.setState({
            contentYear: year,
        })
        this.getContent(year);
    }

    modalOpen = (...arg) => {
        const { operationArg,periodical,periodicalType,reviewFee,pageCharges,articleNum,contentYear } = this.state;
        switch(arg[0]){
            case 'save':
                switch (arg[2]){
                    case 'academicsec':
                        if(arg[1].academicsec){
                            error("失败","提交失败，学术领域不能为空！");
                            return;
                        }
                        break;
                    case 'column':
                        if(arg[1].column){
                            error("失败","提交失败，期刊栏目不能为空！");
                            return;
                        }
                        break;
                    case 'periodical':
                        if(arg[1].datePub == null){
                            error("失败","提交失败，发刊日期不能为空！");
                            return;
                        }else if(moment(arg[1].datePub).isBefore(moment())){
                            error("失败","提交失败，发刊日期必须比当前时间晚！");
                            return;
                        }else if(arg[1].maxNum == 0){
                            error("失败","提交失败，文章数量上限必须大于0！");
                            return;
                        }
                        break;
                    default:
                        break;
                }
                this.setState({
                    visibleSave: true,
                    operationArg: arg,
                });
                break;
            case 'basisSave':
                if( reviewFee <= 0 || pageCharges <= 0 || articleNum <= 0 ){
                    error("失败","提交失败，审稿费、版面费、文章数量上限必须大于0！");
                    return;
                }else if(periodicalType[0] == contentYear && periodical.some(item => item.editable)){
                    error("失败","提交失败，下方的期刊设置存在正在编辑的数据，请先保存或取消修改！");
                    return;
                }
                this.setState({
                    visibleBasisSave: true,
                    operationArg: arg,
                });
                break;
            case 'cancel':
                this.setState({
                    visibleCancel: true,
                    operationArg: arg,
                });
                break;
            case 'add':
                this.setState({
                    operationArg: arg,
                    visibleAdd: true,
                });
                break;
            case 'confirmAdd':
                operationArg[1] = arg[1];
                this.setState({
                    visibleConfirmAdd: true,
                    operationArg: operationArg,
                });
                break;
            default:
                break;
        }
    }

    modalClose = () => {
        this.setState({
            visibleDelete: false,
            visibleSave: false,
            visibleCancel: false,
            visibleAdd: false,
            visibleConfirmAdd: false,
            visibleBasisSave: false,
        })
    }

    confirmClose = () => {
		this.setState({
			visibleAdd: true,
			visibleConfirmAdd: false,
		})
    }

    getAcademicsec = () => {
        const self = this;
        self.setState({
            academicsecLoading: true,
        });
        axios.get('/common/gettype/type=academicsec').then(function (response) {
            if (response.data.result == 1) {
                const academicsec = [];
                response.data.typelist.map(item => {
                    academicsec.push({
                        key:item.id,
                        academicsec:item.academicsec
                    })
                })
                self.setState({
                    academicsec: academicsec,
                    academicsecLoading: false,
                })
            } else {
                self.setState({
                    academicsecLoading: false,
                })
                message.error(response.data.error?response.data.error+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.setState({
                academicsecLoading: false,
            });
            message.error('连接失败，请稍候重试！');
        })
    }

    getColumn = () => {
        const self = this;
        self.setState({
            columnLoading: true,
        });
        axios.get('/common/gettype/type=column').then(function (response) {
            if (response.data.result == 1) {
                const column = [];
                response.data.typelist.map(item => {
                    column.push({
                        key:item.id,
                        column:item.column
                    })
                })
                self.setState({
                    column: column,
                    columnLoading: false,
                })
            } else {
                self.setState({
                    columnLoading: false,
                })
                message.error(response.data.error?response.data.error+'<br>获取期刊栏目列表失败，请稍候重试！':'获取期刊栏目列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.setState({
                columnLoading: false,
            });
            message.error('连接失败，请稍候重试！');
        });
    }

    getContent = (year) => {
        const self = this;
        self.setState({
            periodicalLoading: true,
        });
        axios.get('/admin/getcontent/year='+year).then(function (response) {
            if (response.data.result == 1) {
                const periodical = [];
                for(let i=0;i<response.data.ddl.length;i++){
                    periodical.push({
                        key:i+1,
                        year:year,
                        datePub:response.data.ddl[i]?new Date(response.data.ddl[i]):null,
                        maxNum:response.data.num[i],
                    })
                }
                self.setState({
                    periodical:periodical,
                    periodicalLoading: false,
                    cachePeriodical: periodical.map(item => ({ ...item })),
                });
            } else {
                self.setState({
                    periodicalLoading: false,
                });
                message.error(response.data.error?response.data.error+'<br>获取期刊设置列表失败，请稍候重试！':'获取期刊设置列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            console.log(e);
            self.setState({
                periodicalLoading: false,
            });
            message.error('连接失败，请稍候重试！');
        });
    }

    componentWillMount(){
        const self = this;
        const getAcademicsec = new Promise((resolve, reject) => {
            axios.get('/common/gettype/type=academicsec').then(function (response) {
                if (response.data.result == 1) {
                    const academicsec = [];
                    response.data.typelist.map(item => {
                        academicsec.push({
                            key:item.id,
                            academicsec:item.academicsec
                        })
                    })
                    self.setState({
                        academicsec: academicsec,
                        academicsecLoading: false,
                        cacheAcademicsec: academicsec.map(item => ({ ...item })),
                    })
                } else {
                    self.setState({
                        academicsecLoading: false,
                    })
                    message.error(response.data.error?response.data.error+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            })
        });
        const getColumn = new Promise((resolve, reject) => {
            axios.get('/common/gettype/type=column').then(function (response) {
                if (response.data.result == 1) {
                    const column = [];
                    response.data.typelist.map(item => {
                        column.push({
                            key:item.id,
                            column:item.column
                        })
                    })
                    self.setState({
                        column: column,
                        columnLoading: false,
                        cacheColumn: column.map(item => ({ ...item })),
                    })
                } else {
                    self.setState({
                        columnLoading: false,
                    })
                    message.error(response.data.error?response.data.error+'<br>获取期刊栏目列表失败，请稍候重试！':'获取期刊栏目列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
        const getStandard = new Promise((resolve, reject) => {
            axios.get('/admin/getstandardlist').then(function (response) {
                if (response.data.result == 1) {
                    let standard = new Date().getFullYear();
                    response.data.standardlist.some(item => {
                        if(item.year == response.data.year){
                            standard = item;
                            return true;
                        }
                    });
                    const periodicalTypes = [{
                        value: parseInt(standard.year),
                        label: parseInt(standard.year),
                        children: [{
                            value: 4,
                            label: '季刊',
                            disabled: standard.standard!=4,
                        },{
                            value: 6,
                            label: '双月刊',
                            disabled: standard.standard!=6,
                        },{
                            value: 12,
                            label: '月刊',
                            disabled: standard.standard!=12,
                        }],
                    }, {
                        value: parseInt(standard.year)+1,
                        label: parseInt(standard.year)+1,
                        children: [{
                            value: 4,
                            label: '季刊',
                        },{
                            value: 6,
                            label: '双月刊',
                        },{
                            value: 12,
                            label: '月刊',
                        }],
                    }];
                    self.setState({
                        newsroomInfo:response.data.standardlist,
                        periodicalTypes: periodicalTypes,
                        periodicalType: [standard.year,standard.standard],
                        reviewFee: standard.reviewfee?standard.reviewfee:0,
                        pageCharges: standard.pagecharges?standard.pagecharges:0,
                        articleNum: standard.articlenum?standard.articlenum:0,
                        toYear:standard.year,
                        contentYear:standard.year,
                    });
                    axios.get('/admin/getcontent/year='+standard.year).then(function (response) {
                        if (response.data.result == 1) {
                            const periodical = [];
                            for(let i=0;i<response.data.ddl.length;i++){
                                periodical.push({
                                    key:i+1,
                                    year:standard.year,
                                    datePub:response.data.ddl[i]?new Date(response.data.ddl[i]):null,
                                    maxNum:response.data.num[i],
                                })
                            }
                            self.setState({
                                periodical:periodical,
                                periodicalLoading: false,
                                cachePeriodical: periodical.map(item => ({ ...item })),
                            });
                        } else {
                            self.setState({
                                periodicalLoading: false,
                            });
                            message.error(response.data.error?response.data.error+'<br>获取期刊设置列表失败，请稍候重试！':'获取期刊设置列表失败，请稍候重试！');
                        }
                    }).catch(function () {
                        self.setState({
                            periodicalLoading: false,
                        });
                        message.error('连接失败，请稍候重试！');
                    });
                } else {
                    message.error(response.data.error?response.data.error+'<br>获取默认配置失败，请稍候重试！':'获取默认配置失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
        Promise.all([getAcademicsec,getColumn,getStandard]).catch((e) =>{
            console.log(e);
            self.setState({
                academicsecLoading: false,
                columnLoading: false,
            });
            message.error('连接失败，请稍候重试！');
        })
    }

    render(){
    	const { periodicalLoading, academicsecLoading, periodical, academicsec, column, confirmLoading, columnLoading, operationArg, visibleDelete, visibleSave, visibleBasisSave, visibleCancel, visibleConfirmAdd, visibleAdd, newsroomInfo, periodicalTypes, periodicalType, reviewFee, pageCharges, articleNum, contentYear } = this.state;

        return(
			<div>
				<Tabs animated={false} tabPosition="top" defaultActiveKey='0' style={{paddingTop:'1rem'}}>
					<TabPane tab="默认配置" key="0">
                        <div id="standardDiv">
                            <span>
                                期刊类型：
                                <Cascader
                                    allowClear={false}
                                    options={periodicalTypes}
                                    value={periodicalType}
                                    expandTrigger="hover"
                                    placeholder=""
                                    onChange={(value) => this.itemChange(value, 'periodicalType')}
                                    style={{ minWidth: '7rem' }}
                                />
                            </span>
                            <span>
                                审稿费：
                                <InputNumber
                                    min={0}
                                    value={reviewFee}
                                    style={{ minWidth: '7rem' }}
                                    onChange={(value) => this.itemChange(value, 'reviewFee')}
                                />
                            </span>
                            <span>
                                版面费：
                                <InputNumber
                                    min={0}
                                    value={pageCharges}
                                    style={{ minWidth: '7rem' }}
                                    onChange={(value) => this.itemChange(value, 'pageCharges')}
                                />
                            </span>
                            <span>
                                文章数量上限：
                                <InputNumber
                                    min={0}
                                    value={articleNum}
                                    style={{minWidth: '7rem'}}
                                    onChange={(value) => this.itemChange(value, 'articleNum')}
                                />
                            </span>
                            <Button type="primary" onClick={() => this.modalOpen('basisSave')}>保存</Button>
                        </div>
                        <Divider>期刊设置</Divider>
                        <p>
                            <Select
                                value={contentYear}
                                onChange={this.contentYearChange}>
                                {newsroomInfo.reverse().map(item => (<Option value={item.year}>{item.year} 年</Option>))}
                            </Select>
                        </p>
                        <Table
                            pagination={false}
                            loading={periodicalLoading}
                            columns={this.columnsPeriodical}
                            dataSource={periodical}
                            bordered
                            scroll={{ x: '43rem' }} />
					</TabPane>
					<TabPane tab="学术领域" key="1">
						<Button type="primary" className="adminBasisAddBtn" onClick={() => this.modalOpen('add','','academicsec')}>添加学术领域</Button>
						<Table
							loading={academicsecLoading}
							columns={this.columnsAcademicsec}
							dataSource={academicsec}
							bordered scroll={{ x: '19rem' }}
						/>
					</TabPane>
					<TabPane tab="期刊栏目" key="2">
						<Button type="primary" className="adminBasisAddBtn" onClick={() => this.modalOpen('add','','column')}>添加期刊栏目</Button>
						<Table
							loading={columnLoading}
							columns={this.columnsColumn}
							dataSource={column}
							bordered scroll={{ x: '19rem' }}
						/>
					</TabPane>
				</Tabs>
                <Modal
                    visible={visibleBasisSave}
                    maskClosable = {false}
                    onCancel={this.modalClose}
                    title="保存确认"
                    footer={[
                        <Button key="submit" type="primary" size="large" onClick={this.basisSave} loading={confirmLoading}>
                            确定
                        </Button>,
                        <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
                >
                    <p>您确定要保存当前修改吗？</p>
                </Modal>
				<Modal
					visible={visibleDelete}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="提交确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.delete} loading={confirmLoading}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
				>
					<p>您确定要删除该数据吗？</p>
				</Modal>
				<Modal
					visible={visibleSave}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="保存确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.save} loading={confirmLoading}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
				>
					<p>您确定要保存该数据的修改吗？</p>
				</Modal>
				<Modal
					visible={visibleCancel}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="取消确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.cancel}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                    ]}
				>
					<p>您确定要取消修改并恢复该数据吗？</p>
				</Modal>
				<Modal
					visible={visibleConfirmAdd}
					maskClosable = {false}
					zIndex={1001}
					onCancel={this.confirmClose}
					title="添加确认"
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.add}>
							确定
						</Button>,
						<Button key="back" size="large" onClick={this.confirmClose}>取消</Button>
                    ]}
				>
					<p>您确定要添加该数据吗？</p>
				</Modal>
				<Modal
					visible={visibleAdd}
					maskClosable = {false}
					onCancel={this.modalClose}
					title="添加"
					footer={null}
				>
					<BasisAddForm
						confirmLoading={confirmLoading}
						addSubmit={(fields) => this.modalOpen('confirmAdd',fields)}
						addCancel={this.modalClose}
						operationArg={operationArg}
					/>
				</Modal>
			</div>
        )
    }
}

class AdminCenter extends Component{
    constructor () {
        super();
        this.state = {
            selectedKeys: "1",
        }
    }

    menuSelect = (e) => {
        this.setState({
            selectedKeys: e.key,
        });
        sessionStorage.setItem("adminCenterKey",e.key);
	}

    componentWillMount(){
    	if(sessionStorage.getItem("adminCenterKey")) {
            this.setState({
                selectedKeys: sessionStorage.getItem("adminCenterKey"),
            });
        }
	}

	render() {
		return (
			<Layout>
		    	<Header />
		        <Layout className="centerLayout">
					<Sider className="centerSider">
						<Menu
							mode="inline"
							inlineCollapsed = "false"
							selectedKeys={[this.state.selectedKeys]}
							className="centerMenu"
							onSelect={this.menuSelect}
						>
							<MenuItemGroup key="i1" title={<span><Icon type="bars" /></span>}>
								<Menu.Item key="1">公告管理</Menu.Item>
								<Menu.Item key="2">基础数据</Menu.Item>
								<Menu.Item key="3">账号管理</Menu.Item>
							</MenuItemGroup>
							{/*<MenuItemGroup key="i2" title={<span><Icon type="user" /><span>个人设置</span></span>}>
								<Menu.Item key="4">修改密码</Menu.Item>
							</MenuItemGroup>*/}
						</Menu>
			        </Sider>
					<Content className="centerContent">
                        {this.state.selectedKeys === "1" ? <Announcement /> : null}
                        {this.state.selectedKeys === "2" ? <Basis /> : null}
                        {this.state.selectedKeys === "3" ? <Account /> : null}
			        </Content>
		      	</Layout>
		    </Layout>
		);
	}
}

export default AdminCenter;