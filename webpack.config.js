const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const BASE_JS = "./src/client/js/"

module.exports = {
    entry: {
        main: BASE_JS + '/main.js',
        modalBox: BASE_JS + '/modalBox.js',
        columnMenu: BASE_JS + '/columnMenu.js',
        dropUploadVideo: BASE_JS + "/dropUploadVideo.js",
        videoPlayer: BASE_JS + "/videoPlayer.js",
        flexInfoSlider: BASE_JS + "/flexInfoSlider.js",
        commentSection: BASE_JS + "/commentSection.js",
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: { 
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                        "plugins": [['@babel/plugin-transform-runtime',
                        {
                          helpers: false,
                          regenerator: true
                        }]]
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|gif|svg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                    }
                },
            },
            {
                test: /\.vtt$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'captions/[name].[ext]',
                    }
                }
            }
        ],
     },
};