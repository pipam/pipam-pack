'use strict';

const { Reader } = require('fstream');
const { createWriteStream } = require('fs');
const { createGzip, createDeflate } = require('zlib');
const { Pack } = require('tar');
const { basename, join: joinPath } = require('path');
const { readFile } = require('then-utils');

const types = [
  createGzip,
  createDeflate
];

module.exports = {
  createGzip(inpath, outpath) {
    return this.create(inpath, outpath, 0);
  },
  createDeflate(inpath, outpath) {
    return this.create(inpath, outpath, 1);
  },
  create(inpath, outpath, type) {
    return new Promise((resolve, reject) => {
      const outstream = createWriteStream(outpath);
      const inname = basename(inpath);

      // write the ppz type number
      outstream.write(Buffer.from([type]));
      // write the ppz output folder name length
      outstream.write((() => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(inname.length, 0);
        return buf;
      })());
      // write the ppz output folder name
      outstream.write(Buffer.from(inname, 'utf8'));

      readFile(joinPath(inpath, 'package.json'), 'utf8').then(jsonStr => {
        const pkgJson = JSON.parse(jsonStr);
        const pluginName = pkgJson.name;

        // write the plugin name length
        outstream.write((() => {
          const buf = Buffer.alloc(4);
          buf.writeUInt32LE(pluginName.length, 0);
          return buf;
        })());
        // write the plugin name
        outstream.write(Buffer.from(pluginName, 'utf8'));

        const tar = (new Reader({
          path: inpath,
          type: 'Directory'
        })).on('error', reject)
          .pipe(new Pack({
            noProprietary: true
          })).on('error', reject);

        let compressor = types[type];
        if (!compressor) return reject(new Error('no such compression type'));

        tar
          .pipe(compressor()).on('error', reject)
          .pipe(outstream).on('error', reject).on('finish', resolve);
      });
    });
  }
};
