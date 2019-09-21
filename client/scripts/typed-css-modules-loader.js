const chalk = require('chalk');
const DtsCreator = require('typed-css-modules');
const prettier = require('../../scripts/prettier');

const creator = new DtsCreator();

module.exports = function moduleLoader(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();

  creator
    .create(this.resourcePath, source)
    .then(content => {
      return content
        .writeFile()
        .then(() => prettier.formatFile(content.outputFilePath, content.outputFilePath))
        .then(() => {
          callback(null, source, map);
        });
    })
    .catch(error => {
      console.log(chalk.red(chalk.red('CSS module type generation failed.')));
      console.log(error.message);

      if (error.stack != null) {
        console.log(chalk.gray(error.stack));
      }
    });
};