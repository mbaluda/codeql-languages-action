import * as core from '@actions/core'
import { Octokit } from "@octokit/rest"

async function run(): Promise<void> {
  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const exclude_codeql_languages: string = core.getInput('exclude_codeql_languages');

    core.info(`Repo: ${owner}/${repo}`);
    core.info(`SHA: ${process.env.GITHUB_SHA}`);

    const { data: tree } = await new Octokit().rest.git.getTree({
      owner, repo,
      tree_sha: process.env.GITHUB_SHA ? process.env.GITHUB_SHA : "HEAD",
      recursive: "true",
    });

    let languages = [];

    const hasCppFile = tree.tree.some((item) =>
      item.path?.match(/\.(cpp|c\+\+|cxx|c|cc)$/));
    if (hasCppFile) languages.push('cpp');

    const hasCsharpFile = tree.tree.some((item) =>
      item.path?.match(/\.(cs|cshtml|xaml)$/));
    if (hasCsharpFile) languages.push('csharp');

    const hasGoFile = tree.tree.some((item) =>
      item.path?.match(/\.go$/));
    if (hasGoFile) languages.push('go');

    const hasJavaFile = tree.tree.some((item) =>
      item.path?.match(/\.(java|kt)$/));
    if (hasJavaFile) languages.push('java');

    const hasPythonFile = tree.tree.some((item) =>
      item.path?.match(/\.py$/));
    if (hasPythonFile) languages.push('python');

    const hasRubyFile = tree.tree.some((item) =>
      item.path?.match(/\.(rb|erb)$/));
    if (hasRubyFile) languages.push('ruby');

    const hasJavascriptFile = tree.tree.some((item) =>
      item.path?.match(/\.(js|jsx|mjs|es|es6|htm|html|xhtm|xhtms|vue|hbs|ejs|njk|ts|tsx|mts|cts)$/));
    if (hasJavascriptFile) languages.push('javascript');

    // remove excluded languages
    languages = languages.filter(x => !exclude_codeql_languages.includes(x));
    core.setOutput('languages', languages);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
