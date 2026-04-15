import type { ActivityEntry } from "@/xp/types";
import type { Talent } from "@/talentos/types";
import type { FormativeClassEntry } from "@/lib/supabase/classes";
import type { Strike } from "@/lib/supabase/game";
import type { Mision } from "@/misiones/types";
import type { Lamina } from "@/laminas/types";
import type { RankingEntry } from "@/lib/supabase/comunidad";

export const DEMO_EMAIL = "demo@levelup.demo";

export const DEMO_NAME = "Bárbaro Demo";

export const DEMO_CLASS: FormativeClassEntry = {
  slug: "barbaro",
  title: "Bárbaro",
  inspiration: "Sansón",
  attributes: ["Fuerza", "Constitución"],
  description: "El camino del Bárbaro es el de la fortaleza inquebrantable. Cada desafío forja el carácter y expande los límites del cuerpo y la voluntad.",
  published: true,
  sort_order: 0,
};

export const DEMO_XP = 3040;
export const DEMO_LEVEL = 23;
export const DEMO_LEVEL_NAME = "Maestría";
export const DEMO_XP_CURRENT_LEVEL = 2916;  // XP_THRESHOLDS[22] — start of level 23
export const DEMO_XP_NEXT_LEVEL = 3168;     // XP_THRESHOLDS[23] — start of level 24
export const DEMO_NEXT_LEVEL_NAME = "Excelencia";
export const DEMO_STRIKES = 1;
export const DEMO_BLOCKED = false;

export const DEMO_STRIKE_DETAILS: Strike[] = [
  {
    id: "demo-strike-1",
    course_id: "demo-class",
    student_email: DEMO_EMAIL,
    bimestre: "B2",
    reason: "late_submission",
    classroom_coursework_id: null,
    active: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    annulled_at: null,
    annulled_by: null,
  },
];

export const DEMO_TALENTS: Talent[] = [
  { id: "mano-firme",            name: "Mano Firme",            attributes: ["Destreza", "Constitución"], description: "Precisión sostenida en el trazo técnico, reflejando dominio del instrumento." },
  { id: "perseverancia-activa",  name: "Perseverancia Activa",  attributes: ["Sabiduría", "Constitución"], description: "Capacidad de retomar tareas inconclusas y llevarlas a término con calidad." },
  { id: "atencion-al-detalle",   name: "Atención al Detalle",   attributes: ["Destreza", "Sabiduría"],    description: "Registro minucioso de los elementos que componen una producción técnica." },
  { id: "claridad-comunicativa", name: "Claridad Comunicativa", attributes: ["Carisma", "Inteligencia"],  description: "Capacidad de expresar ideas técnicas con precisión y economía de medios." },
  { id: "dominio-instrumental",  name: "Dominio Instrumental",  attributes: ["Destreza", "Fuerza"],       description: "Uso competente y fluido de los instrumentos propios del espacio curricular." },
];

export const DEMO_BIMESTRE = "B2";

const now = Date.now();

export const DEMO_MISIONES_PENDIENTES: Mision[] = [
  {
    id: "dm-p1",
    title: "Perspectiva Axonométrica — Vivienda Unifamiliar",
    tipo: "CAD",
    status: "pendiente",
    xpReward: 35,
    dueAt: new Date(now + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "dm-p2",
    title: "Detalle Constructivo — Sistema de Fundaciones",
    tipo: "A3",
    status: "pendiente",
    xpReward: 50,
    dueAt: new Date(now + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "dm-p3",
    title: "Memoria Descriptiva del Proyecto",
    tipo: "A4",
    status: "pendiente",
    xpReward: 20,
    dueAt: new Date(now + 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: "dm-p4",
    title: "Croquis de Análisis Tipológico",
    tipo: "A4",
    status: "atrasada",
    xpReward: 20,
    dueAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_MISIONES_COMPLETADAS: Mision[] = [
  {
    id: "dm-c1",
    title: "Plano de Planta — Vivienda Unifamiliar",
    tipo: "CAD",
    status: "completada",
    xpReward: 85,
    xpBonus: 50,
    dueAt: new Date(now - 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 1 * 60 * 60 * 1000),
  },
  {
    id: "dm-c2",
    title: "Elevaciones y Cortes — Vivienda Unifamiliar",
    tipo: "A3",
    status: "completada",
    xpReward: 65,
    xpBonus: 15,
    dueAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 28 * 60 * 60 * 1000),
  },
  {
    id: "dm-c3",
    title: "Croquis de Relevamiento in Situ",
    tipo: "A4",
    status: "completada",
    xpReward: 20,
    xpBonus: 0,
    dueAt: new Date(now - 6 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "dm-c4",
    title: "Estudio de Materiales — B2",
    tipo: "A4",
    status: "completada",
    xpReward: 20,
    xpBonus: 0,
    dueAt: new Date(now - 9 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 8 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_MISIONES_XP_TOTAL = 85 + 65 + 20 + 20; // 190 XP from completed missions

export const DEMO_LAMINAS: Lamina[] = [
  // ── B2 (active) ──
  {
    id: "dl-b2-1",
    productionType: "CAD",
    title: "Plano de Planta — Vivienda Unifamiliar",
    bimestre: "B2",
    dueDate: new Date(now - 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 1 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 85,
    isEarly: false,
    strikeAdded: false,
  },
  {
    id: "dl-b2-2",
    productionType: "A3",
    title: "Elevaciones y Cortes — Vivienda Unifamiliar",
    bimestre: "B2",
    dueDate: new Date(now - 2 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 28 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 65,
    isEarly: true,
    strikeAdded: false,
  },
  {
    id: "dl-b2-3",
    productionType: "A4",
    title: "Croquis de Relevamiento in Situ",
    bimestre: "B2",
    dueDate: new Date(now - 6 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 20,
    isEarly: false,
    strikeAdded: false,
  },
  {
    id: "dl-b2-4",
    productionType: "A4",
    title: "Estudio de Materiales — B2",
    bimestre: "B2",
    dueDate: new Date(now - 9 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 8 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 20,
    isEarly: false,
    strikeAdded: false,
  },
  {
    id: "dl-b2-5",
    productionType: "A4",
    title: "Croquis de Análisis Tipológico",
    bimestre: "B2",
    dueDate: new Date(now - 2 * 24 * 60 * 60 * 1000),
    submittedAt: undefined,
    status: "tardía",
    xpEarned: undefined,
    isEarly: false,
    strikeAdded: true,
  },
  {
    id: "dl-b2-6",
    productionType: "CAD",
    title: "Perspectiva Axonométrica — Vivienda Unifamiliar",
    bimestre: "B2",
    dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000),
    submittedAt: undefined,
    status: "pendiente",
    xpEarned: undefined,
    isEarly: false,
    strikeAdded: false,
  },
  {
    id: "dl-b2-7",
    productionType: "A3",
    title: "Detalle Constructivo — Sistema de Fundaciones",
    bimestre: "B2",
    dueDate: new Date(now + 7 * 24 * 60 * 60 * 1000),
    submittedAt: undefined,
    status: "pendiente",
    xpEarned: undefined,
    isEarly: false,
    strikeAdded: false,
  },
  // ── B1 (previous) ──
  {
    id: "dl-b1-1",
    productionType: "CAD",
    title: "Trazado Geométrico Complejo",
    bimestre: "B1",
    dueDate: new Date(now - 45 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 46 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 50,
    isEarly: true,
    strikeAdded: false,
  },
  {
    id: "dl-b1-2",
    productionType: "A3",
    title: "Composición de Vistas Ortogonales",
    bimestre: "B1",
    dueDate: new Date(now - 40 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 39 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 50,
    isEarly: false,
    strikeAdded: false,
  },
  {
    id: "dl-b1-3",
    productionType: "A4",
    title: "Análisis de Sistemas Constructivos",
    bimestre: "B1",
    dueDate: new Date(now - 35 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 33 * 24 * 60 * 60 * 1000),
    status: "tardía",
    xpEarned: 20,
    isEarly: false,
    strikeAdded: true,
  },
  {
    id: "dl-b1-4",
    productionType: "A4",
    title: "Croquis a Mano Alzada — Perspectiva",
    bimestre: "B1",
    dueDate: new Date(now - 30 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 31 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 20,
    isEarly: true,
    strikeAdded: false,
  },
  {
    id: "dl-b1-5",
    productionType: "EVA",
    title: "Evaluación Integradora — B1",
    bimestre: "B1",
    dueDate: new Date(now - 25 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(now - 25 * 24 * 60 * 60 * 1000),
    status: "entregada",
    xpEarned: 35,
    isEarly: false,
    strikeAdded: false,
  },
];

export const DEMO_ACTIVITY: ActivityEntry[] = [
  {
    id: "d1", type: "xp_quality",
    description: "CAD entregada con calidad destacada",
    xpDelta: 85, productionType: "CAD",
    timestamp: new Date(now - 1 * 60 * 60 * 1000),
  },
  {
    id: "d2", type: "xp_silent",
    description: "A3 entregada antes del plazo",
    xpDelta: 65, productionType: "A3",
    timestamp: new Date(now - 28 * 60 * 60 * 1000),
  },
  {
    id: "d3", type: "strike_added",
    description: "Strike registrado — entrega fuera de término",
    timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "d4", type: "xp_base",
    description: "A4 entregada",
    xpDelta: 20, productionType: "A4",
    timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "d5", type: "level_up",
    description: "Nivel 23 alcanzado — Maestría",
    timestamp: new Date(now - 8 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_RANKING: RankingEntry[] = [
  { email: "v@demo.com",         displayName: "valentinoverarouquaud", formativeClass: "erudito",  level: 3, xpTotal: 430, position: 1 },
  { email: "l@demo.com",         displayName: "lolacannizzo",          formativeClass: "erudito",  level: 3, xpTotal: 430, position: 2 },
  { email: "m@demo.com",         displayName: "marlenemartinez",       formativeClass: "erudito",  level: 3, xpTotal: 415, position: 3 },
  { email: "lc@demo.com",        displayName: "leoncussotto",          formativeClass: "erudito",  level: 3, xpTotal: 415, position: 4 },
  { email: "f@demo.com",         displayName: "francescacurtosi",      formativeClass: "paladin",  level: 3, xpTotal: 400, position: 5 },
  { email: "j@demo.com",         displayName: "joaquinmendoza",        formativeClass: "barbaro",  level: 3, xpTotal: 400, position: 6 },
  { email: "i@demo.com",         displayName: "intimonaco",            formativeClass: "clerigo",  level: 3, xpTotal: 385, position: 7 },
  { email: "r@demo.com",         displayName: "rociobaez",             formativeClass: "druida",   level: 3, xpTotal: 370, position: 8 },
  { email: "lf@demo.com",        displayName: "lautarofigueirascasa",   formativeClass: "bardo",    level: 3, xpTotal: 370, position: 9 },
  { email: "lm@demo.com",        displayName: "lucasmontoya",          formativeClass: "erudito",  level: 2, xpTotal: 355, position: 10 },
  { email: DEMO_EMAIL,           displayName: "Bárbaro Demo",          formativeClass: "barbaro",  level: 3, xpTotal: 340, position: 11 },
  { email: "so@demo.com",        displayName: "sofiaortega",           formativeClass: "clerigo",  level: 2, xpTotal: 320, position: 12 },
  { email: "tp@demo.com",        displayName: "tomasperezcasas",       formativeClass: "druida",   level: 2, xpTotal: 300, position: 13 },
];
