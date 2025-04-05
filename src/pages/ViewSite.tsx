
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteData } from "@/mockApi";

const ViewSite = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siteId) {
      // In a real application, this would fetch from an actual API
      const data = getSiteData(siteId);
      if (data) {
        setSiteData(data);
      }
      setLoading(false);
    }
  }, [siteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Site não encontrado</h1>
          <p>O site que você está procurando não existe ou expirou.</p>
        </div>
      </div>
    );
  }

  // Construct the HTML content for the iframe
  const iframeContent = `
    <!doctype html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${siteData.title}</title>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/RGBELoader.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          background-color: red;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Lobster', cursive;
        }
    
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
    
        #titulo {
          position: absolute;
          top: 30px;
          font-size: 30px;
          color: white;
          text-align: center;
          z-index: 5;
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
          padding: 1px;
          width: 100px;
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
          transform: rotate(-9deg);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
    
        .polaroid.direita {
          transform: rotate(9deg);
        }
    
        .polaroid img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
    
        .legenda {
          margin-top: 8px;
          font-size: 14px;
          color: #444;
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
          opacity: 0.4;
          font-family: 'Lobster', cursive;
          z-index: 5;
          animation: piscar 1.2s infinite alternate;
        }
    
        @keyframes piscar {
          0% { opacity: 0.2; }
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
          margin: 0 -10px;
          z-index: 5;
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
        <source src="${siteData.musicUrl}" type="audio/mpeg">
        Seu navegador não suporta a tag de áudio.
      </audio>
      <div id="titulo">${siteData.title}</div>
      <div id="decoracao">
        <div class="polaroid">
          <img src="${siteData.images[0]}">
          <div class="legenda">${siteData.captions[0]}</div>
        </div>
        <div class="coracao-css"></div>
        <div class="polaroid direita">
          <img src="${siteData.images[1]}">
          <div class="legenda">${siteData.captions[1]}</div>
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
    <iframe 
      srcDoc={iframeContent}
      title="Site personalizado"
      className="w-full h-screen border-0"
      sandbox="allow-scripts"
    />
  );
};

export default ViewSite;
