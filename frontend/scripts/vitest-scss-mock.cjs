/**
 * Vitest mock for .scss imports. Returns the same string for every key so
 * styles.button, styles.primary, etc. work in tests without real CSS modules.
 */
module.exports = new Proxy(
  {},
  {
    get(_, key) {
      return String(key);
    },
  }
);
