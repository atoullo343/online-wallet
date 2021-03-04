module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Iltimos, avval ro'yxatdan o'ting!");
    res.redirect("/login");
  },
};
