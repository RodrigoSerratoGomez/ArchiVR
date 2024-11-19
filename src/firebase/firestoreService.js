import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export const addData = async (collectionName, userId, data) => {
  try {
    const docRef = doc(db, collectionName, userId);
    await setDoc(docRef, data);
    console.log("Documento añadido con ID:", userId);
    return true;
  } catch (e) {
    console.error("Error al añadir el documento:", e);
    return false;
  }
};

export const addMetrics = async (userId, gameId, data) => {
  try {
    const collectionPath = `levelMetrics/${userId}/games`;
    const docRef = doc(db, collectionPath, gameId);
    await setDoc(docRef, data);
    console.log("Métricas añadidas con ID de partida:", gameId);
    return true;
  } catch (e) {
    console.error("Error al añadir las métricas:", e);
    return false;
  }
};

export const getData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return [];
  }
};

export const getMetrics = async (collectionName, userId, levelId) => {
  try {
    const metricsRef = collection(db, collectionName, userId, "games");
    const levelQuery = query(metricsRef, where("levelId", "==", levelId));
    const querySnapshot = await getDocs(levelQuery);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    return [];
  }
};

export const getLevelMetrics = async (userId) => {
  try {
    const levelMetricsRef = collection(db, "levelMetrics", userId, "games");
    const querySnapshot = await getDocs(levelMetricsRef);

    const metricsData = [];
    querySnapshot.forEach((doc) => {
      metricsData.push(doc.data());
    });

    return metricsData;
  } catch (error) {
    console.error("Error al obtener métricas de niveles:", error);
    return [];
  }
};

export const getUserData = async (collectionName, userId) => {
  try {
    const userRef = doc(db, collectionName, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log("No existe el documento con ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento:", error);
    return null;
  }
};

export const updateData = async (collectionName, docId, newData) => {
  const docRef = doc(db, collectionName, docId);
  try {
    await updateDoc(docRef, newData);
    console.log("Documento actualizado");
    return true;
  } catch (e) {
    console.error("Error al actualizar el documento:", e);
    return false;
  }
};

export const deleteData = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  try {
    await deleteDoc(docRef);
    console.log("Documento eliminado");
    return true;
  } catch (e) {
    console.error("Error al eliminar el documento:", e);
    return false;
  }
};
