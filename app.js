#! /usr/bin/env node
const { Command } = require('commander');
const fs = require("fs/promises");
const path = require("path");
const program = new Command();

program.command('add')
  .description('Adds expense')
  .argument('<expenses>', 'Expense to add in DB')
  .action(async (expense ) => {
    try {
      const filePath = path.join(__dirname, "packet.json");
      const data = await fs.readFile(filePath, "utf-8");
      const expenses = data ? JSON.parse(data) : [];
      expenses.push({ expense });
      await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
      console.log("Expense added successfully!");
    } catch (e) {
      console.error(e);
    }
  });

program.parse();


program
  .command('search')
  .description('Searches expenses by date and category')
  .option('-d, --date <date>', 'Date of the expense in YYYY-MM-DD format')
  .option('-c, --category <category>', 'Category of the expense')
  .action(async ({ date, category }) => {
    try {
      const filePath = path.join(__dirname, 'packet.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const expenses = data ? JSON.parse(data) : [];

      const filteredExpenses = expenses.filter((expense) => {
        const isDateMatch = !date || expense.date === date;
        const isCategoryMatch = !category || expense.category === category;
        return isDateMatch && isCategoryMatch;
      });

      if (filteredExpenses.length > 0) {
        console.log('Matching Expenses:', filteredExpenses);
      } else {
        console.log('No expenses found for the given criteria.');
      }
    } catch (e) {
      console.error(e);
    }
  });

program.parse();
program
  .command('delete')
  .description('Deletes an expense by ID')
  .option('-i, --id <id>', 'ID of the expense to delete')
  .action(async ({ id }) => {
    try {
      const filePath = path.join(__dirname, 'packet.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const expenses = data ? JSON.parse(data) : [];

      const indexToDelete = expenses.findIndex((expense) => expense.id === parseInt(id));

      if (indexToDelete !== -1) {
        expenses.splice(indexToDelete, 1);
        await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
        console.log(`Expense with ID ${id} deleted successfully!`);
      } else {
        console.log(`Expense with ID ${id} not found.`);
      }
    } catch (e) {
      console.error(e);
    }
  });

