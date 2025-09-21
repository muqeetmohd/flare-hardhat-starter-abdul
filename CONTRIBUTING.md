# Contributing to FlareHelp

Thank you for your interest in contributing to FlareHelp! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of React, Solidity, and Node.js
- Familiarity with blockchain concepts

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/flarehelp.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see README.md)
5. Start development servers

## 📋 Types of Contributions

### 🐛 Bug Reports
- Use the GitHub issue template
- Provide clear reproduction steps
- Include environment details
- Add screenshots if applicable

### ✨ Feature Requests
- Check existing issues first
- Use the feature request template
- Provide clear use cases
- Consider implementation complexity

### 💻 Code Contributions
- Create a feature branch from `main`
- Follow the coding standards
- Add tests for new features
- Update documentation

## 🎯 Development Guidelines

### Code Style
- **Solidity**: Follow OpenZeppelin standards
- **JavaScript/TypeScript**: Use ESLint configuration
- **React**: Follow React best practices
- **CSS**: Use Tailwind CSS classes

### Commit Messages
Use conventional commits:
```
feat: add new donation method
fix: resolve wallet connection issue
docs: update API documentation
test: add unit tests for donation flow
```

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Request review from maintainers
4. Address feedback promptly
5. Squash commits if requested

## 🧪 Testing

### Smart Contracts
```bash
npx hardhat test
npx hardhat coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### Backend
```bash
cd backend
npm test
```

## 📚 Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation
- Include code examples

## 🔒 Security

- Report security issues privately to security@flarehelp.org
- Don't commit sensitive information
- Follow secure coding practices
- Review smart contract security

## 🎨 Design Guidelines

- Follow the neo-brutalist design system
- Maintain accessibility standards
- Use consistent spacing and typography
- Test on multiple screen sizes

## 📞 Getting Help

- Join our Discord community
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Contact maintainers directly

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to maintainer meetings
- Given FlareHelp contributor badges

Thank you for contributing to FlareHelp! 🎉
