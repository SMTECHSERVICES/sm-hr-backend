const roleMiddleware = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Access Denied" });
      }
      next();
    };
  };
  // middleware/roleMiddleware.js

// const roleMiddleware = (role) => {
//   return (req, res, next) => {
//     if (req.user && req.user.role === role) {
//       next();
//     } else {
//       res.status(403).json({ message: 'Access denied: Unauthorized role' });
//     }
//   };
// };

module.exports = roleMiddleware;


  
  