import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    writeBatch,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

// Each user's applications live at: users/{uid}/applications/{appId}
function getUserAppsRef(uid) {
    return collection(db, 'users', uid, 'applications');
}

export async function fetchApplications(uid) {
    const q = query(getUserAppsRef(uid), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveApplication(uid, application) {
    const ref = doc(db, 'users', uid, 'applications', application.id);
    // Strip out resume file data for Firestore (too large for documents)
    const { resumeFile, ...data } = application;
    await setDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
}

export async function removeApplication(uid, appId) {
    const ref = doc(db, 'users', uid, 'applications', appId);
    await deleteDoc(ref);
}

export async function saveAllApplications(uid, applications) {
    const batch = writeBatch(db);
    applications.forEach((app) => {
        const ref = doc(db, 'users', uid, 'applications', app.id);
        const { resumeFile, ...data } = app;
        batch.set(ref, { ...data, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
}
