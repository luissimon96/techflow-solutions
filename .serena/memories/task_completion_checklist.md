Before finalizing changes, run:
1) npm run build
2) npm run lint
3) npm run test -- --runInBand

Notes from repo instructions:
- Potential blocker: ESLint v9 config mismatch (.eslintrc.json vs eslint.config.* expectation).
- Potential blocker: Jest config may reference missing root tsconfig.json.

If blockers occur, report them clearly and separate from feature regressions.