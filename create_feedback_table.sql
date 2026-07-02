CREATE TABLE IF NOT EXISTS systemfeedback (
    "Id" SERIAL PRIMARY KEY,
    "studentId" INTEGER NOT NULL REFERENCES students("Id"),
    "schoolId" INTEGER NOT NULL REFERENCES schools("Id"),
    "q1_easyToUse" INTEGER NOT NULL,
    "q2_clearExplanations" INTEGER NOT NULL,
    "q3_helpfulContent" INTEGER NOT NULL,
    "q4_quizQuality" INTEGER NOT NULL,
    "q5_quizDifficulty" INTEGER NOT NULL,
    "q6_trackProgress" INTEGER NOT NULL,
    "q7_aiFeature" INTEGER NOT NULL,
    "q8_userFriendly" INTEGER NOT NULL,
    "q9_technicalIssues" INTEGER NOT NULL,
    "q10_suggestions" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);