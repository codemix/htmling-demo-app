
var users = [
  {
    id: 1,
    name: 'User 1'
  },
  {
    id: 2,
    name: 'User 2'
  },
  {
    id: 3,
    name: 'User 3'
  },
  {
    id: 4,
    name: 'User 4'
  }
];

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('user/index', {
    title: 'Users',
    users: users
  });
};


exports.read = function (req, res) {
  var user = users[req.params.id - 1];
  res.render('user/item', {
    title: user.name,
    user: user
  });
};