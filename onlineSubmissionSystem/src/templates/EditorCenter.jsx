/**
 * Created by lixiwei on 2018/4/3.
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Button, Upload, message, Modal, Input, Select, Form, Row, Col, Table, InputNumber, Tree, Tag } from 'antd';
import axios from 'axios';
import { getInvoiceState,getTaskState,downloadFile,info,error,setDateFormat } from './judgeTask';
import Header from './Header';
import '../css/EditorCenter.css';

const { Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class Record extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            visibleSubSum: false,
            visibleSubPro: false,
            visibleSubFirst: false,
            visibleProfessor: false,
            operationArg: null,
            modalContent: '',
            unfinishedLoading: true,
            finishedLoading: true,
            expandedRowKeys: [],
            expandedKeys: [],
            selectedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            fileList: {},
            professors: [],
            authors: [],
            academicsecList: [],
            professorId: '',
            professorName: '',
            professorGender: '',
            professorAcademicsec: '',
            isPrefer: false,
            dataUnfinished: [],
            dataFinished: [],
            currentUnfinished: 1,
            totalUnfinished: 1,
            currentFinished: 1,
            totalFinished: 1,
            pageSize: 10,
        };
        this.columnsUnfinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
            render: (text, record) => {
                const {academicsecList} = this.state;
                let academicsec = text;
                academicsecList.some(item => {
                    if(text == item.id){
                        academicsec = item.academicsec;
                        return true;
                    }
                })
                return academicsec;
            }
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
            width: '7rem',
            render: (text, record) => (<span>{setDateFormat(text)}</span>)
        }, {
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
            width: '9rem',
            render: (text, record) => {
                const data = [...this.state.dataUnfinished];
                let n;
                data.map((obj,index) => {
                    if (record.key == obj.key) {
                        n  = index;
                    }
                });
                return(
                    <span>
                        {
                            record.oldState === '待初审' ?
                                < Select
                                    value={this.state.dataUnfinished[n].thesisState}
                                    style={{ width: '6.5rem' }}
                                    onChange={(value, options) => this.thesisStateChange(value, options, record.key)}
                                >
                                    <Option value={2}>不通过</Option>
                                    <Option value={0}>初审通过</Option>
                                </Select >
                            : null
                        }
                        {
                            record.oldState === '已审阅' ?
                                < Select
                                    value={this.state.dataUnfinished[n].thesisState}
                                    style={{ width: '6.5rem' }}
                                    onChange={(value, options) => this.thesisStateChange(value, options, record.key)}
                                >
                                    <Option value={2}>不通过</Option>
                                    <Option value={3}>重审</Option>
                                    <Option value={5}>格式修改</Option>
                                    <Option value={4}>通过</Option>
                                </Select >
                                : null
                        }
                        {record.oldState === '格式修改' || record.oldState === '待分配' || record.oldState === '重审分配' ? text : null}
                    </span>
                )},
        }, {
            title: '审稿人',
            dataIndex: 'professors',
            key: 'professors',
            render: (text, record) => {
                const data = [...this.state.dataUnfinished];
                const professors = [];
                let n;
                data.map((obj,index) => {
                    if (record.key == obj.key) {
                        n  = index;
                    }
                });
                record.professors.map(item => {
                    professors.push(item.name)
                })
                return(
                    <span>
                        {
                            record.oldState === '待分配' || record.oldState === '重审分配' ?
                                <span>
                                        {professors.join("、")}
                                        <span className="ant-divider" />
                                        <Button size="small" shape="circle" icon="plus" title="修改分配的审稿人" onClick={() => this.proModalOpen(record.key,record.oldState,record)}/>
                                </span>
                            : (text.length !== 0 ? [text[0].name,text[1].name,text[2].name].join("、") : null)
                        }
                    </span>
            )},
        }, {
            title: '操作',
            key: 'action',
            width: '25rem',
            render: (text, record) => (
                <span>
                    <Button onClick={() => this.receiptChange(record)} title="查看审稿人意见，填写审阅总结">审阅意见</Button>
					<span className="ant-divider" />
					<Button onClick={() => info('下载', record, true)} title="下载论文和附件">下载</Button>
					<span className="ant-divider" />
					<Upload
                        showUploadList={false}
                        beforeUpload = {(file) => this.beforeUpload(record.key,file)}
                    >
						{
                            this.state.fileList[record.key] !== undefined ?
                                <Button>
                                    <Icon type="upload" /> {this.state.fileList[record.key].name}
                                </Button>
                                :
                                <Button disabled={record.oldState !== '格式修改'} title="上传排版格式修改后的论文">
                                    <Icon type="upload" />上传
                                </Button>
                        }
					  </Upload>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen(record.key,record.oldState,record)}>提交</Button>
				</span>
            ),
        }];
        this.columnsFinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
            render: (text, record) => {
                const {academicsecList} = this.state;
                let academicsec = text;
                academicsecList.some(item => {
                    if(text == item.id){
                        academicsec = item.academicsec;
                        return true;
                    }
                })
                return academicsec;
            }
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
            render: (text, record) => (<span>{setDateFormat(text)}</span>)
        }, {
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }];
    }

    thesisStateChange = (value, options, key) => {
        const newData1 = [...this.state.dataUnfinished];
        const newData2 = [...this.state.expandedRowKeys].filter(item => item !== key);
        const target = newData1.filter(item => key === item.key)[0];
        target['thesisState'] = value;
        this.setState({ dataUnfinished: newData1 });
        if(value !== 3){
            this.setState({
                expandedRowKeys: newData2,
            })
        }
    }

    receiptChange = (record) => {
        const oldData = [...this.state.expandedRowKeys];
        const key = record.key;
        let needOpen = true;
        oldData.map((str) => {
            if (key == str) {
                needOpen = false;
            }
        });
        if (needOpen){
            const newData = [...this.state.expandedRowKeys, key];
            this.setState({
                expandedRowKeys: newData,
            })
        }
        
    }

    beforeUpload = (key,file) => {
        const files = this.state.fileList;
        const fileType = file.name.split(".").pop();
        if (fileType !== 'doc' && fileType !== 'docx' && fileType !== 'pdf') {
            message.error('稿件文件格式错误，请上传doc、docx或pdf');
        }else {
            files[key] = file;
            this.setState({
                fileList: files,
            });
        }
        return false;
    }

    submitFirst = () => {
        const { dataUnfinished, operationArg } = this.state;
        const self = this;
        operationArg[2].task.stat = operationArg[2].thesisState === 0 ? 0 : 2;
        operationArg[2].task.content = operationArg[2].task.content?operationArg[2].task.content:null;
        axios.post('/contribute/task/judge', {
            task:operationArg[2].task,
        }).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                });
                message.success('提交成功！');
            }else{
                error("失败",response.data.data?response.data.data+'<br>初审提交失败，请稍候重试！':'初审提交失败，请稍候重试！');
            }
        }).catch(function () {
            error("失败", '连接失败，请稍候重试！');
        });
    }

    submitSummary = () => {
        const { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        const self = this;
        operationArg[2].task.content = operationArg[2].suggestions[3];
        this.setState({
            confirmLoading: true,
        });

        if (operationArg[1] !== '格式修改'){
            switch (operationArg[2].thesisState) {
                case 2:
                    operationArg[2].task.stat = 2;
                    break;
                case 3:
                    operationArg[2].task.stat = 3;
                    operationArg[2].task.content = operationArg[2].suggestions[3];
                    break;
                case 4:
                    operationArg[2].task.stat = 4;
                    if(!operationArg[2].task.content){
                        operationArg[2].task.content = '无'
                    }
                    break;
                default:
                    operationArg[2].task.stat = 5;
                    if(!operationArg[2].task.content){
                        operationArg[2].task.content = '无'
                    }
                    break;
            }
            axios.post('/contribute/task/analyze', {
                task:operationArg[2].task
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.modalClose();
                    self.setState({
                        confirmLoading: false,
                        dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                    });
                    if(operationArg[2].task.stat === 3){
                        self.sendEmail(3);
                    }
                    message.success('提交成功！',2,()=>{
                        self.getTask(0,self.state.current);
                    });
                } else {
                    self.modalClose();
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",response.data.data?response.data.data+'<br>提交失败，请稍候重试！':'提交失败，请稍候重试！');
                }
            }).catch(function () {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error('连接失败，请稍候重试！');
            })
        }else{
            formData.append('file', fileList[operationArg[0]]);
            formData.append("all", JSON.stringify({task:operationArg[2].task}));
            this.setState({
                confirmLoading: true,
            });

            axios.post('/contribute/task/design', formData).then(function (response) {
                if(response.data.result == 1) {
                    self.modalClose();
                    delete fileList[operationArg[0]];
                    self.setState({
                        fileList: fileList,
                        confirmLoading: false,
                        dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                    });
                    self.sendEmail(5);
                    message.success('格式修改确认提交成功！',2,()=>{
                        self.getTask(0,self.state.current);
                    });
                }else{
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",response.data.data?response.data.data+'<br>提交失败，请稍候重试！':'提交失败，请稍候重试！');
                }
            }).catch(function (e) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                console.log(e);
                error("失败", '连接失败，请稍候重试！');
            });
        }
    }

    submitProfessors = () => {
        const { dataUnfinished, operationArg } = this.state;
        const self = this;
        const professors = [];
        operationArg[2].professors.map(item => {
            professors.push(item.id)
        });
        axios.post('/contribute/task/judge', {
            task:operationArg[2].task,
            id_role:professors,
        }).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                });
                self.sendEmail(0);
                message.success('提交成功！');
            }else{
                error("失败",response.data.data?response.data.data+'<br>审稿人分配提交失败，请稍候重试！':'审稿人分配提交失败，请稍候重试！');
            }
        }).catch(function () {
            error("失败", '连接失败，请稍候重试！');
        });
    }

    professorDelete = (id) => {
        const { operationArg } = this.state;
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => operationArg[0] === item.key)[0];
        target.professors = target.professors.filter(professor => professor.id !== id);
        this.setState({ dataUnfinished: newData });
    }

    sendEmail = (stat) => {
        const { operationArg,authors,professors } = this.state;
        const self = this;
        //0：审稿人审稿通知；3：作者修改稿件通知；5：作者格式修改确认通知
        switch (stat){
            case 0:
                operationArg[2].professors.map(pro =>{
                    professors.some(item => {
                        if(pro.id == item.id){
                            const to = item.username;
                            axios({
                                method: 'post',
                                url: '/mail/sendmail',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded',
                                },
                                params: {
                                    to: to,
                                    title: '编辑部投审通知',
                                    content: '您好！有新的稿件《' + operationArg[2].title + '》需要您进行审阅，请在系统中提交审阅意见。',
                                },
                            }).then(function (response) {
                                if(response.data.result == 1){
                                    message.success('通知邮件发送成功！');
                                }else{
                                    message.error('通知邮件发送失败！');
                                }
                            }).catch(function (e) {
                                console.log(e);
                                message.error('连接失败，无法发送通知邮件！');
                            });
                            return true;
                        }
                    });
                })
                break;
            case 3:
                authors.some(author => {
                    if(author.id == operationArg[2].writerId){
                        const to = author.email;
                        axios({
                            method: 'post',
                            url: '/mail/sendmail',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded',
                            },
                            params: {
                                to: to,
                                title: '编辑部投审通知',
                                content: '你好！你的稿件《' + operationArg[2].title + '》经过审阅后需要按要求修改部分内容，请在系统中提交修改后的稿件。',
                            },
                        }).then(function (response) {
                            if(response.data.result == 1){
                                message.success('通知邮件发送成功！');
                            }else{
                                message.error('通知邮件发送失败！');
                            }
                        }).catch(function (e) {
                            console.log(e);
                            message.error('连接失败，无法发送通知邮件！');
                        });
                        return true;
                    }
                });
                break;
            case 5:
                authors.some(author => {
                    if(author.id == operationArg[2].writerId){
                        const to = author.email;
                        axios({
                            method: 'post',
                            url: '/mail/sendmail',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded',
                            },
                            params: {
                                to: to,
                                title: '编辑部投审通知',
                                content: '你好！你的稿件《' + operationArg[2].title + '》已经通过了内容审阅，根据发布要求，编辑对稿件的排版格式进行了修改。若确定格式内容无误，请在系统中提交通过。若发现编辑误改了稿件内容，请在系统中提交拒绝并及时联系我们。',
                            },
                        }).then(function (response) {
                            if(response.data.result == 1){
                                message.success('通知邮件发送成功！');
                            }else{
                                message.error('通知邮件发送失败！');
                            }
                        }).catch(function (e) {
                            console.log(e);
                            message.error('连接失败，无法发送通知邮件！');
                        });
                        return true;
                    }
                });
                break;
            default:
                break;
        }
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    proTagClick = (pro) =>{
        this.setState({
            selectedKeys: [pro.id],
            professorId: pro.id,
            professorName: pro.name,
            professorGender: pro.gender,
            professorAcademicsec: pro.academicsec,
        });
    }

    treeNodeSelect = (key,e) => {
        const { academicsecList, expandedKeys } = this.state;
        if(e.node.props.children){
            if(!expandedKeys.some(item => item == key[0])){
                expandedKeys.push(key[0]);
                this.onExpand(expandedKeys);
            }else{
                this.onExpand(expandedKeys.filter(item => item != key[0]));
            }
        }else{
            academicsecList.some(item => item.professors.some(pro => {
                if(pro.id == e.node.props.eventKey){
                    this.setState({
                        selectedKeys: [pro.id],
                        professorId: pro.id,
                        professorName: pro.name,
                        professorGender: pro.gender,
                        professorAcademicsec: pro.academicsec,
                        isPrefer: false,
                    });
                    return true
                }else{
                    return false;
                }
            }))
        }
    }

    professorSearch = (e) => {
        const value = e.target.value;
        const { academicsecList } = this.state;
        const expandedKeys = academicsecList.map((item) => {
            if(item.professors.some(professor => professor.name.indexOf(value) > -1)){
                return "pro" + item.id;
            }
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    preferProfessor = () =>{
        const { operationArg, professorId, professorName, professorGender, professorAcademicsec } = this.state;
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => operationArg[0] === item.key)[0];
        if(professorId == ''){
            error("失败", '添加失败，审稿人信息不能为空！');
        }else if(operationArg[2].professors.length === 3){
            error("失败", '添加失败，审稿人最多为三名！');
        }else if(!operationArg[2].professors.some(item => item.id == professorId)){
            target.professors.push({
                id: professorId,
                name: professorName,
                gender: professorGender,
                academicsec: professorAcademicsec,
            });
            this.setState({
                dataUnfinished: newData,
                professorId: '',
                professorName: '',
                professorGender: '',
                professorAcademicsec: '',
                isPrefer: false,
            })
            message.success('审稿人添加成功！');
        }else if(operationArg[2].professors.some(item => item.id == professorId)){
            info('提示', '审稿人添加重复！');
        }
    }

    proModalOpen = (...arg) => {
        this.setState({
            operationArg: arg,
            visibleProfessor: true,
        });
    }

    modalOpen = (...arg) => {
        let {fileList} = this.state;
        if (arg[2].thesisState === '') {
            error("失败", '提交失败，请确认稿件状态的选择是否完成！');
        } else if ((arg[1] === '待分配' || arg[1] === '重审分配') && arg[2].professors.length !== 3) {
            error("失败", '提交失败，请确认三位审稿人的选择是否完成！');
        } else if (arg[2].thesisState == 3 && arg[2].suggestions[3] === '') {
            error("失败", '提交失败，请确认该稿件的审阅总结不为空！');
        } else if (arg[1] == '格式修改' && !fileList[arg[0]]) {
            error("失败", '提交失败，请确认修改格式的文件选择是否完成！');
        } else if (arg[1] === '待初审') {
            switch (arg[2].thesisState) {
                case 6:
                    this.setState({
                        modalContent: '您确定该稿件初审通过吗？',
                        operationArg: arg,
                        visibleSubFirst: true,
                    });
                    break;
                default:
                    this.setState({
                        modalContent: '您确定要拒绝该论文的投稿吗？',
                        operationArg: arg,
                        visibleSubFirst: true,
                    });
                    break;
            }
        }else if (arg[1] === '待分配' || arg[1] === '重审分配'){
            this.setState({
                modalContent: '您确定要提交该稿件的审稿人安排吗？',
                operationArg: arg,
                visibleSubPro: true,
            });
        }else if (arg[1] === '格式修改'){
            this.setState({
                modalContent: '您确定要提交该稿件的格式修改要求吗？',
                operationArg: arg,
                visibleSubSum: true,
            });
        }else{
            switch (arg[2].thesisState) {
                case 3:
                    this.setState({
                        modalContent: '您确定要提交该稿件的审阅总结吗？',
                        operationArg: arg,
                        visibleSubSum: true,
                    });
                    break;
                case 5:
                    this.setState({
                        modalContent: '您确定该稿件需要进行格式修改吗？',
                        operationArg: arg,
                        visibleSubSum: true,
                    });
                    break;
                case 4:
                    this.setState({
                        modalContent: '您确定要最终通过该论文的投稿吗？',
                        operationArg: arg,
                        visibleSubSum: true,
                    });
                    break;
                default:
                    this.setState({
                        modalContent: '您确定要拒绝该论文的投稿吗？',
                        operationArg: arg,
                        visibleSubSum: true,
                    });
                    break;
            }
        }
    }

    downloadOpen = (task) =>{
        this.download(task);
    }

    modalClose = () => {
        this.setState({
            visibleSubSum: false,
            visibleSubPro: false,
            visibleSubFirst: false,
            visibleProfessor: false,
        });
    }

    getTask = (flag,page) =>{
        const self = this;
        this.setState({
            unfinishedLoading: true,
            finishedLoading: true,
        });
        axios({
            method: 'post',
            url: '/contribute/task',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            params: {
                stat:0,
                flag:flag,
                page:page,
            },
        }).then(function (response) {
            console.log('success');
            if (response.data.result == 1) {
                const dataUnfinished = [];
                const dataFinished = [];
                const data = response.data.data;
                const {professors} = self.state;

                data.article.map(article => {
                    if (flag == 0) {
                        data.task.some(task => {
                            if (article.id == task.id_article) {
                                let suggestions = null;
                                if(task.content && task.content.indexOf(";") !== -1){
                                    const sugs = task.content.split(";");
                                    suggestions = [sugs[0].split(":")[1], sugs[1].split(":")[1], sugs[2].split(":")[1], ""];
                                }else if(task.content){
                                    suggestions = ["","","",task.content];
                                }else{
                                    suggestions = ["","","",null];
                                }
                                dataUnfinished.push({
                                    key: article.id,
                                    writerId:article.writer_id,
                                    title: article.title,
                                    academicsec: article.academicsec,
                                    submitDate: article.date_sub,
                                    oldState: getTaskState(task),
                                    thesisState: getTaskState(task) === '格式修改' || getTaskState(task) === '待分配' || getTaskState(task) === '重审分配' ? getTaskState(task) : '',
                                    suggestions: suggestions,
                                    professors: [],
                                    preferPro: article.writer_prefer,
                                    avoidPro: article.writer_avoid,
                                    article:article,
                                    task: task,
                                });
                                return true;
                            }
                        })
                        data.professor.map(professor => {
                            dataUnfinished.some(item => {
                                if (item.task.id == professor[3]) {
                                    professors.some(pro => {
                                        if (professor[0] == pro.id || professor[1] == pro.id || professor[2] == pro.id) {
                                            item.professors.push(pro);
                                        }
                                    })
                                    return true;
                                }
                            })
                        })
                    } else {
                        const unfinishedTask = data.task.reverse();
                        unfinishedTask.some(task => {
                            if (article.id == task.id_article) {
                                // const suggestions = task.content?task.content.split(";"):[":",":",":"];
                                dataFinished.push({
                                    key: article.id,
                                    title: article.title,
                                    academicsec: article.academicsec,
                                    submitDate: article.date_sub,
                                    oldState: getTaskState(task),
                                    thesisState: getTaskState(task),
                                    // suggestions: [],
                                    professors: [],
                                    preferPro: article.writer_prefer,
                                    avoidPro: article.writer_avoid,
                                    task: task,
                                });
                                return true;
                            }
                        })
                        data.professor.map(professor => {
                            dataFinished.some(item => {
                                if (item.task.id == professor[3]) {
                                    professors.some(pro => {
                                        if (professor[0] == pro.id || professor[1] == pro.id || professor[2] == pro.id) {
                                            item.professors.push(pro);
                                        }
                                    })
                                    return true;
                                }
                            })
                        })
                    }
                })
                if(flag==0) {
                    self.setState({
                        unfinishedLoading: false,
                        dataUnfinished: dataUnfinished,
                        totalUnfinished: data.total,
                        currentUnfinished: page,
                    })
                }else{
                    self.setState({
                        finishedLoading: false,
                        dataFinished: dataFinished,
                        totalFinished: data.total,
                        currentFinished: page,
                    })
                }
            } else {
                self.setState({
                    unfinishedLoading: false,
                    finishedLoading: false,
                })
                error("失败",response.data.data?response.data.data+'<br>获取稿件任务列表失败，请稍候重试！':'获取稿件任务列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            self.setState({
                unfinishedLoading: false,
                finishedLoading: false,
            })
            console.log(e);
            message.error('连接失败，请稍候重试！');
        });
    }

    componentWillMount(){
        const self = this;
        const getProfessorsAndAcademicsec = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "professors"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    const professors = response.data.data;
                    self.setState({
                        professors: professors
                    })
                    axios.post('/contribute/task/resource', {
                        resource: {
                            func: "type_academicsec"
                        }
                    }).then(function (response) {
                        if (response.data.result == 1) {
                            const academicsecList = response.data.data;
                            for (let i = 0; i < academicsecList.length; i++) {
                                academicsecList[i]['professors'] = [];
                            }
                            professors.map(item => {
                                academicsecList.some(academicsec => {
                                    switch (academicsec.id) {
                                        case item.academicsec1:
                                            academicsec.professors.push({
                                                id: item.id,
                                                name: item.name,
                                                gender: item.gender == 1 ? '男' : '女',
                                                academicsecId: academicsec.id,
                                                academicsec: academicsec.academicsec,
                                            })
                                            break;
                                        case item.academicsec2:
                                            academicsec.professors.push({
                                                id: item.id,
                                                name: item.name,
                                                gender: item.gender == 1 ? '男' : '女',
                                                academicsecId: academicsec.id,
                                                academicsec: academicsec.academicsec,
                                            })
                                            break;
                                        case item.academicsec3:
                                            academicsec.professors.push({
                                                id: item.id,
                                                name: item.name,
                                                gender: item.gender == 1 ? '男' : '女',
                                                academicsecId: academicsec.id,
                                                academicsec: academicsec.academicsec,
                                            })
                                            break;
                                        default:
                                            break;
                                    }
                                })
                            })
                            self.setState({
                                academicsecList: academicsecList,
                            })
                        } else {
                            message.error(response.data.data?response.data.data+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                        }
                        resolve();
                    }).catch(function (e) {
                        console.log(e);
                        reject();
                    })
                } else {
                    resolve();
                    message.error(response.data.data?response.data.data+'<br>获取审稿人列表失败，请稍候重试！':'获取审稿人列表失败，请稍候重试！');
                }
                self.getTask(0,1);
            }).catch(function (e) {
                console.log(e);
                reject();
            })
        })
        const getAuthor = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "authors"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        authors: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取作者信息失败，请稍候重试！':'获取作者信息失败，请稍候重试！');
                }
                resolve();
            }).catch(function (e) {
                console.log(e);
                reject();
            })
        });
        Promise.all([getProfessorsAndAcademicsec,getAuthor]).catch(() =>{
            self.setState({
                unfinishedLoading: false,
                finishedLoading: false,
            })
            message.error('连接失败，请稍候重试！');
        })
    }

    tagsChange = (key) => {
        this.setState({
            expandedRowKeys:[],
            unfinishedLoading: true,
            finishedLoading: true,
        });
        this.getTask(key,key?this.state.currentFinished:this.state.currentUnfinished)
    }

    pageChange = (flag,page) => {
        this.getTask(flag,page);
    }

    render() {
        const { operationArg, searchValue, expandedKeys, selectedKeys, autoExpandParent, academicsecList, professorName, professorGender, professorAcademicsec } = this.state;
        const proTree = data => data.map((item) => {
            const index = item.name.indexOf(searchValue);
            const beforeStr = item.name.substr(0, index);
            const afterStr = item.name.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
          			{beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
				</span>
            ) : <span>{item.name}</span>;
            return <TreeNode key={item.id} title={title} />;
        })
        return (
            <Tabs animated={false} tabPosition="top" defaultActiveKey='0' className="centerTab" onChange={this.tagsChange}>
                <TabPane tab="未完成" key={0}>
                    <Table
                        pagination={{
                            pageSize: this.state.pageSize,
                            total:this.state.totalUnfinished,
                            current:this.state.currentUnfinished,
                            onChange: (page) => this.pageChange(0,page),
                        }}
                        loading={this.state.unfinishedLoading}
                        columns={this.columnsUnfinished}
                        expandedRowRender={record => {
                            class ExpandedRow extends Component {
                                checkError = (id) => {
                                    // Only show error after a field is touched.
                                    return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
                                }

                                render() {
                                    const { getFieldDecorator } = this.props.form;
                                    return (
                                        <Form>
                                            <div>
                                                审阅意见一：
                                                <p>
                                                    {record.suggestions[0]?record.suggestions[0]:"无"}
                                                </p>
                                                审阅意见二：
                                                <p>
                                                    {record.suggestions[1]?record.suggestions[1]:"无"}
                                                </p>
                                                审阅意见三：
                                                <p>
                                                    {record.suggestions[2]?record.suggestions[2]:"无"}
                                                </p>
                                            </div>
                                            <FormItem
                                                validateStatus={this.checkError('summary') ? 'error' : ''}
                                                help={this.checkError('summary') || ''}
                                                label={(
                                                    <span>
                                                        审阅总结
                                                    </span>
                                                )}
                                            >
                                                {getFieldDecorator('summary', {
                                                    initialValue:`${record.suggestions[3]}`,
                                                    rules: [{ required: true, message: '审阅总结不能为空!', whitespace: true }],
                                                })(
                                                    <TextArea
                                                        autosize={{minRows:3}}
                                                        disabled={record.thesisState !== 3 && record.oldState !== '格式修改'}
                                                    />
                                                )}
                                            </FormItem>
                                        </Form>
                                    );
                                }
                            }
                            const ExpandedRowForm = Form.create({
                                onValuesChange(_, values) {
                                    record.suggestions[3] = values.summary;
                                },
                            })(ExpandedRow);
                            return (
                                <ExpandedRowForm record={record} onblur={() => this.handleCompleteInput(record)} />
                            )
                        }}
                        expandedRowKeys={this.state.expandedRowKeys}
                        expandIconAsCell={false}
                        expandIconColumnIndex={-1}
                        dataSource={this.state.dataUnfinished}
                        bordered
                        scroll={{ x: '51rem' }} />
                    <Modal
                        visible={this.state.visibleSubSum}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitSummary} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>{this.state.modalContent}</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleSubPro}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitProfessors} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>{this.state.modalContent}</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleSubFirst}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitFirst} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>{this.state.modalContent}</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleProfessor}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="分配审稿人"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.modalClose}>
                                确定
                            </Button>,
                        ]}
                    >
                        <div>
                            该稿件作者希望
                            <br/>
                            倾向的审稿人：{operationArg ? operationArg[2].preferPro : null}
                            <br/>
                            回避的审稿人：{operationArg ? operationArg[2].avoidPro : null}
                            <Search className="proSearch" placeholder="审稿人姓名" onChange={this.professorSearch} />
                            <div className="professorDiv">
                                <Tree
                                    onExpand={this.onExpand}
                                    expandedKeys={expandedKeys}
                                    selectedKeys={selectedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onSelect={this.treeNodeSelect}
                                    className="proDiv"
                                >
                                    {
                                        academicsecList.map((item) => (
                                            <TreeNode key={`pro${item.id}`} title={item.academicsec} >
                                                { proTree(item.professors) }
                                            </TreeNode>
                                        ))
                                    }
                                </Tree>
                                <div className="proDiv" id="proDetailDiv">
                                    <p>姓名：<span>{professorName}</span></p>
                                    <p>性别：<span>{professorGender}</span></p>
                                    <p>学术领域：<span>{professorAcademicsec}</span></p>
                                    <p>
                                        <Button type="primary" size="small" onClick={this.preferProfessor}>添加审稿人</Button>
                                    </p>
                                    <p id="selectedProP">
                                        已选择：
                                        <br/>
                                        {operationArg ? operationArg[2].professors.map((professor, index) => (
                                            <Tag key={professor.id} closable={true} afterClose={() => this.professorDelete(professor.id)}>
                                                {professor.name}
                                            </Tag>
                                        )) : null}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </TabPane>
                <TabPane tab="已完成" key={1}>
                    <Table
                        pagination={{
                            pageSize: this.state.pageSize,
                            total:this.state.totalFinished,
                            current:this.state.currentFinished,
                            onChange: (page) => this.pageChange(1,page),
                        }}
                        loading={this.state.finishedLoading}
                        columns={this.columnsFinished}
                        dataSource={this.state.dataFinished}
                        bordered
                        scroll={{ x: '1rem' }} />
                </TabPane>
            </Tabs>
        );
    }
}

class Payment extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            visible: false,
            modalContent: '',
            fileList: {},
            operationArg: null,
            unfinishedLoading: true,
            finishedLoading: true,
            expandedRowKeys: [],
            dataUnfinished: [],
            dataFinished: [],
            currentUnfinished: 1,
            totalUnfinished: 1,
            currentFinished: 1,
            totalFinished: 1,
            pageSize: 10,
            reviewFee: 0,
            pageCharges: 0,
            authors: [],
        };
        this.columnsUnfinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
            width: '7rem',
            render: (text, record) => (<span>{setDateFormat(text)}</span>)
        }, {
            title: '费用类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
            width: '7rem',
            render: (text, record) => {
                const data = [...this.state.dataUnfinished];
                let n;
                data.map((obj, index) => {
                    if (record.key == obj.key) {
                        n = index;
                    }
                });
                return (
                    <span>{
                        record.thesisState === '缴费安排' ?
                            text
                            :
                            < Select
                                value={this.state.dataUnfinished[n].result}
                                style={{ width: '6.5rem' }}
                                onChange={(value, options) => this.resultChange(value, options, record.key)}
                            >
                                <Option value={6}>缴费通过</Option>
                                <Option value={2}>重新缴费</Option>
                            </Select >
                    }</span>
                )
            }
        }, {
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
            width: '10rem',
            render: (text, record) => {
                const data = [...this.state.dataUnfinished];
                let n;
                data.map((obj, index) => {
                    if (record.key == obj.key) {
                        n = index;
                    }
                });
                return (
                    <span>{
                        record.thesisState === '缴费安排' ?
                            <InputNumber
                                min={0}
                                value={this.state.dataUnfinished[n].expense}
                                onChange={(value) => this.handleChange(value, record.key)}
                            />
                        :
                            text
                    }</span>
                )
            }
        }, {
            title: '操作',
            key: 'action',
            width: '17rem',
            render: (text, record) => {
                return(
                    <span>
						<Button onClick={() => this.receiptChange(record)} disabled={record.thesisState === '缴费安排'} title="查看发票内容要求">发票</Button>
                        <span className="ant-divider"/>
						<Button onClick={() => downloadFile(record.task, 2)} disabled={record.thesisState === '缴费安排'} title="下载缴费截图">下载</Button>
                        <span className="ant-divider"/>
						<Button type="primary" onClick={() => this.modalOpen(record)}>提交</Button>
					</span>
                )
            },
        }];
        this.columnsFinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
        },{
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
            render: (text, record) => (<span>{setDateFormat(text)}</span>)
        },{
            title: '发票抬头',
            dataIndex: 'receiptTitle',
            key: 'receiptTitle',
        },{
            title: '税号',
            dataIndex: 'receiptNum',
            key: 'receiptNum',
        },{
            title: '邮寄地址',
            dataIndex: 'address',
            key: 'address',
        },{
            title: '接收人',
            dataIndex: 'receiver',
            key: 'receiver',
        },{
            title: '费用类型',
            dataIndex: 'type',
            key: 'type',
            className: 'expandedRow'
        },{
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }];
    }

    resultChange = (value, options, key) => {
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => key === item.key)[0];
        target['result'] = value;
        this.setState({ dataUnfinished: newData });
    }

    handleChange = (value,key) => {
        const newData = this.state.dataUnfinished;
        const data = newData.filter(item => key == item.key)[0];
        if(value === undefined){
            value = 0
        }
        data['expense'] = value;
        this.setState({
            dataUnfinished: newData,
        })
    }

    receiptChange = (record) => {
        const oldData = [...this.state.expandedRowKeys];
        const key = record.key;
        let needOpen = true;
        oldData.map((str) => {
            if (key == str) {
                needOpen = false;
            }
        });
        if (needOpen){
            const newData = [...this.state.expandedRowKeys, key];
            this.setState({
                expandedRowKeys: newData,
            })
        }

    }

    submitPayment = () => {
        const dataUnfinished = this.state.dataUnfinished;
        const operationArg = this.state.operationArg;
        const self = this;
        this.setState({
            confirmLoading: true,
        });

        if(operationArg[0].thesisState === '缴费安排'){
            axios.post('/contribute/task/manage', {
                task:operationArg[0].task,
                invoice:{
                    id_article:operationArg[0].task.id_article,
                    flag:null,
                    receipt_title:null,
                    receipt_num:null,
                    address:null,
                    receiver:null,
                    type:operationArg[0].type === '审稿费'?1:2,
                    expense:operationArg[0].expense,
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.modalClose();
                    self.setState({
                        confirmLoading: false,
                        dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0].key)
                    });
                    self.sendEmail(operationArg[0].type === '审稿费'?0:1);
                    message.success('提交成功！');
                } else {
                    error("失败",response.data.data?response.data.data+'<br>提交失败，请稍候重试！':'提交失败，请稍候重试！');
                }
            }).catch(function (e) {
                console.log(e)
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败",'连接失败，请稍候重试！');
            })
        }else{
            operationArg[0].task.stat = operationArg[0].result;
            axios.post('/contribute/task/check', {
                task:operationArg[0].task,
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.modalClose();
                    self.setState({
                        confirmLoading: false,
                        dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0].key)
                    });
                    message.success('提交成功！');
                } else {
                    self.modalClose();
                    self.setState({
                        confirmLoading: false,
                    });
                    error("失败",response.data.data?response.data.data+'<br>提交失败，请稍候重试！':'提交失败，请稍候重试！');
                }
            }).catch(function (e) {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                console.log(e);
                error("失败",'连接失败，请稍候重试！');
            })
        }
    }

    sendEmail = (state) => {
        const { operationArg,authors,professors } = this.state;
        const self = this;
        //0：作者缴纳审稿费通知；1：作者缴纳版面费通知;
        switch (state){
            case 0:
                authors.some(author => {
                    if(author.id == operationArg[2].writerId){
                        const to = author.email;
                        axios({
                            method: 'post',
                            url: '/mail/sendmail',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded',
                            },
                            params: {
                                to: to,
                                title: '编辑部投审通知',
                                content: '你好！你的稿件《' + operationArg[2].title + '》已经通过初审，请及时缴纳审稿费并在系统中提交凭证。若重复收到该邮件，则可能缴费未通过，需要重新提交缴费凭证。',
                            },
                        }).then(function (response) {
                            if(response.data.result == 1){
                                message.success('通知邮件发送成功！');
                            }else{
                                message.error('通知邮件发送失败！');
                            }
                        }).catch(function (e) {
                            console.log(e);
                            message.error('连接失败，无法发送通知邮件！');
                        });
                        return true;
                    }
                });
                break;
            case 1:
                authors.some(author => {
                    if(author.id == operationArg[2].writerId){
                        const to = author.email;
                        axios({
                            method: 'post',
                            url: '/mail/sendmail',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded',
                            },
                            params: {
                                to: to,
                                title: '编辑部投审通知',
                                content: '你好！你的稿件《' + operationArg[2].title + '》已经完全通过审阅，请及时缴纳版面费并在系统中提交凭证。若缴费通过后，稿件将进入排期发布环节。若重复收到该邮件，则可能缴费未通过，需要重新提交缴费凭证。',
                            },
                        }).then(function (response) {
                            if(response.data.result == 1){
                                message.success('通知邮件发送成功！');
                            }else{
                                message.error('通知邮件发送失败！');
                            }
                        }).catch(function (e) {
                            console.log(e);
                            message.error('连接失败，无法发送通知邮件！');
                        });
                        return true;
                    }
                });
                break;
            default:
                break;
        }
    }

    modalOpen = (...arg) => {
        if(arg[0].thesisState === '缴费安排'){
            if(arg[0].expense == 0){
                error("失败", '提交失败，请确认该稿件的应缴金额必须大于0！');
            }else{
                this.setState({
                    operationArg: arg,
                    modalContent: '您确定要提交该缴费要求吗？',
                    visible: true,
                });
            }
        }else{
            switch(arg[0].result) {
                case 6:
                    this.setState({
                        operationArg: arg,
                        modalContent: '您确定该稿件缴费完成吗？',
                        visible: true,
                    });
                    break;
                case 2:
                    this.setState({
                        operationArg: arg,
                        modalContent: '您确定要该稿件重新缴费吗？',
                        visible: true,
                    });
                    break;
                default:
                    error("失败", '提交失败，请确认稿件缴费状态的选择是否完成！');
                    break;
            }
        }
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    getTask = (flag,page) =>{
        const self = this;
        this.setState({
            unfinishedLoading: true,
            finishedLoading: true,
        });
        axios({
            method: 'post',
            url: '/contribute/task',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            params: {
                stat:1,
                flag:flag,
                page:page,
            },
        }).then(function (response) {
            console.log('success');
            if (response.data.result == 1) {
                const dataUnfinished = [];
                const dataFinished = [];
                const data = response.data.data;
                const {reviewFee,pageCharges} = self.state;

                data.article.map(article => {
                    if (flag == 0) {
                        data.task.some(task => {
                            if (article.id == task.id_article) {
                                const item = {
                                    key: article.id,
                                    title: article.title,
                                    academicsec: article.academicsec,
                                    submitDate: article.date_sub,
                                    thesisState: getTaskState(task),
                                    expense: task.content?pageCharges:reviewFee,
                                    result: null,
                                    type: task.content?'版面费':'审稿费',
                                    receiptTitle: '',
                                    receiptNum: '',
                                    address: '',
                                    receiver: '',
                                    task: task,
                                    invoice: null,
                                };
                                data.invoice.some(invoice => {
                                    if (article.id == invoice.id_article) {
                                        item.type = invoice.type == 1 ? '审稿费' : '版面费';
                                        item.expense = invoice.expense;
                                        item.receiptTitle = invoice.receipt_title;
                                        item.receiptNum = invoice.receipt_num;
                                        item.address = invoice.address;
                                        item.receiver = invoice.receiver;
                                        item.invoice = invoice;
                                        return true;
                                    }
                                });
                                dataUnfinished.push(item);
                                return true;
                            }
                        })
                    } else {
                        data.invoice.map(invoice => {
                            if (article.id == invoice.id_article) {
                                data.task.some(task => {
                                    if (article.id == task.id_article) {
                                        dataFinished.push({
                                            key: article.id,
                                            title: article.title,
                                            academicsec: article.academicsec,
                                            submitDate: article.date_sub,
                                            thesisState: getInvoiceState(task),
                                            expense: invoice.expense,
                                            type: invoice.type == 1 ? '审稿费' : '版面费',
                                            receiptTitle: invoice.receipt_title,
                                            receiptNum: invoice.receipt_num,
                                            address: invoice.address,
                                            receiver: invoice.receiver,
                                            task: task,
                                            invoice: invoice,
                                        });
                                        return true;
                                    }
                                })
                                return true;
                            }
                        })
                    }
                })
                if(flag==0) {
                    self.setState({
                        unfinishedLoading: false,
                        dataUnfinished: dataUnfinished,
                        totalUnfinished: data.total,
                        currentUnfinished: page,
                    })
                }else{
                    self.setState({
                        finishedLoading: false,
                        dataFinished: dataFinished,
                        totalFinished: data.total,
                        currentFinished: page,
                    })
                }
            } else {
                self.setState({
                    unfinishedLoading: false,
                    finishedLoading: false,
                })
                error("失败",response.data.data?response.data.data+'<br>获取稿件任务列表失败，请稍候重试！':'获取稿件任务列表失败，请稍候重试！');
            }
        }).catch(function (e) {
            self.setState({
                unfinishedLoading: false,
                finishedLoading: false,
            })
            console.log(e);
            message.error('连接失败，请稍候重试！');
        });
    }

    componentWillMount(){
        const self = this;
        const getNewsroominfo = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "newsroominfo"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    const standard = response.data.data;
                    const years = [];
                    let index = standard.length > 1 ? standard.length - 2 : 0;
                    standard.map(item => {
                        years.push(parseInt(item.year));
                    })
                    standard.some((item, key) => {
                        if (item.year == (Math.max(...years))) {
                            index = key;
                            return true;
                        }
                    })
                    self.setState({
                        reviewFee: standard[index].reviewfee,
                        pageCharges: standard[index].pagecharges,
                    });
                    self.getTask(0, 1);
                } else {
                    self.setState({
                        unfinishedLoading: false,
                        finishedLoading: false,
                    })
                    message.error(response.data.data?response.data.data+'<br>获取默认费用失败，请稍候重试！':'获取默认费用失败，请稍候重试！');
                }
                resolve();
            }).catch(function (e) {
                console.log(e);
                reject();
            });
        });
        const getAuthor = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "authors"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        authors: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取作者信息失败，请稍候重试！':'获取作者信息失败，请稍候重试！');
                }
                resolve();
            }).catch(function (e) {
                console.log(e);
                reject();
            })
        });
        Promise.all([getNewsroominfo,getAuthor]).catch(() =>{
            self.setState({
                unfinishedLoading: false,
                finishedLoading: false,
            })
            message.error('连接失败，请稍候重试！');
        })
    }

    tagsChange = (key) => {
        this.setState({
            unfinishedLoading: true,
            finishedLoading: true,
        });
        this.getTask(key,key?this.state.currentFinished:this.state.currentUnfinished)
    }

    pageChange = (flag,page) => {
        this.getTask(flag,page);
    }

    render() {
        return (
            <Tabs animated={false} tabPosition="top" defaultActiveKey="0" className="centerTab" onChange={this.tagsChange}>
                <TabPane tab="未完成" key="0">
                    <Table
                        pagination={{
                            pageSize: this.state.pageSize,
                            total:this.state.totalUnfinished,
                            current:this.state.currentUnfinished,
                            onChange: (page) => this.pageChange(0,page),
                        }}
                        loading={this.state.unfinishedLoading}
                        expandedRowRender = {record => (
                            <span>
                                <Row>
                                    <Col span={12}>
                                        发票抬头:{record.receiptTitle}
                                    </Col>
                                    <Col span={12}>
                                        税号:{record.receiptNum}
                                    </Col>
                                </Row>
                                <p/>
                                <Row>
                                    <Col span={12}>
                                        邮寄地址:{record.address}
                                    </Col>
                                    <Col span={12}>
                                        接收人:{record.receiver}
                                    </Col>
                                </Row>
                            </span>
                        )}
                        expandedRowKeys = {this.state.expandedRowKeys}
                        expandIconAsCell = {false}
                        expandIconColumnIndex = {-1}
                        columns={this.columnsUnfinished}
                        dataSource={this.state.dataUnfinished}
                        bordered
                        scroll={{ x: '48rem' }}
                    />
                    <Modal
                        visible={this.state.visible}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitPayment} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>{this.state.modalContent}</p>
                    </Modal>
                </TabPane>
                <TabPane tab="已完成" key="1">
                    <Table
                        pagination={{
                            pageSize: this.state.pageSize,
                            total:this.state.totalFinished,
                            current:this.state.currentFinished,
                            onChange: (page) => this.pageChange(1,page),
                        }}
                        loading={this.state.finishedLoading}
                        columns={this.columnsFinished}
                        dataSource={this.state.dataFinished}
                        bordered
                        scroll={{ x: '1rem' }} />
                </TabPane>
            </Tabs>
        );
    }
}

class EditorCenter extends Component{
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
        sessionStorage.setItem("editorCenterKey",e.key);
    }

    componentWillMount(){
        if(sessionStorage.getItem("editorCenterKey")) {
            this.setState({
                selectedKeys: sessionStorage.getItem("editorCenterKey"),
            });
        }
    }

    render(){
        return(
            <Layout>
                <Header/>
                <Content>
                    <Layout className="centerLayout">
                        <Sider className="centerSider">
                            <Menu
                                mode="inline"
                                inlineCollapsed = "false"
                                defaultSelectedKeys={[this.state.selectedKeys]}
                                className="centerMenu"
                                onSelect={this.menuSelect}
                            >
                                <MenuItemGroup key="i1" title={<span><Icon type="bars" /></span>}>
                                    <Menu.Item key="1">稿件纪录</Menu.Item>
                                    <Menu.Item key="2">费用中心</Menu.Item>
                                </MenuItemGroup>
                                {/*<MenuItemGroup key="i2" title={<span><Icon type="user" /><span>个人设置</span></span>}>*/}
                                    <Menu.Item key="3">个人信息</Menu.Item>
                                    <Menu.Item key="4">修改密码</Menu.Item>
                                {/*</MenuItemGroup>*/}
                            </Menu>
                        </Sider>
                        <Content className="centerContent">
                            {this.state.selectedKeys === "1" ? <Record /> : null}
                            {this.state.selectedKeys === "2" ? <Payment /> : null}
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        )
    }
}

export default EditorCenter;