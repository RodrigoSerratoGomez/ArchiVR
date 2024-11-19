import { getFirestore, collection, getDocs } from "firebase/firestore";

// Función para obtener usuarios de la colección "levelMetrics"
export const getUsersFromLevelMetrics = async () => {
  try {
    const db = getFirestore();
    const colRef = collection(db, "levelMetrics");

    console.log("Obteniendo documentos de la colección levelMetrics...");
    const docsSnap = await getDocs(colRef);

    if (docsSnap.empty) {
      console.warn(
        "No se encontraron documentos en la colección levelMetrics."
      );
      return [];
    }

    // Iterar sobre cada documento y extraer los datos
    const users = [];
    docsSnap.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    console.log("Usuarios obtenidos de levelMetrics:", users);
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios de levelMetrics:", error);
    return [];
  }
};
