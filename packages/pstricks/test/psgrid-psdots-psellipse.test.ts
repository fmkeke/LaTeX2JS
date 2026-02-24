import LaTeX2JS from '../../latex2js/src';
import { getElementData, findPSTricksElement } from './test-helpers';

const latex = new LaTeX2JS();

describe('psgrid, psdots, psellipse Support', () => {
  describe('psgrid', () => {
    it('should parse basic psgrid', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psgrid(-1,-1)(1,1){1}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psgrid');
      
      expect(data).toBeDefined();
      expect(data?.x0).toBeDefined();
      expect(data?.y0).toBeDefined();
      expect(data?.x1).toBeDefined();
      expect(data?.y1).toBeDefined();
      expect(data?.gridsize).toBe(1);
    });

    it('should parse psgrid with options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psgrid[gridcolor=blue,subgridcolor=lightblue,subgriddiv=10](-1,-1)(1,1){0.5}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psgrid');
      
      expect(data?.gridcolor).toBe('blue');
      expect(data?.subgridcolor).toBe('lightblue');
      expect(data?.subgriddiv).toBe(10);
      expect(data?.gridsize).toBe(0.5);
    });
  });

  describe('psdots', () => {
    it('should parse basic psdots', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdots(0,0)(1,1)(2,2)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const psdots = findPSTricksElement(parsed, 'psdots');
      
      expect(psdots).toBeDefined();
      expect(psdots?.data?.points).toBeDefined();
      expect(Array.isArray(psdots?.data?.points)).toBe(true);
      expect(psdots?.data?.points?.length).toBe(3);
    });

    it('should parse psdots with options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdots[dotstyle=*,dotsize=5pt,linecolor=blue](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psdots');
      
      expect(data?.dotstyle).toBe('*');
      expect(data?.dotsize).toBeDefined();
      expect(data?.linecolor).toBe('blue');
      expect(data?.points?.length).toBe(2);
    });

    it('should parse psdots with different dotstyles', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdots[dotstyle=o](0,0)
\\psdots[dotstyle=+](1,0)
\\psdots[dotstyle=x](2,0)
\\psdots[dotstyle=square](0,1)
\\psdots[dotstyle=diamond](1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psdotsArray = pspicture?.plot?.psdots || [];
      
      expect(psdotsArray.length).toBe(5);
      expect(psdotsArray[0]?.data?.dotstyle).toBe('o');
      expect(psdotsArray[1]?.data?.dotstyle).toBe('+');
      expect(psdotsArray[2]?.data?.dotstyle).toBe('x');
      expect(psdotsArray[3]?.data?.dotstyle).toBe('square');
      expect(psdotsArray[4]?.data?.dotstyle).toBe('diamond');
    });

    it('should parse psdots with opacity', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdots[opacity=0.5,dotsize=5pt](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psdots');
      
      expect(data?.opacity).toBe('0.5');
    });
  });

  describe('psellipse', () => {
    it('should parse basic psellipse', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psellipse(0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psellipse');
      
      expect(data).toBeDefined();
      expect(data?.cx).toBeDefined();
      expect(data?.cy).toBeDefined();
      expect(data?.rx).toBeDefined();
      expect(data?.ry).toBeDefined();
    });

    it('should parse psellipse with options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psellipse[linecolor=blue,fillcolor=red,fillstyle=solid](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psellipse');
      
      expect(data?.linecolor).toBe('blue');
      expect(data?.fillcolor).toBe('red');
      expect(data?.fillstyle).toBe('solid');
    });

    it('should parse psellipse with opacity', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psellipse[opacity=0.5,fillcolor=red,fillstyle=solid](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psellipse');
      
      expect(data?.opacity).toBe('0.5');
      expect(data?.fillcolor).toBe('red');
    });

    it('should parse circular ellipse (rx=ry)', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psellipse(0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psellipse');
      
      expect(data?.rx).toBeDefined();
      expect(data?.ry).toBeDefined();
      // rx 和 ry 应该都转换为像素值
      // 注意：rx 使用 xunit，ry 使用 yunit，所以即使输入相同，像素值可能不同
    });
  });
});
