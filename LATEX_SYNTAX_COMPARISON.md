# LaTeX 标准语法 vs LaTeX2JS 支持语法对比

## 📚 标准 LaTeX 语法

### 标准 PSTricks 语法格式

标准 PSTricks 命令的通用格式：
```latex
\command[选项]{参数1}{参数2}...
\command(坐标)(坐标)...
\command{内容}
```

### 标准 PSTricks 命令示例

```latex
% 标准语法
\pscircle[linecolor=blue,linewidth=2pt](0,0){1.5}
\psframe[fillcolor=red,fillstyle=solid](-2,-2)(2,2)
\psline[linecolor=green,linewidth=3pt]{->}(0,0)(1,1)
\psplot[algebraic,linewidth=2pt]{-4}{4}{sin(x)}
```

---

## 🔍 LaTeX2JS 支持的语法

### 1. PSTricks 图形命令

#### ✅ 完全支持的语法

| 命令 | 标准 LaTeX 语法 | LaTeX2JS 支持 | 状态 |
|------|----------------|--------------|------|
| `\pspicture` | `\begin{pspicture}(x0,y0)(x1,y1)` | ✅ 完全支持 | ✅ |
| `\psframe` | `\psframe[options](x1,y1)(x2,y2)` | ✅ 支持选项（已修复） | ✅ |
| `\pscircle` | `\pscircle[options](x,y){radius}` | ✅ 支持选项（已修复） | ✅ |
| `\psline` | `\psline[options]{arrows}(x1,y1)(x2,y2)` | ✅ 支持选项和箭头 | ✅ |
| `\psplot` | `\psplot[options]{start}{end}{expr}` | ✅ 支持选项 | ✅ |
| `\psaxes` | `\psaxes[options]{arrows}(x0,y0)(x1,y1)(x2,y2)` | ✅ 支持选项 | ✅ |
| `\psarc` | `\psarc[options]{arrows}(x,y){r}{angleA}{angleB}` | ✅ 支持选项（已修复） | ✅ |
| `\pspolygon` | `\pspolygon[options](x1,y1)(x2,y2)...` | ✅ 支持选项（已修复） | ✅ |
| `\rput` | `\rput(x,y){content}` | ✅ 完全支持 | ✅ |
| `\psset` | `\psset{key=value,...}` | ✅ 支持 | ✅ |

#### ❌ 不支持的语法（标准 PSTricks）

| 命令 | 标准 LaTeX 语法 | LaTeX2JS 支持 | 说明 |
|------|----------------|--------------|------|
| `\pscustom` | `\pscustom[options]{path commands}` | ❌ 不支持 | 自定义路径 |
| `\psbezier` | `\psbezier[options](x0,y0)(x1,y1)(x2,y2)(x3,y3)` | ❌ 不支持 | 贝塞尔曲线 |
| `\psgrid` | `\psgrid[options](x0,y0)(x1,y1)(gridsize)` | ❌ 不支持 | 网格 |
| `\psdots` | `\psdots[options](x1,y1)(x2,y2)...` | ❌ 不支持 | 点集 |
| `\pscurve` | `\pscurve[options](x1,y1)(x2,y2)...` | ❌ 不支持 | 曲线 |
| `\psellipse` | `\psellipse[options](x,y)(rx,ry)` | ❌ 不支持 | 椭圆 |
| `\psoval` | `\psoval[options](x1,y1)(x2,y2)` | ❌ 不支持 | 圆角矩形 |
| `\psdiamond` | `\psdiamond[options](x,y)(width,height)` | ❌ 不支持 | 菱形 |
| `\pstextpath` | `\pstextpath[options]{path}{text}` | ❌ 不支持 | 沿路径文本 |
| `\psfrag` | `\psfrag{tag}{replacement}` | ❌ 不支持 | 图形替换 |
| `\psclip` | `\psclip{path}` | ❌ 不支持 | 裁剪 |
| `\psfill` | `\psfill[options]{path}` | ❌ 不支持 | 填充区域 |
| `\psvector` | `\psvector[options]{arrows}(x1,y1)(x2,y2)` | ❌ 不支持 | 向量 |
| `\psbrace` | `\psbrace[options](x1,y1)(x2,y2)` | ❌ 不支持 | 大括号 |
| `\psbracket` | `\psbracket[options](x1,y1)(x2,y2)` | ❌ 不支持 | 方括号 |

### 2. 选项语法差异

#### ✅ 支持的选项格式

```latex
% 单个选项
\pscircle[linecolor=blue](0,0){1}

% 多个选项（逗号分隔）
\psframe[linecolor=red,linewidth=3pt,fillcolor=blue](-2,-2)(2,2)

% 选项值可以带单位
\psline[linewidth=2pt]{->}(0,0)(1,1)
```

#### ⚠️ 可能不支持的选项

标准 PSTricks 支持更多选项，LaTeX2JS 只支持部分：

**支持的选项：**
- `linecolor` - 线条颜色
- `linewidth` - 线条宽度
- `linestyle` - 线条样式（solid, dashed, dotted）
- `fillcolor` - 填充颜色
- `fillstyle` - 填充样式（solid, none）
- `unit`, `xunit`, `yunit` - 单位设置

**不支持的选项（标准 PSTricks 中常见）：**
- `dimen` - 尺寸设置
- `linearc` - 圆角半径
- `shadow` - 阴影
- `opacity` - 透明度
- `dash` - 自定义虚线样式
- `dotsep` - 点间距
- `showpoints` - 显示点
- `plotstyle` - 绘图样式
- `plotpoints` - 绘图点数（psplot 中可能支持）
- `algebraic` - 代数模式（psplot 中支持）

### 3. 坐标语法

#### ✅ 支持的坐标格式

```latex
% 标准坐标格式
\pscircle(0,0){1}           % 整数坐标
\pscircle(1.5,-2.3){0.5}   % 小数坐标
\pscircle(-1,2){1}         % 负数坐标

% 相对坐标（部分支持）
\psline(0,0)(1,1)          % 绝对坐标
```

#### ❌ 不支持的坐标格式

```latex
% 标准 PSTricks 支持但 LaTeX2JS 不支持
\pscircle(*1.5,2){1}       % 相对坐标（* 前缀）
\pscircle(1.5;30){1}       % 极坐标（; 分隔）
\pscircle(+1,+2){1}       % 相对增量坐标
```

### 4. 箭头语法

#### ✅ 支持的箭头格式

```latex
\psline{->}(0,0)(1,1)      % 右箭头
\psline{<-}(0,0)(1,1)      % 左箭头
\psline{<->}(0,0)(1,1)     % 双箭头
\psline{*-}(0,0)(1,1)      % 起点带点
\psline{-*}(0,0)(1,1)      % 终点带点
\psline{*-*}(0,0)(1,1)     % 两端带点
```

#### ⚠️ 可能不支持的箭头格式

```latex
% 标准 PSTricks 支持但可能不支持
\psline{->>}(0,0)(1,1)     % 双箭头
\psline{->|}(0,0)(1,1)     % 箭头+竖线
\psline{|->}(0,0)(1,1)     % 竖线+箭头
```

### 5. 数学公式语法

#### ✅ 支持的数学语法（通过 MathJax）

```latex
% 行内公式
$x = 1$

% 块级公式
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

% 标准 LaTeX 数学命令
\sum, \int, \frac, \sqrt, \sin, \cos, etc.
```

#### ⚠️ MathJax 配置限制

当前配置的包：
```typescript
packages: ['base', 'ams', 'newcommand', 'configmacros']
```

**可能不支持的命令：**
- `\text{}` - 需要 `text` 包（当前未包含）
- `\boldsymbol{}` - 需要 `boldsymbol` 包
- `\color{}` - 需要 `color` 包
- `\cancel{}` - 需要 `cancel` 包

**建议替代：**
- `\text{Circle}` → `\mathrm{Circle}` 或 `Circle`
- `\color{red}{x}` → 使用 HTML/CSS 颜色

### 6. 文本格式化语法

#### ✅ 支持的文本命令

```latex
\emph{text}        % 强调（斜体）
\bf{text}         % 粗体
\it{text}         % 斜体
\rm{text}         % 罗马字体
\sl{text}         % 倾斜
\tt{text}         % 等宽字体
```

#### ❌ 不支持的文本命令（标准 LaTeX）

```latex
\textbf{text}     % 标准 LaTeX 粗体（不支持）
\textit{text}     % 标准 LaTeX 斜体（不支持）
\texttt{text}     % 标准 LaTeX 等宽（不支持）
\textsc{text}     % 小型大写（不支持）
\underline{text}  % 下划线（不支持）
\sout{text}       % 删除线（不支持）
```

### 7. 环境语法

#### ✅ 支持的环境

```latex
\begin{pspicture}...\end{pspicture}
\begin{verbatim}...\end{verbatim}
\begin{enumerate}...\end{enumerate}
\begin{nicebox}...\end{nicebox}
\begin{print}...\end{print}
```

#### ❌ 不支持的环境（标准 LaTeX）

```latex
\begin{document}...\end{document}    % 文档环境
\begin{abstract}...\end{abstract}    % 摘要
\begin{quote}...\end{quote}          % 引用
\begin{center}...\end{center}         % 居中
\begin{figure}...\end{figure}        % 图片环境
\begin{table}...\end{table}           % 表格环境
\begin{equation}...\end{equation}     % 公式环境（使用 $$ 代替）
\begin{align}...\end{align}           % 对齐公式
```

---

## 📊 差异总结

### 主要差异

1. **PSTricks 命令覆盖度**: ~30%
   - 支持：基础图形命令（circle, frame, line, plot, axes, arc, polygon）
   - 不支持：高级命令（bezier, curve, grid, dots, custom paths 等）

2. **选项支持**: ~60%
   - 支持：基础样式选项（color, width, style）
   - 不支持：高级选项（shadow, opacity, custom dash patterns 等）

3. **坐标系统**: ~80%
   - 支持：绝对坐标、小数、负数
   - 不支持：相对坐标（* 前缀）、极坐标

4. **数学公式**: ~90%（通过 MathJax）
   - 支持：标准数学命令
   - 限制：需要特定包的命令（如 `\text`）

5. **文本格式化**: ~40%
   - 支持：基础字体命令（\bf, \it, \emph）
   - 不支持：标准 LaTeX 命令（\textbf, \textit）

### 语法兼容性

| 类别 | 标准 LaTeX | LaTeX2JS | 兼容度 |
|------|-----------|----------|--------|
| PSTricks 基础命令 | ✅ | ✅ | 100% |
| PSTricks 高级命令 | ✅ | ❌ | 0% |
| 选项语法 | ✅ | ✅ | 100% |
| 坐标语法 | ✅ | ⚠️ | 80% |
| 箭头语法 | ✅ | ✅ | 90% |
| 数学公式 | ✅ | ✅ | 90% |
| 文本格式化 | ✅ | ⚠️ | 40% |

---

## 💡 使用建议

### ✅ 推荐使用的语法

```latex
% PSTricks 基础图形
\pscircle[linecolor=blue](0,0){1.5}
\psframe[fillcolor=red](0,0)(2,2)
\psline[linecolor=green]{->}(0,0)(1,1)

% 数学公式
$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
$\mathrm{Circle}$  % 使用 \mathrm 而不是 \text

% 文本格式化
\bf{粗体文本}
\it{斜体文本}
```

### ❌ 避免使用的语法

```latex
% 不支持的 PSTricks 命令
\psbezier(0,0)(1,1)(2,0)(3,1)
\psgrid(0,0)(10,10)(1)

% 不支持的数学命令
\text{文本}  % 使用 \mathrm{} 或直接文本

% 不支持的文本命令
\textbf{文本}  % 使用 \bf{文本}
```

---

## 📝 总结

LaTeX2JS **不是完整的 LaTeX/PSTricks 实现**，而是一个**子集实现**，专注于：

1. ✅ **基础 PSTricks 图形** - 支持常用图形命令
2. ✅ **数学公式渲染** - 通过 MathJax 支持标准数学语法
3. ✅ **交互式元素** - 自定义的 slider、userline 等
4. ❌ **高级 PSTricks** - 不支持复杂路径、曲线等
5. ❌ **完整 LaTeX** - 不支持文档结构、表格、图片等

**适用场景**：
- ✅ 数学公式和简单图形
- ✅ 交互式数学可视化
- ✅ 教学演示和在线教程
- ❌ 复杂的技术文档
- ❌ 完整的 LaTeX 文档排版
