import React, { Component } from 'react';
import '../../../css/Registerfjj.css'
import { Layout,Modal,message,Select,Button,Input } from 'antd';
import  axios from 'axios';
import Header from "../fuction/Header";

const { Content } = Layout;
const Option =Select.Option;
const { TextArea } = Input;

class Registerfjj extends Component
{
    constructor()
    {
        super()
        this.state = {email:'',password:'',password2:'',name:'',name_pinyin:'',gender:null,address:'',
            postcode:'', workspace_cn:'',workspace_en:'',  major:'',education:'', title:'',officetel:'',
            phonenum:'',location:null,researchdir:'',academicsec1:null,academicsec2:null,academicsec3:null,
            introduction:'',safeque1:'',safeque2:'',safeque3:'', Seqid1:null,Seqid2:null,Seqid3:null,
            typelist1:[], typelist2:[], typelist3:[],typelist4:[],alive:1}
    }

    RegiterFuction = () =>
    {
        let self = this;
        axios
        (
            {
                method: 'post',
                url: '/common/register/isemailexist',
                params: {
                    email: self.state.email,
                },
                headers:
                    {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
            }
        )
            .then((response)=>{
                if(response.data.result==0){
                    Modal.error({
                        title: '该账号已经注册过啦',
                    });
                }
               if(response.data.result==1){self.RegiterFuction2()}
            })
            .catch((error)=>{console.log(error);})
    }

    RegiterFuction2 = () =>
    {
        let self = this;
        axios(
            {
                method:'post',
                url:'/common/register',


                data: JSON.stringify
                ({
                    email:self.state.email,
                    password:self.state.password,
                    name:self.state.name,
                    name_pinyin:self.state.name_pinyin,
                    gender:self.state.gender,
                    address:self.state.address,
                    postcode:self.state.postcode,
                    workspace_cn:self.state.workspace_cn,
                    workspace_en:self.state.workspace_en,
                    major:self.state.major,
                    education:self.state.education,
                    title:self.state.title,
                    officetel:self.state.officetel,
                    phonenum:self.state.phonenum,
                    location:self.state.location,
                    researchdir:self.state.researchdir,
                    academicsec1:self.state.academicsec1,
                    academicsec2:self.state.academicsec2,
                    academicsec3:self.state.academicsec3,
                    introduction:self.state.introduction,
                    safeque1:self.state.Seqid1+';'+self.state.safeque1,
                    safeque2:self.state.Seqid2+';'+self.state.safeque2,
                    safeque3:self.state.Seqid3+';'+self.state.safeque3,
                    alive:self.state.alive,
                }),
                headers:{
                    'Content-type':'application/json'
                },

            }
        )
            .then((response)=>{
                if(response.data.result==1) {
                { message.success('恭喜你，你的投稿之路已经开启');};}})
            // .catch((error)=>{console.log(error);})
    }

    RegiterFuction3 = () =>
    {

        let type="academicsec";
        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/common/gettype/type=${type}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                if(response.data.result==1)
                {
                this.setState({
                    typelist1:response.data.typelist,
                })}})
            .catch((error) =>
            {console.log(error);})
    }

    RegiterFuction4 = () =>
    {
        let type="education"
        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/common/gettype/type=${type}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                if(response.data.result==1)
                {
                    this.setState({
                        typelist2:response.data.typelist,
                    })}})
            .catch((error) =>
            {console.log(error);})
    }

    RegiterFuction5 = () =>
    {
        let type="major";
        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/common/gettype/type=${type}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                if(response.data.result==1)
                {
                    this.setState({
                        typelist3:response.data.typelist,
                    })}})
            .catch((error) =>
            {console.log(error);})
    }

    RegiterFuction6 = () =>
    {
       let  type="location";
        let self = this;
        axios
        (
            {
                method: 'get',
                url: `/common/gettype/type=${type}`,
                headers:
                    {
                        'Content-type': 'application/json'
                    },
            }
        )
            .then((response) => {
                if(response.data.result==1)
                {
                    this.setState({
                        typelist4:response.data.typelist,
                    })}})
            .catch((error) =>
            {console.log(error);})
    }


    check=()=>
    {
        if(this.checkemail()&&this.checkPassword()&&this.checkName(this.state.name)&&this.checkAddress(this.state.address)&&
            this.checkworkspace_cn(this.state.workspace_cn)&&this.checkphonenum(this.state.phonenum))
        {
            this.RegiterFuction();
        }
    }

    checkemail =()=>
    {
        if(this.checkMail2(this.state.email))
        {
            if(this.checkMail1(this.state.email))
            {
                return true;
            }
            else{return false;}
        }
        else {return false;}
    }

    checkMail1 =(mail)=>
    {
        let filter  = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
        if (filter.test(mail))
        {return true;}
        else {
            Modal.error({
                title: '您的电子邮件格式不正确',
            });
            return false;}
    }

    checkMail2=(mail)=>
    {
        let filter =  /^\s*$/g;
        if(mail==""||filter.test(mail))
        {
            Modal.error({
                title: '亲，电子邮箱不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    checkPassword=()=>
    {
        if(this.checkNumber3(this.state.password,this.state.password2))
        {
            if (this.checkNumber1(this.state.password)) {
                if (this.checkNumber2(this.state.password)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else{
            return false;
        }
    }

    // checkPassword=()=>
    // {
    //     if(this.handleChange3(this.state.password,this.state.password2))
    //     {
    //         if (this.checkNumber1(this.state.passwordSure)) {
    //             if (this.checkNumber2(this.state.passwordSure)) {
    //                 return true;
    //             }
    //             else {
    //                 return false;
    //             }
    //         }
    //         else {
    //             return false;
    //         }
    //     }
    //     else{
    //         return false;
    //     }
    // }

    checkNumber1=(e)=>
    {
        let filter =  /^\s*$/g;
        if(e==""||filter.test(e))
        {
            Modal.error({
                title: '亲，密码不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    checkNumber2=(number)=>
    {
        let filter=/^[0-9a-zA-Z]+$/;

        if(number.length>=8&&number.length<=16)
        {
            if(filter.test(number))
            {
                return true;
            }
            else
            {
                Modal.error({
                    title: '密码必须为数字和字母组成',
                });
                return false;
            }

        }
        else
        {
            Modal.error({
                title: '密码必须为八到十六位',
            });
            return false;
        }
    }

    checkNumber3=(e,e2)=>
    {
        if(e==e2)
        {
            return true
        }
        else {
            Modal.error({
                title: '确认密码和密码不一致哟，小同志',
            })
            return false
        }
    }



    handleChange0 = (e) =>
    {
        this.setState(
            {
                email:e.target.value
            }
        )

    }

    handleChange1 = (e) =>
    {
        this.setState(
            {
                password:e.target.value
            }
        )
    }

    handleChange2 = (e) =>
    {
        this.setState(
            {
                password2:e.target.value
            }
        )
    }

    // handleChange3=(e,e2)=>
    // {
    //     if(e==e2)
    //     {
    //         this.setState
    //         ({
    //             passwordSure:e
    //         })
    //         return true
    //     }
    //     else {
    //         Modal.error({
    //             title: '确认密码和密码不一致哟，小同志',
    //         })
    //
    //         return false
    //     }
    // }

    handleChange4 = (e) =>
    {
        this.setState(
            {
                address:e.target.value
            }
        )
    }

    handleChange5 = (e) =>
    {
        this.setState(
            {
                workspace_cn:e.target.value
            }
        )
    }

    handleChange6 = (e) =>
    {
        this.setState(
            {
                name:e.target.value
            }
        )
    }

    handleChange7=(e)=>
    {
        this.setState(
            {
                name_pinyin:e.target.value
            }
        )
    }

    handleChange8=(e)=>
    {
        this.setState(
            {
                phonenum:e.target.value
            }
        )
    }

    handleChange9 = (e) =>
    {
        this.setState(
            {
                Seqid1:e
            }
        )
    }

    handleChange10 = (e) =>
    {
        this.setState(
            {
                Seqid2:e
            }
        )
    }

    handleChange11=(e)=>
    {
        this.setState(
            {
                Seqid3:e
            }
        )
    }

    handleChange12=(e)=>
    {
        this.setState(
            {
               workspace_en:e.target.value
            }
        )
    }

    handleChange13=(e)=>
    {
        this.setState(
            {
                gender:e
            }
        )
    }

    handleChange14=(e)=>
    {
        this.setState(
            {
               postcode:e.target.value
            }
        )
    }

    handleChange15=(e)=>
    {
        this.setState(
            {
                major:e
            }
        )
    }
    handleChange16=(e)=>
    {
        this.setState(
            {
                education:e
            }
        )
    }
    handleChange17=(e)=>
    {
        this.setState(
            {
                title:e.target.value
            }
        )
    }
    handleChange18=(e)=>
    {
        this.setState(
            {
                officetel:e.target.value
            }
        )
    }

    handleChange19=(e)=>
    {
        this.setState(
            {
                location:e
            }
        )
    }

    handleChange20=(e)=>
    {
        this.setState(
            {
                researchdir:e.target.value
            }
        )
    }
    handleChange21=(e)=>
    {
        this.setState(
            {
                academicsec1:e
            }
        )
    }
    handleChange22=(e)=>
    {
        this.setState(
            {
                academicsec2:e
            }
        )
    }
    handleChange23=(e)=>
    {
        this.setState(
            {
                academicsec3:e
            }
        )
    }
    handleChange24=(e)=>
    {
        this.setState(
            {
                introduction:e.target.value
            }
        )
    }



    handleChangeQue1=(e)=>
    {
        this.setState
        ({
            safeque1:e.target.value
        })
    }

    handleChangeQue2=(e)=>
    {
        this.setState
        ({
            safeque2:e.target.value
        })
    }

    handleChangeQue3=(e)=>
    {
        this.setState
        ({
            safeque3:e.target.value
        })
    }


    checkName=(Name)=>
    {
        let filter =  /^\s*$/g;
        if(Name==""||filter.test(Name))
        {
            Modal.error({
                title: '亲，姓名不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    checkAddress=(address)=>
    {
        let filter =  /^\s*$/g;
        if(address==""||filter.test(address))
        {
            Modal.error({
                title: '亲，住址不能为空哦',
            });
            return false;
        }
        else
        {

            return true;
        }
    }

    checkworkspace_cn=(workspace_cn)=>
    {
        let filter =  /^\s*$/g;
        if(workspace_cn==""||filter.test(workspace_cn))
        {
            Modal.error({
                title: '亲，工作单位不能为空哦',
            });

            return false;
        }
        else
        {
            return true;
        }
    }

    checkphonenum=(phonenum)=>
    {
        let filter =  /^\s*$/g;
        if(phonenum==""||filter.test(phonenum))
        {
            Modal.error({
                title: '亲，电话号码不能为空哦',
            });
            return false;
        }
        else
        {
            return true;
        }
    }

    componentWillMount=()=>
    {
        this.RegiterFuction3();
        this.RegiterFuction4();
        this.RegiterFuction5();
        this.RegiterFuction6();
    }


    render()
    {return(
            <Layout id='beijing'>
                <Header/>
                <Layout>
                    <Content>
                        <Layout>

                            <div id='ojbk'>
                                <Content>账号\邮箱
                                    <div>
                                        <Input type="email" placeholder="请输入用户邮箱" autosize style={{width:'20%'}} onChange={this.handleChange0} value={this.state.email}   />
                                        <div style={{ margin: '24px 0'}} />
                                    </div>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    密码
                                    <div>
                                        <Input type="password" placeholder="请输入密码" autosize style={{width:'20%'}} onChange={this.handleChange1} value={this.state.password}/>
                                        <div style={{ margin: '24px 0' }} />
                                    </div>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    确认密码
                                    <div>
                                        <Input type="password" placeholder="请输入确认密码" autosize style={{width:'20%'}} onChange={this.handleChange2} value={this.state.password2}/>
                                        <div style={{ margin: '24px 0' }} />
                                    </div>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入姓名
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange6} value={this.state.name}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入姓名拼音
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange7} value={this.state.name_pinyin}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>您的性别是
                                <Select id='sel ' onChange={this.handleChange13} value={this.state.Seqid2} style={{width:'20%'}}>
                                    <Option value={1}>男
                                    </Option>
                                    <Option value={2}>女
                                    </Option>
                                </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入通信地址
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange4} value={this.state.address}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入邮政编号
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange14} value={this.state.postcode}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入工作单位
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange5} value={this.state.workspace_cn}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入工作单位(英文，可选填）
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange12} value={this.state.workspace_en}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择专业
                                    <Select  onChange={this.handleChange15} value={this.state.major} style={{width:'150px' }}>
                                        {this.state.typelist3.map(item =>(
                                            <Option value={item.id}>{item.major}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择学历
                                    <Select  onChange={this.handleChange16} value={this.state.education} style={{width:'150px' }}>
                                        {this.state.typelist2.map(item =>(
                                            <Option value={item.id}>{item.education}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入职称
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange17} value={this.state.title}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入办公室电话
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange18} value={this.state.officetel}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入手机号码
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange8} value={this.state.phonenum}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择国家/地区
                                    <Select  onChange={this.handleChange19} value={this.state.location} style={{width:'150px' }}>
                                        {this.state.typelist4.map(item =>(
                                            <Option value={item.id}>{item.location}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入研究方向
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChange20} value={this.state.researchdir}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择学术领域
                                    <Select  onChange={this.handleChange21} value={this.state.academicsec1} style={{width:'150px' }}>
                                        {this.state.typelist1.map(item =>(
                                            <Option value={item.id}>{item.academicsec}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择学术领域
                                    <Select  onChange={this.handleChange22} value={this.state.academicsec2} style={{width:'150px' }}>
                                        {this.state.typelist1.map(item =>(
                                            <Option value={item.id}>{item.academicsec}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请选择学术领域
                                    <Select  onChange={this.handleChange23} value={this.state.academicsec3} style={{width:'150px' }}>
                                        {this.state.typelist1.map(item =>(
                                            <Option value={item.id}>{item.academicsec}</Option>
                                        ))}
                                    </Select>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    请输入个人介绍
                                <TextArea rows={4} onChange={this.handleChange24} value={this.state.introduction}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    密保问题一
                                    <Select id='sel '  onChange={this.handleChange9} value={this.state.Seqid1} style={{width:'20%'}}>
                                        <Option value={1} style={{width:'100%'}}>你的名字？
                                        </Option>
                                        <Option value={2} style={{width:'100%'}}>你最喜欢的人的名字？
                                        </Option>
                                        <Option value={3} style={{width:'100%'}}>你的曾用名？
                                        </Option>
                                        <Option value={4} style={{width:'100%'}}>你的出生地？
                                        </Option>
                                    </Select>
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChangeQue1} value={this.state.safeque1}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    密保问题二
                                    <Select id='sel ' onChange={this.handleChange10} value={this.state.Seqid2} style={{width:'20%'}}>
                                        <Option value={1} style={{width:'100%'}}>你的名字？
                                        </Option>
                                        <Option value={2} style={{width:'100%'}}>你最喜欢的人的名字？
                                        </Option>
                                        <Option value={3} style={{width:'100%'}}>你的曾用名？
                                        </Option>
                                        <Option value={4} style={{width:'100%'}}>你的出生地？
                                        </Option>
                                    </Select>
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChangeQue2} value={this.state.safeque2}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    密保问题三
                                    <Select id='sel '  onChange={this.handleChange11} value={this.state.Seqid3} style={{width:'20%'}}>
                                        <Option value={1} style={{width:'100%'}}>你的名字？
                                        </Option>
                                        <Option value={2} style={{width:'100%'}}>你最喜欢的人的名字？
                                        </Option>
                                        <Option value={3} style={{width:'100%'}}>你的曾用名？
                                        </Option>
                                        <Option value={4} style={{width:'100%'}}>你的出生地？
                                        </Option>
                                    </Select>
                                    <Input  placeholder="请输入内容" autosize style={{width:'20%'}} onChange={this.handleChangeQue3} value={this.state.safeque3}/>
                                </Content>
                                <div style={{ margin: '24px 0' }} />
                                <Content>
                                    <Button type="primary"  onClick={this.check}>注册</Button>
                                </Content>
                                <div style={{ margin: '24px 0' }} />

                            </div>
                         </Layout>
                    </Content>
                </Layout>

            </Layout>
        )}}
export default  Registerfjj;

