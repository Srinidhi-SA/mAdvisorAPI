import React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab} from "react-bootstrap";
import {AppsCreateScore} from "./AppsCreateScore";
import {Card} from "../signals/Card";
import {getListOfCards,getAppsScoreSummary} from "../../actions/appActions";
import {Button} from "react-bootstrap";
import {STATIC_URL} from "../../helpers/env.js";
import {isEmpty} from "../../helpers/helper";
import {API} from "../../helpers/env";

@connect((store) => {
	return {login_response: store.login.login_response, 
		scoreList:store.apps.scoreList,scoreSummary:store.apps.scoreSummary,
		scoreSlug:store.apps.scoreSlug,
		};
})


export class AppsScoreDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
	  if(!isEmpty(store.getState().apps.scoreSummary)){
		  if(store.getState().apps.scoreSummary.slug != store.getState().apps.scoreSlug)
		  this.props.dispatch(getAppsScoreSummary(store.getState().apps.scoreSlug));
	  }else{
		  this.props.dispatch(getAppsScoreSummary(store.getState().apps.scoreSlug));
	  }
	  
  }
  render() {
    console.log("apps Score Detail View is called##########3");
    const scoreSummary = store.getState().apps.scoreSummary;
    console.log(scoreSummary)
	if (!$.isEmptyObject(scoreSummary)) {
		console.log(this.props)
		let listOfCardList = getListOfCards(scoreSummary.data.listOfCards)
		let cardDataList = listOfCardList.map((data, i) => {
		
            return (<Card key={i} cardData={data} />)
			
		                    });
		if(listOfCardList){
			return (
			          <div className="side-body">
			          
			          <div className="main-content">
			          <div className="row">
		                <div className="col-md-12">
		                 
		                <div className="panel panel-mAd documentModeSpacing ">
		                    <div className="panel-heading">
		                      <h2>{store.getState().apps.scoreSummary.name}</h2>
		                      <div className="clearfix"></div>
		                    </div>
		                   <div className="panel-body">
		                   <div className="row-fluid"> 
		           
		                  {cardDataList}

		                    </div>
		                    
		                    
		                    <div className="row">
		                    <div className="col-md-2 col-md-offset-11">
		                   	
		                    	<a  href={'http://174.129.163.0:8001/'+store.getState().apps.scoreSlug+'/data.csv'}id="download" className="btn btn-primary" download>Download</a>
		                   </div>
		                   </div>
		             </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		  
		             
			           
			          </div>
			      );	
		}
	}
	else{
		return (
				 <div className="side-body">
			        <div className="page-head">
			        </div>
			        <div className="main-content">
			          <img id="loading" src={ STATIC_URL + "assets/images/Preloader_2.gif" } />
			        </div>
			      </div>
			    );
	}
	 
    
  }
}
