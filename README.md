# vue-hook-webpack-plugin

inject hook to vue, support vue3 or high version

[https://github.com/xxxxst/vue-hook-webpack-plugin](https://github.com/xxxxst/vue-hook-webpack-plugin)

# install
Using npm:

```
npm install --save-dev @xxxxst/vue-hook-webpack-plugin
```

or using yarn:

```
yarn add @xxxxst/vue-hook-webpack-plugin --dev
```

# Useage
vue.config.js
```js
const VueHookWebpackPlugin = require("@xxxxst/vue-hook-webpack-plugin");

module.exports = {
    // ...
    configureWebpack: config => {
        config.plugins.push(
			new VueHookWebpackPlugin(),
		);
    }
}
```

# License

MIT

[LICENSE](./LICENSE)
