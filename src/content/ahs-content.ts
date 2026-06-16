export interface InlineLink {
  label: string;
  url: string;
}

export interface LinkedCopy {
  textBeforeLink: string;
  link: InlineLink;
  textAfterLink: string;
}

export interface PhoneLinkedCopy {
  textBeforePhone: string;
  phoneLabel: string;
  phoneUrl: string;
  textAfterPhone: string;
}

export interface PhoneAndResourceLinkedCopy extends PhoneLinkedCopy {
  link: InlineLink;
  textAfterLink: string;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export interface DisclaimerCopy {
  textBeforeFeedbackLink: string;
  feedbackLink: InlineLink;
  textBeforeEmail: string;
  emailLabel: string;
  emailUrl: string;
  textAfterEmail: string;
}

export const MEASLES_ALERT = {
  textBeforeHotline: 'AHS continues to ensure its facilities are safe for all patients and visitors. If you think you have measles or have been exposed to measles, please call the Measles Hotline at ',
  hotlineDisplay: '1-844-944-3434',
  hotlineUrl: 'tel:+18449443434',
  textAfterHotline: ' BEFORE attending or entering an AHS facility. Our frontline staff will put protocols in place to ensure you get the care you need, without putting others at risk of measles exposure.',
  fullText: 'AHS continues to ensure its facilities are safe for all patients and visitors. If you think you have measles or have been exposed to measles, please call the Measles Hotline at 1-844-944-3434 BEFORE attending or entering an AHS facility. Our frontline staff will put protocols in place to ensure you get the care you need, without putting others at risk of measles exposure.',
} as const;

export const WAIT_TIMES_INTRO: LinkedCopy = {
  textBeforeLink: 'The estimated wait time to see a physician is approximate and for information only. The wait time is based on the average patient and does not reflect the wait for those who are critically ill or injured, or those with minor conditions. We provide care to the most critical cases first. Wait times can change unexpectedly, based on demand. See our ',
  link: {
    label: 'FAQs',
    url: 'https://www.albertahealthservices.ca/assets/about/data/ahs-data-edm-understanding-wait-times-patients.pdf',
  },
  textAfterLink: ' to learn more.',
};

export const LIFE_THREATENING: PhoneAndResourceLinkedCopy = {
  textBeforePhone: 'For life-threatening emergencies please call ',
  phoneLabel: '911',
  phoneUrl: 'tel:911',
  textAfterPhone: '. For all other health concerns, use this ',
  link: {
    label: 'guide to navigating care',
    url: 'https://www.primarycarealberta.ca/page14142.aspx',
  },
  textAfterLink: ' to find the right support.',
};

export const HEALTH_LINK_811 = {
  textBeforePhone: 'For health advice 24/7 phone ',
  phoneLabel: '811',
  phoneUrl: 'tel:811',
  textAfterPhone: ', a free health information service. You have options to speak with a variety of health professionals. ',
  link: {
    label: 'More about Health Link 811',
    url: 'https://www.primarycarealberta.ca/page14176.aspx',
  },
} as const;

export const FIND_CARE: LinkedCopy = {
  textBeforeLink: 'Cannot find your city or town? Emergency care is available across Alberta, whether or not the estimated wait times are posted for a site. ',
  link: {
    label: 'Find emergency departments or urgent care services in Alberta',
    url: 'https://www.albertahealthservices.ca/findhealth/search.aspx?type=facility&source=ahs',
  },
  textAfterLink: '',
};

export const RESOURCES: ResourceLink[] = [
  {
    label: 'Be Prepared for Your Visit',
    url: 'https://www.albertahealthservices.ca/assets/about/data/ahs-data-edm-be-prepared-ed-uc.pdf',
  },
  {
    label: 'Medical Procedure Wait Times',
    url: 'http://waittimes.alberta.ca/',
  },
  {
    label: 'Translated Wait Times',
    url: 'https://www.albertahealthservices.ca/languages/languages.aspx',
  },
  {
    label: 'Understanding Wait Times (FAQs for Patients)',
    url: 'https://www.albertahealthservices.ca/assets/about/data/ahs-data-edm-understanding-wait-times-patients.pdf',
  },
  {
    label: 'Your Emergency Visit – Patient Journey Map',
    url: 'https://www.albertahealthservices.ca/assets/about/data/ahs-scn-ems-patient-journey-map-36x24.pdf',
  },
];

export const DISCLAIMER: DisclaimerCopy = {
  textBeforeFeedbackLink: 'The information provided on this website is for general information only. If you have questions or comments about the Wait Times website, please ',
  feedbackLink: {
    label: 'submit feedback',
    url: 'http://www.albertahealthservices.ca/about/Page12937.aspx',
  },
  textBeforeEmail: ' or contact Wait Times Feedback at ',
  emailLabel: 'webcomm@ahs.ca',
  emailUrl: 'mailto:webcomm@ahs.ca',
  textAfterEmail: '.',
};

export const ATTRIBUTION = 'Wait-times data is sourced from Alberta Health Services.';

