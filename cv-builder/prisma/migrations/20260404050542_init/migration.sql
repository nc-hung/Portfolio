-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "requirements" TEXT,
    "skills" TEXT,
    "rawContent" TEXT,
    "analyzedData" TEXT,
    "matchScore" INTEGER,
    "topic" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CVTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "originalFileName" TEXT,
    "originalPdfPath" TEXT,
    "layoutConfig" TEXT NOT NULL,
    "sections" TEXT,
    "colorScheme" TEXT,
    "typography" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT,
    "templateId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'VI',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "skills" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "achievements" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "pdfUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CV_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CV_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CVTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CVVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cvId" TEXT NOT NULL,
    "diff" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CVVersion_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "appliedAt" DATETIME,
    "notes" TEXT,
    "nextAction" TEXT,
    "nextActionDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MasterCVBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT,
    "language" TEXT NOT NULL DEFAULT 'VI'
);

-- CreateTable
CREATE TABLE "ScrapeTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
