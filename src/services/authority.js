function authority(role) {
  return (req, rep, done) => {
    if (req.user && req.user.role && req.user.role === role) {
      done();
    } else {
      rep.render("login", {
        errMessage: `Bạn cần phải đăng nhập với quyền ${requiredRole} để truy cập trang này.`,
      });
    }
  };
}

module.exports = authority;
