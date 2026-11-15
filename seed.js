const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

const J = [
  {
    title: 'State v. Ramesh Kumar',
    caseNumber: 'Sessions Case No. 214/2023',
    court: 'District and Sessions Court, Jalandhar',
    summary: 'The court acquitted the accused of charges under Section 302 IPC, finding the prosecution failed to prove the chain of circumstances. The recovery of the weapon was not corroborated by independent witnesses. The benefit of doubt was extended to the accused.',
    legalPoints: ['In a case based on circumstantial evidence, the chain must be complete and point only to guilt.', 'Recovery under Section 27 of the Evidence Act needs independent corroboration.', 'Benefit of doubt must go to the accused where two views are possible.'],
    citations: ['Section 302 IPC', 'Section 27 Evidence Act', 'Sharad Birdhichand Sarda v. State of Maharashtra', 'AIR 1984 SC 1622'],
    fullText: 'The case rests on circumstantial evidence. It is held that the chain of circumstances must be complete. Recovery of weapon under Section 27 of the Evidence Act was not supported by independent witnesses. Sharad Birdhichand Sarda v. State of Maharashtra AIR 1984 SC 1622 followed. Accused acquitted of Section 302 IPC. Benefit of doubt extended.',
  },
  {
    title: 'Sunita Devi v. Gurmeet Singh',
    caseNumber: 'Civil Suit No. 87/2022',
    court: 'Civil Court (Senior Division), Kapurthala',
    summary: 'The suit for specific performance of an agreement to sell was decreed. The court held the plaintiff was always ready and willing to perform her part, as required by Section 16(c) of the Specific Relief Act.',
    legalPoints: ['Readiness and willingness must be pleaded and proved throughout.', 'Time is not ordinarily the essence of a contract for sale of immovable property.'],
    citations: ['Section 16(c) Specific Relief Act', 'Article 54 Limitation Act', '(2011) 3 SCC 345'],
    fullText: 'Suit for specific performance of agreement to sell. It is held that the plaintiff was ready and willing under Section 16(c) of the Specific Relief Act. Time is not the essence of contract for immovable property. Limitation under Article 54 of the Limitation Act satisfied. (2011) 3 SCC 345 referred. Suit decreed.',
  },
];

async function main() {
  const user = await db.user.upsert({
    where: { email: 'demo@court.in' },
    update: {},
    create: { name: 'Adv. Demo User', email: 'demo@court.in', password: await bcrypt.hash('Demo@1234', 10), role: 'LAWYER' },
  });
  if ((await db.judgment.count({ where: { userId: user.id } })) > 0) return console.log('Already seeded');
  const day = 86400000;
  for (const [i, j] of J.entries()) {
    const rec = await db.judgment.create({
      data: { ...j, legalPoints: JSON.stringify(j.legalPoints), citations: JSON.stringify(j.citations), userId: user.id, aiProvider: 'seed' },
    });
    await db.hearing.create({
      data: { caseNumber: j.caseNumber, court: j.court, purpose: i ? 'Execution of decree' : 'Appeal filing / compliance', date: new Date(Date.now() + (7 + i * 12) * day), judgmentId: rec.id, userId: user.id },
    });
  }
  console.log('Seeded. Login: demo@court.in / Demo@1234');
}
main().finally(() => db.$disconnect());
