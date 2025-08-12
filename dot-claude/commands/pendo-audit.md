---
name: pendo-audit
description: Verify proper Pendo analytics implementation in recent changes
---

# Pendo Analytics Audit

Analyze recent code changes to ensure proper Pendo analytics implementation following project conventions.

## Steps

1. **Identify Recent Changes**
   - Check git diff for modified files with interactive elements
   - Focus on components with buttons, forms, selects, and other user interactions

2. **Verify Tracking Attributes**
   - Check that new interactive elements have `data-pendo` attributes
   - Validate naming convention follows `feature:component:action` pattern
   - Ensure no sensitive data in tracking attributes

3. **Check Coverage**
   - Key user actions should be tracked (create, save, delete, filter, sort)
   - Navigation and feature discovery points should be tracked
   - Form submissions and important state changes should be tracked

4. **Validate Naming Consistency**
   - Feature names should match existing patterns (chat, cards, profile, etc.)
   - Action names should be consistent (create, save, select, filter, etc.)
   - Check for typos or inconsistent casing

5. **Report Findings**
   - List any missing tracking attributes on important interactions
   - Identify naming convention violations
   - Suggest improvements for analytics coverage
   - Note any potential privacy concerns

## Output Format

Generate a report with:

- Summary of files reviewed
- Missing tracking opportunities
- Naming convention issues
- Recommended fixes with code examples
- Analytics coverage score (percentage of interactive elements tracked)
