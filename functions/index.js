const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

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
