#!/usr/bin/env node
import { execa } from 'execa';
import { relative } from 'node:path'

import { program } from 'commander';

program
  .name('vitest-matrix')
  .option('--node <versions...>', 'add node versions to the output matrix')
  .option('--os <os...>',  'add os entries to the output matix')
  .option('-p, --pretty', 'pretty print the output - useful for debugging')

program.parse();

const options = program.opts();

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


let include = [];

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

if (options.node) {
  let newInclude = [];

  for(let nodeVersion of options.node) {
    for(let entry of include) {
      newInclude.push({
        ...entry,
        node: nodeVersion,
      })
    }
  }

  include = newInclude;
}

if (options.os) {
  let newInclude = [];

  for(let os of options.os) {
    for(let entry of include) {
      newInclude.push({
        ...entry,
        os,
      })
    }
  }

  include = newInclude;
}

if (options.pretty) {
  console.log(JSON.stringify(include, null, 2));
} else {
  console.log(JSON.stringify(include));
}