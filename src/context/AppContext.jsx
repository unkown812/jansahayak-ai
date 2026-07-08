import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabase/supabaseClient';

const AppContext = createContext();

const initialGrievances = [];
const initialProjects = [];

export const AppProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch Grievances and Projects from Supabase on Load
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const { data, error } = await supabase
          .from('grievances')
          .select('*')
          .order('timestamp', { ascending: false });
        if (error) throw error;
        const mapped = (data || []).map(g => ({
          ...g,
          translatedDescription: g.translated_description || g.description
        }));
        setGrievances(mapped);
      } catch (err) {
        console.error('Error fetching grievances:', err.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('priority', { ascending: true });
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err.message);
      }
    };

    fetchGrievances();
    fetchProjects();
  }, []);

  
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'about', 'mp', or 'citizen'
  
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(() => {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || localStorage.getItem('google_maps_api_key') || '';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Monitor Supabase session and auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (username, password) => {
    // Keep as a simulator fallback
    setIsLoggedIn(true);
    return true;
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error signing in with Google:', err.message);
      alert('Authentication error: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  };

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

  // Action Handlers
  const addGrievance = async (newTicket) => {
    try {
      const dbTicket = {
        id: newTicket.id,
        title: newTicket.title,
        description: newTicket.description,
        translated_description: newTicket.translatedDescription || newTicket.description,
        reporter: newTicket.reporter,
        sector: newTicket.sector,
        urgency: newTicket.urgency,
        status: newTicket.status,
        coordinates: newTicket.coordinates,
        timestamp: newTicket.timestamp,
        impact: newTicket.impact
      };
      const { error } = await supabase
        .from('grievances')
        .insert([dbTicket]);
      if (error) throw error;
      setGrievances((prev) => [newTicket, ...prev]);
    } catch (err) {
      console.error('Error adding grievance:', err.message);
      alert('Error saving grievance to database: ' + err.message);
    }
  };

  const updateGrievanceStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('grievances')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setGrievances((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status } : g))
      );
    } catch (err) {
      console.error('Error updating grievance status:', err.message);
    }
  };

  const addProject = async (newProj) => {
    try {
      const nextPriority = projects.length;
      const projectWithPriority = { ...newProj, priority: nextPriority };
      const { error } = await supabase
        .from('projects')
        .insert([projectWithPriority]);
      if (error) throw error;
      setProjects((prev) => [...prev, projectWithPriority]);
    } catch (err) {
      console.error('Error adding project:', err.message);
      alert('Error saving project to database: ' + err.message);
    }
  };

  const updateProjectStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error('Error updating project status:', err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err.message);
    }
  };

  const reorderProjects = async (newProjectsList) => {
    setProjects(newProjectsList);
    try {
      const updates = newProjectsList.map((p, index) => ({
        ...p,
        priority: index
      }));
      const { error } = await supabase
        .from('projects')
        .upsert(updates);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating project priorities:', err.message);
    }
  };

  // Event Simulator Trigger
  const triggerSimulatorEvent = (eventType) => {
    const nowStr = new Date().toISOString();
    let newTickets = [];

    if (eventType === 'monsoon') {
      newTickets = [
        {
          id: `LKD-${Date.now() + 1}`,
          title: 'Severe Street Flooding at Subway',
          description: 'Rainwater has fully flooded the subway bypass. Vehicles stalled, causing 3km long traffic gridlock.',
          translatedDescription: 'Severe Street Flooding at Subway',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Infrastructure',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { x: 55, y: 52 },
          timestamp: nowStr,
          impact: '400+ daily commuters'
        },
        {
          id: `LKD-${Date.now() + 2}`,
          title: 'Roof Collapse Risk in Old Slum Area',
          description: 'Heavy rains have damaged the support beams of the community center roof. Water leaking from electrical boxes.',
          translatedDescription: 'Roof Collapse Risk in Old Slum Area',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Sanitation',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { x: 38, y: 76 },
          timestamp: nowStr,
          impact: '20 families'
        },
        {
          id: `LKD-${Date.now() + 3}`,
          title: 'Sewer Line Backed Up & Gushing Water',
          description: 'Main drainage pipe near markets overflowing. Raw sewage flooding shop entrances.',
          translatedDescription: 'Sewer Line Backed Up & Gushing Water',
          reporter: 'Simulated Citizen (Monsoon)',
          sector: 'Sanitation',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { x: 48, y: 50 },
          timestamp: nowStr,
          impact: '50 shops'
        }
      ];
    } else if (eventType === 'water_failure') {
      newTickets = [
        {
          id: `LKD-${Date.now() + 1}`,
          title: 'Water Treatment Plant Valve Malfunction',
          description: 'No supply in municipal lines since morning. Local vendors selling water tanks at double prices.',
          translatedDescription: 'Water Treatment Plant Valve Malfunction',
          reporter: 'Simulated Citizen (Water Crisis)',
          sector: 'Water Supply',
          urgency: 'Critical',
          status: 'Pending',
          coordinates: { x: 26, y: 38 },
          timestamp: nowStr,
          impact: 'Entire industrial housing'
        },
        {
          id: `LKD-${Date.now() + 2}`,
          title: 'Turbid Water Coming Out of Taps',
          description: 'Water has black particles and high chlorine smell. Unusable for drinking or cooking.',
          translatedDescription: 'Turbid Water Coming Out of Taps',
          reporter: 'Simulated Citizen (Water Crisis)',
          sector: 'Water Supply',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { x: 78, y: 22 },
          timestamp: nowStr,
          impact: '90 households'
        }
      ];
    } else if (eventType === 'elections') {
      newTickets = [
        {
          id: `LKD-${Date.now() + 1}`,
          title: 'Demand for Youth Skills Center',
          description: 'Elections are near and we need a local skill center for unemployed graduates in Ward C.',
          translatedDescription: 'Demand for Youth Skills Center',
          reporter: 'Community Representative',
          sector: 'Infrastructure',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { x: 70, y: 60 },
          timestamp: nowStr,
          impact: '500+ youth'
        },
        {
          id: `LKD-${Date.now() + 2}`,
          title: 'Demand for Community Clinic Extension',
          description: 'Request for expanding hospital hours to 24/7 due to rising constituency population.',
          translatedDescription: 'Request for expanding hospital hours to 24/7 due to rising constituency population.',
          reporter: 'Panchayat Chief',
          sector: 'Public Health',
          urgency: 'Medium',
          status: 'Pending',
          coordinates: { x: 74, y: 64 },
          timestamp: nowStr,
          impact: '2000+ residents'
        }
      ];
    }

    setGrievances((prev) => [...newTickets, ...prev]);
  };

  // Helper values
  const budgetCap = 100; // ₹1.0Cr = 100 Lakhs
  const currentBudgetUsed = projects
    .filter((p) => p.status !== 'deleted')
    .reduce((sum, p) => sum + p.cost, 0);

  return (
    <AppContext.Provider
      value={{
        grievances,
        setGrievances,
        projects,
        setProjects,

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
        googleMapsApiKey,
        setGoogleMapsApiKey,
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
        triggerSimulatorEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
