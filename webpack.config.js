const path = require('path');

module.exports = {
    entry: {
        app: './client/market.jsx',
        login: './client/login.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|css)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};