import React from "react";
import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab,Pagination,Tooltip,OverlayTrigger,Popover} from "react-bootstrap";
import {AppsModelList} from "./AppsModelList";
import {AppsScoreList} from "./AppsScoreList";
import {Link, Redirect} from "react-router-dom";
import store from "../../store";
import {connect} from "react-redux";
import {APPID1,APPID2,APPID3,APPNAME1,APPNAME2,APPNAME3,getUserDetailsOrRestart,SUCCESS,INPROGRESS} from "../../helpers/helper.js"
import {getAppsStockList,getStockAnalysis,updateStockSlug,handleStockDelete,handleStockModelRename,openAppsLoader,callStockAnalysisApi} from "../../actions/appActions";
import Dialog from 'react-bootstrap-dialog'
import {AppsCreateStockAnalysis} from "./AppsCreateStockAnalysis";
import {STATIC_URL} from "../../helpers/env.js";
import {DetailOverlay} from "../common/DetailOverlay";
import {AppsLoader} from "../common/AppsLoader";

var dateFormat = require('dateformat');

@connect((store) => {
    return {login_response: store.login.login_response,
        currentAppId:store.apps.currentAppId,
        stockList: store.apps.stockAnalysisList,
         dataPreviewFlag: store.datasets.dataPreviewFlag,
         stockAnalysisFlag:store.apps.stockAnalysisFlag,
         stockSlug:store.apps.stockSlug,
        signal: store.signals.signalAnalysis,
    };
})

export class StocksCard extends React.Component {
    constructor(props) {
        super(props);
    }
    getPreviewData(e) {
        this.props.dispatch(updateStockSlug(e.target.id))
        this.props.dispatch(getStockAnalysis(e.target.id))
        this.props.loadfunc();
    }
    handleDelete(slug){
        this.props.dispatch(handleStockDelete(slug,this.dialog));
    }
    handleRename(slug,name){
        this.props.dispatch(handleStockModelRename(slug,this.dialog,name));
    }

    openDataLoaderScreen(data){
        this.props.dispatch(openAppsLoader(data.completed_percentage,data.completed_message));
        this.props.dispatch(callStockAnalysisApi(data.slug));
    }

    render() {
                const stockAnalysisList = this.props.data;
      
            const stockTemplateList = stockAnalysisList.map((data, i) => {
                var stockLink = <a class="cursor" id={data.slug} onClick={this.getPreviewData.bind(this)}>{data.name}</a>;
                var percentageDetails = "";
                if(data.status == INPROGRESS){
                    percentageDetails =   <div class=""><i className="fa fa-circle inProgressIcon"></i><span class="inProgressIconText">{data.completed_percentage >= 0 ?data.completed_percentage+' %':"In Progress"}</span></div>;
                    stockLink = <a class="cursor" onClick={this.openDataLoaderScreen.bind(this,data)}> {data.name}</a>;
                }else if(data.status == SUCCESS){
                    data.completed_percentage = 100;
                    percentageDetails =   <div class=""><i className="fa fa-check completedIcon"></i><span class="inProgressIconText">{data.completed_percentage}&nbsp;%</span></div>;
                }else if(data.status == FAILED){
                    percentageDetails =  <div class=""><font color="#ff6600">Failed</font></div>
                }
                var permissionDetails = data.permission_details;
                var isDropDown = permissionDetails.remove_stock || permissionDetails.rename_stock; 
                return (
                        <div className="col-md-3 top20 list-boxes" key={i}>
                        <div className="rep_block newCardStyle" name={data.name}>
                        <div className="card-header"></div>
                        <div className="card-center-tile">
                        <div className="row">
                        <div className="col-xs-12">
                        <h5 className="title newCardTitle pull-left">
                        {stockLink}
                        </h5>
						<div className="pull-right"><img  src={ STATIC_URL + "assets/images/apps_model_icon.png" } alt="LOADING"/></div>
						<div className="clearfix"></div>
                        <div className="clearfix"></div>
                        {percentageDetails}
                           </div>
                          </div>
                        </div>
                        <div className="card-footer">
                        <div className="left_div">
                        <span className="footerTitle"></span>{getUserDetailsOrRestart.get().userName}
                        <span className="footerTitle">{dateFormat(data.created_at, "mmm d,yyyy HH:MM")}</span>
                        </div>

						{
                                isDropDown == true ? <div class="btn-toolbar pull-right">
                        <a className="dropdown-toggle more_button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More..">
                        <i className="ci zmdi zmdi-hc-lg zmdi-more-vert"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-right drp_cst_width" aria-labelledby="dropdownMenuButton">
						<li className="xs-pl-20 xs-pr-20 xs-pt-10 xs-pb-10"><DetailOverlay details={data}/> </li>
						
						<li className="xs-pl-20 xs-pr-20 xs-pb-10">
						{permissionDetails.rename_stock == true ?
                        <span onClick={this.handleRename.bind(this, data.slug, data.name)}>
                        <a className="dropdown-item btn-primary" href="#renameCard" data-toggle="modal">
                        <i className="fa fa-pencil"></i>
                        &nbsp;&nbsp;Rename</a>
                        </span>:""}
                        {permissionDetails.remove_stock == true ?
                        <span onClick={this.handleDelete.bind(this, data.slug)}>
                        <a className="dropdown-item btn-primary" href="#deleteCard" data-toggle="modal">
                        <i className="fa fa-trash-o"></i>&nbsp;&nbsp;{data.status == "INPROGRESS"
                                ? "Stop"
                                : "Delete"}</a>
                        </span>:""}
						<div className="clearfix"></div>
						</li>
						
						</ul>
                        </div>
                        :""}
                         

                        {/*popover*/}

                        </div>
                        </div>
                        <Dialog ref={(el) => { this.dialog = el }} />
                        </div>
                )
            });
                
            return(<div >
                    {
                        (stockTemplateList.length>0)
                        ?(stockTemplateList)
                        :(<div><div className="text-center text-muted xs-mt-50"><h2>No results found..</h2></div></div>)
                    }
                    </div>);

        } 

}
