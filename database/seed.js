require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seedDatabase() {
  console.log('--- TAKE ONE Database Seeding ---');
  
  const connection = await pool.getConnection();
  try {
    // 1. Clean existing records (disable foreign key checks temporarily)
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Check if tables exist before truncating
    const tables = ['scripts', 'users'];
    for (const table of tables) {
      try {
        await connection.query(`TRUNCATE TABLE ${table}`);
        console.log(`Cleared existing records from table: ${table}`);
      } catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log(`Table ${table} does not exist yet. Skipping truncation.`);
        } else {
          throw err;
        }
      }
    }
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const passwordHash = bcrypt.hashSync('password123', 10);

    // 2. Insert Users
    const users = [
      {
        name: 'Aarush Gupta',
        email: 'aarushgupta289@gmail.com',
        password: passwordHash,
        role: 'Developer',
        secondary_role: 'admin',
        college: 'Rishihood University',
        city: 'Delhi',
        bio: 'Lead Developer and Maintainer of TAKE ONE Nexus.',
        skills: 'Node.js, React, Express, MySQL, Security Orchestration',
        portfolio: 'https://github.com/Aarush2112',
        email_verified: 1
      },
      {
        name: 'Test Admin',
        email: 'admin@takeone.test',
        password: passwordHash,
        role: 'Admin',
        secondary_role: 'admin',
        college: 'Whistling Woods',
        city: 'Mumbai',
        bio: 'Official Admin Account for Local Testing.',
        skills: 'Management, Moderation, Content Review',
        portfolio: 'https://takeone-nexus.net.in',
        email_verified: 1
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@takeone.test',
        password: passwordHash,
        role: 'Director',
        secondary_role: null,
        college: 'FTII Pune',
        city: 'Pune',
        bio: 'Director who loves tense chamber drama and campus productions.',
        skills: 'Direction, Screenplay, Casting',
        portfolio: 'https://portfolio.example/arjun',
        email_verified: 1
      },
      {
        name: 'Kavya Rao',
        email: 'kavya@takeone.test',
        password: passwordHash,
        role: 'Cinematographer',
        secondary_role: null,
        college: 'Whistling Woods',
        city: 'Mumbai',
        bio: 'DP focused on moody night exteriors and handheld realism.',
        skills: 'DP, Camera, Lighting',
        portfolio: 'https://portfolio.example/kavya',
        email_verified: 1
      },
      {
        name: 'Rehan Ali',
        email: 'rehan@takeone.test',
        password: passwordHash,
        role: 'Writer',
        secondary_role: null,
        college: 'SRFTI Kolkata',
        city: 'Kolkata',
        bio: 'Writer building intimate stories with sharp dialogue.',
        skills: 'Writing, Dialogue, Story',
        portfolio: 'https://portfolio.example/rehan',
        email_verified: 1
      }
    ];

    const insertedUserIds = [];

    for (const u of users) {
      const [res] = await connection.query(
        `INSERT INTO users (name, email, password, role, secondary_role, college, city, bio, skills, portfolio, email_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.name, u.email, u.password, u.role, u.secondary_role, u.college, u.city, u.bio, u.skills, u.portfolio, u.email_verified]
      );
      insertedUserIds.push({ email: u.email, id: res.insertId });
    }
    console.log(`Seeded ${insertedUserIds.length} users successfully.`);

    const getUserId = (email) => {
      const u = insertedUserIds.find(user => user.email === email);
      return u ? u.id : null;
    };

    // 3. Insert Scripts (if users were seeded successfully)
    const arjunId = getUserId('arjun@takeone.test');
    const rehanId = getUserId('rehan@takeone.test');

    if (arjunId && rehanId) {
      const scripts = [
        {
          user_id: arjunId,
          title: 'The Last Seance',
          genre: 'Horror',
          synopsis: 'A student medium streams a final ritual that goes very wrong.',
          roles_needed: 'Director, Sound Designer, Actor',
          status: 'Dir. Needed · 3 Roles Open',
          payment_status: 'paid',
          payment_id: 'seed_payment_001',
          payment_verified: 1
        },
        {
          user_id: rehanId,
          title: 'Letters to Nowhere',
          genre: 'Romance',
          synopsis: 'Two campus strangers leave notes in a dead letter box and never meet on time.',
          roles_needed: 'Director, DP',
          status: 'Team Forming',
          payment_status: 'paid',
          payment_id: 'seed_payment_002',
          payment_verified: 1
        },
        {
          user_id: arjunId,
          title: 'Dead Sprint',
          genre: 'Action',
          synopsis: 'A runner carrying stolen exam footage is chased across an empty city campus.',
          roles_needed: 'Actor, Editor, Sound',
          status: 'Full Crew · Casting Open',
          payment_status: 'paid',
          payment_id: 'seed_payment_003',
          payment_verified: 1
        }
      ];

      for (const s of scripts) {
        await connection.query(
          `INSERT INTO scripts (user_id, title, genre, synopsis, roles_needed, status, payment_status, payment_id, payment_verified)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [s.user_id, s.title, s.genre, s.synopsis, s.roles_needed, s.status, s.payment_status, s.payment_id, s.payment_verified]
        );
      }
      console.log(`Seeded ${scripts.length} scripts successfully.`);
    } else {
      console.warn('Skipping scripts seeding: Arjun or Rehan email IDs not found.');
    }

    console.log('--- Database seeding completed successfully! ---');
  } catch (error) {
    console.error('Fatal seeding error:', error.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

seedDatabase().catch(err => {
  console.error('Unhandled error during seeding:', err);
  process.exit(1);
});
