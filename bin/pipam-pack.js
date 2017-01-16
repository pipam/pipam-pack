#!/usr/bin/env node

'use strict';

const { join: joinPath, isAbsolute, extname } = require('path');
const { create: pack } = require('../lib');

const types = {
  'gzip': 0,
  'deflate': 1
};

const argv = require('yargs')
  .usage('$0 [<my-plugin-folder>] [args]')
  .demand(1)
  .option('o', {
    alias: 'output',
    demand: false,
    default: joinPath(process.cwd(), 'packed.ppz'),
    describe: 'output filename for the archive'
  })
  .option('t', {
    alias: 'type',
    demand: false,
    default: 'gzip',
    describe: 'output compression type for the archive',
    choices: ['gzip', 'deflate']
  })
  .help()
  .argv;

let inpath = argv._[0];
let outpath = argv.o;
let type = argv.t;

// input folder
if (!isAbsolute(inpath)) inpath = joinPath(process.cwd(), inpath);

// output file
if (!isAbsolute(outpath)) outpath = joinPath(process.cwd(), outpath);
if (extname(outpath) !== '.ppz') outpath = `${outpath}.ppz`;

pack(inpath, outpath, types[type]).then(() => {
  console.log(`Done packing into ${outpath}!`);
}).catch(err => {
  console.log(`Something blew up: ${err.stack}`);
});
