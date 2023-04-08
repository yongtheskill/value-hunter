import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';

const storage = getStorage();

const formatStorageUrl = (path) => {
  if (path == '') return '/missing.png';
  return `https://firebasestorage.googleapis.com/v0/b/sh-trading-game.appspot.com/o/${encodeURIComponent(
    path
  )}?alt=media`;
};

const uploadFile = async (f, path) => {
  const storageRef = ref(storage, path);
  return await uploadBytes(storageRef, f);
};

const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  return await deleteObject(storageRef);
};

export { formatStorageUrl, uploadFile, deleteFile };
