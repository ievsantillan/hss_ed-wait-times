import { entity, authenticated, uuid, one, int, boolean, date, text } from '@microsoft/rayfin-core';

import { Facility } from './Facility.js';

/**
 * A manually recorded wait-time reading for a {@link Facility}, used by the staff admin
 * tool for overrides and history. Staff-only (Fabric sign-in); the public site reads
 * live AHS data and static trend JSON instead, since anonymous data access is not
 * supported on Fabric.
 */
@entity()
@authenticated('*')
export class WaitReading {
  @uuid() id!: string;
  @one(() => Facility) facility!: Facility;
  @int({ optional: true }) waitMinutes?: number;
  @boolean() unavailable!: boolean;
  @date() reportedAt!: Date;
  @text({ max: 40 }) source!: string;
}
