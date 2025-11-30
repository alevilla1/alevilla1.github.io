import{r,S as _,P as D,W,T as j,a as R,D as T,C as e,M,A as k,b as E,c as L,j as q,d as A}from"./index-BoISRU_2.js";function H(){const n=r.useRef(null),o=r.useRef(null),d=r.useRef(null),t=r.useRef(null),l=r.useRef(null),s=r.useRef(null),x=r.useRef(null);return r.useEffect(()=>{if(!n.current)return;const i=n.current,w=i.clientWidth||500,C=i.clientHeight||500,c=new _;c.background=null,d.current=c;const g=new D(50,w/C,.1,100);g.position.z=20,t.current=g;const a=new W({antialias:!0,alpha:!0,premultipliedAlpha:!1});a.setSize(w,C),a.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.setClearColor(0,0),a.autoClear=!0,i.appendChild(a.domElement),o.current=a;const f=new j(1,.4,128,64),v=new R({uniforms:{uTime:{value:0},uColor1:{value:new e(.04,.81,.44)},uColor2:{value:new e(.61,.25,.72)},uColor3:{value:new e(.31,.61,.39)},uColor4:{value:new e(.79,.49,.15)},uColor5:{value:new e(.72,1,.48)},uColor6:{value:new e(.75,.41,.22)}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        uniform vec3 uColor6;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Noise functions
        float rand(vec2 n) {
          return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        
        float noise(vec2 n) {
          const vec2 d = vec2(0.0, 1.0);
          vec2 b = floor(n);
          vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
          return mix(
            mix(rand(b), rand(b + d.yx), f.x),
            mix(rand(b + d.xy), rand(b + d.yy), f.x),
            f.y
          );
        }
        
        float fbm(vec2 n) {
          float total = 0.0;
          float amplitude = 1.0;
          for (int i = 0; i < 4; i++) {
            total += noise(n) * amplitude;
            n += n;
            amplitude *= 0.5;
          }
          return total;
        }

        void main() {
          vec2 p = vUv * 8.0;
          float q = fbm(p - uTime * 0.1);
          vec2 r = vec2(
            fbm(p + q + uTime * 0.3 - p.x - p.y),
            fbm(p + q - uTime * 0.2)
          );
          
          // Color mixing - reduced subtraction to prevent dark spots
          vec3 c = mix(uColor1, uColor2, fbm(p + r)) +
                   mix(uColor3, uColor4, r.x) -
                   mix(uColor5, uColor6, r.y) * 0.5; // Reduced dark mixing
          
          // Prevent fading to black at edges
          vec3 color = c * (0.3 + 0.7 * cos(1.5 * vUv.y)); // Lifted shadows

          // HDR / Vibrancy effect
          // Increase contrast
          color = pow(color, vec3(1.2));
          
          // Boost saturation/vibrancy
          vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
          color = mix(gray, color, 1.4); // 1.4 saturation boost

          // Standard fresnel for subtle rim
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          color += fresnel * vec3(0.5, 0.4, 0.8); // Slightly brighter rim

          // High brightness for HDR look
          color *= 1.8;

          gl_FragColor = vec4(color, 1.0); // Opaque core
        }
      `,transparent:!1,side:T}),p=new M(f,v);p.scale.set(3,3,3),c.add(p),l.current=p;const u=new R({uniforms:{uTime:{value:0},uColor1:{value:new e(.04,.81,.44)},uColor2:{value:new e(.1,.1,.8)},uColor3:{value:new e(.31,.61,.39)},uColor4:{value:new e(.79,.49,.15)},uColor5:{value:new e(0,.8,.8)},uColor6:{value:new e(.2,.4,1)}},vertexShader:`
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        // Simplex noise for vertex displacement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0);
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Generate noise based on position and time
          float noiseVal = snoise(position * 2.0 + uTime * 0.5);
          float spikes = max(0.0, snoise(position * 8.0 + uTime * 1.0));
          
          // Combine noise
          float displacement = (noiseVal * 0.5 + spikes * 1.5) * 0.5;
          
          // Only displace outwards
          displacement = max(0.0, displacement);
          vNoise = displacement;
          
          // Move vertex along normal
          vec3 newPos = position + normal * displacement;
          
          vPosition = newPos;
          
          // Calculate world position here in vertex shader (modelMatrix available here)
          vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        uniform vec3 uColor6;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying float vNoise;

        void main() {
          float n = vNoise;
          
          vec3 c = mix(uColor1, uColor2, n) +
                   mix(uColor3, uColor4, n * 0.5) +
                   mix(uColor5, uColor6, 1.0 - n);
          
          // Fresnel for soft edges - now using vWorldPosition from vertex shader
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
          
          vec3 color = c * 2.0;
          
          gl_FragColor = vec4(color, 0.4 * fresnel);
        }
      `,transparent:!0,blending:k,side:T,depthWrite:!1}),y=new M(f,u);y.scale.set(3,3,3),c.add(y),s.current=y;const S=new E(16777215,.5);c.add(S);const h=new L(16777215,1);h.position.set(5,5,5),c.add(h);const N=new A,b=()=>{if(!n.current||!o.current||!d.current||!t.current)return;x.current=requestAnimationFrame(b);const m=N.getElapsedTime();v.uniforms.uTime&&(v.uniforms.uTime.value=m),u.uniforms.uTime&&(u.uniforms.uTime.value=m),l.current&&(l.current.rotation.y-=.003,l.current.rotation.x+=.001),s.current&&(s.current.rotation.y-=.003,s.current.rotation.x+=.001),o.current.render(d.current,t.current)};b();const z=()=>{if(!n.current||!o.current||!t.current)return;const m=n.current.clientWidth||500,P=n.current.clientHeight||500;t.current.aspect=m/P,t.current.updateProjectionMatrix(),o.current.setSize(m,P)};return window.addEventListener("resize",z),()=>{x.current&&(cancelAnimationFrame(x.current),x.current=null),window.removeEventListener("resize",z),f&&f.dispose(),v&&v.dispose(),u&&u.dispose(),o.current&&(o.current.dispose(),i&&i.contains(o.current.domElement)&&i.removeChild(o.current.domElement),o.current=null),d.current=null,t.current=null,l.current=null,s.current=null}},[]),q.jsx("div",{ref:n,className:"homepage-color-shape"})}export{H as default};
//# sourceMappingURL=ColorShape2-Bqv57vke.js.map
