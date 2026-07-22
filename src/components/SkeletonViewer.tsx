import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { 
  Compass, RotateCcw, Info, Sparkles, CheckCircle, Sliders, Eye, 
  Maximize2, Activity, ShieldAlert, Layers, Crosshair, ArrowRight,
  Search, ZoomIn, ZoomOut, Move, Upload, FileUp, AlertTriangle
} from "lucide-react";

// Detailed Anatomical & Clinical Information for bones
interface BoneDetail {
  id: string;
  name: string;
  description: string;
  function: string;
  clinicalImportance: string;
  radiographicAppearance: string;
  searchKeywords: string[];
}

const boneDatabase: BoneDetail[] = [
  {
    id: "skull",
    name: "Skull (Cranium & Mandible)",
    description: "The bony skeleton of the head, divided into the neurocranium (which houses and protects the brain) and the viscerocranium (which forms the face and jaw).",
    function: "Protects the brain and brainstem, houses major sensory organs (eyes, inner ears, nose, taste), and supports the muscles of facial expression and mastication (chewing).",
    clinicalImportance: "Basilar skull fractures can disrupt cranial nerves and lead to cerebrospinal fluid (CSF) rhinorrhea or otorrhea. Facial fractures (such as Le Fort classification or zygomaticomaxillary complex) can compromise the airway or vision.",
    radiographicAppearance: "Typically imaged using PA (Caldwell projection), AP axial (Townes view), and lateral skull radiographs. Evaluated for suture lines, vascular grooves, calcification of the pineal gland, and radiolucent fracture lines.",
    searchKeywords: ["skull", "cranium", "head", "mandible", "jaw", "face", "facial", "brain", "forehead"]
  },
  {
    id: "cervical",
    name: "Cervical Spine (C1 - C7)",
    description: "The uppermost portion of the spinal column, consisting of seven vertebrae that form the skeletal neck framework.",
    function: "Supports the skull, protects the cervical spinal cord and vertebral arteries, and enables a wide, highly mobile range of motion including rotation, flexion, extension, and lateral tilt.",
    clinicalImportance: "Trauma can cause high-cervical fracture-dislocations. Notable injuries include Jefferson burst fractures (C1) and Hangman's fracture (bilateral pars of C2). Spinal cord injury above C4 is life-threatening due to diaphragmatic paralysis.",
    radiographicAppearance: "Lateral views are critical in trauma to evaluate the prevertebral soft tissue space (<6mm at C3), and the three key alignment contours: the anterior vertebral line, posterior vertebral line, and spinolaminar line.",
    searchKeywords: ["cervical", "neck", "spine", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "vertebrae", "odontoid"]
  },
  {
    id: "thoracic",
    name: "Thoracic Spine (T1 - T12)",
    description: "The twelve segments of the vertebral column in the mid-back that articulate with the rib cage.",
    function: "Protects the thoracic spinal cord, anchors the ribs to form the rigid chest cavity, and limits extensive rotation and flexion/extension to safeguard cardiopulmonary organs.",
    clinicalImportance: "Wedge compression fractures are highly common in osteoporotic patients, presenting as anterior height loss. Spondylosis, disc herniation, and severe kyphosis can compress the spinal cord or limit lung expansion.",
    radiographicAppearance: "Visible on AP and Lateral chest or thoracic spine films. Evaluated for vertebral body height, intervertebral disc spaces, pedicle alignment ('winking owl sign' for metastases), and curvature.",
    searchKeywords: ["thoracic", "spine", "back", "middle", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "vertebrae"]
  },
  {
    id: "lumbar",
    name: "Lumbar Spine (L1 - L5)",
    description: "The five large, robust vertebrae of the lower back, designed to sustain maximum body weight load.",
    function: "Carries the primary weight of the upper torso, protects the cauda equina nerve bundles, and allows significant trunk flexion, extension, and lateral bending.",
    clinicalImportance: "Spondylolysis and spondylolisthesis (vertebral slippage) are frequent causes of chronic lower back pain. Herniated discs (most commonly L4-L5 or L5-S1) compress nerve roots, leading to sciatica.",
    radiographicAppearance: "Oblique projections reveal the classic 'Scotty Dog' contour. A radiolucent line across the neck of the dog (pars interarticularis) confirms spondylolysis, whereas slippage is measured on lateral views.",
    searchKeywords: ["lumbar", "spine", "lower", "l1", "l2", "l3", "l4", "l5", "back", "scotty dog", "vertebrae"]
  },
  {
    id: "pelvis",
    name: "Pelvic Ring (Ilium, Ischium, Pubis & Sacrum)",
    description: "A large, rigid basin-shaped skeletal ring that connects the vertebral column to the lower limbs, made of the fused coxal bones (ilium, ischium, pubis) and the sacrum.",
    function: "Transfers the weight of the upper body from the spine to the femurs, protects pelvic viscera (bladder, reproductive organs, colon), and provides powerful muscular attachments for locomotion.",
    clinicalImportance: "Pelvic ring fractures are high-impact trauma emergencies often associated with severe arterial retroperitoneal bleeding, needing immediate stabilization with a pelvic binder to reduce pelvic volume.",
    radiographicAppearance: "Standard AP Pelvis must show symmetrical iliac wings and obturator foramina. Shenton's line (continuous arc from the obturator foramen to the medial femoral neck) is traced to check for hip dislocation or femoral neck fractures.",
    searchKeywords: ["pelvis", "pelvic", "hip", "ilium", "ischium", "pubis", "sacrum", "acetabulum", "symphysis", "sacroiliac"]
  },
  {
    id: "clavicle",
    name: "Clavicle (Collar Bone)",
    description: "The horizontal, S-shaped long bone connecting the sternum medially to the scapula laterally.",
    function: "Acts as a structural strut that suspends the shoulder joint away from the thoracic cage, maximizing the upper extremity's range of motion and transferring forces from the arm to the axial skeleton.",
    clinicalImportance: "One of the most frequently fractured bones, typically at the middle third from falls on the shoulder. Medial fragment displacement is caused by the pull of the sternocleidomastoid muscle.",
    radiographicAppearance: "Evaluated with AP and AP Axial (15-30° cephalad tilt) views. The axial projection tilts the clavicle above the ribs and scapula, providing a clear silhouette for fracture assessment.",
    searchKeywords: ["clavicle", "collar", "shoulder", "scapula", "collarbone", "acromion", "sternoclavicular"]
  },
  {
    id: "scapula",
    name: "Scapula (Shoulder Blade)",
    description: "The flat, triangular bone located on the posterolateral aspect of the rib cage, forming the posterior part of the shoulder girdle.",
    function: "Articulates with the humeral head at the shallow glenoid cavity to form the highly mobile glenohumeral joint, and hosts the rotator cuff (SITS) muscle attachments.",
    clinicalImportance: "Scapular fractures are rare, usually resulting from extreme blunt force trauma, and are often markers of severe underlying chest or pulmonary injuries (e.g., pulmonary contusion).",
    radiographicAppearance: "Viewed clearly on Scapular Y (lateral) projections. In a normal shoulder, the humeral head sits directly over the intersection of the 'Y' (formed by the acromion, coracoid, and scapular body).",
    searchKeywords: ["scapula", "shoulder", "blade", "glenoid", "acromion", "coracoid", "rotator cuff"]
  },
  {
    id: "humerus",
    name: "Humerus (Upper Arm)",
    description: "The largest and longest bone of the upper limb, articulating proximally with the scapula and distally with the radius and ulna.",
    function: "Serves as a structural lever for upper arm musculature, facilitating lifting, pushing, and pulling, while allowing shoulder rotation and elbow flexion/extension.",
    clinicalImportance: "Surgical neck fractures can injure the axillary nerve, causing deltoid paralysis. Mid-shaft spiral fractures can damage the radial nerve in the spiral groove, leading to wrist drop.",
    radiographicAppearance: "AP and Lateral views are standard. On lateral elbow views, the displacement of the anterior fat pad (Sail Sign) or the presence of a posterior fat pad indicates joint effusion.",
    searchKeywords: ["humerus", "arm", "upper", "shoulder", "elbow", "bicep", "tricep", "tuberosity", "condyle"]
  },
  {
    id: "radius",
    name: "Radius (Forearm)",
    description: "The lateral bone of the forearm, positioned on the thumb side, running parallel to the ulna.",
    function: "Facilitates forearm supination and pronation by rotating around the ulna at the proximal and distal radioulnar joints, and forms the primary weight-transmitting joint at the wrist.",
    clinicalImportance: "Colles' fracture is a distal radius fracture with dorsal displacement of the distal fragment ('dinner-fork' deformity), highly prevalent in older adults falling on an outstretched hand.",
    radiographicAppearance: "Check radial head alignment—a line drawn down the center of the radial neck must bisect the capitellum of the humerus in all radiographic views (AP, lateral, oblique).",
    searchKeywords: ["radius", "forearm", "wrist", "elbow", "arm", "colles", "smith", "radial", "pronation", "supination"]
  },
  {
    id: "ulna",
    name: "Ulna (Forearm)",
    description: "The medial bone of the forearm, situated on the pinky-finger side, parallel to the radius.",
    function: "Forms the sturdy hinge joint of the elbow with the humeral trochlea, providing skeletal stability for forearm flexion and extension.",
    clinicalImportance: "Monteggia fracture-dislocation involves a fracture of the proximal ulnar shaft accompanied by dislocation of the radial head. Isolated ulnar shaft fractures are common from direct self-defense blocks ('nightstick fracture').",
    radiographicAppearance: "Visible parallel to the radius. On elbow lateral view, the hook-like olecranon process should be perfectly aligned with the humeral trochlear groove.",
    searchKeywords: ["ulna", "forearm", "wrist", "elbow", "olecranon", "nightstick", "monteggia", "arm", "styloid"]
  },
  {
    id: "femur",
    name: "Femur (Thigh Bone)",
    description: "The longest, strongest, and heaviest bone in the human body, spanning from the hip joint to the knee joint.",
    function: "Bears the entire load of the upper skeleton during upright activities, anchors powerful hip and thigh muscles, and acts as a massive lever for walking, running, and jumping.",
    clinicalImportance: "Femoral neck fractures are highly prevalent in elderly women due to osteoporosis, carrying a significant risk of avascular necrosis because of the retrograde blood supply to the femoral head.",
    radiographicAppearance: "Standard AP Hip demonstrates the femoral neck without foreshortening (obtained by rotating the feet 15° internally). Track the continuity of Shenton's Line to detect subtle fractures or joint displacement.",
    searchKeywords: ["femur", "thigh", "hip", "leg", "knee", "trochanter", "femoral", "patella"]
  },
  {
    id: "tibia",
    name: "Tibia (Shin Bone)",
    description: "The thick, medially located, primary weight-bearing bone of the lower leg, running parallel to the fibula.",
    function: "Transfers forces from the femur to the foot, stabilizes the ankle joint medially (forming the medial malleolus), and provides attachment for knee extensor tendons.",
    clinicalImportance: "Tibial plateau fractures occur from high-impact axial loads or lateral force. Open tibia fractures are common because the anterior shin has no muscular coverage.",
    radiographicAppearance: "Imaged in AP and Lateral lower leg projections. The ankle mortise view (15-20° internal rotation) is critical to check for symmetric clear spaces (<4mm) across the ankle joint.",
    searchKeywords: ["tibia", "shin", "leg", "lower", "calf", "ankle", "knee", "malleolus", "plateau"]
  },
  {
    id: "fibula",
    name: "Fibula (Calf Bone)",
    description: "The slender, lateral bone of the lower leg, running parallel to the tibia.",
    function: "Does not bear significant weight, but serves as an anchor for lower leg muscles and forms the lateral wall of the ankle mortise (the lateral malleolus), providing vital ankle joint stability.",
    clinicalImportance: "Maisonneuve fracture is a proximal fibula fracture caused by an ankle eversion injury, where the rotational force travels up the leg, tearing the interosseous membrane.",
    radiographicAppearance: "Shows as a thin bone lateral to the tibia. Ensure the distal tibiofibular syndesmosis is intact and the distal fibular notch is perfectly seated.",
    searchKeywords: ["fibula", "calf", "leg", "lower", "ankle", "malleolus", "maisonneuve", "lateral"]
  },
  {
    id: "ribs",
    name: "Rib Cage & Sternum (Thoracic Cage)",
    description: "The rib cage (12 pairs of ribs) and flat breastbone (sternum) forming the protective osteocartilaginous thorax.",
    function: "Protects vital thoracic organs (heart, lungs, major blood vessels), supports the pectoral girdle, and performs respiration by expanding and contracting via intercostal muscle activity.",
    clinicalImportance: "Rib fractures (commonly ribs 4-9) can cause pneumothorax, hemothorax, or splenic/liver lacerations. A 'Flail Chest' (three or more ribs broken in two or more places) causes life-threatening paradoxical chest wall movement.",
    radiographicAppearance: "PA chest views require full inspiration showing at least 10 posterior ribs. Sternal views require oblique positioning (RAO) to cast the sternum over the radiolucent heart shadow rather than the spine.",
    searchKeywords: ["ribs", "rib", "sternum", "thorax", "breastbone", "chest", "lungs", "heart", "manubrium", "xiphoid"]
  }
];

// Smart bone classifier using mesh name mapping with fallback to normalized spatial/height boundaries
const mapMeshToBoneId = (mesh: THREE.Mesh, modelBox: THREE.Box3, modelSize: THREE.Vector3): string => {
  const nameLower = (mesh.name || "").toLowerCase();

  // 1. Precise name-based mapping
  if (nameLower.includes("skull") || nameLower.includes("cranium") || nameLower.includes("head") || nameLower.includes("mandible") || nameLower.includes("jaw")) {
    return "skull";
  } else if (nameLower.includes("cervical") || nameLower.includes("neck")) {
    return "cervical";
  } else if (nameLower.includes("thoracic")) {
    return "thoracic";
  } else if (nameLower.includes("lumbar")) {
    return "lumbar";
  } else if (nameLower.includes("pelvis") || nameLower.includes("hip") || nameLower.includes("sacrum") || nameLower.includes("coxal") || nameLower.includes("ilium") || nameLower.includes("ischium") || nameLower.includes("pubis")) {
    return "pelvis";
  } else if (nameLower.includes("clavicle") || nameLower.includes("collar")) {
    return "clavicle";
  } else if (nameLower.includes("scapula") || nameLower.includes("shoulder blade")) {
    return "scapula";
  } else if (nameLower.includes("humerus") || nameLower.includes("arm")) {
    return "humerus";
  } else if (nameLower.includes("radius")) {
    return "radius";
  } else if (nameLower.includes("ulna")) {
    return "ulna";
  } else if (nameLower.includes("femur") || nameLower.includes("thigh")) {
    return "femur";
  } else if (nameLower.includes("tibia") || nameLower.includes("shin")) {
    return "tibia";
  } else if (nameLower.includes("fibula") || nameLower.includes("calf")) {
    return "fibula";
  } else if (nameLower.includes("rib") || nameLower.includes("sternum") || nameLower.includes("chest") || nameLower.includes("costal")) {
    return "ribs";
  }

  // 2. Spatial relative height & width mapping fallback (for generic OBJ meshes)
  const meshBox = new THREE.Box3().setFromObject(mesh);
  const meshCenter = meshBox.getCenter(new THREE.Vector3());
  
  const height = modelSize.y;
  const relY = height > 0 ? (meshCenter.y - modelBox.min.y) / height : 0.5;

  const halfWidth = modelSize.x / 2;
  const relX = halfWidth > 0 ? Math.abs(meshCenter.x - (modelBox.min.x + halfWidth)) / halfWidth : 0;

  if (relY >= 0.82) {
    return "skull";
  } else if (relY >= 0.74 && relY < 0.82) {
    return relX <= 0.25 ? "cervical" : "clavicle";
  } else if (relY >= 0.45 && relY < 0.74) {
    if (relX > 0.45) return "humerus";
    if (relX > 0.25) return "scapula";
    return "ribs";
  } else if (relY >= 0.30 && relY < 0.45) {
    if (relX > 0.40) return "radius"; // forearm
    if (relX > 0.15) return "pelvis";
    return "lumbar";
  } else if (relY >= 0.12 && relY < 0.30) {
    return "femur";
  } else {
    return relX > 0.25 ? "fibula" : "tibia";
  }
};

export default function SkeletonViewer() {
  const [selectedBoneId, setSelectedBoneId] = useState<string>("skull");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [collimatorSize, setCollimatorSize] = useState<number>(80);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [modelType, setModelType] = useState<"glb" | "obj" | "missing">("obj");
  const [activePreset, setActivePreset] = useState<string>("AP");
  const [yaw, setYaw] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedMtlContent, setUploadedMtlContent] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js object references stored in refs for stable callback access
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const meshesMapRef = useRef<{ [key: string]: THREE.Mesh[] }>({});

  const selectedBone = boneDatabase.find(b => b.id === selectedBoneId) || boneDatabase[0];

  // Highlighting bone logic
  const applySelectionHighlight = (boneId: string) => {
    const meshesMap = meshesMapRef.current;
    
    const normalMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.5,
      metalness: 0.1,
    });

    const highlightMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Glowing Cyan
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x0891b2,
      emissiveIntensity: 0.85,
    });

    // Reset all meshes to normal
    Object.keys(meshesMap).forEach((id) => {
      meshesMap[id].forEach((mesh) => {
        mesh.material = normalMat;
      });
    });

    // Apply glow highlight to matching meshes
    if (meshesMap[boneId]) {
      meshesMap[boneId].forEach((mesh) => {
        mesh.material = highlightMat;
      });
    }
  };

  // Preset cameras
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    // Reset look at target to skeleton mid center
    controls.target.set(0, -0.2, 0);

    switch (presetName) {
      case "AP": // Anterior-Posterior (Front)
        camera.position.set(0, -0.2, 8.5);
        break;
      case "PA": // Posterior-Anterior (Back)
        camera.position.set(0, -0.2, -8.5);
        break;
      case "LAT": // Lateral (Side profile)
        camera.position.set(8.5, -0.2, 0);
        break;
      case "OBL": // Oblique
        camera.position.set(6, 2.5, 6);
        break;
      case "SKY": // Skyline / Top-Down
        camera.position.set(0, 9.5, 0.1);
        controls.target.set(0, -1, 0);
        break;
      default:
        break;
    }
    controls.update();
  };

  // Interactive zoom
  const zoomIn = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      camera.position.multiplyScalar(0.85);
      controls.update();
    }
  };

  const zoomOut = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      camera.position.multiplyScalar(1.15);
      controls.update();
    }
  };

  const resetView = () => {
    applyPreset("AP");
  };

  const loadLocalFiles = (files: FileList | File[]) => {
    setLoadError(null);
    let objFile: File | null = null;
    let mtlFile: File | null = null;
    let glbFile: File | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name.toLowerCase();
      if (name.endsWith(".obj")) {
        objFile = file;
      } else if (name.endsWith(".mtl")) {
        mtlFile = file;
      } else if (name.endsWith(".glb") || name.endsWith(".gltf")) {
        glbFile = file;
      }
    }

    if (!objFile && !glbFile) {
      if (mtlFile) {
        setLoadError("Please select both the OBJ and the MTL file together.");
      } else {
        setLoadError("Please upload a valid anatomical skeleton OBJ or GLB model.");
      }
      return;
    }

    if (glbFile) {
      const url = URL.createObjectURL(glbFile);
      setUploadedFileUrl(url);
      setUploadedMtlContent(null);
      setUploadedFileName(glbFile.name);
      setModelType("glb");
    } else if (objFile) {
      const objUrl = URL.createObjectURL(objFile);
      setUploadedFileUrl(objUrl);
      setUploadedFileName(objFile.name);
      setModelType("obj");

      if (mtlFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setUploadedMtlContent(text);
        };
        reader.onerror = () => {
          console.warn("Could not read MTL file.");
          setUploadedMtlContent(null);
        };
        reader.readAsText(mtlFile);
      } else {
        setUploadedMtlContent(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      loadLocalFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      loadLocalFiles(files);
    }
  };

  // Set up three.js WebGL rendering loop (runs once on mount)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Slate-950
    sceneRef.current = scene;

    // 2. Camera
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight || 1;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, -0.2, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights
    // Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Directional Front Key Light
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.6);
    frontLight.position.set(3, 4, 8);
    frontLight.castShadow = true;
    frontLight.shadow.mapSize.width = 1024;
    frontLight.shadow.mapSize.height = 1024;
    scene.add(frontLight);

    // Directional Back / Rim Fill Light
    const backLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    backLight.position.set(-3, 2, -6);
    scene.add(backLight);

    // Soft Floor shadow bounce light
    const floorLight = new THREE.DirectionalLight(0x0e7490, 0.4);
    floorLight.position.set(0, -5, 0);
    scene.add(floorLight);

    // Side Fill Lights
    const leftFillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    leftFillLight.position.set(-6, 3, 2);
    scene.add(leftFillLight);

    const rightFillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rightFillLight.position.set(6, 3, 2);
    scene.add(rightFillLight);

    // Grid helper for stable visual depth (ensures scene is never empty)
    const gridHelper = new THREE.GridHelper(12, 24, 0x0891b2, 0x1e293b);
    gridHelper.position.y = -3.8;
    scene.add(gridHelper);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05; // avoid complete flip
    controls.minDistance = 2.5;
    controls.maxDistance = 25;
    controls.target.set(0, -0.2, 0);
    controlsRef.current = controls;

    // 6. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();

      // Read rotation status to update stats HUD
      if (cameraRef.current) {
        const spherical = new THREE.Spherical().setFromVector3(cameraRef.current.position);
        setYaw((spherical.theta * 180) / Math.PI);
        setPitch((spherical.phi * 180) / Math.PI - 90);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height || 450;
        
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Separate Effect to load and parse the 3D model whenever URL or type changes
  useEffect(() => {
    const scene = sceneRef.current;
    const modelGroup = modelGroupRef.current;
    if (!scene || !modelGroup) return;

    // Clear previous model children
    while (modelGroup.children.length > 0) {
      modelGroup.remove(modelGroup.children[0]);
    }

    // Reset meshes maps
    const meshesMap: { [key: string]: THREE.Mesh[] } = {};
    meshesMapRef.current = meshesMap;

    setLoadError(null);

    if (!uploadedFileUrl) {
      // If no file uploaded, show uploader zone and do not try to load default non-existent path
      setModelType("missing");
      setIsModelLoading(false);
      return;
    }

    setIsModelLoading(true);

    const isGlb = uploadedFileUrl.toLowerCase().includes(".glb") || uploadedFileUrl.toLowerCase().includes(".gltf") || modelType === "glb";

    const defaultBoneMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3f0, // Clean clinical off-white bone tone
      roughness: 0.65,
      metalness: 0.05,
    });

    const onModelLoaded = (model: THREE.Group | THREE.Object3D) => {
      modelGroup.add(model);
      setIsModelLoading(false);
      setLoadError(null);

      // Compute bounding box for smart spatial fallback mapping
      const modelBox = new THREE.Box3().setFromObject(model);
      const modelSize = modelBox.getSize(new THREE.Vector3());

      // Parse and map meshes to keys
      model.traverse((child) => {
        if ((child as any).isMesh) {
          const mesh = child as THREE.Mesh;
          // Only apply standard material if MTL was not used
          if (!uploadedMtlContent) {
            mesh.material = defaultBoneMat.clone();
          }
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Resolve which bone this mesh represents
          const matchedId = mapMeshToBoneId(mesh, modelBox, modelSize);

          if (matchedId) {
            mesh.userData = { boneId: matchedId };
            if (!meshesMap[matchedId]) {
              meshesMap[matchedId] = [];
            }
            meshesMap[matchedId].push(mesh);
          }
        }
      });

      // 1. Re-center model perfectly to origin (0, 0, 0)
      const box = new THREE.Box3().setFromObject(model);
      const sizeBox = box.getSize(new THREE.Vector3());
      const centerBox = box.getCenter(new THREE.Vector3());

      model.position.x += (model.position.x - centerBox.x);
      model.position.y += (model.position.y - centerBox.y);
      model.position.z += (model.position.z - centerBox.z);

      // 2. Scale the model automatically so that its largest dimension matches 7.2 units
      const maxDim = Math.max(sizeBox.x, sizeBox.y, sizeBox.z);
      if (maxDim > 0) {
        const scaleFactor = 7.2 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      // 3. Auto-fit the camera & update controls for standard focus
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (camera && controls) {
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(7.2 / 2 / Math.tan(fov / 2));
        cameraZ *= 1.45; // Generous framing padding

        camera.position.set(0, 0, cameraZ);
        controls.target.set(0, 0, 0);
        
        camera.near = 0.1;
        camera.far = 100;
        camera.updateProjectionMatrix();

        controls.minDistance = 2.0;
        controls.maxDistance = 25;
        controls.update();
      }

      applySelectionHighlight(selectedBoneId);
    };

    if (isGlb) {
      const loader = new GLTFLoader();
      loader.load(
        uploadedFileUrl,
        (gltf) => {
          setModelType("glb");
          onModelLoaded(gltf.scene);
        },
        undefined,
        (err) => {
          console.warn("Could not load GLB model.", err);
          setLoadError("The GLB model could not be parsed. Please verify the file structure is correct.");
          setIsModelLoading(false);
          setModelType("missing");
        }
      );
    } else {
      const loader = new OBJLoader();
      if (uploadedMtlContent) {
        try {
          const mtlLoader = new MTLLoader();
          const materials = mtlLoader.parse(uploadedMtlContent, "");
          materials.preload();
          loader.setMaterials(materials);
        } catch (mtlErr) {
          console.warn("Could not parse MTL file materials.", mtlErr);
        }
      }

      loader.load(
        uploadedFileUrl,
        (obj) => {
          setModelType("obj");
          onModelLoaded(obj);
        },
        undefined,
        (err) => {
          console.warn("Could not load OBJ model.", err);
          setLoadError("The OBJ model could not be parsed. Please check if the file is valid and uncorrupted.");
          setIsModelLoading(false);
        }
      );
    }
  }, [uploadedFileUrl, uploadedMtlContent]);

  // Sync selection highlights
  useEffect(() => {
    applySelectionHighlight(selectedBoneId);
  }, [selectedBoneId, isModelLoading, modelType]);

  // Click on canvas raycasting selection
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    if (modelGroupRef.current) {
      const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);

      if (intersects.length > 0) {
        let clickedObj: THREE.Object3D | null = intersects[0].object;
        let boneId = clickedObj.userData?.boneId;

        // Traverse up hierarchy if we hit submeshes
        while (clickedObj && !boneId) {
          clickedObj = clickedObj.parent;
          if (clickedObj) {
            boneId = clickedObj.userData?.boneId;
          }
        }

        if (boneId) {
          setSelectedBoneId(boneId);
        }
      }
    }
  };

  // Handles search filtering
  const filteredBones = searchQuery.trim() === "" 
    ? boneDatabase 
    : boneDatabase.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.searchKeywords.some(keyword => keyword.includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
      
      {/* 1. Header with Active Angle / Yaw Pitch telemetry feedback */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-lg uppercase tracking-wider block w-max mb-1.5">
            Photorealistic 3D WebGL Engine
          </span>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500 animate-pulse" />
            Interactive 3D Anatomy Skeleton Viewer
          </h3>
          <p className="text-xs text-slate-400">
            Select skeletal bones via direct 3D interaction, keyword searching, or preset position tiles to evaluate key radiographic profiles.
          </p>
        </div>

        {/* Telemetry display and Re-upload button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-900 text-[11px] font-mono shadow-sm">
            <div className="text-slate-500">
              Yaw: <span className="text-blue-600 dark:text-cyan-400 font-bold">{Math.round(yaw)}°</span>
            </div>
            <div className="text-slate-300 dark:text-slate-850">|</div>
            <div className="text-slate-500">
              Tilt: <span className="text-amber-500 font-bold">{Math.round(pitch)}°</span>
            </div>
            <div className="text-slate-300 dark:text-slate-850">|</div>
            <div className="text-slate-500 flex items-center gap-1.5">
              Render: <span className={`${modelType !== "missing" ? "text-emerald-500" : "text-rose-500"} font-bold uppercase tracking-wide`}>
                {modelType === "obj" ? "Photorealistic OBJ" : modelType === "glb" ? "Photorealistic GLB" : "Missing Model"}
              </span>
            </div>
            {uploadedFileName && (
              <>
                <div className="text-slate-300 dark:text-slate-850">|</div>
                <div className="text-slate-500 max-w-[150px] truncate" title={uploadedFileName}>
                  File: <span className="text-cyan-500 font-bold">{uploadedFileName}</span>
                </div>
              </>
            )}
          </div>

          <label className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md select-none border border-cyan-500/25">
            <Upload className="w-4 h-4 text-cyan-200" />
            <span>Re-upload Model</span>
            <input 
              type="file" 
              accept=".obj,.mtl,.glb,.gltf" 
              multiple
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      </div>

      {/* 2. Interactive Search Bar for Bones */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search bone (e.g. skull, clavicle, femur, cervical, tibia...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all pl-10 pr-4 shadow-sm"
        />
        {searchQuery.trim() !== "" && (
          <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
            {filteredBones.length > 0 ? (
              filteredBones.map((bone) => (
                <button
                   key={bone.id}
                  onClick={() => {
                    setSelectedBoneId(bone.id);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">{bone.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Select 3D</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400">No skeletal bones match your search</div>
            )}
          </div>
        )}
      </div>

      {/* 3. Primary 3D Viewer Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column Interactive WebGL Canvas stage */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm relative overflow-hidden">
          
          {/* Preset Buttons Overlay top left */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="flex bg-slate-100/90 dark:bg-slate-900/95 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-md max-w-max gap-1 backdrop-blur-sm">
              {["AP", "PA", "LAT", "OBL", "SKY"].map(pres => (
                <button
                  key={pres}
                  onClick={() => applyPreset(pres)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    activePreset === pres
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  {pres}
                </button>
              ))}
            </div>

            {/* Grid display switcher */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 w-max transition-all shadow-md backdrop-blur-sm cursor-pointer ${
                showGrid 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800/60" 
                  : "bg-slate-100/90 border-slate-200 text-slate-500 dark:bg-slate-900/95 dark:border-slate-800"
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              {showGrid ? "Collimator Active" : "Beam Grid Hidden"}
            </button>
          </div>

          {/* Collimator HUD controls right side */}
          {showGrid && (
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1 text-[10px] bg-slate-900/85 backdrop-blur-sm p-3 rounded-2xl text-slate-200 border border-slate-700/50 max-w-[150px] shadow-lg">
              <span className="font-bold text-cyan-400 uppercase tracking-wide block mb-1">X-Ray Beam HUD</span>
              <span className="text-[9px] block text-slate-400">Collimation Field Size</span>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={collimatorSize}
                onChange={(e) => setCollimatorSize(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[9px] text-slate-400 mt-1 block">Focal Spot Dist: <strong className="text-white">100cm (SID)</strong></span>
            </div>
          )}

          {/* Interactive 3D Canvas Area */}
          <div
            id="skeleton-3d-stage"
            ref={containerRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full aspect-square bg-slate-950 rounded-2xl border relative flex items-center justify-center overflow-hidden min-h-[400px] sm:min-h-[450px] transition-all ${
              isDraggingOver 
                ? "border-cyan-450 ring-2 ring-cyan-500/25 bg-slate-900" 
                : "border-slate-150 dark:border-slate-900"
            }`}
          >
            {isModelLoading && (
              <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Loading Interactive 3D Model...
                </h4>
                <p className="text-[10px] text-slate-400 max-w-xs mt-1.5">
                  Parsing skeletal meshes & initializing custom WebGL shaders.
                </p>
              </div>
            )}

            {modelType === "missing" && (
              <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl m-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-4 text-cyan-400">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive 3D Anatomy Uploader
                </h4>
                <p className="text-xs text-slate-350 max-w-sm mt-2 font-semibold">
                  Please upload a valid anatomical skeleton OBJ model.
                </p>
                <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                  Drag and drop your <code className="text-slate-300">.obj</code> & <code className="text-slate-300">.mtl</code> files together here, or click below to browse.
                </p>
                
                <label className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5">
                  <FileUp className="w-3.5 h-3.5" />
                  Select Model Files (OBJ/MTL)
                  <input 
                    type="file" 
                    accept=".obj,.mtl,.glb,.gltf" 
                    multiple
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 z-25 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-rose-850 rounded-2xl m-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-4 text-rose-450">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Model Loading Error
                </h4>
                <p className="text-xs text-rose-300 max-w-sm mt-2 font-semibold">
                  {loadError}
                </p>
                <button
                  onClick={() => {
                    setUploadedFileUrl(null);
                    setUploadedMtlContent(null);
                    setUploadedFileName("");
                    setLoadError(null);
                    setModelType("obj");
                  }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md"
                >
                  Reset & Try Again
                </button>
              </div>
            )}

            {/* Actual Three.js WebGL Canvas */}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`w-full h-full cursor-grab active:cursor-grabbing ${modelType === "missing" ? "hidden" : "block"}`}
            />

            {/* Custom Collimator Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                {/* Outer concentric laser circle */}
                <div 
                  className="rounded-full border border-blue-500/20 dark:border-cyan-500/15 border-dashed transition-all"
                  style={{ width: `${collimatorSize * 2.8}px`, height: `${collimatorSize * 2.8}px` }}
                />
                {/* Central targeting cross */}
                <div className="absolute w-[8px] h-[8px] bg-cyan-400/20 rounded-full border border-cyan-400/50" />
                <div className="absolute w-[2px] h-32 bg-cyan-500/10" />
                <div className="absolute h-[2px] w-32 bg-cyan-500/10" />
              </div>
            )}

            {/* Zoom / Reset Tool buttons */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/50 shadow-lg backdrop-blur-sm items-center">
              <label 
                title="Upload / Change 3D Model File"
                className="p-1.5 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                <Upload className="w-4 h-4" />
                <input 
                  type="file" 
                  accept=".obj,.mtl,.glb,.gltf" 
                  multiple
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
              <div className="w-[1px] h-4 bg-slate-800 mx-1" />
              <button 
                onClick={zoomIn} 
                title="Zoom In"
                className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={zoomOut} 
                title="Zoom Out"
                className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={resetView} 
                title="Reset View"
                className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 font-medium bg-slate-900/90 text-white px-3 py-1.5 rounded-full pointer-events-none select-none font-mono tracking-wide shadow-md border border-slate-800 z-10 flex items-center gap-1.5">
              <Move className="w-3 h-3 text-cyan-400 animate-bounce" />
              DRAG TO ROTATE  |  SCROLL TO ZOOM  |  CLICK BONE TO ANALYZE
            </div>
          </div>
        </div>

        {/* Right Column Clinical Pathology & Exam Insights */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm min-h-[420px]">
          {selectedBone ? (
            <div className="space-y-4">
              
              {/* Bone Name Header */}
              <div className="border-b border-slate-150 dark:border-slate-850 pb-3">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">
                  Selected Bone Hotspot
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
                  {selectedBone.name}
                </h4>
              </div>

              {/* Anatomy Overview Description */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[9px]">
                  Description
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                  {selectedBone.description}
                </p>
              </div>

              {/* Bone Function */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[9px]">
                  Anatomical Function
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                  {selectedBone.function}
                </p>
              </div>

              {/* Clinical Importance */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Clinical Pathology & Fractures
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed bg-rose-50/15 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-rose-100/50 dark:border-slate-800">
                  {selectedBone.clinicalImportance}
                </p>
              </div>

              {/* Radiographic Appearance */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-blue-600 dark:text-cyan-400 block uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Radiographic Appearance & Views
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed bg-blue-50/20 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-blue-100/50 dark:border-slate-800">
                  {selectedBone.radiographicAppearance}
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <Compass className="w-10 h-10 text-slate-300 animate-spin mb-3" />
              <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                Select Bone Segment
              </h5>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Click any part of the 3D skeleton model or use the search bar to review essential anatomical properties, clinical pathology guidelines, and x-ray projections.
              </p>
            </div>
          )}

          {/* Quick clinical recommendation footer alert */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-normal flex items-start gap-2.5 mt-4 shadow-inner">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Syllabus Note:</strong> Radiographers must position landmarks precisely within the central collimated ray. Use the X-Ray Collimator HUD slider to customize the beam alignment and reduce scattering.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
