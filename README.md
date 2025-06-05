# ✨ gcm — Git Commit CLI with Style

A simple interactive Git commit helper with emoji-tagged types, fuzzy search, `--amend` support, and shell autocompletion.

## 🚀 Features

- 🔍 Fuzzy searchable commit type list
- ✨ Emoji + conventional commit prefixes
- 🧠 Supports `--amend`
- ⌨️ Tab-autocomplete for flags (works in Zsh & Bash)

## 📦 Setup

1. **Clone and install:**

```bash
git clone https://github.com/aristotelis96/gcm-cli.git
cd gcm-cli
npm install
```

## Add to your .bashrc/.zshrc file
```bash
# Commit helper
source ~/gcm-cli/bash_definition
```

## Reload your shell
`source ~/.zshrc`

## Usage
```bash
gcm                 # Start interactive commit
gcm --amend         # Amend the previous commit
```