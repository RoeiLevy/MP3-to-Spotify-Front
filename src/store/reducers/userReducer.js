const INITIAL_STATE = {
  user: {
    id: '',
    locale: '',
    img: {
      url: '',
      width: '',
      height: ''
    }
  }
}
export function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.user }
      }

    default:
      return state
  }
}