const LOAD = 'auctionDemo/deals/LOAD';
const LOAD_SUCCESS = 'auctionDemo/deals/LOAD_SUCCESS';
const LOAD_FAIL = 'auctionDemo/deals/LOAD_FAIL';

const LOAD_ADMIN = 'auctionDemo/deals/LOAD_ADMIN';
const LOAD_ADMIN_SUCCESS = 'auctionDemo/deals/LOAD_ADMIN_SUCCESS';
const LOAD_ADMIN_FAIL = 'auctionDemo/deals/LOAD_ADMIN_FAIL';

const BID = 'auctionDemo/deals/BID';
const BID_SUCCESS = 'auctionDemo/deals/BID_SUCCESS';
const BID_FAIL = 'auctionDemo/deals/BID_FAIL';

const initialState = {loaded: false};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        deals: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };

    case LOAD_ADMIN:
      return {
        ...state,
        loading: true,
        loaded: true
      };
    case LOAD_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        deals: action.result,
        error: null
      };
    case LOAD_ADMIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };

    case BID:
      return {
        ...state,
        submitting: true,
        submitted: false
      };
    case BID_SUCCESS:
      return {
        ...state,
        deals: action.result,
        submitting: false,
        submitted: true,
        submitError: null
      };
    case BID_FAIL:
      return {
        ...state,
        submitting: false,
        submitted: false,
        submitError: action.error
      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/deals/list')
  };
}

export function loadAdmin() {
  return {
    types: [LOAD_ADMIN, LOAD_ADMIN_SUCCESS, LOAD_ADMIN_FAIL],
    promise: (client) => client.get('/deals/listAdmin')
  };
}

export function bid(dealId, amount) {
  return {
    types: [BID, BID_SUCCESS, BID_FAIL],
    promise: (client) => client.post('/deals/bid', {params: {id: dealId}, data: amount})
  };
}

