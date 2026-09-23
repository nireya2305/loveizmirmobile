const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /node_modules\/.*expo-crypto.*_tmp.*/,
  /node_modules\/.*\.cache\/openid-client\/.*/,
  /node_modules\/.*_tmp_\d+.*/,
];

module.exports = config;
