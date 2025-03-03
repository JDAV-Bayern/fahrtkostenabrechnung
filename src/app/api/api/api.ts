export * from './health.service';
import { HealthService } from './health.service';
export * from './sections.service';
import { SectionsService } from './sections.service';
export * from './userinfo.service';
import { UserinfoService } from './userinfo.service';
export const APIS = [HealthService, SectionsService, UserinfoService];
