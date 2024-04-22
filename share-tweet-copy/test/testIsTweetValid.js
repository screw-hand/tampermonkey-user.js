// validate.json form https://github.com/twitter/twitter-text/blob/master/conformance/validate.yml, converted the yam to js(onc)
import { validate } from './validate.js'
import { isTweetValid } from '../lib/isTweetValid.js'

function runTests(testCases) {
  let results = [];
  testCases.forEach(test => {
    const result = isTweetValid(test.text);
    results.push({
      description: test.description,
      text: test.text,
      expected: test.expected,
      result
    });
  });
  return results;
}

const formatValidateTest = (tests) => {
  let arr = []
  for (const test in tests) {
    arr = [...arr, ...tests[test]]
  }
  return arr
}

export const run = () => {
  const tests = formatValidateTest(validate.tests)
  const results = runTests(tests)
  console.log(results)
}