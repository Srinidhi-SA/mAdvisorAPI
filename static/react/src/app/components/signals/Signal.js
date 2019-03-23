import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import store from "../../store";
import {getSignalAnalysis} from "../../actions/signalActions";
import {MasterSummary} from "./MasterSummary";
import {isEmpty,getUserDetailsOrRestart} from "../../helpers/helper";
import {MainHeader} from "../common/MainHeader";
import Breadcrumb from 'react-breadcrumb';
import {STATIC_URL} from "../../helpers/env.js";
import Notifications, {notify} from 'react-notify-toast';




@connect((store) => {
  return {login_response: store.login.login_response,
          signal: store.signals.signalAnalysis,
          selectedSignal: store.signals.selectedSignal,
          signalList: store.signals.signalList.data
          //selectedSignal: store.signals.signalAnalysis
        // variableType:store.signals.variableType
      };
})

export class Signal extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
  if(isEmpty(this.props.signal)){
      alert("in will mount!!")
	  this.props.dispatch(getSignalAnalysis(getUserDetailsOrRestart.get().userToken, this.props.match.params.slug));
	  }
  }
  render() {

     console.log("selected Signal is called$$$$$$$$$$$$$$!!");
     console.log(this.props);
    if(isEmpty(this.props.signal)){

      return(
        <div className="side-body">
        {/*<MainHeader/>*/}
        <div className="page-head">
          <div class="row">
            <div class="col-md-12">
            {/*<Breadcrumb path={[{
                path: '/signals',
                label: 'Signals'
              },
              {
                path:'/signals'+this.props.signal.name,
                label: this.props.signal.name
              }
            ]}/>
            </div>
            <div class="col-md-8">
              {/*<h2>{this.props.signal.name}</h2>*/}
            </div>
            </div>
          <div class="clearfix"></div>
        </div>
          <div className="main-content">
          <img id = "loading" src={ STATIC_URL + "assets/images/Preloader_2.gif" } />
          </div>
          </div>
      );
    }else if(!$.isPlainObject(this.props.signal)){
      let myColor = { background: '#00998c', text: "#FFFFFF" };
      notify.show("You are not authorized to view the signal.", "custom", 2000,myColor);
     //var signlasPage = "/signals";
              return (<Redirect to="/signals"/>);
    }
    else
    return (<MasterSummary signalId={this.props.match.params.slug} />);

}
}
