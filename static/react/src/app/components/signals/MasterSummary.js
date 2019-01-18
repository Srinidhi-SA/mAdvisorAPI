import React from "react";
import {connect} from "react-redux";
import {Redirect, Link} from "react-router-dom";
import store from "../../store";
import {MainHeader} from "../common/MainHeader";
// import $ from "jquery";
import Breadcrumb from 'react-breadcrumb';
import renderHTML from 'react-render-html';
import {Card} from "./Card";
import {STATIC_URL} from "../../helpers/env.js"

@connect((store) => {
  return {login_response: store.login.login_response, signal: store.signals.signalAnalysis};
})

export class MasterSummary extends React.Component {
  constructor() {
    super();
  }
  render() {

    console.log("MasterSummary is called!!");
    //console.log(this.props);
    //console.log(this.props.signal);
    let heading = this.props.signal.name;

    var noOfDimention;
    var noOfMeasures;
    var summary;
    var mText;
    var dText;

    noOfDimention = this.props.signal.listOfCards[0].cardData.noOfDimensions;
    noOfMeasures = this.props.signal.listOfCards[0].cardData.noOfMeasures;
    summary = this.props.signal.listOfCards[0].cardData.summaryHtml;
    var quotes = this.props.signal.listOfCards[0].cardData.quotesHtml; //.toString();

    if (noOfDimention > 1) {
      dText = "Dimensions";
    } else {
      dText = "Dimension";
    }

    if (noOfMeasures > 1) {
      mText = "Measures";
    } else {
      mText = "Measure";
    }

    let firstOverviewSlug = this.props.signal.listOfNodes[0].slug;

    const overViewLink = "/signals/" + this.props.signalId + "/" + firstOverviewSlug;
    return (
      <div className="side-body">
        <div className="page-head">
          <div class="row">
            <div class="col-md-12">
              <Breadcrumb path={[
                {
                  path: '/signals',
                  label: 'Signals'
                }, {
                  path: '/signals/' + this.props.signalId,
                  label: heading
                }
              ]}/>
            </div>
            <div class="col-md-8">
              <h3 className="xs-mt-0 xs-mb-0 text-capitalize"> {heading}</h3>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
        <div className="main-content">
		
		<div class="row xs-pt-50">
		<div class="col-md-3 col-md-offset-1">
			<img src={STATIC_URL + "assets/images/data_overview.png"} className="img-responsive xs-mt-50"/>
		</div>
		<div class="col-md-8">
			<div class="row xs-mt-50">					
						<div className="col-md-5 col-md-offset-1">
							<div className="box-shadow xs-p-10">							
							 
								<div className="col-xs-8">
									<h4 class="xs-mt-15">
									<img src={STATIC_URL + "assets/images/s_d_carIcon.png"}/> {dText}									 
									</h4>
								</div>
								<div className="col-xs-4">
										<h2 className="text-right"> 							
										{noOfDimention}
										</h2>
								</div>
								<div className="clearfix"></div>
							</div>
						</div>
						<div className="col-md-5">							
							<div className="box-shadow xs-p-10">
							 
								<div className="col-xs-8">
									<h4 class="xs-mt-15"><img src={STATIC_URL + "assets/images/s_m_carIcon.png"}/> {mText}</h4>
								</div>
								<div className="col-xs-4">
										<h2 className="text-right"> 							
										{noOfMeasures}
										</h2>
								</div>
							 <div className="clearfix"></div>
							</div>
						</div>
					</div>
					
					<div class="row">					
						<div className="col-md-10 col-md-offset-1">
							<div className="xs-pt-50">
							<Card cardData={summary}/>
							</div>
						</div>
					</div>
					
					<div class="row">					
						<div className="col-md-10 col-md-offset-1">
							<div className="xs-pt-50 text-right">
							 <Link to={overViewLink} className="btn btn-primary btn-md xs-pl-20 xs-pr-20 xs-pt-10 xs-pb-10">
                         <i className="fa fa-file-text-o"></i>  View Summary
                        </Link>
							</div>
						</div>
					</div>
		
		
		</div>
		</div>
				
					
					
					{/*
				<div className="panel panel-default">
					<div className="panel-body no-border">
					
					
                  <div className="row">

                      <div className="col-md-9">
                        <div className="md-p-50">
                          <div className="row">
                            <div className="col-md-4 col-md-offset-2 col-sm-6 data-info">
                              <table>
                              <tbody>
                                <tr>
                                  <td></td>
                                  <td class="text-center">
                                      <h1>{noOfDimention}</h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td ><img src={STATIC_URL + "assets/images/s_d_carIcon.png"}/>
                                  </td>
                                  <td class="text-center">
                                    <h3>
                                      {dText}</h3>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-4 col-md-offset-1 col-sm-6 data-info">
                              <table>
                              <tbody>
                                <tr>
                                  <td></td>
                                  <td class="text-center">
                                    <h1>{noOfMeasures}</h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td ><img src={STATIC_URL + "assets/images/s_m_carIcon.png"}/></td>
                                  <td class="text-center">
                                    <h3>
                                      {mText}</h3>
                                  </td>
                                </tr>
                                </tbody>
                              </table>

                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-12 xs-pt-30">
                              <div className="lead txt-justify"><Card cardData={summary}/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
						<div className="v_smry ex_bg">
                        <h3>
                          <em>{quotes}</em>
                        </h3>
                        <Link to={overViewLink}>
                          <img src={STATIC_URL + "assets/images/icon_proceedformore.png"} className="img-responsive" alt="Proceed for More"/>
                          View Summary
                        </Link>
						</div>
                      </div>
                      <div class="clearfix"></div>

                  </div>

             </div>
				</div> */}


        </div>
      </div>
    );

  }
}
