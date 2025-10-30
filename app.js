import * as THREE from 'three';
// IMPORTANTE: Trocamos o OBJLoader pelo GLTFLoader
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 1. CONFIGURAÇÃO BÁSICA (CENA, CÂMERA, RENDERIZADOR) -----
// (Isto permanece igual)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5); // Fundo

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Adiciona o antialiasing de tom (melhora as cores e luzes)
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('container').appendChild(renderer.domElement);

// ----- 2. ILUMINAÇÃO -----
// (Isto permanece igual e é ESSENCIAL para materiais GLB)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Luz ambiente um pouco mais forte
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ----- 3. CONTROLES DE CÂMERA -----
// (Isto permanece igual)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// Tente adicionar autoRotate para um efeito legal (opcional)
// controls.autoRotate = true; 
// controls.autoRotateSpeed = 1.0;

// ----- 4. CARREGAMENTO DO MODELO GLB -----
// (Esta é a principal mudança)

// **SUBSTITUA PELO CAMINHO DO SEU ARQUIVO GLB**
const GLB_MODEL_PATH = 'modelos/seu_modelo.glb';

// Inicializa o loader
const loader = new GLTFLoader();

// Carrega o arquivo
loader.load(
    GLB_MODEL_PATH,
    // 1. Função de SUCESSO
    (gltf) => {
        // O GLTFLoader já processou tudo:
        // - Geometria
        // - Materiais (com diffuse, normal, roughness, etc.)
        // - Mapeamento UV (já corrigido!)

        // gltf.scene contém o modelo 3D
        scene.add(gltf.scene);
    },
    // 2. Função de PROGRESSO (opcional)
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% carregado');
    },
    // 3. Função de ERRO
    (error) => {
        console.error('Ocorreu um erro ao carregar o modelo GLB:', error);
    }
);

// ----- 5. LOOP DE ANIMAÇÃO (RENDERIZAÇÃO) -----
// (Isto permanece igual)

function animate() {
    requestAnimationFrame(animate);

    // Atualiza os controles de órbita
    controls.update();

    // Renderiza a cena
    renderer.render(scene, camera);
}

// ----- 6. RESPONSIVIDADE (AJUSTE DE JANELA) -----
// (Isto permanece igual)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicia o loop de animação!
animate();
