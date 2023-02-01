---
sidebar_position: 2
---

# Project Templates

The `apex new` command can be used to create a new project from either a basic github repository or from a TypeScript template generator. Programmatic templates are useful when your project needs outgrow a simple `git clone` or directory copy.

To create a new project from a template, use `apex new`:

```sh
apex new <template> <project-name>
```

When cloning from git repositories, you can use `-p` or `--path` to specify a subdirectory to use as the template source. This lets you keep examples and boilerplate in the same repositories as their main projects.

The following command uses the template located in the `templates/nodejs` directory of the repository housed at [github.com/apexlang/codegen](https://github.com/apexlang/codegen).

```sh
apex new https://github.com/apexlang/codegen.git -p templates/nodejs my-project
```

## Template files and data

Any file ending with a `.tmpl` extension will be processed as a template with data substituted from the user or environment.

This example `package.json` from the nodejs template uses the `name`, `version`, `description`, and `author` variables to fill in the package metadata.

```json
{
  "name": "{{.name}}",
  "version": "{{.version}}",
  "description": "{{.description}}",
  "author": "{{.author}}",
  "main": "dist/index.js",
  "scripts": {
    "eslint": "eslint src/service.ts",
    "build": "tsc",
    "lint": "./node_modules/eslint/bin/eslint.js  src --ext .ts",
    "fix-lint": "./node_modules/eslint/bin/eslint.js  src --ext .ts --fix"
  },
  "dependencies": {
    "@types/uuid": "^8.3.4",
    "uuid": "^8.3.2"
  },
  "devDependencies": {
    "@types/node": "16.4.10",
    "@typescript-eslint/eslint-plugin": "4.29.0",
    "@typescript-eslint/parser": "4.29.0",
    "eslint": "7.32.0",
    "eslint-plugin-import": "2.23.4",
    "ts-node": "10.1.0",
    "typescript": "4.3.5"
  }
}
```

The data variables can be defined in a `.template` file in the same directory as the template. This file is a YAML file and looks like this:

```yaml
description: A nodejs template
variables:
  - name: author
    description: The project author
    prompt: Please enter the project author
  - name: description
    description: The project description
    prompt: Please enter the project description
  - name: version
    description: The project version
    prompt: Please enter the version
    default: 0.0.1
```
