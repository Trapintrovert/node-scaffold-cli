# Husky Git Hooks

This project uses [Husky v9](https://typicode.github.io/husky/) to manage Git hooks.

## Setup

After cloning the repository, run:

```bash
npm install
```

The `prepare` script in `package.json` will automatically set up Husky.

**Note:** Husky v9 uses a simplified hook format. Hooks are automatically wrapped by Husky, so you don't need shebang or sourcing lines.

## Hooks

### pre-commit

Runs before each commit:
- Builds TypeScript to ensure code compiles
- Prevents commits if build fails

### commit-msg

Validates commit messages using [Commitlint](https://commitlint.js.org/) with [Conventional Commits](https://www.conventionalcommits.org/) format.

**Valid commit message format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or external dependencies
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files
- `revert`: Revert a previous commit

**Examples:**
```bash
# Good
git commit -m "feat: add duplicate file protection"
git commit -m "fix: correct ORM/ODM terminology"
git commit -m "docs: update README with dependencies"

# Bad (will be rejected)
git commit -m "added new feature"
git commit -m "FIX: bug"
git commit -m "update"
```

## Bypassing Hooks

To bypass hooks (not recommended):

```bash
git commit --no-verify -m "message"
```

## Configuration

- Commitlint config: `commitlint.config.js`
- Husky hooks: `.husky/` directory

