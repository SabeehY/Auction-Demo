import Deal from 'models/Deal';
// import User from 'models/User';

export function listAdmin() {
  return new Promise((resolve, reject) => {
    // Deal.find({}, undefined, { populate: 'bids.bidder' }, );
    Deal.find({})
        .populate('bids.bidder')
        .lean()
        .exec((err, deals) => err ? reject(err) : resolve(deals || []));
  });
}

export function listUser(req) {
  return new Promise((resolve, reject) => {
    // Deal.find({}, (err, deals) => err ? reject(err) : resolve(deals || []));
    Deal.find({}, {lean: true}, (err, deals) => {
      if (err) return reject(err);
      deals.map(deal => {
        deal.bids.filter(bid => req.user._id.equals(bid.bidder));
        deal.userBid = deal.bids && deal.bids.length > 0 && deal.bids[0] || null;
        delete deal.bids;
        return deal;
      });
      return resolve(deals);
    });
  });
}

export function list(req) {
  return new Promise((resolve, reject) => {
    // Deal.find({}, (err, deals) => err ? reject(err) : resolve(deals || []));
    Deal.find({})
        .populate('bids.bidder')
        .lean()
        .exec((err, deals) => {
          if (err) return reject(err);
          if (req.user) {
            const withUserBid = deals.map(deal => {
              const userBids = deal.bids.filter(bid => req.user._id.equals(bid.bidder._id));
              const userBid = userBids && userBids.length > 0 && userBids[0] || null;
              return {...deal, userBid};
            });
            return resolve(withUserBid);
          }
          return resolve(deals);
        });
  });
}

export function edit(req) {
  return new Promise((resolve, reject) => {
    const dealId = req.query && req.query.id;
    const amount = req.body && req.body.amount;
    if (!(dealId || amount)) return reject({message: 'Both dealId and amount are required'});

    Deal.findOneAndUpdate({ id: dealId, 'bids.bidder': req.user._id },
      { 'bids.$.amount': req.body.amount },
      {new: true, lean: true},
      (err, deal) => {
        if (err) return reject(err);
        if (!deal) return reject({message: 'Deal Id Invalid'});
        list(req).then(resolve, reject);
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
      {new: true, lean: true},
      (err, deal) => {
        if (err) return reject(err);
        if (!deal) {
          // Didn't find the with the deal
          edit(req).then(resolve, reject);
        } else {
          list(req).then(resolve, reject);
        }
      }
   );
  });
}

