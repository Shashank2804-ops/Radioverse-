/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnatomicalStructure {
  id: string;
  name: string;
  category: "skeletal" | "muscular" | "joints" | "nervous" | "cardiovascular" | "respiratory" | "digestive" | "urinary" | "reproductive";
  region: "Head & Neck" | "Thorax" | "Upper Limb" | "Lower Limb" | "Abdomen" | "Pelvis" | "General";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  studyTime: string;
  description: string;
  attachments?: string; // Origin, Insertion, or physical connections
  bloodSupply: string;
  innervation: string;
  clinicalImportance: string;
  radiologyAppearance: {
    xrayPosition: string;
    ctAppearance: string;
    mriAppearance: string;
  };
  relatedStructures: string[]; // List of structure IDs
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const anatomicalStructures: AnatomicalStructure[] = [
  // ==========================================
  // 1. SKELETAL SYSTEM
  // ==========================================
  {
    id: "skull",
    name: "Skull (Cranium)",
    category: "skeletal",
    region: "Head & Neck",
    difficulty: "Intermediate",
    studyTime: "15 mins",
    description: "The complex bony framework of the head, composed of 22 bones divided into the neurocranium (which encloses the brain) and the viscerocranium (facial skeleton).",
    attachments: "Provides attachment points for temporalis, masseter, and facial muscles. Articulates with the atlas (C1) at the occipital condyles.",
    bloodSupply: "Middle meningeal, superficial temporal, and occipital arteries.",
    innervation: "Trigeminal nerve (CN V) for sensory; facial nerve (CN VII) for facial expression motor control.",
    clinicalImportance: "Basilar skull fractures can lead to cerebrospinal fluid (CSF) leaks from ears or nose. Epidural hematoma is often caused by middle meningeal artery laceration.",
    radiologyAppearance: {
      xrayPosition: "Standard skull series: Caldwell view (PA, 15° caudal tilt) for frontal sinuses, Townes view (AP, 30° caudal tilt) for posterior fossa, and Lateral projection.",
      ctAppearance: "High-resolution bone window (+2000 HU) clearly shows fracture lines, suture separation, and intracranial air.",
      mriAppearance: "Cortical bone appears as a dark signal void on both T1 and T2 sequences. Brain tissue detail is highly resolved."
    },
    relatedStructures: ["mandible", "brain", "spinal-cord"],
    quizQuestions: [
      {
        question: "Which cranial landmark is a weak point where frontal, parietal, temporal, and sphenoid bones meet?",
        options: ["Pterion", "Lambda", "Bregma", "Asterion"],
        correctIndex: 0,
        explanation: "The pterion is the junction of these four bones. It lies over the middle meningeal artery; fracturing it can cause a life-threatening epidural hematoma."
      }
    ]
  },
  {
    id: "mandible",
    name: "Mandible (Jawbone)",
    category: "skeletal",
    region: "Head & Neck",
    difficulty: "Beginner",
    studyTime: "10 mins",
    description: "The strongest, largest, and lowest bone in the human face. It forms the lower jaw and holds the lower teeth in place.",
    attachments: "Masseter inserts on the lateral ramus; temporalis inserts on the coronoid process; medial and lateral pterygoids insert internally.",
    bloodSupply: "Inferior alveolar artery (branch of maxillary artery).",
    innervation: "Inferior alveolar nerve (branch of mandibular division CN V3).",
    clinicalImportance: "Mandibular fractures are highly common in facial trauma and frequently occur in pairs (e.g. symphysis and contralateral condyle) due to its ring shape.",
    radiologyAppearance: {
      xrayPosition: "Panoramic radiograph (Orthopantomogram - OPG) is optimal. Mandible PA and bilateral obliques are secondary.",
      ctAppearance: "Multiplanar 3D CT reconstructions assist in evaluating complex fractures and TMJ joint alignment.",
      mriAppearance: "Mainly used to evaluate temporomandibular joint (TMJ) articular disc displacement, showing biconcave disc morphology."
    },
    relatedStructures: ["skull"],
    quizQuestions: [
      {
        question: "Which nerve enters the mandibular foramen and provides sensation to all mandibular teeth?",
        options: ["Inferior alveolar nerve", "Lingual nerve", "Facial nerve", "Mylohyoid nerve"],
        correctIndex: 0,
        explanation: "The inferior alveolar nerve enters the mandibular foramen to supply teeth before exiting as the mental nerve."
      }
    ]
  },
  {
    id: "clavicle",
    name: "Clavicle (Collarbone)",
    category: "skeletal",
    region: "Thorax",
    difficulty: "Beginner",
    studyTime: "8 mins",
    description: "An S-shaped long bone that lies horizontally at the root of the neck, acting as a strut connecting the scapula to the sternum.",
    attachments: "Origin of pectoralis major (clavicular head), deltoid, and sternocleidomastoid; insertion of trapezius.",
    bloodSupply: "Suprascapular, thoracoacromial, and internal thoracic arteries.",
    innervation: "Supraclavicular nerves (C3-C4) and nerve to subclavius.",
    clinicalImportance: "The most common fractured bone in the human body, usually occurring at the junction of the middle and lateral thirds from a fall on an outstretched hand (FOOSH).",
    radiologyAppearance: {
      xrayPosition: "AP projection of the clavicle, with an optional 15-30° cephalic lordotic view to project the clavicle clear of the ribs.",
      ctAppearance: "Employed for intra-articular fractures of the sternoclavicular or acromioclavicular joints.",
      mriAppearance: "Excellent to evaluate suspected ligamentous disruptions, joint sprains, or subclavius muscle tears."
    },
    relatedStructures: ["scapula", "humerus"],
    quizQuestions: [
      {
        question: "What is the most common fracture site along the clavicle?",
        options: ["Medial third", "Junction of the middle and lateral thirds", "Acromial tip", "Sternoclavicular joint"],
        correctIndex: 1,
        explanation: "Approximately 80% of clavicular fractures occur at the middle third, where the bone is thinnest and lacks robust ligamentous reinforcement."
      }
    ]
  },
  {
    id: "scapula",
    name: "Scapula (Shoulder Blade)",
    category: "skeletal",
    region: "Upper Limb",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "A flat, triangular bone lying on the posterolateral aspect of the thoracic cage, covering ribs 2 through 7.",
    attachments: "Origin of rotator cuff muscles (supraspinatus, infraspinatus, subscapularis, teres minor); insertion of serratus anterior.",
    bloodSupply: "Suprascapular, circumflex scapular, and dorsal scapular arteries.",
    innervation: "Suprascapular, dorsal scapular, and long thoracic nerves.",
    clinicalImportance: "Scapular fractures are rare, indicating severe high-energy trauma. Injury to the long thoracic nerve results in scapular winging.",
    radiologyAppearance: {
      xrayPosition: "AP Scapula and Scapular Y views. The Y-view is essential to evaluate humeral head dislocation relative to glenoid.",
      ctAppearance: "Indicated to evaluate intra-articular glenoid fossa fractures to decide on surgical stabilization.",
      mriAppearance: "Excellent for assessing rotator cuff tendon integrity, labrum tears (SLAP), and subacromial bursitis."
    },
    relatedStructures: ["clavicle", "humerus", "shoulder-joint"],
    quizQuestions: [
      {
        question: "Which muscle paralysis leads to 'winged scapula' due to injury of the long thoracic nerve?",
        options: ["Serratus anterior", "Trapezius", "Rhomboid major", "Supraspinatus"],
        correctIndex: 0,
        explanation: "The long thoracic nerve innervates the serratus anterior. Paralysis causes the scapula's medial border to lift off the ribcage."
      }
    ]
  },
  {
    id: "sternum",
    name: "Sternum (Breastbone)",
    category: "skeletal",
    region: "Thorax",
    difficulty: "Beginner",
    studyTime: "8 mins",
    description: "A flat bone situated in the anterior midline of the thorax, consisting of three parts: manubrium, body, and xiphoid process.",
    attachments: "Articulates with clavicles and true rib cartilages (1-7). Attaches to pectoralis major and sternocleidomastoid.",
    bloodSupply: "Internal thoracic arteries.",
    innervation: "Anterior cutaneous branches of intercostal nerves.",
    clinicalImportance: "Sternal fractures typically result from blunt chest trauma (e.g. steering wheel impact). It is crucial to rule out cardiac contusion.",
    radiologyAppearance: {
      xrayPosition: "True Lateral projection is critical. RAO (Right Anterior Oblique) view projects the sternum over the cardiac shadow to blur lung fields.",
      ctAppearance: "Sagittal reformats easily display sternal displacement, retrosternal hematoma, and mediastinal structures.",
      mriAppearance: "Mainly used to evaluate sternal osteomyelitis or sternoclavicular joint arthritis."
    },
    relatedStructures: ["ribs", "heart", "lungs"],
    quizQuestions: [
      {
        question: "At which joint level does the second rib articulate with the sternum?",
        options: ["Sternal angle (Angle of Louis)", "Xiphisternal joint", "Jugular notch", "Clavicular notch"],
        correctIndex: 0,
        explanation: "The sternal angle (at T4-T5 vertebral level) is a critical palpable landmark where the manubrium meets the sternal body and articulates with rib 2."
      }
    ]
  },
  {
    id: "ribs",
    name: "Rib Cage (Ribs 1-12)",
    category: "skeletal",
    region: "Thorax",
    difficulty: "Intermediate",
    studyTime: "11 mins",
    description: "The elastic bony cage of the chest, formed by 12 pairs of ribs articulating with thoracic vertebrae posteriorly.",
    attachments: "Intercostal muscles attach to upper/lower rib borders. Scalenes attach to ribs 1 and 2.",
    bloodSupply: "Intercostal arteries.",
    innervation: "Intercostal nerves.",
    clinicalImportance: "Rib fractures can puncture lungs, causing pneumothorax. 'Flail chest' occurs when three or more adjacent ribs are broken in two places, causing paradoxical breathing.",
    radiologyAppearance: {
      xrayPosition: "PA Chest to check for pneumothorax; oblique rib projections to project ribs clear of lung parenchyma.",
      ctAppearance: "High sensitivity for occult rib fractures, retropleural hemorrhage, and underlying pulmonary contusions.",
      mriAppearance: "Rarely utilized; helpful for neural tumors in intercostal spaces or chest wall sarcomas."
    },
    relatedStructures: ["sternum", "lungs", "diaphragm"],
    quizQuestions: [
      {
        question: "Which ribs are classified as 'floating' due to having no anterior cartilaginous attachment?",
        options: ["Ribs 11 and 12", "Ribs 8-10", "Ribs 1 and 2", "Ribs 7 and 8"],
        correctIndex: 0,
        explanation: "Ribs 11 and 12 end free in the abdominal wall musculature and are classified as floating ribs."
      }
    ]
  },
  {
    id: "spine",
    name: "Vertebral Column (Spine)",
    category: "skeletal",
    region: "Thorax",
    difficulty: "Advanced",
    studyTime: "18 mins",
    description: "The flexible skeletal axis consisting of 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 fused coccygeal.",
    attachments: "Intervertebral discs between bodies; multiple deep back muscles (erector spinae) and spinal ligaments.",
    bloodSupply: "Spinal branches of vertebral, intercostal, lumbar, and lateral sacral arteries.",
    innervation: "Meningeal branches of spinal nerves.",
    clinicalImportance: "Herniated discs can compress nerve roots, causing sciatica. Osteoporotic compression fractures are common in the thoracolumbar region.",
    radiologyAppearance: {
      xrayPosition: "AP, Lateral, and oblique views of cervical, thoracic, or lumbar sections. Flexion/extension views assess stability.",
      ctAppearance: "Provides sagittal and coronal reformats to evaluate bone fragments, spinal canal narrowing, and facet alignment.",
      mriAppearance: "The absolute gold standard to evaluate spinal cord, nerve roots, disk herniations, and ligamentous injuries."
    },
    relatedStructures: ["spinal-cord", "pelvis"],
    quizQuestions: [
      {
        question: "What is the name of the first cervical vertebra (C1), which lacks a vertebral body?",
        options: ["Atlas", "Axis", "Prominens", "Sacrum"],
        correctIndex: 0,
        explanation: "C1 is named the Atlas. It has a ring-like structure with anterior and posterior arches and no central body."
      }
    ]
  },
  {
    id: "pelvis",
    name: "Pelvis",
    category: "skeletal",
    region: "Pelvis",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "A robust skeletal ring formed by the two hip bones (ilium, ischium, pubis) and the sacrum, transferring weight to lower limbs.",
    attachments: "Provides attachment for abdominal wall, gluteal, hamstring, and quadriceps muscles.",
    bloodSupply: "Internal iliac artery branches (gluteal, obturator, internal pudendal).",
    innervation: "Sacral plexus, lumbosacral trunk, and obturator nerve.",
    clinicalImportance: "High-energy pelvic fractures ('open-book') can tear retroperitoneal venous plexuses, causing life-threatening bleeding.",
    radiologyAppearance: {
      xrayPosition: "Standard AP Pelvis. Inlet view (40° caudal angle) evaluates pelvic ring integrity; outlet view (40° cephalic angle) checks vertical shift.",
      ctAppearance: "Standard in polytrauma to assess acetabular fractures and posterior sacroiliac joint instability.",
      mriAppearance: "Extremely sensitive for occult femoral neck stress fractures and sacroiliitis."
    },
    relatedStructures: ["femur", "spine", "hip-joint"],
    quizQuestions: [
      {
        question: "Which pelvic structure forms the deep socket that articulates with the femoral head?",
        options: ["Acetabulum", "Obturator foramen", "Iliac crest", "Ischial tuberosity"],
        correctIndex: 0,
        explanation: "The acetabulum is a cup-shaped cavity on the lateral pelvis, formed by the union of ilium, ischium, and pubis."
      }
    ]
  },
  {
    id: "humerus",
    name: "Humerus",
    category: "skeletal",
    region: "Upper Limb",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "The long bone of the upper arm, extending from the shoulder glenohumeral joint to the elbow humeroulnar articulation.",
    attachments: "Rotator cuff tendons insert on the greater and lesser tubercles. Deltoid inserts on the deltoid tuberosity.",
    bloodSupply: "Anterior and posterior circumflex humeral arteries; profunda brachii.",
    innervation: "Axillary nerve (surgical neck), radial nerve (radial groove), ulnar nerve (medial epicondyle).",
    clinicalImportance: "Fractures of the humeral surgical neck risk injuring the axillary nerve. Midshaft fractures risk radial nerve injury, causing wrist drop.",
    radiologyAppearance: {
      xrayPosition: "AP and Lateral views of the humerus, always including both shoulder and elbow joint lines.",
      ctAppearance: "Employed for complex three- or four-part proximal humerus fractures to guide surgical head replacement.",
      mriAppearance: "Useful for looking at soft tissue, bone marrow lesions, or rotator cuff tears at the humeral insertion."
    },
    relatedStructures: ["scapula", "radius", "ulna", "shoulder-joint"],
    quizQuestions: [
      {
        question: "Which nerve is at highest risk of injury in a fracture of the midshaft humerus?",
        options: ["Radial nerve", "Axillary nerve", "Ulnar nerve", "Median nerve"],
        correctIndex: 0,
        explanation: "The radial nerve runs inside the spiral groove directly on the posterior humeral shaft, making it susceptible to midshaft fractures."
      }
    ]
  },
  {
    id: "radius",
    name: "Radius",
    category: "skeletal",
    region: "Upper Limb",
    difficulty: "Intermediate",
    studyTime: "10 mins",
    description: "The lateral (thumb-side) bone of the forearm, rotating over the ulna to permit pronation and supination.",
    attachments: "Biceps brachii inserts on the radial tuberosity. Pronator quadratus inserts distally.",
    bloodSupply: "Radial and anterior interosseous arteries.",
    innervation: "Posterior interosseous nerve (branch of radial nerve).",
    clinicalImportance: "Colles' fracture is a distal radius fracture with dorsal displacement of the distal fragment, usually from a fall on an outstretched hand (FOOSH).",
    radiologyAppearance: {
      xrayPosition: "AP and Lateral forearm views. Check for distal radioulnar joint (DRUJ) alignment.",
      ctAppearance: "Used for intra-articular distal radius fractures to assess joint step-off.",
      mriAppearance: "Excellent to visualize TFCC (triangular fibrocartilage complex) tears and scapholunate ligament stability."
    },
    relatedStructures: ["ulna", "humerus"],
    quizQuestions: [
      {
        question: "Which wrist fracture features anterior (volar) displacement of the distal radius fragment?",
        options: ["Smith's fracture", "Colles' fracture", "Galeazzi fracture", "Chauffeur's fracture"],
        correctIndex: 0,
        explanation: "Smith's fracture (reverse Colles') features volar displacement of the distal radius fragment, usually from a fall on a flexed wrist."
      }
    ]
  },
  {
    id: "ulna",
    name: "Ulna",
    category: "skeletal",
    region: "Upper Limb",
    difficulty: "Intermediate",
    studyTime: "10 mins",
    description: "The medial (pinky-side) bone of the forearm, acting as a hinge articulating with the trochlea of the humerus.",
    attachments: "Triceps brachii inserts on the olecranon process. Brachialis inserts on the ulnar tuberosity.",
    bloodSupply: "Ulnar artery and interosseous branches.",
    innervation: "Ulnar nerve runs behind the medial epicondyle proximal to the ulna.",
    clinicalImportance: "Olecranon fractures are intra-articular and usually require tension band wiring. Monteggia fracture is a proximal ulna break with radial head dislocation.",
    radiologyAppearance: {
      xrayPosition: "AP and Lateral elbow and forearm views. The lateral view must be in 90° flexion to evaluate fat pad signs.",
      ctAppearance: "Used to assess complex articular fractures of the olecranon or coronoid processes.",
      mriAppearance: "Highly useful to detect ulnar collateral ligament (UCL) tears in overhead throwing athletes."
    },
    relatedStructures: ["radius", "humerus"],
    quizQuestions: [
      {
        question: "A Monteggia fracture-dislocation is defined as a fracture of the proximal ulna with dislocation of which joint?",
        options: ["Radial head at the elbow", "Distal radioulnar joint", "Acromioclavicular joint", "Glenohumeral joint"],
        correctIndex: 0,
        explanation: "Monteggia fracture consists of a fracture of the proximal shaft of the ulna paired with anterior dislocation of the radial head."
      }
    ]
  },
  {
    id: "femur",
    name: "Femur (Thigh Bone)",
    category: "skeletal",
    region: "Lower Limb",
    difficulty: "Intermediate",
    studyTime: "13 mins",
    description: "The longest, heaviest, and strongest bone in the human body, articulating with the acetabulum of the pelvis and the tibia at the knee.",
    attachments: "Gluteal muscles, iliopsoas, hamstrings, and quadriceps group attach here.",
    bloodSupply: "Profunda femoris, medial and lateral circumflex femoral arteries.",
    innervation: "Femoral and sciatic nerves.",
    clinicalImportance: "Femoral neck fractures can disrupt the retinacular blood supply, leading to avascular necrosis (AVN) of the femoral head.",
    radiologyAppearance: {
      xrayPosition: "AP Pelvis, AP and Lateral Femur. Cross-table lateral femur is used in trauma to minimize extremity movement.",
      ctAppearance: "Slices help evaluate femoral head structural collapse and plan surgical arthroplasty.",
      mriAppearance: "Extremely sensitive for detecting early, pre-radiographic avascular necrosis (T2 shows double-line sign)."
    },
    relatedStructures: ["pelvis", "patella", "tibia", "hip-joint", "knee-joint"],
    quizQuestions: [
      {
        question: "Why are femoral neck fractures highly prone to avascular necrosis (AVN)?",
        options: ["Disruption of the medial circumflex femoral artery", "Damage to the sciatic nerve", "Lack of trabecular bone", "Inability to cast the hip"],
        correctIndex: 0,
        explanation: "The medial circumflex femoral artery provides the primary blood supply to the femoral head; fractures in this region frequently lacerate its branches."
      }
    ]
  },
  {
    id: "patella",
    name: "Patella (Kneecap)",
    category: "skeletal",
    region: "Lower Limb",
    difficulty: "Beginner",
    studyTime: "7 mins",
    description: "The largest sesamoid bone in the human body, embedded in the quadriceps tendon to increase the mechanical leverage of the knee.",
    attachments: "Quadriceps tendon attaches superiorly; patellar ligament attaches inferiorly, inserting onto the tibial tuberosity.",
    bloodSupply: "Genicular arterial network.",
    innervation: "Nerve to vastus medialis (femoral nerve branch).",
    clinicalImportance: "Transverse fractures disrupt the knee extensor mechanism and prevent leg raising, necessitating surgical tension band wiring.",
    radiologyAppearance: {
      xrayPosition: "AP Knee, Lateral Knee (ideal for patellar height - Insall-Salvati ratio), and Skyline (Sunrise) view to assess the patellofemoral joint space.",
      ctAppearance: "Employed for patellofemoral tracking dysfunctions or to detect osteochondral fragments.",
      mriAppearance: "Excellent to diagnose patellar tendonitis (jumper's knee) and chondromalacia patellae."
    },
    relatedStructures: ["femur", "tibia", "knee-joint"],
    quizQuestions: [
      {
        question: "Which knee radiographic view is optimal to evaluate patellofemoral alignment and lateral subluxation?",
        options: ["Skyline (Sunrise) view", "Tunnel view", "Weight-bearing AP", "Oblique knee view"],
        correctIndex: 0,
        explanation: "The Sunrise / Skyline view projects tangentially through the patellofemoral joint space, displaying tilt and subluxation."
      }
    ]
  },
  {
    id: "tibia",
    name: "Tibia (Shinbone)",
    category: "skeletal",
    region: "Lower Limb",
    difficulty: "Intermediate",
    studyTime: "11 mins",
    description: "The medial and larger of the two lower leg bones, carrying the entire weight-bearing load of the leg.",
    attachments: "Patellar ligament inserts on the tibial tuberosity. Popliteus muscle inserts on the posterior tibia.",
    bloodSupply: "Anterior tibial artery and nutrient branch.",
    innervation: "Tibial and deep fibular nerves.",
    clinicalImportance: "Tibial plateau fractures (Schatzker classification) involve joint surfaces. Tibial shaft fractures are commonly open due to its subcutaneous location.",
    radiologyAppearance: {
      xrayPosition: "AP and Lateral lower leg projections, always including both knee and ankle joints to rule out distal fibular pathology.",
      ctAppearance: "Standard for tibial plateau fractures to quantify joint depression and plan articular surgical screw placement.",
      mriAppearance: "Highly sensitive for tibial stress syndrome (shin splints) showing periosteal edema on T2-FS."
    },
    relatedStructures: ["fibula", "patella", "femur", "knee-joint"],
    quizQuestions: [
      {
        question: "What is the name of the fracture classification system used specifically for tibial plateau fractures?",
        options: ["Schatzker", "Weber", "Lauge-Hansen", "Neer"],
        correctIndex: 0,
        explanation: "The Schatzker classification categorized tibial plateau fractures into six types based on split, depression, or bicondylar patterns."
      }
    ]
  },
  {
    id: "fibula",
    name: "Fibula (Calf Bone)",
    category: "skeletal",
    region: "Lower Limb",
    difficulty: "Beginner",
    studyTime: "9 mins",
    description: "The slender, lateral bone of the lower leg, acting as a muscular anchor and forming the lateral ankle malleolus. It does not carry significant weight.",
    attachments: "Biceps femoris inserts on the fibular head. Articulates with the tibia at proximal/distal joints.",
    bloodSupply: "Fibular (peroneal) artery.",
    innervation: "Common fibular nerve wraps laterally around the fibular neck.",
    clinicalImportance: "Common fibular nerve compression at the neck leads to flaccid foot drop. Distal fibula fractures are classified via the Weber system.",
    radiologyAppearance: {
      xrayPosition: "AP, Lateral lower leg, and Ankle Mortise views (15° internal rotation) to assess the distal syndesmosis.",
      ctAppearance: "Used to assess ankle mortise widening and syndesmotic joint subluxation.",
      mriAppearance: "Excellent to diagnose syndesmotic ligament tears (high ankle sprain) and peroneal tendon pathology."
    },
    relatedStructures: ["tibia"],
    quizQuestions: [
      {
        question: "Wrapping around the lateral neck of the fibula, injury to which nerve leads to 'foot drop'?",
        options: ["Common fibular nerve", "Tibial nerve", "Saphenous nerve", "Sural nerve"],
        correctIndex: 0,
        explanation: "The common fibular (peroneal) nerve is subcutaneous at the fibular neck; compression or fracture here impairs foot dorsiflexion, causing foot drop."
      }
    ]
  },

  // ==========================================
  // 2. MUSCULAR SYSTEM
  // ==========================================
  {
    id: "deltoid-muscle",
    name: "Deltoid Muscle",
    category: "muscular",
    region: "Upper Limb",
    difficulty: "Beginner",
    studyTime: "8 mins",
    description: "The principal muscle of the shoulder, giving it its rounded profile and acting as the main arm abductor.",
    attachments: "Origin: Clavicle, acromion, and scapular spine. Insertion: Deltoid tuberosity of the humerus.",
    bloodSupply: "Posterior circumflex humeral artery and deltoid branch of thoracoacromial artery.",
    innervation: "Axillary nerve (C5-C6).",
    clinicalImportance: "Vulnerable to atrophy if the axillary nerve is damaged (e.g., during anterior shoulder dislocations or surgical neck fractures). Common site for IM vaccinations.",
    radiologyAppearance: {
      xrayPosition: "Seen as a prominent soft-tissue outline surrounding the proximal humerus on AP Shoulder views.",
      ctAppearance: "Provides density mapping; displays fatty infiltration or atrophy in chronic axillary nerve injury.",
      mriAppearance: "Clearly defines muscle strains, tears, or high-signal fluid in the subdeltoid bursa on T2 sequences."
    },
    relatedStructures: ["humerus", "scapula", "shoulder-joint"],
    quizQuestions: [
      {
        question: "Which nerve supplies the deltoid muscle?",
        options: ["Axillary nerve", "Radial nerve", "Musculocutaneous nerve", "Suprascapular nerve"],
        correctIndex: 0,
        explanation: "The axillary nerve innervates both the deltoid and teres minor muscles."
      }
    ]
  },
  {
    id: "biceps-brachii",
    name: "Biceps Brachii",
    category: "muscular",
    region: "Upper Limb",
    difficulty: "Beginner",
    studyTime: "10 mins",
    description: "A prominent two-headed muscle on the anterior compartment of the arm, responsible for forearm supination and elbow flexion.",
    attachments: "Origin: Long head from supraglenoid tubercle, short head from coracoid process. Insertion: Radial tuberosity.",
    bloodSupply: "Brachial artery branches.",
    innervation: "Musculocutaneous nerve (C5-C6).",
    clinicalImportance: "Rupture of the long head of biceps tendon causes a characteristic distal bulging bulge known as the 'Popeye deformity'.",
    radiologyAppearance: {
      xrayPosition: "Plain films do not show muscle detail; soft tissue bulge may be appreciated on lateral elbow/arm views.",
      ctAppearance: "Can show hematomas or muscle tears, though MRI is preferred.",
      mriAppearance: "Excellent for visualizing biceps tendonitis, fluid in the bicipital groove, or tendon tears."
    },
    relatedStructures: ["radius", "humerus", "scapula"],
    quizQuestions: [
      {
        question: "Which nerve innervates the biceps brachii muscle?",
        options: ["Musculocutaneous nerve", "Median nerve", "Radial nerve", "Ulnar nerve"],
        correctIndex: 0,
        explanation: "The musculocutaneous nerve innervates the muscles of the anterior compartment of the arm (biceps brachii, brachialis, coracobrachialis)."
      }
    ]
  },
  {
    id: "triceps-brachii",
    name: "Triceps Brachii",
    category: "muscular",
    region: "Upper Limb",
    difficulty: "Beginner",
    studyTime: "10 mins",
    description: "The large three-headed muscle on the posterior compartment of the arm, acting as the primary extensor of the elbow joint.",
    attachments: "Origin: Long head from infraglenoid tubercle, lateral and medial heads from humerus. Insertion: Olecranon of ulna.",
    bloodSupply: "Profunda brachii artery.",
    innervation: "Radial nerve (C6-C8).",
    clinicalImportance: "Rupture of the triceps tendon is rare but highly disabling. Can lead to an avulsion fracture of the olecranon.",
    radiologyAppearance: {
      xrayPosition: "Shows soft-tissue swelling posterior to the humerus or an avulsed olecranon bony flake.",
      ctAppearance: "Highlights soft tissue swelling or calcifications within the triceps tendon insertion.",
      mriAppearance: "Shows high T2 signal in tears, tendonitis, or olecranon bursitis."
    },
    relatedStructures: ["ulna", "humerus", "scapula"],
    quizQuestions: [
      {
        question: "Which bone process does the triceps brachii insert onto?",
        options: ["Olecranon of the ulna", "Radial tuberosity", "Coracoid process of the scapula", "Coronoid process of the ulna"],
        correctIndex: 0,
        explanation: "All three heads of the triceps brachii unite to insert onto the olecranon process of the ulna, extending the elbow."
      }
    ]
  },
  {
    id: "quadriceps-femoris",
    name: "Quadriceps Femoris",
    category: "muscular",
    region: "Lower Limb",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "A large, powerful group of four muscles on the anterior thigh, extending the leg at the knee joint.",
    attachments: "Origin: Femur (vasti muscles) and ilium (rectus femoris). Insertion: Patella via quadriceps tendon, tibial tuberosity via patellar ligament.",
    bloodSupply: "Femoral artery branches.",
    innervation: "Femoral nerve (L2-L4).",
    clinicalImportance: "Rupture of the quadriceps tendon is an emergency, disrupting the extensor mechanism of the knee and preventing knee extension.",
    radiologyAppearance: {
      xrayPosition: "Mainly shows secondary findings like a low-riding patella (patella baja) in quadriceps tendon rupture.",
      ctAppearance: "Employed to map pelvic/femoral origins and check for soft tissue hematomas.",
      mriAppearance: "Excellent to view strains, muscle ruptures, or fluid signal in quadriceps tendon ruptures."
    },
    relatedStructures: ["femur", "patella", "tibia", "knee-joint"],
    quizQuestions: [
      {
        question: "Which of the four quadriceps muscles originates on the pelvis (ilium) rather than the femur?",
        options: ["Rectus femoris", "Vastus lateralis", "Vastus medialis", "Vastus intermedius"],
        correctIndex: 0,
        explanation: "The rectus femoris originates on the anterior inferior iliac spine (AIIS), allowing it to flex the hip as well as extend the knee."
      }
    ]
  },
  {
    id: "gastrocnemius",
    name: "Gastrocnemius (Calf Muscle)",
    category: "muscular",
    region: "Lower Limb",
    difficulty: "Beginner",
    studyTime: "9 mins",
    description: "The prominent superficial muscle of the calf, flexing the knee and plantarflexing the foot at the ankle.",
    attachments: "Origin: Medial and lateral femoral condyles. Insertion: Calcaneus (heel bone) via the Achilles tendon.",
    bloodSupply: "Sural arteries (branches of popliteal artery).",
    innervation: "Tibial nerve (S1-S2).",
    clinicalImportance: "The gastrocnemius tendon merges into the Achilles tendon. Achilles tendon rupture presents with a sudden 'pop' and positive Thompson squeeze test.",
    radiologyAppearance: {
      xrayPosition: "Shows thickening or gaps in the Kager's fat pad shadow on lateral ankle films.",
      ctAppearance: "Can delineate hematomas or fascial ruptures in tennis leg.",
      mriAppearance: "Gold standard to diagnose Achilles tendon tears, displaying fiber retraction and high T2 fluid signal in gaps."
    },
    relatedStructures: ["tibia", "fibula", "knee-joint"],
    quizQuestions: [
      {
        question: "The gastrocnemius muscle inserts onto the calcaneus bone via which famous tendon?",
        options: ["Achilles (Calcaneal) tendon", "Patellar tendon", "Tibialis anterior tendon", "Plantaris tendon"],
        correctIndex: 0,
        explanation: "The gastrocnemius and soleus muscles combine to insert onto the calcaneus via the Achilles (calcaneal) tendon."
      }
    ]
  },

  // ==========================================
  // 3. JOINTS
  // ==========================================
  {
    id: "shoulder-joint",
    name: "Shoulder Joint (Glenohumeral)",
    category: "joints",
    region: "Upper Limb",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "A highly mobile ball-and-socket joint formed by the head of the humerus and the shallow glenoid cavity of the scapula.",
    attachments: "Reinforced by the glenoid labrum, joint capsule, and the rotator cuff tendons.",
    bloodSupply: "Anterior and posterior circumflex humeral, suprascapular arteries.",
    innervation: "Axillary, suprascapular, and lateral pectoral nerves.",
    clinicalImportance: "The most commonly dislocated joint in the body, primarily anteriorly. Anterior dislocation risks Bankart and Hill-Sachs lesions.",
    radiologyAppearance: {
      xrayPosition: "Standard shoulder series: AP internal/external rotation, Scapular Y-view, and Axillary view (best for glenoid alignment).",
      ctAppearance: "Ideal to evaluate glenoid bone loss (Bony Bankart) or humeral head impaction fractures (Hill-Sachs).",
      mriAppearance: "MRI arthrography (with intra-articular gadolinium) is the gold standard for labral tears and rotator cuff pathology."
    },
    relatedStructures: ["humerus", "scapula", "clavicle", "deltoid-muscle"],
    quizQuestions: [
      {
        question: "Which bony lesion is a compression fracture of the posterolateral humeral head caused by anterior shoulder dislocation?",
        options: ["Hill-Sachs lesion", "Bankart lesion", "Colles' lesion", "Schatzker lesion"],
        correctIndex: 0,
        explanation: "A Hill-Sachs lesion is a cortical depression fracture of the posterolateral humeral head as it impacts the anterior glenoid rim during dislocation."
      }
    ]
  },
  {
    id: "hip-joint",
    name: "Hip Joint (Acetabulofemoral)",
    category: "joints",
    region: "Pelvis",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "A multiaxial ball-and-socket synovial joint designed for weight-bearing stability, formed by the femoral head and pelvic acetabulum.",
    attachments: "Enclosed in a strong fibrous capsule and reinforced by iliofemoral, pubofemoral, and ischiofemoral ligaments.",
    bloodSupply: "Medial and lateral circumflex femoral arteries; artery of the head of the femur.",
    innervation: "Femoral, obturator, and sciatic nerves.",
    clinicalImportance: "Dislocation is a medical emergency, usually posterior ('dashboard injury'). Risks sciatic nerve compression and avascular necrosis.",
    radiologyAppearance: {
      xrayPosition: "AP Pelvis and Frog-leg lateral hip view. Check for pelvic lines (Shenton's line disruption suggests fracture/dislocation).",
      ctAppearance: "Critical post-reduction to check for intra-articular bone fragments and acetabular fracture lines.",
      mriAppearance: "Highly sensitive for labral tears, early osteoarthritis, and bone marrow edema/AVN."
    },
    relatedStructures: ["pelvis", "femur", "spine"],
    quizQuestions: [
      {
        question: "Disruption of which radiographic reference line on an AP pelvis indicates hip fracture or dislocation?",
        options: ["Shenton's line", "Caldwell's line", "Hilgenreiner's line", "McRae's line"],
        correctIndex: 0,
        explanation: "Shenton's line is a smooth curved line formed by the obturator foramen border and inferior femoral neck. Disruption indicates pathology."
      }
    ]
  },
  {
    id: "knee-joint",
    name: "Knee Joint (Tibiofemoral)",
    category: "joints",
    region: "Lower Limb",
    difficulty: "Advanced",
    studyTime: "16 mins",
    description: "A complex hinge synovial joint formed by femur condyles, tibia condyles, and patella, allowing flexion and extension with minimal rotation.",
    attachments: "Stabilized by ACL, PCL, MCL, LCL, and medial/lateral menisci.",
    bloodSupply: "Genicular arterial anastomosis from the popliteal artery.",
    innervation: "Femoral, tibial, and common fibular nerves (Hilton's law).",
    clinicalImportance: "ACL tears are extremely common in sports. Segond fracture (lateral tibial capsule avulsion) is highly associated with ACL rupture.",
    radiologyAppearance: {
      xrayPosition: "AP weight-bearing (joint space narrowing), lateral (effusion, patellar alignment), and tunnel views (glenoid fossa).",
      ctAppearance: "Primarily used for complex tibial plateau fractures (Schatzker classification) or patellar tracking.",
      mriAppearance: "Excellent to view cruciate ligament tears, meniscal bucket-handle tears, and bone marrow bruising patterns."
    },
    relatedStructures: ["femur", "patella", "tibia", "fibula", "quadriceps-femoris"],
    quizQuestions: [
      {
        question: "Which small avulsion fracture of the lateral tibial plateau is highly specific for an underlying ACL tear?",
        options: ["Segond fracture", "Maisonneuve fracture", "Chopart fracture", "Lisfranc fracture"],
        correctIndex: 0,
        explanation: "A Segond fracture is an avulsion of the lateral tibial condyle at the site of anterolateral ligament insertion. It is associated with ACL tear in 90% of cases."
      }
    ]
  },

  // ==========================================
  // 4. NERVOUS SYSTEM
  // ==========================================
  {
    id: "brain",
    name: "Brain",
    category: "nervous",
    region: "Head & Neck",
    difficulty: "Advanced",
    studyTime: "20 mins",
    description: "The primary control center of the nervous system, situated within the cranium, comprising the cerebrum, cerebellum, and brainstem.",
    attachments: "Suspended in cerebrospinal fluid (CSF) and covered by the three meningeal layers (dura, arachnoid, pia mater).",
    bloodSupply: "Internal carotid and vertebral arteries, forming the Circle of Willis.",
    innervation: "Contains nuclei for the 12 pairs of cranial nerves.",
    clinicalImportance: "Stroke or hemorrhage requires extremely rapid CT scanning (non-contrast) to differentiate ischemic from hemorrhagic pathology before starting tPA.",
    radiologyAppearance: {
      xrayPosition: "Standard radiographs do not visualize brain tissue; only indirect signs like pineal gland displacement are visible.",
      ctAppearance: "Non-contrast head CT is standard for acute stroke. Blood appears bright white in acute hemorrhage; ischemic stroke shows dark edema after several hours.",
      mriAppearance: "Excellent resolution. Diffusion-Weighted Imaging (DWI) shows acute ischemic stroke within minutes as bright white (diffusion restriction)."
    },
    relatedStructures: ["skull", "spinal-cord"],
    quizQuestions: [
      {
        question: "Which MRI sequence is most sensitive for detecting hyperacute ischemic stroke within minutes of onset?",
        options: ["Diffusion-Weighted Imaging (DWI)", "T1-weighted image", "T2-weighted image", "FLAIR"],
        correctIndex: 0,
        explanation: "DWI is highly sensitive to restricted water diffusion in swelling ischemic cells, showing stroke lesions as bright white within minutes."
      }
    ]
  },
  {
    id: "spinal-cord",
    name: "Spinal Cord",
    category: "nervous",
    region: "Thorax",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "The major conduit of sensory and motor signals, extending from the brainstem medulla to the lumbar spine, terminating as the conus medullaris.",
    attachments: "Runs through the vertebral canal, suspended by denticulate ligaments and wrapped in dural sheath.",
    bloodSupply: "Anterior spinal artery and two posterior spinal arteries, supplemented by segmental medullary arteries (e.g. Artery of Adamkiewicz).",
    innervation: "Branches into 31 pairs of spinal nerves.",
    clinicalImportance: "Cord compression from herniated discs, tumors, or fractures is a surgical emergency. Anterior spinal artery syndrome spares dorsal column vibration/proprioception.",
    radiologyAppearance: {
      xrayPosition: "Cannot visualize the cord directly; check vertebral alignment (lines of column) and disc height.",
      ctAppearance: "CT myelography (injecting contrast into the subarachnoid space) can display external cord compression.",
      mriAppearance: "Gold standard. T2-weighted MRI shows spinal cord as dark grey floating in hyperintense (bright white) CSF. Spinal cord edema appears bright white on T2."
    },
    relatedStructures: ["spine", "brain", "sciatic-nerve"],
    quizQuestions: [
      {
        question: "What is the name of the main spinal cord termination, usually ending at the L1-L2 vertebral level?",
        options: ["Conus medullaris", "Cauda equina", "Filum terminale", "Pons"],
        correctIndex: 0,
        explanation: "The spinal cord terminates as a tapered cone-shaped structure called the conus medullaris, typically at L1 or L2 in adults."
      }
    ]
  },
  {
    id: "sciatic-nerve",
    name: "Sciatic Nerve",
    category: "nervous",
    region: "Lower Limb",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "The largest and longest nerve in the human body, arising from the sacral plexus and running down the posterior thigh.",
    attachments: "Passes out of the pelvis via the greater sciatic foramen, usually inferior to the piriformis muscle.",
    bloodSupply: "Arteria comitans nervi ischiadici (branch of inferior gluteal artery).",
    innervation: "Supplies muscles of posterior thigh (hamstrings) and all leg/foot muscle compartments via tibial and common fibular divisions.",
    clinicalImportance: "Compression or inflammation (sciatica) causes shooting pain, numbness, and weakness down the leg. Can be compressed by a herniated lumbar disc or piriformis muscle spasm.",
    radiologyAppearance: {
      xrayPosition: "Invisible on plain films. Plain films rule out bony causes of nerve compression (e.g., spondylolisthesis).",
      ctAppearance: "Used to visualize disc herniation or spinal stenosis compressing corresponding nerve roots.",
      mriAppearance: "High-resolution MR Neurography displays sciatic nerve edema, enlargement, or entrapment in the sciatic notch."
    },
    relatedStructures: ["spine", "pelvis", "femur"],
    quizQuestions: [
      {
        question: "Which pelvic muscle can compress the sciatic nerve, causing symptoms mimicking a lumbar disc herniation?",
        options: ["Piriformis", "Gluteus maximus", "Obturator internus", "Quadratus femoris"],
        correctIndex: 0,
        explanation: "Piriformis syndrome involves compression of the sciatic nerve by the piriformis muscle as it exits the greater sciatic foramen."
      }
    ]
  },

  // ==========================================
  // 5. CARDIOVASCULAR SYSTEM
  // ==========================================
  {
    id: "heart",
    name: "Heart",
    category: "cardiovascular",
    region: "Thorax",
    difficulty: "Advanced",
    studyTime: "18 mins",
    description: "A four-chambered muscular pump located in the middle mediastinum, responsible for circulating blood through the pulmonary and systemic systems.",
    attachments: "Enclosed by the fibrous and serous pericardium; anchored to the diaphragm and sternum.",
    bloodSupply: "Right and left coronary arteries (arising from aortic sinuses).",
    innervation: "Autonomic nervous system via cardiac plexus (sympathetic and vagal parasympathetic).",
    clinicalImportance: "Coronary artery disease causes myocardial infarction. Cardiomegaly is diagnosed on PA films if the cardiothoracic ratio (CTR) exceeds 50%.",
    radiologyAppearance: {
      xrayPosition: "PA and Lateral Chest views. On PA view, left border is formed by aortic knob, pulmonary trunk, and left ventricle; right border by superior vena cava and right atrium.",
      ctAppearance: "Coronary CT Angiography (CCTA) allows non-invasive evaluation of coronary plaques and stenosis. Coronary calcium scoring predicts cardiovascular risk.",
      mriAppearance: "Cardiac MRI (CMR) is the gold standard for evaluating myocardial viability, infarct sizing, and cardiomyopathy using Late Gadolinium Enhancement (LGE)."
    },
    relatedStructures: ["ascending-aorta", "coronary-arteries", "lungs"],
    quizQuestions: [
      {
        question: "A cardiothoracic ratio (CTR) greater than what percentage on a PA Chest radiograph suggests cardiomegaly?",
        options: ["50%", "40%", "60%", "33%"],
        correctIndex: 0,
        explanation: "On a standard PA chest film, a heart width greater than 50% of the internal thoracic width is diagnostic of cardiomegaly."
      }
    ]
  },
  {
    id: "ascending-aorta",
    name: "Ascending Aorta",
    category: "cardiovascular",
    region: "Thorax",
    difficulty: "Advanced",
    studyTime: "12 mins",
    description: "The primary systemic artery arising from the left ventricle, extending up to become the aortic arch.",
    attachments: "Originates at the aortic valve; connected to the pulmonary trunk by the ligamentum arteriosum near the arch.",
    bloodSupply: "Vasa vasorum in the adventitia.",
    innervation: "Aortic plexus.",
    clinicalImportance: "Stanford Type A aortic dissection involves the ascending aorta and is a surgical emergency. Displays as a widened mediastinum on chest X-Ray.",
    radiologyAppearance: {
      xrayPosition: "Widened mediastinum (>8cm on AP supine chest film). Prominent aortic knob or calcium sign.",
      ctAppearance: "CT Angiography (CTA) is the gold standard, showing a clear intimal flap separating true and false lumens.",
      mriAppearance: "Excellent for chronic dissection follow-up, showing velocity mapping and regurgitant jets across the aortic valve."
    },
    relatedStructures: ["heart", "coronary-arteries", "lungs"],
    quizQuestions: [
      {
        question: "Which aortic dissection classification includes any involvement of the ascending aorta, regardless of origin?",
        options: ["Stanford Type A", "Stanford Type B", "DeBakey Type III", "Weber Type A"],
        correctIndex: 0,
        explanation: "Stanford Type A dissections involve the ascending aorta and are surgical emergencies. Stanford Type B dissections involve only descending aorta and are managed medically."
      }
    ]
  },
  {
    id: "coronary-arteries",
    name: "Coronary Arteries",
    category: "cardiovascular",
    region: "Thorax",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "The blood vessels supplying oxygenated blood to the heart muscle, originating immediately above the aortic valve.",
    attachments: "Branches include the Left Anterior Descending (LAD), Left Circumflex (LCx), and Right Coronary Artery (RCA).",
    bloodSupply: "Self-perfused during cardiac diastole.",
    innervation: "Regulated by sympathetic and parasympathetic autonomic fibers in the cardiac plexus.",
    clinicalImportance: "Atherosclerotic blockage of the LAD (widowmaker) is highly lethal. Coronary artery calcification is a predictor of future coronary events.",
    radiologyAppearance: {
      xrayPosition: "Not visible on standard chest radiographs unless they have heavy, dense circumferential calcifications.",
      ctAppearance: "Coronary CTA utilizes ECG gating to freeze motion, displaying arterial lumina, soft plaques, and calcium deposits.",
      mriAppearance: "Magnetic resonance coronary angiography is increasingly used but limited by spatial resolution and motion artifacts."
    },
    relatedStructures: ["heart", "ascending-aorta"],
    quizQuestions: [
      {
        question: "Which coronary artery branch is colloquially termed the 'widowmaker' due to high mortality in complete occlusion?",
        options: ["Left Anterior Descending (LAD) artery", "Right Coronary Artery (RCA)", "Left Circumflex (LCx) artery", "Left Marginal artery"],
        correctIndex: 0,
        explanation: "The LAD supplies the anterior wall of the left ventricle and septum. Complete occlusion causes massive anterior myocardial infarction with high mortality."
      }
    ]
  },

  // ==========================================
  // 6. RESPIRATORY SYSTEM
  // ==========================================
  {
    id: "lungs",
    name: "Lungs",
    category: "respiratory",
    region: "Thorax",
    difficulty: "Intermediate",
    studyTime: "15 mins",
    description: "The main organs of respiration, situated in the chest cavity, with the right lung having three lobes and the left lung two lobes.",
    attachments: "Surrounded by visceral and parietal pleurae, separated by a thin layer of pleural fluid.",
    bloodSupply: "Dual supply: Pulmonary arteries (deoxygenated blood for gas exchange) and bronchial arteries (oxygenated blood to lung tissue).",
    innervation: "Pulmonary plexus (vagus nerve CN X and sympathetic trunks).",
    clinicalImportance: "Pneumothorax appears as an ultra-black area devoid of lung markings with a visible pleural line. Pneumonia presents as consolidation.",
    radiologyAppearance: {
      xrayPosition: "Erect PA and Lateral Chest projections. Expiratory PA films are useful to accentuate small pneumothoraces.",
      ctAppearance: "High-Resolution CT (HRCT) of the chest is vital for interstitial lung disease, displaying ground-glass opacities, bronchiectasis, and honeycombing.",
      mriAppearance: "Difficult due to air/tissue interfaces and respiratory motion. Useful primarily for mediastinal invasion or lung apex tumor evaluation."
    },
    relatedStructures: ["trachea", "diaphragm", "heart", "ribs"],
    quizQuestions: [
      {
        question: "What is the key radiographic finding of a pneumothorax on an erect chest X-Ray?",
        options: ["Visceral pleural line with absent peripheral lung markings", "Homogeneous white consolidation", "Fluid level in the pleural space", "Displaced mediastinum to the same side"],
        correctIndex: 0,
        explanation: "Pneumothorax is marked by a thin white visceral pleural line with absolute darkness (hyperlucency) and no bronchovascular markings distal to it."
      }
    ]
  },
  {
    id: "trachea",
    name: "Trachea (Windpipe)",
    category: "respiratory",
    region: "Thorax",
    difficulty: "Beginner",
    studyTime: "9 mins",
    description: "A cartilaginous tube connecting the larynx to the bronchi, acting as a passage for air into the lungs.",
    attachments: "Kept patent by 16-20 C-shaped hyaline cartilage rings; terminates at the carina (T4/T5 level) by bifurcating.",
    bloodSupply: "Inferior thyroid and bronchial arteries.",
    innervation: "Recurrent laryngeal nerve (vagus CN X branch) and sympathetic fibers.",
    clinicalImportance: "Tracheal deviation is a critical sign: pushed away from tension pneumothorax or pleural effusion; pulled toward lobar atelectasis.",
    radiologyAppearance: {
      xrayPosition: "Seen as a central, vertical radiolucent (black) column containing air, overlying lower cervical and upper thoracic spine.",
      ctAppearance: "Enables virtual bronchoscopy and accurate measurement of tracheal stenosis or tracheomalacia.",
      mriAppearance: "Excellent to visualize surrounding thyroid or mediastinal masses invading the tracheal wall."
    },
    relatedStructures: ["lungs", "diaphragm", "ascending-aorta"],
    quizQuestions: [
      {
        question: "At which vertebral level does the trachea bifurcate into the left and right mainstem bronchi?",
        options: ["Carina (T4-T5 level)", "C6 level", "T1 level", "T8 level"],
        correctIndex: 0,
        explanation: "The trachea bifurcates at the carina, located at the sternal angle level (T4-T5 vertebral bodies)."
      }
    ]
  },
  {
    id: "diaphragm",
    name: "Diaphragm",
    category: "respiratory",
    region: "Thorax",
    difficulty: "Intermediate",
    studyTime: "10 mins",
    description: "The primary muscle of respiration, forming a dome-shaped partition between the thoracic and abdominal cavities.",
    attachments: "Origin: Xiphoid process, ribs 7-12, and lumbar vertebrae (crura). Insertion: Central tendon.",
    bloodSupply: "Phrenic arteries (musculophrenic, superior/inferior phrenic).",
    innervation: "Phrenic nerve (C3, C4, C5 - 'keeps the diaphragm alive').",
    clinicalImportance: "Rupture of the diaphragm from blunt trauma can lead to abdominal herniation. Free air under the diaphragm indicates bowel perforation.",
    radiologyAppearance: {
      xrayPosition: "Smooth dome shadows on PA Chest. Right hemidiaphragm is slightly higher than left (due to liver). Pneumoperitoneum shows crescent air pocket underneath.",
      ctAppearance: "Coronal and sagittal reformats clearly display diaphragmatic tears, crus hypertrophy, or hiatal hernia.",
      mriAppearance: "Dynamic MRI can assess diaphragmatic motion and evaluate phrenic nerve palsy."
    },
    relatedStructures: ["lungs", "ribs", "liver"],
    quizQuestions: [
      {
        question: "Which nerve innervates the diaphragm, and what is its spinal origin?",
        options: ["Phrenic nerve (C3-C5)", "Vagus nerve (CN X)", "Intercostal nerves (T7-T12)", "Sciatic nerve (L4-S3)"],
        correctIndex: 0,
        explanation: "The phrenic nerve arises from C3, C4, and C5 spinal segments and provides somatic motor innervation to the diaphragm."
      }
    ]
  },

  // ==========================================
  // 7. DIGESTIVE SYSTEM
  // ==========================================
  {
    id: "stomach",
    name: "Stomach",
    category: "digestive",
    region: "Abdomen",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "A J-shaped muscular organ in the upper left abdomen that mixes food with gastric juices to initiate chemical digestion.",
    attachments: "Suspended between the esophagus (cardiac sphincter) and duodenum (pyloric sphincter); anchored by greater and lesser omenta.",
    bloodSupply: "Gastric and gastroepiploic arteries (branches of celiac trunk).",
    innervation: "Vagus nerve (CN X) for parasympathetic; celiac plexus for sympathetic.",
    clinicalImportance: "Peptic ulcer disease can lead to perforation, displaying as free air under the diaphragm. Gastric outlet obstruction presents with a massive distended stomach.",
    radiologyAppearance: {
      xrayPosition: "Upper GI barium swallow series shows mucosal folds (rugae), ulcers, or hiatal hernia. Standing AP film displays stomach air bubble.",
      ctAppearance: "With oral contrast, the stomach appears distended with high-density fluid; wall thickening suggests gastritis, ulcer, or carcinoma.",
      mriAppearance: "Rarely used, but high-resolution sequences can staging gastric cancer invasion through wall layers."
    },
    relatedStructures: ["liver", "pancreas"],
    quizQuestions: [
      {
        question: "Perforation of a gastric or duodenal ulcer classically presents with which critical radiographic finding on an upright chest X-Ray?",
        options: ["Pneumoperitoneum (free air under diaphragm)", "Pneumothorax", "Pleural effusion", "Cardiomegaly"],
        correctIndex: 0,
        explanation: "Gastrointestinal perforation leaks gas into the peritoneal cavity, which rises under the diaphragm on upright films, appearing as a dark crescent of free air (pneumoperitoneum)."
      }
    ]
  },
  {
    id: "liver",
    name: "Liver",
    category: "digestive",
    region: "Abdomen",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "The largest internal organ and metabolic powerhouse, located in the right upper quadrant of the abdomen, performing detoxification, bile production, and glycogen storage.",
    attachments: "Divided into anatomical lobes (right, left, caudate, quadrate). Suspended by the falciform, coronary, and triangular ligaments.",
    bloodSupply: "Dual supply: Hepatic artery (25% oxygenated) and hepatic portal vein (75% nutrient-rich).",
    innervation: "Hepatic plexus (vagus and sympathetic fibers).",
    clinicalImportance: "Cirrhosis leads to portal hypertension, presenting as ascites, splenomegaly, and esophageal varices. Hepatic laceration is a major trauma risk.",
    radiologyAppearance: {
      xrayPosition: "Large soft-tissue shadow in RUQ, displacing bowel loops downward and medially.",
      ctAppearance: "Triphasic liver CT (unenhanced, arterial, portal-venous, and delayed phases) is vital to characterize lesions like hemangioma vs. hepatoma.",
      mriAppearance: "Excellent tissue contrast. High T2 signal suggests cysts/hemangioma; DWI checks for malignant masses."
    },
    relatedStructures: ["stomach", "pancreas", "kidneys", "diaphragm"],
    quizQuestions: [
      {
        question: "Which vessel carries the majority of blood volume to the liver?",
        options: ["Hepatic portal vein", "Hepatic artery", "Inferior vena cava", "Splenic artery"],
        correctIndex: 0,
        explanation: "The hepatic portal vein supplies approximately 75% of blood flow to the liver, carrying nutrient-rich blood from the gastrointestinal tract."
      }
    ]
  },
  {
    id: "pancreas",
    name: "Pancreas",
    category: "digestive",
    region: "Abdomen",
    difficulty: "Advanced",
    studyTime: "14 mins",
    description: "A retroperitoneal gland lying behind the stomach, possessing both exocrine (digestive enzymes) and endocrine (insulin, glucagon) functions.",
    attachments: "Divided into head (nestled in duodenum), neck, body, and tail (touching the spleen).",
    bloodSupply: "Splenic artery and pancreaticoduodenal arteries.",
    innervation: "Celiac and superior mesenteric plexuses.",
    clinicalImportance: "Acute pancreatitis causes severe epigastric pain radiating to the back. Chronic pancreatitis shows extensive parenchymal calcification.",
    radiologyAppearance: {
      xrayPosition: "Rarely helpful; may show a 'sentinel loop' (localized ileus) or diffuse calcifications in chronic pancreatitis.",
      ctAppearance: "Contrast-enhanced CT is the gold standard for acute pancreatitis, displaying swelling, fat stranding, fluid collections, or pancreatic necrosis (absence of enhancement).",
      mriAppearance: "Magnetic Resonance Cholangiopancreatography (MRCP) is excellent to visualize the pancreatic duct and search for obstructing gallstones."
    },
    relatedStructures: ["stomach", "liver", "kidneys"],
    quizQuestions: [
      {
        question: "Which non-invasive imaging modality is optimal for visualizing the biliary and pancreatic duct tree?",
        options: ["MRCP (MRI)", "Contrast-enhanced CT", "Barium swallow", "Abdominal X-Ray"],
        correctIndex: 0,
        explanation: "MRCP (Magnetic Resonance Cholangiopancreatography) uses heavily T2-weighted sequences to make static fluid in biliary/pancreatic ducts appear bright white, providing high-detail non-invasive projection of the duct tree."
      }
    ]
  },

  // ==========================================
  // 8. URINARY SYSTEM
  // ==========================================
  {
    id: "kidneys",
    name: "Kidneys",
    category: "urinary",
    region: "Abdomen",
    difficulty: "Advanced",
    studyTime: "15 mins",
    description: "A pair of bean-shaped retroperitoneal organs located on either side of the spine (T12-L3), responsible for blood filtration, urine production, and fluid balance.",
    attachments: "Encapsulated by renal capsule, perinephric fat, renal fascia (Gerota's fascia), and paranephric fat.",
    bloodSupply: "Renal arteries, arising directly from the abdominal aorta.",
    innervation: "Renal plexus.",
    clinicalImportance: "Renal calculi (kidney stones) cause excruciating flank pain. Hydronephrosis occurs when a stone obstructs the ureter.",
    radiologyAppearance: {
      xrayPosition: "Kidney shadow may be seen on a KUB (Kidney, Ureter, Bladder) film. Calcium oxalate stones appear radiopaque (white).",
      ctAppearance: "Non-contrast CT Abdomen/Pelvis (CT KUB) is the gold standard for kidney stones; shows stone size, location, and secondary hydronephrosis.",
      mriAppearance: "Useful for staging renal cell carcinoma (RCC) extension into the renal vein or inferior vena cava."
    },
    relatedStructures: ["urinary-bladder", "liver"],
    quizQuestions: [
      {
        question: "What is the gold standard imaging study to evaluate suspected renal colic (kidney stones)?",
        options: ["Non-contrast CT Abdomen/Pelvis (CT KUB)", "Intravenous pyelogram", "Contrast-enhanced CT", "Abdominal ultrasound"],
        correctIndex: 0,
        explanation: "Low-dose non-contrast CT is highly sensitive and specific for detecting kidney and ureteral stones, including small or radiolucent ones."
      }
    ]
  },
  {
    id: "urinary-bladder",
    name: "Urinary Bladder",
    category: "urinary",
    region: "Pelvis",
    difficulty: "Beginner",
    studyTime: "9 mins",
    description: "A hollow, distensible muscular sac located in the pelvic floor, acting as a reservoir for urine before micturition.",
    attachments: "The wall consists of the detrusor muscle; floor features the trigone area between ureteral orifices and urethra.",
    bloodSupply: "Superior and inferior vesical arteries.",
    innervation: "Parasympathetic pelvic splanchnic nerves (S2-S4) for detrusor contraction; sympathetic fibers for bladder filling.",
    clinicalImportance: "Bladder rupture can occur in pelvic fractures (extraperitoneal vs. intraperitoneal). Intraperitoneal rupture requires surgery.",
    radiologyAppearance: {
      xrayPosition: "Retrograde cystogram shows contrast pooling; intraperitoneal leak outlines bowel loops, while extraperitoneal leak shows a flame-like extravasation.",
      ctAppearance: "CT Cystography is standard to evaluate bladder trauma. Under normal conditions, bladder shows uniform fluid density.",
      mriAppearance: "Excellent for staging urinary bladder cancer, visualizing depth of muscle wall invasion (detrusor layer)."
    },
    relatedStructures: ["kidneys", "pelvis", "prostate", "uterus"],
    quizQuestions: [
      {
        question: "Which muscle forms the bladder wall and contracts under parasympathetic control to empty urine?",
        options: ["Detrusor muscle", "Trigone muscle", "Internal sphincter", "Dartos muscle"],
        correctIndex: 0,
        explanation: "The detrusor muscle forms the muscular coat of the bladder. Parasympathetic activation from S2-S4 causes it to contract during urination."
      }
    ]
  },

  // ==========================================
  // 9. REPRODUCTIVE SYSTEM
  // ==========================================
  {
    id: "uterus",
    name: "Uterus (Womb)",
    category: "reproductive",
    region: "Pelvis",
    difficulty: "Intermediate",
    studyTime: "12 mins",
    description: "A thick-walled, pear-shaped muscular organ in the female pelvic cavity, located between the bladder and rectum, where embryonic development occurs.",
    attachments: "Divided into fundus, body, and cervix. Anchored by the broad, round, cardinal, and uterosacral ligaments.",
    bloodSupply: "Uterine arteries (branches of internal iliac artery) and ovarian artery anastomoses.",
    innervation: "Inferior hypogastric plexus.",
    clinicalImportance: "Uterine fibroids (leiomyomas) are highly common benign tumors. Ectopic pregnancy in the fallopian tube is a life-threatening emergency.",
    radiologyAppearance: {
      xrayPosition: "Hysterosalpingography (HSG) utilizes fluoroscopy with iodinated contrast to check uterine cavity outline and fallopian tube patency.",
      ctAppearance: "Uterus appears as a soft-tissue mass posterior to the bladder; not optimal for internal endometrial detail.",
      mriAppearance: "High T2 contrast displays the three uterine zones: high-signal endometrium, low-signal junctional zone, and medium-signal myometrium."
    },
    relatedStructures: ["urinary-bladder", "pelvis"],
    quizQuestions: [
      {
        question: "On T2-weighted pelvic MRI, which uterine layer is seen as a distinct, low-signal (dark) band between endometrium and outer myometrium?",
        options: ["Junctional zone", "Serosa", "Perimetrium", "Decidua basalis"],
        correctIndex: 0,
        explanation: "The junctional zone is the inner layer of the myometrium and appears as a dark, hypointense band on T2 sequences. Thickening is seen in adenomyosis."
      }
    ]
  },
  {
    id: "prostate",
    name: "Prostate Gland",
    category: "reproductive",
    region: "Pelvis",
    difficulty: "Intermediate",
    studyTime: "11 mins",
    description: "A walnut-sized male accessory reproductive gland that surrounds the prostatic urethra, producing fluid that nourishes and transports sperm.",
    attachments: "Located inferior to the bladder neck and anterior to the rectum; supported by the puboprostatic ligaments.",
    bloodSupply: "Inferior vesical and middle rectal arteries.",
    innervation: "Prostatic plexus (cavernous nerves).",
    clinicalImportance: "Benign Prostatic Hyperplasia (BPH) causes bladder outlet obstruction in elderly men. Prostate cancer is highly common; evaluated via PI-RADS scoring.",
    radiologyAppearance: {
      xrayPosition: "Plain films do not visualize the prostate unless prostatic calcifications are present or if BPH elevates the bladder floor on a cystogram.",
      ctAppearance: "Mainly used to assess pelvic adenopathy or bony metastases in prostate cancer.",
      mriAppearance: "Multiparametric MRI (mpMRI) is the gold standard for prostate cancer detection, combining T2, Diffusion-Weighted Imaging (DWI), and Dynamic Contrast Enhancement (DCE)."
    },
    relatedStructures: ["urinary-bladder", "pelvis"],
    quizQuestions: [
      {
        question: "Which clinical scoring system is used to evaluate prostate cancer risk on multiparametric MRI?",
        options: ["PI-RADS", "BI-RADS", "LI-RADS", "Gleason score"],
        correctIndex: 0,
        explanation: "PI-RADS (Prostate Imaging-Reporting and Data System) is a standardized scoring system (1 to 5) used to grade the likelihood of clinically significant prostate cancer on MRI."
      }
    ]
  }
];
