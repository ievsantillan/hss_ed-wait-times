import { entity, authenticated, uuid, text, set, int, decimal, boolean, date } from '@microsoft/rayfin-core';

/**
 * A hospital Emergency Department or Urgent Care site in the staff catalog.
 *
 * This is a staff-only tool: the public site shows live AHS data directly and never
 * reads this entity. Anonymous data access is not supported on Fabric, so the catalog
 * (admin overrides, notes, non-AHS facilities) is gated behind Fabric sign-in.
 * Denormalized `current*` fields cache the latest manually recorded reading.
 */
@entity()
@authenticated('*')
export class Facility {
  @uuid() id!: string;
  @text({ max: 200 }) name!: string;
  @set('Calgary', 'Edmonton', 'RedDeer', 'Lethbridge', 'MedicineHat', 'GrandePrairie', 'FortMcMurray')
  region!: 'Calgary' | 'Edmonton' | 'RedDeer' | 'Lethbridge' | 'MedicineHat' | 'GrandePrairie' | 'FortMcMurray';
  @set('Emergency', 'Urgent Care')
  category!: 'Emergency' | 'Urgent Care';
  @text({ max: 60, optional: true }) siteId?: string;
  @text({ max: 300, optional: true }) address?: string;
  @text({ max: 500, optional: true }) note?: string;
  @text({ max: 500, optional: true }) infoUrl?: string;
  @text({ max: 500, optional: true }) mapUrl?: string;
  @decimal({ optional: true }) latitude?: number;
  @decimal({ optional: true }) longitude?: number;
  @boolean() siteOpen!: boolean;
  @boolean() active!: boolean;
  @int({ optional: true }) currentWaitMinutes?: number;
  @boolean() currentWaitUnavailable!: boolean;
  @date({ optional: true }) waitUpdatedAt?: Date;
}
