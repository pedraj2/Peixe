import * as THREE from 'three';
// Importa os 'addons' necessários:
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Para carregar o modelo .obj
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Para controlar a câmera com o mouse

// ----- 1. CONFIGURAÇÃO BÁSICA (CENA, CÂMERA, RENDERIZADOR) -----

// Cena: Onde todos os objetos, luzes e câmeras vivem.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5); // Um fundo azul-acinzentado claro

// Câmera: Como vemos a cena.
// PerspectiveCamera(campo de visão, aspect ratio, plano próximo, plano distante)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Afasta a câmera para podermos ver o objeto

// Renderizador: "Desenha" a cena na tela.
const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias suaviza as bordas
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement); // Adiciona o canvas ao HTML

// ----- 2. ILUMINAÇÃO (ESSENCIAL) -----
// Um material com 'normalMap' (MeshStandardMaterial) precisa de luz para funcionar.

// Luz Ambiente: Ilumina todos os objetos uniformemente.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Cor branca, 60% de intensidade
scene.add(ambientLight);

// Luz Direcional: Simula a luz do sol.
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Cor branca, 100% de intensidade
directionalLight.position.set(5, 10, 7.5); // Posição da luz
scene.add(directionalLight);

// ----- 3. CONTROLES DE CÂMERA -----
// Permite ao usuário girar a cena com o mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adiciona um efeito suave de "desaceleração"
controls.dampingFactor = 0.05;

// ----- 4. CARREGAMENTO (MODELO E TEXTURAS) -----

// **SUBSTITUA PELOS CAMINHOS DOS SEUS ARQUIVOS**
const MODEL_PATH = 'modelos/seu_modelo.obj';
const DIFFUSE_TEXTURE_PATH = 'texturas/sua_textura_diffuse.jpg';
const NORMAL_TEXTURE_PATH = 'texturas/sua_textura_normal.jpg';

// Inicializa os 'loaders'
const textureLoader = new THREE.TextureLoader();
const objLoader = new OBJLoader();

// Carrega as texturas
const diffuseMap = textureLoader.load(DIFFUSE_TEXTURE_PATH);
const normalMap = textureLoader.load(NORMAL_TEXTURE_PATH);

// Configura o 'wrapping' e repetição, se necessário (opcional)
// diffuseMap.wrapS = THREE.RepeatWrapping;
// diffuseMap.wrapT = THREE.RepeatWrapping;
// diffuseMap.repeat.set(2, 2);

// ----- 5. CRIAÇÃO DO MATERIAL -----
// Este é o passo chave onde combinamos as texturas.
// Usamos MeshStandardMaterial, que é um material PBR (Physically Based Rendering)
// que entende mapas de 'diffuse' (cor) e 'normal' (detalhe).
const material = new THREE.MeshStandardMaterial({
    map: diffuseMap,       // 'map' é o canal de cor (diffuse)
    normalMap: normalMap,  // 'normalMap' é o canal de normais
    
    // Você pode ajustar 'roughness' (rugosidade) e 'metalness' (metalicidade)
    // roughness: 0.5,
    // metalness: 0.2
});

// ----- 6. CARREGAMENTO DO MODELO .OBJ -----
objLoader.load(
    MODEL_PATH,
    // 1. Função de SUCESSO (chamada quando o modelo carrega)
    (object) => {
        // O .obj pode ser um grupo com várias malhas (meshes)
        // Precisamos percorrer todos os "filhos" e aplicar nosso material
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
            }
        });

        // Adiciona o modelo carregado à cena
        scene.add(object);
    },
    // 2. Função de PROGRESSO (opcional)
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% carregado');
    },
    // 3. Função de ERRO
    (error) => {
        console.error('Ocorreu um erro ao carregar o modelo:', error);
    }
);

// ----- 7. LOOP DE ANIMAÇÃO (RENDERIZAÇÃO) -----
// Esta função é chamada 60x por segundo
function animate() {
    requestAnimationFrame(animate);

    // Atualiza os controles de órbita (para o damping funcionar)
    controls.update();

    // Renderiza a cena a partir da perspectiva da câmera
    renderer.render(scene, camera);
}

// ----- 8. RESPONSIVIDADE (AJUSTE DE JANELA) -----
// Atualiza a câmera e o renderizador quando a janela muda de tamanho
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicia o loop de animação!
animate();
