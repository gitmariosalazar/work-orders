import {
  DashboardService,
  DEFAULT_DISPATCH_CONTROL_LIMIT,
  MAX_DISPATCH_CONTROL_LIMIT,
} from './dashboard.service';
import {
  InterfaceExecutiveDashboardRepository,
  InterfaceFinancialDashboardRepository,
  InterfaceIncidentOrderComparisonRepository,
  InterfaceQualitySlaDashboardRepository,
  InterfaceTechnicianDashboardRepository,
  InterfaceTrendsDashboardRepository,
  UserParams,
} from '../../domain/contracts/dashboard.interface.repository';

describe('DashboardService', () => {
  let service: DashboardService;
  let comparisonRepo: jest.Mocked<InterfaceIncidentOrderComparisonRepository>;
  let executiveRepo: jest.Mocked<InterfaceExecutiveDashboardRepository>;
  let technicianRepo: jest.Mocked<InterfaceTechnicianDashboardRepository>;
  let qualitySlaRepo: jest.Mocked<InterfaceQualitySlaDashboardRepository>;
  let financialRepo: jest.Mocked<InterfaceFinancialDashboardRepository>;
  let trendsRepo: jest.Mocked<InterfaceTrendsDashboardRepository>;

  beforeEach(() => {
    comparisonRepo = {
      getFunnelSummary: jest.fn(),
      getStateMatrix: jest.fn(),
      getOriginChannelBreakdown: jest.fn(),
      getCategoryDepartmentBreakdown: jest.fn(),
      getSyncDiscrepancies: jest.fn(),
      getDispatchControl: jest.fn(),
    };

    executiveRepo = {
      getHeaderKpis: jest.fn(),
      getStatusDistribution: jest.fn(),
      getPriorityDistribution: jest.fn(),
      getWorkTypePerformance: jest.fn(),
      getKeyStatisticsMatrix: jest.fn(),
      getExecutiveOverview: jest.fn(),
    };

    technicianRepo = {
      getTechnicianPerformance: jest.fn(),
      getTechnicianDailyFeed: jest.fn(),
      getCrewAssignments: jest.fn(),
    };

    qualitySlaRepo = {
      getSlaMonitor: jest.fn(),
      getQualityIndicators: jest.fn(),
      getEscalationAudit: jest.fn(),
    };

    financialRepo = {
      getMaterialCosts: jest.fn(),
      getEconomicBalance: jest.fn(),
    };

    trendsRepo = {
      getDailyTrend: jest.fn(),
      getTerritorialConcentration: jest.fn(),
    };

    service = new DashboardService(
      comparisonRepo,
      executiveRepo,
      technicianRepo,
      qualitySlaRepo,
      financialRepo,
      trendsRepo,
    );
  });

  describe('technicianDailyFeed security (IDOR prevention)', () => {
    it('should force effectiveTechnicianId to user.id if user is non-admin, ignoring requested technicianId', async () => {
      const technicianUser: UserParams = {
        id: 'real-tech-uuid',
        role: 'technician',
      };
      const requestedId = 'victim-tech-uuid';

      await service.getTechnicianDailyFeed(requestedId, technicianUser);

      expect(technicianRepo.getTechnicianDailyFeed).toHaveBeenCalledWith(
        'real-tech-uuid',
        technicianUser,
      );
    });

    it('should allow admin to query another technicianId', async () => {
      const adminUser: UserParams = {
        id: 'admin-uuid',
        role: 'admin',
      };
      const requestedId = 'target-tech-uuid';

      await service.getTechnicianDailyFeed(requestedId, adminUser);

      expect(technicianRepo.getTechnicianDailyFeed).toHaveBeenCalledWith(
        'target-tech-uuid',
        adminUser,
      );
    });

    it('should allow admin to pass no technicianId and query all', async () => {
      const adminUser: UserParams = {
        id: 'admin-uuid',
        role: 'admin',
      };

      await service.getTechnicianDailyFeed(undefined, adminUser);

      expect(technicianRepo.getTechnicianDailyFeed).toHaveBeenCalledWith(
        null,
        adminUser,
      );
    });
  });

  describe('dispatchControl', () => {
    it('should pass default limit when not provided', async () => {
      const user: UserParams = { id: 'user-1', role: 'admin' };
      await service.getDispatchControl(undefined, user);

      expect(comparisonRepo.getDispatchControl).toHaveBeenCalledWith(
        DEFAULT_DISPATCH_CONTROL_LIMIT,
        user,
      );
    });

    it('should cap limit at MAX_DISPATCH_CONTROL_LIMIT', async () => {
      const user: UserParams = { id: 'user-1', role: 'admin' };
      await service.getDispatchControl(1000, user);

      expect(comparisonRepo.getDispatchControl).toHaveBeenCalledWith(
        MAX_DISPATCH_CONTROL_LIMIT,
        user,
      );
    });
  });

  describe('user parameter propagation', () => {
    it('should pass user to executive header KPIs', async () => {
      const user: UserParams = { id: 'user-1', role: 'technician' };
      await service.getHeaderKpis(user);

      expect(executiveRepo.getHeaderKpis).toHaveBeenCalledWith(user);
    });

    it('should pass user to SLA monitor', async () => {
      const user: UserParams = { id: 'user-1', role: 'technician' };
      await service.getSlaMonitor(user);

      expect(qualitySlaRepo.getSlaMonitor).toHaveBeenCalledWith(user);
    });

    it('should pass user to crew assignments', async () => {
      const user: UserParams = { id: 'user-1', role: 'technician' };
      await service.getCrewAssignments(user);

      expect(technicianRepo.getCrewAssignments).toHaveBeenCalledWith(user);
    });
  });
});
