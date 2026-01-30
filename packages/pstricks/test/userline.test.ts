import LaTeX2JS from '../../latex2js/src';
import { findPSTricksElement, getElementData } from './test-helpers';

const latex = new LaTeX2JS();

describe('Userline Support', () => {
  it('should parse basic userline', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline(0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const userline = findPSTricksElement(parsed, 'userline');
    const data = userline?.data;
    
    expect(userline).toBeDefined();
    expect(data?.x1).toBeDefined();
    expect(data?.y1).toBeDefined();
    expect(data?.x2).toBeDefined();
    expect(data?.y2).toBeDefined();
  });

  it('should parse userline with options', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[linecolor=red,linewidth=2pt](0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const data = getElementData(parsed, 'userline');
    
    expect(data?.linecolor).toBe('red');
    expect(data?.linewidth === '2pt' || data?.linewidth === 2).toBe(true);
  });

  it('should parse userline with arrows', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[linecolor=blue]{->}(0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const data = getElementData(parsed, 'userline');
    
    expect(data?.arrows).toBeDefined();
    expect(Array.isArray(data?.arrows)).toBe(true);
  });

  it('should parse userline with linestyle', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[linestyle=dashed](0,0)(1,1)
\\userline[linestyle=dotted](0,1)(1,0)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const userlines = pspicture?.plot?.userline || [];
    
    expect(userlines?.[0]?.data?.linestyle).toBe('dashed');
    expect(userlines?.[1]?.data?.linestyle).toBe('dotted');
  });

  it('should parse userline with opacity', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[opacity=0.5](0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const data = getElementData(parsed, 'userline');
    
    expect(data?.opacity).toBe('0.5');
  });

  it('should parse userline with dash', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[dash=10,5](0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const data = getElementData(parsed, 'userline');
    
    expect(data?.dash).toBe('10,5');
  });

  it('should parse userline with all options combined', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[linecolor=purple,opacity=0.7,dash=8,4,linewidth=2pt]{->}(0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const data = getElementData(parsed, 'userline');
    
    expect(data?.linecolor).toBe('purple');
    expect(data?.opacity).toBe('0.7');
    expect(data?.dash).toBe('8,4');
    expect(data?.linewidth === '2pt' || data?.linewidth === 2).toBe(true);
    expect(data?.arrows).toBeDefined();
  });
});
