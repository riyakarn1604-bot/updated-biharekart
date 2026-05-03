require('dotenv').config();
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbUrl = process.env.DATABASE_URL || 'file:dev.db';
// better-sqlite3 adapter expects { url: "file:./path/to/db" } 
const dbFilename = dbUrl.replace(/^file:[/]*/i, '');
const absPath = path.isAbsolute(dbFilename) ? dbFilename : path.resolve(process.cwd(), dbFilename);
const resolvedUrl = 'file:' + absPath.replace(/\\/g, '/');
console.log('resolvedUrl:', resolvedUrl);

const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
const prisma = new PrismaClient({ adapter });

prisma.product.count()
  .then(n => { console.log('product count:', n); process.exit(0); })
  .catch(e => { console.error('error:', e.message); process.exit(1); });
