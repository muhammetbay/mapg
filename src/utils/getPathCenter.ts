/**
 * Parse an SVG path `d` string that uses relative commands (m, l, c, z)
 * and compute the bounding-box center.
 *
 * The @svg-maps/world paths use lowercase (relative) commands exclusively.
 * The first `m` acts as an absolute moveto.
 */
export function getPathCenter(d: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  let curX = 0;
  let curY = 0;
  let startX = 0;
  let startY = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let firstMove = true;

  const track = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  // Tokenize: split into commands + number sequences
  const tokens = d.match(/[mMlLhHvVcCsSqQtTaAzZ]|[-+]?\d*\.?\d+/g);
  if (!tokens) return { x: 0, y: 0, width: 0, height: 0 };

  let i = 0;

  const nextNum = (): number => {
    while (i < tokens.length && /[a-zA-Z]/.test(tokens[i])) i++;
    return i < tokens.length ? parseFloat(tokens[i++]) : 0;
  };

  while (i < tokens.length) {
    const tok = tokens[i];

    if (/[a-zA-Z]/.test(tok)) {
      const cmd = tok;
      i++;

      switch (cmd) {
        case 'm': {
          // Relative moveto — first one in the path is absolute
          const dx = nextNum();
          const dy = nextNum();
          if (firstMove) {
            curX = dx;
            curY = dy;
            firstMove = false;
          } else {
            curX += dx;
            curY += dy;
          }
          startX = curX;
          startY = curY;
          track(curX, curY);
          // Subsequent coord pairs are implicit relative lineto
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX += nextNum();
            curY += nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'M': {
          curX = nextNum();
          curY = nextNum();
          startX = curX;
          startY = curY;
          track(curX, curY);
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX = nextNum();
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'l': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX += nextNum();
            curY += nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'L': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX = nextNum();
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'h': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX += nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'H': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curX = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'v': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curY += nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'V': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'c': {
          // Relative cubic bezier: dx1,dy1 dx2,dy2 dx,dy
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            const dx1 = nextNum(), dy1 = nextNum();
            const dx2 = nextNum(), dy2 = nextNum();
            const dx = nextNum(), dy = nextNum();
            // Track control points for better bbox
            track(curX + dx1, curY + dy1);
            track(curX + dx2, curY + dy2);
            curX += dx;
            curY += dy;
            track(curX, curY);
          }
          break;
        }
        case 'C': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            track(nextNum(), nextNum()); // cp1
            track(nextNum(), nextNum()); // cp2
            curX = nextNum();
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 's': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            const dx2 = nextNum(), dy2 = nextNum();
            const dx = nextNum(), dy = nextNum();
            track(curX + dx2, curY + dy2);
            curX += dx;
            curY += dy;
            track(curX, curY);
          }
          break;
        }
        case 'S': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            track(nextNum(), nextNum());
            curX = nextNum();
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'q': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            const dx1 = nextNum(), dy1 = nextNum();
            const dx = nextNum(), dy = nextNum();
            track(curX + dx1, curY + dy1);
            curX += dx;
            curY += dy;
            track(curX, curY);
          }
          break;
        }
        case 'a': {
          // Relative arc: rx ry x-rot large-arc sweep dx dy
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            nextNum(); nextNum(); nextNum(); nextNum(); nextNum();
            curX += nextNum();
            curY += nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'A': {
          while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            nextNum(); nextNum(); nextNum(); nextNum(); nextNum();
            curX = nextNum();
            curY = nextNum();
            track(curX, curY);
          }
          break;
        }
        case 'z':
        case 'Z': {
          curX = startX;
          curY = startY;
          break;
        }
        default:
          // Skip unknown command
          break;
      }
    } else {
      // Bare number — skip it (shouldn't normally happen)
      i++;
    }
  }

  if (!isFinite(minX)) return { x: 0, y: 0, width: 0, height: 0 };

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    x: minX + width / 2,
    y: minY + height / 2,
    width,
    height,
  };
}
