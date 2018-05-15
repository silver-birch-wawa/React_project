/*
* @Author: lixiwei
* @Date:   2018-03-12 15:47:33
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-21 17:24:12
*/
import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import AuthorCenter from './templates/AuthorCenter';
import EditorCenter from './templates/EditorCenter';
import AdminCenter from './templates/AdminCenter';

import App from './App';
import Registerfjj from './templates/appTemplates/register/Registerfjj';
import Login from './templates/appTemplates/login/Login';
import Forget from './templates/appTemplates/changePassword/Forget';
import Change from './templates/appTemplates/changePassword/Change';
import SafeQuestion from './templates/appTemplates/changePassword/SafeQuestion'
import Show from './templates/appTemplates/show/Show'
import Seek from './templates/appTemplates/seek/Seek'
import seekByDate from './templates/appTemplates/seek/seekByDate';

import Home from './templates/Home';
import E_Admin from './templates/E_Admin';
import Author from './templates/Author';
import MainEditor from './templates/MainEditor';
import Previewer from './templates/Previewer';
import Editor from './templates/Editor';
import Personal_info_change from './templates/Personal_info_change';

class Routes extends React.Component{
  render() {
    return  (
        <LocaleProvider locale={zh_CN}>
            <Router history={hashHistory}>
                {/*李西炜start*/}
                <Route path="/editorCenter" component={EditorCenter} />
                <Route path="/authorCenter" component={AuthorCenter} />
                <Route path="/adminCenter" component={AdminCenter} />
                {/*李西炜end*/}
                {/*冯俊钧start*/}
                <Route path="/" component={App} />
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Registerfjj}/>
                <Route path="/forget" component={Forget}/>
                <Route path="/change" component={Change}/>
                <Route path="/safeQuestion" component={SafeQuestion}/>
                <Route path="/show" component={Show}/>
                <Route path="/seek" component={Seek}/>
                <Route path="/seekByDate" component={seekByDate}/>
                {/*冯俊钧end*/}
                {/*王骞start*/}
                <Route path="/Home" component={Home}/>
                <Router path="/Previewer" component={Previewer}/>
                <Router path="/MainEditor" component={MainEditor}/>
                <Router path="/Author" component={Author}/>
                <Router path="/Editor" component={Editor}/>
                <Router path="/E_Admin" component={E_Admin}/>
                <Router path="/Personal_info_change" component={Personal_info_change}/>
                {/*王骞end*/}
            </Router>
        </LocaleProvider>
     );
  }
}


export default Routes;