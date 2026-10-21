export interface FunnelSummaryResponse {
  totalReportesIngresados: number;
  reportesEnTriajeSinOt: number;
  reportesConOrdenTrabajo: number;
  pctTasaConversionAOt: number | null;
  otPendientesAsignar: number;
  otAsignadasACuadrilla: number;
  otEnProcesoEjecucion: number;
  otEnEsperaPausadas: number;
  otCompletadasResueltas: number;
  otCanceladasOFalsosReportes: number;
  totalCargaActivaPendiente: number;
  pctTasaResolucionGlobal: number | null;
  horasPromedioTriajeACreacionOt: number | null;
  horasPromedioAsignacionTecnico: number | null;
  horasPromedioEjecucionCampo: number | null;
  horasPromedioCicloCompletoResolucion: number | null;
}

export interface StateMatrixItemResponse {
  estadoIncidente: string;
  estadoOrdenTrabajo: string;
  nombreEstadoOt: string;
  cantidadReportes: number;
  porcentajeDelTotalReportes: number;
  diasPromedioAbierto: number | null;
  criticosEnEstaEtapa: number;
  diagnosticoOperativo: string;
}

export interface OriginChannelItemResponse {
  canalOrigen: string;
  totalReportes: number;
  conOrdenTrabajo: number;
  tasaConversionOtPct: number | null;
  asignadosATecnico: number;
  enProcesoCampo: number;
  totalResueltos: number;
  tasaExitoResolucionPct: number | null;
  descartadosFalsos: number;
  tasaDescartePct: number | null;
  horasPromedioResolucion: number | null;
}

export interface CategoryDepartmentItemResponse {
  categoriaProblema: string;
  tipoProblema: string;
  prioridadSugerida: string | null;
  departamentoResponsable: string;
  totalIncidentes: number;
  totalOtsCreadas: number;
  otsAsignadasActivas: number;
  otsEnProcesoCampo: number;
  totalCompletados: number;
  pctCumplimiento: number | null;
  costoReparacionAcumulado: number;
  diasPromedioAtencion: number | null;
}

export interface SyncDiscrepancyItemResponse {
  codigoIncidente: string;
  codigoOrden: string;
  estadoIncidente: string;
  estadoOt: string;
  fechaReporte: string;
  fechaCompletadaOt: string | null;
  fechaAsignacionOt: string | null;
  tipoDesfase: string;
  tecnicoAsignado: string;
}

export interface DispatchControlItemResponse {
  codigoIncidente: string;
  fechaReporte: string;
  acometidaId: string | null;
  direccionReferencia: string | null;
  origenReporte: string;
  prioridadReporte: string;
  estadoReporte: string;
  codigoOrden: string | null;
  estadoOt: string;
  nombreEstadoOt: string;
  tipoTrabajo: string | null;
  tecnicoResponsable: string;
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  fechaCompletada: string | null;
  slaHoras: number | null;
  horasDesdeReporte: number;
  semaforoSla: string;
}

export interface HeaderKpisResponse {
  totalOrders: number;
  pendingOrAssigned: number;
  inProgress: number;
  onHold: number;
  criticalOrders: number;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  createdToday: number;
  createdLast7Days: number;
  createdThisMonth: number;
  completed: number;
  closed: number;
  completionRate: number | null;
  totalMaterialCost: number;
  avgHoursToComplete: number | null;
  avgHoursToAssignment: number | null;
}

export interface StatusDistributionItemResponse {
  statusName: string;
  statusId: string;
  statusDescription: string | null;
  quantity: number;
  percentageOfTotal: number;
  colorHex: string;
}

export interface PriorityDistributionItemResponse {
  priorityLevel: string;
  priorityId: number;
  description: string | null;
  slaHoras: number;
  quantity: number;
  percentageOfTotal: number;
  cumplieronSla: number;
  tasaCumplimientoSlaPct: number | null;
  colorHex: string;
}

export interface WorkTypePerformanceItemResponse {
  workType: string;
  workTypeId: number;
  departmentName: string;
  quantity: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRatePercentage: number | null;
  avgHoursToComplete: number | null;
}

export interface KeyStatisticsMatrixItemResponse {
  totalOrders: number;
  statusId: string;
  statusName: string;
  workTypeId: number;
  workType: string;
  departmentId: number;
  departmentName: string;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  criticalOrders: number;
  createdToday: number;
  createdLast7Days: number;
  createdThisMonth: number;
  closed: number;
  completed: number;
  avgHoursToComplete: number | null;
  avgHoursToAssignment: number | null;
  pctCompletedInGroup: number | null;
  pctPendingOrAssigned: number | null;
  totalMaterialCost: number;
  avgWorkersPerOrder: number | null;
  totalWorkerAssignments: number;
}

export interface TechnicianPerformanceItemResponse {
  idTecnico: string;
  nombreTecnico: string;
  cedula: string | null;
  telefonoInterno: string | null;
  totalOrdenesAsignadasHistoricas: number;
  ordenesPorIniciar: number;
  ordenesEnEjecucionHoy: number;
  ordenesEnPausa: number;
  totalBacklogActivo: number;
  totalCompletadas: number;
  completadasEsteMes: number;
  tasaCumplimientoSlaPct: number | null;
  horasPromedioEnCampo: number | null;
}

export interface TechnicianDailyFeedItemResponse {
  idOrdenTrabajo: number;
  codigoOrden: string;
  estado: string;
  nombreEstado: string;
  tipoTrabajo: string;
  prioridad: string;
  slaHoras: number;
  direccion: string | null;
  ubicacionDetalles: string | null;
  claveCatastral: string | null;
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  latitud: number | null;
  longitud: number | null;
  horasRestantesSla: number;
  esOrdenMasPrioritaria: boolean;
}

export interface CrewAssignmentItemResponse {
  codigoOrden: string;
  estadoOt: string;
  tipoTrabajo: string;
  nombreTrabajador: string;
  cedula: string | null;
  rolEnCuadrilla: string | null;
  esResponsable: boolean;
  fechaAsignacion: string | null;
}

export interface SlaMonitorItemResponse {
  codigoOrden: string;
  tipoTrabajo: string;
  departamento: string;
  prioridad: string;
  slaHoras: number;
  fechaCreacion: string;
  tecnicoAsignado: string;
  horasTranscurridas: number;
  horasHolguraSla: number;
  estadoSlaSemaforo: string;
}

export interface QualityIndicatorItemResponse {
  departamento: string;
  tipoTrabajo: string;
  totalOrdenesInspeccionadas: number;
  totalInspeccionesPreparacion: number;
  preinspeccionesAprobadas: number;
  preinspeccionesRechazadas: number;
  pctAprobacionPreinspeccion: number | null;
  totalControlesCalidad: number;
  trabajosCalidadAprobados: number;
  trabajosCalidadRechazadosRetrabajo: number;
  pctAprobacionCalidadFinal: number | null;
}

export interface EscalationAuditItemResponse {
  codigoOrden: string;
  tipoTrabajo: string;
  departamento: string;
  estadoActual: string;
  fechaCreacion: string;
  tecnicoQueEscalo: string | null;
  motivoEscalamiento: string | null;
}

export interface MaterialCostItemResponse {
  departamento: string;
  tipoTrabajo: string;
  codigoMaterial: string | null;
  descripcionMaterial: string;
  cantidadTotalConsumida: number;
  costoUnitarioPromedio: number | null;
  costoTotalMateriales: number;
  ordenesQueLoUtilizaron: number;
}

export interface EconomicBalanceItemResponse {
  mes: string;
  totalOrdenes: number;
  costoTotalMaterialesEpaa: number;
  costoTotalAdicionalesEpaa: number;
  costoOperativoTotalIncurrido: number;
  montoCobrableAUsuarios: number;
  balanceNetoRecuperacion: number;
}

export interface DailyTrendItemResponse {
  fecha: string;
  incidentesReportados: number;
  ordenesCreadas: number;
  ordenesCompletadas: number;
  balanceFlujoNeto: number;
}

export interface TerritorialConcentrationItemResponse {
  parroquia: string;
  sectorHidrometrico: string;
  totalIncidentesZona: number;
  totalOtsZona: number;
  otsActivasEnCampo: number;
  incidentesCriticos: number;
  latitudCentroide: number | null;
  longitudCentroide: number | null;
}

export interface ExecutiveOverviewResponse {
  metadata: {
    empresa: string;
    sistema: string;
    generadoEn: string;
  };
  comparativaIncidentesVsOts: {
    totalReportes: number;
    reportesSinOt: number;
    reportesConOt: number;
    tasaConversionOtPct: number | null;
    otPendientesAsignacion: number;
    otAsignadasACuadrilla: number;
    otEnProcesoCampo: number;
    otEnEspera: number;
    otCompletadasResueltas: number;
    tasaResolucionGlobalPct: number | null;
  };
  kpisOrdenesTrabajo: {
    totalOrdenes: number;
    pendientesOAsignadas: number;
    enProgreso: number;
    criticas: number;
    emergencias: number;
    urgentes: number;
    creadasHoy: number;
    creadasUltimos7Dias: number;
    creadasEsteMes: number;
    completadas: number;
    cerradas: number;
    tasaCumplimientoPct: number | null;
    horasPromedioResolucion: number | null;
  };
  distribucionEstados: Array<{
    statusId: string;
    statusName: string;
    quantity: number;
    percentage: number;
  }>;
  distribucionPrioridades: Array<{
    priorityId: number;
    priorityLevel: string;
    quantity: number;
    percentage: number;
    slaHoras: number;
  }>;
  ordenesAtencionInmediata: Array<{
    codigoOrden: string;
    tipoTrabajo: string;
    prioridad: string;
    estado: string;
    tecnico: string;
    horasTranscurridas: number;
    slaHoras: number;
  }>;
}
