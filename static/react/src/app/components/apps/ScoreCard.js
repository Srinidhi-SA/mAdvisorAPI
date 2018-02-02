import React from "react";
import store from "../../store";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {push} from "react-router-redux";

import {MainHeader} from "../common/MainHeader";
import {
    Tabs,
    Tab,
    Pagination,
    Tooltip,
    OverlayTrigger,
    Popover
} from "react-bootstrap";
import {AppsCreateScore} from "./AppsCreateScore";
import {
    getAppsScoreList,
    getAppsScoreSummary,
    updateScoreSlug,
    handleScoreRename,
    handleScoreDelete,
    activateModelScoreTabs,
    storeScoreSearchElement,
    storeAppsScoreSortElements
} from "../../actions/appActions";
import {DetailOverlay} from "../common/DetailOverlay";
import {STATIC_URL} from "../../helpers/env.js"
import {SEARCHCHARLIMIT,getUserDetailsOrRestart} from  "../../helpers/helper"
import Dialog from 'react-bootstrap-dialog'

var dateFormat = require('dateformat');

@connect((store) => {
    return {login_response: store.login.login_response, scoreList: store.apps.scoreList, scoreSlug: store.apps.scoreSlug, currentAppId: store.apps.currentAppId, score_search_element: store.apps.score_search_element,apps_score_sorton:store.apps.apps_score_sorton, apps_score_sorttype:store.apps.apps_score_sorttype};
})

export class ScoreCard extends React.Component {
    constructor(props) {
        super(props);
    }
    
    handleScoreDelete(slug) {
        this.props.dispatch(handleScoreDelete(slug, this.dialog));
    }
    handleScoreRename(slug, name) {
        this.props.dispatch(handleScoreRename(slug, this.dialog, name));
    }
    getScoreSummary(slug) {
        this.props.dispatch(updateScoreSlug(slug))
    }
    render() {
        var scoreList = this.props.data;
        const appsScoreList = scoreList.map((data, i) => {
            var scoreLink = "/apps/" + store.getState().apps.currentAppId + "/scores/" + data.slug;
            return (
                    <div className="col-md-3 xs-mb-15 list-boxes" key={i}>
                    <div className="rep_block newCardStyle" name={data.name}>
                    <div className="card-header"></div>
                    <div className="card-center-tile">
                    <div className="row">
                    
                    <div className="col-xs-12">
                    <h5 className="title newCardTitle pull-left">
                    <Link to={scoreLink} id={data.slug} onClick={this.getScoreSummary.bind(this, data.slug)}>{data.name}</Link>
                    </h5>
                    
                    <div class="btn-toolbar pull-right">
                    {/*<!-- Rename and Delete BLock  -->*/}
                    <a className="dropdown-toggle more_button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More..">
                    <i className="ci zmdi zmdi-hc-lg zmdi-more-vert"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                    <li onClick={this.handleScoreRename.bind(this, data.slug, data.name)}>
                    <a className="dropdown-item" href="#renameCard" data-toggle="modal">
                    <i className="fa fa-edit"></i>
                    &nbsp;&nbsp;Rename</a>
                    </li>
                    <li onClick={this.handleScoreDelete.bind(this, data.slug)}>
                    <a className="dropdown-item" href="#deleteCard" data-toggle="modal">
                    <i className="fa fa-trash-o"></i>
                    &nbsp;&nbsp;Delete</a>
                    </li>
                    </ul>
                    {/*<!-- End Rename and Delete BLock  -->*/}
                    </div>
                    
                    <div className="clearfix"></div>
      
                    
                    {/*<!-- Popover Content link -->*/}
                    <OverlayTrigger trigger="click" rootClose placement="left" overlay={< Popover id = "popover-trigger-focus" > <DetailOverlay details={data}/> </Popover>}>
                    <a className="pover cursor">
                    <div class="card_icon">
                    <img src={STATIC_URL + "assets/images/apps_score_icon.png"} alt="LOADING"/>
                        </div>
                    </a>
                    </OverlayTrigger>
                    
                    </div>
                    </div>
                    </div>
                    <div className="card-footer">
                    <div className="left_div">
                    <span className="footerTitle"></span>{getUserDetailsOrRestart.get().userName}
                    <span className="footerTitle">{dateFormat(data.created_at, "mmm d,yyyy HH:MM")}</span>
                    </div>                        
                    </div>
                    </div>
                     <Dialog ref={(el) => { this.dialog = el }} />

                    </div>
            )
        });
        return(<div >
                {
                    (appsScoreList.length>0)
                    ?(appsScoreList)
                    :(<div><div className="clearfix"></div><div className="text-center text-muted xs-mt-50"><h2>No results found..</h2></div></div>)
                }

                </div>);
    }
    
}
