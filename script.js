const $ = (id) => document.getElementById(id);

const state = {
  rows: [],
  visible: 0,
  a: 17,
  b: 43
};

function extendedGCD(a, b) {
  // Base initializations according to Forouzan & Mukhopadhyay:
  // Row -1: r_{-1} = a, x_{-1} = 1, y_{-1} = 0
  // Row  0: r_0 = b,    x_0 = 0,    y_0 = 1
  const r = [a, b];
  const x = [1, 0];
  const y = [0, 1];

  const rows = [];

  // Row -1 (Initialization for a)
  rows.push({
    stepIndex: -1,
    type: "init_a",
    calcR: `r<sub>−1</sub> = a = ${a}`,
    satR: `—`,
    calcXY: `x<sub>−1</sub> = 1;&nbsp; y<sub>−1</sub> = 0`,
    satXY: `a = a x<sub>−1</sub> + b y<sub>−1</sub><br><span class="cell-sub">${a} = ${a}(1) + ${b}(0)</span>`
  });

  // Row 0 (Initialization for b)
  rows.push({
    stepIndex: 0,
    type: "init_b",
    calcR: `r<sub>0</sub> = b = ${b}`,
    satR: `—`,
    calcXY: `x<sub>0</sub> = 0;&nbsp; y<sub>0</sub> = 1`,
    satXY: `b = a x<sub>0</sub> + b y<sub>0</sub><br><span class="cell-sub">${b} = ${a}(0) + ${b}(1)</span>`
  });

  let i = 1;
  while (true) {
    const rPrev2 = r[i - 1]; // r_{i-2}
    const rPrev1 = r[i];     // r_{i-1}
    const xPrev2 = x[i - 1]; // x_{i-2}
    const xPrev1 = x[i];     // x_{i-1}
    const yPrev2 = y[i - 1]; // y_{i-2}
    const yPrev1 = y[i];     // y_{i-1}

    const qCur = Math.floor(rPrev2 / rPrev1);
    const rCur = rPrev2 % rPrev1;

    const leftVar = i === 1 ? "a" : (i === 2 ? "b" : `r<sub>${i - 2}</sub>`);
    const divVar = i === 1 ? "b" : (i === 2 ? "r<sub>1</sub>" : `r<sub>${i - 1}</sub>`);
    const calcRLabel = i === 1 ? "a mod b" : (i === 2 ? "b mod r<sub>1</sub>" : `r<sub>${i - 2}</sub> mod r<sub>${i - 1}</sub>`);
    const calcQDiv = i === 1 ? "a / b" : (i === 2 ? "b / r<sub>1</sub>" : `r<sub>${i - 2}</sub> / r<sub>${i - 1}</sub>`);

    if (rCur === 0) {
      // Terminal row (step n + 1)
      const n = i - 1;
      const gcdVal = rPrev1;
      const xVal = xPrev1;
      const yVal = yPrev1;

      rows.push({
        stepIndex: i,
        type: "terminal",
        calcR: `r<sub>${i}</sub> = ${calcRLabel} = 0<br>` +
               `q<sub>${i}</sub> = ⌊${calcQDiv}⌋ = ⌊${rPrev2} / ${rPrev1}⌋ = ${qCur}`,
        satR: `${leftVar} = q<sub>${i}</sub> ${divVar} + 0<br><span class="cell-sub">${rPrev2} = ${qCur} × ${rPrev1} + 0</span>`,
        calcXY: `—`,
        satXY: `d = gcd(a, b) = r<sub>${n}</sub> = <b>${gcdVal}</b><br>` +
               `x = x<sub>${n}</sub> = <b>${xVal}</b>;&nbsp; y = y<sub>${n}</sub> = <b>${yVal}</b>`
      });

      return {
        gcd: gcdVal,
        x: xVal,
        y: yVal,
        rows
      };
    }

    const xCur = xPrev2 - qCur * xPrev1;
    const yCur = yPrev2 - qCur * yPrev1;

    r.push(rCur);
    x.push(xCur);
    y.push(yCur);

    let calcXExpr = `x<sub>${i}</sub> = `;
    let calcYExpr = `y<sub>${i}</sub> = `;

    if (i === 1) {
      calcXExpr += `x<sub>−1</sub> − q<sub>1</sub>x<sub>0</sub> = 1 − (${qCur})(0) = ${xCur}`;
      calcYExpr += `y<sub>−1</sub> − q<sub>1</sub>y<sub>0</sub> = 0 − (${qCur})(1) = ${yCur}`;
    } else if (i === 2) {
      calcXExpr += `x<sub>0</sub> − q<sub>2</sub>x<sub>1</sub> = ${xPrev2} − (${qCur})(${xPrev1}) = ${xCur}`;
      calcYExpr += `y<sub>0</sub> − q<sub>2</sub>y<sub>1</sub> = ${yPrev2} − (${qCur})(${yPrev1}) = ${yCur}`;
    } else {
      calcXExpr += `x<sub>${i - 2}</sub> − q<sub>${i}</sub>x<sub>${i - 1}</sub> = ${xPrev2} − (${qCur})(${xPrev1}) = ${xCur}`;
      calcYExpr += `y<sub>${i - 2}</sub> − q<sub>${i}</sub>y<sub>${i - 1}</sub> = ${yPrev2} − (${qCur})(${yPrev1}) = ${yCur}`;
    }

    rows.push({
      stepIndex: i,
      type: "step",
      calcR: `r<sub>${i}</sub> = ${calcRLabel} = ${rPrev2} mod ${rPrev1} = ${rCur}<br>` +
             `q<sub>${i}</sub> = ⌊${calcQDiv}⌋ = ⌊${rPrev2} / ${rPrev1}⌋ = ${qCur}`,
      satR: `${leftVar} = q<sub>${i}</sub> ${divVar} + r<sub>${i}</sub><br><span class="cell-sub">${rPrev2} = ${qCur} × ${rPrev1} + ${rCur}</span>`,
      calcXY: `${calcXExpr}<br>${calcYExpr}`,
      satXY: `r<sub>${i}</sub> = a x<sub>${i}</sub> + b y<sub>${i}</sub><br><span class="cell-sub">${rCur} = ${a}(${xCur}) + ${b}(${yCur})</span>`
    });

    i++;
  }
}

function runAlgorithm() {
  const a = Number($("aInput").value);
  const b = Number($("bInput").value);
  const errorBox = $("errorBox");

  errorBox.classList.add("hidden");
  errorBox.textContent = "";

  if (
    !Number.isSafeInteger(a) ||
    !Number.isSafeInteger(b) ||
    a <= 0 ||
    b <= 0
  ) {
    errorBox.textContent =
      "Please enter positive whole numbers within the safe integer range.";
    errorBox.classList.remove("hidden");
    return;
  }

  state.a = a;
  state.b = b;

  const result = extendedGCD(a, b);

  state.rows = result.rows;
  state.visible = Math.min(2, state.rows.length);

  $("gcdResult").textContent = result.gcd;
  $("xResult").textContent = result.x;
  $("yResult").textContent = result.y;

  const inverseResult = $("inverseResult");
  const inverseStatus = $("inverseStatus");
  const verificationTitle = $("verificationTitle");
  const verificationText = $("verificationText");
  const verificationBadge = $("verificationBadge");

  if (result.gcd === 1) {
    const inverse = ((result.x % b) + b) % b;

    inverseResult.textContent = inverse;
    inverseStatus.textContent = "Multiplicative inverse exists";

    verificationTitle.textContent =
      `Verification: ${a} × ${inverse} ≡ 1 (mod ${b})`;

    verificationText.textContent =
      `${a} × ${inverse} = ${a * inverse}. ` +
      `The remainder after division by ${b} is ` +
      `${(a * inverse) % b}, so the multiplicative inverse is verified.`;

    verificationBadge.textContent = "Verified";
  } else {
    inverseResult.textContent = "Does not exist";
    inverseStatus.textContent =
      `GCD is ${result.gcd}, not 1`;

    verificationTitle.textContent =
      `No multiplicative inverse exists for ${a} modulo ${b}.`;

    verificationText.textContent =
      `Since gcd(${a}, ${b}) = ${result.gcd}, ` +
      `the two numbers are not relatively prime. ` +
      `Therefore, a multiplicative inverse does not exist.`;

    verificationBadge.textContent = "No inverse";
  }

  renderSteps();
}

function renderSteps() {
  const tbody = $("stepsBody");
  const total = state.rows.length;
  const visible = state.visible;

  if (total === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          Run the algorithm to generate the trace.
        </td>
      </tr>
    `;

    $("stepCounter").textContent = "Row 0 / 0";
    $("progressBar").style.width = "0%";
    $("prevBtn").disabled = true;
    $("nextStepBtn").disabled = true;
    $("showAllBtn").disabled = true;
    return;
  }

  tbody.innerHTML = state.rows
    .slice(0, visible)
    .map((row, index) => `
      <tr class="${index === visible - 1 ? "current-step highlight" : ""}">
        <td class="cell-calc-r">${row.calcR}</td>
        <td class="cell-sat-r">${row.satR}</td>
        <td class="cell-calc-xy">${row.calcXY}</td>
        <td class="cell-sat-xy">${row.satXY}</td>
      </tr>
    `)
    .join("");

  $("stepCounter").textContent = `Row ${visible} / ${total}`;

  $("progressBar").style.width =
    `${(visible / total) * 100}%`;

  $("prevBtn").disabled = visible <= 1;
  $("nextStepBtn").disabled = visible >= total;
  $("showAllBtn").disabled = visible >= total;

  $("traceNote").innerHTML =
    visible >= total
      ? "All steps displayed. The algorithm concludes with <b>d = gcd(a, b) = r<sub>n</sub></b>, <b>x = x<sub>n</sub></b>, and <b>y = y<sub>n</sub></b>."
      : "The highlighted row shows the current step. Select <b>Next</b> to reveal the next calculation.";
}

function showAll() {
  state.visible = state.rows.length;
  renderSteps();
}

$("runBtn").addEventListener("click", runAlgorithm);

$("exampleBtn").addEventListener("click", () => {
  $("aInput").value = 17;
  $("bInput").value = 43;
  runAlgorithm();
});

$("prevBtn").addEventListener("click", () => {
  if (state.visible > 1) {
    state.visible--;
    renderSteps();
  }
});

$("nextStepBtn").addEventListener("click", () => {
  if (state.visible < state.rows.length) {
    state.visible++;
    renderSteps();
  }
});

$("showAllBtn").addEventListener("click", showAll);

$("aInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") runAlgorithm();
});

$("bInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") runAlgorithm();
});

function activateSection(sectionId) {
  const target = $(sectionId);

  if (!target) return;

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.toggle(
      "active-section",
      section.id === sectionId
    );
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.section === sectionId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    activateSection(item.dataset.section);
  });
});

document.querySelectorAll(".next-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activateSection(button.dataset.next);
  });
});

$("readGuideBtn").addEventListener("click", () => {
  activateSection("theory");
});

const quizBank = [
  {
    question: "What is the main purpose of the Euclidean Algorithm?",
    options: [
      "Find the LCM only",
      "Find the GCD",
      "Find prime numbers",
      "Calculate powers"
    ],
    answer: 1,
    explanation: "The Euclidean Algorithm repeatedly divides remainders to efficiently find the greatest common divisor (GCD) of two integers."
  },
  {
    question: "What is the GCD of 24 and 36?",
    options: ["6", "8", "12", "18"],
    answer: 2,
    explanation: "12 is the largest integer that divides both 24 and 36 without a remainder (24 = 12 × 2 and 36 = 12 × 3)."
  },
  {
    question: "Which equation represents Bézout's identity?",
    options: [
      "ax + by = gcd(a,b)",
      "ax + by = 0",
      "a + b = xy",
      "a - b = ab"
    ],
    answer: 0,
    explanation: "Bézout's identity states that for any non-zero integers a and b, there exist integers x and y such that ax + by = gcd(a,b)."
  },
  {
    question: "What is the GCD of two relatively prime integers?",
    options: ["0", "2", "Their product", "1"],
    answer: 3,
    explanation: "By definition, relatively prime integers share no common positive factors other than 1, so their GCD is 1."
  },
  {
    question: "Which equation represents the division algorithm?",
    options: [
      "a = b + r",
      "a = bq + r",
      "a = br + q",
      "a = q - r"
    ],
    answer: 1,
    explanation: "The division algorithm represents a dividend as divisor times quotient plus remainder: a = bq + r (0 ≤ r < b)."
  },
  {
    question: "What is the GCD of 43 and 17?",
    options: ["13", "17", "1", "2"],
    answer: 2,
    explanation: "43 and 17 are both prime numbers with no shared factors, so gcd(43, 17) = 1."
  },
  {
    question: "What are Bézout coefficients?",
    options: [
      "x and y satisfying ax + by = gcd(a,b)",
      "The prime factors of a number",
      "The quotients of division",
      "Numbers that always equal the GCD"
    ],
    answer: 0,
    explanation: "Bézout coefficients are the integers x and y that linearly combine a and b to equal gcd(a,b)."
  },
  {
    question: "When does the multiplicative inverse of a modulo m exist?",
    options: [
      "When a = m",
      "When a is even",
      "Only when m is prime",
      "When gcd(a,m) = 1"
    ],
    answer: 3,
    explanation: "A multiplicative inverse exists if and only if a and m are coprime (gcd(a, m) = 1), so ax ≡ 1 (mod m) has a solution."
  },
  {
    question: "What is the inverse of 3 modulo 7?",
    options: ["2", "5", "3", "6"],
    answer: 1,
    explanation: "3 × 5 = 15 = 7 × 2 + 1 ≡ 1 (mod 7). None of the other options produce remainder 1 modulo 7."
  },
  {
    question: "What is the GCD of 0 and 15?",
    options: ["0", "1", "15", "Undefined"],
    answer: 2,
    explanation: "Every non-zero integer divides 0. The largest divisor of 15 is 15 itself, which also divides 0, so gcd(0, 15) = 15."
  },
  {
    question: "Why is back-substitution used?",
    options: [
      "To express the GCD as a linear combination",
      "To calculate the product",
      "To convert integers to binary",
      "To find prime numbers"
    ],
    answer: 0,
    explanation: "Back-substitution works backwards through the division steps to express the GCD as a linear combination of the original inputs."
  },
  {
    question: "Which equation is a valid Bézout identity for 17 and 43?",
    options: [
      "17(2) + 43(1) = 60",
      "17 + 43 = 1",
      "17(5) - 43(2) = 1",
      "17(-5) + 43(2) = 1"
    ],
    answer: 3,
    explanation: "17(-5) + 43(2) = -85 + 86 = 1 = gcd(17, 43). In contrast, 17(5) - 43(2) = 85 - 86 = -1."
  },
  {
    question: "What is the inverse of 5 modulo 12?",
    options: ["2", "5", "7", "10"],
    answer: 1,
    explanation: "5 × 5 = 25 = 12 × 2 + 1 ≡ 1 (mod 12). Therefore, 5 is its own multiplicative inverse modulo 12."
  },
  {
    question: "If gcd(a,m) is greater than 1, what can we conclude?",
    options: [
      "The inverse is always 1",
      "The inverse does not exist",
      "The inverse equals m - a",
      "The inverse always equals a"
    ],
    answer: 1,
    explanation: "If gcd(a,m) > 1, any linear combination ax - my is a multiple of the GCD and cannot equal 1, so no inverse exists."
  },
  {
    question: "What is the GCD of 252 and 105?",
    options: ["21", "7", "35", "42"],
    answer: 0,
    explanation: "252 = 2 × 105 + 42; 105 = 2 × 42 + 21; 42 = 2 × 21 + 0. The last non-zero remainder is 21."
  },
  {
    question: "What is the inverse of 7 modulo 26?",
    options: ["3", "7", "11", "15"],
    answer: 3,
    explanation: "7 × 15 = 105 = 26 × 4 + 1 ≡ 1 (mod 26)."
  },
  {
    question: "When does the Euclidean Algorithm stop?",
    options: [
      "When the quotient becomes 1",
      "When the remainder becomes 0",
      "After two divisions",
      "When both numbers become even"
    ],
    answer: 1,
    explanation: "The algorithm stops when the remainder becomes 0; the previous non-zero remainder is the GCD."
  },
  {
    question: "If ax + by = 1 for integers x and y, what does this imply?",
    options: [
      "Both numbers are prime",
      "Both numbers are even",
      "Both numbers are equal",
      "The numbers are relatively prime"
    ],
    answer: 3,
    explanation: "Any common factor of a and b must divide ax + by = 1, meaning their only common positive divisor is 1."
  },
  {
    question: "What is the inverse of 17 modulo 43?",
    options: ["5", "17", "38", "43"],
    answer: 2,
    explanation: "From EEA, 17(-5) + 43(2) = 1, giving inverse -5 mod 43 = 38 (check: 17 × 38 = 646 = 43 × 15 + 1)."
  },
  {
    question: "Why is the Extended Euclidean Algorithm useful in cryptography?",
    options: [
      "It finds multiplicative inverses",
      "It encrypts messages without keys",
      "It generates passwords directly",
      "It replaces every encryption algorithm"
    ],
    answer: 0,
    explanation: "Modular multiplicative inverses computed by EEA are critical for key generation and decryption in RSA and other ciphers."
  }
];

const quizContainer = $("quizQuestions");
const checkAnswersBtn = $("checkAnswersBtn");
const quizAttemptNotice = $("quizAttemptNotice");

let currentQuestions = [];
let previousSet = "";
let quizChecked = false;

function shuffleQuestions(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function startNewQuiz() {
  let selected = shuffleQuestions(quizBank).slice(0, 5);

  let setKey = selected
    .map((question) => quizBank.indexOf(question))
    .sort((a, b) => a - b)
    .join(",");

  if (setKey === previousSet) {
    selected = shuffleQuestions(quizBank).slice(0, 5);

    setKey = selected
      .map((question) => quizBank.indexOf(question))
      .sort((a, b) => a - b)
      .join(",");
  }

  previousSet = setKey;
  currentQuestions = selected;
  quizChecked = false;

  quizContainer.innerHTML = currentQuestions
    .map((question, index) => `
      <div class="quiz-question" id="quizQuestion${index + 1}">
        <div class="question-header">
          <p>
            <b>${index + 1}.</b>
            ${question.question}
          </p>
          <span class="question-badge hidden" id="qBadge${index + 1}"></span>
        </div>

        <div class="options-group">
          ${question.options.map((option, optionIndex) => `
            <label class="quiz-option" id="q${index + 1}_opt${optionIndex}">
              <input
                type="radio"
                name="q${index + 1}"
                value="${optionIndex}"
              >
              <span class="option-text">${option}</span>
              <span class="option-tag"></span>
            </label>
          `).join("")}
        </div>
        <div class="question-feedback-msg hidden" id="qFeedback${index + 1}"></div>
      </div>
    `)
    .join("");

  $("quizForm").reset();

  checkAnswersBtn.disabled = true;
  $("scorePill").textContent = "0 / 5";

  $("quizResult").classList.add("hidden");
  $("quizResult").classList.remove("low");

  updateQuizAttemptStatus();
}

function updateQuizAttemptStatus() {
  const attempted = currentQuestions.filter((_, index) => {
    return document.querySelector(
      `input[name="q${index + 1}"]:checked`
    );
  }).length;

  const allAttempted =
    currentQuestions.length === 5 && attempted === 5;

  checkAnswersBtn.disabled =
    !allAttempted || quizChecked;

  quizAttemptNotice.textContent = allAttempted
    ? "All 5 questions answered. You can now check your answers."
    : `Please answer all 5 questions before checking your answers. (${attempted}/5 completed)`;

  return allAttempted;
}

quizContainer.addEventListener("change", () => {
  if (quizChecked) return;

  updateQuizAttemptStatus();

  $("quizResult").classList.add("hidden");
  $("scorePill").textContent = "— / 5";
});

$("quizForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (quizChecked || !updateQuizAttemptStatus()) {
    quizAttemptNotice.textContent = quizChecked
      ? "Quiz already checked. Select Reset Quiz to try again."
      : "Answer every question before checking your answers.";

    return;
  }

  let score = 0;

  currentQuestions.forEach((question, index) => {
    const qIndex = index + 1;
    const selected = document.querySelector(
      `input[name="q${qIndex}"]:checked`
    );
    const selectedVal = selected ? Number(selected.value) : -1;
    const isCorrect = selectedVal === question.answer;

    if (isCorrect) {
      score++;
    }

    const questionCard = $(`quizQuestion${qIndex}`);
    const qBadge = $(`qBadge${qIndex}`);
    const qFeedback = $(`qFeedback${qIndex}`);

    if (questionCard) {
      questionCard.classList.remove("card-correct", "card-wrong");
      questionCard.classList.add(isCorrect ? "card-correct" : "card-wrong");
    }

    if (qBadge) {
      qBadge.className = `question-badge ${isCorrect ? "correct" : "wrong"}`;
      qBadge.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
      qBadge.classList.remove("hidden");
    }

    question.options.forEach((optText, optIdx) => {
      const optLabel = $(`q${qIndex}_opt${optIdx}`);
      if (!optLabel) return;

      const tag = optLabel.querySelector(".option-tag");
      optLabel.classList.remove("option-correct", "option-wrong", "option-dim");

      if (optIdx === question.answer) {
        optLabel.classList.add("option-correct");
        if (tag) tag.textContent = "✓ Correct Answer";
      } else if (optIdx === selectedVal && !isCorrect) {
        optLabel.classList.add("option-wrong");
        if (tag) tag.textContent = "✗ Your Answer";
      } else {
        optLabel.classList.add("option-dim");
      }
    });

    if (qFeedback) {
      if (!isCorrect) {
        const yourChoice = selectedVal >= 0 ? question.options[selectedVal] : "None";
        qFeedback.className = "question-feedback-msg wrong";
        qFeedback.innerHTML = `
          <div class="feedback-status"><b>✗ Why your choice is wrong:</b> You selected "${yourChoice}".</div>
          <div class="feedback-detail"><b>Correct answer:</b> ${question.options[question.answer]}</div>
          <div class="feedback-explanation"><b>Explanation:</b> ${question.explanation}</div>
        `;
        qFeedback.classList.remove("hidden");
      } else {
        qFeedback.className = "question-feedback-msg correct";
        qFeedback.innerHTML = `
          <div class="feedback-status"><b>✓ Correct!</b> You selected "${question.options[question.answer]}".</div>
          <div class="feedback-explanation"><b>Explanation:</b> ${question.explanation}</div>
        `;
        qFeedback.classList.remove("hidden");
      }
    }

    document.querySelectorAll(`input[name="q${qIndex}"]`).forEach((input) => {
      input.disabled = true;
    });
  });

  quizChecked = true;

  $("scorePill").textContent = `${score} / 5`;

  const result = $("quizResult");

  result.classList.remove("hidden", "low");
  result.classList.toggle("low", score < 4);

  result.innerHTML = score >= 4
    ? `<b>Good work!</b> You scored ${score}/5. Review the correct and wrong answers above to reinforce your understanding.`
    : `<b>Keep practicing.</b> You scored ${score}/5. Review the correct and wrong answers highlighted above, then select Reset Quiz to try another set.`;

  checkAnswersBtn.disabled = true;

  quizAttemptNotice.textContent =
    "Quiz completed. Correct and wrong answers are shown above. Select Reset Quiz to try again.";
});

$("resetQuizBtn").addEventListener("click", startNewQuiz);

startNewQuiz();

runAlgorithm();
