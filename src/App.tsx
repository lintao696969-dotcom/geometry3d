import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'cube' | 'sphere' | 'light'>('select');

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(4, 3, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#cfe2ff', 1.5);
    directionalLight.position.set(4, 5, 2);
    scene.add(directionalLight);

    const grid = new THREE.GridHelper(20, 20, '#38bdf8', '#334155');
    scene.add(grid);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: '#7c3aed',
      metalness: 0.3,
      roughness: 0.35,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1.2;
    scene.add(cube);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.enablePan = true;
    orbit.maxPolarAngle = Math.PI * 0.48;

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      cube.rotation.x = elapsed * 0.8;
      cube.rotation.y = elapsed * 1.1;
      orbit.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animate as unknown as number);
      window.removeEventListener('resize', handleResize);
      orbit.dispose();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-badge">3D</div>
          <div>
            <h1>几何3D</h1>
            <p>创作工作台</p>
          </div>
        </div>

        <nav className="tool-list" aria-label="tools">
          {[
            ['select', '选择'],
            ['cube', '立方体'],
            ['sphere', '球体'],
            ['light', '灯光'],
          ].map(([tool, label]) => (
            <button
              key={tool}
              className={activeTool === tool ? 'tool-item active' : 'tool-item'}
              onClick={() => setActiveTool(tool as typeof activeTool)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="project-card">
          <h2>项目</h2>
          <p>未命名场景</p>
          <button type="button" className="primary-btn">新建场景</button>
        </div>
      </aside>

      <main className="workspace">
        <header className="toolbar">
          <div className="toolbar-left">
            <button type="button">文件</button>
            <button type="button">编辑</button>
            <button type="button">视图</button>
            <button type="button">导出</button>
          </div>
          <div className="toolbar-right">
            <button type="button" className="primary-btn small">登录</button>
          </div>
        </header>

        <div ref={mountRef} className="canvas-area" />
      </main>
    </div>
  );
}

export default App;
