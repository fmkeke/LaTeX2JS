# LaTeX2JS 语法支持分析报告

## 📋 当前支持的语法

### 1. 环境 (Environments)
- ✅ `pspicture` - PSTricks 图形环境
- ✅ `verbatim` - 代码原样显示
- ✅ `enumerate` - 有序列表（支持 `\item`）
- ✅ `nicebox` - 带标题的框
- ✅ `print` - 打印环境

### 2. PSTricks 图形命令

#### ✅ 已支持的命令
- `\pspicture(x0,y0)(x1,y1)` - 创建图形画布
- `\psframe(x1,y1)(x2,y2)` - 矩形框
- `\pscircle(x,y){radius}` - 圆形 ⚠️ **有问题**
- `\pspolygon` - 多边形 ⚠️ **有问题**
- `\psarc` - 圆弧 ⚠️ **有问题**
- `\psline` - 直线（支持箭头）
- `\psaxes` - 坐标轴
- `\psplot[options]{start}{end}{expression}` - 函数图像
- `\rput(x,y){content}` - 文本/公式定位
- `\psset{options}` - 全局样式设置

#### ✅ 自定义扩展（非标准 PSTricks）
- `\slider{min}{max}{variable}{label}{value}` - 滑块控件
- `\userline[options]{arrows}(x1,y1)(x2,y2){xExp}{yExp}` - 可交互线条
- `\uservariable{name}(x,y){expression}` - 用户变量

### 3. 文本格式化命令

#### ✅ 字体样式
- `\emph{text}` - 强调（斜体）
- `\bf{text}` - 粗体
- `\it{text}` - 斜体
- `\rm{text}` - 罗马字体
- `\sl{text}` - 倾斜
- `\tt{text}` - 等宽字体

#### ✅ 标点符号
- `---` - 长破折号 (mdash)
- `--` - 短破折号 (ndash)
- ` `` ` - 左双引号
- `''` - 右双引号

#### ✅ 特殊命令
- `\TeX` - TeX 标识
- `\LaTeX` - LaTeX 标识
- `\vspace` - 垂直间距
- `\href{url}{text}` - 超链接
- `\img{url}` - 插入图片
- `\youtube{id}` - 嵌入 YouTube 视频
- `\cite[page]{ref}` - 引用
- `\set{text}` - 集合表示（斜体）

### 4. 数学公式支持
- ✅ 行内公式：`$...$`
- ✅ 块级公式：`$$...$$`
- ✅ MathJax 集成

---

## 🐛 发现的问题

### 问题 1: `pscircle` 不支持选项参数
**位置**: `packages/pstricks/src/lib/pstricks.ts:27`

**当前代码**:
```typescript
pscircle: /\\pscircle.*\(\s*(.*),(.*)\s*\)\{(.*)\}/,
```

**问题**: 正则表达式不支持 `[options]`，无法解析 `\pscircle[linecolor=red](0,0){1}` 这样的语法。

**应该改为**:
```typescript
pscircle: new RegExp('\\\\pscircle' + RE.options + RE.coords + RE.squiggle),
```

### 问题 2: `pscircle` 渲染函数不使用样式选项
**位置**: `packages/pstricks/src/lib/psgraph.ts:100-110`

**当前代码**:
```typescript
pscircle: function (svg: any) {
  svg
    .append('svg:circle')
    .attr('cx', this.cx)
    .attr('cy', this.cy)
    .attr('r', this.r)
    .style('stroke', 'black')      // ❌ 硬编码
    .style('fill', 'none')         // ❌ 硬编码
    .style('stroke-width', 2)      // ❌ 硬编码
    .style('stroke-opacity', 1);
},
```

**问题**: 没有使用解析的样式选项（linecolor, fillstyle, fillcolor, linewidth）。

**应该改为**:
```typescript
pscircle: function (svg: any) {
  svg
    .append('svg:circle')
    .attr('cx', this.cx)
    .attr('cy', this.cy)
    .attr('r', this.r)
    .style('stroke', this.linecolor || 'black')
    .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
    .style('stroke-width', this.linewidth || 2)
    .style('stroke-opacity', 1);
},
```

### 问题 3: `pscircle` 解析函数不处理选项
**位置**: `packages/pstricks/src/lib/pstricks.ts:125-132`

**当前代码**:
```typescript
pscircle(this: PSTricksContext, m: any) {
  var obj = {
    cx: X.call(this, m[1]),
    cy: Y.call(this, m[2]),
    r: this.xunit * m[3]
  };
  return obj;
},
```

**问题**: 没有解析和设置默认样式选项。

**应该改为**:
```typescript
pscircle(this: PSTricksContext, m: any) {
  var obj: any = {
    cx: X.call(this, m[3]),
    cy: Y.call(this, m[4]),
    r: this.xunit * Number(m[5]),
    linecolor: 'black',
    linestyle: 'solid',
    fillstyle: 'none',
    fillcolor: 'black',
    linewidth: 2
  };
  if (m[1]) Object.assign(obj, parseOptions(m[1]));
  return obj;
},
```

### 问题 4: `psarc` 渲染函数硬编码样式
**位置**: `packages/pstricks/src/lib/psgraph.ts:165-193`

**当前代码**:
```typescript
psarc(svg: any): void {
  // ... 路径构建代码 ...
  svg
    .append('svg:path')
    .attr('d', context.join(' '))
    .style('stroke-width', 2)           // ❌ 硬编码
    .style('stroke-opacity', 1)
    .style('fill', 'blue')              // ❌ 硬编码
    .style('stroke', 'black');          // ❌ 硬编码
},
```

**问题**: 硬编码了样式，应该使用解析的选项。

**应该改为**:
```typescript
psarc(svg: any): void {
  // ... 路径构建代码 ...
  svg
    .append('svg:path')
    .attr('d', context.join(' '))
    .style('stroke-width', this.linewidth || 2)
    .style('stroke-opacity', 1)
    .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
    .style('stroke', this.linecolor || 'black');
},
```

### 问题 5: `pspolygon` 渲染函数不使用 linecolor
**位置**: `packages/pstricks/src/lib/psgraph.ts:144-163`

**当前代码**:
```typescript
pspolygon(svg: any): void {
  // ... 路径构建代码 ...
  svg
    .append('svg:path')
    .attr('d', context.join(' '))
    .style('stroke-width', this.linewidth)
    .style('stroke-opacity', 1)
    .style('fill', this.fillstyle === 'none' ? 'none' : this.fillcolor)
    .style('stroke', 'black');          // ❌ 硬编码
},
```

**问题**: linecolor 被硬编码为 'black'，应该使用解析的选项。

**应该改为**:
```typescript
pspolygon(svg: any): void {
  // ... 路径构建代码 ...
  svg
    .append('svg:path')
    .attr('d', context.join(' '))
    .style('stroke-width', this.linewidth || 2)
    .style('stroke-opacity', 1)
    .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
    .style('stroke', this.linecolor || 'black');
},
```

### 问题 6: `psarc` SVG 路径构建可能有问题
**位置**: `packages/pstricks/src/lib/psgraph.ts:165-184`

**当前代码**:
```typescript
psarc(svg: any): void {
  var context = [];
  context.push('M');
  context.push(this.cx);
  context.push(this.cy);
  context.push('L');
  context.push(this.A.x);
  context.push(this.A.y);

  context.push('A');

  context.push(this.A.x);  // ❌ 应该是半径
  context.push(this.A.y);  // ❌ 应该是半径
  context.push(0);
  context.push(0);
  context.push(0);

  context.push(this.B.x);
  context.push(this.B.y);
```

**问题**: SVG 圆弧路径的构建不正确。SVG 的 `A` 命令需要：`A rx ry x-axis-rotation large-arc-flag sweep-flag x y`

**应该改为**:
```typescript
psarc(svg: any): void {
  var context = [];
  context.push('M');
  context.push(this.A.x);
  context.push(this.A.y);
  
  context.push('A');
  context.push(this.r);  // rx
  context.push(this.r);  // ry
  context.push(0);      // x-axis-rotation
  context.push(0);      // large-arc-flag (0 for small arc)
  context.push(1);      // sweep-flag (1 for clockwise)
  context.push(this.B.x);
  context.push(this.B.y);
```

---

## 📝 总结

### 支持的语法范围
LaTeX2JS 支持 PSTricks 的一个**子集**，主要专注于：
1. ✅ 基础图形（矩形、圆形、多边形、直线、圆弧）
2. ✅ 函数绘图（`\psplot`）
3. ✅ 交互式元素（自定义的 `\slider`、`\userline`）
4. ✅ 数学标注（`\rput`）

### ✅ 已修复的问题
1. ✅ `pscircle` 不支持选项参数 - **已修复**
2. ✅ `pscircle` 渲染函数不使用样式选项 - **已修复**
3. ✅ `psarc` 渲染函数硬编码样式 - **已修复**
4. ✅ `pspolygon` 渲染函数不使用 linecolor - **已修复**
5. ✅ `psarc` SVG 路径构建不正确 - **已修复**
6. ✅ `psarc` A/B 点计算不正确 - **已修复**

### 不支持的命令（标准 PSTricks）
- ❌ `\pscustom` - 自定义路径
- ❌ `\psbezier` - 贝塞尔曲线
- ❌ `\psgrid` - 网格
- ❌ `\psdots` - 点集
- ❌ `\pscurve` - 曲线
- ❌ `\psellipse` - 椭圆
- ❌ `\psoval` - 圆角矩形
- ❌ `\psdiamond` - 菱形
- ❌ `\pstextpath` - 沿路径文本
- ❌ 等等...
