export const TARGET_EVENT_TITLE = 'Mission: Impossible - Race Against the Entity';

export const SUCCESS_MESSAGE =
  "Mission success. It's not impossible if you try. Congratulations";

export type HintCategory =
  | 'empty'
  | 'capitalization'
  | 'spacing'
  | 'symbols'
  | 'spelling'
  | 'incomplete';

export interface ValidationHint {
  category: HintCategory;
  message: string;
}

export interface ValidationResult {
  isSuccess: boolean;
  hints: ValidationHint[];
  summary: string;
}

const EXPECTED_WORDS = [
  'Mission',
  'Impossible',
  'Race',
  'Against',
  'the',
  'Entity',
];

function stripSymbolsAndSpaces(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeHyphenVariants(value: string): string {
  return value.replace(/[\u2010-\u2015\u2212]/g, '-');
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () =>
    Array<number>(cols).fill(0)
  );

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function hasCapitalizationMismatch(input: string): boolean {
  // Check exact case-insensitive full string match
  if (input.toLowerCase() === TARGET_EVENT_TITLE.toLowerCase()) {
    return input !== TARGET_EVENT_TITLE;
  }

  // Also check word-by-word casing for words that match target words ignoring case
  const tokens = input.match(/[A-Za-z]+/g) ?? [];
  for (const token of tokens) {
    const matchedExpected = EXPECTED_WORDS.find(
      (expected) => expected.toLowerCase() === token.toLowerCase()
    );
    if (matchedExpected && matchedExpected !== token) {
      return true;
    }
  }

  return false;
}

function hasSpacingMismatch(input: string): boolean {
  // Leading or trailing whitespace
  if (input !== input.trim()) {
    return true;
  }

  // Consecutive spaces, tabs, or newlines
  if (/\s{2,}/.test(input) || /[\t\r\n]/.test(input)) {
    return true;
  }

  // Missing space right after colon (e.g. "Mission:Impossible")
  if (/:(?=\S)/.test(input)) {
    return true;
  }

  // Extra space right before colon (e.g. "Mission : Impossible")
  if (/\s+:/.test(input)) {
    return true;
  }

  // Missing spaces around hyphen/dash (e.g. "Impossible-Race" or "Impossible- Race")
  const normalizedDash = normalizeHyphenVariants(input);
  if (/(?:\S-|-\S)/.test(normalizedDash)) {
    return true;
  }

  // Check if stripping all spaces makes it match target (ignoring case/symbols) when words were jammed together
  const inputLettersAndSymbols = input.replace(/\s+/g, '').toLowerCase();
  const targetLettersAndSymbols = TARGET_EVENT_TITLE.replace(/\s+/g, '').toLowerCase();
  if (
    inputLettersAndSymbols === targetLettersAndSymbols &&
    input.toLowerCase() !== TARGET_EVENT_TITLE.toLowerCase()
  ) {
    return true;
  }

  // Check if compact alphanumeric forms match while word count differs (e.g. merged words)
  if (
    stripSymbolsAndSpaces(input) === stripSymbolsAndSpaces(TARGET_EVENT_TITLE)
  ) {
    const inputWordCount = input.trim().split(/\s+/).filter(Boolean).length;
    const expectedAlphaWordCount = EXPECTED_WORDS.length;
    const inputAlphaWords = (input.match(/[A-Za-z0-9]+/g) ?? []).length;
    if (inputAlphaWords !== expectedAlphaWordCount || inputWordCount < expectedAlphaWordCount) {
      return true;
    }
  }

  return false;
}

function hasSymbolMismatch(input: string): boolean {
  const hasColon = input.includes(':');
  const hasStandardHyphen = input.includes('-');
  const hasSmartDash = /[\u2010-\u2015\u2212]/.test(input);
  const compactMatches =
    stripSymbolsAndSpaces(input) === stripSymbolsAndSpaces(TARGET_EVENT_TITLE);

  // If user typed a smart/en/em dash instead of standard hyphen
  if (hasSmartDash && !hasStandardHyphen) {
    return true;
  }

  // Check for unexpected punctuation characters (like ; , . / _ ! ?)
  const strippedValid = input.replace(/[A-Za-z0-9\s:-]/g, '');
  if (strippedValid.length > 0) {
    return true;
  }

  // If letters match or mostly match (e.g. >= 3 expected words present), missing ':' or '-' is a symbol issue
  const lowerWords: string[] = input.toLowerCase().match(/[a-z]+/g) ?? [];
  const matchedWordCount = EXPECTED_WORDS.filter((w) =>
    lowerWords.includes(w.toLowerCase())
  ).length;

  if (compactMatches || matchedWordCount >= 3) {
    if (!hasColon || !hasStandardHyphen) {
      return true;
    }
    // Check wrong count of symbols (e.g. multiple colons or hyphens)
    const colonCount = (input.match(/:/g) ?? []).length;
    const hyphenCount = (input.match(/-/g) ?? []).length;
    if (colonCount !== 1 || hyphenCount !== 1) {
      return true;
    }
  }

  return false;
}

export function validateEventTitle(rawInput: string): ValidationResult {
  if (rawInput === TARGET_EVENT_TITLE) {
    return {
      isSuccess: true,
      hints: [],
      summary: SUCCESS_MESSAGE,
    };
  }

  if (rawInput.trim().length === 0) {
    return {
      isSuccess: false,
      summary: 'Input stream empty. Enter the full event title.',
      hints: [
        {
          category: 'empty',
          message:
            'No characters detected. Provide the exact event title, including symbols and spacing.',
        },
      ],
    };
  }

  const hints: ValidationHint[] = [];

  if (hasCapitalizationMismatch(rawInput)) {
    hints.push({
      category: 'capitalization',
      message:
        'Capitalization mismatch — check uppercase and lowercase letters carefully across the entire title.',
    });
  }

  if (hasSpacingMismatch(rawInput)) {
    hints.push({
      category: 'spacing',
      message:
        'Spacing cadence is off — watch for single spaces between words, around dividers, and remove any stray outer spaces.',
    });
  }

  if (hasSymbolMismatch(rawInput)) {
    const hasSmartDash = /[\u2010-\u2015\u2212]/.test(rawInput);
    hints.push({
      category: 'symbols',
      message: hasSmartDash
        ? 'Divider symbol mismatch — use a standard keyboard hyphen rather than an elongated dash, and verify all punctuation.'
        : 'Symbol interference detected — punctuation marks and dividers must be present in their exact positions.',
    });
  }

  const compactInput = stripSymbolsAndSpaces(rawInput);
  const compactTarget = stripSymbolsAndSpaces(TARGET_EVENT_TITLE);

  // Check if user only entered a partial title (e.g. "Mission: Impossible")
  if (
    compactInput.length > 0 &&
    compactInput.length < compactTarget.length &&
    compactTarget.includes(compactInput)
  ) {
    hints.push({
      category: 'incomplete',
      message:
        'Partial transmission — the event title has more than one segment.',
    });
  } else if (compactInput !== compactTarget) {
    const distance = levenshtein(compactInput, compactTarget);
    if (distance <= 6) {
      hints.push({
        category: 'spelling',
        message:
          'Near-lock on characters — double-check every word letter by letter for small typos.',
      });
    } else if (hints.length === 0) {
      hints.push({
        category: 'spelling',
        message:
          'Title unrecognized — verify the full event title from the briefing and match every letter, symbol, and space.',
      });
    }
  }

  return {
    isSuccess: false,
    summary: 'Verification failed. Signal rejected.',
    hints,
  };
}
