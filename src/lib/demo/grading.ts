import { EMPTY_ANSWER, type AnswerRecord, type AttemptRecord } from "./attempt";
import { ALL_QUESTIONS, type Question } from "./questions";
import { TOPICS, type SectionId, type Topic } from "./topics";

export type QuestionStatus = "correct" | "wrong" | "skipped";

export type QuestionResult = {
  question: Question;
  record: AnswerRecord;
  status: QuestionStatus;
};

export type SectionScore = {
  section: SectionId;
  correct: number;
  answered: number;
  total: number;
};

export type TopicScore = {
  topic: Topic;
  correct: number;
  total: number;
  avgSeconds: number;
};

export type GradedAttempt = {
  attempt: AttemptRecord;
  results: QuestionResult[];
  sections: Record<SectionId, SectionScore>;
  /** Weakest first. */
  topics: TopicScore[];
};

function statusOf(question: Question, record: AnswerRecord): QuestionStatus {
  if (record.choice === null) return "skipped";
  return record.choice === question.correctIndex ? "correct" : "wrong";
}

function scoreSection(section: SectionId, results: QuestionResult[]): SectionScore {
  const own = results.filter((result) => result.question.section === section);
  return {
    section,
    correct: own.filter((result) => result.status === "correct").length,
    answered: own.filter((result) => result.status !== "skipped").length,
    total: own.length,
  };
}

function scoreTopic(topic: Topic, results: QuestionResult[]): TopicScore {
  const own = results.filter((result) => result.question.topicId === topic.id);
  const answered = own.filter((result) => result.status !== "skipped");
  const totalSeconds = answered.reduce((sum, result) => sum + result.record.seconds, 0);
  return {
    topic,
    correct: own.filter((result) => result.status === "correct").length,
    total: own.length,
    avgSeconds: answered.length === 0 ? 0 : totalSeconds / answered.length,
  };
}

export function gradeAttempt(attempt: AttemptRecord): GradedAttempt {
  const results = ALL_QUESTIONS.map((question) => {
    const record = attempt.answers[question.id] ?? EMPTY_ANSWER;
    return { question, record, status: statusOf(question, record) };
  });

  const sections = {
    math: scoreSection("math", results),
    ct: scoreSection("ct", results),
  } satisfies Record<SectionId, SectionScore>;

  const topics = TOPICS.map((topic) => scoreTopic(topic, results))
    .filter((score) => score.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);

  return { attempt, results, sections, topics };
}
