// demo.spec.ts

// import { Pool } from 'pg'; // The database driver

import { runTests } from "./src/index";
// Import your actual database client/connection
// 1. Basic Element Interactions
//runTests("examples/*.feature");
// runTests("examples/find.feature");
runTests("examples/demo.feature");

// // 2. Forms and Inputs
// runTests("examples/form-test.feature");
// runTests("examples/inputs.test.feature");

// // 3. Hardware Interactions (Mouse/Keyboard/Mobile)
// runTests("examples/mouse-test.feature");
// runTests("examples/keyboard-test.feature");
// runTests("examples/mobile-test.feature");

// // 4. Advanced Networking & Mocking
// runTests("examples/network-test.feature");
// runTests("examples/mock_test.feature");

// // 5. Utilities & Database

// Create a connection pool
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'my_app',
//   password: 'password',
//   port: 5432,
// });
// runTests("examples/**/*.feature", {
//   dbQuery: async (query: string) => {
//     // const res = await pool.query(query);
//     // Return res.rows so your Gherkin 'Record Count' step can check .length
//     // return res.rows; 
//   }
// });
// runTests("examples/misc-test.feature");
