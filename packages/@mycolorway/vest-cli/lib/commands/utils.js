const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const {spawn} = require('child_process')

function runTask (...tasks) {
  tasks = tasks.reduce((result, config) => {
    const TaskRegistry = require(`../tasks/${config.name}`)
    gulp.registry(new TaskRegistry(config))
    result.push(gulp.task(config.name))
    return result
  }, [])
  gulp.series(tasks)()
}

function getMiniprogramDistPath(cwd) {
  const packageConfig = require(path.resolve(cwd, 'package.json'))
  return path.resolve(cwd, packageConfig.miniprogram || 'miniprogram_dist')
}

function getBuildConfig (config) {
  const packageConfig = require(path.resolve(config.cwd, 'package.json'))
  const buildConfig = Object.assign({}, config, {
    projectName: packageConfig.name,
    srcPath: path.resolve(config.cwd, 'src'),
    useESLint: fs.existsSync(path.resolve(config.cwd, '.eslintrc.js'))
  })

  if (fs.existsSync(path.resolve(config.cwd, 'project.config.json'))) {
    Object.assign(buildConfig, {
      projectType: 'miniprogram',
      distPath: path.resolve(config.cwd, 'dist')
    })
  } else if (fs.existsSync(path.resolve(config.cwd, 'demo/project.config.json'))) {
    Object.assign(buildConfig, {
      projectType: 'miniprogram-node-package',
      distPath: getMiniprogramDistPath(config.cwd)
    })
  }

  if (!buildConfig.projectName || !buildConfig.projectType || !fs.existsSync(buildConfig.srcPath)) {
    console.error('please make sure current working directory is a valid vest project')
    process.exit(1)
  }

  return buildConfig
}

function ensureDependenciesInstalled(cwd) {
  if (fs.existsSync(path.resolve(cwd, 'node_modules'))) {
    return Promise.resolve(true)
  } else {
    return new Promise((resolve, reject) => {
      console.log('need to install node dependencies first...\n')
      spawn('npm', ['i'], {
        cwd,
        stdio: 'inherit'
      }).on('close', (code) => {
        code === 1 ? process.exit(1) : resolve(true)
      })
    })
  }
}

module.exports = {
  runTask, getMiniprogramDistPath, getBuildConfig, ensureDependenciesInstalled
}
