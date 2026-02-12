---
name: improve-prompt
description: Analyzes and improves a prompt for better AI results. Use when the user asks to 'improve prompt', 'make this prompt better', or 'refine instructions'.
model: sonnet
argument-hint: [prompt to improve]
---

# Prompt Improvement

Analyze and improve the following prompt: $ARGUMENTS

## Your Task

1. **Identify weaknesses** in the original prompt:
   - Vague or ambiguous language
   - Missing context or constraints
   - Unclear expected output format
   - Missing edge cases or examples

2. **Improve the prompt** by:
   - Making instructions more specific and actionable
   - Adding clear structure (numbered steps, sections)
   - Including constraints and boundaries
   - Specifying the desired output format
   - Adding relevant examples if helpful

3. **Output the improved prompt** in a code block, ready to copy

4. **Briefly explain** the key improvements you made (2-3 sentences max)

## Guidelines

- Preserve the original intent
- Keep improvements practical and focused
- Use clear, direct language
- No need to add more general project specific info. Thats already in the CLAUDE.md
- Consider edge cases the user might not have thought of
