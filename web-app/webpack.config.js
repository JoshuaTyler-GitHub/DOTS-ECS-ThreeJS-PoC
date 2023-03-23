// node_modules
const fs = require('fs');

// constants
const REPLACEMENT_END_IDENTIFIER = String('        // Support React Native Web');
const REPLACEMENT_START_IDENTIFIER = String('      alias: {');

// resources
const jsConfigJson = require('./jsconfig.json');
const reactScriptsWebpackPath = String(
  'node_modules/react-scripts/config/webpack.config.js',
);

const getResolveAliases = () => {
  const aliases = {};
  const paths = jsConfigJson.compilerOptions.paths;
  const baseUrl = String(jsConfigJson.compilerOptions.baseUrl);
  for (const pathKey in paths) {
    const aliasKey = String(pathKey).replace('/*', '');
    const pathValue = String(paths[pathKey])
      .replace('.', baseUrl)
      .replace('*', '');
    const formattedPathValue = pathValue.replace('src/', '').substring(0, pathValue.length - 1);
    const aliasValue = String(`path.resolve(paths.appSrc, '${formattedPathValue}')`);
    aliases[aliasKey] = aliasValue;
    console.log(aliasValue);
  }
  return aliases;
};

const addResolveAliases = () => {

  // create ReactScriptsWebpack aliases from jsconfig.json
  const aliasInserts = getResolveAliases();
  const aliasReplacement = String([
    `${REPLACEMENT_START_IDENTIFIER}`,
    ...Object.entries(aliasInserts).map(([key, value]) => {
      return `        '${key}': ${value},`;
    })
    ].join('\r\n') + '\r\n\r\n',
  );

  // read ReactScriptsWebpack
  const reactScriptsWebpack = fs.readFileSync(reactScriptsWebpackPath, 'utf8');
  const replacementStartIndex = reactScriptsWebpack.indexOf(REPLACEMENT_START_IDENTIFIER);
  const replacementEndIndex = reactScriptsWebpack.indexOf(REPLACEMENT_END_IDENTIFIER);

  // create new ReactScriptsWebpack
  const formattedReactScriptsWebpack = String(
    `${reactScriptsWebpack.substring(0, replacementStartIndex)}` +
    `${aliasReplacement}` +
    `${reactScriptsWebpack.substring(replacementEndIndex)}`
  );

  // write new ReactScriptsWebpack
  fs.writeFileSync(
    reactScriptsWebpackPath,
    formattedReactScriptsWebpack,
    'utf-8',
  );
};
addResolveAliases();
