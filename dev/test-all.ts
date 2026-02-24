import { renderPromise } from '../packages/html5/src/index';

// 测试模板定义
interface TestTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
}

const testTemplates: TestTemplate[] = [
  {
    id: 'psframe',
    name: 'psframe - 矩形框',
    description: '测试矩形框命令，包括基本用法和选项参数（linecolor, linewidth, opacity）',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本矩形框
\\psframe(-2,-2)(2,2)

% 带选项的矩形框
\\psframe[linecolor=red,linewidth=3pt](-1.5,-1.5)(1.5,1.5)

% 蓝色边框
\\psframe[linecolor=blue,linewidth=2pt](-0.5,-0.5)(0.5,0.5)

% 透明度测试
\\psframe[linecolor=green,opacity=0.5,linewidth=2pt](-2.5,-2.5)(-0.5,-0.5)
\\psframe[linecolor=purple,opacity=0.3,linewidth=2pt](0.5,0.5)(2.5,2.5)
\\psframe[linecolor=orange,opacity=0.7,linewidth=3pt](-1,1)(1,-1)
\\end{pspicture}`
  },
  {
    id: 'pscircle',
    name: 'pscircle - 圆形',
    description: '测试圆形命令，包括基本用法、选项参数（linecolor, fillcolor, fillstyle, opacity）和不同半径',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 基本圆形
\\pscircle(0,0){1}

% 蓝色边框圆形
\\pscircle[linecolor=blue](2,0){1}

% 红色填充圆形
\\pscircle[fillcolor=red,fillstyle=solid](-2,0){1}

% 绿色边框+黄色填充
\\pscircle[linecolor=green,fillcolor=yellow,fillstyle=solid,linewidth=3pt](0,2){1}

% 透明度测试
\\pscircle[linecolor=red,opacity=0.5](0,-2){1.5}
\\pscircle[fillcolor=blue,fillstyle=solid,opacity=0.7](2.5,0){0.8}
\\pscircle[linecolor=green,fillcolor=yellow,fillstyle=solid,opacity=0.3](-2.5,0){0.8}

% 大圆
\\pscircle[linecolor=purple,linewidth=2pt](0,-2){1.5}
\\end{pspicture}`
  },
  {
    id: 'psline',
    name: 'psline - 直线',
    description: '测试直线命令，包括基本用法、箭头、选项参数（linecolor, linewidth, linestyle, opacity, dash）和点标记',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本直线
\\psline(0,0)(2,2)

% 红色箭头
\\psline[linecolor=red]{->}(-2,-2)(2,2)

% 双向箭头
\\psline[linecolor=blue,linewidth=2pt]{<->}(-2,0)(2,0)

% 虚线
\\psline[linecolor=green,linestyle=dashed](-2,2)(2,-2)

% 点线
\\psline[linecolor=orange,linestyle=dotted](0,-2)(0,2)

% 自定义虚线样式
\\psline[linecolor=purple,dash=10,5]{->}(-2,-1.5)(2,-1.5)

% 自定义虚线样式（多个值）
\\psline[linecolor=cyan,dash=5,3,2,3](0,-2.5)(0,2.5)

% 透明度测试
\\psline[linecolor=red,opacity=0.5,linewidth=3pt](-1.5,-2)(-1.5,2)
\\psline[linecolor=red,opacity=0.3,linewidth=3pt](-1,-2)(-1,2)
\\psline[linecolor=red,opacity=0.1,linewidth=3pt](-0.5,-2)(-0.5,2)

% 透明度 + 自定义虚线
\\psline[linecolor=blue,opacity=0.6,dash=8,4]{->}(1.5,-2)(1.5,2)

% 带点的线
\\psline[linecolor=purple]{*-*}(-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'pspolygon',
    name: 'pspolygon - 多边形',
    description: '测试多边形命令，包括三角形、四边形等，以及选项参数（linecolor, fillcolor, fillstyle, opacity）',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 三角形
\\pspolygon[linecolor=red](0,2)(-1.5,-1)(1.5,-1)

% 填充三角形
\\pspolygon[fillcolor=blue,fillstyle=solid,linecolor=black](-2,-2)(-2,0)(0,-2)

% 四边形
\\pspolygon[linecolor=green,linewidth=2pt](1,-1)(2,0)(1,1)(0,0)

% 透明度测试
\\pspolygon[fillcolor=yellow,fillstyle=solid,linecolor=purple,opacity=0.6](-1,1)(-0.3,1.5)(0.5,1.2)(0.3,0.5)(-0.5,0.5)
\\pspolygon[linecolor=cyan,opacity=0.4,linewidth=2pt](0,-2)(-1.5,-1.5)(-1,-2.5)(0.5,-2.5)
\\end{pspicture}`
  },
  {
    id: 'psarc',
    name: 'psarc - 圆弧',
    description: '测试圆弧命令，包括基本用法、箭头、选项参数（linecolor, linewidth, opacity）和不同角度',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本圆弧（0-90度）
\\psarc[linecolor=red](0,0){1.5}{0}{90}

% 带箭头的圆弧
\\psarc[linecolor=blue,linewidth=2pt]{->}(0,0){1.5}{90}{180}

% 半圆
\\psarc[linecolor=green](0,0){1.5}{180}{360}

% 小角度圆弧
\\psarc[linecolor=orange,linewidth=3pt]{->}(0,0){2}{45}{135}

% 透明度测试
\\psarc[linecolor=purple,opacity=0.5](0,0){2.2}{0}{90}
\\psarc[linecolor=cyan,opacity=0.3,linewidth=2pt]{->}(0,0){2.2}{90}{180}
\\psarc[linecolor=magenta,opacity=0.7](0,0){2.2}{180}{270}

% 完整圆（通过两个半圆）
\\psarc[linecolor=purple](0,0){1}{0}{180}
\\psarc[linecolor=purple](0,0){1}{180}{360}
\\end{pspicture}`
  },
  {
    id: 'psplot',
    name: 'psplot - 函数图像',
    description: '测试函数图像命令，包括代数函数、选项参数（linecolor, linewidth, algebraic, opacity）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 二次函数 y = x^2
\\psplot[algebraic,linecolor=blue,linewidth=2pt]{-2}{2}{x*x}

% 正弦函数
\\psplot[algebraic,linecolor=red,linewidth=2pt]{-3}{3}{sin(x)}

% 线性函数
\\psplot[algebraic,linecolor=green,linewidth=2pt]{-2}{2}{x}

% 透明度测试
\\psplot[algebraic,linecolor=purple,opacity=0.5,linewidth=2pt]{-2.5}{2.5}{x*x/2}
\\psplot[algebraic,linecolor=orange,opacity=0.3,linewidth=2pt]{-3}{3}{cos(x)}

% 标签
\\rput(2.5,4){$y = x^2$}
\\rput(3.2,0.5){$y = x$}
\\rput(2.5,-1){$y = \\sin(x)$}
\\end{pspicture}`
  },
  {
    id: 'psaxes',
    name: 'psaxes - 坐标轴',
    description: '测试坐标轴命令，包括基本用法、箭头、刻度、选项参数（Dx, Dy, showorigin）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 基本坐标轴
\\psaxes(0,0)(-3,-3)(3,3)

% 带刻度的坐标轴
\\psaxes[Dx=0.5,Dy=0.5,ticks=all](0,0)(-2,-2)(2,2)

% 不显示原点的坐标轴
\\psaxes[showorigin=false,Dx=1,Dy=1](0,0)(-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'rput',
    name: 'rput - 文本放置',
    description: '测试文本放置命令，包括基本文本、数学公式、不同位置',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 绘制坐标轴
\\psaxes[showorigin=false](0,0)(-2,-2)(2,2)

% 放置文本
\\rput(0,0){原点}
\\rput(2,0.3){$x$}
\\rput(0.3,2){$y$}

% 数学公式
\\rput(1,1){$P(x,y)$}
\\rput(-1.5,1.5){$\\text{点} A$}

% 带样式的文本（通过 pspicture 外的命令）
\\rput(0,-2.5){\\textbf{坐标系统}}
\\end{pspicture}`
  },
  {
    id: 'combined',
    name: '组合示例 - 完整图形',
    description: '测试多个命令组合使用，创建一个完整的图形示例',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false,Dx=1,Dy=1](0,0)(-3,-3)(3,3)

% 绘制函数
\\psplot[algebraic,linecolor=blue,linewidth=2pt]{-2.5}{2.5}{x*x}

% 标记点
\\pscircle[fillcolor=red,fillstyle=solid](0,0){0.1}
\\pscircle[fillcolor=red,fillstyle=solid](1,1){0.1}
\\pscircle[fillcolor=red,fillstyle=solid](-1,1){0.1}

% 连接线
\\psline[linecolor=green,linestyle=dashed]{->}(0,0)(1,1)
\\psline[linecolor=green,linestyle=dashed]{->}(0,0)(-1,1)

% 标签
\\rput(1.3,1.3){$P_1$}
\\rput(-1.3,1.3){$P_2$}
\\rput(2.5,5){$y = x^2$}
\\end{pspicture}`
  },
  {
    id: 'math',
    name: '数学公式',
    description: '测试数学公式渲染，包括行内公式、块级公式、复杂公式',
    code: `数学公式测试：

行内公式：$E = mc^2$ 和 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$

块级公式：
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

复杂公式：
$$\\nabla \\times \\vec{F} = \\begin{pmatrix}
\\frac{\\partial F_z}{\\partial y} - \\frac{\\partial F_y}{\\partial z} \\\\
\\frac{\\partial F_x}{\\partial z} - \\frac{\\partial F_z}{\\partial x} \\\\
\\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y}
\\end{pmatrix}$$

矩阵：
$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix} \\begin{pmatrix}
x \\\\
y
\\end{pmatrix} = \\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}$$`
  },
  {
    id: 'text-formatting',
    name: '文本格式化',
    description: '测试文本格式化命令，包括粗体、斜体、强调、链接等',
    code: `文本格式化测试：

\\textbf{粗体文本}

\\emph{强调文本}

\\textit{斜体文本}

链接：\\href{https://example.com}{示例链接}

混合格式：\\textbf{粗体} 和 \\emph{强调} 可以 \\textit{组合} 使用。`
  },
  {
    id: 'environments',
    name: '环境测试',
    description: '测试不同的 LaTeX 环境，包括 enumerate、verbatim、nicebox',
    code: `环境测试：

\\begin{enumerate}
\\item 第一项
\\item 第二项
  \\begin{enumerate}
  \\item 子项 1
  \\item 子项 2
  \\end{enumerate}
\\item 第三项
\\end{enumerate}

\\begin{verbatim}
function hello() {
  console.log("Hello, World!");
  return true;
}
\\end{verbatim}

\\begin{nicebox}[title=定理]
这是一个重要的定理：

对于任何连续函数 $f$ 在 $[a,b]$ 上：
$$\\int_a^b f(x) dx = F(b) - F(a)$$
其中 $F'(x) = f(x)$。
\\end{nicebox}`
  },
  {
    id: 'userline',
    name: 'userline - 用户线',
    description: '测试用户线命令，包括基本用法、箭头、选项参数（linecolor, linewidth, linestyle, opacity, dash）和点标记',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本用户线
\\userline(0,0)(2,2)

% 红色箭头
\\userline[linecolor=red]{->}(-2,-2)(2,2)

% 双向箭头
\\userline[linecolor=blue,linewidth=2pt]{<->}(-2,0)(2,0)

% 虚线
\\userline[linecolor=green,linestyle=dashed](-2,2)(2,-2)

% 点线
\\userline[linecolor=orange,linestyle=dotted](0,-2)(0,2)

% 自定义虚线样式
\\userline[linecolor=purple,dash=10,5]{->}(-2,-1.5)(2,-1.5)

% 自定义虚线样式（多个值）
\\userline[linecolor=cyan,dash=5,3,2,3](0,-2.5)(0,2.5)

% 透明度测试
\\userline[linecolor=red,opacity=0.5,linewidth=3pt](-1.5,-2)(-1.5,2)
\\userline[linecolor=red,opacity=0.3,linewidth=3pt](-1,-2)(-1,2)
\\userline[linecolor=red,opacity=0.1,linewidth=3pt](-0.5,-2)(-0.5,2)

% 透明度 + 自定义虚线
\\userline[linecolor=blue,opacity=0.6,dash=8,4]{->}(1.5,-2)(1.5,2)

% 带点的线
\\userline[linecolor=purple]{*-*}(-1.5,-1.5)(1.5,1.5)

% 组合测试：透明度 + 虚线 + 箭头
\\userline[linecolor=magenta,opacity=0.7,dash=6,3]{->}(-2.5,0)(2.5,0)
\\end{pspicture}`
  },
  {
    id: 'opacity-comprehensive',
    name: '透明度综合测试',
    description: '全面测试所有命令的透明度支持（opacity 选项）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 不同透明度的圆形
\\pscircle[linecolor=red,opacity=1](0,0){1.5}
\\pscircle[linecolor=red,opacity=0.7](-2,0){1}
\\pscircle[linecolor=red,opacity=0.5](2,0){1}
\\pscircle[linecolor=red,opacity=0.3](0,2){1}
\\pscircle[linecolor=red,opacity=0.1](0,-2){1}

% 不同透明度的矩形
\\psframe[linecolor=blue,opacity=1](-2.5,-2.5)(-1.5,-1.5)
\\psframe[linecolor=blue,opacity=0.7](-1.5,-2.5)(-0.5,-1.5)
\\psframe[linecolor=blue,opacity=0.5](-0.5,-2.5)(0.5,-1.5)
\\psframe[linecolor=blue,opacity=0.3](0.5,-2.5)(1.5,-1.5)
\\psframe[linecolor=blue,opacity=0.1](1.5,-2.5)(2.5,-1.5)

% 不同透明度的线条
\\psline[linecolor=green,opacity=1]{->}(-3,-3)(-2.5,-2.5)
\\psline[linecolor=green,opacity=0.7]{->}(-2.5,-3)(-2,-2.5)
\\psline[linecolor=green,opacity=0.5]{->}(-2,-3)(-1.5,-2.5)
\\psline[linecolor=green,opacity=0.3]{->}(-1.5,-3)(-1,-2.5)
\\psline[linecolor=green,opacity=0.1]{->}(-1,-3)(-0.5,-2.5)

% 填充 + 透明度
\\pscircle[fillcolor=yellow,fillstyle=solid,opacity=0.5](1.5,1.5){0.8}
\\pspolygon[fillcolor=cyan,fillstyle=solid,opacity=0.6](-1.5,1.5)(-0.5,2)(0.5,1.5)(0,0.5)

% 标签
\\rput(-3,3.5){透明度测试：1.0, 0.7, 0.5, 0.3, 0.1}
\\end{pspicture}`
  },
  {
    id: 'dash-comprehensive',
    name: '虚线样式综合测试',
    description: '全面测试所有命令的自定义虚线样式支持（dash 选项）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 不同虚线样式的线条
\\psline[linecolor=red,dash=10,5]{->}(-3,-3)(-2,-2)
\\psline[linecolor=blue,dash=5,3]{->}(-3,-2)(-2,-1)
\\psline[linecolor=green,dash=8,4,2,4]{->}(-3,-1)(-2,0)
\\psline[linecolor=orange,dash=15,5,5,5]{->}(-3,0)(-2,1)
\\psline[linecolor=purple,dash=3,2]{->}(-3,1)(-2,2)

% 不同虚线样式的用户线
\\userline[linecolor=cyan,dash=10,5]{->}(-2,-3)(-1,-2)
\\userline[linecolor=magenta,dash=5,3]{->}(-2,-2)(-1,-1)
\\userline[linecolor=yellow,dash=8,4,2,4]{->}(-2,-1)(-1,0)
\\userline[linecolor=teal,dash=15,5,5,5]{->}(-2,0)(-1,1)
\\userline[linecolor=pink,dash=3,2]{->}(-2,1)(-1,2)

% 虚线 + 透明度
\\psline[linecolor=red,opacity=0.7,dash=10,5]{->}(1,-3)(2,-2)
\\psline[linecolor=blue,opacity=0.5,dash=5,3]{->}(1,-2)(2,-1)
\\userline[linecolor=green,opacity=0.6,dash=8,4]{->}(1,-1)(2,0)

% 标签
\\rput(-3,3.5){虚线样式测试：dash=10,5 | dash=5,3 | dash=8,4,2,4 | dash=15,5,5,5 | dash=3,2}
\\end{pspicture}`
  },
  {
    id: 'psgrid',
    name: 'psgrid - 网格',
    description: '测试网格命令，包括基本用法、选项参数（gridcolor, subgridcolor, subgriddiv）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 基本网格
\\psgrid(-3,-3)(3,3){1}

% 自定义颜色
\\psgrid[gridcolor=blue,subgridcolor=lightblue](-2,-2)(2,2){0.5}

% 自定义子网格分割
\\psgrid[subgriddiv=10,gridcolor=green](-1,-1)(1,1){0.2}

% 与坐标轴结合
\\psaxes[showorigin=false](0,0)(-3.5,-3.5)(3.5,3.5)
\\psgrid[gridcolor=lightgray,subgridcolor=lightblue](0,0)(3,3){0.5}
\\end{pspicture}`
  },
  {
    id: 'psdots',
    name: 'psdots - 点集',
    description: '测试点集命令，包括基本用法、不同点样式（dotstyle）、大小（dotsize）和选项参数',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 基本点集（实心圆）
\\psdots(0,0)(1,1)(2,2)(-1,-1)(-2,-2)

% 自定义样式和大小
\\psdots[dotstyle=*,dotsize=5pt,linecolor=blue](0,2)(1,2)(2,2)

% 空心圆
\\psdots[dotstyle=o,dotsize=4pt,linecolor=red](0,1)(1,1)(2,1)

% 加号
\\psdots[dotstyle=+,dotsize=6pt,linecolor=green](0,0)(1,0)(2,0)

% 叉号
\\psdots[dotstyle=x,dotsize=5pt,linecolor=orange](0,-1)(1,-1)(2,-1)

% 方形
\\psdots[dotstyle=square,dotsize=4pt,fillcolor=purple](0,-2)(1,-2)(2,-2)

% 菱形
\\psdots[dotstyle=diamond,dotsize=4pt,fillcolor=cyan](-2,0)(-2,1)(-2,2)

% 透明度测试
\\psdots[dotstyle=*,dotsize=6pt,opacity=0.5,fillcolor=red](-1,2)(-1,1)(-1,0)
\\end{pspicture}`
  },
  {
    id: 'psellipse',
    name: 'psellipse - 椭圆',
    description: '测试椭圆命令，包括基本用法、选项参数（linecolor, fillcolor, fillstyle, opacity）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 基本椭圆
\\psellipse(0,0)(2,1)

% 带填充
\\psellipse[fillcolor=red,fillstyle=solid](2,0)(1.5,0.8)

% 自定义颜色和宽度
\\psellipse[linecolor=blue,linewidth=3pt](-2,0)(1.5,0.8)

% 透明度测试
\\psellipse[opacity=0.5,fillcolor=green,fillstyle=solid](0,2)(1.5,1)
\\psellipse[opacity=0.7,fillcolor=yellow,fillstyle=solid](0,-2)(1.5,1)

% 圆形（rx=ry）
\\psellipse[linecolor=purple](2,2)(1,1)

% 不同方向的椭圆
\\psellipse[linecolor=cyan](2,-2)(0.8,1.5)
\\psellipse[linecolor=magenta](-2,2)(1.5,0.5)
\\end{pspicture}`
  },
  {
    id: 'psoval',
    name: 'psoval - 圆角矩形',
    description: '测试圆角矩形命令，包括基本用法、linearc 选项和填充',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 基本圆角矩形（默认圆角）
\\psoval(0,0)(2,1.5)

% 自定义圆角半径
\\psoval[linearc=0.5,linecolor=blue](-2,0)(-0.5,1.5)

% 带填充的圆角矩形
\\psoval[fillcolor=red,fillstyle=solid,linearc=0.3](0,-2)(2,-0.5)

% 透明度测试
\\psoval[opacity=0.5,fillcolor=green,fillstyle=solid,linearc=0.4](2,0)(3.5,1.5)

% 不同圆角大小
\\psoval[linearc=0.1,linecolor=purple](-2,-2)(-0.5,-0.5)
\\psoval[linearc=0.8,linecolor=orange](0.5,-2)(2.5,-0.5)
\\end{pspicture}`
  },
  {
    id: 'psdiamond',
    name: 'psdiamond - 菱形',
    description: '测试菱形命令，包括基本用法、填充和透明度',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 基本菱形
\\psdiamond(0,0)(2,1.5)

% 带填充的菱形
\\psdiamond[fillcolor=red,fillstyle=solid](-2,0)(1.5,1)

% 自定义颜色和宽度
\\psdiamond[linecolor=blue,linewidth=3pt](2,0)(1.5,1)

% 透明度测试
\\psdiamond[opacity=0.5,fillcolor=green,fillstyle=solid](0,-2)(2,1.5)
\\psdiamond[opacity=0.7,fillcolor=yellow,fillstyle=solid](0,2)(1.5,1)

% 不同大小的菱形
\\psdiamond[linecolor=cyan](-2,-2)(1,0.8)
\\psdiamond[linecolor=magenta](2,2)(1.5,1.2)
\\end{pspicture}`
  },
  {
    id: 'psvector',
    name: 'psvector - 向量',
    description: '测试向量命令，包括基本用法、箭头类型和选项参数',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 基本向量（默认箭头 ->）
\\psvector(0,0)(2,2)

% 双向箭头
\\psvector{<->}(-2,-2)(-0.5,-0.5)

% 自定义颜色和宽度
\\psvector[linecolor=red,linewidth=3pt](0,-2)(2,0)

% 虚线向量
\\psvector[dash=10,5,linecolor=blue](2,-2)(3.5,-0.5)

% 透明度测试
\\psvector[opacity=0.5,linecolor=green](-2,2)(-0.5,3.5)

% 不同箭头类型
\\psvector{->}(-2,0)(-0.5,1)
\\psvector{<-}(0.5,1)(2,0)
\\psvector{<->}(-2,2)(-0.5,3.5)

% 带点标记的向量
\\psvector{*-*}(2,0)(3.5,1.5)
\\end{pspicture}`
  }
];

// 获取 DOM 元素
const tabsContainer = document.getElementById('tabs') as HTMLDivElement;
const descriptionEl = document.getElementById('test-description') as HTMLDivElement;
const latexInput = document.getElementById('latex-input') as HTMLTextAreaElement;
const preview = document.getElementById('preview') as HTMLDivElement;
const statusBadge = document.getElementById('status-badge') as HTMLSpanElement;

let currentTemplate: TestTemplate | null = null;

// 创建标签页
function createTabs() {
  if (!tabsContainer) return;

  testTemplates.forEach((template, index) => {
    const button = document.createElement('button');
    button.className = `tab-button ${index === 0 ? 'active' : ''}`;
    button.textContent = template.name;
    button.onclick = () => selectTemplate(template);
    tabsContainer.appendChild(button);
  });

  // 默认选择第一个模板
  if (testTemplates.length > 0) {
    selectTemplate(testTemplates[0]);
  }
}

// 选择模板
function selectTemplate(template: TestTemplate) {
  currentTemplate = template;

  // 更新标签页状态
  const buttons = tabsContainer.querySelectorAll('.tab-button');
  buttons.forEach((btn, index) => {
    if (testTemplates[index].id === template.id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 更新描述和代码
  if (descriptionEl) {
    descriptionEl.innerHTML = `<strong>${template.name}</strong>${template.description}`;
  }

  if (latexInput) {
    latexInput.value = template.code;
  }

  // 重置状态
  updateStatus('pending', '待渲染');
  if (preview) {
    preview.innerHTML = '<div class="loading">代码已加载，点击"渲染"按钮查看效果</div>';
  }
}

// 更新状态
function updateStatus(type: 'success' | 'error' | 'pending', text: string) {
  if (!statusBadge) return;
  statusBadge.className = `status-badge status-${type}`;
  statusBadge.textContent = text;
}

// 渲染当前模板
(window as any).renderCurrent = async () => {
  if (!preview || !latexInput) return;

  const latex = latexInput.value.trim();
  if (!latex) {
    preview.innerHTML = '<div class="error">请输入 LaTeX 代码</div>';
    updateStatus('error', '错误');
    return;
  }

  updateStatus('pending', '渲染中...');
  preview.innerHTML = '<div class="loading">正在渲染...</div>';

  try {
    // 清空预览区域
    preview.innerHTML = '';

    // 使用 renderPromise 渲染
    const div = await renderPromise(latex, preview);

    updateStatus('success', '渲染成功');
    console.log('渲染完成:', div);
  } catch (error) {
    console.error('渲染失败:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    preview.innerHTML = `<div class="error">渲染失败: ${errorMsg}</div>`;
    updateStatus('error', '渲染失败');
  }
};

// 清空预览
(window as any).clearPreview = () => {
  if (preview) {
    preview.innerHTML = '<div class="loading">预览已清空</div>';
    updateStatus('pending', '已清空');
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  createTabs();
});
