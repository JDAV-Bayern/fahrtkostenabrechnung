export * from './health.service';
export * from './sections.service';
export * from './userinfo.service';
import { HealthService } from './health.service';
import { SectionsService } from './sections.service';
import { UserinfoService } from './userinfo.service';
export const APIS = [HealthService, SectionsService, UserinfoService];
