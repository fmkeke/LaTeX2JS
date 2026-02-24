import { Y } from '@latex2js/utils';

function arrow(x1: number, y1: number, x2: number, y2: number) {
  var t = Math.PI / 6;
  var d = 8;
  var dx = x2 - x1,
    dy = y2 - y1;
  var l = Math.sqrt(dx * dx + dy * dy);

  var cost = Math.cos(t);
  var sint = Math.sin(t);
  var dl = d / l;

  var x = x2 - (dx * cost - dy * sint) * dl;
  var y = y2 - (dy * cost + dx * sint) * dl;

  var context = [];
  context.push('M');
  context.push(x2);
  context.push(y2);
  context.push('L');
  context.push(x);
  context.push(y);

  cost = Math.cos(-t);
  sint = Math.sin(-t);

  x = x2 - (dx * cost - dy * sint) * dl;
  y = y2 - (dy * cost + dx * sint) * dl;

  context.push(x);
  context.push(y);

  context.push('Z');
  return context.join(' ');
}

const psgraph: any = {
  env: null as any,
  global: null as any,
  getSize(): { width: number; height: number } {
    const padding = 20;
    this.env.scale = 1;
    const goalWidth =
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) -
      padding;
    if (goalWidth <= this.env.w * this.env.xunit) {
      this.env.scale = goalWidth / this.env.w / this.env.xunit;
    }
    const width: number = this.env.w * this.env.xunit;
    const height: number = this.env.h * this.env.yunit;

    return {
      width,
      height
    };
  },

  psframe(svg: any): void {
    const linewidth = this.linewidth || 2;
    const linecolor = this.linecolor || 'black';
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 上边
    svg
      .append('svg:line')
      .attr('x1', this.x1)
      .attr('y1', this.y1)
      .attr('x2', this.x2)
      .attr('y2', this.y1)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', opacity);

    // 右边
    svg
      .append('svg:line')
      .attr('x1', this.x2)
      .attr('y1', this.y1)
      .attr('x2', this.x2)
      .attr('y2', this.y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', opacity);

    // 下边
    svg
      .append('svg:line')
      .attr('x1', this.x2)
      .attr('y1', this.y2)
      .attr('x2', this.x1)
      .attr('y2', this.y2)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', opacity);

    // 左边
    svg
      .append('svg:line')
      .attr('x1', this.x1)
      .attr('y1', this.y2)
      .attr('x2', this.x1)
      .attr('y2', this.y1)
      .style('stroke-width', linewidth)
      .style('stroke', linecolor)
      .style('stroke-opacity', opacity);
  },

  psoval(svg: any): void {
    const linewidth = this.linewidth || 2;
    const linecolor = this.linecolor || 'black';
    const fillcolor = this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black');
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 计算矩形的左上角坐标和宽高
    const x = Math.min(this.x1, this.x2);
    const y = Math.min(this.y1, this.y2);
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);
    
    // 计算圆角半径（linearc 单位是 pt，需要转换为像素）
    // 假设 1pt = 1.333px（标准转换），但这里我们直接使用 linearc 值
    // 如果 linearc 是相对值（如 0.3），则相对于较小的边
    let rx = 0;
    let ry = 0;
    if (this.linearc !== undefined && this.linearc !== null) {
      const linearcValue = parseFloat(String(this.linearc));
      if (linearcValue > 0) {
        // 如果 linearc < 1，认为是相对值（相对于较小边的比例）
        if (linearcValue < 1) {
          const minSide = Math.min(width, height);
          rx = ry = minSide * linearcValue;
        } else {
          // 否则认为是绝对像素值
          rx = ry = linearcValue;
        }
        // 确保圆角半径不超过宽度或高度的一半
        rx = Math.min(rx, width / 2);
        ry = Math.min(ry, height / 2);
      }
    }
    
    svg
      .append('svg:rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', rx)
      .attr('ry', ry)
      .style('stroke', linecolor)
      .style('stroke-width', linewidth)
      .style('fill', fillcolor)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity);
  },

  pscircle: function (svg: any) {
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    svg
      .append('svg:circle')
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('r', this.r)
      .style('stroke', this.linecolor || 'black')
      .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
      .style('stroke-width', this.linewidth || 2)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity);
  },

  psdiamond(svg: any): void {
    const linewidth = this.linewidth || 2;
    const linecolor = this.linecolor || 'black';
    const fillcolor = this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black');
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 计算菱形的四个顶点
    const cx = this.cx;
    const cy = this.cy;
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    const points = [
      [cx, cy - halfHeight],      // 上
      [cx + halfWidth, cy],        // 右
      [cx, cy + halfHeight],       // 下
      [cx - halfWidth, cy]         // 左
    ];
    
    // 使用 polygon 绘制菱形
    svg
      .append('svg:polygon')
      .attr('points', points.map(p => p.join(',')).join(' '))
      .style('stroke', linecolor)
      .style('stroke-width', linewidth)
      .style('fill', fillcolor)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity);
  },

  psvector(svg: any): void {
    // psvector 类似 psline，但默认带箭头
    var linewidth = this.linewidth || 2,
      linecolor = this.linecolor || 'black';
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 处理自定义 dash
    const dashArray = this.dash
      ? this.dash.split(',').map((v: string) => v.trim()).join(',')
      : (this.linestyle === 'dashed' ? '9,5' :
         this.linestyle === 'dotted' ? '2,2' : null);
    
    function drawLine(x1: number, y1: number, x2: number, y2: number) {
      const path = svg
        .append('svg:path')
        .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
        .style('stroke-width', linewidth)
        .style('stroke', linecolor)
        .style('stroke-opacity', opacity);
      
      if (dashArray) {
        path.style('stroke-dasharray', dashArray);
      }
    }
    
    drawLine(this.x1, this.y1, this.x2, this.y2);
    
    // 处理点标记（类似 psline）
    if (this.dots && this.dots.length > 0) {
      if (this.dots[0]) {
        svg
          .append('svg:circle')
          .attr('cx', this.x1)
          .attr('cy', this.y1)
          .attr('r', 3)
          .style('stroke', linecolor)
          .style('fill', linecolor)
          .style('stroke-width', 1)
          .style('stroke-opacity', opacity)
          .style('fill-opacity', opacity);
      }
      if (this.dots[1]) {
        svg
          .append('svg:circle')
          .attr('cx', this.x2)
          .attr('cy', this.y2)
          .attr('r', 3)
          .style('stroke', linecolor)
          .style('fill', linecolor)
          .style('stroke-width', 1)
          .style('stroke-opacity', opacity)
          .style('fill-opacity', opacity);
      }
    }
    
    // 处理箭头（类似 psline）
    var x1 = this.x1,
      y1 = this.y1,
      x2 = this.x2,
      y2 = this.y2;
    
    if (this.arrows && this.arrows.length > 0) {
      if (this.arrows[0]) {
        svg
          .append('path')
          .attr('d', arrow(x2, y2, x1, y1))
          .style('fill', linecolor)
          .style('stroke', linecolor)
          .style('fill-opacity', opacity)
          .style('stroke-opacity', opacity);
      }
      
      if (this.arrows[1]) {
        svg
          .append('path')
          .attr('d', arrow(x1, y1, x2, y2))
          .style('fill', linecolor)
          .style('stroke', linecolor)
          .style('fill-opacity', opacity)
          .style('stroke-opacity', opacity);
      }
    }
  },

  psellipse(svg: any): void {
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    const linecolor = this.linecolor || 'black';
    const linewidth = this.linewidth || 2;
    const fillcolor = this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black');
    
    svg
      .append('svg:ellipse')
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('rx', this.rx)
      .attr('ry', this.ry)
      .style('stroke', linecolor)
      .style('fill', fillcolor)
      .style('stroke-width', linewidth)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity);
  },

  psdots(svg: any): void {
    const dotstyle = this.dotstyle || '*';
    const dotsize = (this.dotsize || 3) * (this.dotscale || 1);
    const linecolor = this.linecolor || 'black';
    const fillcolor = this.fillcolor || 'black';
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
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
            .style('stroke', 'none')
            .style('fill-opacity', opacity);
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
            .style('stroke-width', 1)
            .style('stroke-opacity', opacity);
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
            .style('stroke-width', 1)
            .style('stroke-opacity', opacity);
          svg
            .append('svg:line')
            .attr('x1', point.x)
            .attr('y1', point.y - plusSize)
            .attr('x2', point.x)
            .attr('y2', point.y + plusSize)
            .style('stroke', linecolor)
            .style('stroke-width', 1)
            .style('stroke-opacity', opacity);
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
            .style('stroke-width', 1)
            .style('stroke-opacity', opacity);
          svg
            .append('svg:line')
            .attr('x1', point.x - xSize)
            .attr('y1', point.y + xSize)
            .attr('x2', point.x + xSize)
            .attr('y2', point.y - xSize)
            .style('stroke', linecolor)
            .style('stroke-width', 1)
            .style('stroke-opacity', opacity);
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
            .style('stroke', 'none')
            .style('fill-opacity', opacity);
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
            .style('stroke', 'none')
            .style('fill-opacity', opacity);
          break;
          
        default:
          // 默认实心圆
          svg
            .append('svg:circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', dotsize)
            .style('fill', fillcolor)
            .style('stroke', 'none')
            .style('fill-opacity', opacity);
      }
    });
  },

  psplot(svg: any): void {
    var context = [];
    context.push('M');
    if (this.fillstyle === 'solid') {
      context.push(this.data[0]);
      context.push(Y.call(this.global, 0));
    } else {
      context.push(this.data[0]);
      context.push(this.data[1]);
    }
    context.push('L');

    this.data.forEach((data: any) => {
      context.push(data);
    });

    if (this.fillstyle === 'solid') {
      context.push(this.data[this.data.length - 2]);
      context.push(Y.call(this.global, 0));
      context.push('Z');
    }

    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    svg
      .append('svg:path')
      .attr('d', context.join(' '))
      .attr('class', 'psplot')
      .style('stroke-width', this.linewidth || 2)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity)
      .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
      .style('stroke', this.linecolor || 'black');
  },

  pspolygon(svg: any): void {
    var context = [];
    context.push('M');
    context.push(this.data[0]);
    context.push(this.data[1]);
    context.push('L');

    this.data.forEach((data: any) => {
      context.push(data);
    });
    context.push('Z');

    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    svg
      .append('svg:path')
      .attr('d', context.join(' '))
      .style('stroke-width', this.linewidth || 2)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity)
      .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
      .style('stroke', this.linecolor || 'black');
  },

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
    context.push(0);      // sweep-flag (0 for counterclockwise, PSTricks default)
    context.push(this.B.x);
    context.push(this.B.y);

    const linecolor = this.linecolor || 'black';
    const linewidth = this.linewidth || 2;
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;

    svg
      .append('svg:path')
      .attr('d', context.join(' '))
      .style('stroke-width', linewidth)
      .style('stroke-opacity', opacity)
      .style('fill-opacity', opacity)
      .style('fill', this.fillstyle === 'none' ? 'none' : (this.fillcolor || 'black'))
      .style('stroke', linecolor);

    // 渲染箭头
    if (this.arrows && this.arrows.length >= 2) {
      // arrows[0] 表示起点箭头，arrows[1] 表示终点箭头
      // 计算圆弧的圆心（cx, cy）和半径 r
      const cx = this.cx || 0;
      const cy = this.cy || 0;
      const r = this.r || 1;
      
      if (this.arrows[1]) {
        // 终点箭头：在 B 点绘制箭头，方向沿着圆弧的切线方向
        // 计算 B 点相对于圆心的角度
        const angleB = Math.atan2(this.B.y - cy, this.B.x - cx);
        // 对于逆时针圆弧（sweep-flag=0），切线方向垂直于半径方向
        // 在数学坐标系中，逆时针圆弧的切线方向是 angle + π/2
        // 但由于 Y 函数已经反转了 y 轴，在 SVG 坐标系中需要调整
        // 对于逆时针圆弧，切线方向应该是 angle + π/2（指向圆弧继续的方向）
        const tangentAngle = angleB + Math.PI / 2;
        const arrowLength = 20;
        
        // arrow(x1, y1, x2, y2) 中 x2, y2 是箭头尖端位置，箭头从 x2,y2 指向 x1,y1
        // 所以箭头尖端应该在 B 点，方向参考点在切线方向向前（沿着圆弧方向）
        const arrowX1 = this.B.x + Math.cos(tangentAngle) * arrowLength;
        const arrowY1 = this.B.y + Math.sin(tangentAngle) * arrowLength;
        const arrowX2 = this.B.x;  // 箭头尖端在 B 点
        const arrowY2 = this.B.y;
        
        svg
          .append('path')
          .attr('d', arrow(arrowX1, arrowY1, arrowX2, arrowY2))
          .style('fill', linecolor)
          .style('stroke', linecolor)
          .style('fill-opacity', opacity)
          .style('stroke-opacity', opacity);
      }
      
      if (this.arrows[0]) {
        // 起点箭头：在 A 点绘制箭头，方向沿着圆弧的切线方向（反向）
        const angleA = Math.atan2(this.A.y - cy, this.A.x - cx);
        const tangentAngle = angleA + Math.PI / 2;
        const arrowLength = 20;
        
        // arrow(x1, y1, x2, y2) 中 x2, y2 是箭头尖端位置，箭头从 x2,y2 指向 x1,y1
        // 所以箭头尖端应该在 A 点，方向参考点在切线方向向后（与圆弧方向相反）
        const arrowX1 = this.A.x - Math.cos(tangentAngle) * arrowLength;
        const arrowY1 = this.A.y - Math.sin(tangentAngle) * arrowLength;
        const arrowX2 = this.A.x;  // 箭头尖端在 A 点
        const arrowY2 = this.A.y;
        
        svg
          .append('path')
          .attr('d', arrow(arrowX1, arrowY1, arrowX2, arrowY2))
          .style('fill', linecolor)
          .style('stroke', linecolor)
          .style('fill-opacity', opacity)
          .style('stroke-opacity', opacity);
      }
    }
  },

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
    
    // 获取全局上下文以访问 xunit 和 yunit
    const global = this.global;
    if (!global) {
      console.warn('psgrid: global context not available');
      return;
    }
    
    // 计算主网格步长（像素）
    const gridStepX = gridsize * global.xunit;
    const gridStepY = gridsize * global.yunit;
    
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

  psaxes(svg: any): void {
    var xaxis = [this.bottomLeft[0], this.topRight[0]];
    var yaxis = [this.bottomLeft[1], this.topRight[1]];

    var origin = this.origin;

    function line(x1: number, y1: number, x2: number, y2: number) {
      svg
        .append('svg:path')
        .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
        .style('stroke-width', 2)
        .style('stroke', 'rgb(0,0,0)')
        .style('stroke-opacity', 1);
    }

    var xticks = () => {
      for (var x = xaxis[0]; x <= xaxis[1]; x += this.dx) {
        // 如果 showorigin=false 且 x 在原点附近，跳过原点处的刻度
        if (this.showorigin === false && Math.abs(x - origin[0]) < 0.01) {
          continue;
        }
        line(x, origin[1] - 5, x, origin[1] + 5);
      }
    };

    var yticks = () => {
      for (var y = yaxis[0]; y <= yaxis[1]; y += this.dy) {
        // 如果 showorigin=false 且 y 在原点附近，跳过原点处的刻度
        if (this.showorigin === false && Math.abs(y - origin[1]) < 0.01) {
          continue;
        }
        line(origin[0] - 5, y, origin[0] + 5, y);
      }
    };

    line(xaxis[0], origin[1], xaxis[1], origin[1]);
    line(origin[0], yaxis[0], origin[0], yaxis[1]);

    if (this.ticks && this.ticks.match(/all/)) {
      xticks();
      yticks();
    } else if (this.ticks && this.ticks.match(/x/)) {
      xticks();
    } else if (this.ticks && this.ticks.match(/y/)) {
      yticks();
    }

    if (this.arrows[0]) {
      svg
        .append('path')
        .attr('d', arrow(xaxis[1], origin[1], xaxis[0], origin[1]))
        .style('fill', 'black')
        .style('stroke', 'black');

      svg
        .append('path')
        .attr('d', arrow(origin[0], yaxis[1], origin[0], yaxis[0]))
        .style('fill', 'black')
        .style('stroke', 'black');
    }

    if (this.arrows[1]) {
      svg
        .append('path')
        .attr('d', arrow(xaxis[0], origin[1], xaxis[1], origin[1]))
        .style('fill', 'black')
        .style('stroke', 'black');

      svg
        .append('path')
        .attr('d', arrow(origin[0], yaxis[0], origin[0], yaxis[1]))
        .style('fill', 'black')
        .style('stroke', 'black');
    }
  },

  psline(svg: any): void {
    var linewidth = this.linewidth || 2,
      linecolor = this.linecolor || 'black';
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 处理自定义 dash
    const dashArray = this.dash 
      ? this.dash.split(',').map((v: string) => v.trim()).join(',')
      : (this.linestyle === 'dashed' ? '9,5' : 
         this.linestyle === 'dotted' ? '2,2' : null);

    function drawLine(x1: number, y1: number, x2: number, y2: number) {
      const path = svg
        .append('svg:path')
        .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
        .style('stroke-width', linewidth)
        .style('stroke', linecolor)
        .style('stroke-opacity', opacity);
      
      if (dashArray) {
        path.style('stroke-dasharray', dashArray);
      }
    }

    drawLine(this.x1, this.y1, this.x2, this.y2);

    if (this.dots[0]) {
      svg
        .append('svg:circle')
        .attr('cx', this.x1)
        .attr('cy', this.y1)
        .attr('r', 3)
        .style('stroke', linecolor)
        .style('fill', linecolor)
        .style('stroke-width', 1)
        .style('stroke-opacity', opacity)
        .style('fill-opacity', opacity);
    }

    if (this.dots[1]) {
      svg
        .append('svg:circle')
        .attr('cx', this.x2)
        .attr('cy', this.y2)
        .attr('r', 3)
        .style('stroke', linecolor)
        .style('fill', linecolor)
        .style('stroke-width', 1)
        .style('stroke-opacity', opacity)
        .style('fill-opacity', opacity);
    }

    var x1 = this.x1,
      y1 = this.y1,
      x2 = this.x2,
      y2 = this.y2;

    if (this.arrows[0]) {
      svg
        .append('path')
        .attr('d', arrow(x2, y2, x1, y1))
        .style('fill', linecolor)
        .style('stroke', linecolor)
        .style('fill-opacity', opacity)
        .style('stroke-opacity', opacity);
    }

    if (this.arrows[1]) {
      svg
        .append('path')
        .attr('d', arrow(x1, y1, x2, y2))
        .style('fill', linecolor)
        .style('stroke', linecolor)
        .style('fill-opacity', opacity)
        .style('stroke-opacity', opacity);
    }
  },

  userline(svg: any): void {
    var linewidth = this.linewidth,
      linecolor = this.linecolor;
    const opacity = this.opacity ? Math.max(0, Math.min(1, parseFloat(this.opacity))) : 1;
    
    // 处理自定义 dash
    const dashArray = this.dash 
      ? this.dash.split(',').map((v: string) => v.trim()).join(',')
      : (this.linestyle === 'dashed' ? '9,5' : 
         this.linestyle === 'dotted' ? '2,2' : null);

    function drawLine(x1: number, y1: number, x2: number, y2: number) {
      const path = svg
        .append('svg:path')
        .attr('class', 'userline')
        .attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2)
        .style('stroke-width', linewidth)
        .style('stroke', linecolor)
        .style('stroke-opacity', opacity);
      
      if (dashArray) {
        path.style('stroke-dasharray', dashArray);
      }
    }

    drawLine(this.x1, this.y1, this.x2, this.y2);

    if (this.dots[0]) {
      svg
        .append('svg:circle')
        .attr('cx', this.x1)
        .attr('cy', this.y1)
        .attr('r', 3)
        .attr('class', 'userline')
        .style('stroke', this.linecolor)
        .style('fill', this.linecolor)
        .style('stroke-width', 1)
        .style('stroke-opacity', opacity)
        .style('fill-opacity', opacity);
    }

    if (this.dots[1]) {
      svg
        .append('svg:circle')
        .attr('cx', this.x2)
        .attr('cy', this.y2)
        .attr('r', 3)
        .attr('class', 'userline')
        .style('stroke', this.linecolor)
        .style('fill', this.linecolor)
        .style('stroke-width', 1)
        .style('stroke-opacity', opacity)
        .style('fill-opacity', opacity);
    }

    var x1 = this.x1,
      y1 = this.y1,
      x2 = this.x2,
      y2 = this.y2;

    if (this.arrows[0]) {
      svg
        .append('path')
        .attr('d', arrow(x2, y2, x1, y1))
        .attr('class', 'userline')
        .style('fill', this.linecolor)
        .style('stroke', this.linecolor)
        .style('fill-opacity', opacity)
        .style('stroke-opacity', opacity);
    }

    if (this.arrows[1]) {
      svg
        .append('path')
        .attr('d', arrow(x1, y1, x2, y2))
        .attr('class', 'userline')
        .style('fill', this.linecolor)
        .style('stroke', this.linecolor)
        .style('fill-opacity', opacity)
        .style('stroke-opacity', opacity);
    }
  },

  rput(el: any): void {
    // Import debug utilities
    const startTime = Date.now();
    
    // Validate coordinates
    const x = this.x;
    const y = this.y;
    
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      console.warn('RPUT: Invalid coordinates detected', { x, y, text: this.text });
      return;
    }

    // Validate parent container
    if (!el || !el.appendChild) {
      console.warn('RPUT: Invalid parent container provided');
      return;
    }

    // Validate content
    if (!this.text || typeof this.text !== 'string') {
      console.warn('RPUT: Invalid text content', { text: this.text });
      return;
    }

    const div = document.createElement('div');
    
    // Set up element with improved styling for better measurement
    div.className = 'math';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'nowrap'; // Prevent text wrapping during measurement
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    div.style.pointerEvents = 'none'; // Prevent interference during positioning
    
    // Add data attributes for debugging
    div.setAttribute('data-rput-x', x.toString());
    div.setAttribute('data-rput-y', y.toString());
    div.setAttribute('data-rput-text', this.text);

    // Enhanced positioning function with better measurement
    const positionElement = () => {
      return new Promise<void>((resolve) => {
        // Use requestAnimationFrame to ensure DOM has been updated
        requestAnimationFrame(() => {
          try {
            // Get accurate bounding box
            const rect = div.getBoundingClientRect();
            
            // Validate measurements
            if (rect.width === 0 || rect.height === 0) {
              console.warn('RPUT: Element has zero dimensions, retrying...', { 
                text: this.text, 
                rect: { width: rect.width, height: rect.height } 
              });
              
              // Retry measurement after a short delay
              setTimeout(() => {
                const retryRect = div.getBoundingClientRect();
                const w = retryRect.width / 2;
                const h = retryRect.height / 2;
                
                // Apply centering with fallback for zero dimensions
                div.style.top = `${y - (h || 10)}px`;
                div.style.left = `${x - (w || 20)}px`;
                div.style.visibility = 'visible';
                div.style.pointerEvents = 'auto';
                resolve();
              }, 10);
              return;
            }

            // Calculate center offsets
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Apply precise centering
            div.style.top = `${y - centerY}px`;
            div.style.left = `${x - centerX}px`;
            div.style.visibility = 'visible';
            div.style.pointerEvents = 'auto';
            
            resolve();
          } catch (error) {
            console.error('RPUT: Error during positioning', error);
            // Fallback positioning
            div.style.top = `${y}px`;
            div.style.left = `${x}px`;
            div.style.visibility = 'visible';
            div.style.pointerEvents = 'auto';
            resolve();
          }
        });
      });
    };

    // Enhanced MathJax processing with better async handling
    const processContent = async () => {
      const mathJax = (window as any).MathJax;
      
      if (mathJax && mathJax.typesetPromise) {
        try {
          // Set content before MathJax processing
          div.innerHTML = this.text;
          
          // Process with MathJax
          await mathJax.typesetPromise([div]);
          
          // Wait for MathJax to complete rendering
          await new Promise(resolve => setTimeout(resolve, 0));
          
          // Position element after MathJax is complete
          await positionElement();
          
        } catch (error) {
          console.error('MathJax typesetting failed:', error);
          // Fallback to plain HTML
          div.innerHTML = this.text;
          await positionElement();
        }
      } else {
        // No MathJax available, use plain HTML
        div.innerHTML = this.text;
        await positionElement();
      }
    };

    // Ensure parent is ready before appending
    if (el.isConnected === false) {
      console.warn('RPUT: Parent container not connected to DOM');
    }
    
    // Append to DOM
    el.appendChild(div);
    
    // Process content asynchronously
    processContent().catch((error) => {
      console.error('RPUT: Failed to process content', error);
      // Emergency fallback
      div.style.visibility = 'visible';
      div.style.pointerEvents = 'auto';
    });
  },

  pspicture(svg: any): void {
    var env = this.env;
    var el = this.$el;

    Object.keys(this.plot).forEach((key) => {
      const plot = this.plot[key];
      if (key.match(/rput/)) return;
      if (psgraph.hasOwnProperty(key)) {
        plot.forEach((data: any) => {
          data.data.global = env;
          psgraph[key].call(data.data, svg);
        });
      }
    });

    svg.on(
      'touchmove',
      function (this: any, event: any) {
        event.preventDefault();
        var touch = event.touches ? event.touches[0] : null;
        var rect = event.target.getBoundingClientRect();
        var touchcoords = touch ? [touch.clientX - rect.left, touch.clientY - rect.top] : [0, 0];
        userEvent(touchcoords);
      }
    );

    svg.on(
      'mousemove',
      function (this: any, event: any) {
        var coords = [event.offsetX || 0, event.offsetY || 0];
        userEvent(coords);
      }
    );

    const plots = this.plot;
    function userEvent(coords: any): void {
      svg.selectAll('.userline').remove();
      svg.selectAll('.psplot').remove();
      var currentEnvironment: { [key: string]: any } = {};

      Object.entries(plots || {})
        .forEach(([k, plot]: [string, any]) => {
          if (k.match(/uservariable/)) {
            plot.forEach((data: any) => {
              data.env.userx = coords[0];
              data.env.usery = coords[1];
              var dd = data.fn.call(data.env, data.match);
              currentEnvironment[data.data.name] = dd.value;
            });
          }
        });

      Object.entries(plots || {})
        .forEach(([k, plot]: [string, any]) => {
          if (k.match(/psplot/)) {
            plot.forEach((data: any) => {
              Object.entries(currentEnvironment || {})
                .forEach(([name, variable]: [string, any]) => {
                  data.env.variables[name] = variable;
                });
              var d = data.fn.call(data.env, data.match);
              d.global = {};
              Object.assign(d.global, env);
              psgraph[k].call(d, svg);
            });
          }
          if (k.match(/userline/)) {
            plot.forEach((data: any) => {
              var d = data.fn.call(data.env, data.match);
              data.env.x2 = coords[0];
              data.env.y2 = coords[1];
              data.data.x2 = data.env.x2;
              data.data.y2 = data.env.y2;

              if (data.data.xExp2) {
                data.data.x2 = d.userx2(coords);
                data.data.x1 = d.userx(coords);
              } else if (data.data.xExp) {
                data.data.x2 = d.userx(coords);
              }

              if (data.data.yExp2) {
                data.data.y2 = d.usery2(coords);
                data.data.y1 = d.usery(coords);
              } else if (data.data.yExp) {
                data.data.y2 = d.usery(coords);
              }

              d.global = {};
              Object.assign(d.global, env);
              Object.assign(d, data.data);
              psgraph[k].call(d, svg);
            });
          }
        });
    }

    // Enhanced cleanup and RPUT processing
    psgraph.processRputElements.call(this, el);
  },

  processRputElements(el: any): void {
    // Validate container
    if (!el || typeof el.querySelectorAll !== 'function') {
      console.warn('RPUT: Invalid container for RPUT processing');
      return;
    }

    // Validate RPUT data
    if (!this.plot || !Array.isArray(this.plot.rput)) {
      console.warn('RPUT: No RPUT data to process');
      return;
    }

    // Enhanced cleanup with better error handling
    try {
      // Remove existing RPUT elements
      const existingElements = el.querySelectorAll('.math[data-rput-x]');
      let cleanupCount = 0;
      
      existingElements.forEach((element: HTMLElement) => {
        try {
          // Clean up any pending async operations
          element.style.visibility = 'hidden';
          element.remove();
          cleanupCount++;
        } catch (error) {
          console.warn('RPUT: Error removing existing element', error);
        }
      });

      if (cleanupCount > 0) {
        console.log(`RPUT: Cleaned up ${cleanupCount} existing elements`);
      }

      // Wait for DOM to settle after cleanup
      requestAnimationFrame(() => {
        psgraph.renderRputElements.call(this, el);
      });

    } catch (error) {
      console.error('RPUT: Error during cleanup', error);
      // Fallback to immediate rendering
      psgraph.renderRputElements.call(this, el);
    }
  },

  renderRputElements(el: any): void {
    if (!this.plot?.rput || this.plot.rput.length === 0) {
      return;
    }

    // Track rendering for debugging
    console.log(`RPUT: Rendering ${this.plot.rput.length} elements`);
    
    // Process RPUT elements with better error isolation
    const renderPromises: Promise<void>[] = [];
    
    this.plot.rput.forEach((rput: any, index: number) => {
      try {
        // Validate RPUT data
        if (!rput || !rput.data) {
          console.warn(`RPUT: Invalid RPUT data at index ${index}`, rput);
          return;
        }

        // Add global context
        rput.data.global = this.env;
        
        // Create a promise for this RPUT element
        const renderPromise = new Promise<void>((resolve) => {
          try {
            // Use setTimeout to prevent blocking the main thread
            setTimeout(() => {
              psgraph.rput.call(rput.data, el);
              resolve();
            }, index * 10); // Stagger rendering slightly
          } catch (error) {
            console.error(`RPUT: Error rendering element ${index}`, error);
            resolve();
          }
        });
        
        renderPromises.push(renderPromise);
        
      } catch (error) {
        console.error(`RPUT: Error processing element ${index}`, error);
      }
    });

    // Wait for all RPUT elements to be processed
    Promise.all(renderPromises)
      .then(() => {
        console.log('RPUT: All elements rendered successfully');
      })
      .catch((error) => {
        console.error('RPUT: Error in batch rendering', error);
      });
  }
};

export { arrow };
export default psgraph;
