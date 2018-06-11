const fs = require('fs')
const url = require('url')
const path = require('path')
const util = require('./utils.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

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

class AutoWebPlugin {

	constructor(pageDir, options) {
		options = Object.assign({}, options);
    this.options = options;
    this.entryMap = {}
    this.webpackEntry = {}
		const { ignorePages, outputPath, entryPath, defaultChunks } = options;
    const pageNames = getDirsInDir(pageDir, ignorePages);
		pageNames.forEach(pageName => {
      this.entryMap[pageName] = {
        template: path.resolve(pageDir, pageName, 'index.blade.php'),
        filename: path.resolve(outputPath, pageName, 'index.blade.php'),
        chunks: [pageName, ...defaultChunks]
      }
      
      this.webpackEntry[pageName] = [path.resolve(entryPath, `${pageName}.js`)]
		})
	}

	// call by webpack
	apply(compiler) {
		global._isProduction = util.isProduction(compiler);
		const { options: compilerOptions } = compiler;
		const { entryMap } = this;
		// compilerOptions.entry default is './src'
		if (typeof compilerOptions.entry === 'string') compilerOptions.entry = []
		else {
			var index = compilerOptions.entry.indexOf('./src');
			if (index > -1) {
				compilerOptions.entry.splice(index, 1);
			}
		}
		Object.keys(entryMap).forEach(pageName => {
			this.webpackEntry[pageName] = this.webpackEntry[pageName].concat(compilerOptions.entry)

			// add every page to output an html
      const { template, filename, chunks } = entryMap[pageName];
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