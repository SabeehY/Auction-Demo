const LOAD = 'auctionDemo/deals/LOAD';
const LOAD_SUCCESS = 'auctionDemo/deals/LOAD_SUCCESS';
const LOAD_FAIL = 'auctionDemo/deals/LOAD_FAIL';

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

    case BID:
      return {
        ...state,

      };
    case BID_SUCCESS:
      return {
        ...state,

      };
    case BID_FAIL:
      return {
        ...state,

      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/deals/listUser')
  };
}

export function bid(dealId, amount) {
  return {
    types: [BID, BID_SUCCESS, BID_FAIL],
    promise: (client) => client.post('/deals/bid', {params: {id: dealId}, data: amount})
  };
}

