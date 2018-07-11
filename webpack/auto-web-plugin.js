const fs = require('fs')
const url = require('url')
const path = require('path')
const util = require('./utils.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

// deprecated
function getDirsInDir(dir, ignorePages = []) {
	const files = fs.readdirSync(dir);
	const ret = [];
	files.forEach(fileName => {
		if (
			ignorePages.findIndex(em => em === fileName) < 0 // not in ignorePages
			&& fs.lstatSync(path.resolve(dir, fileName)).isDirectory() // is Directory
		) {
			ret.push(fileName);
		}
	});
	return ret;
}

var walkDir = function(dir, rootDir='') {
    var results = [];
    if (rootDir == '')
        rootDir = dir;
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walkDir(file, rootDir));
        } else { 
            /* Is a file */
            file = file.replace(rootDir + '/', '');
            results.push(file);
        }
    });
    return results;
}

function getEntryNames(dir, ignoreEntries = []) {
    const files = walkDir(dir);
    var ret = [];
    files.forEach(fileName => {
        if (ignoreEntries.findIndex(em => em === fileName) < 0) { // not in ignoreEntries
            ret.push(fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
        }
    });
    return ret;
}

class AutoWebPlugin {

	constructor(entryDir, options) {
		options = Object.assign({}, options);
    this.options = options;
    this.entryMap = {}
    this.webpackEntry = {}
    const { ignoreEntries, outputPath, entryPath, defaultChunks } = options;
    const entryNames = getEntryNames(entryDir, ignoreEntries);
    entryNames.forEach(entryName => {
        this.entryMap[entryName] = {
            template: path.resolve(__dirname, '../resources/views/bundle.blade.php'),
            filename: path.resolve(outputPath, entryName + '.blade.php'),
            chunks: [entryName, ...defaultChunks]
        };

        this.webpackEntry[entryName] = [path.resolve(entryPath, `${entryName}.js`)]
    });
  }

  // call by webpack
  apply(compiler) {
    global._isProduction = util.isProduction(compiler);
    const { options: compilerOptions } = compiler;
    const { entryMap } = this;
    // compilerOptions.entry default is './src' which is used in hot-reloading
    if (typeof compilerOptions.entry === 'string') {
      compilerOptions.entry = []
    }
    else {
      var index = compilerOptions.entry.indexOf('./src');
      if (index > -1) {
        compilerOptions.entry.splice(index, 1);
      }
    }

    Object.keys(entryMap).forEach(pageName => {
      this.webpackEntry[pageName] = compilerOptions.entry.concat(this.webpackEntry[pageName])

      // add every page to output an html
      const { template, filename, chunks } = entryMap[pageName];
      // const template = path.resolve(__dirname, '../resources/views/template/bundle.blade.php');
      // new HTMLWebpackPlugin
      new HtmlWebpackPlugin({
        template,
        filename,
        chunks,
        alwaysWriteToDisk: true
      }).apply(compiler)
    })
    // ensure entryMap from pages has been add to webpack entry
    // webpack-dev-server may modify compilerOptions.entry, e.g add webpack-dev-server/client to every entry
    compilerOptions.entry = this.webpackEntry
  }
}

module.exports = AutoWebPlugin;