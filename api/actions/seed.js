import async from 'async';

import Deal from 'models/Deal';

export default function seed() {
  return new Promise((resolve, reject) => {
    Deal.remove({}, (err) => {
      if (err) return reject(err);
      const dealsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      async.forEach(
         dealsIds,
         (id, callback) => {
           Deal.create({
             id: id
           }, callback);
         },
         (err) => {
           // if any of the saves produced an error, err would equal that error
           if (err) {
             reject(err);
           } else {
             resolve('DB seeded');
           }
         }
       );
    });
  });
}
