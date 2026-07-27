import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function getWebsiteNotice(callback) {

  const websiteRef = doc(
    db,
    "settings",
    "website"
  );

  return onSnapshot(
    websiteRef,
    (snapshot) => {

      if (snapshot.exists()) {

        callback(snapshot.data());

      } else {

        callback(null);

      }

    }
  );

}