// const dotenv = require("dotenv");
// dotenv.config();

// module.exports = {
//   USER: process.env.DB_USER,
//   PASSWORD: process.env.DB_PASSWORD,
//   HOST: process.env.DB_HOST,
//   PORT: process.env.DB_PORT,
//   DATABASE: process.env.DB_DATABASE,
// };

// exports.getAllSales = (req, res) => {
//     const { id, date } = req.query;
//     const dbArgs = [];
//     id && dbArgs.push(id);
//     date && dbArgs.push(date);
//     let query = `
//         SELECT * from sales_api
//         ${dbArgs.length ? " where " : ""}
//         ${id ? " user_id = $2 " : ""}
//         ${date ? " date(date) = $1 " : ""}
//     `.trim();
//     console.log("[INFO] Executing query: ", query)
//     return pool
//         .query(query, dbArgs)
//         .then((result) => {
//             console.log("[INFO] Received number of rows: ", result.rows.length)
//             res.statusCode = 200;
//           res.send(result.rows);
//       })
//         .catch((e) => {
//             console.log("[ERROR] Error while fetching sales: ", e)
//             res.statusCode = 500;
//             res.send({ "error": "Database call failure" })
//         });
//   };
