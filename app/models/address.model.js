const sql = require("./db.js");

// constructor
const address = function(address) {
    this.userid = address.userid;
    this.addressline = address.addressline1;
    this.addressline2 = address.addressline2;
    this.landmark = address.landmark;
    this.city = address.city;
    this.state = address.state;
    this.country = address.country;
    this.pin = address.pin;
    this.addressType = address.addressType;
    this.isSameAddress = address.isSameAddress;

  };


  address.create = (addresses, result) => {
    const query = "INSERT INTO address (userid, addressline1, addressline2, landmark, city, state, country, pin, addressType, isSameAddress) VALUES ?";
  const values = addresses.map(address => [
    address.userid,
    address.addressline1,
    address.addressline2,
    address.landmark,
    address.city,
    address.state,
    address.country,
    address.pin,
    address.addressType,
    address.isSameAddress || 'N' // Ensure a default value for isSameAddress
  ]);
    sql.query(query, [values], (err, res) =>{
      if (err) {
        result(err, null);
        return;
      }
  
      result(null, { message: "Addresses inserted successfully" });
    });
  };


  address.findById = (id, result) => {
    sql.query(
      `SELECT addressid, userid, addressline1, addressline2, landmark, city, state, country, pin, isSameAddress, sys.listItemName AS address_type FROM address AS ad INNER JOIN systemlistitem AS sys ON ad.addressType = sys.listItemId WHERE userid =${id}`,
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.length) {
          result(null, res);
          return;
        }
        // not found address with the userid
        result({ kind: "not_found" }, null);
      }
    );
  };


  address.updateByUserId = (id, newAddress, result) => {
    sql.query(
      "UPDATE address SET ? where userid = ?",[newAddress,id],(err, res) => {
        if (err) {
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found address with the userid
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, { id: id, ...newAddress });
      }
    );
  };



  
  address.remove = (userid, result) => {
    sql.query("DELETE FROM address WHERE userid = ?", userid, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found subject with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      result(null, res);
    });
  };





  module.exports = address;