# Fix: npm warn Unknown env config "devdir"

This warning appears because an invalid npm config key `devdir` is set via an **environment variable** on your machine (not in this repo).

## Fix (choose one)

### 1. For the current terminal session only

```bash
unset NPM_CONFIG_DEVDIR
```

### 2. Permanent fix: remove from your shell profile

Find where `NPM_CONFIG_DEVDIR` or `devdir` is set and remove that line:

- **zsh**: `~/.zshrc` or `~/.zprofile`
- **bash**: `~/.bashrc` or `~/.bash_profile`

Search for `DEVDIR` or `devdir`, then delete or comment out that line. Restart the terminal (or run `source ~/.zshrc`).

### 3. Optional: remove from npm config file

If it was set via `npm config set devdir ...`, run:

```bash
npm config delete devdir
```

(Note: If the warning persists, the value is coming from an env var; use step 1 or 2.)
