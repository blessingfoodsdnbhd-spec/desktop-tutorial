# 🧠 TBF AI Outlet Manager — 门店AI中控系统

> **Thai Blessing Food 专属 | 一个系统取代：员工培训 + 经理 + QC + 客服**

---

## 系统总览

| 模块 | 用途 | 使用者 | 文件 |
|------|------|--------|------|
| 🍳 厨房 SOP Bot | 教员工做菜、标准化出品 | 厨房员工 | `01-kitchen-sop-bot.md` |
| ✅ QC Bot | 出菜前检查、品质把关 | 厨房主管 / 员工 | `02-qc-bot.md` |
| 💬 Frontline Bot | 客服话术、推荐成交 | 前线员工 / WhatsApp | `03-frontline-bot.md` |
| 📊 Manager Bot | 数据分析、管理决策 | 老板 / 经理 | `04-manager-bot.md` |
| 🎓 Training System | 新人培训流程（不用人带） | 新员工 | `05-training-system.md` |
| ⚠️ Allergen List | 过敏原对照 + 客人应对话术 | 前线员工 / 厨房 | `06-allergen-list.md` |

---

## 落地路线图

### 🟢 Phase 1 — 马上可以做（第1-2周）

- [ ] 整理所有菜品 SOP（步骤 + 分量 + 标准）
- [ ] 建立 AI Bot（用 ChatGPT / Claude 自定义）
- [ ] 把 System Prompt 导入
- [ ] 内部测试：让 2-3 个员工试用
- [ ] 收集反馈，调整话术

### 🟡 Phase 2 — 进阶接入（第3-4周）

- [ ] WhatsApp Business API 接入客服 Bot
- [ ] 厨房放平板，员工直接问 AI
- [ ] 前线员工用手机查话术
- [ ] 建立每周 QC 检查流程

### 🔴 Phase 3 — 高级升级（1-3个月）

- [ ] CCTV + AI 图像识别（出菜检查）
- [ ] POS 数据对接（自动分析销售）
- [ ] AI 自动建议菜单调整
- [ ] 多店统一管理系统

---

## 核心 System Prompt（所有 Bot 共用基底）

```
你是 Thai Blessing Food (TBF) 的 AI Outlet Manager。

你的身份：TBF 内部智能助手，服务对象是员工和管理层。

核心原则：
1. 所有回答必须【简单、清楚、可执行】
2. 优先用【步骤说明】，不讲废话
3. 涉及服务问题时，要带【销售引导】
4. 员工做错时，【不骂人】，指出问题并给正确做法
5. 所有标准以 TBF 官方 SOP 为准
6. 语言：中文为主，关键术语保留英文/泰文

你的覆盖范围：
- 厨房：菜品 SOP、分量、plating 标准
- 前线：客服话术、推荐技巧、FAQ
- 管理：QC 检查、数据分析、决策建议
- 培训：新人上手流程、考核标准
```

---

## 使用方式

1. 选择你需要的模块文件
2. 把对应的 **System Prompt** 复制到 ChatGPT / Claude 的自定义指令中
3. 把 **知识库内容** 作为参考资料上传
4. 开始使用！

> **目标：一个新员工 = 半天上手，出菜稳定，服务统一，可以开多店！** 🔥
