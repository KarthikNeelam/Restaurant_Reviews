const mysql = require('mysql2');


let connection = mysql.createConnection({
  host: process.env.DB_CONTAINER,
  user: process.env.MYSQL_ROOT_USER,
  port: process.env.DB_PORT,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.DB_NAME
});


exports.view = (req, res) => {
  
  connection.query('SELECT * FROM review WHERE status = "active"', (err, rows) => {
    
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from review table: \n', rows);
  });
}


exports.find = (req, res) => {
  let searchTerm = req.body.search;
  
  connection.query('SELECT * FROM review WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from review table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-review');
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, restaurantname, shortreview, comments } = req.body;
  let searchTerm = req.body.search;

  // User the connection
  connection.query('INSERT INTO review SET first_name = ?, last_name = ?, restaurantname = ?, shortreview = ?, comments = ?', [first_name, last_name, restaurantname, shortreview, comments], (err, rows) => {
    if (!err) {
      res.render('add-review', { alert: 'Review added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from reviews table: \n', rows);
  });
}


// Edit user
exports.edit = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM review WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-review', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from review table: \n', rows);
  });
}


// Update User
exports.update = (req, res) => {
  const { first_name, last_name, restaurantname, shortreview, comments } = req.body;
  // User the connection
  connection.query('UPDATE review SET first_name = ?, last_name = ?, restaurantname = ?, shortreview = ?, comments = ? WHERE id = ?', [first_name, last_name, restaurantname, shortreview, comments, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      connection.query('SELECT * FROM review WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
          res.render('edit-review', { rows, alert: `${restaurantname} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from review table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from review table: \n', rows);
  });
}

// Delete User
exports.delete = (req, res) => {



  connection.query('UPDATE review SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('Review successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from review table are: \n', rows);
  });

}

// View Users
exports.viewall = (req, res) => {

  // User the connection
  connection.query('SELECT * FROM review WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-review', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from review table: \n', rows);
  });

}