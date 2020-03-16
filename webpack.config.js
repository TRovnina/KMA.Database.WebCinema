var path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            // ...additional rules...
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf|eot)$/,
                loader: 'url-loader'
            }
        ],
    },
    // ...previous Webpack config...
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
};