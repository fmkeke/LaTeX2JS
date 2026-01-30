# PSTricks 渲染问题分析

## 用户代码
```latex
\begin{pspicture}(-2,-2)(2,2)
\psframe(-2,-2)(2,2)
\pscircle[linecolor=blue](0,0){1.5}
\rput(0,0){$\text{Circle}$}
\psline[linecolor=red]{->}(-1.5,0)(1.5,0)
\rput(1.7,0){$x$}
\psline[linecolor=red]{->}(0,-1.5)(0,1.5)
\rput(0,1.7){$y$}
\end{pspicture}
```

## 发现的问题

### 问题 1: `psframe` 不支持选项参数 ❌

**当前代码** (`packages/pstricks/src/lib/pstricks.ts:16`):
```typescript
psframe: /\\psframe\(\s*(.*),(.*)\s*\)\(\s*(.*),(.*)\s*\)/,
```

**问题**: 正则表达式不支持 `[options]`，无法解析 `\psframe[linecolor=red](-2,-2)(2,2)` 这样的语法。

**应该改为**:
```typescript
psframe: new RegExp('\\\\psframe' + RE.options + RE.coords + RE.coords),
```

### 问题 2: `psframe` 渲染函数不使用样式选项 ❌

**当前代码** (`packages/pstricks/src/lib/psgraph.ts:58-98`):
```typescript
psframe(svg: any): void {
  svg
    .append('svg:line')
    .attr('x1', this.x1)
    .attr('y1', this.y1)
    .attr('x2', this.x2)
    .attr('y2', this.y1)
    .style('stroke-width', 2)           // ❌ 硬编码
    .style('stroke', 'rgb(0,0,0)')      // ❌ 硬编码
    .style('stroke-opacity', 1);
  // ... 其他三条边也是硬编码
}
```

**问题**: 没有使用解析的样式选项（linecolor, linewidth 等）。

### 问题 3: `psframe` 解析函数不处理选项 ❌

**当前代码** (`packages/pstricks/src/lib/pstricks.ts:116-124`):
```typescript
psframe(this: PSTricksContext, m: any) {
  var obj = {
    x1: X.call(this, m[1]),
    y1: Y.call(this, m[2]),
    x2: X.call(this, m[3]),
    y2: Y.call(this, m[4])
  };
  return obj;  // ❌ 没有解析选项
},
```

**问题**: 没有解析和设置默认样式选项。

### 问题 4: `\text{Circle}` 可能不被 MathJax 识别 ⚠️

**问题**: `\text` 命令在某些 MathJax 配置中可能需要 `\text{}` 包，或者应该使用 `\mathrm{}` 或直接文本。

**建议**: 使用 `\mathrm{Circle}` 或 `Circle`（不带数学模式）

---

## 修复方案

### 修复 1: 更新 `psframe` 正则表达式

```typescript
psframe: new RegExp('\\\\psframe' + RE.options + RE.coords + RE.coords),
```

### 修复 2: 更新 `psframe` 解析函数

```typescript
psframe(this: PSTricksContext, m: any) {
  var obj: any = {
    x1: X.call(this, m[3]),
    y1: Y.call(this, m[4]),
    x2: X.call(this, m[5]),
    y2: Y.call(this, m[6]),
    linecolor: 'black',
    linestyle: 'solid',
    linewidth: 2
  };
  if (m[1]) Object.assign(obj, parseOptions(m[1]));
  return obj;
},
```

### 修复 3: 更新 `psframe` 渲染函数

```typescript
psframe(svg: any): void {
  const linewidth = this.linewidth || 2;
  const linecolor = this.linecolor || 'black';
  
  // 上边
  svg
    .append('svg:line')
    .attr('x1', this.x1)
    .attr('y1', this.y1)
    .attr('x2', this.x2)
    .attr('y2', this.y1)
    .style('stroke-width', linewidth)
    .style('stroke', linecolor)
    .style('stroke-opacity', 1);

  // 右边
  svg
    .append('svg:line')
    .attr('x1', this.x2)
    .attr('y1', this.y1)
    .attr('x2', this.x2)
    .attr('y2', this.y2)
    .style('stroke-width', linewidth)
    .style('stroke', linecolor)
    .style('stroke-opacity', 1);

  // 下边
  svg
    .append('svg:line')
    .attr('x1', this.x2)
    .attr('y1', this.y2)
    .attr('x2', this.x1)
    .attr('y2', this.y2)
    .style('stroke-width', linewidth)
    .style('stroke', linecolor)
    .style('stroke-opacity', 1);

  // 左边
  svg
    .append('svg:line')
    .attr('x1', this.x1)
    .attr('y1', this.y2)
    .attr('x2', this.x1)
    .attr('y2', this.y1)
    .style('stroke-width', linewidth)
    .style('stroke', linecolor)
    .style('stroke-opacity', 1);
},
```

---

## 总结

主要问题是 `psframe` 不支持选项参数，需要：
1. ✅ 更新正则表达式支持 `[options]`
2. ✅ 更新解析函数处理选项
3. ✅ 更新渲染函数使用选项

`psline` 和 `pscircle` 应该已经支持选项了（我们之前修复过）。
