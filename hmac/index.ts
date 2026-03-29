import crypto from "crypto";

function signHmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function verifySignature(rawBody: string, signature: string, secret: string) {
  const hash = signHmac(rawBody, secret);
  return hash === signature;
}

const signature = signHmac("hello ztks", "ztks_taokosao") as string;

console.log(111111, signature);
console.log(222222, verifySignature("hello ztks", signature, "ztks_taokosao"));
