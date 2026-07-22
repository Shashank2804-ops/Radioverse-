/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { XrayPositioningItem } from "../types";

export const xrayPositioningItems: XrayPositioningItem[] = [
  {
    id: "chest-pa",
    region: "chest",
    projection: "PA (Posteroanterior) View",
    indications: [
      "Assess cardiopulmonary diseases (Pneumonia, Pleural Effusion)",
      "Pneumothorax detection",
      "Cardiac size assessment (CTR evaluation)",
      "Pre-operative health screening"
    ],
    positioningSteps: [
      "Patient stands erect, facing the vertical image receptor (IR) chest stand.",
      "The chin is raised and placed on the top margin of the IR.",
      "Hands are placed on the lower hips, with elbows flexed and shoulders rolled forward.",
      "Rolling shoulders forward rotates the scapulae laterally out of the lung fields.",
      "The central ray (CR) is perpendicular to the IR, centered at the midsagittal plane at the level of T7 (inferior angle of the scapula).",
      "Exposure is taken at the end of a second full deep inspiration."
    ],
    technicalFactors: {
      kvp: "110 - 125 kV",
      mas: "3 - 5 mAs",
      sid: "180 cm (72 inches)",
      grid: true
    },
    commonErrors: [
      "Failure to roll shoulders forward, causing scapulae to overlap the lung apexes.",
      "Inadequate inspiration (showing fewer than 10 posterior ribs above the diaphragm).",
      "Patient rotation, detected by asymmetry in the distances between the medial clavicular heads and the spinous processes.",
      "Chin placed too low, obscuring the upper trachea."
    ],
    notes: "A Source-Image Distance (SID) of 180 cm is used to minimize magnification of the heart shadow, providing an accurate representation of cardiac size."
  },
  {
    id: "abdomen-ap-erect",
    region: "abdomen",
    projection: "AP (Anteroposterior) Erect View",
    indications: [
      "Detect pneumoperitoneum (free intraperitoneal air under the diaphragm)",
      "Evaluate bowel obstruction (air-fluid levels)",
      "Verify position of feeding tubes or catheters"
    ],
    positioningSteps: [
      "Patient stands erect with their back against the vertical grid stand.",
      "Ensure the patient is upright for at least 5-10 minutes prior to exposure to allow free air to rise to the diaphragmatic domes.",
      "The midsagittal plane is perpendicular to the IR.",
      "Arms are placed comfortably at the sides, out of the field.",
      "Central ray is horizontal and directed perpendicular to the center of the IR, at the level of 5 cm (2 inches) above the iliac crests (to include the diaphragms).",
      "Make exposure at the end of expiration (stops diaphragm movement and chest recoil)."
    ],
    technicalFactors: {
      kvp: "75 - 85 kV",
      mas: "25 - 35 mAs",
      sid: "100 cm (40 inches)",
      grid: true
    },
    commonErrors: [
      "Failing to include the diaphragm (crucial for checking pneumoperitoneum).",
      "Patient movement or shallow breathing causing blurring of kidneys or psoas margins.",
      "Taking the radiograph immediately after the patient stands up, which doesn't give free gas enough time to accumulate under the diaphragm."
    ],
    notes: "If the patient is too ill to stand, a Left Lateral Decubitus Abdomen view is the alternative to assess for free air, because free air rises against the homogeneous density of the liver."
  },
  {
    id: "cervical-spine-ap",
    region: "spine",
    projection: "AP Axial Cervical Spine",
    indications: [
      "Assess cervical spine trauma / subluxation",
      "Evaluate degenerative joint disease, bone spurs, or herniations",
      "Spondylolisthesis check"
    ],
    positioningSteps: [
      "Patient sits or stands erect with their back against the vertical grid.",
      "The midsagittal plane is aligned to the center of the IR.",
      "The chin is elevated so that the occlusal plane (line from lower incisors to mastoid tip) is perpendicular to the table, preventing the jaw from overlapping the upper C-spine.",
      "Direct the central ray (CR) with a 15-to-20 degree cephalad (towards head) angle.",
      "Center the CR at the level of C4 (lower margin of the thyroid cartilage).",
      "Instruct the patient to suspend breathing and swallow on command to avoid laryngeal movement."
    ],
    technicalFactors: {
      kvp: "70 - 75 kV",
      mas: "10 - 15 mAs",
      sid: "100 cm (40 inches)",
      grid: true
    },
    commonErrors: [
      "Incorrect CR angulation: less than 15 degrees cephalad fails to open up the intervertebral disk spaces.",
      "Incorrect chin placement: tipping chin too far up projects the skull base over upper cervical vertebrae; tipping chin too low overlays the mandible."
    ],
    notes: "AP Axial Cervical projection beautifully demonstrates C3 through T1 vertebrae, including the intervertebral disk spaces and transverse processes."
  },
  {
    id: "hand-pa",
    region: "upper-limb",
    projection: "PA Hand View",
    indications: [
      "Suspected bone fracture or dislocation of phalanges/metacarpals",
      "Foreign body localization",
      "Rheumatoid arthritis structural changes",
      "Bone age determination"
    ],
    positioningSteps: [
      "Patient sits at the side of the table with the elbow flexed at 90 degrees.",
      "The forearm and hand are placed flat on the table, palmar side down (pronation).",
      "The fingers are spread slightly and extended fully to prevent overlap of bony margins.",
      "The central ray (CR) is vertical and perpendicular to the IR.",
      "Center the CR directly at the third metacarpophalangeal (MCP) joint.",
      "Collimate closely on all four sides of the hand, including the wrist joint."
    ],
    technicalFactors: {
      kvp: "50 - 55 kV",
      mas: "2 - 3 mAs",
      sid: "100 cm (40 inches)",
      grid: false
    },
    commonErrors: [
      "Incomplete extension of the fingers, resulting in closed interphalangeal joints on the radiograph.",
      "Hand rotated, causing oblique projection of phalanges instead of true PA.",
      "Failure to include the distal phalanges or proximal wrist area."
    ],
    notes: "Because the hand consists of thin bone structures, a grid is NOT used, and lower kVp is preferred to optimize radiographic contrast."
  },
  {
    id: "knee-ap",
    region: "lower-limb",
    projection: "AP Weight-Bearing Knee View",
    indications: [
      "Degenerative joint disease (Osteoarthritis evaluation)",
      "Tibiofemoral joint space narrowing assessment",
      "Valgus or varus deformity evaluation",
      "Suspected tibial plateau fracture"
    ],
    positioningSteps: [
      "Patient stands erect, distributing weight equally on both legs, facing the X-Ray tube.",
      "Back of the knees are placed flat against the vertical IR stand.",
      "Extend the knees fully, with the feet pointing straight forward.",
      "For a single-knee view, center the central ray (CR) at 1.25 cm (0.5 inches) inferior to the apex of the patella.",
      "Direct the CR horizontally (or with a 3-5 degree caudad angle if the patient has thin pelvic depth, to parallel the tibial plateau).",
      "Instruct patient to stand perfectly still during exposure."
    ],
    technicalFactors: {
      kvp: "65 - 70 kV",
      mas: "6 - 10 mAs",
      sid: "100 cm (40 inches)",
      grid: true
    },
    commonErrors: [
      "Patient rotating the leg inwardly or outwardly, altering the patellar position.",
      "Patient flexing the knee slightly, which closes the joint space on the film.",
      "Non-weight-bearing AP view done instead, which underestimates cartilage loss in joint space narrowing."
    ],
    notes: "Weight-bearing projections are critical in orthopedic radiology, as they demonstrate actual functional joint space narrowing under physiological load."
  }
];
