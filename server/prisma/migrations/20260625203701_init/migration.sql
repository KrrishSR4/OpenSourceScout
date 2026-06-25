-- CreateTable
CREATE TABLE "RepositoryCache" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Framework" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "resultsCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RepositoryFrameworks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RepositoryFrameworks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryCache_githubId_key" ON "RepositoryCache"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryCache_fullName_key" ON "RepositoryCache"("fullName");

-- CreateIndex
CREATE INDEX "RepositoryCache_fullName_idx" ON "RepositoryCache"("fullName");

-- CreateIndex
CREATE INDEX "RepositoryCache_language_idx" ON "RepositoryCache"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Framework_name_key" ON "Framework"("name");

-- CreateIndex
CREATE INDEX "Framework_name_idx" ON "Framework"("name");

-- CreateIndex
CREATE INDEX "SearchHistory_query_idx" ON "SearchHistory"("query");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE INDEX "_RepositoryFrameworks_B_index" ON "_RepositoryFrameworks"("B");

-- AddForeignKey
ALTER TABLE "_RepositoryFrameworks" ADD CONSTRAINT "_RepositoryFrameworks_A_fkey" FOREIGN KEY ("A") REFERENCES "Framework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepositoryFrameworks" ADD CONSTRAINT "_RepositoryFrameworks_B_fkey" FOREIGN KEY ("B") REFERENCES "RepositoryCache"("id") ON DELETE CASCADE ON UPDATE CASCADE;
