import * as core from '@actions/core'
import { Octokit } from "@octokit/rest"

async function run(): Promise<void> {
  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    core.info(`Repo: ${owner}/${repo}`);
    core.info(`SHA: ${process.env.GITHUB_SHA}`);

    const { data: tree1 } = await new Octokit().rest.git.getTree({
      owner,
      repo,
      tree_sha: process.env.GITHUB_SHA ? process.env.GITHUB_SHA : "HEAD",
      recursive: "true",
    });

    const hasCPPFile = tree1.tree.some((item) => item.path?.match(/\.(cpp\|c\+\+|cxx|hpp|hh|h\+\+\|hxx|c|cc|h)$/));
    core.info(`hasCPPFile: ${hasCPPFile}`);

    const hasJSFile = tree1.tree.some((item) => item.path?.match(/\.\(js\|jsx\|mjs\|es\|es6\|htm\|html\|xhtm\|xhtms\|vue\|hbs\|ejs\|njk\|json\|yaml\|yml\|raml\|xml\|ts\|tsx\|mts\|cts\)$/));
    core.info(`hasJSFile: ${hasJSFile}`);

    let languages = [];
    if (hasCPPFile) languages.push('cpp');
    if (hasJSFile) languages.push('javascript');

    core.setOutput('languages', languages)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
