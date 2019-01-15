import React from "react";
import {API,STATIC_URL} from "../helpers/env";


export function missingValueTreatmentSelectedAction(colName,colSlug, treatment, dispatch){
  return {
		type: "MISSING_VALUE_TREATMENT",
		colName,
    colSlug,
    treatment
	}
}
export function outlierRemovalSelectedAction(colName,colslug, treatment, dispatch){
  return {
		type: "OUTLIER_REMOVAL",
		colName,
    colslug,
        treatment
	}
}
export function variableSelectedAction(colSlug, selecteOrNot, dispatch){
  return {
		type: "VARIABLE_SELECTED",
		colSlug,
    selecteOrNot
	}
}


 export function removeDuplicateAttributesAction(removeDuplicateAttributesName, yesOrNo, dispatch){
  return {
		type: "REMOVE_DUPLICATE_ATTRIBUTES",
    yesOrNo,
    removeDuplicateAttributesName


	}
}


export function removeDuplicateObservationsAction(duplicate_removal_observations_name, yesOrNo, dispatch){
 return {
   type: "REMOVE_DUPLICATE_OBSERVATIONS",
   yesOrNo,
   duplicate_removal_observations_name
 }
}



// export function removeDuplicateAttributesAction(duplicate_removal_name, yesOrNo, dispatch){
//  return {
//    type: "REMOVE_DUPLICATE_ATTRIBUTES",
//    yesOrNo,
//    duplicate_removal_name
//  }
// }
//
//
// export function removeDuplicateObservationsAction(duplicate_removal_name, yesOrNo, dispatch){
// return {
//   type: "REMOVE_DUPLICATE_OBSERVATIONS",
//   yesOrNo,
//   duplicate_removal_name
// }
// }
