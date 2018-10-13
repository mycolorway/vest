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
    "@babel/plugin-transform-modules-commonjs",
    "@mycolorway/vest/lib/tasks/build/babel/transform-runtime"
  ]
}
