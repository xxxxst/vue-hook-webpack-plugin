
const getOptions = require('loader-utils').getOptions;

module.exports = function VueHookLoader(code) {
	const options = getOptions(this);

	var type = options && options.type || "";

	switch (type) {
		case "runtime": {
			code = parseCode(code);
			break;
		}
		default: {
			break;
		}
	}

	return code;
}

function replaceCode(oldStr, match, newStr) {
	if (typeof (match) == "object") {
		
		var mat = oldStr.match(match);
		if (!mat) {
			console.error("\x1b[31m[@xxxxst/vue-hook-webpack-plugin] vue version seem to be unsupported, hook not works");
			return oldStr;
		}

		match = mat[0];
	}
	
	var idx = oldStr.indexOf(match);
	if (idx < 0) {
		console.error("\x1b[31m[@xxxxst/vue-hook-webpack-plugin] vue version seem to be unsupported, hook not works");
		return oldStr;
	}

	return oldStr.substr(0, idx) + match + newStr + oldStr.substr(idx + match.length);
}

function parseCode(code) {
	// getPublicInstanceProxyHandlers
	var mat1 = /get\(\{.*\},\s*key\s*\)\s*\{/;
	var str1 = `
		for(var i = 0; i < RuntimeHook.getPublicInstanceProxyHandlers.length; ++i) {
			var rst = RuntimeHook.getPublicInstanceProxyHandlers[i].call(this, instance, key);
			if(!rst || !rst.handler) {
				continue;
			}
			return rst.data;
		}
`;
	code = replaceCode(code, mat1, str1);

	// setPublicInstanceProxyHandlers
	var mat2 = /set\(\{.*\},\s*key,\s*value\)\s*\{/;
	var str2 = `
		for(var i = 0; i < RuntimeHook.setPublicInstanceProxyHandlers.length; ++i) {
			var rst = RuntimeHook.setPublicInstanceProxyHandlers[i].call(this, instance, key, value);
			if(!rst || !rst.handler) {
				continue;
			}
			return rst.success;
		}
`;
	code = replaceCode(code, mat2, str2);

	// _createVNodeHandlers
// 	var mat3 = /function _createVNode\(.*\)\s\{/;
// 	var str3 = `
// 	var _vh_isHandled = false;
// 	var _vh_opt = { type, props, children, patchFlag, dynamicProps, isBlockNode };
// 	for(var i = 0; i < RuntimeHook._createVNodeHandlers.length; ++i) {
// 		var rst = RuntimeHook._createVNodeHandlers[i].call(this, _vh_opt);
// 		if(!rst) {
// 			continue;
// 		}
// 		var { type, props, children, patchFlag, dynamicProps, isBlockNode } = rst;
// 		_vh_isHandled = true;
// 	}
// 	if(_vh_isHandled) {
// 		var { type, props, children, patchFlag, dynamicProps, isBlockNode } = _vh_opt;
// 	}
// `;
// 	code = replaceCode(code, mat3, str3);
	
	// export hook
	code = code + `
var RuntimeHook = {
	getPublicInstanceProxyHandlers: [],
	setPublicInstanceProxyHandlers: [],
};

export { RuntimeHook };
`;

	return code;
}
