const sql = require("./db");

const userreviews = function (userreviews) {
  this.userid = userreviews.userid;
  this.ratingsvalue = userreviews.ratingsvalue;
  this.reviewtext = userreviews.reviewtext;
  this.revieweduserid = userreviews.revieweduserid;
  this.status = userreviews.status;
};

userreviews.createOrUpdate = (newReview, result) => {
  const query = `
    INSERT INTO userreviews (userid, ratingsvalue, reviewtext, revieweduserid, status)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      ratingsvalue = IF(revieweduserid = VALUES(revieweduserid), VALUES(ratingsvalue), ratingsvalue),
      reviewtext = IF(revieweduserid = VALUES(revieweduserid), VALUES(reviewtext), reviewtext),
      status = IF(revieweduserid = VALUES(revieweduserid), VALUES(status), status);
  `;

  const values = [
    newReview.userid,
    newReview.ratingsvalue,
    newReview.reviewtext,
    newReview.revieweduserid,
    newReview.status,
  ];

  sql.query(query, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};



userreviews.getAll = (userid,result) => {
  console.log(userid);
  let query =
    `SELECT 
    userreviews.feedbackid, 
    userreviews.userid, 
    userreviews.ratingsvalue, 
    userreviews.reviewtext, 
    userreviews.revieweduserid, 
    userreviews.reviewdate, 
    userreviews.status, 
    profile.profileimagepath as image, 
    profile.poc as name,
    users.email as email, 
    users.mobile as mobile,
	users.isdcode as countrycode
FROM userreviews
INNER JOIN profile ON userreviews.revieweduserid = profile.userid
INNER JOIN users ON userreviews.revieweduserid = users.userid
WHERE userreviews.userid = ${userid};
`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};




module.exports = userreviews;
