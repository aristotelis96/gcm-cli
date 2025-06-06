#!/usr/bin/env node

import { search, editor } from "@inquirer/prompts";
import { execSync } from "child_process";
import fuzzysort from "fuzzysort";
import { Command } from "commander";

const program = new Command();

program
  .name("gcm")
  .description("A friendly interactive Git commit CLI")
  .option(
    "-m, --message <msg>",
    "Provide commit message directly (skips editor)"
  )
  .option("--amend", "Amend the previous commit")
  .option("--no-edit", "Use previous commit message without editing", true)
  .helpOption("-h, --help", "Show help");

program.parse(process.argv);
const options = program.opts();
const { edit: editMessage, message: passedMessage, amend: isAmend } = options;

const choices = [
  { name: "✨ Feature", value: "✨ - feature" },
  { name: "🐞 Fix", value: "🐞 - fix" },
  { name: "🚀 Improvement", value: "🚀 - improvement" },
  { name: "⚡ Performance", value: "⚡ - perf" },
  { name: "📝 Documentation", value: "📝 - docs" },
  { name: "🛠️ Refactor", value: "🛠️ - refactoring" },
  { name: "✅ Test", value: "✅ - test" },
  { name: "🎨 Style", value: "🎨 - style" },
  { name: "🧹 Cleanup", value: "🧹 - cleanup" },
  { name: "📦 Build", value: "📦 - build" },
  { name: "⚙️ Config", value: "⚙️ - config" },
  { name: "🔁 Merge", value: "🔁 - merge" },
  { name: "🚧 WIP", value: "🚧 - wip" },
  { name: "⏪ Revert", value: "⏪ - revert" },
  { name: "📍 Checkpoint", value: "📍 - checkpoint" },
  { name: "🛠️ Other", value: "🛠️ - other" },
];

async function main() {
  if (isAmend && !editMessage) {
    try {
      execSync(`git commit --amend --no-edit`, { stdio: "inherit" });
    } catch (error) {
      console.error("Git commit --amend --no-edit failed.");
    }
    return;
  }

  const type = await search({
    message: "Select an npm package",
    source: async (input, { signal }) => {
      if (!input) {
        return choices;
      }
      input = input || "";
      const results = fuzzysort.go(input, choices, {
        key: "name",
        limit: 10,
      });
      return results.map((res) => res.obj);
    },
  });

  let message = passedMessage;
  if (!message) {
    const response = await editor({
      message: "Enter commit message",
      default: "",
      waitForUseInput: false,
    });
    if (response === "") {
      console.error("Git commit failed. Empty commit message.");
      return;
    }
    message = response;
  }

  const fullMessage = `[${type}] ${message.trim()}`;

  let command = `git commit -m "${fullMessage.replace(/"/g, '\\"')}"`;
  if (isAmend) command += " --amend";
  if (!editMessage) command += " --no-edit";

  try {
    execSync(command, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Git commit failed.");
  }
}

main();
