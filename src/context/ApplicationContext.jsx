import { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';
import {
    fetchApplications,
    saveApplication,
    removeApplication,
} from '../utils/firestoreAdapter';

const ApplicationContext = createContext(null);

// localStorage adapter (used when offline / not signed in)
const localStore = {
    load: () => {
        try {
            const stored = localStorage.getItem('job-tracker-apps');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    },
    save: (data) => {
        try {
            localStorage.setItem('job-tracker-apps', JSON.stringify(data));
        } catch {
            // localStorage unavailable
        }
    },
};

function applicationReducer(state, action) {
    let newState;
    const now = new Date().toISOString();

    switch (action.type) {
        case 'SET': {
            return action.payload;
        }
        case 'ADD': {
            const app = {
                ...action.payload,
                id: generateId(),
                createdAt: now,
                updatedAt: now,
            };
            newState = [...state, app];
            break;
        }
        case 'UPDATE': {
            newState = state.map((app) =>
                app.id === action.payload.id
                    ? { ...app, ...action.payload, updatedAt: now }
                    : app
            );
            break;
        }
        case 'DELETE': {
            newState = state.filter((app) => app.id !== action.payload);
            break;
        }
        case 'BULK_UPDATE': {
            const { ids, changes } = action.payload;
            newState = state.map((app) =>
                ids.includes(app.id) ? { ...app, ...changes, updatedAt: now } : app
            );
            break;
        }
        case 'IMPORT': {
            newState = action.payload.map((app) => ({
                ...app,
                id: app.id || generateId(),
                createdAt: app.createdAt || now,
                updatedAt: now,
            }));
            break;
        }
        default:
            return state;
    }

    // Always persist to localStorage as a cache
    localStore.save(newState);
    return newState;
}

export function ApplicationProvider({ children }) {
    const { user } = useAuth();
    const toast = useToast();
    const [applications, dispatch] = useReducer(
        applicationReducer,
        []
    );

    const isOnline = !!user;
    const prevUserRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // When user signs in, load their data from Firestore
    useEffect(() => {
        if (user && user.uid !== prevUserRef.current) {
            prevUserRef.current = user.uid;
            setLoading(true);
            // Clear local cache from any previous user before loading
            localStore.save([]);
            dispatch({ type: 'SET', payload: [] });
            fetchApplications(user.uid)
                .then((apps) => {
                    dispatch({ type: 'SET', payload: apps });
                })
                .catch((err) => {
                    console.error(err);
                    toast('Failed to load applications from cloud.', 'error');
                })
                .finally(() => setLoading(false));
        }
        if (!user) {
            prevUserRef.current = null;
            // Clear data when signed out
            localStore.save([]);
            dispatch({ type: 'SET', payload: [] });
        }
    }, [user]);

    const addApplication = useCallback(
        (app) => {
            dispatch({ type: 'ADD', payload: app });
            if (user) {
                setTimeout(() => {
                    const stored = localStore.load();
                    const newest = stored[stored.length - 1];
                    if (newest) {
                        saveApplication(user.uid, newest).catch((err) => {
                            console.error(err);
                            toast('Failed to save application to cloud.', 'error');
                        });
                    }
                }, 50);
            }
        },
        [user]
    );

    const updateApplication = useCallback(
        (app) => {
            dispatch({ type: 'UPDATE', payload: app });
            if (user) {
                saveApplication(user.uid, app).catch((err) => {
                    console.error(err);
                    toast('Failed to update application.', 'error');
                });
            }
        },
        [user]
    );

    const deleteApplication = useCallback(
        (id) => {
            dispatch({ type: 'DELETE', payload: id });
            if (user) {
                removeApplication(user.uid, id).catch((err) => {
                    console.error(err);
                    toast('Failed to delete application.', 'error');
                });
            }
        },
        [user]
    );

    const bulkUpdateStatus = useCallback(
        (ids, status) => {
            dispatch({ type: 'BULK_UPDATE', payload: { ids, changes: { status } } });
            if (user) {
                setTimeout(() => {
                    const stored = localStore.load();
                    const updated = stored.filter((a) => ids.includes(a.id));
                    updated.forEach((app) =>
                        saveApplication(user.uid, app).catch((err) => {
                            console.error(err);
                            toast('Failed to sync status update.', 'error');
                        })
                    );
                }, 50);
            }
        },
        [user]
    );

    const importApplications = useCallback(
        (apps) => {
            dispatch({ type: 'IMPORT', payload: apps });
            if (user) {
                setTimeout(() => {
                    const stored = localStore.load();
                    saveAllApplications(user.uid, stored).catch((err) => {
                        console.error(err);
                        toast('Failed to sync imported data to cloud.', 'error');
                    });
                }, 100);
            }
        },
        [user]
    );

    return (
        <ApplicationContext.Provider
            value={{
                applications,
                loading,
                addApplication,
                updateApplication,
                deleteApplication,
                bulkUpdateStatus,
                importApplications,
            }}
        >
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplications() {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplications must be used within ApplicationProvider');
    }
    return context;
}
