# pipam-pack

Pack your Pipam plugins into a neat little archive!

## CLI Usage

```bash
pipam-pack [<my-plugin-folder>] [-t <compression-type>] [-o <output-filename>]
```

Specify a folder to pack (can be relative to the current directory); if none is provided, the current directory will be used. Optionally, specify an output filename with `-o` (or `--output`). If the filename doesn't end with `.ppz`, `.ppz` will be added to the end. You can also provide a compression type for the output archive; the default is `gzip`. You can choose `gzip` or `deflate`.

##### Example

```bash
pipam-pack pipam-homebrew -o homebrew.ppz
```
