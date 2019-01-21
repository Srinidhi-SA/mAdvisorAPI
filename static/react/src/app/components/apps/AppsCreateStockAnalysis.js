import React from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {push} from "react-router-redux";
import {Modal,Button,Tab,Row,Col,Nav,NavItem} from "react-bootstrap";
import store from "../../store";
import {updateCreateStockPopup,addDefaultStockSymbolsComp,crawlDataForAnalysis,addMoreStockSymbols,removeStockSymbolsComponents,handleInputChange} from "../../actions/appActions";
import {storeSignalMeta} from "../../actions/dataActions";
import { Scrollbars } from 'react-custom-scrollbars';


@connect((store) => {
	return {login_response: store.login.login_response, 
		currentAppId:store.apps.currentAppId,
		appsCreateStockModal:store.apps.appsCreateStockModal,
		appsStockSymbolsInputs:store.apps.appsStockSymbolsInputs,
		};
})

export class AppsCreateStockAnalysis extends React.Component {
	constructor(props) {
		super(props);
		this.selectedData="";
		this._link = "";
	}
	componentWillMount() {
		this.props.dispatch(updateCreateStockPopup(false));
		this.props.dispatch(storeSignalMeta(null,this.props.match.url));
		this.props.dispatch(addDefaultStockSymbolsComp())
	}
	updateCreateStockPopup(flag){
    	this.props.dispatch(updateCreateStockPopup(flag))
    }
	handleInputChange(event){
		this.props.dispatch(handleInputChange(event))
	}
	removeStockSymbolsComponents(data,event){
		this.props.dispatch(removeStockSymbolsComponents(data));
	}
	addMoreStockSymbols(event){
		this.props.dispatch(addMoreStockSymbols(event));
	}
	crawlDataForAnalysis(){
		var url = $("#createStockUrl").val();
		var analysisName = $("#createStockAnalysisName").val();
		var urlForNews = $("#createStockUrlNews").val();
		this.props.dispatch(crawlDataForAnalysis(url,analysisName,urlForNews));
	}
	render() {
		 console.log("apps create score list is called##########3");
		  let stockSymbolsList = this.props.appsStockSymbolsInputs;
		  const templateTextBoxes = stockSymbolsList.map((data,id) =>{
			  return (<div className="row"><div className="form-group" id={data.id}>
				<label for="fl1" className="col-sm-2 control-label"><b>{id+1}.</b></label>
				<div className="col-sm-7">
				<input  id={data.id} type="text" name={data.name}  onChange={this.handleInputChange.bind(this)} value={data.value} className="form-control"/>
				</div>
				<div className="col-sm-1 cursor" onClick={this.removeStockSymbolsComponents.bind(this,data)}><i className="fa fa-minus-square-o text-muted"></i></div>
				</div></div>);
		  });
		return (
				<div class="col-md-3 top20 list-boxes" onClick={this.updateCreateStockPopup.bind(this,true)}>
				<div class="newCardStyle firstCard">
				<div class="card-header"></div>
				<div class="card-center newStoryCard">
								
				<div class="col-xs-3 col-xs-offset-2 xs-pr-0"><i class="fa fa-file-text-o fa-4x"></i></div>
				<div class="col-xs-6 xs-m-0 xs-pl-0"><small>Analyze</small></div>
				
				</div>
				</div>
				
				<div id="newCreateStock"  role="dialog" className="modal fade modal-colored-header">
				<Modal show={store.getState().apps.appsCreateStockModal} onHide={this.updateCreateStockPopup.bind(this,false)} dialogClassName="modal-colored-header">
				<Modal.Header closeButton>
				<h3 className="modal-title">Input - Stocks and Data </h3>
				</Modal.Header>


				<Modal.Body>
				<form role="form" className="form-horizontal">
				<div className="form-group">
					<label className="col-sm-4 control-label">Url for Stock Prices :</label>
					<div class="col-sm-8">
						<input type="text" name="createStock" id="createStockUrl"  required={true} className="form-control input-sm" />
					</div>
				</div>
			 
				<div className="form-group">
					<label className="col-sm-4 control-label">URL for News Articles :</label>
					 <div class="col-sm-8">
					 <input type="text" name="createStockNews" id="createStockUrlNews"  required={true} className="form-control input-sm" />
					 </div>
				 </div>
				 <div className="form-group">
				 
						<label className=" control-label col-md-4">Ticker Symbols to Analyze :</label>
						<div class="col-md-8 text-right">
						<Button bsStyle="default" onClick={this.addMoreStockSymbols.bind(this)}> <i className="fa fa-plus"></i> Add</Button>
						</div>
						
				</div>
				<div class="col-md-8 col-md-offset-4">
				  
				<div >
				<Scrollbars style={{ height: 200 }} renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
		        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}>
	             {templateTextBoxes}
				 </Scrollbars>
				 </div>
	             
				 
				  </div>
<div className="xs-pb-25 clearfix"></div>
				<div class="form-group">
					<label className="col-md-4 control-label">Name your Analysis :</label>
					<div class="col-md-8">
					<input type="text" name="createStockAnalysisName" id="createStockAnalysisName"  required={true} className="form-control input-sm" />
					</div>
				</div>
				 
	             <div className="clearfix"></div>
	              </form>
	              <div className="clearfix"></div>
				</Modal.Body>
				<Modal.Footer>
				<Button className="btn btn-primary md-close" onClick={this.updateCreateStockPopup.bind(this,false)}>Close</Button>
                <Button bsStyle="primary" onClick={this.crawlDataForAnalysis.bind(this,false)}>Extract Data</Button>
				</Modal.Footer>
				</Modal>
				</div>
				</div>


		)
	}

}	  