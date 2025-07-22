function authority(role) {
  return (req, rep, done) => {
    const roles = Array.isArray(role) ? role : [role];
    console.log("roles", roles);
    console.log("user", req.user);
    if (req.user && roles.includes(req.user.role)) {
      done();
    } else {
      return rep.status(403).render("login", {
        formData: {},
        errorMessage: {
          password: `Tài khoản của bạn ${
            req.user?.username || "không xác định"
          } không đủ quyền truy cập trang này.`,
        },
      });
    }
  };
}

module.exports = authority;
