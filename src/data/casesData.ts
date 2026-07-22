/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseStudy, XrayReportTemplate } from "../types";

export const caseStudies: CaseStudy[] = [
  {
    id: "case-pneumonia",
    title: "Right Lower Lobe Lobar Pneumonia",
    category: "chest",
    history: "A 45-year-old male presents with a 4-day history of high-grade fever, productive cough with rust-colored sputum, and sharp right-sided pleuritic chest pain that worsens on deep breathing.",
    findings: "There is a dense, homogeneous consolidative opacity in the right lower zone, bounded superiorly by the oblique fissure. The right dome of the diaphragm is silhouetted (blurred), while the right heart border remains sharply visible. Air bronchograms are seen within the opacity.",
    impression: "Right lower lobe consolidation, highly consistent with acute bacterial lobar pneumonia (e.g. Streptococcus pneumoniae).",
    explanation: "The consolidation occurs because alveoli are filled with inflammatory exudate. This causes a dense white area on the radiograph. Since the consolidative process lies in the right lower lobe, it rests directly against the diaphragm, blurring its outline. It does not contact the right atrium, so the right heart border remains clear (the classic silhouette sign rules).",
    differentialDiagnosis: [
      "Lobar Atelectasis (would show volume loss, e.g. tracheal deviation or elevation of the fissure)",
      "Pleural Effusion (would show a meniscus sign and contralateral mediastinal shift if large)",
      "Pulmonary Infarction"
    ],
    learningPoints: [
      "Identify air bronchograms: dark, air-filled bronchi outlined by fluid-filled alveoli, confirming alveolar-space pathology.",
      "Apply the silhouette sign: loss of the right hemidiaphragm indicates right lower lobe, whereas loss of the right heart border indicates right middle lobe.",
      "Check expiration films vs inspiration films: poor inspiration can simulate consolidation in the lung bases."
    ],
    normalImageUrl: "normal-chest",
    abnormalImageUrl: "pneumonia-chest",
    isCaseOfTheDay: true
  },
  {
    id: "case-clavicle-fracture",
    title: "Mid-Shaft Clavicle Fracture",
    category: "fracture",
    history: "An 18-year-old female fell off her bicycle landing directly on her right lateral shoulder. She presents with immediate severe pain, localized swelling, and deformity, holding her right arm close to her chest.",
    findings: "Complete, displaced fracture of the middle third (shaft) of the right clavicle. The medial fracture fragment is displaced superiorly due to the upward pull of the sternocleidomastoid muscle. The lateral fragment is displaced inferiorly and medially due to the weight of the arm and pull of pectoralis major. No overriding fragment is causing neurovascular compromise.",
    impression: "Displaced mid-shaft right clavicle fracture (Allman Classification Group I).",
    explanation: "The middle third is the thinnest and least supported part of the clavicle, making it the most common site of fracture (80% of cases). The muscular attachments pull the bone ends in opposite directions, causing the typical displacement pattern seen on the AP projection.",
    differentialDiagnosis: [
      "Acromioclavicular (AC) Joint Separation (fracture line absent; widened AC distance)",
      "Sternoclavicular dislocation",
      "Distal clavicle fracture"
    ],
    learningPoints: [
      "Clavicle anatomy divides into medial, middle, and lateral thirds. Shaft fractures are group I.",
      "Check for complications: apex posterior displacement can injure the subclavian vessels or brachial plexus.",
      "Treatment: Most mid-shaft clavicle fractures can be managed conservatively with a sling, but surgical fixation is indicated for extreme displacement, skin tenting, or open fractures."
    ],
    normalImageUrl: "normal-shoulder",
    abnormalImageUrl: "fracture-shoulder"
  },
  {
    id: "case-pleural-effusion",
    title: "Massive Left Pleural Effusion",
    category: "chest",
    history: "A 68-year-old female with a history of congestive heart failure presents with worsening shortness of breath over two weeks, now unable to lie flat (orthopnea).",
    findings: "There is a uniform, dense, radiopaque shadow covering the middle and lower zones of the left hemithorax. The upper margin demonstrates a classic upward-curving crescent shape (meniscus sign). There is obliteration of the left costophrenic and cardiophrenic angles, with moderate displacement of the trachea and mediastinum to the contralateral (right) side.",
    impression: "Large left pleural effusion with mediastinal shift.",
    explanation: "Pleural fluid accumulates in the pleural space due to gravity, starting in the posterior costophrenic angle. On a standard upright PA projection, it obscures the lower lung, and because of capillary action and surface tension, the fluid creeps up the lateral chest wall, creating the meniscus sign.",
    differentialDiagnosis: [
      "Total Lung Atelectasis / Collapse (would cause homolateral mediastinal shift - pulling towards the collapse side)",
      "Massive consolidation (no meniscus sign, air bronchograms present, no major mediastinal shift)",
      "Pleural mesothelioma"
    ],
    learningPoints: [
      "Costophrenic angle blunting requires at least 150-200 mL of fluid on an upright PA projection.",
      "Mediastinal displacement: pleural fluid acts as a space-occupying mass (pushes mediastinum away), whereas collapse acts like a vacuum (pulls mediastinum towards).",
      "Lateral decubitus projection can confirm if fluid is free-flowing or loculated (will layer along the lateral chest wall)."
    ],
    normalImageUrl: "normal-chest",
    abnormalImageUrl: "effusion-chest"
  }
];

export const reportTemplates: XrayReportTemplate[] = [
  {
    id: "report-normal-chest",
    title: "Standard Normal Chest PA Report",
    patientHistory: "Routine health checkup / No respiratory symptoms.",
    findings: "The lungs are clear without focal consolidations, nodules, or masses. No evidence of pneumothorax or pleural effusion. The cardiomediastinal contour is normal in size and configuration. The bony structures of the chest wall and visualized upper abdomen are intact and normal. Costophrenic and cardiophrenic recesses are sharp.",
    impression: "No active cardiopulmonary disease.",
    simplifiedExplanation: "This is a clean report. The lungs are well-expanded and contain only air (which appears black on an X-Ray). There are no fluid-filled white spots (pneumonia) and no fluid layers in the corners. The heart size is less than half the width of the rib cage, which is healthy.",
    anatomyKeywords: ["Lungs", "Pleural Cavity", "Cardiomediastinal Contour", "Costophrenic Recess"],
    commonMistakes: [
      "Confusing normal vascular markings (which branch outwards and fade towards the periphery) for pneumonia or congestion.",
      "Misidentifying the outline of female breast shadows or nipples as a lung nodule or consolidation."
    ]
  },
  {
    id: "report-rib-fracture",
    title: "Post-Traumatic Rib Fracture Report",
    patientHistory: "Blunt chest trauma from motor vehicle collision.",
    findings: "Well-defined, transverse, non-displaced fracture lines are visible at the lateral aspects of the right 6th and 7th ribs. There is no accompanying displacement or bony overriding. There is no pleural thickening, pneumothorax, or apical cap. The remaining ribs and thoracic bones are intact. Cardiorespiratory structures are otherwise stable.",
    impression: "Non-displaced fractures of the right 6th and 7th ribs. No radiographic evidence of pneumothorax.",
    simplifiedExplanation: "There are two fine cracks on the side of the 6th and 7th ribs on the right side. The bones have not shifted out of place, so they should heal well on their own. Crucially, the lungs have not collapsed, and there is no air leaking into the chest cavity (pneumothorax).",
    anatomyKeywords: ["Posterior Ribs", "Cortical Continuity", "Pneumothorax Check", "Costal Cartilage"],
    commonMistakes: [
      "Overlooking non-displaced rib fractures, as they can be extremely subtle and may only become obvious weeks later when calluses form.",
      "Confusing overlapping muscle lines or clothes folds for a fracture."
    ]
  }
];
