import React from "react";
import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab} from "react-bootstrap";
import {AppsModelList} from "./AppsModelList";
import {AppsScoreList} from "./AppsScoreList";
import {Link, Redirect} from "react-router-dom";
import store from "../../store";
import {connect} from "react-redux";
import {activateModelScoreTabs} from "../../actions/appActions";

@connect((store) => {
	return {login_response: store.login.login_response, 
		modelList:store.apps.modelList,currentAppId:store.apps.currentAppId,
		scoreList: store.apps.scoreList,
		activateModelScoreTabs:store.apps.activateModelScoreTabs,
		};
})


export class Apps extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  
  modifyUrl(tabId){
	  this.props.dispatch(activateModelScoreTabs(tabId));
      //this.props.history.push('/apps/'+store.getState().apps.currentAppId+'/models?page=1')
  }
  render() {
    console.log("apps is called##########3");
    console.log(this.props)
   let models = <AppsModelList history={this.props.history} match={this.props.match}/>
  
  let scores = <AppsScoreList history={this.props.history} match={this.props.match}/>
  
    return (
          <div className="side-body">
            <div className="main-content">
            <Tabs activeKey={store.getState().apps.activateModelScoreTabs} onSelect={this.modifyUrl.bind(this)} >
            <Tab  eventKey={1} title="Models">{models}</Tab>
            <Tab eventKey={2} title="Scores">{scores}</Tab>
          </Tabs>
          </div>
        </div>
      );
  }
}
