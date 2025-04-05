
import { useEffect, useRef } from "react";

interface PolaroidPreviewProps {
  title: string;
  images: string[];
  captions: string[];
  musicUrl: string;
}

const PolaroidPreview = ({ title, images, captions, musicUrl }: PolaroidPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePreview();
  }, [title, images, captions, musicUrl]);

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    
    // Update the title
    const titleElement = doc.getElementById('titulo');
    if (titleElement) titleElement.textContent = title;
    
    // Update the polaroid images and captions
    const polaroids = doc.querySelectorAll('.polaroid');
    images.forEach((image, index) => {
      if (index < polaroids.length) {
        const imgElement = polaroids[index].querySelector('img');
        const legendaElement = polaroids[index].querySelector('.legenda');
        if (imgElement) imgElement.setAttribute('src', image);
        if (legendaElement) legendaElement.textContent = captions[index];
      }
    });
    
    // Update the music source
    const audioElement = doc.getElementById('musica') as HTMLAudioElement;
    if (audioElement) {
      const source = audioElement.querySelector('source');
      if (source) source.setAttribute('src', musicUrl);
      audioElement.load();
    }
  };

  const iframeContent = `
    <!doctype html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido Especial</title>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/RGBELoader.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lobster&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Playfair Display', serif;
        }
    
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
    
        #titulo {
          position: absolute;
          top: 40px;
          font-size: 32px;
          color: white;
          text-align: center;
          z-index: 5;
          font-family: 'Lobster', cursive;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 1px;
        }
    
        #decoracao {
          position: absolute;
          top: 130px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: -35px;
          z-index: 5;
        }
    
        .polaroid {
          background-color: white;
          padding: 8px 8px 20px 8px;
          width: 120px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          transform: rotate(-9deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 2px;
        }
    
        .polaroid.direita {
          transform: rotate(9deg);
        }
    
        .polaroid img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 1px;
        }
    
        .legenda {
          margin-top: 10px;
          font-size: 14px;
          color: #444;
          font-family: 'Playfair Display', serif;
          text-align: center;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
    
        .coracao {
          width: 40px;
          height: auto;
        }
    
        #cliqueTexto {
          position: absolute;
          bottom: 80px;
          font-size: 24px;
          color: white;
          opacity: 0.7;
          font-family: 'Lobster', cursive;
          z-index: 5;
          animation: piscar 1.2s infinite alternate;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
          background-color: rgba(0, 0, 0, 0.2);
          padding: 5px 20px;
          border-radius: 20px;
          cursor: pointer;
        }
    
        @keyframes piscar {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
    
        .heart {
          position: absolute;
          font-size: 35px;
          color: white;
          opacity: 6;
          z-index: 6;
        }
        
        .coracao-css {
          width: 50px;
          height: 45px;
          background: white;
          position: relative;
          transform: rotate(-45deg);
          margin: 0 -5px;
          z-index: 5;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .coracao-css::before,
        .coracao-css::after {
          content: "";
          width: 50px;
          height: 45px;
          background: white;
          border-radius: 50%;
          position: absolute;
        }
        
        .coracao-css::before {
          top: -25px;
          left: 0;
        }
        
        .coracao-css::after {
          left: 25px;
          top: 0;
        }
      </style>
    </head>
    <body>
      <audio id="musica" preload="auto">
        <source src="${musicUrl}" type="audio/mpeg">
        Seu navegador não suporta a tag de áudio.
      </audio>
      <div id="titulo">${title}</div>
      <div id="decoracao">
        <div class="polaroid">
          <img src="${images[0]}">
          <div class="legenda">${captions[0]}</div>
        </div>
        <div class="coracao-css"></div>
        <div class="polaroid direita">
          <img src="${images[1]}">
          <div class="legenda">${captions[1]}</div>
        </div>
      </div>
      <div id="cliqueTexto">clique aqui</div>
      <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
    
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.5;
    
        document.body.appendChild(renderer.domElement);
    
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 1.5;
        controls.enableZoom = true;
        controls.enablePan = true;
    
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
    
        new THREE.RGBELoader()
          .setDataType(THREE.UnsignedByteType)
          .setPath('https://rawcdn.githack.com/mrdoob/three.js/dev/examples/textures/equirectangular/')
          .load('royal_esplanade_1k.hdr', function (texture) {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
          });
    
        let model, gfPart, pivot;
        let toggle = false;
        let autoRotate = false;
    
        const loader = new THREE.GLTFLoader();
        loader.load(
          'https://firebasestorage.googleapis.com/v0/b/mod-menu-60288.appspot.com/o/scene%20(10).glb?alt=media&token=e6717b57-c4d3-4079-99d6-f78690525606',
          function (gltf) {
            model = gltf.scene;
            model.position.set(0.86, -1.60, 0.0);
            model.scale.set(0.5, 0.5, 0.5);
            model.rotation.y = THREE.MathUtils.degToRad(90.0);
    
            gfPart = model.getObjectByName("Bf") || model.getObjectByName("gf") || model.getObjectByName("GF");
    
            pivot = new THREE.Group();
            pivot.add(model);
            scene.add(pivot);
    
            camera.position.set(0.00, 2.00, 5.73);
            camera.lookAt(new THREE.Vector3(0, 0.00, 0));
          },
          undefined,
          function (error) {
            console.error("Erro ao carregar o modelo:", error);
          }
        );
    
        function animate() {
          requestAnimationFrame(animate);
          controls.update();
    
          if (autoRotate && pivot) {
            pivot.rotation.y += 0.01;
          }
    
          renderer.render(scene, camera);
        }
        animate();
    
        function girarPersonagem() {
          if (!gfPart) return;
    
          const rotacaoFinal = toggle ? -60.2 : 20;
          toggle = !toggle;
    
          gsap.to(gfPart.rotation, {
            y: THREE.MathUtils.degToRad(rotacaoFinal),
            duration: 1,
            ease: "power2.inOut",
          });
    
          setTimeout(() => {
            autoRotate = true;
          }, 2000);
        }
    
        document.addEventListener("click", girarPersonagem);
        document.getElementById("cliqueTexto").addEventListener("click", (e) => {
          e.stopPropagation();
          girarPersonagem();
        });
    
        function createHeart() {
          const heart = document.createElement("div");
          heart.innerHTML = "❤";
          heart.classList.add("heart");
          document.body.appendChild(heart);
    
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          heart.style.left = \`\${x}px\`;
          heart.style.top = \`\${y}px\`;
    
          gsap.to(heart, {
            opacity: 0,
            duration: 2,
            onComplete: () => heart.remove()
          });
        }
    
        setInterval(createHeart, 150);
    
        window.addEventListener('resize', () => {
          renderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        });
        
        document.addEventListener("click", () => {
          const musica = document.getElementById("musica");
          musica.play().catch((e) => {
            console.warn("Erro ao tentar tocar o som:", e);
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <iframe 
        ref={iframeRef}
        className="w-full h-[600px] border-4 border-white rounded-lg shadow-lg"
        srcDoc={iframeContent}
        title="Visualização da proposta"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default PolaroidPreview;
