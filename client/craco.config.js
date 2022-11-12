const importGlob = require("babel-plugin-import-glob");
const path = require("path");

module.exports = {
    babel: {
        presets: [],
        plugins: [importGlob],
        loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */},
    },
    webpack: {
        alias: {
            'react-planner': path.join(__dirname, './src/react-planner/index')
        },
        configure: {
            module: {
                rules: [
                    {
                        test: /(items).*\.(png|jpe?g)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/media/[name][ext]',
                        }
                    }
                ]
            },
        },
        // configure: (webpackConfig, {env, paths}) => {
        //     return webpackConfig
        // }
    }
}
