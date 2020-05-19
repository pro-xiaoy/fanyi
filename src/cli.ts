#!/usr/bin/env node
const { Command } = require("commander");
import { translate } from './main_baidu'
const program = new Command();

program
  .version("0.0.1")
  .name("fy")
  .usage("<English>")
  .arguments("<Enghtlish>")
  .action(function (eng: string) {
    translate(eng);
  });

program.parse(process.argv);
