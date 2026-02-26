# Contributing

Thanks for helping improve `n8n-nodes-sunsama`.

## Development Setup

```bash
npm install
npm run build
npm run lint
```

## Pull Requests

- Keep PRs focused and small when possible
- Include clear descriptions for behavior changes
- Run build + lint before opening PR
- Update `README.md` when UX or operation behavior changes

## Versioning

Use semantic versioning:

- `patch` for bug fixes
- `minor` for new backward-compatible features
- `major` for breaking changes

## Releases

- Update `CHANGELOG.md` for the target version
- Ensure the matching git tag exists (for example, `v0.1.2`)
- Use `npm run release:publish` for one-command npm + GitHub release publishing
- Use `npm run release:github` when only the GitHub release needs to be created

## Security

- Never commit credentials or session tokens
- Report vulnerabilities privately before opening public issues
