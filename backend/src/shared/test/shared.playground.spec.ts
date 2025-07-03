import * as crypto from 'crypto';

function generateMerchantPortalhash(password: string, loginId: string) {
  const firstHash = crypto
    .createHash('sha256')
    .update(password, 'utf8')
    .digest('hex');

  let finalHash = firstHash;

  if (loginId !== null) {
    finalHash = crypto
      .createHash('sha256')
      .update(firstHash + loginId, 'utf8')
      .digest('hex');
  }

  return finalHash;
}

function ensureXmlns(svg: string): string {
  // Only add xmlns if it's missing and the root tag is <svg>
  const hasXmlns = /<svg[^>]*xmlns=/.test(svg);
  if (!hasXmlns) {
    return svg.replace(
      /<svg([\s>])/,
      '<svg xmlns="http://www.w3.org/2000/svg"$1',
    );
  }
  return svg;
}

describe('Cryptotest', () => {
  it('generates hash', () => {
    console.log(
      generateMerchantPortalhash('Test@123', 'accounts@majesticlakefront.com'),
    );
  });

  it('ensures xmlns in SVG', () => {
    const svgWithoutXlmns = `<svg viewBox="0 0 100 100" ><circle cx="50" cy="50" r="40" fill="red"/></svg>`;
    const svgWithXlmns = ensureXmlns(svgWithoutXlmns);
    expect(svgWithXlmns).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});
