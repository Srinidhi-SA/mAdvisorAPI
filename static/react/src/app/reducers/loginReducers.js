export default function reducer(state={
    login_response:"xyz"
  }, action) {

    switch (action.type) {
      case "AUTHENTICATE_USER": {
        return {...state,
                login_response:action.payload
              }
      }

    }
    return state
}
