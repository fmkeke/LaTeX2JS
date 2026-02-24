# LaTeX2JS 功能修复计划

基于 `LATEX_SYNTAX_COMPARISON.md` 的分析，本文档列出了需要修复和实现的功能，按优先级排序。

---

## 📋 优先级分类

- **P0 (高优先级)**: 基础功能缺失，影响常用场景
- **P1 (中优先级)**: 常用功能，提升兼容性
- **P2 (低优先级)**: 增强功能，完善体验
- **P3 (可选)**: 高级功能，按需实现

---

## 🎯 Phase 1: 选项支持增强 (P0)

### 1.1 透明度支持 (opacity)
**状态**: ❌ 不支持  
**影响**: 无法实现半透明效果  
**实现难度**: ⭐⭐ (简单)

**需要修改的文件**:
- `packages/utils/src/index.ts` - `parseOptions` 函数需要识别 opacity
- `packages/pstricks/src/lib/psgraph.ts` - 所有渲染函数需要应用 `stroke-opacity` 和 `fill-opacity`

**实现步骤**:
1. 在 `parseOptions` 中解析 `opacity` 选项（值范围 0-1）
2. 在渲染函数中应用：
   ```typescript
   .style('stroke-opacity', this.opacity || 1)
   .style('fill-opacity', this.opacity || 1)
   ```

**测试用例**:
```latex
\pscircle[linecolor=blue,opacity=0.5](0,0){1}
```

---

### 1.2 自定义虚线样式 (dash)
**状态**: ❌ 不支持  
**影响**: 只能使用预定义的 dashed/dotted，无法自定义  
**实现难度**: ⭐⭐ (简单)

**需要修改的文件**:
- `packages/utils/src/index.ts` - `parseOptions` 解析 dash 选项
- `packages/pstricks/src/lib/psgraph.ts` - `psline` 等函数支持自定义 dash

**实现步骤**:
1. 解析 `dash` 选项，格式如 `dash=5,3` 或 `dash=10,5,5,5`
2. 在渲染时应用 `stroke-dasharray`：
   ```typescript
   if (this.dash) {
     const dashArray = this.dash.split(',').map(v => v.trim()).join(',');
     .style('stroke-dasharray', dashArray)
   }
   ```

**测试用例**:
```latex
\psline[dash=10,5]{->}(0,0)(2,2)
```

---

### 1.3 圆角半径 (linearc)
**状态**: ❌ 不支持  
**影响**: `psframe` 等无法绘制圆角矩形  
**实现难度**: ⭐⭐⭐ (中等)

**需要修改的文件**:
- `packages/pstricks/src/lib/pstricks.ts` - 解析 linearc 选项
- `packages/pstricks/src/lib/psgraph.ts` - `psframe` 使用圆角路径

**实现步骤**:
1. 解析 `linearc` 选项（单位：pt 或像素）
2. 修改 `psframe` 渲染，使用 SVG `path` 和 `rx/ry` 属性或手动计算圆角路径

**测试用例**:
```latex
\psframe[linearc=0.2](0,0)(2,2)
```

---

### 1.4 阴影效果 (shadow)
**状态**: ❌ 不支持  
**影响**: 无法实现阴影效果  
**实现难度**: ⭐⭐⭐⭐ (较难)

**实现步骤**:
1. 使用 SVG `filter` 和 `feDropShadow` 实现阴影
2. 在 SVG 根元素定义阴影滤镜
3. 在需要阴影的元素上应用 `filter` 属性

**测试用例**:
```latex
\psframe[shadow=true](0,0)(2,2)
```

---

## 🎯 Phase 2: 坐标系统扩展 (P1)

### 2.1 相对坐标支持 (* 前缀)
**状态**: ❌ 不支持  
**影响**: 无法使用相对坐标，代码不够灵活  
**实现难度**: ⭐⭐⭐ (中等)

**需要修改的文件**:
- `packages/pstricks/src/lib/pstricks.ts` - 坐标解析函数
- `packages/utils/src/index.ts` - 可能需要扩展坐标解析

**实现步骤**:
1. 检测坐标中的 `*` 前缀：`(*1.5,2)` 表示相对坐标
2. 维护"当前点"状态（类似 PostScript 的 currentpoint）
3. 相对坐标 = 当前点 + 相对值

**语法示例**:
```latex
\psline(0,0)(1,1)      % 移动到 (1,1)
\psline(*0.5,*0.5)(2,2) % 从 (1,1) 相对移动 (0.5,0.5) 到 (1.5,1.5)，然后到 (2,2)
```

---

### 2.2 极坐标支持 (; 分隔)
**状态**: ❌ 不支持  
**影响**: 无法使用极坐标，某些图形难以表达  
**实现难度**: ⭐⭐⭐ (中等)

**实现步骤**:
1. 检测坐标中的 `;` 分隔符：`(1.5;30)` 表示 (半径;角度)
2. 转换为笛卡尔坐标：
   ```typescript
   const r = Number(radius);
   const angle = Number(angleDeg) * Math.PI / 180;
   const x = r * Math.cos(angle);
   const y = r * Math.sin(angle);
   ```

**语法示例**:
```latex
\psline(0,0)(2;45)  % 从原点画线到极坐标 (2, 45°)
```

---

### 2.3 相对增量坐标 (+ 前缀)
**状态**: ❌ 不支持  
**影响**: 与相对坐标类似，但语法不同  
**实现难度**: ⭐⭐ (简单)

**实现步骤**:
1. 检测 `+` 前缀：`(+1,+2)` 表示相对于当前点的增量
2. 实现方式与相对坐标类似

**语法示例**:
```latex
\psline(0,0)(1,1)(+1,+1)  % 从 (1,1) 增量 (+1,+1) 到 (2,2)
```

---

## 🎯 Phase 3: 新命令实现 (P1-P2)

### 3.1 psgrid - 网格 (P1)
**状态**: ❌ 不支持  
**影响**: 无法绘制网格，常用功能  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psgrid[options](x0,y0)(x1,y1)(gridsize)`

**实现步骤**:
1. 添加正则表达式匹配
2. 解析参数：起始点、结束点、网格大小
3. 渲染：绘制水平和垂直线网格

**测试用例**:
```latex
\psgrid[gridcolor=gray,subgridcolor=lightgray](0,0)(10,10)(1)
```

---

### 3.2 psdots - 点集 (P1)
**状态**: ❌ 不支持  
**影响**: 无法绘制多个点  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psdots[options](x1,y1)(x2,y2)...`

**实现步骤**:
1. 解析多个坐标点
2. 为每个点绘制圆或方形标记

**测试用例**:
```latex
\psdots[dotstyle=*,dotsize=5pt](0,0)(1,1)(2,2)
```

---

### 3.3 psellipse - 椭圆 (P1)
**状态**: ❌ 不支持  
**影响**: 无法绘制椭圆  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psellipse[options](x,y)(rx,ry)`

**实现步骤**:
1. 解析圆心和两个半径
2. 使用 SVG `<ellipse>` 元素渲染

**测试用例**:
```latex
\psellipse[linecolor=blue](0,0)(2,1)
```

---

### 3.4 psbezier - 贝塞尔曲线 (P2)
**状态**: ❌ 不支持  
**影响**: 无法绘制平滑曲线  
**实现难度**: ⭐⭐⭐ (中等)

**语法**: `\psbezier[options](x0,y0)(x1,y1)(x2,y2)(x3,y3)`

**实现步骤**:
1. 解析 4 个控制点（三次贝塞尔曲线）
2. 使用 SVG `<path>` 的 `C` 命令

**测试用例**:
```latex
\psbezier[linecolor=red](0,0)(1,2)(2,-1)(3,1)
```

---

### 3.5 pscurve - 曲线 (P2)
**状态**: ❌ 不支持  
**影响**: 无法绘制通过多个点的平滑曲线  
**实现难度**: ⭐⭐⭐⭐ (较难)

**语法**: `\pscurve[options](x1,y1)(x2,y2)...`

**实现步骤**:
1. 解析多个点
2. 使用样条插值或贝塞尔曲线拟合生成平滑路径

---

### 3.6 psoval - 圆角矩形 (P2)
**状态**: ❌ 不支持  
**影响**: 无法绘制圆角矩形  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psoval[options](x1,y1)(x2,y2)`

**实现步骤**:
1. 解析两个角点
2. 使用 SVG `<rect>` 的 `rx` 和 `ry` 属性

**测试用例**:
```latex
\psoval[linearc=0.3](0,0)(2,2)
```

---

### 3.7 psdiamond - 菱形 (P2)
**状态**: ❌ 不支持  
**影响**: 无法绘制菱形  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psdiamond[options](x,y)(width,height)`

**实现步骤**:
1. 解析中心点和宽高
2. 计算四个顶点，使用 `pspolygon` 或直接绘制路径

---

### 3.8 psvector - 向量 (P2)
**状态**: ❌ 不支持  
**影响**: 无法绘制向量箭头  
**实现难度**: ⭐⭐ (简单)

**语法**: `\psvector[options]{arrows}(x1,y1)(x2,y2)`

**实现步骤**:
1. 类似 `psline`，但默认带箭头
2. 可以重用 `psline` 的箭头逻辑

---

### 3.9 psbrace / psbracket - 括号 (P3)
**状态**: ❌ 不支持  
**影响**: 特殊符号，使用频率较低  
**实现难度**: ⭐⭐⭐ (中等)

**实现步骤**:
1. 解析起点和终点
2. 使用 SVG 路径绘制括号形状

---

### 3.10 pscustom - 自定义路径 (P3)
**状态**: ❌ 不支持  
**影响**: 最灵活但最复杂  
**实现难度**: ⭐⭐⭐⭐⭐ (困难)

**语法**: `\pscustom[options]{path commands}`

**实现步骤**:
1. 需要实现子命令解析（moveto, lineto, curveto, closepath 等）
2. 构建 SVG 路径

---

## 🎯 Phase 4: 箭头扩展 (P2)

### 4.1 高级箭头样式
**状态**: ⚠️ 部分支持  
**影响**: 箭头样式受限

**需要支持的箭头**:
- `->>` - 双箭头
- `->|` - 箭头+竖线
- `|->` - 竖线+箭头

**实现步骤**:
1. 扩展 `parseArrows` 函数
2. 实现新的箭头绘制函数

---

## 🎯 Phase 5: MathJax 扩展 (P1)

### 5.1 添加 text 包支持
**状态**: ❌ 不支持 `\text{}`  
**影响**: 数学公式中无法使用文本  
**实现难度**: ⭐⭐ (简单)

**需要修改的文件**:
- `packages/mathjaxjs/src/index.ts` - MathJax 配置

**实现步骤**:
1. 在 MathJax 配置中添加 `text` 包：
   ```typescript
   packages: ['base', 'ams', 'newcommand', 'configmacros', 'text']
   ```

---

### 5.2 添加其他 MathJax 包
**状态**: ❌ 不支持  
**影响**: 某些数学命令不可用

**需要添加的包**:
- `boldsymbol` - 支持 `\boldsymbol{}`
- `color` - 支持 `\color{}`（可选，因为可以用 CSS）
- `cancel` - 支持 `\cancel{}`

---

## 🎯 Phase 6: 文本格式化扩展 (P2)

### 6.1 标准 LaTeX 文本命令
**状态**: ❌ 不支持  
**影响**: 与标准 LaTeX 不兼容

**需要支持的命令**:
- `\textbf{text}` → 映射到 `\bf{text}`
- `\textit{text}` → 映射到 `\it{text}`
- `\texttt{text}` → 映射到 `\tt{text}`
- `\textsc{text}` - 小型大写（需要实现）
- `\underline{text}` - 下划线（需要实现）
- `\sout{text}` - 删除线（需要实现）

**实现步骤**:
1. 在文本处理中添加命令映射
2. 实现缺失的样式（small-caps, underline, strikethrough）

---

## 🎯 Phase 7: 高级功能 (P3)

### 7.1 pstextpath - 沿路径文本
**状态**: ❌ 不支持  
**影响**: 无法实现文本沿曲线排列  
**实现难度**: ⭐⭐⭐⭐ (较难)

**实现步骤**:
1. 使用 SVG `<textPath>` 元素
2. 定义路径并让文本沿路径排列

---

### 7.2 psclip - 裁剪
**状态**: ❌ 不支持  
**影响**: 无法实现裁剪效果  
**实现难度**: ⭐⭐⭐⭐ (较难)

**实现步骤**:
1. 使用 SVG `<clipPath>` 和 `<defs>`
2. 实现裁剪区域定义和应用

---

### 7.3 psfill - 填充区域
**状态**: ❌ 不支持  
**影响**: 无法填充自定义区域  
**实现难度**: ⭐⭐⭐ (中等)

**实现步骤**:
1. 解析路径命令
2. 使用 SVG `<path>` 填充

---

### 7.4 psfrag - 图形替换
**状态**: ❌ 不支持  
**影响**: LaTeX 特定功能，Web 环境可能不需要  
**实现难度**: ⭐⭐⭐⭐⭐ (困难)

**说明**: 这是 LaTeX 编译时的功能，在运行时环境中可能不需要。

---

## 📊 实施优先级建议

### 第一批（立即实施）
1. ✅ 透明度支持 (opacity)
2. ✅ 自定义虚线样式 (dash)
3. ✅ psgrid - 网格
4. ✅ psdots - 点集
5. ✅ psellipse - 椭圆

### 第二批（短期）
6. ✅ 圆角半径 (linearc)
7. ✅ 相对坐标支持 (* 前缀)
8. ✅ MathJax text 包支持
9. ✅ psbezier - 贝塞尔曲线
10. ✅ psoval - 圆角矩形

### 第三批（中期）
11. ✅ 极坐标支持 (; 分隔)
12. ✅ 阴影效果 (shadow)
13. ✅ psdiamond - 菱形
14. ✅ psvector - 向量
15. ✅ 标准 LaTeX 文本命令映射

### 第四批（长期）
16. ✅ pscurve - 曲线
17. ✅ 高级箭头样式
18. ✅ pstextpath - 沿路径文本
19. ✅ psclip - 裁剪
20. ✅ psfill - 填充区域

---

## 🧪 测试策略

每个功能实现后需要：
1. **单元测试**: 测试解析函数正确性
2. **集成测试**: 测试渲染效果
3. **视觉测试**: 在 `dev/test-all.html` 中添加测试用例
4. **兼容性测试**: 与标准 LaTeX/PSTricks 输出对比

---

## 📝 实施注意事项

1. **向后兼容**: 确保新功能不影响现有功能
2. **代码复用**: 尽量复用现有代码（如箭头绘制、样式应用）
3. **性能考虑**: SVG 元素过多可能影响性能，需要优化
4. **文档更新**: 每实现一个功能，更新 `LATEX_SYNTAX_COMPARISON.md` 和 `SYNTAX_SUPPORT.md`

---

## 🔄 进度跟踪

- [ ] Phase 1: 选项支持增强
- [ ] Phase 2: 坐标系统扩展
- [ ] Phase 3: 新命令实现
- [ ] Phase 4: 箭头扩展
- [ ] Phase 5: MathJax 扩展
- [ ] Phase 6: 文本格式化扩展
- [ ] Phase 7: 高级功能

---

**最后更新**: 2026-01-30  
**文档版本**: 1.0
