/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

process.env.NODE_ENV = 'production';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp')
var Pundle = require('pundle')
var rimrafSync = require('rimraf').sync;
var paths = require('../config/paths');

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
rimrafSync(paths.appBuild + '/*');

var pundle = new Pundle({
  entry: [require.resolve('../config/polyfills'), 'index.js'],
  rootDirectory: path.normalize(path.join(__dirname, '../template/src')),
  pathType: 'filePath',
  moduleDirectories: ['node_modules'],
})

pundle.loadPlugins([
  [require.resolve('babel-pundle'), {
    config: require('../config/babel.prod'),
  }],
]).then(function() {
  return pundle.compile()
}).then(function() {
  return new Promise(function(resolve, reject) {
    mkdirp(paths.appBuild, function(error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}).then(function() {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path.join(paths.appBuild, 'bundle.js'), pundle.generate().contents, function(error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}).then(function() {
  var openCommand = process.platform === 'win32' ? 'start' : 'open';
  var homepagePath = require(paths.appPackageJson).homepage;
  console.log('Successfully generated a bundle in the build folder!');
  if (homepagePath) {
    console.log('You can now deploy it to ' + homepagePath + '.');
    console.log('For example, if you use GitHub Pages:');
    console.log();
    console.log('  git commit -am "Save local changes"');
    console.log('  git checkout -B gh-pages');
    console.log('  git add -f build');
    console.log('  git commit -am "Rebuild website"');
    console.log('  git filter-branch -f --prune-empty --subdirectory-filter build');
    console.log('  git push -f origin gh-pages');
    console.log('  git checkout -');
    console.log();
  } else {
    console.log('You can now serve it with any static server.');
    console.log('For example:');
    console.log();
    console.log('  npm install -g pushstate-server');
    console.log('  pushstate-server build');
    console.log('  ' + openCommand + ' http://localhost:9000');
    console.log();
  }
  console.log('The bundle is optimized and ready to be deployed to production.');
}, function(err) {
  console.error('Failed to create a production build. Reason:');
  console.error(err.message || err);
  process.exitCode = 1
})
