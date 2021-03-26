'use strict'

const webpackVersion = require('webpack').version;

function VueHookWebpackPlugin(options){
	
}

module.exports = VueHookWebpackPlugin;

const pluginName = "VueHookWebpackPlugin";
function hook(obj, key, cb) {
	if (webpackVersion < '4') {
		obj.plugin(key, cb);
	} else {
		key = key.split("-").map((it, idx) => idx == 0 ? it : (it.charAt(0).toUpperCase() + it.substr(1))).join("");
		obj.hooks[key].tap(pluginName, cb);
	}
}

VueHookWebpackPlugin.prototype.apply = function(compiler) {
	hook(compiler, "compilation", function(compilation) {
		hook(compilation, "normal-module-loader", function(wpModule, normalModule, c) {

			var type = "";
			var str = normalModule.userRequest.replace(/[\\/]+/g, "/");
			if (str.indexOf("node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js") >= 0) {
				type = "runtime";
			} else {
				return;
			}

			normalModule.loaders.push({
				loader: '@xxxxst/vue-hook-webpack-plugin/lib/loader.js',
				options: {
					path: str,
					type: type,
				}
			});
		});
	});
}