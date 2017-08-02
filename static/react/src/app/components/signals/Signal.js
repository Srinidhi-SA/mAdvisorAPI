import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {getSignalAnalysis} from "../../actions/signalActions";




@connect((store) => {
  return {
       login_response: store.login.login_response,
     signal: store.signals.signalAnalysis};
})

export class Signal extends React.Component {
  constructor(){
    super();
  }
  componentWillMount() {
    //alert("id:" + this.props.errandId);
    console.log(store.getState().signals.signalAnalysis);
      this.props.dispatch(getSignalAnalysis(sessionStorage.userToken,this.props.match.params.slug));
  }
  render() {

    console.log("Signals is called$$$$$$$$$$$$$$!!");
    console.log(this.props);
    return(
    <div>
        Hi you are in Signals
    </div>
  );
  }
}
