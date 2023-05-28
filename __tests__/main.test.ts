import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import { expect, test } from '@jest/globals';

test('sets output to javascript if the repository contains a .js file', () => {
  const owner = 'octocat';
  const repo = 'hello-world';
  process.env['INPUT_OWNER'] = owner;
  process.env['INPUT_REPO'] = repo;
  process.env['GITHUB_SHA'] = '1234567890abcdef';
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
  expect(options.toString().trim()).toBe(JSON.stringify(['javascript', 'cpp']));
});
