import React, { Component } from 'react';
// import { BrowserRouter, Route, Link } from "react-router-dom";
import logo from '../img/logo.svg';
import './testApp.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul className="App-intro">
          <li><a href="#/authorCenter">作者</a></li>
          <li><a href="#/editorCenter">编辑</a></li>
          <li><a href="#/adminCenter">管理员</a></li>
        </ul>
      </div>
    );
  }
}

export default App;
