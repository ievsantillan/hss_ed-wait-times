import { describe, expect, it } from 'vitest';

import {
  decodeEntities,
  formatUpdatedAt,
  formatWaitMinutes,
  normalizeAhsFeed,
  parseGeo,
  parseWaitToMinutes,
} from '@/lib/ahsTransform';

describe('parseWaitToMinutes', () => {
  it('parses "H hr M min"', () => {
    expect(parseWaitToMinutes('3 hr 0 min')).toBe(180);
    expect(parseWaitToMinutes('0 hr 30 min')).toBe(30);
    expect(parseWaitToMinutes('1 hr 45 min')).toBe(105);
  });
  it('parses partial forms', () => {
    expect(parseWaitToMinutes('45 min')).toBe(45);
    expect(parseWaitToMinutes('2 hr')).toBe(120);
  });
  it('returns null for unparseable input', () => {
    expect(parseWaitToMinutes('')).toBeNull();
    expect(parseWaitToMinutes(null)).toBeNull();
    expect(parseWaitToMinutes('Unavailable')).toBeNull();
  });
});

describe('formatWaitMinutes', () => {
  it('round-trips AHS format', () => {
    expect(formatWaitMinutes(180)).toBe('3 hr 0 min');
    expect(formatWaitMinutes(105)).toBe('1 hr 45 min');
  });
  it('handles null', () => {
    expect(formatWaitMinutes(null)).toBe('Unavailable');
  });
});

describe('parseGeo', () => {
  it('extracts lat/lng from a Google Maps query URL', () => {
    expect(
      parseGeo('https://www.google.com/maps/dir/?api=1&destination=x&query=51.0746,-114.1468'),
    ).toEqual({ latitude: 51.0746, longitude: -114.1468 });
  });
  it('returns nulls when absent', () => {
    expect(parseGeo(null)).toEqual({ latitude: null, longitude: null });
    expect(parseGeo('no coords here')).toEqual({ latitude: null, longitude: null });
  });
});

describe('decodeEntities', () => {
  it('decodes entities and collapses <br />', () => {
    expect(decodeEntities('Foothills &amp; Tom Baker')).toBe('Foothills & Tom Baker');
    expect(decodeEntities('Open 24/7<br />Closed holidays')).toBe('Open 24/7 Closed holidays');
  });
});

describe('formatUpdatedAt', () => {
  it('matches AHS format with the two-minutes suffix', () => {
    const d = new Date(2024, 5, 16, 14, 59); // Jun 16, 2:59 pm
    expect(formatUpdatedAt(d, true)).toBe('Jun 16, 2:59 pm (updated every two minutes)');
  });
  it('zero-pads minutes and uses 12-hour clock', () => {
    const d = new Date(2024, 8, 1, 0, 5); // Sept 1, 12:05 am
    expect(formatUpdatedAt(d)).toBe('Sept 1, 12:05 am');
  });
});

describe('normalizeAhsFeed', () => {
  it('flattens regions and splits combined facilities', () => {
    const feed = {
      Calgary: {
        Emergency: [
          {
            Name: 'South Health Campus Children[;]South Health Campus',
            Category: 'Emergency[;]Emergency',
            WaitTime: '0 hr 30 min[;]3 hr 40 min',
            TimesUnavailable: 'False',
            SiteId: '101',
            SiteOpen: 'True',
            GoogleMapsLinkDirection: 'https://maps?query=50.88,-113.96',
          },
        ],
        Urgent: [],
      },
    };
    const out = normalizeAhsFeed(feed);
    expect(out).toHaveLength(2);
    expect(out[0].name).toBe('South Health Campus Children');
    expect(out[0].waitMinutes).toBe(30);
    expect(out[1].name).toBe('South Health Campus');
    expect(out[1].waitMinutes).toBe(220);
    expect(out[0].latitude).toBe(50.88);
    expect(out[0].region).toBe('Calgary');
  });

  it('marks unavailable sites', () => {
    const feed = {
      Edmonton: {
        Emergency: [
          { Name: 'Royal Alexandra', Category: 'Emergency', WaitTime: '', TimesUnavailable: 'True' },
        ],
      },
    };
    const out = normalizeAhsFeed(feed);
    expect(out[0].unavailable).toBe(true);
    expect(out[0].waitMinutes).toBeNull();
  });
});
