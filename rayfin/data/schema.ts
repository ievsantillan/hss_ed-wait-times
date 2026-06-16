import { Facility } from './Facility.js';
import { WaitReading } from './WaitReading.js';

export type AppSchema = {
  Facility: Facility;
  WaitReading: WaitReading;
};

export const schema = [Facility, WaitReading];
