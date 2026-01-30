import LaTeX2JS from '../../latex2js/src';
import { getElementData } from './test-helpers';

const latex = new LaTeX2JS();

describe('Dash Support', () => {
  describe('psline', () => {
    it('should parse dash option with two values', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[dash=10,5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psline');
      
      expect(data?.dash).toBe('10,5');
    });

    it('should parse dash option with multiple values', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[dash=10,5,5,5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psline');
      
      expect(data?.dash).toBe('10,5,5,5');
    });

    it('should parse dash with spaces', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[dash=10, 5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psline');
      
      expect(data?.dash).toBe('10, 5');
    });

    it('should parse dash with other options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linecolor=blue,dash=8,4,linewidth=2pt](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'psline');
      
      expect(data?.dash).toBe('8,4');
      expect(data?.linecolor).toBe('blue');
      // linewidth might be parsed as number or string depending on implementation
      expect(data?.linewidth === '2pt' || data?.linewidth === 2).toBe(true);
    });

    it('should work with linestyle option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[linestyle=dashed](0,0)(1,1)
\\psline[dash=5,3](0,1)(1,0)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const lines = pspicture?.plot?.psline || [];
      
      expect(lines?.[0]?.data?.linestyle).toBe('dashed');
      expect(lines?.[1]?.data?.dash).toBe('5,3');
    });
  });

  describe('userline', () => {
    it('should parse dash option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[dash=10,5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'userline');
      
      expect(data?.dash).toBe('10,5');
    });

    it('should parse dash with multiple values', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[dash=5,3,2,3](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'userline');
      
      expect(data?.dash).toBe('5,3,2,3');
    });

    it('should parse dash with opacity', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[dash=8,4,opacity=0.6](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const data = getElementData(parsed, 'userline');
      
      expect(data?.dash).toBe('8,4');
      expect(data?.opacity).toBe('0.6');
    });
  });
});
