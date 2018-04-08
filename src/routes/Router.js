import React,{ Component } from 'react';
import { Router, Route, hashHistory} from 'react-router';

import Home from '../templates/Home';
import E_Admin from '../templates/E_Admin';
import Author from '../templates/Author';
import MainEditor from '../templates/MainEditor';
import Previewer from '../templates/Previewer';
import Editor from '../templates/Editor';
import Personal_info_change from '../templates/Personal_info_change';
class Routes extends React.Component{
  render(){
    return  (
     <Router history={hashHistory}>
            <Route path="/" component={Home}/>
            <Router path="/Previewer" component={Previewer}/>
            <Router path="/MainEditor" component={MainEditor}/>
            <Router path="/Author" component={Author}/>
            <Router path="/Editor" component={Editor}/>
            <Router path="/E_Admin" component={E_Admin}/>
            <Router path="/Personal_info_change" component={Personal_info_change}/>
    </Router>
      );
  }
}
export default Routes;