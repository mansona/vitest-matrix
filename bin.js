#!/usr/bin/env node
import { execa } from 'execa';
import { relative } from 'node:path'

const { stdout } = await execa`npx vitest list --json`;

const parsedOutput = JSON.parse(stdout);
const testFiles = {};

/**
 * First we group all the tests to each of the files on their own
 */
for (let entry of parsedOutput) {
  let relativeFile = relative(process.cwd(), entry.file);
  if(!testFiles[relativeFile]) {
    testFiles[relativeFile] = []
  }

  testFiles[relativeFile].push(entry.name);
}


const include = [];

function pushoutput(name, command) {
  include.push({name, command})
}

/**
 * Next we check if any of the tests in each test file has a `>` character, and if so we split and push them into the filter
 */
for( let [file, tests] of Object.entries(testFiles)) {
  if (tests.some(testName => testName.includes('>'))) {
    const testSet = new Set();

    for( let testName of tests) {
      testSet.add(testName.split('>')[0].trim())
    }

    for( let testFilter of testSet) {
      pushoutput(`${file} - ${testFilter}`, `vitest ${file} --testNamePattern "${testFilter}"`)
    }
  } else {
    pushoutput(`${file}`, `vitest ${file}`)
  }
}

if (process.argv.includes('--commands-only')) {
  console.log(JSON.stringify(include.map(item => item.command)));
} else {
  console.log(JSON.stringify(include));
}