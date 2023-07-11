#!/usr/bin/env node

import chalk from "chalk";
import downloader from "download-git-repo";
import { createSpinner } from "nanospinner";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function init() {
    const spinner = createSpinner("Downloading webping...").start();
    downloader('ryzmae/webping', './webping', function (err) {
        if (err) {
            spinner.error("Failed to download webping.");
        } else {
            spinner.success("Webping has been downloaded!");
            console.log(chalk.green.bold("Run 'cd webping' and 'sh start.sh' to start webping."),);
        }
    })
}

await init();