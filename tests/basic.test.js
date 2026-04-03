import {describe, it, expect} from 'vitest';
import { join } from 'node:path';

import { execa } from 'execa';
const binLocation = join(import.meta.dirname, '../bin.js');

describe("basic functionality", () => {
  it('should work correctly', async function() {
    const {stdout} = await execa({cwd: './fixtures'})`node ${binLocation}`;
    let parsedOutput;
    try { 
      parsedOutput = JSON.parse(stdout);
    } catch (err) {
      console.log(stdout);
      throw err;
    }

    expect(parsedOutput).to.have.same.deep.members([
      { name: "only-its.test.js", command: 'vitest only-its.test.js', },
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', },
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', },
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', },
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', },
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"' },
    ]);
  })

  it('adds node versions ot the matrix', async function () {
    const {stdout} = await execa({cwd: './fixtures'})`node ${binLocation} --node 22 24`;
    let parsedOutput;
    try { 
      parsedOutput = JSON.parse(stdout);
    } catch (err) {
      console.log(stdout);
      throw err;
    }

    expect(parsedOutput).to.have.same.deep.members([
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "22"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "22"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "22"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "22"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "22"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "22"},
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "24"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "24"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "24"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "24"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "24"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "24"},
    ]);
  })

  it('adds node versions and os entries to the matrix', async function () {
    const {stdout} = await execa({cwd: './fixtures'})`node ${binLocation} --node 22 24 --os ubuntu-latest windows-latest`;
    let parsedOutput;
    try { 
      parsedOutput = JSON.parse(stdout);
    } catch (err) {
      console.log(stdout);
      throw err;
    }

    expect(parsedOutput).to.have.same.deep.members([
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "22", os: "ubuntu-latest"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "22", os: "ubuntu-latest"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "22", os: "ubuntu-latest"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "22", os: "ubuntu-latest"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "22", os: "ubuntu-latest"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "22", os: "ubuntu-latest"},
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "24", os: "ubuntu-latest"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "24", os: "ubuntu-latest"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "24", os: "ubuntu-latest"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "24", os: "ubuntu-latest"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "24", os: "ubuntu-latest"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "24", os: "ubuntu-latest"},
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "22", os: "windows-latest"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "22", os: "windows-latest"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "22", os: "windows-latest"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "22", os: "windows-latest"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "22", os: "windows-latest"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "22", os: "windows-latest"},
      { name: "only-its.test.js", command: 'vitest only-its.test.js', node: "24", os: "windows-latest"},
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', node: "24", os: "windows-latest"},
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', node: "24", os: "windows-latest"},
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', node: "24", os: "windows-latest"},
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', node: "24", os: "windows-latest"},
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"', node: "24", os: "windows-latest"},
    ]);
  })
})