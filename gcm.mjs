#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";

const choices = [
  { name: "✨ - feature", value: "✨ - feature" },
  { name: "🐞  fix", value: "🐞 - fix" },
  { name: "✨  feat", value: "✨ - feat" },
  { name: "📝  docs", value: "📝 - docs" },
  { name: "🚀  improvement", value: "🚀 - improvement" },
  { name: "⚡  perf", value: "⚡ - perf" },
  { name: "🛠️  refactoring", value: "🛠️ - refactoring" },
  { name: "🧹- cleanup", value: "🧹- cleanup" },
  { name: "🛠️ - other", value: "🛠️ - other" },
];

async function main() {
  const { type } = await inquirer.prompt({
    type: "list",
    name: "type",
    message: "Select commit type:",
    choices,
  });

  const { message } = await inquirer.prompt({
    type: "input",
    name: "message",
    message: "Enter commit message:",
    validate: (input) => input.trim() !== "" || "Message cannot be empty",
  });

  const fullMessage = `[${type}] ${message}`;

  try {
    execSync(`git commit -m "${fullMessage.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Git commit failed.");
  }
}

main();
