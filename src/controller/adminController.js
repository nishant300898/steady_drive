const { generateTokenFoAdmin } = require("../middleware/auth.middleware");
const models = require('./../database');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const adminModel = models.admins
const pool = mysql.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    host: 'steadydrive-dev.cluster-cfmhjvgdd2dh.us-east-1.rds.amazonaws.com',
    user: 'sdadmin',
    password: 'OttyeecaskawgAttyenenCayp!ogcic5',
    database: 'steadydrive',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
exports.login = async function (req, res) {
    try {
      const storedAdmin = await adminModel.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (!storedAdmin) {
        return res.status(403).send({
          status: false,
          message: 'Email Not found',
        });
      }
  
      let isPasswordCorrect = await bcrypt.compare(req.body.password, storedAdmin.password);
      if (!isPasswordCorrect) {
        return res.status(403).send({
          status: false,
          message: 'Please provide your correct password'
        });
      }
      let authToken = generateTokenFoAdmin({
        id: storedAdmin.id,
        email: storedAdmin.email,
        name: storedAdmin.name,
      });
  
      return res.status(200).send({
        status: true,
        message: 'Logged in successfully',
        data: {
          token: authToken,
          user: storedAdmin.name
        },
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message || 'Server Error',
      });
    }
  };

exports.getAllStates = async (req, res) => {
  try {
    let query = `select distinct(state_code) from driver;`;
    let results = await pool.query(query);
    return res.status(200).send({
      status: true,
      data: results[0]
    });
  } 
  catch (err) {
    res.status(500).send({
      status: false,
      message: err.message || 'Server Error',
    });
  }
}

exports.getAllStatus = async (req, res) => {
  try {
    let query = `select distinct(activation_status) from driver WHERE activation_status IS NOT NULL;`;
    let results = await pool.query(query);
    return res.status(200).send({
      status: true,
      data: results[0]
    });
  } 
  catch (err) {
    res.status(500).send({
      status: false,
      message: err.message || 'Server Error',
    });
  }
}

exports.getDrivers = async (req, res) => {
  try {
    const { searchText, pageSize, page } = req.body;
    const offset = (page - 1) * pageSize;
    const fields = ['email', 'driver.driver_uuid as driver_uuid', 'COUNT(driver_offers.driver_uuid) as count','driver.created_date as created_date', 'first_name', 'last_name', 'activation_status', 'permission_status', 'state_code','progress_percentage', 'prior_insurance_company_name'];
    const filters = req.body.filters;
    
    let sql = `SELECT ${fields.join(",")} FROM driver LEFT JOIN driver_offers ON driver.driver_uuid = driver_offers.driver_uuid`;
    let totalCount = 0;

    sql += ` WHERE (first_name LIKE '%${searchText}%' OR email LIKE '%${searchText}%' OR driver.driver_uuid LIKE '%${searchText}%')`;

    if (filters.date && filters.date.startDate && filters.date.endDate) {
      sql += ` AND driver.created_date BETWEEN '${filters.date.startDate}' AND '${filters.date.endDate}'`;
    }

    if (filters.status && filters.status.length > 0) {
      sql += ` AND activation_status IN ('${filters.status.join("','")}')`;
    }

    if (filters.state && filters.state.length > 0) {
      sql += ` AND state_code IN ('${filters.state.join("','")}')`;
    }
    
    let hasOffer = filters.has_offer == 1 ? ">0":"=0";

    sql += ` GROUP BY driver_offers.driver_uuid HAVING count  ${hasOffer}`;
    totalCount = await pool.query(sql);

    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const [rows] = await pool.query(sql);

    return res.status(200).send({
      status: true,
      count: totalCount[0].length,
      data: rows,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err.message || "Server Error",
    });
  }
};

exports.getWaitlist = async (req, res) => {
  try {
    const { searchText, pageSize, page } = req.body;
    const offset = (page - 1) * pageSize;
    // const fields = ['email', 'waitlist.waitlist_uuid as waitlist_uuid', 'COUNT(driver_offers.driver_uuid) as count','waitlist.created_date as created_date', 'first_name', 'last_name',  'zip_code', 'state_code', 'current_insurance_company_name'];
    const fields = ['email', 'waitlist.waitlist_uuid as waitlist_uuid','waitlist.created_date as created_date', 'first_name', 'last_name',  'zip_code', 'state_code', 'current_insurance_company_name'];

    const filters = req.body.filters;
    
    let sql = `SELECT ${fields.join(",")} FROM waitlist LEFT JOIN driver_offers ON waitlist.waitlist_uuid = driver_offers.driver_uuid`;
    let totalCount = 0;

    sql += ` WHERE (first_name LIKE '%${searchText}%' OR email LIKE '%${searchText}%' OR waitlist.waitlist_uuid LIKE '%${searchText}%')`;

    if (filters.date && filters.date.startDate && filters.date.endDate) {
      sql += ` AND waitlist.created_date BETWEEN '${filters.date.startDate}' AND '${filters.date.endDate}'`;
    }

    if (filters.state && filters.state.length > 0) {
      sql += ` AND state_code IN ('${filters.state.join("','")}')`;
    }
    
    // let hasOffer = filters.has_offer == 1 ? ">0":"=0";

    // sql += ` GROUP BY driver_offers.driver_uuid HAVING count  ${hasOffer}`;
    totalCount = await pool.query(sql);
console.log(sql);
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const [rows] = await pool.query(sql);

    return res.status(200).send({
      status: true,
      count: totalCount[0].length,
      data: rows,
    });
  }catch (err) {
      res.status(500).send({
        status: false,
        message: err.message || "Server Error",
      });
    }
  };