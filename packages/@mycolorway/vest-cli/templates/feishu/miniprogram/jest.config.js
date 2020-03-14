const regeneratorRuntime = require("regenerator-runtime");

module.exports = {
  testMatch: ["**/test/**/*.test.js"],
  collectCoverageFrom: ["**/src/**/*.js"],
  moduleDirectories: ["node_modules", "src"],
  globals: {
    Behavior: function () {},
    regeneratorRuntime,
  },
};
