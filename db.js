const Pool = require("pg").Pool;

const pool = new Pool({
    user:"postgres",
    password:"Ju!iu5Ca35arP",
    host:"localhost",
    database:"transcript"
})

module.exports = pool; 