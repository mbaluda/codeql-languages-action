import * as core from '@actions/core'
import { Octokit } from "@octokit/rest";

async function run(): Promise<void> {
  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const octokit = new Octokit();

    const { data: tree} = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: process.env.GITHUB_SHA ? process.env.GITHUB_SHA : "HEAD",
      recursive: "true",
    });
  
    let languages = [];

    const hasJSFile = tree.tree.some((item) => item.path?.match(/\.js$/));
    if (hasJSFile) languages.push('javascript');

    const hasCPPFile = tree.tree.some((item) => item.path?.match(/\.cpp$/));
    if (hasCPPFile) languages.push('cpp');

    core.setOutput('languages', languages)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
