const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const app = initializeApp();

exports.createAdmin = functions
  .region('asia-southeast1')
  .runWith({ memory: '128MB' })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth || !ctx.auth.token.admin) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called by an admin.'
      );
    }
    if (!data.email) {
      throw new functions.https.HttpsError('failed-precondition', 'Email is required.');
    }
    if (!data.password) {
      throw new functions.https.HttpsError('failed-precondition', 'Password is required.');
    }

    const newUser = await getAuth().createUser({
      email: data.email,
      emailVerified: true,
      password: data.password,
      disabled: false,
    });
    await getAuth().setCustomUserClaims(newUser.uid, { admin: true });
  });

exports.deleteUser = functions
  .region('asia-southeast1')
  .runWith({ memory: '128MB' })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth || !ctx.auth.token.admin) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called by an admin.'
      );
    }
    if (!data.uid) {
      throw new functions.https.HttpsError('failed-precondition', 'Email is required.');
    }

    await getAuth().deleteUser(data.uid);
  });

exports.deleteUsers = functions
  .region('asia-southeast1')
  .runWith({ memory: '128MB' })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth || !ctx.auth.token.admin) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called by an admin.'
      );
    }
    if (!data.uids) {
      throw new functions.https.HttpsError('failed-precondition', 'Uids required.');
    }

    await getAuth().deleteUsers(data.uids);
  });

exports.listAdmins = functions
  .region('asia-southeast1')
  .runWith({ memory: '128MB' })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth || !ctx.auth.token || !ctx.auth.token.admin) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called by an admin.'
      );
    }

    const userList = await getAuth().listUsers();
    const admins = [];
    userList.users.forEach((r) => {
      if (r.customClaims.admin) admins.push(r);
    });
    return admins;
  });

exports.advancePeriod = functions
  .region('asia-southeast1')
  .runWith({ memory: '256MB' })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth || !ctx.auth.token || !ctx.auth.token.admin) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called by an admin.'
      );
    }
    if (!data.classId || data.period == null) {
      throw new functions.https.HttpsError('failed-precondition', 'classId and period required.');
    }

    const taxRate = data.holdingCost / 100;

    const currentPeriod = Number(data.period);

    const db = getFirestore();

    const playersRef = db.collection('players');
    const playersSnapshot = await playersRef.where('classID', '==', data.classId).get();

    if (data.shorting) {
      playersSnapshot.forEach(async (doc) => {
        const player = doc.data();
        const shortRecords = player.shortRecords;

        let totalTax = 0;
        for (const counterId in shortRecords) {
          for (const period in shortRecords[counterId]) {
            if (currentPeriod - period <= 0) continue;
            const shortRecord = shortRecords[counterId][period];
            if (shortRecord.nCovered < shortRecord.nSold) {
              const nToTax = shortRecord.nSold - shortRecord.nCovered;
              const amtToTax = nToTax * shortRecord.price;
              const tax = amtToTax * taxRate;
              totalTax += tax;
            }
          }
        }

        if (totalTax == 0) return;

        player.transactions.push({
          isStock: false,
          label: 'Short holding cost',
          price: totalTax,
          period: currentPeriod,
          nShares: 1,
        });

        const playerRef = db.collection('players').doc(doc.id);
        await playerRef.update(player);
      });
    }

    const classRef = db.collection('classes').doc(data.classId);
    await classRef.update({
      period: currentPeriod + 1,
      nextPeriod: Timestamp.fromDate(new Date()),
    });
  });
