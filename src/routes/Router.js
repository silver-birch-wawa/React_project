import React,{ Component } from 'react';
import { Router, Route, hashHistory} from 'react-router';

import Home from '../templates/Home';
import E_Admin from '../templates/E_Admin';
import Author from '../templates/Author';
import MainEditor from '../templates/MainEditor';
import Previewer from '../templates/Previewer';
import Editor from '../templates/Editor';
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
    </Router>
      );
  }
}
export default Routes;