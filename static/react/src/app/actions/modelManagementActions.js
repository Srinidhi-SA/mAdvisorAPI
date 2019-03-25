export function openModelSummaryAction(summarySelected) {
  return {
    type: "SUMMARY_SELECTED_LIST" ,
    summarySelected
  }
}
export function openDeployModalAction(selectedItem) {
  return {
    type: "DEPLOY_SHOW_MODAL" ,
    selectedItem
  }
}

export function closeDeployModalAction() {
   return {
     type: "DEPLOY_HIDE_MODAL",
   }
}

export function storeAlgoSearchElement(search_element) {
  return {type: "SEARCH_ALGORITHM", search_element}
}