import npm from "npm"
import _ from 'underscore'

const config = {
  loglevel: 'silent',
  parseable: true
}

export function load(callback) {
  return npm.load(config, callback)
}

export function ls(callback) {
  return exports.load(function(err, npm) {
    if (err) 
      return callback(err)

    return npm.commands.ls([], true, callback)
  })
}

export function install(dir, modules, callback) {
  if (!_.isArray(modules)) 
    return callback(new Error('modules name must be array'))

  return exports.load(function(err, npm) {
    if (err) 
      return callback(err)
    if (!dir) 
      return npm.commands.install(modules, callback)

    return npm.commands.install(dir, modules, callback)
  })
}
