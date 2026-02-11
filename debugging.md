# Debugging & Solutions

Solutions to common problems and debugging insights discovered while learning Claude features.

## Common Agent Issues

### Issue: Agent takes too long
**Solution:** Check if the task can be split into smaller, more focused agent calls. Use appropriate agent type (Explore for codebase search is faster than general-purpose).

### Issue: Agent returns incomplete results
**Solution:** Agent completed but task was under-specified. Provide more detailed prompt and context about what you're looking for.

## Context-Related Issues

### Issue: Claude doesn't remember previous learnings
**Solution:** Make sure information is saved to auto-memory files in `/memory/` directory. Update MEMORY.md with key insights so they persist across sessions.

### Issue: Context becomes too cluttered
**Solution:** Use agents to offload complex work. System automatically compresses conversation history, but can use agents for better isolation.

## Plugin & Skill Issues

### Issue: Custom plugin not loading / "Unknown skill" error
**Solution:** Custom plugins need to be registered as a marketplace. Setup:

1. **Create local marketplace directory structure:**
   ```
   ~/.claude/plugins/my-plugins/
   ├── .claude-plugin/
   │   └── marketplace.json
   └── greet-plugin/
       ├── .claude-plugin/
       │   └── plugin.json
       └── commands/
   ```

2. **Create marketplace.json** in `.claude-plugin/marketplace.json`:
   ```json
   {
     "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
     "name": "local-plugins",
     "description": "My local plugins",
     "owner": { "name": "You", "email": "you@example.com" },
     "plugins": [
       {
         "name": "greet-plugin",
         "description": "Your plugin description",
         "version": "1.0.0",
         "author": { "name": "You", "email": "you@example.com" },
         "source": "./greet-plugin"
       }
     ]
   }
   ```

3. **Enable in settings.json:**
   ```json
   {
     "enabledPlugins": {
       "greet-plugin@local-plugins": true
     },
     "extraKnownMarketplaces": {
       "local-plugins": {
         "source": {
           "source": "directory",
           "path": "/Users/kenshinzato/.claude/plugins/my-plugins"
         }
       }
     }
   }
   ```

4. **Restart Claude Code** for changes to take effect

### Issue: Official skill not available / "Unknown skill" error
**Solution:** Official skills require enabling the appropriate plugin. To find and enable:

1. **Find available plugins:**
   ```bash
   ls ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/
   ```

2. **Enable in settings.json:**
   ```json
   {
     "enabledPlugins": {
       "plugin-name@marketplace-id": true
     }
   }
   ```

3. **Example:** To enable `/commit` skill:
   ```json
   {
     "enabledPlugins": {
       "commit-commands@claude-plugins-official": true
     }
   }
   ```

4. **Restart Claude Code** for changes to take effect

**Key Learning:** Skills come from plugins, which must be explicitly enabled in settings.

### Issue: Skill output not as expected
**Solution:** Skills work best with clear context. Ensure working files are staged/prepared before invoking skill.

## MCP Connection Issues

### Issue: Cannot connect to external service via MCP
**Solution:** Verify MCP server is running, credentials are correct, and protocol is properly configured. Check MCP logs for specific error messages.

## File & Project Context Issues

### Issue: Claude doesn't understand project structure
**Solution:** Use Explore agent to scan codebase and provide context. Ensure CLAUDE.md is created with architecture description. Update memory with key patterns found.

### Issue: Changes made to files aren't reflected
**Solution:** Files are read fresh with each query. If file was just edited, reference it explicitly in your next message to ensure latest content is used.

## Permission & Access Issues

### Issue: Tool call denied or blocked
**Solution:** Check permission mode settings. User may need to approve certain operations. Adjust approach or ask user for specific permissions needed.

## Performance Issues

### Issue: Slow codebase exploration
**Solution:** Use Explore agent instead of manual searching. Specify file patterns to narrow search scope. Use Glob/Grep tools for targeted searches rather than broad exploration.

## Solutions to Add
(Documented as new issues are encountered and solved)
