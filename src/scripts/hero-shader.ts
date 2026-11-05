/**
 * Hero WebGL »svila« — en sam fragment shader, brez knjižnic (DESIGN.md §7).
 * - Barve bere iz CSS spremenljivk (--bg, --accent-deep, --sage, --mist, --sand).
 * - Riše pri zmanjšani ločljivosti (mehka slika → poceni), DPR omejen.
 * - Ustavi se, ko hero ni viden ali je zavihek skrit.
 * - prefers-reduced-motion: nariše eno statično sličico.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg;
uniform vec3 uDeep;
uniform vec3 uAccent;
uniform vec3 uMist;
uniform vec3 uInk;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.11;

  // Kazalec v istem prostoru
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 d = p - m;
  float md = length(d);
  p += 0.10 * uHover * (d / (md + 0.0001)) * exp(-md * md * 3.5);

  // Gube svile: zasuk + valovanje
  vec2 q = mat2(0.86, -0.5, 0.5, 0.86) * p * 1.55;
  q.y += 0.24 * sin(1.6 * q.x + t * 1.3);
  q.x += 0.20 * sin(2.2 * q.y - t);
  float f = sin(3.0 * (q.x + q.y + cos(1.4 * q.x + 2.4 * q.y + t * 0.6)) + 0.6 * sin(6.0 * (q.x - q.y + t * 0.25)));
  f = 0.5 + 0.5 * f;

  float folds = smoothstep(0.1, 1.0, f);
  float sheen = pow(f, 4.0);
  float haze = smoothstep(0.35, 0.95, f) * (1.0 - sheen);
  float crest = pow(f, 22.0);

  // Gube: globina → žajbelj (svila) → pesek (topel greben); megla = hladna tančica med gubami
  vec3 col = mix(uBg, uDeep, folds);
  col = mix(col, uMist, haze * 0.14);
  col = mix(col, uAccent, sheen);
  col = mix(col, uInk, crest * 0.7);

  // Svetloba prihaja zgoraj desno, levo spodaj ugasne v zeleno-črno
  float light = smoothstep(1.35, 0.05, length((uv - vec2(0.74, 0.8)) * vec2(1.15, 1.0)));
  col = mix(uBg, col, mix(0.2, 1.0, light));

  // Sij okoli kazalca (topel pesek)
  col += uInk * 0.16 * uHover * exp(-md * md * 9.0);

  // Zrno
  col += (hash(gl_FragCoord.xy + fract(uTime * 0.37)) - 0.5) * 0.04;

  gl_FragColor = vec4(col, 1.0);
}
`;

function cssColor(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[hero-shader]', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function initHeroShader(canvas: HTMLCanvasElement, host: HTMLElement, reduceMotion: boolean) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, 'uRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
    hover: gl.getUniformLocation(prog, 'uHover'),
    bg: gl.getUniformLocation(prog, 'uBg'),
    deep: gl.getUniformLocation(prog, 'uDeep'),
    accent: gl.getUniformLocation(prog, 'uAccent'),
    mist: gl.getUniformLocation(prog, 'uMist'),
    ink: gl.getUniformLocation(prog, 'uInk'),
  };
  gl.uniform3fv(u.bg, cssColor('--bg'));
  gl.uniform3fv(u.deep, cssColor('--accent-deep'));
  gl.uniform3fv(u.accent, cssColor('--sage'));
  gl.uniform3fv(u.mist, cssColor('--mist'));
  gl.uniform3fv(u.ink, cssColor('--sand'));

  // Programsko renderiranje (brez GPU: SwiftShader/llvmpipe) → le ena statična sličica
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  const softwareGL = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  const staticOnly = reduceMotion || softwareGL;

  const isSmall = window.matchMedia('(max-width: 640px)').matches;
  const lowPower = isSmall || (navigator.hardwareConcurrency || 8) <= 4;
  const scale = (lowPower ? 0.4 : 0.55) * Math.min(window.devicePixelRatio || 1, 1.5);
  // Na šibkejših napravah ~30 sličic/s
  const minFrameMs = lowPower ? 1000 / 30 : 0;

  function resize() {
    const w = Math.max(1, Math.round(host.clientWidth * scale));
    const h = Math.max(1, Math.round(host.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(u.res, w, h);
    }
  }

  // Kazalec: cilj + mehko sledenje
  const mouse = { x: 0.62, y: 0.6, tx: 0.62, ty: 0.6, hover: 0, th: 0 };
  function onPointer(e: PointerEvent) {
    const r = host.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = 1 - (e.clientY - r.top) / r.height;
    mouse.th = 1;
  }
  function onLeave() {
    mouse.th = 0;
  }

  let time = 8 + Math.random() * 20;
  let last = 0;
  let raf = 0;
  let inView = window.scrollY <= window.innerHeight * 1.02;
  let pageVisible = document.visibilityState === 'visible';

  function frame(now: number) {
    raf = 0;
    if (minFrameMs && now - last < minFrameMs) {
      schedule(false);
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.hover += (mouse.th - mouse.hover) * 0.04;
    draw();
    schedule();
  }

  function draw() {
    resize();
    gl!.uniform1f(u.time, time);
    gl!.uniform2f(u.mouse, mouse.x, mouse.y);
    gl!.uniform1f(u.hover, mouse.hover);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function schedule(resetClock = true) {
    if (!raf && inView && pageVisible && !staticOnly) {
      if (resetClock && !last) last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // Hero je »zavesa« na vrhu strani: ko ga vsebina popolnoma prekrije
  // (drsenje > 1 višina zaslona), ustavimo risanje.
  function onScroll() {
    const covered = window.scrollY > window.innerHeight * 1.02;
    if (covered && inView) {
      inView = false;
      stop();
    } else if (!covered && !inView) {
      inView = true;
      last = performance.now();
      schedule();
    }
  }

  document.addEventListener('visibilitychange', () => {
    pageVisible = document.visibilityState === 'visible';
    if (pageVisible) {
      last = performance.now();
      schedule();
    } else stop();
  });

  if (!staticOnly) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', () => {
    resize();
    if (staticOnly) draw();
  });

  draw();
  canvas.classList.add('is-ready');
  last = performance.now();
  schedule();

  return { stop };
}
