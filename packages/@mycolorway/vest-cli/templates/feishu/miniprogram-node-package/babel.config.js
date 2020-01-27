module.exports = {
  presets: [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions"]
      }
    }]
  ],
  plugins: [
    "@mycolorway/vest-core/src/babel/transform-node-import",
    "@babel/plugin-transform-modules-commonjs",
    "@mycolorway/vest-core/src/babel/transform-runtime"
  ]
}
