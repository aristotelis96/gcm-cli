#!/usr/bin/env node

import inquirer from "inquirer";
import autocomplete from "inquirer-autocomplete-prompt";
import { execSync } from "child_process";
import fuzzysort from "fuzzysort";

// Register autocomplete prompt
inquirer.registerPrompt("autocomplete", autocomplete);

// Check for --amend flag
const isAmend = process.argv.includes("--amend");
const isNoEdit = process.argv.includes("--no-edit");

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
  if (isAmend && isNoEdit) {
    try {
      execSync(`git commit --amend --no-edit`, { stdio: "inherit" });
    } catch (error) {
      console.error("Git commit --amend --no-edit failed.");
    }
    return;
  }

  const { type } = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "type",
      message: "Select commit type (search or use arrows):",
      source: async (_, input) => {
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
    },
  ]);

  const { message } = await inquirer.prompt({
    type: "input",
    name: "message",
    message: "Enter commit message:",
    validate: (input) => input.trim() !== "" || "Message cannot be empty",
  });

  const fullMessage = `[${type}] ${message}`;

  let command = `git commit -m "${fullMessage.replace(/"/g, '\\"')}"`;
  if (isAmend) command += " --amend";
  if (isNoEdit) command += " --no-edit";

  try {
    execSync(command, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Git commit failed.");
  }
}

main();
