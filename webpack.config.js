const path = require('path');                             // 絶対パス取得用
const htmlWebpackPlugin = require('html-webpack-plugin'); // dist/index.htmlをビルドチェインの中で作成

module.exports = {
    mode: 'development',                                  // 開発中: development / 本番用: production
    entry: './src/index.tsx',                             // エントリポイント
    module: {
        rules: [
            {
                test: /\.tsx?$/,                          // tslint-loaderに渡すファイルの正規表現。xxx.tsとxxx.tsxの正規表現。
            },
            {
                loader: 'ts-loader',                      // トランスパイルのローダーを指定
                test: /\.tsx?$/,
                options: {
                    configFile: 'tsconfig.json'           // TypeScriptのコンパイル設定ファイル
                }
            }
        ]
    },
    devServer: {
        static: {
          directory: `${__dirname}/dist`,
        },
        open: true,
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]              // ここに登録した拡張子はimport時に省略できる
    },
    output: {
        filename: 'dist/js/bundle.js',                    // compile & bundle 後のファイル名およびパスを指定
        path: path.resolve(__dirname, 'dist')             // 出力ディレクトリの絶対パスを指定
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/index.html"                  // src/index.html (開発フォルダのhtml)を元に dist/index.html (本番用のhtml)を自動生成してくれる
        })
    ]
};
