import React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab,Button} from "react-bootstrap";
import {AppsCreateScore} from "./AppsCreateScore";
import {Card} from "../signals/Card";
import {getListOfCards,getAppsModelSummary,updateModelSlug,handleExportAsPMMLModal,getAppDetails,updateModelSummaryFlag, getAppsAlgoList, clearAppsAlgoList} from "../../actions/appActions";
import {storeSignalMeta} from "../../actions/dataActions";
import CircularProgressbar from 'react-circular-progressbar';
import {STATIC_URL} from "../../helpers/env.js"
import {isEmpty} from "../../helpers/helper";
import {Link} from "react-router-dom";
import {ExportAsPMML} from "./ExportAsPMML";
import {AppsModelHyperDetail} from "./AppsModelHyperDetail"

@connect((store) => {
	return {login_response: store.login.login_response,
		modelList:store.apps.modelList,modelSummary:store.apps.modelSummary,
		modelSlug:store.apps.modelSlug,
		currentAppId:store.apps.currentAppId,
		currentAppDetails:store.apps.currentAppDetails,
		setAppsLoaderValues: store.apps.setAppsLoaderValues,
		algoList: store.apps.algoList
	};
})


export class AppsModelDetail extends React.Component {
  constructor(props) {
    super(props);
		this.state={
			showHyperparameterSummary:false
		}
  }
  componentWillMount() {
		this.props.dispatch(storeSignalMeta(null,this.props.match.url));
		if(this.props.currentAppDetails == null)
		this.props.dispatch(getAppDetails(this.props.match.params.AppId));
		//It will trigger when refresh happens on url
		if(isEmpty(this.props.modelSummary)){
			this.props.dispatch(getAppsModelSummary(this.props.match.params.slug));
			this.props.dispatch(updateModelSlug(this.props.match.params.slug));
		}
		this.props.dispatch(clearAppsAlgoList());
		this.props.dispatch(getAppsAlgoList(1));
	}
	
	print() {
		window.print();
	}

	componentDidMount() {
		let currentModel= this.props.modelSlug;
		if(Object.keys(this.props.modelList).length != 0 && this.props.modelList.data.filter(i=>i.slug === currentModel)[0].viewed === false){
			$(".notifyBtn").trigger('click');
		}
		window.scrollTo(0, 0);
		if(!isEmpty(store.getState().apps.modelSummary)){
			if(store.getState().apps.modelSummary.slug != store.getState().apps.modelSlug)
			this.props.dispatch(getAppsModelSummary(store.getState().apps.modelSlug));
		}
	}
	componentWillReceiveProps(newProps){
		if(newProps.algoList.data != undefined){
			let selAlgoList = newProps.algoList.data.filter(i=>i.trainer===this.props.modelSlug)
			let noOfHeads = $(".sm-mb-20").length;
			for(var i=0;i<noOfHeads;i++){
				let algorithmName = $(".sm-mb-20")[i].innerText.replace(/ /g,'').toLocaleUpperCase();
				if($(".sm-mb-20")[i].parentNode.parentNode.children.length <= 2){
					let info = document.createElement('a');
					var att = document.createAttribute("class");
					att.value = "summaryLink";
					info.setAttributeNode(att);
					info.innerText = "For More Info Click Here";

					let sel = selAlgoList.filter(i=>(i.algorithm).replace(/ /g,'').toLocaleUpperCase() === algorithmName)
					info.href = (sel.length !=0)?
					this.props.match.url.replace("models/"+this.props.modelSlug,"modelManagement/"+sel[0].slug):"#"
					$(".sm-mb-20")[i].parentNode.parentNode.appendChild(info);
				}
			}
		}
	}

  componentDidUpdate(){
      $(".chart-data-icon").next("div").next("div").removeClass("col-md-7 col-md-offset-2").addClass("col-md-10")
  }
  handleExportAsPMMLModal(flag){
      this.props.dispatch(handleExportAsPMMLModal(flag))
  }
  updateModelSummaryFlag(flag){
      this.props.dispatch(updateModelSummaryFlag(flag))
  }
	gotoHyperparameterSummary(){
		this.setState({showHyperparameterSummary:true})
	}
	showMore(evt){
			evt.preventDefault();
			$.each(evt.target.parentElement.children,function(k1,v1){
				$.each(v1.children,function(k2,v2){
					if(v2.className == "modelSummery hidden")
					v2.className = "modelSummery";
					else if(v2.className == "modelSummery")
					v2.className = "modelSummery hidden";
				})
			});
		if(evt.target.innerHTML == "Show More")
		evt.target.innerHTML = "Show Less";
		else
		evt.target.innerHTML = "Show More";
	}
  render() {
		if(this.state.showHyperparameterSummary)
		return(<AppsModelHyperDetail match={this.props.match}/>)
    console.log("apps Model Detail View is called##########3");
  	const modelSummary = store.getState().apps.modelSummary;
	 	var showExportPmml = true;
		var showCreateScore = true;
		var hyperParameterData;
	let mlink = window.location.pathname.includes("analyst")?"/analyst":"/autoML"
	const modelLink = "/apps/"+this.props.match.params.AppId+ mlink + "/models";
	if (!$.isEmptyObject(modelSummary)) {
		console.log(this.props)
		 hyperParameterData = store.getState().apps.modelSummary.data.model_hyperparameter;
        showExportPmml = modelSummary.permission_details.downlad_pmml;
		showCreateScore = modelSummary.permission_details.create_score;
		//if(this.props.currentAppDetails != null && this.props.currentAppDetails.app_type == "REGRESSION"){
				var listOfCardList = modelSummary.data.model_summary.listOfCards;	var componentsWidth = 0;
				var cardDataList = listOfCardList.map((data, i) => {
				var clearfixClass = "col-md-"+data.cardWidth*0.12+" clearfix";
				var nonClearfixClass = "col-md-"+data.cardWidth*0.12;
				var cardDataArray = data.cardData;
				var isHideData = $.grep(cardDataArray,function(val,key){
					return(val.dataType == "html" && val.classTag == "hidden");
				});
				if(data.cardWidth == 100){
					componentsWidth = 0;
					return (<div className={clearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/></div>)
				}
				else if(componentsWidth == 0 || componentsWidth+data.cardWidth > 100){
					componentsWidth = data.cardWidth;
					return (<div className={clearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/>{isHideData.length>0?<a href="" onClick={this.showMore.bind(this)}>Show More</a>:""}</div>)
				}
				else{
					componentsWidth = componentsWidth+data.cardWidth;
									return (<div className={nonClearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/></div>)
							}
				});
		/*}
		else{
			var listOfCardList = getListOfCards(modelSummary.data.model_summary.listOfCards);
			var cardDataList = listOfCardList.map((data, i) => {
				if( i != 0 ){
					if(i%2 != 0)
					return (<div className="col-md-6 xs-p-30 clearfix"><Card cardData={data} /></div>)
					else
					return (<div className="col-md-6 xs-p-30"><Card cardData={data} /></div>)
				}
				else return (<Card key={i} cardData={data} />)
			});
		}*/
		
		if(listOfCardList){
			return (
			          <div className="side-body">

			          <div className="main-content">
			          <div className="row">
		                <div className="col-md-12">
							<h3 className="xs-mt-0">{store.getState().apps.modelSummary.name}
		                      <div className="btn-toolbar pull-right">
		                        <div className="btn-group">
		                        <button type="button" className="btn btn-default" onClick={this.print.bind(this)} title="Print Document"><i className="fa fa-print"></i></button>
		                          <button type="button" className="btn btn-default" disabled = "true" title="Document Mode">
		                             <i class="zmdi zmdi-hc-lg zmdi-view-web"></i>
		                            </button>
							   <Link className="btn btn-default continue btn-close" to={modelLink} onClick={this.updateModelSummaryFlag.bind(this,false)}>

		                            <i class="zmdi zmdi-hc-lg zmdi-close"></i>

								 </Link>
		                        </div>
		                      </div>
		                     </h3>
							 <div className="clearfix"></div>
							 
		                <div className="panel panel-mAd documentModeSpacing box-shadow">
		                  
		                   <div className="panel-body no-border">
		                   <div className="container-fluid">

		                  {cardDataList}

		                    </div>
							 
		                    <div className="col-md-12 text-right xs-mt-30">
												{!$.isEmptyObject(hyperParameterData)?
												<span>
												<Button bsStyle="primary" onClick={this.gotoHyperparameterSummary.bind(this,true)}><i className="zmdi zmdi-hc-lg zmdi-undo"></i> Back</Button>
												<span className="xs-pl-10"></span></span>:""}
												{showExportPmml?
		                    <Button bsStyle="primary" onClick={this.handleExportAsPMMLModal.bind(this,true)}>Export As PMML</Button>:""}
		                  	{showCreateScore? <AppsCreateScore match={this.props.match}/>:""}
		                   </div>
		                    
		             </div>
		             <ExportAsPMML/>
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
