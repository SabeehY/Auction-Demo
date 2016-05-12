export default function logout(req) {
  return Promise.resolve(req.logout());
  // return new Promise((resolve) => {
  //   req.session.destroy(() => {
  //     req.session = null;
  //     return resolve(null);
  //   });
  // });
}
