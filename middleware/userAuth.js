// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
      return next(); // Proceed if the user is logged in
    } else {
      res.redirect('/admin/login'); // Redirect to login if the user is not authenticated
    }
  }
  
  module.exports = isAuthenticated;
  