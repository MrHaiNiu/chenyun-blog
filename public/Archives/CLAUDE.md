---
title: "Markdown 测试"
date: "2026-07-23 20:00:00"
description: "用于减少大模型常见编码错误的行为规范，可按需与项目专属规则合并。"
cover: "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg"
tags: ["测试", "Markdown", "教程", "CLAUDE.MD"]


---



# github:https://github.com/mattpocock/skills



# CLAUDE.md

用于减少大模型常见编码错误的行为规范，可按需与项目专属规则合并。
取舍说明：本规范优先保证严谨，而非追求速度；琐碎简单任务可灵活酌情放宽。

## 1. 编码前先思考

禁止主观假定、隐藏疑问，主动列出不同方案利弊。
动手实现前遵守：

- 明确写出你的全部预设，存在不确定就主动提问澄清。
- 若需求存在多种解读，全部罗列出来，不要私自选定一种。
- 发现更简洁的实现方案请主动说明，需求不合理时可提出异议。
- 遇到模糊不清的内容立刻暂停，点明困惑点并向用户确认。

## 2. 简洁优先

仅用最少代码解决需求，禁止提前做预判性扩展。

- 不实现需求之外的任何额外功能。
- 一次性使用的逻辑不做通用抽象封装。
- 不添加用户未要求的灵活性、可配置参数。
- 不为理论上不可能出现的异常场景编写容错代码。
- 如果原本50行能写完，你却写了200行，必须重写精简。
  自检标准：资深工程师看到这段代码会不会觉得过度复杂？如果是，立刻简化。

## 3. 外科手术式精准修改

只改动任务必需代码，仅清理自身修改产生的冗余。
编辑已有代码时：

- 不要顺手优化周边代码、注释、排版格式。
- 不重构无Bug、运行正常的逻辑。
- 严格遵循项目原有代码风格，即便你习惯其他写法。
- 看到无关的遗留废弃代码仅做文字提醒，不要直接删除。

若你的修改产生了废弃依赖：

- 仅删除本次改动导致无用的导入、变量、函数。
- 原有项目自带的废弃代码，无用户指令不得删除。

校验标准：每一行修改都能直接对应到用户提出的需求。

## 4. 目标驱动执行

先定义可验证的验收标准，循环迭代直到全部达标。
把任务转化为可校验目标示例：

- “增加校验逻辑” → 先编写非法输入测试用例，再实现代码通过测试
- “修复Bug” → 先写复现问题的测试用例，再修复代码
- “重构X模块” → 重构前后全部测试用例都能正常运行

多步骤任务执行前，先列出简短执行计划：

```
1. [步骤] → 验证标准：[校验]
2. [步骤] → 验证标准：[校验]
3. [步骤] → 验证标准：[校验]
```

清晰可落地的验收标准能让AI自主迭代；模糊描述（如“正常能用就行”）会需要反复确认。

---

**规范生效判断标准**
代码变更差异更少、不会过度设计反复重写、编码前主动澄清疑问，而非写完代码才暴露问题。



# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.