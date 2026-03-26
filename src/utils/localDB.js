import { get, set, del } from 'idb-keyval';

export async function saveResumeLocally(appId, base64data) {
    if (!base64data) {
        await deleteResumeLocally(appId);
        return;
    }
    try {
        await set(`resume_${appId}`, base64data);
    } catch (err) {
        console.error('Failed to save resume locally:', err);
    }
}

export async function getResumeLocally(appId) {
    try {
        return await get(`resume_${appId}`);
    } catch (err) {
        console.error('Failed to get resume locally:', err);
        return null;
    }
}

export async function deleteResumeLocally(appId) {
    try {
        await del(`resume_${appId}`);
    } catch (err) {
        console.error('Failed to delete resume locally:', err);
    }
}
