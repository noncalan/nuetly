import { buildSection, v, type Template } from "./question-builder";

// Original demo items written for the prototype — not taken from any real exam.
const r = String.raw;

const TEMPLATES: readonly Template[] = [
  {
    topicId: "patterns",
    difficulty: 2,
    variants: [
      v(r`What number comes next? $2,\ 6,\ 12,\ 20,\ 30,\ ?$`, 42, [40, 36, 44, 48], [
        "The differences are $4, 6, 8, 10$ — each grows by $2$.",
        "The next difference is $12$, so $30 + 12 = 42$.",
      ]),
      v(r`What number comes next? $3,\ 5,\ 9,\ 17,\ 33,\ ?$`, 65, [49, 57, 66, 64], [
        r`Each term is the previous one doubled minus one: $3 \cdot 2 - 1 = 5$, $5 \cdot 2 - 1 = 9$, …`,
        r`$33 \cdot 2 - 1 = 65$.`,
      ]),
      v(r`What number comes next? $1,\ 4,\ 9,\ 16,\ 25,\ ?$`, 36, [30, 34, 49, 35], [
        "These are perfect squares: $1^2, 2^2, 3^2, 4^2, 5^2$.",
        "Next is $6^2 = 36$.",
      ]),
    ],
  },
  {
    topicId: "logic",
    difficulty: 3,
    variants: [
      v(
        "All analysts are careful. Some careful people are late. Which statement must be true?",
        "None of these statements must be true.",
        ["Some analysts are late.", "No analyst is late.", "All late people are careful."],
        [
          "The late careful people may or may not be analysts — the premises never connect “analyst” and “late”.",
          "So none of the first three statements is guaranteed.",
        ],
      ),
      v(
        "No reptiles are mammals. All snakes are reptiles. Which statement must be true?",
        "No snakes are mammals.",
        ["Some snakes are mammals.", "All reptiles are snakes.", "Some mammals are reptiles."],
        ["Every snake is a reptile, and no reptile is a mammal.", "Therefore no snake can be a mammal."],
      ),
      v(
        "Every member of the chess club plays at least two games a week. Timur plays one game a week. Which statement must be true?",
        "Timur is not a member of the chess club.",
        ["Timur is a member of the chess club.", "Timur will join the club next week.", "Some club members play one game a week."],
        ["Club members play at least two games a week.", "Timur plays only one, so he cannot be a member."],
      ),
    ],
  },
  {
    topicId: "data",
    difficulty: 3,
    variants: [
      v(
        "A shop sold $120$, $150$, $90$ and $180$ units in four quarters. Approximately what share of the year's sales came in the fourth quarter?",
        r`$33\%$`,
        [r`$25\%$`, r`$30\%$`, r`$36\%$`, r`$40\%$`],
        ["Total: $120 + 150 + 90 + 180 = 540$.", r`$180 / 540 = 1/3 \approx 33\%$.`],
      ),
      v(
        r`In a survey of $400$ students, $35\%$ walk to school, $45\%$ take the bus, and the rest are driven. How many students are driven?`,
        80,
        [20, 100, 140, 180],
        [r`$100\% - 35\% - 45\% = 20\%$ are driven.`, r`$0.2 \cdot 400 = 80$.`],
      ),
      v(
        r`A price rises by $10\%$ in January and falls by $10\%$ in February. What is the overall change?`,
        r`$-1\%$`,
        [r`$0\%$`, r`$+1\%$`, r`$-10\%$`, r`$+0.1\%$`],
        [r`$1.1 \cdot 0.9 = 0.99$.`, r`The final price is $99\%$ of the original — a $1\%$ decrease.`],
      ),
    ],
  },
  {
    topicId: "logic",
    difficulty: 5,
    variants: [
      v(
        "Five runners A, B, C, D and E finish a race. A finishes before B. C finishes after D but before B. E finishes last. D finishes second. Who finishes first?",
        "A",
        ["B", "C", "D", "E"],
        [
          "E is 5th and D is 2nd, so A, B and C take places 1, 3 and 4.",
          "C is after D and before B, so C is 3rd and B is 4th.",
          "That leaves A in 1st place.",
        ],
      ),
      v(
        "Five books stand on a shelf. Biology is at the far left. History is somewhere to the left of Math. Chemistry is between History and Math. Art is to the right of Math. Which book is in the middle?",
        "Chemistry",
        ["History", "Math", "Art", "Biology"],
        [
          "Biology takes position 1.",
          "History, Chemistry, Math must go in that order and Art comes after Math: positions 2–5 are History, Chemistry, Math, Art.",
          "The middle (3rd) book is Chemistry.",
        ],
      ),
      v(
        "Four friends sit in seats 1–4. Bota sits in seat 1. Dana is not at either end. Arman sits immediately to the right of Dana. Erlan does not sit next to Bota. Who sits in seat 3?",
        "Arman",
        ["Bota", "Dana", "Erlan"],
        [
          "Dana is in seat 2 or 3. If Dana were in 3, Arman would be in 4 and Erlan in 2 — next to Bota, which is not allowed.",
          "So Dana is in 2, Arman in 3, Erlan in 4.",
        ],
      ),
    ],
  },
  {
    topicId: "spatial",
    difficulty: 4,
    variants: [
      v(
        "What is the smaller angle between the hands of a clock at 3:15?",
        r`$7.5^\circ$`,
        [r`$0^\circ$`, r`$15^\circ$`, r`$22.5^\circ$`, r`$30^\circ$`],
        [
          r`The minute hand points at 3, i.e. $90^\circ$ from 12.`,
          r`The hour hand moves $0.5^\circ$ per minute: $3 \cdot 30^\circ + 15 \cdot 0.5^\circ = 97.5^\circ$.`,
          r`The angle is $97.5^\circ - 90^\circ = 7.5^\circ$.`,
        ],
      ),
      v(
        "What is the smaller angle between the hands of a clock at 9:00?",
        r`$90^\circ$`,
        [r`$270^\circ$`, r`$180^\circ$`, r`$45^\circ$`, r`$120^\circ$`],
        ["At 9:00 the hour hand points at 9 and the minute hand at 12.", r`They are three hour marks apart: $3 \cdot 30^\circ = 90^\circ$.`],
      ),
      v(
        "What is the smaller angle between the hands of a clock at 2:30?",
        r`$105^\circ$`,
        [r`$90^\circ$`, r`$120^\circ$`, r`$75^\circ$`, r`$150^\circ$`],
        [
          r`Minute hand: $180^\circ$ from 12.`,
          r`Hour hand: $2 \cdot 30^\circ + 30 \cdot 0.5^\circ = 75^\circ$.`,
          r`Angle: $180^\circ - 75^\circ = 105^\circ$.`,
        ],
      ),
    ],
  },
  {
    topicId: "spatial",
    difficulty: 3,
    variants: [
      v(
        "If 1 March is a Tuesday, what day of the week is 1 April of the same year?",
        "Friday",
        ["Wednesday", "Thursday", "Saturday", "Tuesday"],
        ["March has $31$ days, so 1 April is $31$ days later.", r`$31 = 4 \cdot 7 + 3$: three days after Tuesday is Friday.`],
      ),
      v(
        "Today is Wednesday. What day of the week will it be in $100$ days?",
        "Friday",
        ["Wednesday", "Thursday", "Saturday", "Monday"],
        [r`$100 = 14 \cdot 7 + 2$.`, "Two days after Wednesday is Friday."],
      ),
      v(
        "15 June is a Monday. What day of the week is 4 July of the same year?",
        "Saturday",
        ["Friday", "Sunday", "Thursday", "Monday"],
        ["June has $30$ days, so 4 July is $15 + 4 = 19$ days after 15 June.", r`$19 = 2 \cdot 7 + 5$: five days after Monday is Saturday.`],
      ),
    ],
  },
  {
    topicId: "argument",
    difficulty: 5,
    variants: [
      v(
        r`After the city built new bike lanes, traffic accidents fell by $15\%$. The mayor concludes that the bike lanes made the roads safer. Which assumption does this conclusion depend on?`,
        "No other change during the same period reduced accidents.",
        ["Most residents own a bicycle.", "Bike lanes are cheap to build.", "Accidents had been rising for several years."],
        [
          "The mayor links the drop in accidents to the bike lanes alone.",
          "That only works if nothing else — weather, new speed limits, fewer cars — caused the drop.",
        ],
      ),
      v(
        "Students who visit the library often get higher grades. So visiting the library improves grades. Which statement, if true, most weakens this argument?",
        "Students who already study hard are more likely to visit the library.",
        ["The library recently bought new books.", "Some students study at home.", "The library is open on weekends."],
        [
          "The argument assumes the library causes better grades.",
          "If hard-working students simply visit the library more, the cause may run the other way.",
        ],
      ),
      v(
        r`Our study app has been downloaded $10\,000$ times, so it is clearly popular with students. Which assumption does this argument make?`,
        "Most of the downloads were made by students.",
        ["The app is free.", "Other apps have fewer downloads.", "The app has been available for a year."],
        [
          "Downloads show popularity with students only if students are the ones downloading.",
          "Without that assumption the conclusion does not follow.",
        ],
      ),
    ],
  },
  {
    topicId: "problem",
    difficulty: 4,
    variants: [
      v(
        "Pipe A fills a tank in $6$ hours, pipe B in $3$ hours. How long will it take both pipes together?",
        "$2$ hours",
        ["$4.5$ hours", "$3$ hours", "$1.5$ hours", "$9$ hours"],
        [
          r`A fills $\tfrac{1}{6}$ of the tank per hour, B fills $\tfrac{1}{3}$.`,
          r`Together: $\tfrac{1}{6} + \tfrac{1}{3} = \tfrac{1}{2}$ per hour, so $2$ hours.`,
        ],
      ),
      v(
        "One worker paints a fence in $4$ hours, another in $12$ hours. How long will it take them together?",
        "$3$ hours",
        ["$8$ hours", "$6$ hours", "$2$ hours", "$16$ hours"],
        [r`Together: $\tfrac{1}{4} + \tfrac{1}{12} = \tfrac{4}{12} = \tfrac{1}{3}$ of the fence per hour.`, "So the job takes $3$ hours."],
      ),
      v(
        "Printer A prints a batch in $10$ minutes, printer B in $15$ minutes. How long will they take together?",
        "$6$ minutes",
        ["$12.5$ minutes", "$5$ minutes", "$8$ minutes", "$25$ minutes"],
        [r`Together: $\tfrac{1}{10} + \tfrac{1}{15} = \tfrac{5}{30} = \tfrac{1}{6}$ of the batch per minute.`, "So the batch takes $6$ minutes."],
      ),
    ],
  },
  {
    topicId: "patterns",
    difficulty: 3,
    variants: [
      v("In a code, CAT is written as DBU. How is DOG written?", "EPH", ["EPF", "CNF", "DPH", "FQI"], [
        "Each letter is shifted one place forward: C→D, A→B, T→U.",
        "D→E, O→P, G→H gives EPH.",
      ]),
      v("If BOOK is coded as 2-15-15-11, how is MAP coded?", "13-1-16", ["12-1-16", "13-2-16", "13-1-15", "14-1-17"], [
        "Each letter is replaced by its position in the alphabet: B = 2, O = 15, K = 11.",
        "M = 13, A = 1, P = 16.",
      ]),
      v("In a code, SUN is written as TVO. Which word is written as QJF?", "PIE", ["RKG", "PIG", "OIE", "QIE"], [
        "The code shifts each letter one place forward, so decoding shifts one place back.",
        "Q→P, J→I, F→E gives PIE.",
      ]),
    ],
  },
  {
    topicId: "logic",
    difficulty: 3,
    variants: [
      v("In a class of $30$ students, $18$ play football, $12$ play chess and $5$ play both. How many play neither?", 5, [0, 10, 7, 13], [
        "Students who play at least one: $18 + 12 - 5 = 25$.",
        "Neither: $30 - 25 = 5$.",
      ]),
      v("Of $40$ students, $22$ like maths, $25$ like physics and $10$ like both. How many like neither?", 3, [0, 7, 13, 10], [
        "At least one subject: $22 + 25 - 10 = 37$.",
        "Neither: $40 - 37 = 3$.",
      ]),
      v(
        "In a group of $50$ people, $30$ speak Kazakh and $35$ speak Russian. Everyone speaks at least one of the two. How many speak both?",
        15,
        [5, 20, 25, 65],
        ["If nobody spoke both, there would be $30 + 35 = 65$ people.", "The extra $65 - 50 = 15$ are counted twice — they speak both."],
      ),
    ],
  },
];

export const CT_QUESTIONS = buildSection("ct", TEMPLATES);
