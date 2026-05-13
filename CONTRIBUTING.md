# Contributing to TAKE ONE Nexus

First off, thank you for considering contributing to TAKE ONE Nexus! It's people like you that make TAKE ONE Nexus a great platform for the creative community. We especially welcome participants from **SSOC** and **GSSoC**.

This document provides guidelines and instructions for contributing to this project.

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the repository maintainers.

## 🚀 Getting Started

### 1. Fork and Clone

1. Fork the repository to your own GitHub account.
2. Clone the project to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/take-one-nexus.git
   cd take-one-nexus
   ```
3. Add the original repository as the "upstream" remote:
   ```bash
   git remote add upstream https://github.com/alokr25012-lab/take-one-nexus.git
   ```

### 2. Local Setup

Follow the detailed installation instructions in our [README.md](README.md). Make sure you have your `.env` configured and your database initialized via Prisma.

### 3. Creating a Branch

Before you start coding, create a new branch from `main`. We use the following branching conventions:

- `feature/short-description` (for new features)
- `fix/issue-description` (for bug fixes)
- `docs/short-description` (for documentation changes)
- `refactor/short-description` (for refactoring code)

```bash
git checkout -b feature/awesome-new-feature
```

## 🛠️ Contribution Workflow

### Finding an Issue
- Look for issues labeled `good first issue` or `help wanted`.
- If you want to work on an issue, please comment on it asking to be assigned.
- If you have a new feature idea, please open a feature request issue first to discuss it with the maintainers.

### Coding Standards
Before you write any code, please review our comprehensive engineering standards in [CODING_RULES.md](CODING_RULES.md). Some key points:
- Maintain the cinematic "Director-style" UI aesthetic.
- Adhere to the file naming and folder structure rules.
- Run the linter before committing: `npm run lint`.
- Make sure there are no TypeScript errors.

### Testing Expectations
- Test your changes manually across different viewports (Desktop, Tablet, Mobile).
- If you modify an API route, test it using a tool like Postman or via the frontend implementation.
- Include a brief description of how you tested your changes in your Pull Request.

## 📝 Commit Conventions

We follow a structured commit message format to maintain a readable history.

**Format:** `[Type] Short description in imperative mood`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Example:**
`feat: Add role filter to crew search page`

## 🔄 Pull Request Process

1. Ensure your fork is up-to-date with the upstream `main` branch.
   ```bash
   git fetch upstream
   git merge upstream/main
   ```
2. Push your branch to your fork.
   ```bash
   git push origin feature/awesome-new-feature
   ```
3. Open a Pull Request against the `main` branch of the original repository.
4. Fill out the Pull Request template completely.
5. Link any relevant issues using closing keywords (e.g., `Closes #123`).
6. Wait for a maintainer to review your code. We may request changes before merging.

## 🎨 UI Contribution Rules

- If you are adding a new UI component, ensure it matches the dark cinematic aesthetic.
- Verify that color contrast meets accessibility standards.
- Ensure buttons and interactive elements have appropriate touch target sizes (`44x44px` minimum).

## ❓ Need Help?

If you're stuck, feel free to ask questions on the specific issue thread or in your pull request. We're here to help you learn and contribute!

Thank you for helping build TAKE ONE Nexus! 🎬
