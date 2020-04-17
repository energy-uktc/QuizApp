import { LOADED } from "../actions/loading";

const initialState = {
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADED:
      return {
        loading: false
      };
    default:
      return state;
  }
};
