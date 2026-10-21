import { buildSection, v, type Template } from "./question-builder";

// Original demo items written for the prototype — not taken from any real exam.
const r = String.raw;

const TEMPLATES: readonly Template[] = [
  {
    topicId: "algebra",
    difficulty: 2,
    variants: [
      v("Solve for $x$: $3x - 7 = 2x + 5$.", 12, [14, 10, -2, -12], [
        "Move the $x$-terms to the left and the numbers to the right: $3x - 2x = 5 + 7$.",
        "So $x = 12$.",
      ]),
      v("Solve for $x$: $5x - 4 = 3x + 10$.", 7, [9, 5, 3, -7], [
        "Collect like terms: $5x - 3x = 10 + 4$.",
        "$2x = 14$, so $x = 7$.",
      ]),
      v("Solve for $x$: $4x - 9 = x + 6$.", 5, [7, 3, -1, -5], [
        "Collect like terms: $4x - x = 6 + 9$.",
        "$3x = 15$, so $x = 5$.",
      ]),
    ],
  },
  {
    topicId: "arithmetic",
    difficulty: 3,
    variants: [
      v(
        r`After a $20\%$ discount, a jacket costs $12\,000$ tenge. What was the original price?`,
        r`$15\,000$ tenge`,
        [r`$14\,400$ tenge`, r`$14\,000$ tenge`, r`$16\,000$ tenge`, r`$9\,600$ tenge`],
        [
          r`After the discount the buyer pays $100\% - 20\% = 80\%$ of the original price $P$.`,
          r`$0.8P = 12\,000$, so $P = 12\,000 / 0.8 = 15\,000$.`,
        ],
      ),
      v(
        r`After a $30\%$ discount, a backpack costs $8\,400$ tenge. What was the original price?`,
        r`$12\,000$ tenge`,
        [r`$10\,920$ tenge`, r`$11\,000$ tenge`, r`$12\,600$ tenge`, r`$5\,880$ tenge`],
        [
          r`The buyer pays $70\%$ of the original price: $0.7P = 8\,400$.`,
          r`$P = 8\,400 / 0.7 = 12\,000$.`,
        ],
      ),
      v(
        r`After a $15\%$ discount, headphones cost $6\,800$ tenge. What was the original price?`,
        r`$8\,000$ tenge`,
        [r`$7\,820$ tenge`, r`$7\,500$ tenge`, r`$8\,500$ tenge`, r`$5\,780$ tenge`],
        [
          r`The buyer pays $85\%$ of the original price: $0.85P = 6\,800$.`,
          r`$P = 6\,800 / 0.85 = 8\,000$.`,
        ],
      ),
    ],
  },
  {
    topicId: "sequences",
    difficulty: 3,
    variants: [
      v("An arithmetic sequence has $a_1 = 5$ and common difference $d = 3$. Find $a_{20}$.", 62, [65, 59, 60, 23], [
        "Use $a_n = a_1 + (n - 1)d$.",
        r`$a_{20} = 5 + 19 \cdot 3 = 62$.`,
      ]),
      v("An arithmetic sequence has $a_1 = -4$ and $d = 6$. Find $a_{15}$.", 80, [86, 74, 90, 10], [
        "Use $a_n = a_1 + (n - 1)d$.",
        r`$a_{15} = -4 + 14 \cdot 6 = 80$.`,
      ]),
      v("An arithmetic sequence has $a_1 = 12$ and $d = -2$. Find $a_{25}$.", -36, [-38, -34, -50, 36], [
        "Use $a_n = a_1 + (n - 1)d$.",
        r`$a_{25} = 12 + 24 \cdot (-2) = -36$.`,
      ]),
    ],
  },
  {
    topicId: "geometry",
    difficulty: 4,
    variants: [
      v(r`A circle has circumference $10\pi$. What is its area?`, r`$25\pi$`, [r`$10\pi$`, r`$50\pi$`, r`$100\pi$`, r`$5\pi$`], [
        r`$C = 2\pi r = 10\pi$, so $r = 5$.`,
        r`$S = \pi r^2 = 25\pi$.`,
      ]),
      v(r`A circle has circumference $14\pi$. What is its area?`, r`$49\pi$`, [r`$14\pi$`, r`$98\pi$`, r`$196\pi$`, r`$7\pi$`], [
        r`$2\pi r = 14\pi$, so $r = 7$.`,
        r`$S = \pi r^2 = 49\pi$.`,
      ]),
      v(r`A circle has circumference $18\pi$. What is its area?`, r`$81\pi$`, [r`$18\pi$`, r`$162\pi$`, r`$324\pi$`, r`$9\pi$`], [
        r`$2\pi r = 18\pi$, so $r = 9$.`,
        r`$S = \pi r^2 = 81\pi$.`,
      ]),
    ],
  },
  {
    topicId: "algebra",
    difficulty: 4,
    variants: [
      v("What is the sum of the roots of $x^2 - 7x + 10 = 0$?", 7, [-7, 10, 14, -10], [
        "By Vieta's formulas, for $x^2 + bx + c = 0$ the sum of the roots is $-b$.",
        "Here $b = -7$, so the sum is $7$. Check: the roots are $2$ and $5$.",
      ]),
      v("What is the sum of the roots of $x^2 - 3x - 18 = 0$?", 3, [-3, -18, 6, 18], [
        "By Vieta's formulas the sum of the roots is $-b = 3$.",
        "Check: the roots are $6$ and $-3$.",
      ]),
      v("What is the sum of the roots of $x^2 + x - 12 = 0$?", -1, [1, -12, -2, 12], [
        "By Vieta's formulas the sum of the roots is $-b = -1$.",
        "Check: the roots are $3$ and $-4$.",
      ]),
    ],
  },
  {
    topicId: "functions",
    difficulty: 2,
    variants: [
      v("If $f(x) = 2x^2 - 3x + 1$, find $f(-2)$.", 15, [3, 9, -13, 17], [
        r`$f(-2) = 2 \cdot 4 - 3 \cdot (-2) + 1$.`,
        "$= 8 + 6 + 1 = 15$.",
      ]),
      v("If $f(x) = x^2 + 4x - 5$, find $f(3)$.", 16, [10, 22, 4, -2], [
        r`$f(3) = 9 + 4 \cdot 3 - 5$.`,
        "$= 9 + 12 - 5 = 16$.",
      ]),
      v("If $f(x) = 3x^2 - x$, find $f(-1)$.", 4, [2, -4, 6, -2], [
        r`$f(-1) = 3 \cdot 1 - (-1)$.`,
        "$= 3 + 1 = 4$.",
      ]),
    ],
  },
  {
    topicId: "arithmetic",
    difficulty: 3,
    variants: [
      v(r`Simplify $\dfrac{2^{10} \cdot 2^{-4}}{2^{3}}$.`, 8, [2, 16, 64, r`$\tfrac{1}{8}$`], [
        r`Add exponents in the numerator: $2^{10 + (-4)} = 2^{6}$.`,
        r`Subtract exponents when dividing: $2^{6 - 3} = 2^3 = 8$.`,
      ]),
      v(r`Simplify $\dfrac{3^{5} \cdot 3^{-2}}{3^{4}}$.`, r`$\tfrac{1}{3}$`, [3, r`$\tfrac{1}{9}$`, 9, -3], [
        r`Numerator: $3^{5 + (-2)} = 3^{3}$.`,
        r`$3^{3 - 4} = 3^{-1} = \tfrac{1}{3}$.`,
      ]),
      v(r`Simplify $\dfrac{5^{2} \cdot 5^{3}}{5^{4}}$.`, 5, [25, 1, r`$\tfrac{1}{5}$`, 125], [
        r`Numerator: $5^{2 + 3} = 5^{5}$.`,
        r`$5^{5 - 4} = 5$.`,
      ]),
    ],
  },
  {
    topicId: "probability",
    difficulty: 4,
    variants: [
      v(
        "Two fair dice are rolled. What is the probability that the sum is $7$?",
        r`$\tfrac{1}{6}$`,
        [r`$\tfrac{1}{7}$`, r`$\tfrac{1}{12}$`, r`$\tfrac{7}{36}$`, r`$\tfrac{1}{36}$`],
        [
          r`There are $6 \cdot 6 = 36$ equally likely outcomes.`,
          "A sum of $7$: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ — six outcomes.",
          "$P = 6/36 = 1/6$.",
        ],
      ),
      v(
        "Two fair dice are rolled. What is the probability that the sum is $9$?",
        r`$\tfrac{1}{9}$`,
        [r`$\tfrac{5}{36}$`, r`$\tfrac{1}{12}$`, r`$\tfrac{1}{6}$`, r`$\tfrac{1}{18}$`],
        [
          "A sum of $9$: $(3,6), (4,5), (5,4), (6,3)$ — four outcomes out of $36$.",
          "$P = 4/36 = 1/9$.",
        ],
      ),
      v(
        "Two fair dice are rolled. What is the probability that the sum is $11$?",
        r`$\tfrac{1}{18}$`,
        [r`$\tfrac{1}{36}$`, r`$\tfrac{1}{11}$`, r`$\tfrac{1}{12}$`, r`$\tfrac{1}{6}$`],
        ["A sum of $11$: $(5,6)$ and $(6,5)$ — two outcomes out of $36$.", "$P = 2/36 = 1/18$."],
      ),
    ],
  },
  {
    topicId: "arithmetic",
    difficulty: 2,
    variants: [
      v("The ratio of boys to girls in a class is $3 : 5$. There are $40$ students. How many girls are there?", 25, [15, 24, 20, 8], [
        "$3 + 5 = 8$ parts, so one part is $40 / 8 = 5$ students.",
        r`Girls: $5 \cdot 5 = 25$.`,
      ]),
      v("The ratio of boys to girls in a group is $2 : 7$. There are $36$ students. How many girls are there?", 28, [8, 18, 27, 32], [
        "$2 + 7 = 9$ parts, so one part is $36 / 9 = 4$ students.",
        r`Girls: $7 \cdot 4 = 28$.`,
      ]),
      v("The ratio of boys to girls in a school club is $4 : 5$. There are $54$ members. How many girls are there?", 30, [24, 25, 27, 20], [
        "$4 + 5 = 9$ parts, so one part is $54 / 9 = 6$ members.",
        r`Girls: $5 \cdot 6 = 30$.`,
      ]),
    ],
  },
  {
    topicId: "geometry",
    difficulty: 2,
    variants: [
      v("A right triangle has legs $6$ and $8$. Find the hypotenuse.", 10, [14, 12, r`$2\sqrt{7}$`, 48], [
        "By the Pythagorean theorem $c^2 = 6^2 + 8^2 = 36 + 64 = 100$.",
        "$c = 10$.",
      ]),
      v("A right triangle has legs $5$ and $12$. Find the hypotenuse.", 13, [17, 11, r`$\sqrt{119}$`, 60], [
        "$c^2 = 5^2 + 12^2 = 25 + 144 = 169$.",
        "$c = 13$.",
      ]),
      v("A right triangle has legs $9$ and $12$. Find the hypotenuse.", 15, [21, 13, r`$3\sqrt{7}$`, 108], [
        "$c^2 = 9^2 + 12^2 = 81 + 144 = 225$.",
        "$c = 15$.",
      ]),
    ],
  },
];

export const MATH_QUESTIONS = buildSection("math", TEMPLATES);
