/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { AnatomicalStructure } from "./anatomyData";

export interface EnrichedStructure {
  id: string;
  name: string;
  scientificName: string;
  commonName: string;
  system: string;
  region: string;
  overview: string;
  location: string;
  boundaries: string;
  relations: string;
  bloodSupply: string;
  nerveSupply: string;
  lymphaticDrainage: string;
  function: string;
  surfaceAnatomy: string;
  clinicalImportance: string;
  commonDiseases: string;
  radiologicalAppearance: string;
  xrayView: string;
  ctAppearance: string;
  mriAppearance: string;
  commonExamQuestions: { question: string; answer: string }[];
  importantMcqs: { question: string; options: string[]; correctIndex: number; explanation: string }[];
  relatedStructures: string[];
}

// Custom curated databases for popular structures
const curatedDetails: Record<string, Partial<EnrichedStructure>> = {
  skull: {
    scientificName: "Cranium",
    commonName: "Skull",
    location: "Head region, superior to the first cervical vertebra (C1 / Atlas).",
    boundaries: "Anteriorly bounded by the facial skeleton (viscerocranium), superiorly by the cranial vault (calvaria), posteriorly by the occipital bone, and inferiorly by the cranial base.",
    relations: "Houses and protects the brain, meninges, cranial nerves (CN I-XII), and cerebral vessels. Articulates inferiorly with the vertebral column.",
    lymphaticDrainage: "Drains into the parotid, retroauricular, occipital, and deep cervical lymph node chains.",
    function: "Protects the brain and special sensory organs (eyes, inner ear, olfactory system). Provides attachment points for muscles of facial expression and mastication.",
    surfaceAnatomy: "Key palpable landmarks include the mastoid process, supraorbital notch, external occipital protuberance (Inion), zygomatic arch, and pterion.",
    commonDiseases: "Basilar skull fractures, craniosynostosis, osteomyelitis, Paget's disease, epidural and subdural hematomas, cranial bone tumors.",
    commonExamQuestions: [
      {
        question: "Describe the clinical significance of the pterion.",
        answer: "The pterion is an H-shaped junction of the frontal, parietal, temporal, and sphenoid bones. It is the thinnest part of the skull and overlies the anterior branch of the middle meningeal artery. Fractures here can lead to an epidural hematoma."
      },
      {
        question: "What structures pass through the foramen magnum?",
        answer: "The medulla oblongata (continuous with the spinal cord), vertebral arteries, spinal accessory nerve (CN XI), anterior and posterior spinal arteries, and dural membranes."
      }
    ]
  },
  mandible: {
    scientificName: "Mandibula",
    commonName: "Lower Jawbone",
    location: "Inferior facial skeleton, articulating with the temporal bone at the temporomandibular joint (TMJ).",
    boundaries: "Articulates superiorly with the mandibular fossa of the temporal bone. It forms the lower boundary of the oral cavity.",
    relations: "Relates superiorly to the maxillary teeth. Lies lateral to the submandibular and sublingual salivary glands and the lingual nerve.",
    lymphaticDrainage: "Drains into the submental lymph nodes (from the chin/incisors) and submandibular lymph nodes, eventually leading to deep cervical lymph nodes.",
    function: "Facilitates mastication (chewing) by moving against the maxilla. Supports lower dentition and plays a critical role in articulation of speech.",
    surfaceAnatomy: "Subcutaneously palpable along the entire lower jaw margin, including the symphysis menti, angle of the mandible, ramus, and condylar head.",
    commonDiseases: "Mandibular fractures (frequently double due to ring shape), temporomandibular joint (TMJ) dislocation/arthritis, ameloblastoma, dental infections.",
    commonExamQuestions: [
      {
        question: "Why do mandibular fractures frequently occur in multiple locations?",
        answer: "The mandible forms a rigid ring-like structure with the skull base. Traumatic force applied to one side often travels along the bone ring, causing a fracture at the impact site (e.g., symphysis) and a contralateral fracture (e.g., condylar neck)."
      },
      {
        question: "What is the anatomical significance of the mandibular foramen?",
        answer: "The mandibular foramen lies on the medial aspect of the ramus, transmitting the inferior alveolar nerve and vessels. This is the anatomical target for the inferior alveolar nerve block (dental anesthesia)."
      }
    ]
  },
  clavicle: {
    scientificName: "Clavicula",
    commonName: "Collarbone",
    location: "Anterior shoulder girdle, extending horizontally across the lower neck line.",
    boundaries: "Articulates medially with the manubrium of the sternum (sternoclavicular joint) and laterally with the acromion of the scapula (acromioclavicular joint).",
    relations: "Lies superior to the first rib, subclavian artery, subclavian vein, and the trunks of the brachial plexus. Separates the neck from the axilla.",
    lymphaticDrainage: "Drains into the supraclavicular, cervical, and apical axillary lymph nodes.",
    function: "Acts as a strut holding the scapula and upper limb away from the ribcage, maximizing arm range of motion. Transmits physical forces from the arm to the axial skeleton.",
    surfaceAnatomy: "Subcutaneously palpable along its entire S-shaped length across the upper chest.",
    commonDiseases: "Clavicle fractures (most common pediatric/trauma fracture), acromioclavicular joint separation (shoulder separation), sternoclavicular dislocation.",
    commonExamQuestions: [
      {
        question: "Explain why clavicular fractures most commonly occur at the junction of the middle and lateral thirds.",
        answer: "The junction of the middle and lateral thirds is the thinnest part of the bone, where the bone transitions from its tubular shape (medial two-thirds) to its flat shape (lateral third). It also lacks muscular or robust ligamentous reinforcement in this specific zone."
      },
      {
        question: "What ligaments stabilize the acromioclavicular and coracoclavicular joints?",
        answer: "The acromioclavicular ligament stabilizes the AC joint capsule. The coracoclavicular ligament (consisting of the conoid and trapezoid ligaments) provides vertical suspension and is key to preventing shoulder separation."
      }
    ]
  },
  scapula: {
    scientificName: "Scapula",
    commonName: "Shoulder Blade",
    location: "Posterolateral aspect of the thoracic cage, overlying ribs 2 through 7.",
    boundaries: "Articulates laterally with the head of the humerus (glenohumeral joint) and superiorly with the lateral clavicle.",
    relations: "Relates anteriorly to the ribs via the subscapularis and serratus anterior muscles. Relates posteriorly to the trapezius, deltoid, supraspinatus, and infraspinatus.",
    lymphaticDrainage: "Drains into the subscapular and apical axillary lymph nodes.",
    function: "Provides a highly mobile base for the upper limb. Serves as origin and insertion for 17 muscles controlling shoulder motion and stability.",
    surfaceAnatomy: "Palpable landmarks include the medial border, inferior angle (corresponds to T7 spinous process), scapular spine, and acromion process.",
    commonDiseases: "Winging of the scapula, scapular fractures (highly rare, indicative of high-energy trauma), snapping scapula syndrome, glenohumeral dislocation.",
    commonExamQuestions: [
      {
        question: "Explain the anatomical basis of a 'winged scapula'.",
        answer: "A winged scapula is caused by injury to the long thoracic nerve, which innervates the serratus anterior muscle. When paralyzed, the serratus anterior cannot hold the medial border of the scapula flat against the thoracic wall, causing it to protrude outward when the patient pushes against a wall."
      }
    ]
  },
  femur: {
    scientificName: "Os Femoris",
    commonName: "Thigh Bone",
    location: "Thigh region, articulating proximally with the pelvis and distally with the tibia and patella.",
    boundaries: "Proximally enters the acetabulum of the pelvis. Distally articulates with the tibial plateaus and patellar groove.",
    relations: "Surrounded by heavy thigh musculature (quadriceps anteriorly, hamstrings posteriorly, adductors medially). The femoral vessels run along its anteromedial aspect in the femoral canal.",
    lymphaticDrainage: "Drains into the deep inguinal and external iliac lymph nodes.",
    function: "Supports the entire weight of the upper body. Acts as a lever arm for locomotion, walking, running, and jumping.",
    surfaceAnatomy: "The greater trochanter is palpable laterally. Proximally the head is deep; distally, the medial and lateral epicondyles are palpable at the knee.",
    commonDiseases: "Femoral neck fractures (high risk of avascular necrosis), distal shaft fractures, osteoarthritis of the hip/knee, avascular necrosis (AVN) of the femoral head.",
    commonExamQuestions: [
      {
        question: "Why do intracapsular femoral neck fractures carry a high risk of avascular necrosis (AVN)?",
        answer: "The primary blood supply to the femoral head runs retrograde through the retinacular vessels, which are branches of the medial circumflex femoral artery. Intracapsular fractures frequently tear these retinacular vessels, cutting off the main blood supply to the head and causing necrosis."
      }
    ]
  },
  heart: {
    scientificName: "Cor",
    commonName: "Heart",
    location: "Middle mediastinum of the thorax, between the pleural cavities.",
    boundaries: "Anteriorly bounded by the sternum and ribs 3-5, posteriorly by thoracic vertebrae T5-T8, inferiorly by the diaphragm, and superiorly by the great vessels.",
    relations: "Flanked laterally by the lungs. Lies immediately superior to the central tendon of the diaphragm and anterior to the esophagus and thoracic aorta.",
    lymphaticDrainage: "Drains into the tracheobronchial and mediastinal lymph node groups.",
    function: "Pumps oxygenated blood to the systemic circulation and deoxygenated blood to the pulmonary circulation.",
    surfaceAnatomy: "Apex beat is palpable in the left 5th intercostal space, along the midclavicular line. Sternal borders mark cardiac valves.",
    commonDiseases: "Coronary artery disease (CAD), myocardial infarction (MI), congestive heart failure, infective endocarditis, valvular stenosis/regurgitation, pericarditis.",
    commonExamQuestions: [
      {
        question: "Trace the arterial blood supply of the heart wall.",
        answer: "The coronary arteries (Left and Right) arise from the left and right aortic sinuses of the ascending aorta. The Left Coronary divides into the Left Anterior Descending (LAD) and Circumflex branches. The Right Coronary typically yields the Marginal and Posterior Descending (PDA) arteries."
      }
    ]
  }
};

// Generic generator for categories to build high-quality, clinically accurate text dynamically
export function getEnrichedStructure(s: AnatomicalStructure): EnrichedStructure {
  const curated = curatedDetails[s.id] || {};

  // Standard radiological appearance overview
  const radiologicalAppearance = `${s.name} is standardly evaluated using multi-modality diagnostic imaging. X-rays provide initial bony evaluation, CT provides superior 3D spatial bone detailing, and MRI provides exquisite soft-tissue, nerve, ligament, and bone-marrow signal resolutions.`;

  // Dynamic values based on category
  let systemLabel = "";
  let defaultScientific = s.name;
  let defaultLocation = "";
  let defaultBoundaries = "";
  let defaultRelations = "";
  let defaultLymphatic = "";
  let defaultFunction = "";
  let defaultSurface = "";
  let defaultDiseases = "";
  let defaultExamQuestions = [
    {
      question: `What are the primary clinical indications for performing radiological imaging on the ${s.name}?`,
      answer: `Indications include trauma, severe localized pain, suspected bony fracture, soft tissue swelling, suspected infectious process, or evaluating joint space narrowing in arthritic conditions.`
    },
    {
      question: `Which nerves run adjacent to the ${s.name} and are at high risk of injury during focal trauma or surgical intervention?`,
      answer: `The adjacent neural networks include the ${s.innervation || 'local nerve plexus'}. Compression or laceration leads to peripheral neuropathy, motor deficits, and localized paresthesia.`
    }
  ];

  switch (s.category) {
    case "skeletal":
      systemLabel = "Skeletal System";
      defaultLocation = `Located in the ${s.region} region of the skeletal framework.`;
      defaultBoundaries = `Articulates with adjacent bones in the ${s.region} region to form the skeletal architecture.`;
      defaultRelations = `Provides protective housing for adjacent nerves and vascular networks. Serves as an anchor for overlying skeletal muscle groups.`;
      defaultLymphatic = "Lymphatic drainage from the periosteum drains into the regional lymphatic chains, including deep deep cervical, axillary, or inguinal nodes depending on location.";
      defaultFunction = "Provides rigid structural support, acts as a mechanical lever for skeletal muscles, protects vital organs, and houses red bone marrow for hematopoiesis.";
      defaultSurface = `Palpable along its bony ridges, margins, or epicondyles in the ${s.region} region.`;
      defaultDiseases = `Fractures, osteomyelitis, osteoporosis, bone metastases, Paget's disease, and osteosarcoma.`;
      break;

    case "muscular":
      systemLabel = "Muscular System";
      defaultLocation = `Located in the ${s.region} muscle compartments, crossing one or more joints.`;
      defaultBoundaries = `Extends from its origin point on the bone to its insertion point on the distal skeleton.`;
      defaultRelations = `Lies superficial or deep to adjacent muscle groups, immediately overlying local vascular trunks and peripheral nerves.`;
      defaultLymphatic = "Lymphatic channels travel alongside regional deep venous networks to empty into the closest major deep lymph node clusters.";
      defaultFunction = "Generates active tension to produce movement at articulatory joints, maintains posture, and generates heat through cellular contraction.";
      defaultSurface = "Palpable as a distinct muscular bulge during active concentric contraction or resistive loading.";
      defaultDiseases = "Muscle strains, tears, compartment syndrome, rhabdomyolysis, muscular dystrophy, and focal myositis.";
      break;

    case "joints":
      systemLabel = "Joints & Articulations";
      defaultLocation = `Located in the ${s.region} skeletal system, articulating contiguous bones.`;
      defaultBoundaries = `Enclosed by the fibrous joint capsule and reinforced by extra-capsular and intra-capsular stabilizing ligaments.`;
      defaultRelations = `Relates to overlying motor muscles which cross the joint, and local articular vascular anastomoses.`;
      defaultLymphatic = "Articular synovial lymphatics drain directly into regional deep lymphatic channels.";
      defaultFunction = "Permits fluid multi-axial or uni-axial movement of the skeleton while absorbing biomechanical load and transmitting forces.";
      defaultSurface = "Joint space is palpable at the articulation line, bounded by adjacent bony landmarks.";
      defaultDiseases = "Osteoarthritis, rheumatoid arthritis, gouty arthritis, ligamentous sprains, joint dislocation, and septic arthritis.";
      break;

    case "nervous":
      systemLabel = "Nervous System";
      defaultLocation = `Part of the central or peripheral nervous system located in the ${s.region} region.`;
      defaultBoundaries = `Bounded by protective dural sleeves, bony canals, or surrounding muscular/fascial compartments.`;
      defaultRelations = `Accompanied by corresponding nutrient arteries and venous drainage channels inside neurovascular bundles.`;
      defaultLymphatic = "The central nervous system utilizes glymphatic pathways draining to deep cervical nodes; peripheral nerves drain to regional deep lymph nodes.";
      defaultFunction = "Transmits rapid sensory inputs to the central nervous system and coordinates motor outputs to target organs and skeletal muscles.";
      defaultSurface = "Generally deep and non-palpable, though certain branches can be compressed against bony backdrops (e.g. ulnar nerve at the elbow).";
      defaultDiseases = "Nerve compression syndromes, traumatic neuropathy, demyelinating disease, vascular stroke, and neoplastic neuromas.";
      break;

    default:
      systemLabel = `${s.category.charAt(0).toUpperCase() + s.category.slice(1)} System`;
      defaultLocation = `Situated within the visceral cavities of the ${s.region}.`;
      defaultBoundaries = `Contained within its respective anatomical compartment (mediastinum, peritoneal cavity, retroperitoneum, or pelvis).`;
      defaultRelations = `Relates to surrounding visceral organs, great vessels, and autonomic nerve plexuses.`;
      defaultLymphatic = "Visceral lymphatic channels drain into primary, secondary, and tertiary regional nodal stations.";
      defaultFunction = "Supports critical physiological homeostatic processes, metabolism, respiration, circulation, or excretion.";
      defaultSurface = "Projects onto the surface abdominal or chest wall quadrants (surface projection mapping).";
      defaultDiseases = "Inflammatory processes, ischemia/infarction, primary adenocarcinoma, and congenital malformations.";
      break;
  }

  return {
    id: s.id,
    name: s.name,
    scientificName: curated.scientificName || defaultScientific,
    commonName: curated.commonName || s.name.replace(/\(.*?\)/g, "").trim(),
    system: systemLabel,
    region: s.region,
    overview: s.description,
    location: curated.location || defaultLocation,
    boundaries: curated.boundaries || defaultBoundaries,
    relations: curated.relations || defaultRelations,
    bloodSupply: s.bloodSupply,
    nerveSupply: s.innervation,
    lymphaticDrainage: curated.lymphaticDrainage || defaultLymphatic,
    function: curated.function || defaultFunction,
    surfaceAnatomy: curated.surfaceAnatomy || defaultSurface,
    clinicalImportance: s.clinicalImportance,
    commonDiseases: curated.commonDiseases || defaultDiseases,
    radiologicalAppearance,
    xrayView: s.radiologyAppearance.xrayPosition,
    ctAppearance: s.radiologyAppearance.ctAppearance,
    mriAppearance: s.radiologyAppearance.mriAppearance,
    commonExamQuestions: curated.commonExamQuestions || defaultExamQuestions,
    importantMcqs: s.quizQuestions,
    relatedStructures: s.relatedStructures
  };
}
