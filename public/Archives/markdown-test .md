---
title: "Markdown 功能全面测试"
date: "2026-07-22 20:00:00"
description: "测试代码高亮、数学公式、表格、引用等 Markdown 功能"
cover: "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg"
tags: ["测试", "Markdown", "教程"]
---

## 代码高亮测试

### Python 代码

```python
import numpy as np
from typing import List, Optional

class MolecularDynamics:
    """分子动力学模拟器"""
    def __init__(self, atoms: int, temperature: float = 300.0):
        self.atoms = atoms
        self.temperature = temperature
        self.positions = np.random.rand(atoms, 3) * 10.0
        self.velocities = np.zeros((atoms, 3))

    def step(self, dt: float = 0.001) -> None:
        """执行一个时间步"""
        forces = self._compute_forces()
        self.velocities += forces * dt
        self.positions += self.velocities * dt
        print(f"Step completed: {self.atoms} atoms")

    def _compute_forces(self) -> np.ndarray:
        return np.random.randn(self.atoms, 3) * 0.1

if __name__ == "__main__":
    md = MolecularDynamics(atoms=1000)
    md.step()
```

### TypeScript 代码

```typescript
interface Post {
  slug: string
  title: string
  tags: string[]
}

function getRecentPosts(count: number = 5): Post[] {
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}
```

### Bash 脚本

```bash
#!/bin/bash
# GROMACS 模拟流程
gmx grompp -f em.mdp -c initial.gro -p topol.top -o em.tpr
gmx mdrun -deffnm em -v
echo "Energy minimization done!"
```

## 数学公式测试

行内公式：$E = mc^2$

块级公式：

$$
\frac{\partial \rho}{\partial t} + \nabla \cdot (\rho \mathbf{v}) = 0
$$

薛定谔方程：

$$
i\hbar \frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

## 表格测试

| 功能 | 支持 | 说明 |
|------|------|------|
| 代码高亮 | ✅ | 多语言支持 |
| 数学公式 | ✅ | KaTeX 渲染 |
| 表格 | ✅ | GFM 语法 |
| 删除线 | ✅ | ~~删除文字~~ |
| 任务列表 | ✅ | - [x] 已完成 |

## 引用与样式

> 代码是写给人看的，只是恰好机器也能执行。
> —— 架构格言

**粗体文字**、*斜体文字*、`行内代码`、~~删除线~~

## 任务列表

- [x] 搭建 Vue 3 框架
- [x] 实现 Markdown 渲染
- [ ] 部署上线
- [ ] 添加更多功能

---

*这是一篇测试文章，用于验证 Markdown 渲染功能。*
