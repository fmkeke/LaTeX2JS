import { renderPromise } from '../packages/html5/src/index';
import 'virtual:uno.css';

// 组件定义接口
interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  icon: string;
}

// 组件库数据
const components: Component[] = [
  // 基础图形
  {
    id: 'pscircle-basic',
    name: '圆形',
    category: '基础图形',
    description: '基本圆形，可设置边框颜色和填充',
    icon: '⭕',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[linecolor=blue,linewidth=2pt](0,0){1.5}
\\end{pspicture}`
  },
  {
    id: 'pscircle-filled',
    name: '填充圆形',
    category: '基础图形',
    description: '带填充色的圆形',
    icon: '🔵',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[fillcolor=red,fillstyle=solid,linecolor=black](0,0){1.5}
\\end{pspicture}`
  },
  {
    id: 'psframe-basic',
    name: '矩形框',
    category: '基础图形',
    description: '基本矩形框',
    icon: '▭',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psframe[linecolor=blue,linewidth=2pt](-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'psline-basic',
    name: '直线',
    category: '基础图形',
    description: '基本直线',
    icon: '📏',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=red,linewidth=2pt](-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'psline-arrow',
    name: '带箭头直线',
    category: '基础图形',
    description: '带单向箭头的直线',
    icon: '➡️',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=blue,linewidth=2pt]{->}(-1.5,0)(1.5,0)
\\end{pspicture}`
  },
  {
    id: 'psline-double-arrow',
    name: '双向箭头',
    category: '基础图形',
    description: '带双向箭头的直线',
    icon: '↔️',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=green,linewidth=2pt]{<->}(-1.5,0)(1.5,0)
\\end{pspicture}`
  },
  {
    id: 'psline-dashed',
    name: '虚线',
    category: '基础图形',
    description: '虚线样式',
    icon: '┅',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=orange,linestyle=dashed,linewidth=2pt](-1.5,-1.5)(1.5,1.5)
\\end{pspicture}`
  },
  {
    id: 'psline-dotted',
    name: '点线',
    category: '基础图形',
    description: '点线样式',
    icon: '┄',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=purple,linestyle=dotted,linewidth=2pt](-1.5,0)(1.5,0)
\\end{pspicture}`
  },
  {
    id: 'pspolygon-triangle',
    name: '三角形',
    category: '基础图形',
    description: '三角形多边形',
    icon: '△',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\pspolygon[linecolor=red,linewidth=2pt](0,1.5)(-1.5,-1)(1.5,-1)
\\end{pspicture}`
  },
  {
    id: 'pspolygon-filled',
    name: '填充多边形',
    category: '基础图形',
    description: '带填充色的多边形',
    icon: '⬟',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\pspolygon[fillcolor=yellow,fillstyle=solid,linecolor=blue,linewidth=2pt](0,1.5)(-1.5,-1)(1.5,-1)
\\end{pspicture}`
  },
  {
    id: 'psarc-basic',
    name: '圆弧',
    category: '基础图形',
    description: '基本圆弧',
    icon: '◐',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psarc[linecolor=blue,linewidth=2pt](0,0){1.5}{0}{180}
\\end{pspicture}`
  },
  {
    id: 'psarc-arrow',
    name: '带箭头圆弧',
    category: '基础图形',
    description: '带箭头的圆弧',
    icon: '↻',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psarc[linecolor=green,linewidth=2pt]{->}(0,0){1.5}{0}{90}
\\end{pspicture}`
  },
  {
    id: 'psarc-arrow-with-axes',
    name: '带箭头圆弧（含坐标轴）',
    category: '基础图形',
    description: '带箭头的圆弧，显示坐标轴以便检查箭头位置',
    icon: '🎯',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psaxes[linecolor=gray,linewidth=0.5pt,Dx=0.5,Dy=0.5](0,0)(-2,-2)(2,2)
\\psarc[linecolor=green,linewidth=2pt]{->}(0,0){1.5}{0}{90}
\\rput(1.7,0.2){起点(0°)}
\\rput(0.2,1.7){终点(90°)}
\\end{pspicture}`
  },
  
  // 坐标系统
  {
    id: 'psaxes-basic',
    name: '坐标轴',
    category: '坐标系统',
    description: '基本坐标轴',
    icon: '📊',
    code: `\\begin{pspicture}(-3,-3)(3,3)
\\psaxes(0,0)(-2,-2)(2,2)
\\end{pspicture}`
  },
  {
    id: 'psaxes-ticks',
    name: '带刻度坐标轴',
    category: '坐标系统',
    description: '带刻度的坐标轴',
    icon: '📈',
    code: `\\begin{pspicture}(-3,-3)(3,3)
\\psaxes[Dx=0.5,Dy=0.5,ticks=all](0,0)(-2,-2)(2,2)
\\end{pspicture}`
  },
  {
    id: 'psaxes-no-origin',
    name: '无原点坐标轴',
    category: '坐标系统',
    description: '不显示原点的坐标轴',
    icon: '📉',
    code: `\\begin{pspicture}(-3,-3)(3,3)
\\psaxes[showorigin=false](0,0)(-2,-2)(2,2)
\\end{pspicture}`
  },
  
  // 函数图像
  {
    id: 'psplot-quadratic',
    name: '二次函数',
    category: '函数图像',
    description: 'y = x² 二次函数',
    icon: '📐',
    code: `\\begin{pspicture}(-3,-1)(3,4)
\\psaxes[showorigin=false](0,0)(-2,0)(2,3)
\\psplot[algebraic,linecolor=blue,linewidth=2pt]{-1.5}{1.5}{x*x}
\\rput(1.8,2.5){$y = x^2$}
\\end{pspicture}`
  },
  {
    id: 'psplot-linear',
    name: '线性函数',
    category: '函数图像',
    description: 'y = x 线性函数',
    icon: '📏',
    code: `\\begin{pspicture}(-3,-3)(3,3)
\\psaxes[showorigin=false](0,0)(-2,-2)(2,2)
\\psplot[algebraic,linecolor=red,linewidth=2pt]{-1.5}{1.5}{x}
\\rput(2.2,1.5){$y = x$}
\\end{pspicture}`
  },
  {
    id: 'psplot-sine',
    name: '正弦函数',
    category: '函数图像',
    description: 'y = sin(x) 正弦函数',
    icon: '🌊',
    code: `\\begin{pspicture}(-4,-2)(4,2)
\\psaxes[showorigin=false](0,0)(-3,-1.5)(3,1.5)
\\psplot[algebraic,linecolor=green,linewidth=2pt]{-3}{3}{sin(x)}
\\rput(3.2,0.5){$y = \\sin(x)$}
\\end{pspicture}`
  },
  
  // 文本和标签
  {
    id: 'rput-basic',
    name: '文本放置',
    category: '文本和标签',
    description: '在指定位置放置文本',
    icon: '📝',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\psaxes[showorigin=false](0,0)(-1.5,-1.5)(1.5,1.5)
\\rput(0,0){原点}
\\rput(1.2,0.3){$x$}
\\rput(0.3,1.2){$y$}
\\end{pspicture}`
  },
  {
    id: 'rput-math',
    name: '数学标签',
    category: '文本和标签',
    description: '放置数学公式标签',
    icon: '🔢',
    code: `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[linecolor=blue](0,0){1}
\\rput(0,0){$P(x,y)$}
\\rput(1.3,0.3){$r = 1$}
\\end{pspicture}`
  },
  
  // 组合示例
  {
    id: 'combined-graph',
    name: '函数图像组合',
    category: '组合示例',
    description: '坐标轴 + 函数 + 标签',
    icon: '📊',
    code: `\\begin{pspicture}(-3,-1)(3,4)
\\psaxes[showorigin=false,Dx=1,Dy=1](0,0)(-2,0)(2,3)
\\psplot[algebraic,linecolor=blue,linewidth=2pt]{-1.5}{1.5}{x*x}
\\pscircle[fillcolor=red,fillstyle=solid](0,0){0.1}
\\pscircle[fillcolor=red,fillstyle=solid](1,1){0.1}
\\rput(1.3,1.3){$P_1$}
\\rput(1.8,2.5){$y = x^2$}
\\end{pspicture}`
  },
  {
    id: 'combined-geometry',
    name: '几何图形组合',
    category: '组合示例',
    description: '多种图形组合',
    icon: '🎨',
    code: `\\begin{pspicture}(-3,-3)(3,3)
\\psframe[linecolor=gray,linewidth=1pt](-2.5,-2.5)(2.5,2.5)
\\pscircle[linecolor=blue,linewidth=2pt](0,0){2}
\\pspolygon[fillcolor=yellow,fillstyle=solid,linecolor=red](0,1.5)(-1.5,-1)(1.5,-1)
\\psline[linecolor=green]{->}(0,0)(0,1.5)
\\rput(0.3,0.8){$r$}
\\end{pspicture}`
  },
  
  // 数学公式
  {
    id: 'math-inline',
    name: '行内公式',
    category: '数学公式',
    description: '行内数学公式',
    icon: '∑',
    code: `这是一个行内公式：$E = mc^2$ 和 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$`
  },
  {
    id: 'math-block',
    name: '块级公式',
    category: '数学公式',
    description: '块级数学公式',
    icon: '∫',
    code: `块级公式：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

这是著名的高斯积分。`
  },
  {
    id: 'math-matrix',
    name: '矩阵',
    category: '数学公式',
    description: '矩阵公式',
    icon: '⊞',
    code: `矩阵乘法：

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
  }
];

// 获取容器
const container = document.getElementById('components-container') as HTMLDivElement;

if (!container) {
  console.error('错误：找不到 components-container 元素！');
} else {
  console.log('找到容器元素:', container);
}

// 按分类分组
const groupedComponents = components.reduce((acc, component) => {
  if (!acc[component.category]) {
    acc[component.category] = [];
  }
  acc[component.category].push(component);
  return acc;
}, {} as Record<string, Component[]>);

console.log('组件数据:', {
  total: components.length,
  categories: Object.keys(groupedComponents),
  grouped: groupedComponents
});

// 渲染组件卡片
async function renderComponentCard(component: Component): Promise<HTMLDivElement> {
  const card = document.createElement('div');
  card.className = 'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:scale-[1.02]';
  
  // 卡片头部
  const header = document.createElement('div');
  header.className = 'bg-gradient-to-r from-blue-600 to-purple-600 p-4';
  header.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-2xl">${component.icon}</span>
      <div>
        <h3 class="text-lg font-bold text-white">${component.name}</h3>
        <p class="text-xs text-blue-100">${component.category}</p>
      </div>
    </div>
  `;
  
  // 卡片内容
  const content = document.createElement('div');
  content.className = 'p-4';
  
  // 描述
  const description = document.createElement('p');
  description.className = 'text-sm text-gray-600 mb-4';
  description.textContent = component.description;
  
  // 预览区域
  const preview = document.createElement('div');
  preview.className = 'min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white p-4 mb-4 flex items-center justify-center';
  preview.id = `preview-${component.id}`;
  
  // 代码显示
  const codeBlock = document.createElement('div');
  codeBlock.className = 'bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto';
  codeBlock.textContent = component.code;
  
  content.appendChild(description);
  content.appendChild(preview);
  content.appendChild(codeBlock);
  
  card.appendChild(header);
  card.appendChild(content);
  
  // 异步渲染预览
  try {
    // 清空预览区域并显示加载提示
    preview.innerHTML = '<div class="text-gray-400 text-sm text-center py-8">渲染中...</div>';
    console.log(`开始渲染组件: ${component.name}`);
    
    // 先清空预览区域
    preview.innerHTML = '';
    
    // 直接渲染到预览区域
    await renderPromise(component.code, preview);
    
    console.log(`组件 ${component.name} 渲染成功`);
  } catch (error) {
    console.error(`组件 ${component.name} 渲染失败:`, error);
    preview.innerHTML = `
      <div class="text-red-500 text-sm text-center py-4">
        <div class="font-bold mb-1">渲染失败</div>
        <div class="text-xs">${error instanceof Error ? error.message : String(error)}</div>
      </div>
    `;
  }
  
  return card;
}

// 渲染所有组件
async function renderAllComponents() {
  if (!container) {
    console.error('容器元素未找到！');
    return;
  }
  
  console.log('开始渲染组件，共', components.length, '个组件');
  console.log('分类:', Object.keys(groupedComponents));
  
  // 显示加载提示
  container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">正在加载组件...</div>';
  
  try {
    // 按分类渲染
    container.innerHTML = ''; // 清空加载提示
    
    for (const [category, categoryComponents] of Object.entries(groupedComponents)) {
      // 分类标题
      const categoryTitle = document.createElement('div');
      categoryTitle.className = 'col-span-full mt-8 mb-4';
      categoryTitle.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-2">${category}</h2>
        <div class="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
      `;
      container.appendChild(categoryTitle);
      
      // 渲染该分类下的所有组件
      for (const component of categoryComponents) {
        try {
          const card = await renderComponentCard(component);
          container.appendChild(card);
        } catch (error) {
          console.error(`渲染组件 ${component.name} 失败:`, error);
          // 即使渲染失败，也添加一个错误卡片
          const errorCard = document.createElement('div');
          errorCard.className = 'bg-red-50 border border-red-200 rounded-xl p-4';
          errorCard.innerHTML = `
            <h3 class="font-bold text-red-800">${component.name}</h3>
            <p class="text-sm text-red-600">渲染失败: ${error instanceof Error ? error.message : String(error)}</p>
          `;
          container.appendChild(errorCard);
        }
      }
    }
    
    console.log('所有组件渲染完成');
  } catch (error) {
    console.error('渲染过程出错:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="text-red-600 text-lg font-bold mb-2">渲染出错</div>
        <div class="text-gray-600">${error instanceof Error ? error.message : String(error)}</div>
      </div>
    `;
  }
}

// 页面加载完成后渲染
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，开始渲染组件');
    renderAllComponents();
  });
} else {
  // DOM 已经加载完成
  console.log('DOM 已就绪，立即渲染组件');
  renderAllComponents();
}
