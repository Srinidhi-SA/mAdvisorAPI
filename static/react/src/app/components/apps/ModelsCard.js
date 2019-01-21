import React from "react";
import store from "../../store";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {push} from "react-router-redux";

import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab,Pagination,Tooltip,OverlayTrigger,Popover} from "react-bootstrap";
import {AppsCreateModel} from "./AppsCreateModel";
import {getAppsModelList,getAppsModelSummary,updateModelSlug,updateScoreSummaryFlag,
    updateModelSummaryFlag,handleModelDelete,handleModelRename,storeModelSearchElement,storeAppsModelSortElements,openAppsLoader,createModelSuccessAnalysis} from "../../actions/appActions";
    import {DetailOverlay} from "../common/DetailOverlay";
    import {SEARCHCHARLIMIT,getUserDetailsOrRestart,SUCCESS,INPROGRESS} from  "../../helpers/helper"
    import {STATIC_URL} from "../../helpers/env.js";
    import Dialog from 'react-bootstrap-dialog'
    import {DataUploadLoader} from "../common/DataUploadLoader";
    
    var dateFormat = require('dateformat');
    
    
    @connect((store) => {
        return {login_response: store.login.login_response,
            modelList: store.apps.modelList,
            modelSummaryFlag:store.apps.modelSummaryFlag,
            modelSlug:store.apps.modelSlug,
            currentAppId:store.apps.currentAppId,
            model_search_element: store.apps.model_search_element,
            apps_model_sorton:store.apps.apps_model_sorton,
            apps_model_sorttype:store.apps.apps_model_sorttype
        };
    })
    
    export class ModelsCard extends React.Component {
        constructor(props) {
            super(props);
        }
        getModelSummary(slug){
            this.props.dispatch(updateModelSlug(slug))
        }
        handleModelDelete(slug){
            this.props.dispatch(handleModelDelete(slug,this.dialog));
        }
        handleModelRename(slug,name){
            this.props.dispatch(handleModelRename(slug,this.dialog,name));
        }
        openDataLoaderScreen(data){
            this.props.dispatch(openAppsLoader(data.completed_percentage,data.completed_message));
            this.props.dispatch(createModelSuccessAnalysis(data));
        }
        
        render() {

                var modelList = this.props.data;
                var appsModelList = modelList.map((data, i) => {
                    var modelLink = "/apps/"+this.props.match.params.AppId+"/models/" + data.slug;
                    var modelLink1 = <Link id={data.slug} to={modelLink}>{data.name}</Link>
                    var percentageDetails = "";
                        if(data.status == INPROGRESS){
                            percentageDetails =   <div class=""><i className="fa fa-circle inProgressIcon"></i><span class="inProgressIconText">{data.completed_percentage >= 0 ?data.completed_percentage+' %':"In Progress"}</span></div>;
                            modelLink1 = <a class="cursor" onClick={this.openDataLoaderScreen.bind(this,data)}> {data.name}</a>;
                        }else if(data.status == SUCCESS && !data.viewed){
                            data.completed_percentage = 100;
                            percentageDetails =   <div class=""><i className="fa fa-check completedIcon"></i><span class="inProgressIconText">{data.completed_percentage}&nbsp;%</span></div>;
                        }
                    var permissionDetails = data.permission_details;
                    var isDropDown = permissionDetails.remove_trainer || permissionDetails.rename_trainer; 
                    return (
                            <div className="col-md-3 xs-mb-15 list-boxes" key={i}>
                            <div className="rep_block newCardStyle" name={data.name}>
                            <div className="card-header"></div>
                            <div className="card-center-tile">
                            <div className="row">
                            <div className="col-xs-12">
                            
                            <h5 className="title newCardTitle pull-left">
                            {modelLink1}
                            </h5>
							<div className="pull-right">{store.getState().apps.currentAppDetails.app_type == "REGRESSION"?<img src={ STATIC_URL + "assets/images/apps_regression_icon.png" } alt="LOADING"/>:<img src={ STATIC_URL + "assets/images/apps_model_icon.png" } alt="LOADING"/>}</div>
							<div className="clearfix"></div>
							 
							
                            <div className="clearfix"></div>
                                {percentageDetails}
                            
                            {/*<!-- Popover Content link -->
                            <OverlayTrigger trigger="click" rootClose  placement="left" overlay={<Popover id="popover-trigger-focus"><DetailOverlay details={data}/></Popover>}><a  className="pover cursor">
                            <div class="card_icon">
                            {store.getState().apps.currentAppDetails.app_type == "REGRESSION"?<img src={ STATIC_URL + "assets/images/apps_regression_icon.png" } alt="LOADING"/>:<img src={ STATIC_URL + "assets/images/apps_model_icon.png" } alt="LOADING"/>}
                                </div>
                            </a></OverlayTrigger>*/}
                            
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
                            {/*<!-- Rename and Delete BLock  -->*/}
                            <a className="dropdown-toggle more_button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More..">
                            <i className="ci zmdi zmdi-hc-lg zmdi-more-vert"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-right drp_cst_width" aria-labelledby="dropdownMenuButton">
							<li className="xs-pl-20 xs-pr-20 xs-pt-10 xs-pb-10"><DetailOverlay details={data}/> </li>
							<li className="xs-pl-20 xs-pr-20 xs-pb-10">
								{permissionDetails.rename_trainer == true ?
                            <span onClick={this.handleModelRename.bind(this,data.slug,data.name)}>
                            <a className="dropdown-item btn-primary" href="#renameCard" data-toggle="modal">
                            <i className="fa fa-edit"></i>&nbsp;&nbsp;Rename</a>
                            </span>:""}
                            {permissionDetails.remove_trainer == true ?
                            <span onClick={this.handleModelDelete.bind(this,data.slug)} >
                            <a className="dropdown-item btn-primary" href="#deleteCard" data-toggle="modal">
                            <i className="fa fa-trash-o"></i>&nbsp;&nbsp;{data.status == "INPROGRESS"
                                ? "Stop and Delete "
                                : "Delete"}</a>
                            </span>:""}
							<div className="clearfix"></div>
							</li>                            
                            </ul>
                            {/*<!-- End Rename and Delete BLock  -->*/}
                            
                            </div>
                            :""}
							
                            </div>
                            </div>
                             <Dialog ref={(el) => { this.dialog = el }} />

                            </div>
                    )
                });
                return(<div >
                        {
                            (appsModelList.length>0)
                            ?(appsModelList)
                            :(<div><div className="text-center text-muted xs-mt-50"><h2>No results found..</h2></div></div>)
                        }

                        </div>);
              
        }
    
    }