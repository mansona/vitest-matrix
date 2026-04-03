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

  it('returns an array of commands when --commands-only is passed', async function() {
    const {stdout} = await execa({cwd: './fixtures'})`node ${binLocation} --commands-only`;
    let parsedOutput = JSON.parse(stdout);
    expect(parsedOutput).to.have.same.deep.members([
      "vitest only-its.test.js",
      "vitest subfolder/thing.test.js",
      "vitest something.test.js --testNamePattern \"a basic test\"",
      "vitest something.test.js --testNamePattern \"another basic test\"",
      "vitest something.test.js --testNamePattern \"comes from the outside\"",
      "vitest something.test.js --testNamePattern \"has a friend\""
    ]);
  })
})