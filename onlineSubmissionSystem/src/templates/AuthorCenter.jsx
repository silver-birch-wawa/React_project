/*
* @Author: lixiwei
* @Date:   2018-03-18 17:09:17
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-27 11:21:24
*/
import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Button, Upload, message, Modal, Input, Select, Form, Row, Col, Table, Switch } from 'antd';
import axios from 'axios';
import { getInvoiceState,getTaskState,info,error,hasErrors,setDateFormat } from './judgeTask';
import '../css/AuthorCenter.css';
import Header from './Header';

const { Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class Thesis extends　Component{
    constructor () {
        super();
        this.state = {
            file1: {},
            file2: {},
            uploading: false,
            operationArg: null,
            visible: false,
			finished: false,
            academicsecOption: [],
            columnOption: [],
        }
    }

    componentWillMount(){
    	const self = this;
        const getAcademicsec = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "type_academicsec"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        academicsecOption: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            })
        });
        const getColumn = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "type_column"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        columnOption: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取期刊栏目列表失败，请稍候重试！':'获取期刊栏目列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
        Promise.all([getAcademicsec,getColumn]).catch(() =>{
            message.error('连接失败，请稍候重试！');
        })
	}

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
        if(sessionStorage.getItem("thesis")){
			this.props.form.setFieldsValue(JSON.parse(sessionStorage.getItem("thesis")));
		}
    }

    componentDidUpdate() {
        console.log(this.props.form.getFieldsValue());
    }

    componentWillUnmount() {
    	if(!this.state.finished){
            sessionStorage.setItem("thesis",JSON.stringify(this.props.form.getFieldsValue()));
		}
	}

    handleUpload = () => {
        let { file1 } = this.state;
        let { file2 } = this.state;
        const formData = new FormData();
        const articleForm = this.props.form.getFieldsValue();
        const self = this;
        const writers_info =[[articleForm.author,articleForm.unit,articleForm.email].join(",;")];
        articleForm.authors.map(item => {
            writers_info.push([articleForm[`author-${item}`],articleForm[`unit-${item}`],articleForm[`email-${item}`]].join("-;"));
        })

        const article = {
            title:articleForm.title,//稿件标题
            format:file2.name?"."+file1.name.split(".").pop()+";."+file2.name.split(".").pop() : "."+file1.name.split(".").pop()+";",//稿件格式，以分号串的格式存储
            academicsec:articleForm.academicsec,//学术领域编号
            column:articleForm.column,//期刊栏目编号
            keyword1_ch:articleForm.chKeyWord1,//中文第一关键词
            keyword2_ch:articleForm.chKeyWord2,//中文第二关键词
            keyword3_ch:articleForm.chKeyWord3,//中文第三关键词
            keyword4_ch:articleForm.chKeyWord4,//中文第四关键词
            keyword1_en:articleForm.enKeyWord1,//英文第一关键词
            keyword2_en:articleForm.enKeyWord2,//英文第二关键词
            keyword3_en:articleForm.enKeyWord3,//英文第三关键词
            keyword4_en:articleForm.enKeyWord4,//英文第四关键词
            summary_ch:articleForm.chAbstract,//中文摘要
            summary_en:articleForm.enAbstract,//英文摘要
            writers_info:writers_info.join(";;"),//作者信息的格式化串
            writer_prefer:[articleForm.preferPro1,articleForm.preferPro2,articleForm.preferPro3].join(";"),
            writer_avoid:[articleForm.avoidPro1,articleForm.avoidPro2,articleForm.avoidPro3].join(";"),
        }
        /*for (let key in article){
            formData.append(key,article[key]);
        }*/
        formData.append("all", JSON.stringify({article:article}));
        formData.append("file1", file1);
        formData.append("file2", file2.name ? file2 : file1);

        this.setState({
            uploading: true,
        });
        axios.post('/contribute/upload',formData,{
            headers:{'Content-Type':'multipart/form-data'}
        })
        /*axios({
            method: 'post',
            url: '',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            params: formData
        })*/.then(function (response) {
        	if(response.data.result == 1) {
                self.setState({
                    file1: {},
                    file2: {},
                    uploading: false,
                });
                self.setState({
                    finished: true,
                });
                self.props.form.resetFields();
                sessionStorage.removeItem("thesis");
                sessionStorage.setItem("authorCenterKey","1");
                message.success('上传稿件成功！',2,() => {
                    window.location.reload()
                });
                //   跳转稿件纪录
            }else{
                self.setState({
                    uploading: false,
                });
                error("失败",response.data.data?response.data.data+'<br>上传失败，请稍候重试！':'上传失败，请稍候重试！');
			}
        }).catch(function () {
            self.setState({
                uploading: false,
            });
            error("失败",'连接失败，请稍候重试！');
        });
    }

    handleStepChange = (step) => {
        this.props.stepChange(step);
    }

    checkError = (id) => {
        // Only show error after a field is touched.
    	return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
	}

    removeAuthor = () => {
        const { form } = this.props;
        const authors = form.getFieldValue('authors');
        authors.pop();
        form.setFieldsValue({
            // authors: authors.filter(key => key !== k),
			authors: authors
        });
    }

    addAuthor = () => {
        const { form } = this.props;
        const authors = form.getFieldValue('authors');
        const nextKeys = authors.concat(authors.length);
        form.setFieldsValue({
            authors: nextKeys,
        });
    }

    clearSubmit = () => {
        this.props.form.resetFields();
        sessionStorage.removeItem("thesis");
        this.modalClose();
	}

	removeAttachment = (e) => {
        e.stopPropagation();
        this.setState({
            file2: {},
        });
    }

    modalOpen = (arg) => {
        this.setState({
            operationArg: arg,
            visible: true,
        });
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { uploading, academicsecOption, columnOption } = this.state;
        const props1 = {
            showUploadList:false,
            onRemove: () => {
                this.setState({
                    file1: {},
                });
            },
            beforeUpload: (file) => {
                const fileType = file.name.split(".").pop();
                if (fileType !== 'doc' && fileType !== 'docx' && fileType !== 'pdf') {
                    message.error('稿件文件格式错误，请上传doc、docx或pdf');
                    this.setState({
                        file1: {},
                    });
                }else {
                    this.setState({
                        file1: file,
                    });
                }
                return false;
            },
            file1: this.state.file1,
        };
        const props2 = {
            showUploadList:false,
            onRemove: () => {
                this.setState({
                    file2: {},
                });
            },
            beforeUpload: (file) => {
            	const fileType = file.name.split(".").pop();
                if (fileType !== '7z' && fileType !== 'rar' && fileType !== 'zip') {
                    message.error('附件文件格式错误，请上传zip、7z或rar');
                    this.setState({
                        file2: {},
                    });
                }else {
                    this.setState({
                        file2: file,
                    });
                }
                return false;
            },
            file2: this.state.file2,
        };
        getFieldDecorator('authors', { initialValue: [] });
        const authorsValue = getFieldValue('authors');
        const authors = authorsValue.map((k, index) => {
            return (
            	<div>
					<Row gutter={16}>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError(`author-${k}`) ? 'error' : ''}
								help={this.checkError(`author-${k}`) || ''}
								required={false}
								key={`author-${k}`}
							>
                                {getFieldDecorator(`author-${k}`, {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: "作者不能为空!",
                                    }],
                                })(
									<Input placeholder="author"/>
                                )}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError(`unit-${k}`) ? 'error' : ''}
								help={this.checkError(`unit-${k}`) || ''}
								key={`unit-${k}`}
							>
                                {getFieldDecorator(`unit-${k}`, {
                                    rules: [{ message: '单位不能为空格!', whitespace: true }]
                                })(
									<Input placeholder="unit"/>
                                )}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError(`email-${k}`) ? 'error' : ''}
								help={this.checkError(`email-${k}`) || ''}
								key={`email-${k}`}
							>
                                {getFieldDecorator(`email-${k}`, {
                                    rules: [{ message: '请输入正确的邮箱格式!', type:'email' }],
                                })(
									<Input placeholder="email"/>
                                )}
							</FormItem>
						</Col>
					</Row>
				</div>
            )});

        return (
			<div id="uploadDiv">
				<Form>
					<Row gutter={16}>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError('title') ? 'error' : ''}
								help={this.checkError('title') || ''}
								label={(
									<span>
									  论文题目
									</span>
                                )}
							>
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '论文标题不能为空!', whitespace: true }],
                                })(
									<Input placeholder="Title" />
                                )}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError('academicsec') ? 'error' : ''}
								help={this.checkError('academicsec') || ''}
								label={(
									<span>
									  学术领域
									</span>
                                )}
							>
                                {getFieldDecorator('academicsec', {
                                    rules: [{ required: true, message: '学术领域不能为空!' }],
                                })(
									<Select>
                                        {academicsecOption?academicsecOption.map(item => <Option key={item.id} value={item.id}>{item.academicsec}</Option>):null}
									</Select>
                                )}
							</FormItem>
						</Col>
                        <Col span={6}>
                            <FormItem
                                validateStatus={this.checkError('column') ? 'error' : ''}
                                help={this.checkError('column') || ''}
                                label={(
                                    <span>
									  投稿栏目
									</span>
                                )}
                            >
                                {getFieldDecorator('column', {
                                    rules: [{ required: true, message: '投稿栏目不能为空!' }],
                                })(
                                    <Select>
                                        {columnOption?columnOption.map(item => <Option key={item.id} value={item.id}>{item.column}</Option>):null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
					</Row>
					<Row gutter={16}>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord1') ? 'error' : ''}
								help={this.checkError('chKeyWord1') || ''}
								label={(
									<span>
								  		中文关键词
									</span>
                                )}
							>
                                {getFieldDecorator('chKeyWord1', {
                                    rules: [{ required:true, pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input placeholder="chKeyWord" />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord2')  ? 'error' : ''}
								help={this.checkError('chKeyWord2')  || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord2', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord3') ? 'error' : ''}
								help={this.checkError('chKeyWord3') || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord3', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord4') ? 'error' : ''}
								help={this.checkError('chKeyWord4') || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord4', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord1') ? 'error' : ''}
								help={this.checkError('enKeyWord1') || ''}
								label={(
									<span>
									英文关键词
									</span>
                                )}
							>
                                {getFieldDecorator('enKeyWord1', {
                                    rules: [{ required:true, pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input placeholder="enKeyWord" />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord2') ? 'error' : ''}
								help={this.checkError('enKeyWord2') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord2', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord3') ? 'error' : ''}
								help={this.checkError('enKeyWord3') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord3', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord4') ? 'error' : ''}
								help={this.checkError('enKeyWord4') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord4', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError('author') ? 'error' : ''}
								help={this.checkError('author') || ''}
								label={(
									<span>
									  作者
									</span>
                                )}
							>
                                {getFieldDecorator('author', {
                                    rules: [{ required: true, message: '第一作者不能为空!', whitespace: true }]
                                })(
									<Input placeholder="first author"/>
                                )}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError('unit') ? 'error' : ''}
								help={this.checkError('unit') || ''}
								label={(
									<span>
									  单位
									</span>
                                )}
							>
                                {getFieldDecorator('unit', {
                                    rules: [{ required: true, message: '第一作者单位不能为空!', whitespace: true }]
                                })(
									<Input placeholder="unit"/>
                                )}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError('email') ? 'error' : ''}
								help={this.checkError('email') || ''}
								label={(
									<span>
									  邮箱
									</span>
                                )}
							>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: '请输入正确的邮箱格式!', type:'email' }],
                                })(
									<Input placeholder="email"/>
                                )}
							</FormItem>
						</Col>
					</Row>
					{authors}
					<Button type="dashed" onClick={this.addAuthor} style={{ width: '7rem', marginRight:'2rem' }}>
						<Icon type="plus" /> 添加作者
					</Button>
					<Button type="dashed" onClick={this.removeAuthor} style={{ width: '7rem' }}>
						<Icon type="minus" /> 删除作者
					</Button>
					<Row>
						<FormItem
							validateStatus={this.checkError('chAbstract') ? 'error' : ''}
							help={this.checkError('chAbstract') || ''}
							label={(
								<span>
								  中文摘要
								</span>
							)}
						>
							{getFieldDecorator('chAbstract', {
								rules: [{ required: true, message: '请输入中文摘要!', whitespace: true }]
							})(
								<TextArea autosize={{minRows: 3}} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem
							validateStatus={this.checkError('enAbstract') ? 'error' : ''}
							help={this.checkError('enAbstract') || ''}
							label={(
								<span>
								  英文摘要
								</span>
                            )}
						>
                            {getFieldDecorator('enAbstract', {
                                rules: [{ required: true, message: '请输入英文摘要!', whitespace: true }]
                            })(
								<TextArea autosize={{minRows: 3}} />
                            )}
						</FormItem>
					</Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('preferPro1') ? 'error' : ''}
                                help={this.checkError('preferPro1') || ''}
                                label={(
                                    <span>
								  		倾向的审稿人
									</span>
                                )}
                            >
                                {getFieldDecorator('preferPro1')(
                                    <Input placeholder="preferProfessor" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('preferPro2')  ? 'error' : ''}
                                help={this.checkError('preferPro2')  || ''}
                            >
                                <br/>
                                {getFieldDecorator('preferPro2')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('preferPro3') ? 'error' : ''}
                                help={this.checkError('preferPro3') || ''}
                            >
                                <br/>
                                {getFieldDecorator('preferPro3')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('avoidPro1') ? 'error' : ''}
                                help={this.checkError('avoidPro1') || ''}
                                label={(
                                    <span>
                                        回避的审稿人
									</span>
                                )}
                            >
                                {getFieldDecorator('avoidPro1')(
                                    <Input placeholder="avoidProfessor" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('avoidPro2') ? 'error' : ''}
                                help={this.checkError('avoidPro2') || ''}
                            >
                                <br/>
                                {getFieldDecorator('avoidPro2')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                validateStatus={this.checkError('avoidPro3') ? 'error' : ''}
                                help={this.checkError('avoidPro3') || ''}
                            >
                                <br/>
                                {getFieldDecorator('avoidPro3')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
					<Button type="primary" onClick={this.modalOpen} style={{ marginBottom: '1rem' }}>
						重置论文信息
					</Button>
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
				<p>
					请将论文及相关附件压缩包分别上传：
					<br/>
					1）论文
					<br/>
					2）附件，例如：
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;论文的研究背景，包括本研究属于哪个领域的哪个具体问题，目前已经解决到什么程度，本文将从哪些方面进行解决；
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;实验测试数据，方便重复验证；
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;创新说明，以助于审稿专家快速地对文章质量进行公正客观的评价，提高文章接受率。
				</p>
				<div id="uploadSelectDiv">
					<Dragger {...props1}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="uploadText">
							{this.state.file1.name? this.state.file1.name : '点击或者拖拽文件进行论文选择（doc、docx、pdf）'}
						</p>
					</Dragger>
					<div id="marginDiv"/>
					<Dragger {...props2}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="uploadText">
                            {this.state.file2.name ?  <span>{this.state.file2.name}<Icon type="close" className="removeAttachment" onClick={(e)=>this.removeAttachment(e)} /></span> : '点击或者拖拽文件进行附件选择（zip、7z、rar）'}
						</p>
					</Dragger>
				</div>
				<div id="uploadBtnDiv">
					<Button
						type="primary"
						style={{ marginRight:'2rem' }}
						disabled={uploading}
						onClick={() => this.handleStepChange(2)}
					>
						上一步
					</Button>
					<Button
						className="uploadStart"
						type="primary"
						onClick={this.handleUpload}
						disabled={this.state.file1 === {} || hasErrors(this.props.form.getFieldsError())}
						loading={uploading}
					>
                        {uploading ? '上传中' : '确定投稿' }
					</Button>
				</div>
			</div>
        );
    }
}
const ThesisForm = Form.create()(Thesis);

class Record extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            unfinishedLoading: true,
            finishedLoading: true,
            visible: false,
            visibleFormatResolve: false,
            visibleFormatReject: false,
            fileList: {},
            operationArg: null,
            dataUnfinished: [],
            dataFinished: [],
            academicsec: [],
            column: [],
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
                const academicsecList = this.state.academicsec;
                let academicsec = text;
                academicsecList.some(item => {
                    if(text == item.id){
                        academicsec = item.academicsec
                        return true;
                    }
                })
                return academicsec;
            }
        }, {
            title: '投稿栏目',
            dataIndex: 'column',
            key: 'column',
            render: (text, record) => {
                const columnList = this.state.column;
                let column = text;
                columnList.some(item => {
                    if(text == item.id){
                        column = item.column
                        return true;
                    }
                })
                return column;
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
        }, {
            title: '操作',
            key: 'action',
            width: '30rem',
            render: (text, record) => (
				<span>
					<Button onClick={() => info('审阅意见',record.suggestion)} title="查看稿件审阅意见">审阅意见</Button>
					<span className="ant-divider" />
					<Button onClick={() => info('下载', record, true)} title="下载论文和附件">下载</Button>
					<span className="ant-divider" />
                    <Upload
                        showUploadList={false}
                        beforeUpload = {(file) => this.beforeUpload(record.key,file)}
                    >
                        {
                            this.state.fileList[record.key] !== undefined ?
                                <Button title={this.state.fileList[record.key].name}>
                                    <Icon type="upload" /> {this.state.fileList[record.key].name}
                                </Button>
                                :
                                <Button title="上传修改后的论文稿件">
                                    <Icon type="upload" />上传
                                </Button>
                        }
                    </Upload>
                    <span className="ant-divider" />
                    {record.task && record.task.stat == 5 ?
                        <span>
                            <Button type="primary" onClick={() => this.modalOpen(record,'formatResolve')} title="格式内容无误通过">通过</Button>
					        <span className="ant-divider" />
                            <Button onClick={() => this.modalOpen(record,'formatReject')} title="格式内容有误，拒绝通过">拒绝</Button>
                        </span> :
                        <span>
                            <Button type="primary" onClick={() => this.modalOpen(record)} title="提交修改内容后的稿件">提交</Button>
					        <span className="ant-divider" />
                            <Button disabled>拒绝</Button>
                        </span>
                    }
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
                const academicsecList = this.state.academicsec;
                let academicsec = text;
                academicsecList.some(item => {
                    if(text == item.id){
                        academicsec = item.academicsec
                        return true;
                    }
                })
                return academicsec;
            }
        }, {
            title: '投稿栏目',
            dataIndex: 'column',
            key: 'column',
            render: (text, record) => {
                const columnList = this.state.column;
                let column = text;
                columnList.some(item => {
                    if(text == item.id){
                        column = item.column
                        return true;
                    }
                })
                return column;
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

    submitNew = () => {
        let { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        const key = operationArg[0].key;
        const task = operationArg[0].task;
        const self = this;

		formData.append("file1", fileList[key]);
        formData.append("file2", fileList[key]);
        formData.append("all", JSON.stringify({task:task}));
		this.setState({
			confirmLoading: true,
		});

		axios.post('/contribute/upload', formData).then(function (response) {
		    if(response.data.result == 1) {
                self.modalClose();
                delete fileList[key];
                self.setState({
                    fileList: fileList,
                    confirmLoading: false,
                });
                message.success('上传稿件成功！');
                self.setState({
                    dataUnfinished: dataUnfinished.filter(data => data.key !== key)
                })
            }else{
                self.setState({
                    confirmLoading: false,
                });
                error("失败",response.data.data?response.data.data+'<br>上传失败，请稍候重试！':'上传失败，请稍候重试！');
            }
		}).catch(function () {
			self.modalClose();
			self.setState({
				confirmLoading: false,
			});
			error("失败", '连接失败，请稍候重试！');
		});
    }

    submitFormat = (arg) => {
        const { operationArg, dataUnfinished } = this.state;
        const self = this;

        operationArg[0].task.stat = arg ? 5 : 2;
        this.setState({
            confirmLoading: true,
        });
        axios.post('/contribute/notice', {task:operationArg[0].task}).then(function (response) {
            if(response.data.result == 1) {
                message.success('格式确认提交成功！');
                self.setState({
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0].key)
                })
            }else{
                error("失败",response.data.data?response.data.data+'<br>提交失败，请稍候重试！':'提交失败，请稍候重试！');
            }
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
        }).catch(function () {
            self.modalClose();
            self.setState({
                confirmLoading: false,
            });
            error("失败", '连接失败，请稍候重试！');
        });
    }

    modalOpen = (...arg) => {
        const { fileList } = this.state;
        switch (arg[1]){
            case 'formatResolve':
                this.setState({
                    operationArg: arg,
                    visibleFormatResolve: true,
                });
                break;
            case 'formatReject':
                this.setState({
                    operationArg: arg,
                    visibleFormatReject: true,
                });
                break;
            default:
                if(!fileList[arg[0].key]){
                    error("失败", '请确认稿件文件的选择是否完成！');
                }else {
                    this.setState({
                        operationArg: arg,
                        visible: true,
                    });
                }
                break;
        }
    }

    modalClose = () => {
        this.setState({
            visible: false,
            visibleFormatResolve: false,
            visibleFormatReject: false,
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
            if(response.data.result == 1){
                const dataUnfinished = [];
                const dataFinished = [];
                const data = response.data.data;

                data.article.map(article => {
                    if(flag == 0) {
                        data.task.some(task => {
                            if (article.id == task.id_article) {
                                dataUnfinished.push({
                                    key: article.id,
                                    title: article.title,
                                    academicsec: article.academicsec,
                                    column: article.column,
                                    submitDate: article.date_sub,
                                    thesisState: getTaskState(task),
                                    suggestion: task.content,
                                    article:article,
                                    task:task,
                                })
                                return true;
                            }
                        })
                    }else{
                        const unfinishedTask = data.task.reverse();
                        unfinishedTask.some(task => {
                            if (article.id == task.id_article) {
                                dataFinished.push({
                                    key: article.id,
                                    title: article.title,
                                    academicsec: article.academicsec,
                                    column: article.column,
                                    submitDate: article.date_sub,
                                    thesisState: getTaskState(task),
                                    suggestion: task.content,
                                    task:task,
                                })
                                return true;
                            }
                        })
                    }
                });
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
            }else{
                self.setState({
                    unfinishedLoading: false,
                    finishedLoading: false,
                })
                message.error(response.data.data?response.data.data+'<br>获取稿件任务列表失败，请稍候重试！':'获取稿件任务列表失败，请稍候重试！');
            }
        }).catch(function () {
            self.setState({
                unfinishedLoading: false,
                finishedLoading: false,
            })
            message.error('连接失败，请稍候重试！');
        });
    }

    componentWillMount(){
        const self = this;
        const getAcademicsec = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "type_academicsec"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        academicsec: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取学术领域列表失败，请稍候重试！':'获取学术领域列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            })
        });
        const getColumn = new Promise((resolve, reject) => {
            axios.post('/contribute/task/resource', {
                resource: {
                    func: "type_column"
                }
            }).then(function (response) {
                if (response.data.result == 1) {
                    self.setState({
                        column: response.data.data,
                    })
                } else {
                    message.error(response.data.data?response.data.data+'<br>获取期刊栏目列表失败，请稍候重试！':'获取期刊栏目列表失败，请稍候重试！');
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
        Promise.all([getAcademicsec,getColumn]).then(()=>{
            self.getTask(0,1);
        }).catch(() =>{
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
			<Tabs animated={false} tabPosition="top" defaultActiveKey='0' className="centerTab" onChange={this.tagsChange}>
			    <TabPane tab="未完成" key="0">
					<Table
                        pagination={{
                            pageSize: this.state.pageSize,
                            total:this.state.totalUnfinished,
                            current:this.state.currentUnfinished,
                            onChange: (page) => this.pageChange(0,page),
                        }}
                        loading={this.state.unfinishedLoading}
                        columns={this.columnsUnfinished}
                        dataSource={this.state.dataUnfinished}
                        bordered
                        scroll={{ x: '49rem' }} />
                    <Modal
                        visible={this.state.visible}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitNew} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>您确定要提交修改后的稿件吗？</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleFormatResolve}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="操作确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={() => this.submitFormat(true)} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>您确定该稿件格式内容无误通过吗？</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleFormatReject}
                        maskClosable = {false}
                        onCancel={this.modalClose}
                        title="操作确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={() => this.submitFormat(false)} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>您确定该稿件格式内容有误，拒绝通过吗？</p>
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

class Submit extends Component{
    constructor () {
        super();
        this.state = {
			stepDivClassName:{
        		step1:'submitDivShow',
                step2:'submitDivNone',
                step3:'submitDivNone',
			},
			step: 1
        }
    }

    componentWillMount () {
        if(sessionStorage.getItem("submitStep") && sessionStorage.getItem("submitStep") == 3){
        	this.handleStepChange(3);
            sessionStorage.removeItem("submitStep")
		}
    }

    componentWillUnmount(){
    	if(this.state.step == 3){
            sessionStorage.setItem("submitStep",3);
		}
    }

    handleStepChange = (step) =>{
        switch (step){
			case 1:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivShow',
                        step2:'submitDivNone',
                        step3:'submitDivNone',
                    },
                    step:step
                });
				break;
			case 2:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivNone',
                        step2:'submitDivShow',
                        step3:'submitDivNone',
                    },
                    step:step
                });
                break;
            case 3:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivNone',
                        step2:'submitDivNone',
                        step3:'submitDivShow',
                    },
                    step:step
                });
                break;
			default:
				break;
        }
	}

    render() {
        const userName = localStorage.getItem("userName");
    	const authorizationDate = setDateFormat();

        return (
        	<div>
				<div id="step1" className={this.state.stepDivClassName.step1}>
					<div className="submitDiv">
						<article id="submissionRule">
							<h1 style={{ textAlign:'center' }}>投稿要求</h1>
							<p>为使来稿更符合国家科技期刊出版标准，做到严谨规范，我编辑部现对来稿要求如下：
								<br/>
								1.文字精炼、言简意赅，一般在8000字左右;并附200字左右的中、英文摘要及题目、作者和工作单位英译名；首页页脚注明作者学历、职称及研究方向，如有基金资助请给出项目名称及编号；文末请列出主要参考文献。具体格式参照网站（www.jsjkx.com）首页“资料中心-投稿模板”。
								<br/>
								2．使用规范的数学符号进行公式编写，正确使用大小写、正斜体、上下标。所附图形一律用Visio图形处理软件进行制作，尽量不使用使用彩色（我刊采用黑白印刷），尽量不使用图片形式，不用扫描方式植入，请务必确保图形清晰。图形具体规范请参见网站首页“资料中心-图像规范要求”。表格请做成三线表，表内字体用小6号仿宋或Times New Roman。
								<br/>
								3．参考文献格式标准化
								<br/>
								参考文献中个人著者采用姓前明后的形式，姓的每个字母均需大写，3人以上者，录入前3人姓名后加“等”，英文姓名则加“et al”；中文参考文献须同时给出中英文版。具体著录格式如下：
								<br/>
								[1]著者.题目[J].刊名，出版年，卷号（期号）：起止页码.
								<br/>
								[2]著者.书名[M].译者，译.出版地：出版者，出版年：起止页码.
								<br/>
								[3]著者.析出文献题目[C]//会议论文集名，出版地：出版社，出版年：起止页码.
								<br/>
								[4]著者.题名[D].所在城市：学位授予单位，出版年.
								<br/>
								[5]著者.题名：报告号[R].出版地（城市名）：出版者，出版年.
								<br/>
								[6]著者.标准名称：标准编号[S].出生地，出版者，出版年.
								<br/>
								[7]著者.题名[N].报纸名，出版日期（版次）（出版日期按 YY-MM-DD 格式）.
								<br/>
								[8]著者.题名[文献类型标志/电子文献载体标志].（更新日期）[应用日期].获取和访问路径（如http://www.arocmag.com）.
								<br/>
								[9]专利所有者.专利题名：专利国别，专利号[P].公告日期[应用日期].获取和访问地址.
								<br/>
								4.本刊只接受网站在线投稿，具体投稿流程请参见网站首页“资料中心-稿件处理流程”。
								<br/>
								5.如果第一作者为CCF会员的录用稿件，版面费8.5折优惠，因此若为CCF会员，请务必在投稿时注明。
								<br/>
								6.学生来稿请征得导师同意；严禁侵权、一稿多投、泄密、剽窃他人作品等行为，若有发现，期刊将做严肃处理；投稿后，作者及单位不得更改。
								<br/>
								7.来稿请遵照我刊编辑规范，特别是图形、公式、正斜体的规范。
								<br/>
								8.本刊已被《中国学术期刊网路出版总库》、《中文科技期刊数据库》、《万方数据一数字化期刊群》及CNKI系列数据库收录，本刊所付稿酬中含作者文
								章著作使用费。如作者不同意论文被以上数据库收录，请来搞时说明，本刊将做适当处理。</p>
						</article>
						<Button type="primary" onClick={() => this.handleStepChange(2)}>下一步</Button>
					</div>
				</div>
				<div id="step2" className={this.state.stepDivClassName.step2}>
					<div className="submitDiv">
						<article id="authorization">
							<h2 style={{ textAlign:'center' }}>著作权专有许可使用授权书</h2>
							<p>编辑部：<br/>
								&nbsp;&nbsp;&nbsp;&nbsp;我（们）同意将本论文的专有许可使用权授予编辑部。编辑部对本论文具有以下专有使用权：出版权、汇编权（文章的部分或全部）、电子版的复制权、翻译权、网络传播权、发行权及许可文献检索系统或数据库收录权。未经《编辑部书面许可，对于本论文的任何部分，他人不得以任何形式汇编、转载、出版。<br/>
								&nbsp;&nbsp;&nbsp;&nbsp;我（们）保证本论文为原创作品、无一稿两投，并且不涉及保密及其他与知识产权有关的侵权问题。若发生以上侵权、泄密等问题，一切责任由我（们）负责。本授权书于编辑部接受本论文之日起生效。有效期到该论文出版后的第10年12月31日为止。</p>
							<p>授权人：{ userName }</p>
							<p>授权时间：{ authorizationDate }</p>
						</article>
						<div>
							<Button type="primary" style={{ marginRight:'2rem' }} onClick={() => this.handleStepChange(3)}>同意</Button>
							<Button type="primary" onClick={() => this.handleStepChange(1)}>不同意</Button>
						</div>
					</div>
				</div>
				<div id="step3" className={this.state.stepDivClassName.step3}>
					<h1 style={{ textAlign:'center' }}>上传稿件</h1>
					<ThesisForm stepChange={this.handleStepChange}/>
				</div>
			</div>
        );
    }
}

class Payment extends Component{
    constructor () {
        super();
        this.state = {
            fileChange: false,
            confirmLoading: false,
            visible: false,
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
        };
        this.columnsUnfinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
            width: '10rem',
        },{
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
            width: '7rem',
            render: (text, record) => (<span>{setDateFormat(text)}</span>)
        },{
            title: '费用类型',
            dataIndex: 'type',
            key: 'type',
        },{
            title: '操作',
            key: 'action',
            width: '19rem',
            render: (text, record) => {
                return(
					<span>
						<Switch checkedChildren="需要发票" unCheckedChildren="无需发票" onChange={(checked) => this.receiptChange(record,checked)} title="是否需要开具发票" />
						<span className="ant-divider"/>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={(file) => this.beforeUpload(record.key, file)}
						>
							{
								this.state.fileList[record.key] !== undefined ?
									<Button title={this.state.fileList[record.key].name}>
										<Icon type="upload"/> {this.state.fileList[record.key].name}
									</Button>
									:
									<Button title="上传缴费截图">
										<Icon type="upload"/>上传
									</Button>
							}
						</Upload>
						<span className="ant-divider"/>
						<Button type="primary" onClick={() => this.modalOpen(record.key, record)}>提交</Button>
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

    receiptChange = (record, checked) => {
        let oldData = [...this.state.dataUnfinished];
        const key = record.key;
        let newData = oldData.map((obj) => {
            if (key == obj.key) {
                obj['needReceipt'] = !obj.needReceipt;
            }
            return obj;
        });
		if(checked){
            newData = [...this.state.expandedRowKeys,key];
            this.setState({
                expandedRowKeys: newData,
			})
		}else{
            newData = [...this.state.expandedRowKeys].filter(item => item !== key);
            this.setState({
                expandedRowKeys: newData,
            })
		}
	}

    handleChange(value, key, column) {
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataUnfinished: newData });
        }
    }

    beforeUpload = (key,file) => {
        const files = this.state.fileList;
        const fileChange = this.state.fileChange;
        files[key] = file;
        this.setState({
            fileList: files,
            fileChange: !fileChange,
        });
        return false;
    }

    submitPayment = () => {
        const { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        const key = operationArg[0];
        const task = operationArg[1].task;
        const flag = operationArg[1].needReceipt ? 1 : 0;
        const invoice = {
            id: key,
            id_article: task.id_article,
            flag: flag,
            receipt_title:flag ? operationArg[1].receiptTitle : '',
            receipt_num:flag ? operationArg[1].receiptNum : '',
            address:flag ? operationArg[1].address : '',
            receiver:flag ? operationArg[1].receiver : '',
            type: operationArg[1].invoice.type,
            expense: operationArg[1].expense,
        }
        const self = this;

        formData.append("file", fileList[key]);
        formData.append("all", JSON.stringify({task:task,invoice:invoice}));
        this.setState({
            confirmLoading: true,
        });

		axios.post('/contribute/task/fill', formData).then(function (response) {
            if(response.data.result == 1) {
                self.modalClose();
                delete fileList[key];
                self.setState({
                    fileList: fileList,
                    confirmLoading: false,
                });
                message.success('缴费确认提交成功！');
                self.setState({
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                })
            }else{
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
			error("失败", '连接失败，请稍候重试！');
		});
    }

    modalOpen = (...arg) => {
        let { fileList } = this.state;
        if(!fileList[arg[0]]){
            error("失败", '请确认缴费截图文件选择是否完成！');
        }else if(arg[1].needReceipt && (arg[1].receiptTitle === '' || arg[1].receiptNum === ''  || arg[1].address === ''  || arg[1].receiver === '' )){
            error("失败", '请确认发票信息完整填写是否完成！');
        }else {
			this.setState({
				operationArg: arg,
				visible: true,
			});
        }
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    handleFormChange = (changedFields,key) => {
    	const oldData = [...this.state.dataUnfinished];
    	let name;
    	let value;
    	let index;
        for (index in changedFields){
            name = changedFields[index].name;
            value = changedFields[index].value;
        }
        const newData = oldData.map((obj) => {
        	if(key === obj.key){
				obj[name] = value;
			}
			return obj;
		});
		this.setState({
			dataUnfinished: newData
		})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextState) == JSON.stringify(this.state)){
            return false;
        }
        return true;
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

                if (flag == 0) {
                    const unfinishedInvoice = data.invoice.reverse();
                    data.article.some(article => {
                        unfinishedInvoice.some(invoice => {
                            if (article.id == invoice.id_article) {
                                data.task.some(task => {
                                    if (invoice.id_article == task.id_article) {
                                        dataUnfinished.push({
                                            key: invoice.id,
                                            title: article.title,
                                            academicsec: article.academicsec,
                                            submitDate: article.date_sub,
                                            thesisState: getTaskState(task),
                                            expense: invoice.expense,
                                            needReceipt: false,
                                            type: invoice.type == 1 ? '审稿费' : '版面费',
                                            receiptTitle: '',
                                            receiptNum: '',
                                            address: '',
                                            receiver: '',
                                            invoice: invoice,
                                            task: task,
                                        });
                                        return true;
                                    }
                                })
                                return true;
                            }
                        })
                    })
                }else {
                    data.invoice.map(invoice => {
                        data.article.some(article => {
                            if (article.id == invoice.id_article) {
                                data.task.some(task => {
                                    if (invoice.id_article == task.id_article) {
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
                                            invoice: invoice,
                                        });
                                        return true;
                                    }
                                })
                                return true;
                            }
                        })
                    })
                }
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
                message.error(response.data.data?response.data.data+'<br>获取稿件任务列表失败，请稍候重试！':'获取稿件任务列表失败，请稍候重试！');
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
        this.getTask(0,1);
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
						expandedRowRender = {record => {
                            class ExpandedRow extends Component{
                                checkError = (id) => {
                                    // Only show error after a field is touched.
                                    return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
                                }

                                render(){
                                    const { getFieldDecorator } = this.props.form;
                                    return (
                                        <Form>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiptTitle') ? 'error' : ''}
                                                        help={this.checkError('receiptTitle') || ''}
                                                        label={(
                                                            <span>
                                                                发票抬头
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiptTitle', {
                                                            rules: [{ required: true, message: '发票抬头不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiptNum') ? 'error' : ''}
                                                        help={this.checkError('receiptNum') || ''}
                                                        label={(
                                                            <span>
                                                                税号
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiptNum', {
                                                            rules: [{ required: true, message: '税号不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('address') ? 'error' : ''}
                                                        help={this.checkError('address') || ''}
                                                        label={(
                                                            <span>
                                                                邮寄地址
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('address', {
                                                            rules: [{ required: true, message: '邮寄地址不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiver') ? 'error' : ''}
                                                        help={this.checkError('receiver') || ''}
                                                        label={(
                                                            <span>
                                                                接收人
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiver', {
                                                            rules: [{ required: true, message: '接收人不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Form>
                                    );
                                }
                            }
                            const ExpandedRowForm = Form.create({
                                onFieldsChange(props, changedFields) {
                                	const key = props.record.key;
                                    props.onChange(changedFields,key);
                                },
                                mapPropsToFields(props) {
                                    console.log(props.record);
                                    return {
                                        receiptTitle: Form.createFormField({
                                            name: 'receiptTitle',
                                            value: props.record.receiptTitle,
                                        }),
                                        receiptNum: Form.createFormField({
                                            name: 'receiptNum',
                                            value: props.record.receiptNum,
                                        }),
                                        address: Form.createFormField({
                                            name: 'address',
                                            value: props.record.address,
                                        }),
                                        receiver: Form.createFormField({
                                            name: 'receiver',
                                            value: props.record.receiver,
                                        }),
                                    };
                                },
                            })(ExpandedRow);
							return(
                                <ExpandedRowForm record={record} onChange={this.handleFormChange} />
							)
						}}
						expandedRowKeys = {this.state.expandedRowKeys}
						expandIconAsCell = {false}
						expandIconColumnIndex = {-1}
						columns={this.columnsUnfinished}
						dataSource={this.state.dataUnfinished}
						bordered
						scroll={{ x: '41rem' }} />
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
						<p>您确定要提交缴费信息吗？</p>
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

class AuthorCenter extends Component{
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
        sessionStorage.setItem("authorCenterKey",e.key);
    }

    componentWillMount(){
        if(sessionStorage.getItem("authorCenterKey")) {
            this.setState({
                selectedKeys: sessionStorage.getItem("authorCenterKey"),
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
								<Menu.Item key="1">稿件纪录</Menu.Item>
								<Menu.Item key="2">在线投稿</Menu.Item>
								<Menu.Item key="3">费用中心</Menu.Item>
							</MenuItemGroup>
							{/*<MenuItemGroup key="i2" title={<span><Icon type="user" /><span>个人设置</span></span>}>*/}
								<Menu.Item key="4">个人信息</Menu.Item>
								<Menu.Item key="5">修改密码</Menu.Item>
							{/*</MenuItemGroup>*/}
						</Menu>
			        </Sider>
			        <Content className="centerContent">
                        {this.state.selectedKeys === "1" ? <Record /> : null}
						{this.state.selectedKeys === "2" ? <Submit /> : null}
                        {this.state.selectedKeys === "3" ? <Payment /> : null}
			        </Content>
		      	</Layout>
		    </Layout>
		);
	}
}

export default AuthorCenter;