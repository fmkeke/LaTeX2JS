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
    description: '测试矩形框命令，包括基本用法和选项参数（linecolor, linewidth）',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本矩形框
\\psframe(-2,-2)(2,2)

% 带选项的矩形框
\\psframe[linecolor=red,linewidth=3pt](-1.5,-1.5)(1.5,1.5)

% 蓝色边框
\\psframe[linecolor=blue,linewidth=2pt](-0.5,-0.5)(0.5,0.5)
\\end{pspicture}`
  },
  {
    id: 'pscircle',
    name: 'pscircle - 圆形',
    description: '测试圆形命令，包括基本用法、选项参数（linecolor, fillcolor, fillstyle）和不同半径',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 基本圆形
\\pscircle(0,0){1}

% 蓝色边框圆形
\\pscircle[linecolor=blue](2,0){1}

% 红色填充圆形
\\pscircle[fillcolor=red,fillstyle=solid](-2,0){1}

% 绿色边框+黄色填充
\\pscircle[linecolor=green,fillcolor=yellow,fillstyle=solid,linewidth=3pt](0,2){1}

% 大圆
\\pscircle[linecolor=purple,linewidth=2pt](0,-2){1.5}
\\end{pspicture}`
  },
  {
    id: 'psline',
    name: 'psline - 直线',
    description: '测试直线命令，包括基本用法、箭头、选项参数（linecolor, linewidth, linestyle）和点标记',
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

% 带点的线
\\psline[linecolor=purple]{*-*}(-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'pspolygon',
    name: 'pspolygon - 多边形',
    description: '测试多边形命令，包括三角形、四边形等，以及选项参数（linecolor, fillcolor, fillstyle）',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 三角形
\\pspolygon[linecolor=red](0,2)(-1.5,-1)(1.5,-1)

% 填充三角形
\\pspolygon[fillcolor=blue,fillstyle=solid,linecolor=black](-2,-2)(-2,0)(0,-2)

% 四边形
\\pspolygon[linecolor=green,linewidth=2pt](1,-1)(2,0)(1,1)(0,0)

% 五边形
\\pspolygon[fillcolor=yellow,fillstyle=solid,linecolor=purple](-1,1)(-0.3,1.5)(0.5,1.2)(0.3,0.5)(-0.5,0.5)
\\end{pspicture}`
  },
  {
    id: 'psarc',
    name: 'psarc - 圆弧',
    description: '测试圆弧命令，包括基本用法、箭头、选项参数（linecolor, linewidth）和不同角度',
    code: `\\begin{pspicture}(-3,-3)(3,3)
% 基本圆弧（0-90度）
\\psarc[linecolor=red](0,0){1.5}{0}{90}

% 带箭头的圆弧
\\psarc[linecolor=blue,linewidth=2pt]{->}(0,0){1.5}{90}{180}

% 半圆
\\psarc[linecolor=green](0,0){1.5}{180}{360}

% 小角度圆弧
\\psarc[linecolor=orange,linewidth=3pt]{->}(0,0){2}{45}{135}

% 完整圆（通过两个半圆）
\\psarc[linecolor=purple](0,0){1}{0}{180}
\\psarc[linecolor=purple](0,0){1}{180}{360}
\\end{pspicture}`
  },
  {
    id: 'psplot',
    name: 'psplot - 函数图像',
    description: '测试函数图像命令，包括代数函数、选项参数（linecolor, linewidth, algebraic）',
    code: `\\begin{pspicture}(-4,-4)(4,4)
% 坐标轴
\\psaxes[showorigin=false](0,0)(-3,-3)(3,3)

% 二次函数 y = x^2
\\psplot[algebraic,linecolor=blue,linewidth=2pt]{-2}{2}{x*x}

% 正弦函数
\\psplot[algebraic,linecolor=red,linewidth=2pt]{-3}{3}{sin(x)}

% 线性函数
\\psplot[algebraic,linecolor=green,linewidth=2pt]{-2}{2}{x}

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
