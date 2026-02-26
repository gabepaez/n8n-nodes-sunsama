# n8n-nodes-sunsama

Community node for [n8n](https://n8n.io) that wraps the [`sunsama-api`](https://github.com/robertn702/sunsama-api) TypeScript client.

It provides a clean n8n-native interface for Sunsama:

- Tasks (query, create, update, delete, reorder)
- Subtasks (add, create, update title, complete/uncomplete)
- Streams (list)
- User profile/timezone
- Calendar events (create/update)
- Utilities (task ID generation)

## Features

- Supports **session token** auth and **email/password** auth
- Uses the official community wrapper package `sunsama-api`
- Includes dynamic stream dropdowns loaded from your account
- Designed for self-hosted n8n + community node workflows
- TypeScript codebase with lint/build scripts for maintainers

## Installation

### In your n8n custom nodes environment

```bash
npm install n8n-nodes-sunsama
```

Then restart n8n.

### Local development

```bash
git clone https://github.com/gabepaez/n8n-nodes-sunsama.git
cd n8n-nodes-sunsama
npm install
npm run build
```

## Credentials

Create credentials of type **Sunsama API** and choose one method:

1. **Session Token** (recommended for automations)
2. **Email + Password**

## Node Resources and Operations

### Task

- Get Tasks By Day
- Get Backlog Tasks
- Get Archived Tasks
- Get Task By ID
- Create Task
- Delete Task
- Complete Task / Uncomplete Task
- Update Task Text
- Update Task Snooze Date
- Update Task Planned Time
- Update Task Due Date
- Update Task Stream
- Update Task Notes (HTML/Markdown)
- Reorder Task

### Subtask

- Add Subtask
- Create Subtasks
- Update Subtask Title
- Complete Subtask
- Uncomplete Subtask

### User

- Get Current User
- Get User Timezone

### Stream

- Get All Streams

### Calendar Event

- Create Calendar Event
- Update Calendar Event (full JSON payload)

### Utility

- Generate Task ID

## Example: Get Today’s Tasks

1. Add a **Sunsama** node
2. Resource: `Task`
3. Operation: `Get Tasks By Day`
4. Day: `={{$now.toFormat("yyyy-LL-dd")}}`
5. Execute node

This returns one output item per task.

## Compatibility

- Node.js `>=18.17`
- n8n versions compatible with `n8n-workflow` v1 APIs

## Development Scripts

- `npm run build` - Compile TypeScript and copy static assets
- `npm run dev` - TypeScript watch mode
- `npm run lint` - Lint source files
- `npm run lint:fix` - Auto-fix lint issues
- `npm run format` - Format source files
- `npm run release:github` - Create GitHub release notes from template + changelog for current version tag
- `npm run release:publish` - Publish npm package, then create GitHub release (single command)

## Publishing Workflow

1. Bump version (example):

```bash
npm version patch --no-git-tag-version
```

2. Update `CHANGELOG.md` section for that version.
3. Commit and push changes, and make sure the matching tag exists (example: `v0.1.2`).
4. Run one command:

```bash
npm run release:publish
```

This command publishes to npm and creates a GitHub release using:

- `.github/release-template.md`
- the matching section from `CHANGELOG.md`

To create only the GitHub release (without npm publish):

```bash
npm run release:github
```

## Security Notes

- Never commit real Sunsama credentials or session tokens
- Prefer n8n credential storage over hardcoded values

## Credits

- Built on top of [`sunsama-api`](https://github.com/robertn702/sunsama-api)
- n8n community node pattern and APIs from the n8n ecosystem

## License

MIT
