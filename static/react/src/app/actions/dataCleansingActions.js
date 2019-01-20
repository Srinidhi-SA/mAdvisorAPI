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


 export function removeDuplicatesAction(duplicate_removal_name, yesOrNo, dispatch){
  return {
		type: "REMOVE_DUPLICATES",
    yesOrNo,
    duplicate_removal_name


	}
}

export function dataCleansingDataTypeChange(colSlug, newDataType, dispatch){
    return {
        type: "DATACLEANSING_DATA_TYPE_CHANGE",
        colSlug,
        newDataType
    }
}

