// const { writeFileSync } = require('fs');
// const shell = require('shelljs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        // console.log(results.report);
        // return chrome.kill().then(() => results.lhr);
        return chrome.kill().then(() => ({
          // html: results.report,
          // results,
          results,
        }));
      });
    });
}

const defaultOptions = {
  chromeFlags: ['--show-paint-rects'],
  onlyCategories: ['performance'],
  output: 'html',
  // output: 'json',
  outputPath: './lighthouse-results.html',
};

const generateReport = async (
  url = 'https://example.com',
  options = defaultOptions
) => {
  const results = await launchChromeAndRunLighthouse(url, options);

  // writeFileSync('./output.html', results, 'utf8');
  return {
    ...results.results,
    // report: JSON.parse(results.results.report),
  };
};

module.exports = {
  generateReport,
};

// shell.exec('yarn lighthouse https://example.com --view')
