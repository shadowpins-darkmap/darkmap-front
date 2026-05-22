export const worldCountries = ['England', 'USA', 'Austria', 'South Korea'];

export const cyberFlashingCases = {
  England: [
    {
      date: '2024.08.01',
      summary: 'Violent sent hundreds of nude images to women online.',
    },
    {
      date: '2024.07.13',
      summary: 'Man convicted for repeated unsolicited explicit image sharing.',
    },
    {
      date: '2024.03.27',
      summary: 'Student punished after sending explicit photos in class group chat.',
    },
    {
      date: '2023.12.19',
      summary: 'Workplace cyber flashing case led to criminal prosecution.',
    },
    {
      date: '2023.11.04',
      summary: 'Transport police reported rising air-drop style image abuse.',
    },
  ],
  USA: [
    {
      date: '2024.09.12',
      summary: 'State court sentenced offender for repeated explicit image harassment.',
    },
    {
      date: '2024.05.02',
      summary: 'Campus cyber flashing report resulted in digital stalking charges.',
    },
    {
      date: '2023.10.22',
      summary: 'Court accepted screenshot archives as primary evidence.',
    },
  ],
  Austria: [
    {
      date: '2024.06.18',
      summary: 'Regional court imposed fine for unwanted explicit mobile transmissions.',
    },
    {
      date: '2023.12.01',
      summary: 'Repeat offender convicted under sexual harassment statutes.',
    },
  ],
  'South Korea': [
    {
      date: '2024.08.05',
      summary: 'Court ruled digital obscene image sharing as harassment offense.',
    },
    {
      date: '2024.02.13',
      summary: 'Offender punished for group-chat based sexual intimidation.',
    },
    {
      date: '2023.09.30',
      summary: 'Victim-protection order and criminal sentence issued together.',
    },
  ],
};

export const worldFaqContent = {
  shadowPins: {
    title: 'What does Shadow Pins do?',
    body: "Shadow Pins is a Korean feminist movement group based on legal studies and IT technology. Shadow Pins has compiled a map of incidents of street harassment against women, including indecent exposure, stalking, and catcalling, reported in the Korean media over the past 11 years.\n\nFor this year's DRAPAC in Manila, Philippines, we collected data on cyberflashing and held a workshop on Asian women's experiences. Women around the world are receiving photos and videos of body parts they never consented to via AirDrop, Bluetooth, and social media messages, which is extremely exhausting, unpleasant, and threatening. Please visit our site to see what kinds of cyberflashing crimes are occurring and how a small number of these cases are beginning to be prosecuted. This project site currently supports desktop versions only.",
  },
  cyberFlashing: {
    title: 'What is cyberflashing?',
    body: 'Cyberflashing is the act of sending unsolicited nude or sexual images, often of one\'s genitals, without the recipient\'s consent. Commonly known as "dick pics" or, less commonly, "twat shots," cyberflashing has become a widespread form of digital sexual harassment. In Korea, it is sometimes referred to as an "online trench coat pervert crime." Emerging technologies such as AirDrop have made cyberflashing more accessible, allowing images to be sent to nearby Apple devices within a range of about 20-30 meters.',
    sourceLabel: 'Cyberflashing - old-style sexual harassment for the digital age, MONASH University (2019.9.6)',
    sourceUrl:
      'https://lens.monash.edu/cyberflashing-the-latest-form-of-digital-sexual-harassment/',
  },
  legal: {
    title: 'How do different countries address cyberflashing in their laws?',
    body: 'Cyberflashing is addressed differently across jurisdictions. Some laws define it as sending or giving an unwanted sexual image, while others treat it through broader provisions on sexual exposure, indecent transmission, or sexual harassment. Penalties may include fines, criminal records, or imprisonment depending on the jurisdiction, intent, consent, harm, and repeat-offense factors.',
    subTitle: 'Laws by Country',
    list: [
      'England',
      'USA',
      'Republic of Korea',
      'Singapore',
      'Scotland',
      'Northern Ireland',
      'Austria',
    ],
    listKeys: [
      'England',
      'USA',
      'Republic of Korea',
      'Singapore',
      'Scotland',
      'Northern Ireland',
      'Austria',
    ],
  },
};

export const worldLegalTexts = {
  'Republic of Korea': {
    title: 'Republic of Korea',
    meta: 'Act on Special Cases Concerning the Punishment of Sexual Crimes, Article 13 — amended 2020',
    statute:
      '"Any person who, for the purpose of arousing or satisfying one\'s own or another person\'s sexual desire, causes another person to receive words, sounds, writings, pictures, images, or objects that may cause sexual shame or aversion through telephone, mail, computer, or other telecommunications media shall be punished by imprisonment for not more than two years or by a fine not exceeding five million won."',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: '**1. Subject matter:** "words, sounds, writings, pictures, images, or objects that may cause sexual shame or aversion"\n**2. Means of transmission:** "through telephone, mail, computer, or other telecommunications media"',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: '"for the purpose of arousing or satisfying one\'s own or another person\'s sexual desire"\nA specific purpose element is required. Non-consent of the recipient is not an independent element; the gravamen is the offender\'s sexual purpose.',
      },
    ],
    penalty:
      '"imprisonment for not more than two years or by a fine not exceeding five million won"\n(Approx. USD 3,600 at current exchange rates)',
  },
  England: {
    title: 'England',
    meta: 'Sexual Offences Act 66A (2023)',
    statute:
      "A person who intentionally sends or gives a photograph or film of any person's genitals to another person commits an offence if they intend the recipient to see the genitals and be caused alarm, distress or humiliation, or if they send it for sexual gratification and are reckless as to whether the recipient will be caused alarm, distress or humiliation.",
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: '**1. Subject matter of the image:** "a photograph or film of any person\'s genitals"\n**2. Means of transmission:** "sends or gives", including electronic transmission, showing it to another person, or placing it for a particular person to find.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: '**Intent to cause alarm, distress, or humiliation**; **or** purpose of sexual gratification **plus** recklessness as to whether the recipient suffers alarm, distress, or humiliation.',
      },
    ],
    penalty:
      "On summary conviction, imprisonment for a term not exceeding the general limit in a magistrates' court or a fine, or both. On conviction on indictment, imprisonment for a term not exceeding two years.",
  },
  'New Hampshire': {
    title: 'New Hampshire, U.S.',
    meta: 'NH RSA 645:1 - Indecent Exposure and Lewdness (2025)',
    statute:
      'A person is guilty of a misdemeanor if they **knowingly** transmit to another person, who is 16 years of age or older, an image of themselves fornicating, exposing their genitals, or performing any other act of gross lewdness, **when the recipient does not consent to receipt of the image**.',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: '**1. Subject matter of the image:** an image of **oneself** fornicating, exposing genitals, or performing gross lewdness.\n**2. Means of transmission:** "transmits"; no specific medium is prescribed.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: '**Knowingly** transmitting the image **+ non-consent** of the recipient. The statute does not require proof of intent to harm or cause distress.',
      },
    ],
    penalty:
      'A **misdemeanor** punishable by imprisonment for up to **1 year**, and/or a fine of up to **$2,000**.',
  },
  Texas: {
    title: 'Texas, U.S.',
    meta: 'Texas Penal Code §21.19 (2019)',
    statute:
      'A person commits an offense if the person **knowingly** transmits by electronic means visual material that depicts sexual conduct, exposed intimate parts, or covered male genitals in a discernibly turgid state, and the material **is not sent at the request of or with the express consent of the recipient**.',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: '**1. Subject matter of the image:** sexually explicit visual material defined by §21.19 and §21.16.\n**2. Means of transmission:** transmits by **electronic means**.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: '**Knowingly** transmitting visual material **+ non-consent** of the recipient. No intent to harm or cause distress is required.',
      },
    ],
    penalty:
      'A **Class C misdemeanor** punishable by a fine of **not more than $500** and **no term of imprisonment**.',
  },
  Singapore: {
    title: 'Singapore',
    meta: 'Penal Code 1871 (2020 Revised Edition), **Section 377BF – Sexual Exposure**; 1 January 2020',
    statute:
      "A person commits an offence if they intentionally expose or distribute an image of their own genitals or another person's genitals to another person, for sexual gratification or to cause humiliation, alarm, or distress, intending that the recipient will see it, and the recipient does not consent.",
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: 'The offence is established when the accused **intentionally distributes** an image of their own or another person\'s genitals to another person **without that person\'s consent**, and **intends** that the other person will see the image.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: 'The accused must act with at least one of the following purposes:\n**(1)** to obtain **sexual gratification**, or\n**(2)** to cause the recipient **humiliation, alarm, or distress**.\nThe offence requires **intentional** conduct — it cannot be established through mere negligence or mistake.',
      },
    ],
    penalty:
      '**General:** imprisonment for a term not exceeding **1 year**, a fine, or both.\n**Aggravated (victim below 14 years of age):** imprisonment for a term not exceeding **2 years**, and liability to a fine or caning.',
  },
  Scotland: {
    title: 'Scotland',
    meta: 'Sexual Offences (Scotland) Act 2009 (asp 9), **Section 6 — Coercing a person into looking at a sexual image**; 1 December 2010',
    statute:
      'A person commits the offence of coercing a person into looking at a sexual image if they intentionally, and for sexual gratification or to humiliate, distress, or alarm the recipient, cause another person to look at a sexual image without consent and without any reasonable belief that the person consents.',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: "Person A intentionally causes person B to look at a sexual image without B's consent and without any reasonable belief that B consents. The image may be still or moving and may depict sexual activity or genitals.",
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: 'Intentional conduct for the purpose of **(a)** obtaining sexual gratification, or **(b)** humiliating, distressing, or alarming the recipient.',
      },
    ],
    penalty:
      "On summary conviction: up to **12 months' imprisonment** and/or a fine. On conviction on indictment: up to **2 years' imprisonment** and/or a fine.",
  },
  'Northern Ireland': {
    title: 'Northern Ireland',
    meta: 'Justice (Sexual Offences and Trafficking Victims) Act (Northern Ireland) 2022, **Section 2 — Sending etc. an unwanted sexual image (Cyber-flashing)**; April 2022',
    statute:
      'A person commits an offence if they **intentionally** send or give a sexual image to another person **without consent**, knowing or reasonably knowing that the recipient has not consented, and either act **with the intention** that the recipient be humiliated, alarmed, or distressed, **or** act **for the purpose of obtaining sexual gratification** while reckless as to that effect.',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: 'The accused intentionally sends or gives a sexual image to another person without consent and without reasonable belief in consent. Sending or giving includes electronic or physical transmission, or placing the image for another person to find.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: 'Intentionally — with **(a)** the intention that the recipient will be humiliated, alarmed, or distressed; **or (b)** for the purpose of obtaining sexual gratification, being reckless as to whether the recipient is humiliated, alarmed, or distressed.',
      },
    ],
    penalty:
      "On summary conviction: up to **6 months' imprisonment** and/or a fine not exceeding the statutory maximum. On conviction on indictment: up to **2 years' imprisonment**.",
  },
  Austria: {
    title: 'Austria',
    meta: 'Austrian Criminal Code (Strafgesetzbuch, StGB), **Section 218, paragraph 1b**; 1 September 2025',
    statute:
      'Anyone who **harasses** another person by **intentionally sending** them, via telecommunications or using a computer system, an **unsolicited image showing human genitals**, a comparable edited image, or comparable artificially created material.',
    sections: [
      {
        heading: 'Actus Reus (Objective Elements)',
        body: 'A person intentionally sends an unsolicited genital image, comparable edited image, or comparable artificially created material via telecommunications or a computer system, thereby harassing another person. Proof of actual psychological harm to the recipient is **not required**.',
      },
      {
        heading: 'Mens Rea (Subjective Elements)',
        body: 'Intentional transmission with awareness that the image is unsolicited. No requirement to prove intent to cause harm or distress.',
      },
    ],
    penalty: "Up to **6 months' imprisonment**, or a fine of up to **360 daily rates**.",
  },
};
