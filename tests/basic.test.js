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
    expect(parsedOutput.name).to.have.same.members([
      "only-its.test.js",
      "subfolder/thing.test.js",
      "something.test.js - a basic test",
      "something.test.js - another basic test",
      "something.test.js - comes from the outside",
      "something.test.js - has a friend",
    ]);

    expect(parsedOutput.include).to.have.same.deep.members([
      { name: "only-its.test.js", command: 'vitest only-its.test.js', },
      { name: "subfolder/thing.test.js", command: 'vitest subfolder/thing.test.js', },
      { name: "something.test.js - a basic test", command: 'vitest something.test.js --testNamePattern "a basic test"', },
      { name: "something.test.js - another basic test", command: 'vitest something.test.js --testNamePattern "another basic test"', },
      { name: "something.test.js - comes from the outside", command: 'vitest something.test.js --testNamePattern "comes from the outside"', },
      { name: "something.test.js - has a friend", command: 'vitest something.test.js --testNamePattern "has a friend"' },
    ]);
  })
})