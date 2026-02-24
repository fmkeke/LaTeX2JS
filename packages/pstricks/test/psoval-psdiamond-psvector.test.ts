import LaTeX2JS from '../../latex2js/src';
import { getElementData, findPSTricksElement } from './test-helpers';

const latex = new LaTeX2JS();

describe('psoval, psdiamond, psvector Support', () => {
  describe('psoval', () => {
    it('should parse basic psoval', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psoval(0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      console.log('Parsed pspicture:', JSON.stringify(pspicture?.plot, null, 2));
      const data = getElementData(parsed, 'psoval');
      
      expect(data).toBeDefined();
      expect(data?.x1).toBeDefined();
      expect(data?.y1).toBeDefined();
      expect(data?.x2).toBeDefined();
      expect(data?.y2).toBeDefined();
      expect(data?.linearc).toBeDefined();
    });

    it('should parse psoval with linearc option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psoval[linearc=0.5](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psoval');
      
      expect(data?.linearc).toBe(0.5);
    });

    it('should parse psoval with fill options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psoval[fillcolor=red,fillstyle=solid,opacity=0.5](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psoval');
      
      expect(data?.fillcolor).toBe('red');
      expect(data?.fillstyle).toBe('solid');
      expect(data?.opacity).toBe('0.5');
    });
  });

  describe('psdiamond', () => {
    it('should parse basic psdiamond', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdiamond(0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psdiamond');
      
      expect(data).toBeDefined();
      expect(data?.cx).toBeDefined();
      expect(data?.cy).toBeDefined();
      expect(data?.width).toBeDefined();
      expect(data?.height).toBeDefined();
    });

    it('should parse psdiamond with options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdiamond[linecolor=blue,fillcolor=red,fillstyle=solid](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psdiamond');
      
      expect(data?.linecolor).toBe('blue');
      expect(data?.fillcolor).toBe('red');
      expect(data?.fillstyle).toBe('solid');
    });

    it('should parse psdiamond with opacity', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psdiamond[opacity=0.7](0,0)(2,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psdiamond');
      
      expect(data?.opacity).toBe('0.7');
    });
  });

  describe('psvector', () => {
    it('should parse basic psvector (default arrow)', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psvector(0,0)(2,2)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psvector');
      
      expect(data).toBeDefined();
      expect(data?.x1).toBeDefined();
      expect(data?.y1).toBeDefined();
      expect(data?.x2).toBeDefined();
      expect(data?.y2).toBeDefined();
      expect(data?.arrows).toBeDefined();
      // 默认应该有箭头
      expect(Array.isArray(data?.arrows)).toBe(true);
    });

    it('should parse psvector with custom arrow type', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psvector{<->}(0,0)(2,2)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psvector');
      
      expect(data?.arrows).toBeDefined();
      expect(Array.isArray(data?.arrows)).toBe(true);
    });

    it('should parse psvector with options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psvector[linecolor=red,linewidth=3pt,opacity=0.5](0,0)(2,2)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psvector');
      
      expect(data?.linecolor).toBe('red');
      expect(data?.opacity).toBe('0.5');
    });

    it('should parse psvector with dash option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psvector[dash=10,5](0,0)(2,2)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psvector');
      
      expect(data?.dash).toBe('10,5');
    });
  });
});
