# 第一批功能实施计划

本文档详细说明第一批功能的实施计划：透明度、虚线、网格、点集、椭圆。

---

## 📋 目录

1. [透明度支持 (opacity)](#1-透明度支持-opacity)
2. [自定义虚线样式 (dash)](#2-自定义虚线样式-dash)
3. [psgrid - 网格](#3-psgrid---网格)
4. [psdots - 点集](#4-psdots---点集)
5. [psellipse - 椭圆](#5-psellipse---椭圆)

---

## 1. 透明度支持 (opacity)

### 📐 标准

**PSTricks 标准语法**:
```latex
\pscircle[opacity=0.5](0,0){1}
\psframe[opacity=0.7,linecolor=blue](-1,-1)(1,1)
```

**标准说明**:
- `opacity` 值范围：0.0 (完全透明) 到 1.0 (完全不透明)
- 可以应用于所有图形元素
- 影响 `stroke-opacity` 和 `fill-opacity`

### 📥 输入输出

**输入**:
```latex
\pscircle[opacity=0.5,linecolor=blue](0,0){1.5}
```

**解析后的对象**:
```typescript
{
  cx: number,
  cy: number,
  r: number,
  linecolor: 'blue',
  opacity: '0.5',  // 字符串形式
  // ... 其他属性
}
```

**输出 (SVG)**:
```xml
<circle cx="..." cy="..." r="..." 
        stroke="blue" 
        stroke-opacity="0.5" 
        fill-opacity="0.5" />
```

### 🔧 修改的组件

#### 1.1 `packages/utils/src/index.ts`
**文件**: `packages/utils/src/index.ts`  
**函数**: `parseOptions`  
**修改类型**: 无需修改（已支持解析任意选项）

**当前代码**:
```typescript
export const parseOptions = function (opts: string) {
  var options = opts.replace(/[\]\[]/g, '');
  var all = options.split(',');
  var obj: { [key: string]: string } = {};
  all.forEach((option: string) => {
    var kv = option.split('=');
    if (kv.length == 2) {
      obj[kv[0].trim()] = kv[1].trim();
    }
  });
  return obj;
};
```

**说明**: 当前实现已经可以解析 `opacity=0.5`，无需修改。

---

#### 1.2 `packages/pstricks/src/lib/psgraph.ts`
**文件**: `packages/pstricks/src/lib/psgraph.ts`  
**函数**: 所有渲染函数  
**修改类型**: 添加 opacity 样式应用

**需要修改的函数**:
- `psframe`
- `pscircle`
- `psline`
- `psarc`
- `pspolygon`
- `psplot`

**修改逻辑**:

**当前代码示例** (`pscircle`):
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
    .style('stroke-opacity', 1);  // ❌ 硬编码
};
```

**修改后代码**:
```typescript
pscircle: function (svg: any) {
  const opacity = this.opacity ? parseFloat(this.opacity) : 1;
  const opacityValue = Math.max(0, Math.min(1, opacity)); // 限制在 0-1 范围
  
  svg
    .append('svg:circle')
    .attr('cx', this.cx)
    .attr('cy', this.cy)
    .attr('r', this.r)
    .style('stroke', this.linecolor || 'black')
    .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
    .style('stroke-width', this.linewidth || 2)
    .style('stroke-opacity', opacityValue)  // ✅ 使用解析的 opacity
    .style('fill-opacity', opacityValue);   // ✅ 添加 fill-opacity
};
```

**通用修改模式**:
```typescript
// 在所有渲染函数开头添加
const opacity = this.opacity ? parseFloat(this.opacity) : 1;
const opacityValue = Math.max(0, Math.min(1, opacity));

// 在 .style() 调用中添加
.style('stroke-opacity', opacityValue)
.style('fill-opacity', opacityValue)
```

### 📝 实施步骤

1. ✅ **步骤 1**: 确认 `parseOptions` 已支持（无需修改）
2. ⬜ **步骤 2**: 修改 `pscircle` 函数
3. ⬜ **步骤 3**: 修改 `psframe` 函数
4. ⬜ **步骤 4**: 修改 `psline` 函数
5. ⬜ **步骤 5**: 修改 `psarc` 函数
6. ⬜ **步骤 6**: 修改 `pspolygon` 函数
7. ⬜ **步骤 7**: 修改 `psplot` 函数
8. ⬜ **步骤 8**: 添加测试用例

### 🧪 测试用例

```latex
% 测试 1: 基本透明度
\pscircle[opacity=0.5,linecolor=blue](0,0){1}

% 测试 2: 透明度 + 填充
\psframe[opacity=0.7,fillcolor=red,fillstyle=solid](-1,-1)(1,1)

% 测试 3: 边界值
\pscircle[opacity=0](0,0){1}    % 完全透明
\pscircle[opacity=1](0,0){1}    % 完全不透明
\pscircle[opacity=1.5](0,0){1} % 超出范围，应限制为 1
```

---

## 2. 自定义虚线样式 (dash)

### 📐 标准

**PSTricks 标准语法**:
```latex
\psline[dash=5,3]{->}(0,0)(2,2)
\psline[dash=10,5,5,5]{->}(0,0)(2,2)
```

**标准说明**:
- `dash` 选项格式：逗号分隔的数字列表
- 数字表示：实线长度, 空白长度, 实线长度, 空白长度...
- 如果只有两个数字：`dash=5,3` 表示 5 单位实线，3 单位空白，重复
- 如果多个数字：按模式重复

### 📥 输入输出

**输入**:
```latex
\psline[dash=10,5]{->}(0,0)(2,2)
```

**解析后的对象**:
```typescript
{
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dash: '10,5',  // 字符串形式
  // ... 其他属性
}
```

**输出 (SVG)**:
```xml
<path d="M ... L ..." 
      stroke="black" 
      stroke-dasharray="10,5" />
```

### 🔧 修改的组件

#### 2.1 `packages/utils/src/index.ts`
**文件**: `packages/utils/src/index.ts`  
**函数**: `parseOptions`  
**修改类型**: 无需修改（已支持解析任意选项）

**说明**: 当前实现已经可以解析 `dash=10,5`，无需修改。

---

#### 2.2 `packages/pstricks/src/lib/psgraph.ts`
**文件**: `packages/pstricks/src/lib/psgraph.ts`  
**函数**: `psline` 及相关函数  
**修改类型**: 添加 dash 样式应用

**修改逻辑**:

**当前代码** (`psline`):
```typescript
psline(svg: any): void {
  var linewidth = this.linewidth || 2,
      linecolor = this.linecolor || 'black';

  function solid(x1: number, y1: number, x2: number, y2: number) {
    svg
      .append('svg:path')
      .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', 1);
  }

  function dashed(x1: number, y1: number, x2: number, y2: number) {
    svg
      .append('svg:path')
      .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-dasharray', '9,5')  // ❌ 硬编码
      .style('stroke-opacity', 1);
  }

  // ... 使用 linestyle 判断
  const linestyle = this.linestyle || 'solid';
  if (linestyle.match(/dotted/)) {
    dotted(this.x1, this.y1, this.x2, this.y2);
  } else if (linestyle.match(/dashed/)) {
    dashed(this.x1, this.y1, this.x2, this.y2);
  } else {
    solid(this.x1, this.y1, this.x2, this.y2);
  }
}
```

**修改后代码**:
```typescript
psline(svg: any): void {
  var linewidth = this.linewidth || 2,
      linecolor = this.linecolor || 'black';

  // ✅ 处理自定义 dash
  const hasCustomDash = this.dash !== undefined && this.dash !== null;
  const dashArray = hasCustomDash 
    ? this.dash.split(',').map(v => v.trim()).join(',')
    : null;

  function solid(x1: number, y1: number, x2: number, y2: number) {
    const path = svg
      .append('svg:path')
      .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', 1);
    
    // ✅ 如果指定了 dash，应用自定义样式
    if (dashArray) {
      path.style('stroke-dasharray', dashArray);
    }
  }

  function dashed(x1: number, y1: number, x2: number, y2: number) {
    const path = svg
      .append('svg:path')
      .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', 1);
    
    // ✅ 优先使用自定义 dash，否则使用默认
    if (dashArray) {
      path.style('stroke-dasharray', dashArray);
    } else {
      path.style('stroke-dasharray', '9,5');
    }
  }

  // ... 其他函数类似修改
}
```

**更简洁的实现方式**（推荐）:
```typescript
psline(svg: any): void {
  var linewidth = this.linewidth || 2,
      linecolor = this.linecolor || 'black';

  // ✅ 统一处理 dash
  const dashArray = this.dash 
    ? this.dash.split(',').map(v => v.trim()).join(',')
    : (this.linestyle === 'dashed' ? '9,5' : 
       this.linestyle === 'dotted' ? '2,2' : null);

  function drawLine(x1: number, y1: number, x2: number, y2: number) {
    const path = svg
      .append('svg:path')
      .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', 1);
    
    if (dashArray) {
      path.style('stroke-dasharray', dashArray);
    }
  }

  drawLine(this.x1, this.y1, this.x2, this.y2);
  
  // ... 箭头和点的处理
}
```

### 📝 实施步骤

1. ✅ **步骤 1**: 确认 `parseOptions` 已支持（无需修改）
2. ⬜ **步骤 2**: 修改 `psline` 函数，添加 dash 支持
3. ⬜ **步骤 3**: 修改 `psarc` 函数（如果支持虚线）
4. ⬜ **步骤 4**: 修改 `pspolygon` 函数（如果支持虚线）
5. ⬜ **步骤 5**: 修改 `psplot` 函数（如果支持虚线）
6. ⬜ **步骤 6**: 添加测试用例

### 🧪 测试用例

```latex
% 测试 1: 基本自定义虚线
\psline[dash=10,5]{->}(0,0)(2,2)

% 测试 2: 复杂虚线模式
\psline[dash=10,5,5,5]{->}(0,0)(2,2)

% 测试 3: dash 覆盖 linestyle
\psline[dash=20,10,linestyle=dashed]{->}(0,0)(2,2)

% 测试 4: 与箭头结合
\psline[dash=5,3]{->}(0,0)(2,2)
```

---

## 3. psgrid - 网格

### 📐 标准

**PSTricks 标准语法**:
```latex
\psgrid[options](x0,y0)(x1,y1)(gridsize)
\psgrid[gridcolor=gray,subgridcolor=lightgray](0,0)(10,10)(1)
```

**标准说明**:
- `(x0,y0)` - 网格起始点（左下角）
- `(x1,y1)` - 网格结束点（右上角）
- `(gridsize)` - 网格大小（主网格间距）
- 选项：
  - `gridcolor` - 主网格线颜色
  - `subgridcolor` - 子网格线颜色（可选）
  - `subgriddiv` - 子网格分割数（默认 5，即每个主网格分成 5x5 子网格）
  - `griddots` - 网格点样式（可选）
  - `gridlabels` - 网格标签（可选）

### 📥 输入输出

**输入**:
```latex
\psgrid[gridcolor=gray](0,0)(10,10)(1)
```

**解析后的对象**:
```typescript
{
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  gridsize: number,
  gridcolor: 'gray',
  subgridcolor: 'lightgray',  // 可选
  subgriddiv: 5,              // 可选，默认 5
  // ... 其他属性
}
```

**输出 (SVG)**:
```xml
<!-- 主网格线 -->
<line x1="..." y1="..." x2="..." y2="..." stroke="gray" />
<!-- 子网格线 -->
<line x1="..." y1="..." x2="..." y2="..." stroke="lightgray" stroke-width="0.5" />
<!-- 重复绘制水平和垂直网格线 -->
```

### 🔧 修改的组件

#### 3.1 `packages/pstricks/src/lib/pstricks.ts`
**文件**: `packages/pstricks/src/lib/pstricks.ts`  
**函数**: `Expressions` 和 `Functions`  
**修改类型**: 添加新命令

**修改逻辑**:

**步骤 1: 添加正则表达式**
```typescript
export const Expressions = {
  // ... 现有表达式
  psgrid: new RegExp(
    '\\\\psgrid' + 
    RE.options + 
    RE.coords + 
    RE.coords + 
    RE.squiggle
  ),
};
```

**步骤 2: 添加解析函数**
```typescript
export const Functions = {
  // ... 现有函数
  psgrid(this: PSTricksContext, m: any) {
    var obj: any = {
      x0: X.call(this, m[2]),      // m[2], m[3] 是第一个坐标
      y0: Y.call(this, m[3]),
      x1: X.call(this, m[4]),      // m[4], m[5] 是第二个坐标
      y1: Y.call(this, m[5]),
      gridsize: Number(m[6]),      // m[6] 是网格大小
      gridcolor: 'gray',
      subgridcolor: 'lightgray',
      subgriddiv: 5,
      gridwidth: 1,
      subgridwidth: 0.5
    };
    
    // 解析选项
    if (m[1]) {
      const options = parseOptions(m[1]);
      Object.assign(obj, options);
      
      // 转换颜色字符串为数字（如果需要）
      if (options.gridcolor) {
        obj.gridcolor = options.gridcolor;
      }
      if (options.subgridcolor) {
        obj.subgridcolor = options.subgridcolor;
      }
      if (options.subgriddiv) {
        obj.subgriddiv = Number(options.subgriddiv) || 5;
      }
    }
    
    return obj;
  },
};
```

---

#### 3.2 `packages/pstricks/src/lib/psgraph.ts`
**文件**: `packages/pstricks/src/lib/psgraph.ts`  
**函数**: 添加 `psgrid` 渲染函数  
**修改类型**: 新增函数

**修改逻辑**:

```typescript
const psgraph: any = {
  // ... 现有函数
  
  psgrid(svg: any): void {
    const gridcolor = this.gridcolor || 'gray';
    const subgridcolor = this.subgridcolor || 'lightgray';
    const gridwidth = this.gridwidth || 1;
    const subgridwidth = this.subgridwidth || 0.5;
    const subgriddiv = this.subgriddiv || 5;
    
    const x0 = this.x0;
    const y0 = this.y0;
    const x1 = this.x1;
    const y1 = this.y1;
    const gridsize = this.gridsize;
    
    // 计算主网格步长（像素）
    const gridStepX = gridsize * this.global.xunit;
    const gridStepY = gridsize * this.global.yunit;
    
    // 计算子网格步长
    const subgridStepX = gridStepX / subgriddiv;
    const subgridStepY = gridStepY / subgriddiv;
    
    // 绘制子网格（先绘制，在主网格下方）
    for (let x = x0; x <= x1; x += subgridStepX) {
      svg
        .append('svg:line')
        .attr('x1', x)
        .attr('y1', y0)
        .attr('x2', x)
        .attr('y2', y1)
        .style('stroke', subgridcolor)
        .style('stroke-width', subgridwidth)
        .style('stroke-opacity', 0.5);
    }
    
    for (let y = y0; y <= y1; y += subgridStepY) {
      svg
        .append('svg:line')
        .attr('x1', x0)
        .attr('y1', y)
        .attr('x2', x1)
        .attr('y2', y)
        .style('stroke', subgridcolor)
        .style('stroke-width', subgridwidth)
        .style('stroke-opacity', 0.5);
    }
    
    // 绘制主网格（后绘制，在子网格上方）
    for (let x = x0; x <= x1; x += gridStepX) {
      svg
        .append('svg:line')
        .attr('x1', x)
        .attr('y1', y0)
        .attr('x2', x)
        .attr('y2', y1)
        .style('stroke', gridcolor)
        .style('stroke-width', gridwidth)
        .style('stroke-opacity', 1);
    }
    
    for (let y = y0; y <= y1; y += gridStepY) {
      svg
        .append('svg:line')
        .attr('x1', x0)
        .attr('y1', y)
        .attr('x2', x1)
        .attr('y2', y)
        .style('stroke', gridcolor)
        .style('stroke-width', gridwidth)
        .style('stroke-opacity', 1);
    }
  },
};
```

**注意**: 需要访问 `this.global` 来获取 `xunit` 和 `yunit`。检查现有代码中如何访问这些值。

### 📝 实施步骤

1. ⬜ **步骤 1**: 在 `pstricks.ts` 中添加 `psgrid` 正则表达式到 `Expressions`
2. ⬜ **步骤 2**: 在 `pstricks.ts` 中添加 `psgrid` 解析函数到 `Functions`
3. ⬜ **步骤 3**: 在 `psgraph.ts` 中添加 `psgrid` 渲染函数到 `psgraph` 对象
4. ⬜ **步骤 4**: **无需额外注册** - 解析器会自动识别 `Expressions` 和 `Functions` 中的新命令
5. ⬜ **步骤 5**: 添加测试用例

**注意**: 解析器通过 `parsePSExpression` 方法自动遍历 `PSTricks.Expressions` 中的所有表达式，如果匹配就调用对应的 `PSTricks.Functions` 函数。因此只需要在 `pstricks.ts` 中添加即可。

### 🧪 测试用例

```latex
% 测试 1: 基本网格
\psgrid(0,0)(10,10)(1)

% 测试 2: 自定义颜色
\psgrid[gridcolor=blue,subgridcolor=lightblue](0,0)(10,10)(1)

% 测试 3: 自定义子网格分割
\psgrid[subgriddiv=10](0,0)(10,10)(1)

% 测试 4: 与坐标轴结合
\begin{pspicture}(-2,-2)(2,2)
\psaxes[linecolor=gray](0,0)(-2,-2)(2,2)
\psgrid[gridcolor=lightgray](0,0)(2,2)(0.5)
\end{pspicture}
```

---

## 4. psdots - 点集

### 📐 标准

**PSTricks 标准语法**:
```latex
\psdots[options](x1,y1)(x2,y2)(x3,y3)...
\psdots[dotstyle=*,dotsize=5pt](0,0)(1,1)(2,2)
```

**标准说明**:
- 可以接受任意多个坐标点
- 选项：
  - `dotstyle` - 点样式：`*` (实心圆), `o` (空心圆), `+` (加号), `x` (叉号), `square` (方形), `diamond` (菱形)
  - `dotsize` - 点大小（单位：pt）
  - `dotscale` - 点缩放比例
  - `linecolor` - 点颜色
  - `fillcolor` - 填充颜色（对于实心点）

### 📥 输入输出

**输入**:
```latex
\psdots[dotstyle=*,dotsize=5pt,linecolor=blue](0,0)(1,1)(2,2)
```

**解析后的对象**:
```typescript
{
  points: [
    { x: number, y: number },
    { x: number, y: number },
    { x: number, y: number }
  ],
  dotstyle: '*',
  dotsize: '5pt',
  linecolor: 'blue',
  // ... 其他属性
}
```

**输出 (SVG)**:
```xml
<!-- 对于 dotstyle=* -->
<circle cx="..." cy="..." r="..." fill="blue" />
<!-- 对于 dotstyle=o -->
<circle cx="..." cy="..." r="..." fill="none" stroke="blue" />
<!-- 对于 dotstyle=+ -->
<path d="M ... L ... M ... L ..." stroke="blue" />
<!-- 重复绘制每个点 -->
```

### 🔧 修改的组件

#### 4.1 `packages/pstricks/src/lib/pstricks.ts`
**文件**: `packages/pstricks/src/lib/pstricks.ts`  
**函数**: `Expressions` 和 `Functions`  
**修改类型**: 添加新命令

**修改逻辑**:

**步骤 1: 添加正则表达式**
```typescript
export const Expressions = {
  // ... 现有表达式
  psdots: new RegExp(
    '\\\\psdots' + 
    RE.options + 
    '(.*)'  // 匹配所有坐标点
  ),
};
```

**步骤 2: 添加解析函数**
```typescript
export const Functions = {
  // ... 现有函数
  psdots(this: PSTricksContext, m: any) {
    var obj: any = {
      dotstyle: '*',
      dotsize: 3,
      linecolor: 'black',
      fillcolor: 'black',
      dotscale: 1
    };
    
    // 解析选项
    if (m[1]) {
      Object.assign(obj, parseOptions(m[1]));
      
      // 转换 dotsize（可能带单位）
      if (obj.dotsize) {
        const sizeStr = String(obj.dotsize);
        const sizeMatch = sizeStr.match(/(\d+(?:\.\d+)?)\s*pt/);
        if (sizeMatch) {
          obj.dotsize = parseFloat(sizeMatch[1]);
        } else {
          obj.dotsize = parseFloat(sizeStr) || 3;
        }
      }
      
      // 转换 dotscale
      if (obj.dotscale) {
        obj.dotscale = parseFloat(String(obj.dotscale)) || 1;
      }
    }
    
    // 解析所有坐标点
    const coordsStr = m[2] || '';
    const coordPattern = new RegExp(RE.coords, 'g');
    const matches = coordsStr.match(coordPattern);
    const points: Array<{x: number, y: number}> = [];
    
    if (matches) {
      matches.forEach((coord: string) => {
        const coordMatch = coord.match(RE.coords);
        if (coordMatch) {
          points.push({
            x: X.call(this, coordMatch[1]),
            y: Y.call(this, coordMatch[2])
          });
        }
      });
    }
    
    obj.points = points;
    return obj;
  },
};
```

---

#### 4.2 `packages/pstricks/src/lib/psgraph.ts`
**文件**: `packages/pstricks/src/lib/psgraph.ts`  
**函数**: 添加 `psdots` 渲染函数  
**修改类型**: 新增函数

**修改逻辑**:

```typescript
const psgraph: any = {
  // ... 现有函数
  
  psdots(svg: any): void {
    const dotstyle = this.dotstyle || '*';
    const dotsize = (this.dotsize || 3) * (this.dotscale || 1);
    const linecolor = this.linecolor || 'black';
    const fillcolor = this.fillcolor || 'black';
    
    if (!this.points || this.points.length === 0) {
      return;
    }
    
    this.points.forEach((point: {x: number, y: number}) => {
      switch (dotstyle) {
        case '*':
        case 'dot':
          // 实心圆
          svg
            .append('svg:circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', dotsize)
            .style('fill', fillcolor)
            .style('stroke', 'none');
          break;
          
        case 'o':
        case 'circle':
          // 空心圆
          svg
            .append('svg:circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', dotsize)
            .style('fill', 'none')
            .style('stroke', linecolor)
            .style('stroke-width', 1);
          break;
          
        case '+':
        case 'plus':
          // 加号
          const plusSize = dotsize;
          svg
            .append('svg:line')
            .attr('x1', point.x - plusSize)
            .attr('y1', point.y)
            .attr('x2', point.x + plusSize)
            .attr('y2', point.y)
            .style('stroke', linecolor)
            .style('stroke-width', 1);
          svg
            .append('svg:line')
            .attr('x1', point.x)
            .attr('y1', point.y - plusSize)
            .attr('x2', point.x)
            .attr('y2', point.y + plusSize)
            .style('stroke', linecolor)
            .style('stroke-width', 1);
          break;
          
        case 'x':
          // 叉号
          const xSize = dotsize;
          svg
            .append('svg:line')
            .attr('x1', point.x - xSize)
            .attr('y1', point.y - xSize)
            .attr('x2', point.x + xSize)
            .attr('y2', point.y + xSize)
            .style('stroke', linecolor)
            .style('stroke-width', 1);
          svg
            .append('svg:line')
            .attr('x1', point.x - xSize)
            .attr('y1', point.y + xSize)
            .attr('x2', point.x + xSize)
            .attr('y2', point.y - xSize)
            .style('stroke', linecolor)
            .style('stroke-width', 1);
          break;
          
        case 'square':
          // 方形
          svg
            .append('svg:rect')
            .attr('x', point.x - dotsize)
            .attr('y', point.y - dotsize)
            .attr('width', dotsize * 2)
            .attr('height', dotsize * 2)
            .style('fill', fillcolor)
            .style('stroke', 'none');
          break;
          
        case 'diamond':
          // 菱形
          const diamondSize = dotsize;
          svg
            .append('svg:polygon')
            .attr('points', [
              [point.x, point.y - diamondSize].join(','),
              [point.x + diamondSize, point.y].join(','),
              [point.x, point.y + diamondSize].join(','),
              [point.x - diamondSize, point.y].join(',')
            ].join(' '))
            .style('fill', fillcolor)
            .style('stroke', 'none');
          break;
          
        default:
          // 默认实心圆
          svg
            .append('svg:circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', dotsize)
            .style('fill', fillcolor)
            .style('stroke', 'none');
      }
    });
  },
};
```

### 📝 实施步骤

1. ⬜ **步骤 1**: 在 `pstricks.ts` 中添加 `psdots` 正则表达式到 `Expressions`
2. ⬜ **步骤 2**: 在 `pstricks.ts` 中添加 `psdots` 解析函数到 `Functions`
3. ⬜ **步骤 3**: 在 `psgraph.ts` 中添加 `psdots` 渲染函数到 `psgraph` 对象
4. ⬜ **步骤 4**: **无需额外注册** - 解析器会自动识别
5. ⬜ **步骤 5**: 添加测试用例

### 🧪 测试用例

```latex
% 测试 1: 基本点集
\psdots(0,0)(1,1)(2,2)

% 测试 2: 自定义样式和大小
\psdots[dotstyle=*,dotsize=5pt,linecolor=blue](0,0)(1,1)(2,2)

% 测试 3: 空心圆
\psdots[dotstyle=o,dotsize=4pt](0,0)(1,1)(2,2)

% 测试 4: 加号
\psdots[dotstyle=+,dotsize=6pt](0,0)(1,1)(2,2)

% 测试 5: 方形
\psdots[dotstyle=square,dotsize=4pt](0,0)(1,1)(2,2)
```

---

## 5. psellipse - 椭圆

### 📐 标准

**PSTricks 标准语法**:
```latex
\psellipse[options](x,y)(rx,ry)
\psellipse[linecolor=blue,fillcolor=red](0,0)(2,1)
```

**标准说明**:
- `(x,y)` - 椭圆中心点
- `(rx,ry)` - 椭圆的水平半径和垂直半径
- 选项：与 `pscircle` 相同（linecolor, fillcolor, fillstyle, linewidth 等）

### 📥 输入输出

**输入**:
```latex
\psellipse[linecolor=blue,fillcolor=red](0,0)(2,1)
```

**解析后的对象**:
```typescript
{
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  linecolor: 'blue',
  fillcolor: 'red',
  fillstyle: 'solid',
  linewidth: 2,
  // ... 其他属性
}
```

**输出 (SVG)**:
```xml
<ellipse cx="..." cy="..." rx="..." ry="..." 
         stroke="blue" 
         fill="red" 
         stroke-width="2" />
```

### 🔧 修改的组件

#### 5.1 `packages/pstricks/src/lib/pstricks.ts`
**文件**: `packages/pstricks/src/lib/pstricks.ts`  
**函数**: `Expressions` 和 `Functions`  
**修改类型**: 添加新命令

**修改逻辑**:

**步骤 1: 添加正则表达式**
```typescript
export const Expressions = {
  // ... 现有表达式
  psellipse: new RegExp(
    '\\\\psellipse' + 
    RE.options + 
    RE.coords + 
    RE.coords
  ),
};
```

**步骤 2: 添加解析函数**
```typescript
export const Functions = {
  // ... 现有函数
  psellipse(this: PSTricksContext, m: any) {
    var obj: any = {
      cx: X.call(this, m[2]),
      cy: Y.call(this, m[3]),
      rx: Number(m[4]) * this.xunit,  // 转换为像素
      ry: Number(m[5]) * this.yunit,  // 转换为像素
      linecolor: 'black',
      linestyle: 'solid',
      fillstyle: 'none',
      fillcolor: 'black',
      linewidth: 2
    };
    
    // 解析选项
    if (m[1]) {
      Object.assign(obj, parseOptions(m[1]));
    }
    
    return obj;
  },
};
```

---

#### 5.2 `packages/pstricks/src/lib/psgraph.ts`
**文件**: `packages/pstricks/src/lib/psgraph.ts`  
**函数**: 添加 `psellipse` 渲染函数  
**修改类型**: 新增函数

**修改逻辑**:

```typescript
const psgraph: any = {
  // ... 现有函数
  
  psellipse(svg: any): void {
    const linecolor = this.linecolor || 'black';
    const linewidth = this.linewidth || 2;
    const fillcolor = this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black');
    const opacity = this.opacity ? parseFloat(this.opacity) : 1;
    const opacityValue = Math.max(0, Math.min(1, opacity));
    
    svg
      .append('svg:ellipse')
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('rx', this.rx)
      .attr('ry', this.ry)
      .style('stroke', linecolor)
      .style('fill', fillcolor)
      .style('stroke-width', linewidth)
      .style('stroke-opacity', opacityValue)
      .style('fill-opacity', opacityValue);
  },
};
```

### 📝 实施步骤

1. ⬜ **步骤 1**: 在 `pstricks.ts` 中添加 `psellipse` 正则表达式到 `Expressions`
2. ⬜ **步骤 2**: 在 `pstricks.ts` 中添加 `psellipse` 解析函数到 `Functions`
3. ⬜ **步骤 3**: 在 `psgraph.ts` 中添加 `psellipse` 渲染函数到 `psgraph` 对象
4. ⬜ **步骤 4**: **无需额外注册** - 解析器会自动识别
5. ⬜ **步骤 5**: 添加测试用例

### 🧪 测试用例

```latex
% 测试 1: 基本椭圆
\psellipse(0,0)(2,1)

% 测试 2: 带填充
\psellipse[fillcolor=red,fillstyle=solid](0,0)(2,1)

% 测试 3: 自定义颜色和宽度
\psellipse[linecolor=blue,linewidth=3pt](0,0)(2,1)

% 测试 4: 透明度
\psellipse[opacity=0.5,fillcolor=red](0,0)(2,1)

% 测试 5: 圆形（rx=ry）
\psellipse(0,0)(1,1)
```

---

## 📊 实施顺序建议

### 阶段 1: 选项增强（1-2天）
1. ✅ 透明度支持 (opacity)
2. ✅ 自定义虚线样式 (dash)

### 阶段 2: 新命令实现（2-3天）
3. ✅ psellipse - 椭圆（最简单）
4. ✅ psdots - 点集（中等复杂度）
5. ✅ psgrid - 网格（较复杂）

---

## 🔍 代码检查清单

每个功能实施后检查：

- [ ] 正则表达式正确匹配语法
- [ ] 解析函数正确处理所有参数
- [ ] 解析函数设置默认值
- [ ] 渲染函数应用所有选项
- [ ] 渲染函数处理边界情况
- [ ] 测试用例覆盖基本用法
- [ ] 测试用例覆盖边界情况
- [ ] 代码符合现有代码风格
- [ ] 无 TypeScript 类型错误
- [ ] 无运行时错误

---

## 📝 注意事项

1. **坐标转换**: 所有坐标都需要通过 `X()` 和 `Y()` 函数转换
2. **单位转换**: 半径、大小等需要乘以 `xunit` 或 `yunit`
3. **默认值**: 所有选项都应该有合理的默认值
4. **错误处理**: 处理无效输入（NaN、undefined 等）
5. **性能**: 网格和点集可能生成大量 SVG 元素，注意性能
6. **向后兼容**: 确保新功能不影响现有功能

---

## 🔗 解析器集成说明

### 自动注册机制

LaTeX2JS 使用自动发现机制注册 PSTricks 命令：

1. **表达式定义**: 在 `packages/pstricks/src/lib/pstricks.ts` 的 `Expressions` 对象中定义正则表达式
2. **函数定义**: 在同一个文件的 `Functions` 对象中定义解析函数
3. **渲染函数**: 在 `packages/pstricks/src/lib/psgraph.ts` 的 `psgraph` 对象中定义渲染函数

**解析流程**:
```
LaTeX 文本 
  → parser.parsePSExpression() 
  → 遍历 Expressions 中的所有正则表达式
  → 如果匹配，调用对应的 Functions[k].call(env, match)
  → 返回解析后的对象
  → 渲染时调用 psgraph[k](svg)
```

**重要**: 
- 新命令的 `Expressions` 键名必须与 `Functions` 键名相同
- `Functions` 键名必须与 `psgraph` 对象中的渲染函数名相同
- 解析器会自动发现并处理这些命令，无需手动注册

---

**最后更新**: 2026-01-30  
**文档版本**: 1.0
