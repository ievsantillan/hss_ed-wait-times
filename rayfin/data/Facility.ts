import { entity, authenticated, uuid, text, int, decimal, boolean, date } from '@microsoft/rayfin-core';

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
  @text({ max: 50 }) region!: string;
  @text({ max: 40 }) category!: string;
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
