import LaTeX2JS from '../../latex2js/src';

const latex = new LaTeX2JS();

/**
 * 验证所有正则表达式匹配组的索引是否正确
 */
describe('Regex Index Verification', () => {
  it('should verify psframe indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psframe[opacity=0.5](-1,-1)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const psframe = pspicture?.plot?.psframe?.[0];
    
    // m[1] = options, m[2]=x1, m[3]=y1, m[4]=x2, m[5]=y2
    expect(psframe?.data?.opacity).toBe('0.5'); // from m[1]
    expect(psframe?.data?.x1).toBeDefined(); // from m[2]
    expect(psframe?.data?.y1).toBeDefined(); // from m[3]
    expect(psframe?.data?.x2).toBeDefined(); // from m[4]
    expect(psframe?.data?.y2).toBeDefined(); // from m[5]
  });

  it('should verify pscircle indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\pscircle[opacity=0.5](0,0){1}
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const pscircle = pspicture?.plot?.pscircle?.[0];
    
    // m[1] = options, m[2]=cx, m[3]=cy, m[4]=r
    expect(pscircle?.data?.opacity).toBe('0.5'); // from m[1]
    expect(pscircle?.data?.cx).toBeDefined(); // from m[2]
    expect(pscircle?.data?.cy).toBeDefined(); // from m[3]
    expect(pscircle?.data?.r).toBeDefined(); // from m[4]
  });

  it('should verify psellipse indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psellipse[opacity=0.5](0,0)(2,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const psellipse = pspicture?.plot?.psellipse?.[0];
    
    // m[1] = options, m[2]=cx, m[3]=cy, m[4]=rx, m[5]=ry
    expect(psellipse?.data?.opacity).toBe('0.5'); // from m[1]
    expect(psellipse?.data?.cx).toBeDefined(); // from m[2]
    expect(psellipse?.data?.cy).toBeDefined(); // from m[3]
    expect(psellipse?.data?.rx).toBeDefined(); // from m[4]
    expect(psellipse?.data?.ry).toBeDefined(); // from m[5]
  });

  it('should verify psgrid indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psgrid[opacity=0.5](-2,-2)(2,2){1}
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const psgrid = pspicture?.plot?.psgrid?.[0];
    
    // m[1] = options, m[2]=x0, m[3]=y0, m[4]=x1, m[5]=y1, m[6]=gridsize
    expect(psgrid?.data?.opacity).toBe('0.5'); // from m[1]
    expect(psgrid?.data?.x0).toBeDefined(); // from m[2]
    expect(psgrid?.data?.y0).toBeDefined(); // from m[3]
    expect(psgrid?.data?.x1).toBeDefined(); // from m[4]
    expect(psgrid?.data?.y1).toBeDefined(); // from m[5]
    expect(psgrid?.data?.gridsize).toBe(1); // from m[6]
  });

  it('should verify psline indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psline[opacity=0.5]{->}(0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const psline = pspicture?.plot?.psline?.[0];
    
    // m[1] = options, m[2]=type/arrows, m[3]=x1, m[4]=y1, m[5]=second coords, m[6]=x2, m[7]=y2
    expect(psline?.data?.opacity).toBe('0.5'); // from m[1]
    expect(psline?.data?.arrows).toBeDefined(); // from m[2]
    expect(psline?.data?.x1).toBeDefined(); // from m[3]
    expect(psline?.data?.y1).toBeDefined(); // from m[4]
    expect(psline?.data?.x2).toBeDefined(); // from m[6]
    expect(psline?.data?.y2).toBeDefined(); // from m[7]
  });

  it('should verify psarc indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\psarc[opacity=0.5]{->}(0,0){1.5}{0}{90}
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const psarc = pspicture?.plot?.psarc?.[0];
    
    // m[1] = options, m[2]=type/arrows, m[3]=cx, m[4]=cy, m[5]=r, m[6]=angleA, m[7]=angleB
    expect(psarc?.data?.opacity).toBe('0.5'); // from m[1]
    expect(psarc?.data?.arrows).toBeDefined(); // from m[2]
    expect(psarc?.data?.cx).toBeDefined(); // from m[3]
    expect(psarc?.data?.cy).toBeDefined(); // from m[4]
    expect(psarc?.data?.r).toBeDefined(); // from m[5]
    expect(psarc?.data?.angleA).toBeDefined(); // from m[6]
    expect(psarc?.data?.angleB).toBeDefined(); // from m[7]
  });

  it('should verify userline indices', () => {
    const code = `\\begin{pspicture}(-2,-2)(2,2)
\\userline[opacity=0.5]{->}(0,0)(1,1)
\\end{pspicture}`;

    const parsed = latex.parse(code);
    const pspicture = parsed.find((p: any) => p.type === 'pspicture');
    const userline = pspicture?.plot?.userline?.[0];
    
    // m[1] = options, m[2]=type/arrows, m[3]=x1, m[4]=y1, m[5]=x2, m[6]=y2
    expect(userline?.data?.opacity).toBe('0.5'); // from m[1]
    expect(userline?.data?.arrows).toBeDefined(); // from m[2]
    expect(userline?.data?.x1).toBeDefined(); // from m[3]
    expect(userline?.data?.y1).toBeDefined(); // from m[4]
    expect(userline?.data?.x2).toBeDefined(); // from m[5]
    expect(userline?.data?.y2).toBeDefined(); // from m[6]
  });
});
