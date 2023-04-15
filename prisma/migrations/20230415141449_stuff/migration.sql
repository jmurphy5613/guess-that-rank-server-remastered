-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" SERIAL NOT NULL,
    "videoSource" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "videoURL" TEXT NOT NULL,
    "videoName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "userRank" INTEGER NOT NULL,

    CONSTRAINT "Clip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guess" (
    "id" SERIAL NOT NULL,
    "guessedRank" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "clipId" INTEGER NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_clipId_fkey" FOREIGN KEY ("clipId") REFERENCES "Clip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
