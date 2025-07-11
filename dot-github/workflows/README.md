# GitHub Actions Workflows

## Claude Code Review

The `claude-code-review.yml` workflow provides automated AI-powered code reviews for pull requests.

### Setup Instructions

1. **Add Anthropic API Key**

   - Go to Repository Settings → Secrets and variables → Actions
   - Add a new repository secret named `ANTHROPIC_API_KEY`
   - Set the value to your Anthropic API key

2. **Verify Permissions**
   - The workflow requires `contents: read` and `pull-requests: write` permissions
   - These are configured in the workflow file

### How to Use

1. **Automatic Trigger**

   - Reviews automatically run when PRs are opened
   - **Size limit**: PRs over 2000 lines of changes are skipped automatically
   - Skipped PRs receive a comment explaining why and how to get a manual review

2. **Manual Trigger**

   - Comment `/claude-review` on any PR to trigger a manual review
   - Go to Actions tab in your GitHub repository
   - Select "Claude Code Review" workflow
   - Click "Run workflow"
   - Enter the PR number you want to review
   - Click "Run workflow"

3. **Review Process**
   - The workflow will analyze all changed files in the PR
   - It follows the project's architecture patterns defined in `CLAUDE.md`
   - Reviews focus on security, TypeScript compliance, and best practices
   - Results are posted as PR comments

### Review Focus Areas

- **Security**: Multi-tenant data isolation, authentication, SQL injection prevention
- **TypeScript**: Strict mode compliance, type safety, undefined handling
- **Architecture**: Service layer patterns, API route structure, database queries
- **Performance**: Query optimization, potential bottlenecks
- **Code Quality**: Best practices, error handling, code organization

### Limitations

- Advisory comments only (does not block merging)
- **Size limit**: PRs over 2000 lines automatically skipped (can be manually triggered)
- Currently in beta (features may change)
- Requires human review before merging

### Troubleshooting

If the workflow fails:

1. Check the workflow logs in the Actions tab
2. Verify the `ANTHROPIC_API_KEY` secret is set correctly
3. Ensure the PR number is valid and accessible
4. Check for API rate limits or network issues

### Cost Considerations

- Consumes GitHub Actions minutes
- Uses Anthropic API tokens based on code complexity
- Costs scale with PR size and review depth
- **Automatic size limit**: PRs over 2000 lines are skipped to control costs
- Large PRs can be reviewed manually if needed
