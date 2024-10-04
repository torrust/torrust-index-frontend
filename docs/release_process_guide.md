# Release Process (v1.0.0)

## Version

> **The `[semantic version]` is bumped according to releases, new features, and breaking changes.**
>
> *The `main` branch uses the semantic version of the last released version.

## Process

**Note**: this guide assumes that the your git `torrust` remote is like this:

```sh
git remote show torrust
```

```s
* remote torrust
  Fetch URL: git@github.com:torrust/torrust-index-gui.git
  Push  URL: git@github.com:torrust/torrust-index-gui.git
...
```

### 1. The `main` branch is ready for a release

```sh
npm install && npm run lint && npm run build
```

There should be no errors installing or building the library.

### 2. Change the version in the `package.json` file

Change the version in the `package.json` file. For example `3.0.0`.

You might need to update also the torrust dependencies:

- torrust-index-api-lib
- torrust-index-types-lib

```sh
npm update torrust-index-types-lib
npm update torrust-index-api-lib
```

> NOTICE: The `v` prefix is not needed.

Install and run linter and build to double-check:

```sh
npm install && npm run lint && npm run build
```

At this point, you should check that the new version is working wit the Index, before creating the tag.

Commit the changes:

```sh
git add -A
git commit -m "feat: release [semantic version]"
```

### 3. Create a new tag an push to the remote

```sh
git tag v[semantic version]
git push torrust && git push torrust v[semantic version]
```

For example:

```sh
git tag v3.0.0
git push torrust && git push torrust v3.0.0
```

### 4. Manually publish the NPM package

```sh
npm publish
```

> IMPORTANT:
>
> - You will require to login.
> - You have to have permission for publishing on the Torrust namespace.

If you get an error because you were not logged in, just retry the same command after the login.

### 4. Check the package is published

You should receive an email when the package is published.

You can also check on the NPM registry: <https://www.npmjs.com/package/torrust-index-gui>.
