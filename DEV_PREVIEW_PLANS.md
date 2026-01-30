# 实时预览组件方案

## 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **方案1: Vite 开发服务器** | ✅ 快速启动<br>✅ HMR 热更新<br>✅ 无需配置 | ❌ 需要安装 Vite | 推荐，开发体验最好 |
| **方案2: 简单 HTTP 服务器** | ✅ 零依赖<br>✅ 简单直接 | ❌ 需要手动刷新<br>❌ 无热更新 | 快速预览，不需要热更新 |
| **方案3: 开发预览页面** | ✅ 集成到项目<br>✅ 可切换组件 | ❌ 需要手动刷新 | 组件对比测试 |
| **方案4: Storybook** | ✅ 专业组件文档<br>✅ 交互式调试 | ❌ 配置复杂<br>❌ 体积大 | 长期维护的组件库 |

---

## 方案1: Vite 开发服务器（推荐）⭐

### 特点
- ⚡ 极速启动，秒开
- 🔥 热模块替换（HMR），修改代码自动刷新
- 📦 自动处理 TypeScript 和模块解析
- 🎯 零配置，开箱即用

### 实现步骤

1. **安装 Vite**
```bash
pnpm add -D -w vite
```

2. **创建开发预览页面**
创建 `dev/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>LaTeX2JS Component Preview</title>
  <link rel="stylesheet" href="../bundle/latex2js.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./preview.ts"></script>
</body>
</html>
```

3. **创建预览脚本**
创建 `dev/preview.ts`:
```typescript
import { renderPromise } from '../packages/html5/src/index';

const components = {
  math: '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$',
  pspicture: `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle(0,0){1.5}
\\rput(0,0){Circle}
\\end{pspicture}`,
  // ... 其他组件
};

// 渲染当前组件
async function renderComponent(name: string, content: string) {
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = '';
    await renderPromise(content, container);
  }
}

// 组件选择器
const select = document.createElement('select');
Object.keys(components).forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  select.appendChild(option);
});

select.addEventListener('change', (e) => {
  const name = (e.target as HTMLSelectElement).value;
  renderComponent(name, components[name]);
});

document.body.insertBefore(select, document.getElementById('app'));
renderComponent('math', components.math);
```

4. **创建 Vite 配置**
创建 `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'dev',
  resolve: {
    alias: {
      'latex2js': path.resolve(__dirname, 'packages/latex2js/src'),
      'mathjaxjs': path.resolve(__dirname, 'packages/mathjaxjs/src'),
      '@latex2js/pstricks': path.resolve(__dirname, 'packages/pstricks/src'),
      '@latex2js/utils': path.resolve(__dirname, 'packages/utils/src'),
      '@latex2js/macros': path.resolve(__dirname, 'packages/macros/src'),
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

5. **添加脚本到 package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

6. **运行**
```bash
pnpm dev
```

---

## 方案2: 简单 HTTP 服务器 + 文件监听

### 特点
- 🚀 零额外依赖（使用 Node.js 内置）
- 📝 简单直接
- 🔄 需要手动刷新浏览器

### 实现步骤

1. **创建开发服务器脚本**
创建 `dev/server.js`:
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './dev/index.html';
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

2. **添加脚本**
```json
{
  "scripts": {
    "dev:simple": "node dev/server.js"
  }
}
```

---

## 方案3: 开发预览页面（集成到项目）

### 特点
- 📦 集成到现有项目结构
- 🎨 可以对比多个组件
- 🔄 需要手动刷新

### 实现步骤

1. **创建开发预览页面**
创建 `dev/components-preview.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Component Preview</title>
  <link rel="stylesheet" href="../bundle/latex2js.css">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .component-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
    .component-title { font-weight: bold; margin-bottom: 10px; }
    textarea { width: 100%; height: 100px; font-family: monospace; }
    button { margin: 10px 5px; padding: 5px 15px; }
  </style>
</head>
<body>
  <h1>LaTeX2JS Component Preview</h1>
  
  <div class="component-section">
    <div class="component-title">Math Component</div>
    <textarea id="math-input">$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$</textarea>
    <button onclick="renderMath()">Render</button>
    <div id="math-output"></div>
  </div>
  
  <div class="component-section">
    <div class="component-title">PSTricks Picture</div>
    <textarea id="pspicture-input">\begin{pspicture}(-2,-2)(2,2)
\pscircle(0,0){1.5}
\rput(0,0){Circle}
\end{pspicture}</textarea>
    <button onclick="renderPspicture()">Render</button>
    <div id="pspicture-output"></div>
  </div>
  
  <!-- 加载打包后的 bundle -->
  <script src="../bundle/latex2html5.bundle.js"></script>
  <script>
    function renderMath() {
      const input = document.getElementById('math-input').value;
      const output = document.getElementById('math-output');
      output.innerHTML = '';
      LaTeX2HTML5.render(input, (div) => {
        output.appendChild(div);
      });
    }
    
    function renderPspicture() {
      const input = document.getElementById('pspicture-input').value;
      const output = document.getElementById('pspicture-output');
      output.innerHTML = '';
      LaTeX2HTML5.render(input, (div) => {
        output.appendChild(div);
      });
    }
    
    // 初始渲染
    renderMath();
    renderPspicture();
  </script>
</body>
</html>
```

2. **使用方式**
```bash
# 先构建
pnpm build

# 然后用浏览器打开
# file:///path/to/dev/components-preview.html
# 或使用简单服务器
python -m http.server 8000
```

---

## 方案4: Storybook（专业方案）

### 特点
- 📚 专业的组件文档工具
- 🎨 交互式组件浏览器
- 🔍 支持 Props 调试
- ⚙️ 配置较复杂

### 实现步骤

1. **安装 Storybook**
```bash
pnpm dlx storybook@latest init
```

2. **配置 Storybook**
创建 `.storybook/main.js`:
```javascript
module.exports = {
  stories: ['../dev/stories/**/*.stories.@(js|ts)'],
  // ... 其他配置
};
```

3. **创建 Story**
创建 `dev/stories/Math.stories.ts`:
```typescript
import type { Meta, StoryObj } from '@storybook/html';
import { renderPromise } from '../../packages/html5/src/index';

const meta: Meta = {
  title: 'Components/Math',
};

export default meta;
type Story = StoryObj;

export const QuadraticFormula: Story = {
  render: async () => {
    const div = document.createElement('div');
    await renderPromise('$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', div);
    return div;
  },
};
```

---

## 推荐方案

**推荐使用方案1（Vite）**，因为：
1. ✅ 开发体验最好，支持热更新
2. ✅ 配置简单，开箱即用
3. ✅ 性能优秀，启动快速
4. ✅ 支持 TypeScript 和模块解析
5. ✅ 可以实时看到代码修改效果

**如果不想添加新依赖**，可以使用方案2或方案3。
