import LaTeX2JS from '../../latex2js/src';

const latex = new LaTeX2JS();

describe('Opacity Support', () => {
  describe('pscircle', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[opacity=0.5](0,0){1}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      expect(pspicture).toBeDefined();

      const pscircle = pspicture?.plot?.pscircle?.[0];
      expect(pscircle).toBeDefined();
      expect(pscircle?.data?.opacity).toBe('0.5');
    });

    it('should parse opacity with other options', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[linecolor=blue,opacity=0.7,linewidth=2pt](0,0){1}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const pscircle = pspicture?.plot?.pscircle?.[0];
      
      expect(pscircle?.data?.opacity).toBe('0.7');
      expect(pscircle?.data?.linecolor).toBe('blue');
      expect(pscircle?.data?.linewidth).toBe('2pt');
    });

    it('should handle opacity boundary values', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[opacity=0](0,0){1}
\\pscircle[opacity=1](1,0){1}
\\pscircle[opacity=1.5](2,0){1}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const circles = pspicture?.plot?.pscircle || [];
      
      expect(circles?.[0]?.data?.opacity).toBe('0');
      expect(circles?.[1]?.data?.opacity).toBe('1');
      expect(circles?.[2]?.data?.opacity).toBe('1.5');
    });
  });

  describe('psframe', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psframe[opacity=0.5](-1,-1)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psframe = pspicture?.plot?.psframe?.[0];
      
      expect(psframe?.data?.opacity).toBe('0.5');
    });
  });

  describe('psline', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[opacity=0.6](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psline = pspicture?.plot?.psline?.[0];
      
      expect(psline?.data?.opacity).toBe('0.6');
    });

    it('should parse opacity with dash option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[opacity=0.5,dash=10,5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psline = pspicture?.plot?.psline?.[0];
      
      expect(psline?.data?.opacity).toBe('0.5');
      expect(psline?.data?.dash).toBe('10,5');
    });
  });

  describe('pspolygon', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\pspolygon[opacity=0.8](0,1)(-1,-1)(1,-1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const pspolygon = pspicture?.plot?.pspolygon?.[0];
      
      expect(pspolygon?.data?.opacity).toBe('0.8');
    });
  });

  describe('psarc', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psarc[opacity=0.4](0,0){1}{0}{90}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psarc = pspicture?.plot?.psarc?.[0];
      
      expect(psarc?.data?.opacity).toBe('0.4');
    });
  });

  describe('psplot', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psplot[algebraic,opacity=0.6]{-1}{1}{x}
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const psplot = pspicture?.plot?.psplot?.[0];
      
      expect(psplot?.data?.opacity).toBe('0.6');
    });
  });

  describe('userline', () => {
    it('should parse opacity option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[opacity=0.5](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const userline = pspicture?.plot?.userline?.[0];
      
      expect(userline?.data?.opacity).toBe('0.5');
    });

    it('should parse opacity with dash option', () => {
      const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[opacity=0.7,dash=8,4](0,0)(1,1)
\\end{pspicture}`;

      const parsed = latex.parse(code);
      const pspicture = parsed.find((p: any) => p.type === 'pspicture');
      const userline = pspicture?.plot?.userline?.[0];
      
      expect(userline?.data?.opacity).toBe('0.7');
      expect(userline?.data?.dash).toBe('8,4');
    });
  });
});
