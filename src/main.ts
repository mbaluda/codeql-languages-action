import * as core from '@actions/core'
import { Octokit } from "@octokit/rest"

async function run(): Promise<void> {
  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const exclude_codeql_languages: string = core.getInput('exclude_codeql_languages');

    core.info(`Repo: ${owner}/${repo}`);
    core.info(`SHA: ${process.env.GITHUB_SHA}`);
    core.info(`Exclusion: ${exclude_codeql_languages}`);

    // Limited to 100'000 files
    const { data: tree } = await new Octokit().rest.git.getTree({
      owner, repo,
      tree_sha: process.env.GITHUB_SHA ? process.env.GITHUB_SHA : "HEAD",
      recursive: "true",
    });

    let languages = [];

    if (!exclude_codeql_languages.includes('cpp') && tree.tree.some((item) =>
      item.path?.match(/\.(cpp|c\+\+|cxx|c|cc)$/))) {
      languages.push('cpp');
    }

    if (!exclude_codeql_languages.includes('csharp') && tree.tree.some((item) =>
      item.path?.match(/\.(cs|cshtml|xaml)$/))) {
      languages.push('csharp');
    }

    if (!exclude_codeql_languages.includes('go') && tree.tree.some((item) =>
      item.path?.match(/\.go$/))) {
      languages.push('go');
    }

    if (!exclude_codeql_languages.includes('java') && tree.tree.some((item) =>
      item.path?.match(/\.(java|kt)$/))) {
      languages.push('java');
    }

    if (!exclude_codeql_languages.includes('python') && tree.tree.some((item) =>
      item.path?.match(/\.py$/))) {
      languages.push('python');
    }

    if (!exclude_codeql_languages.includes('ruby') && tree.tree.some((item) =>
      item.path?.match(/\.(rb|erb)$/))) {
      languages.push('ruby');
    }

    if (!exclude_codeql_languages.includes('javascript') && tree.tree.some((item) =>
      item.path?.match(/\.(js|jsx|mjs|es|es6|htm|html|xhtm|xhtms|vue|hbs|ejs|njk|ts|tsx|mts|cts)$/))) {
      languages.push('javascript');
    }

    core.setOutput('languages', languages);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
