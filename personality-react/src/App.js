import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import SurveyComponent from './SurveyComponent';
import React, { Component } from 'react';
import SurveyResultComponent from './SurveyResultComponent';

class App extends Component {
  render() {
    return (
       <Router>
           
            
            <Switch>
               <Route exact path='/' component={SurveyComponent}></Route>
              <Route exact path='/survey' component={SurveyComponent}></Route>
              <Route exact path='/survey-result' location={window.location} component={SurveyResultComponent}></Route>
              
            </Switch>
        
       </Router>
   );
  }
}

export default App;
