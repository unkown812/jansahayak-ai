import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';

const AppContext = createContext();

const mapGrievanceDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    translatedDescription: data.translated_description || data.description || '',
    reporter: data.reporter || '',
    sector: data.sector || '',
    urgency: data.urgency || '',
    status: data.status || 'Pending',
    coordinates: data.coordinates || null,
    timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    impact: data.impact || '',
    resolvedDate: data.resolvedDate?.toDate?.()?.toISOString() || null,
    qualityReports: data.qualityReports || [],
    supportCount: data.supportCount || 0,
    supporters: data.supporters || [],
  };
};

const mapProjectDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    sector: data.sector || '',
    cost: data.cost || 0,
    duration: data.duration || 0,
    status: data.status || 'Queued',
    priority: data.priority ?? 99,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    materials: data.materials || '',
    isMaintenance: data.isMaintenance || false,
  };
};

export const AppProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Generate anonymous user ID on first visit
  useEffect(() => {
    if (!localStorage.getItem('js_user_id')) {
      localStorage.setItem('js_user_id', crypto.randomUUID());
    }
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsLoggedIn(true);
        // Create/update user doc on login
        const userRef = doc(db, 'users', firebaseUser.uid);
        setDoc(userRef, {
          name: firebaseUser.displayName || 'Anonymous',
          email: firebaseUser.email || '',
          role: 'citizen',
          createdAt: serverTimestamp(),
        }, { merge: true });
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    return () => unsub();
  }, []);

  // Real-time grievances listener
  useEffect(() => {
    const q = query(collection(db, 'grievances'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(mapGrievanceDoc);
      setGrievances(items);
    }, (err) => {
      console.error('Error fetching grievances:', err.message);
    });
    return () => unsub();
  }, []);

  // Real-time projects listener
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('priority', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(mapProjectDoc);
      setProjects(items);
    }, (err) => {
      console.error('Error fetching projects:', err.message);
    });
    return () => unsub();
  }, []);

  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('landing');

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });

  // Persist Theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const rootEl = document.documentElement;
    const bodyEl = document.body;
    if (theme === 'dark') {
      rootEl.classList.add('dark');
      bodyEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
      bodyEl.classList.remove('dark');
    }
  }, [theme]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Error signing in with Google:', err.message);
      alert('Authentication error: ' + err.message);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    return true;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  };

  const addGrievance = async (newTicket) => {
    try {
      await addDoc(collection(db, 'grievances'), {
        title: newTicket.title,
        description: newTicket.description,
        translated_description: newTicket.translatedDescription || newTicket.description,
        reporter: newTicket.reporter,
        sector: newTicket.sector,
        urgency: newTicket.urgency,
        status: newTicket.status || 'Pending',
        coordinates: newTicket.coordinates || null,
        timestamp: serverTimestamp(),
        impact: newTicket.impact || '',
        resolvedDate: null,
        qualityReports: [],
        supportCount: 0,
        supporters: [],
      });
    } catch (err) {
      console.error('Error adding grievance:', err.message);
      alert('Error saving grievance: ' + err.message);
    }
  };

  const updateGrievanceStatus = async (id, status) => {
    try {
      const updateData = { status };
      if (status === 'Resolved') {
        updateData.resolvedDate = serverTimestamp();
      }
      await updateDoc(doc(db, 'grievances', id), updateData);
    } catch (err) {
      console.error('Error updating grievance status:', err.message);
    }
  };

  const addProject = async (newProj) => {
    try {
      const nextPriority = projects.length;
      await addDoc(collection(db, 'projects'), {
        name: newProj.name,
        description: newProj.description || '',
        sector: newProj.sector,
        cost: newProj.cost || 0,
        duration: newProj.duration || 0,
        status: newProj.status || 'Queued',
        priority: nextPriority,
        createdAt: serverTimestamp(),
        materials: newProj.materials || '',
        isMaintenance: newProj.isMaintenance || false,
      });
    } catch (err) {
      console.error('Error adding project:', err.message);
      alert('Error saving project: ' + err.message);
    }
  };

  const updateProjectStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'projects', id), { status });
    } catch (err) {
      console.error('Error updating project status:', err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error('Error deleting project:', err.message);
    }
  };

  const reorderProjects = async (newProjectsList) => {
    setProjects(newProjectsList);
    try {
      const updates = newProjectsList.map((p, index) => ({
        ...p,
        priority: index,
      }));
      for (const p of updates) {
        await updateDoc(doc(db, 'projects', p.id), { priority: p.priority });
      }
    } catch (err) {
      console.error('Error updating project priorities:', err.message);
    }
  };

  const [citizenSubTab, setCitizenSubTab] = useState('submit');

  const reportQualityIssue = async (grievanceId, description, reportedBy) => {
    const report = {
      id: `QR-${Date.now()}`,
      date: new Date().toISOString(),
      description,
      reportedBy,
      status: 'open',
    };
    try {
      await updateDoc(doc(db, 'grievances', grievanceId), {
        qualityReports: arrayUnion(report),
      });
    } catch (err) {
      console.error('Error reporting quality issue:', err.message);
    }
  };

  const supportGrievance = async (grievanceId, userId) => {
    try {
      await updateDoc(doc(db, 'grievances', grievanceId), {
        supportCount: increment(1),
        supporters: arrayUnion(userId),
      });
    } catch (err) {
      console.error('Error supporting grievance:', err.message);
    }
  };

  const resolveQualityReport = async (grievanceId, reportId) => {
    const grievance = grievances.find((g) => g.id === grievanceId);
    if (!grievance) return;
    const updatedReports = (grievance.qualityReports || []).map((r) =>
      r.id === reportId ? { ...r, status: 'closed' } : r
    );
    try {
      await updateDoc(doc(db, 'grievances', grievanceId), {
        qualityReports: updatedReports,
      });
    } catch (err) {
      console.error('Error resolving quality report:', err.message);
    }
  };

  const triggerSimulatorEvent = (eventType) => {
    let newTickets = [];

    if (eventType === 'monsoon') {
      newTickets = [
        {
          title: 'Severe Street Flooding at Subway',
          description: 'Rainwater has fully flooded the subway bypass. Vehicles stalled, causing 3km long traffic gridlock.',
          translatedDescription: 'Severe Street Flooding at Subway',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Infrastructure',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { lat: 20.3, lng: 85.83 },
          impact: '400+ daily commuters'
        },
        {
          title: 'Roof Collapse Risk in Old Slum Area',
          description: 'Heavy rains have damaged the support beams of the community center roof. Water leaking from electrical boxes.',
          translatedDescription: 'Roof Collapse Risk in Old Slum Area',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Sanitation',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { lat: 20.28, lng: 85.85 },
          impact: '20 families'
        },
        {
          title: 'Sewer Line Backed Up & Gushing Water',
          description: 'Main drainage pipe near markets overflowing. Raw sewage flooding shop entrances.',
          translatedDescription: 'Sewer Line Backed Up & Gushing Water',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Sanitation',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { lat: 20.31, lng: 85.82 },
          impact: '50 shops'
        }
      ];
    } else if (eventType === 'water_failure') {
      newTickets = [
        {
          title: 'Water Treatment Plant Valve Malfunction',
          description: 'No supply in municipal lines since morning. Local vendors selling water tanks at double prices.',
          translatedDescription: 'Water Treatment Plant Valve Malfunction',
          reporter: 'Simulated Citizen (Water Crisis)',
          sector: 'Water Supply',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { lat: 20.29, lng: 85.81 },
          impact: 'Entire industrial housing'
        },
        {
          title: 'Turbid Water Coming Out of Taps',
          description: 'Water has black particles and high chlorine smell. Unusable for drinking or cooking.',
          translatedDescription: 'Turbid Water Coming Out of Taps',
          reporter: 'Simulated Citizen (Water Crisis)',
          sector: 'Water Supply',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { lat: 20.32, lng: 85.84 },
          impact: '90 households'
        }
      ];
    } else if (eventType === 'elections') {
      newTickets = [
        {
          title: 'Demand for Youth Skills Center',
          description: 'Elections are near and we need a local skill center for unemployed graduates in Ward C.',
          translatedDescription: 'Demand for Youth Skills Center',
          reporter: 'Community Representative',
          sector: 'Infrastructure',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { lat: 20.27, lng: 85.83 },
          impact: '500+ youth'
        },
        {
          title: 'Demand for Community Clinic Extension',
          description: 'Request for expanding hospital hours to 24/7 due to rising constituency population.',
          translatedDescription: 'Request for expanding hospital hours to 24/7 due to rising constituency population.',
          reporter: 'Panchayat Chief',
          sector: 'Public Health',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { lat: 20.3, lng: 85.86 },
          impact: '2000+ residents'
        }
      ];
    }

    newTickets.forEach((t) => addGrievance(t));
  };

  const budgetCap = 100;
  const currentBudgetUsed = projects
    .filter((p) => p.status !== 'deleted')
    .reduce((sum, p) => sum + (p.cost || 0), 0);

  return (
    <AppContext.Provider
      value={{
        grievances,
        projects,
        selectedUrgency,
        setSelectedUrgency,
        selectedSector,
        setSelectedSector,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        geminiApiKey,
        setGeminiApiKey,
        isLoggedIn,
        user,
        handleLogin,
        signInWithGoogle,
        handleLogout,
        budgetCap,
        currentBudgetUsed,
        addGrievance,
        updateGrievanceStatus,
        addProject,
        updateProjectStatus,
        deleteProject,
        reorderProjects,
        triggerSimulatorEvent,
        citizenSubTab,
        setCitizenSubTab,
        reportQualityIssue,
        supportGrievance,
        resolveQualityReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
