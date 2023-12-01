const path = require("path");
module.exports ={
    entry: "./src/main.js",
    output: {
        filename: "bundle.js",
        publicPath: "/",
        path: path.join(__dirname, 'dist'),
        clean: true
    },
    mode : 'development',
    target: 'node',
    module: {
        rules: [
            {
                test : /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}
