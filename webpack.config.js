const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// Optimization plugins to dramatically improve Lighthouse Performance score
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/app/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    // Configure cache-busting and code-splitting asset naming conventions
    filename: isProduction ? "js/[name].[contenthash:8].js" : "js/[name].js",
    chunkFilename: isProduction ? "js/[name].[contenthash:8].chunk.js" : "js/[name].chunk.js",
    publicPath: "/",
    clean: true,
  },

  mode: isProduction ? "production" : "development",
  // Disable source maps in production to significantly reduce bundle size
  devtool: isProduction ? false : "inline-source-map",

  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },

      // CSS MODULES
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          // Use MiniCssExtractPlugin in production to extract CSS into separate files and eliminate render-blocking styles
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                // Minify class names in production for extreme bundle weight reduction
                localIdentName: isProduction
                  ? "[hash:base64:5]"
                  : "[name]_[local]__[hash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
      },

      // GLOBAL SCSS
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },

      // IMAGE ASSETS
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name].[hash:8][ext]", // Organize all static images into a dedicated assets folder
        },
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // Minify HTML markup in production mode
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      } : false,
    }),
    new CopyPlugin({
    patterns: [
      { 
        from: "public", 
        to: "", 
        globOptions: {
          ignore: ["**/index.html"], 
        },
      },
    ],
  }),
    
    // Only extract CSS styles into standalone stylesheets during production builds
    isProduction && new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].chunk.css",
    }),
  ].filter(Boolean), // .filter(Boolean) safely removes false entries from the array in development mode

  // 🔥 THIS OPTIMIZATION BLOCK KILLS "UNUSED JAVASCRIPT" AND BOOSTS LIGHTHOUSE PERFORMANCE
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({ parallel: true }), // Compresses JavaScript by stripping whitespace and comments
      new CssMinimizerPlugin(), // Minifies and optimizes CSS code structure
    ],
    splitChunks: {
      chunks: "all", // Chops up the bundle into independent chunks. Paired with React.lazy, it eliminates massive initial bundles.
    },
  },
};