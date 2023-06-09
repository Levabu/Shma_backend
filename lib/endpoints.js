class Endpoint {
  constructor(url, method, permissionGrade) {
    this.url = `/api/v1/${url}`;
    this.urlTemplate = new RegExp(`^${this.url.replace(/:[^/]+/g, '([^/]+)')}/?.*$`);
    this.method = method;
    this.isOpen = permissionGrade ? false : true;
    if (permissionGrade) this.permissionGrade = permissionGrade;
  }
}

// order may matter because of the urlTemplate
// if a urlTemplate is a substring of another urlTemplate, the longer one should be first
const endpoints = [
  new Endpoint('users/login', 'POST'),
  new Endpoint('users/signup', 'POST'),
  new Endpoint('users/user-by-id', 'GET', 'loggedIn'),
  new Endpoint('users/users-by-ids', 'POST', 'loggedIn'),
  new Endpoint('users/user-details', 'GET', 'loggedIn'),
  new Endpoint('friendships/friends/:id', 'GET', 'loggedIn'),
  new Endpoint('friendships/check-friendship/:id1/:id2', 'GET', 'loggedIn'),
  new Endpoint('friendships/friend-request/:fromID/:toID', 'POST', 'loggedIn'),
  new Endpoint('friendships/confirm-friendship/:fromID/:toID', 'PATCH', 'loggedIn'),
]

module.exports = endpoints;