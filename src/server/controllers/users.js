function filterByYear(arrayOfUsers, year, callback) {
  const response = arrayOfUsers.filter(function(user) {
    const date = new Date(user.created_at);
    return date.getFullYear() >= year;
  });
  callback(null, response);
}

module.exports = {
  filterByYear
};
