import Deal from 'models/Deal';
// import User from 'models/User';

export function listAdmin() {
  return new Promise((resolve, reject) => {
    Deal.find({}, { populate: { path: 'bids.bidder' }}, (err, deals) => err ? reject(err) : resolve(deals || []));
  });
}

export function listUser(req) {
  return new Promise((resolve, reject) => {
    // Deal.find({}, (err, deals) => err ? reject(err) : resolve(deals || []));
    Deal.find({}, (err, deals) => {
      if (err) return reject(err);
      deals.map(deal => {
        console.log('BIDS', deal.bids, '\n');
        deal.bids.filter(bid => req.user._id.equals(bid.bidder));
        deal.userBid = deal.bids && deal.bids.length > 0 && deal.bids[0] || null;
        delete deal.bids;
      });
      return resolve(deals);
    });
  });
}

export function bid(req) {
  return new Promise((resolve, reject) => {
    const dealId = req.query && req.query.id;
    Deal.findOneAndUpdate(
      {id: dealId, 'bids.bidder': {$ne: req.user._id}},
      {
        $push: {
          bids: {
            bidder: req.user._id,
            amount: req.body.amount
          }
        }
      },
      {new: true},
      (err, deal) => {
        if (err) return reject(err);
        if (!deal) return reject({message: 'Not a valid query'});
        return listUser(req).then(resolve, reject);
      }
   );
  });
}

export function edit(req) {
  return new Promise((resolve, reject) => {
    const dealId = req.query && req.query.id;
    const amount = req.body && req.body.amount;
    if (!(dealId || amount)) return reject({message: 'Both dealId and amount are required'});

    Deal.findOneAndUpdate({ id: dealId, 'bids.bidder': req.user._id },
      { 'bids.$.amount': req.body.amount },
      {new: true},
      (err, deal) => err ? reject(err) : !deal && reject({message: 'Not a valid query'}) || resolve(deal));
  });
}
