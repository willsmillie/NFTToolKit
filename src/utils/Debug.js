// Env vars
const { VERBOSE } = (function () {
  const { env } = process;
  return {
    ...env,
    CHAIN_ID: parseInt(env.CHAIN_ID),
    VERBOSE: /^\s*(true|1|on)\s*$/i.test(env.VERBOSE),
  };
})();

const debug = (...args) => {
  if (VERBOSE) console.log(...args);
};

module.exports = { debug };
