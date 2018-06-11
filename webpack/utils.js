const path = require('path');
const url = require('url');

function isProduction(compiler) {
	if (process.env.NODE_ENV === 'production') {
		// define in nodejs
		return true;
	}
	return false;
}

function isExtractStyle(compiler) {
	const plugins = compiler.options.plugins;
	try {
		const ExtractTextPlugin = require('extract-text-webpack-plugin');
		for (let i = 0; i < plugins.length; i++) {
			const plugin = plugins[i];
			if (plugin.__proto__.constructor === ExtractTextPlugin) {
				if (plugin.filename.endsWith('.css')) {
					return true;
				}
			}
		}
	} catch (_) {
		//
	}
	return false;
}

module.exports = {isProduction, isExtractStyle}
