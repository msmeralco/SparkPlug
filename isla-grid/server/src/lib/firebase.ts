import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
// const serviceAccount = {
//   project_id: process.env.FIREBASE_PROJECT_ID, // must be project_id
//   client_email: process.env.FIREBASE_CLIENT_EMAIL, // must be client_email
//   private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // must be private_key
// };

const serviceAccount = {
  project_id: "islagrid", // must be project_id
  client_email: "firebase-adminsdk-fbsvc@islagrid.iam.gserviceaccount.com", // must be client_email
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCp8x5uLjgq8QFp\nWiDMpqIDzPS8W6ZdigPBqSTtXZbxhEgvyDXDlGMsWjArfejOZ6qMnp1mkj6gpAVR\nVI7far+sD1l1jnCVGI8HBiLRgwwIiBI5gq0qHR+vo/iqDwfQ/m+a0w+bVDFsDGIY\n3V/hM5VgQWunn2u6D7izabuMzqoVtM+Uk12KOowCauWKK3a5ltRemWXA9UdpNykJ\njz3/pD2OTriuVrNm9zWosLVGfaURgnBCH+nPeI0tJxJzn53nWiSZplFvev+oksnU\nNQuSZ4Asn8J4eAIAjFKshAbGRGhiP+PkBTNaJhU+9oog/skBVtxHecVvmrWgsCn0\nhSWchWmnAgMBAAECggEAC5Vxporp8ytYMEkfYTOeaWnn6IrKrSeCGAoiZTdy2WVt\n0ivwVjNgCx7el6hOXPs96bXJ/rrLIAHuBtwfnOTWybCGJXge/lqdLRpi9yragB5e\nN6NLkEpJ5ZvkkBrUKo+dJc1rC+hSMg4qBY3ZQi1U6imrX9KC8jyuFzSGvxM7Dp2W\n4Fm9U2/2MTMXU3KOJVMqcc+wob1xBqKGIQOKtLNzJ1AtmSD97hXbjCigpWlxzVzx\nijbgkvJrSHtvxEXXU2MEcAYmgPbltdV2qVRsz+kvPUTPQb9pk0OrTcCM2Ff5YxR4\nv2RU7rFH7CZa+EMm7eHbM9MO7Nx9nSqcnLyfZ3i3AQKBgQDhA37vlm9enrlydJZ4\nf9Dl8jH8NRJCB7xqEWgfr78RaipXbjaf44DDvSqo4221fxsC9zbboaVAWsDXMm5C\nTNIj6VWjrG18BiDOSfPmGtQ2iO0zEVtnO15BM4JSyO2F3HsRx3XJm+Z32Vu3nr7L\n5jg3nPjqmJqcT8lecNJTWYZdJwKBgQDBWm3LAyLTAO7pgu9HPpG8ZNTY7khMue7s\n19lsWm5g/mnmpgtiXdKegW8xdrbOzVUX80LBn8Giu+SVedYztBJMvFD+C6P4KNND\n4EVDtQLNe1lbZDU6n745vKPL5MOdokJzydvJnrdbEMV0FdBllByTQyj0+jjAGvXv\n8W6diClfgQKBgQDHkaAtw1E3rLNx7jHe4g5XQ/5NYIy2/8F+mb2uDOP8ABtZvCi6\nmr8D3G1PqZcOWJOOh9Ch77ZvY46Rzuq35waiTztjlXTtgUnrbO/jcHwzejJXDtfw\nsVkhnxvBbPAtv6Vv2WaAz8MTHTcZnrQ+iAvoV1L2Ty8h4CoLlykUP9zKFQKBgAHu\ntHA1/NAdD0Y4L8oHfw9h9pqgbwqNRS0Kzzp9AONpR4etmymFhIhfBMx6wkL43GPb\n44vp29aTiCpSSGjF4PTxYOHZHe9qAQqJoEeX9Io3NGJscve+Bvmuv/hWtfnKWF2t\n48t1EaIQXdjWKvoI6+ww3KTuJ0kMO+8E+7UJWliBAoGAVYTDfgRmHdIgOHquANXt\nA8v/1ODs0YOEBHe3IpQB+tbcNe0WUphTEkMSOBYLs3mnyEaDhe72EbSFCx33KK4d\nnpmAc0hyCNssvRFJyB7PBNLmlJmwyaBbw2A58qsz+SrPVM+bT3JAYUFvLLtvXaUE\njrAdjDyPcc0DFo3rwTdn5UQ=\n-----END PRIVATE KEY-----\n"?.replace(
      /\\n/g,
      "\n"
    ), // must be private_key
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount as string | ServiceAccount),
    });

export const auth = getAuth(app);
export const db = getFirestore(app);
