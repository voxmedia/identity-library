# Identity Library

This is a small JavaScript library used to send a salted hash of a user's UID to partners. It takes a privacy-first approach to ensure we can safely share sets of user data between trusted third parties, while preventing the possibility of the sets being matched between partners or the source of the data.

## Usage

You can import `identity-library` into a project using module bundling like Webpack, or into a Node.js project:

```bash
yarn add @voxmedia/identity-library

# or:

npm install @voxmedia/identity-library
```

Import the package and call the default export:

```js
import identityFor from '@voxmedia/identity-library';

async function sendIdentityToPartner() {
  const privateId = fetchUserPrivateId(); // e.g. from a cookie

  const shareableId = await identityFor('<PARTNER_NAME>', privateId);
}
```

You can also use this directly in browser with a script tag:

```html
<script src="https://unpkg.com/@voxmedia/identity-library@latest/dist/identity-library.umd.js"></script>

<script>
  async function sendIdentityToPartner() {
    const privateId = fetchUserPrivateId(); // e.g. from a cookie

    const shareableId = await identityFor('<PARTNER_NAME>', privateId);
  }
</script>
```

## Browser Support

This library requires Promise support, i.e. it will not work out of the box on IE11. You can add a Promise polyfill if you want to support this library.

## Development

```bash
yarn dev
```

If you want to symlink the development version of this library into another local project, run the following inside this project's repo:

```bash
yarn link
```

Then, follow the instructions to use it in a different project.

## Releasing

This project is automatically released with [semantic-release](https://semantic-release.gitbook.io/semantic-release) within GitHub Actions. A couple notes:

- You do NOT need to update the version in `package.json` manually
- Instead, you should use [special `semantic-release` prefixes](https://semantic-release.gitbook.io/semantic-release/#how-does-it-work) in your commit messages.
  - `fix:` If you are making a patch change which merits a patch version bump
  - `feat:` If you are making a minor change which merits a minor version bump
  - `BREAKING CHANGE:` If you are making a breaking change which merits a major version bump
  - `chore, docs, test, refactor, etc:` If you are making a change which does not require any version change
  - Any commit lacking a prefix will be considered a no-op (no version change)
  - If you forgot to include any prefixes, you can use the "Squash" commit feature when merging the PR to edit the commit message to add an appropriate prefix
- Prerelease branches are available at `alpha` and `beta`. Use these to push changes which will not increment the overall version - great for working on big new features.
