const admin = require("firebase-admin");

const serviceAccount = require("../firebaseAdminToken.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access!" });
  }
  try {
    const idToken = token.split(" ")[1];
    const decode = await admin.auth().verifyIdToken(idToken);
    req.decoded_email = decode.email
    next();
  } catch (error) {

    return res.status(401).send({ message: " Invalid token" });
  }
};

module.exports = verifyToken;
