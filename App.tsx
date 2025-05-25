
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StorePortal } from './components/StorePortal';
import { FootmanDashboard } from './components/FootmanDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { AuthPage } from './components/AuthPage'; // New Auth Page
import { UserRole, Order, DeliveryAgent, AppContextType, OrderStatus, OrderUrgency, ConfirmationDetails, User, LoginCredentials, SignupCredentials } from './types';
import { 
  DEFAULT_STORE_ID, DEFAULT_STORE_NAME, 
  PAYOUT_FOOTMAN_CONSOLIDATION_KES, 
  UBER_ESTIMATE_BASE_KES, UBER_ESTIMATE_PER_KM_KES, BLITZ_DISCOUNT_PERCENTAGE, AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST,
  URGENCY_PAYOUT_NORMAL_KES, URGENCY_PAYOUT_URGENT_KES, URGENCY_PAYOUT_ASAP_KES
} from './constants';

// Initial Data (Mock) - Add 'password' for simulation
const initialFootmen: DeliveryAgent[] = [
  { id: 'footman1', name: 'Faruq Adebayo', role: UserRole.FOOTMAN, tasksCompleted: 0, totalGrossEarnings: 0, phone: '0712345001', password: 'password' },
  { id: 'footman2', name: 'Aisha Nkosi', role: UserRole.FOOTMAN, tasksCompleted: 0, totalGrossEarnings: 0, phone: '0712345002', password: 'password' },
];

const initialRiders: DeliveryAgent[] = [
  { id: 'rider1', name: 'Kwame Mensah', role: UserRole.RIDER, tasksCompleted: 0, totalGrossEarnings: 0, phone: '0712345003', password: 'password' },
  { id: 'rider2', name: 'Fatima Diallo', role: UserRole.RIDER, tasksCompleted: 0, totalGrossEarnings: 0, phone: '0712345004', password: 'password' },
];

const initialStoreUsers: User[] = [
    { id: DEFAULT_STORE_ID, name: DEFAULT_STORE_NAME, role: UserRole.STORE, phone: '0712345000', password: 'password' }
];

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [footmen, setFootmen] = useState<DeliveryAgent[]>(initialFootmen);
  const [riders, setRiders] = useState<DeliveryAgent[]>(initialRiders);
  const [storeUsers, setStoreUsers] = useState<User[]>(initialStoreUsers);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUserState] = useState<User | DeliveryAgent | null>(null);
  const [currentRole, setCurrentRoleState] = useState<UserRole | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark or load from localStorage

  // Theme initialization and persistence
  useEffect(() => {
    const storedTheme = localStorage.getItem('blitzTheme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Fallback to system preference if no theme is stored
      // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // setTheme(prefersDark ? 'dark' : 'light');
      // Forcing dark as initial if nothing stored for this app's context
       setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('blitzTheme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);


  // Simulate initial orders loading
  useEffect(() => {
    const now = Date.now();
    const demoOrders: Order[] = [
      { id: 'batchTest001', storeId: DEFAULT_STORE_ID, description: 'Batch Item A: Perishable Groceries', destination: 'Kilimani Greens Apt 10A', urgency: OrderUrgency.URGENT, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 1), lastUpdated: new Date(now - 3600000 * 1), weight: 'Medium', isFragile: true, payout: URGENCY_PAYOUT_URGENT_KES, calculatedCost: URGENCY_PAYOUT_URGENT_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, itemPhotoFileName: "groceries_A.jpg" },
      { id: 'batchTest002', storeId: DEFAULT_STORE_ID, description: 'Batch Item B: Electronics Charger', destination: 'Upper Hill Business Center, Office 2', urgency: OrderUrgency.NORMAL, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 1.5), lastUpdated: new Date(now - 3600000 * 1.5), weight: 'Small', payout: URGENCY_PAYOUT_NORMAL_KES, calculatedCost: URGENCY_PAYOUT_NORMAL_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, distanceKm: 5 },
      { id: 'batchTest003', storeId: DEFAULT_STORE_ID, description: 'Batch Item C: Book Collection', destination: 'Lavington Mall, Bookstore Kiosk', urgency: OrderUrgency.NORMAL, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 2), lastUpdated: new Date(now - 3600000 * 2), weight: 'Large', payout: URGENCY_PAYOUT_NORMAL_KES, calculatedCost: URGENCY_PAYOUT_NORMAL_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, itemPhotoFileName: "books_C.jpg" },
      { id: 'batchTest004', storeId: DEFAULT_STORE_ID, description: 'Batch Item D: Small Art Piece', destination: 'Karen Plains, House 4D', urgency: OrderUrgency.ASAP, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 0.5), lastUpdated: new Date(now - 3600000 * 0.5), weight: 'Small', isFragile: true, payout: URGENCY_PAYOUT_ASAP_KES, calculatedCost: URGENCY_PAYOUT_ASAP_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST },
      { id: 'demo001', storeId: DEFAULT_STORE_ID, description: 'Urgent Legal Docs', destination: 'CBD Tower, 5th Floor', urgency: OrderUrgency.ASAP, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 3), lastUpdated: new Date(now - 3600000 * 3), weight: 'Small', isFragile: true, payout: URGENCY_PAYOUT_ASAP_KES, calculatedCost: URGENCY_PAYOUT_ASAP_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, itemPhotoFileName: "docs_pic.jpg" },
      { id: 'demo002', storeId: DEFAULT_STORE_ID, description: 'Craft Supplies Box', destination: 'Westgate Mall, Shop 12', urgency: OrderUrgency.NORMAL, status: OrderStatus.PENDING_PICKUP, postedAt: new Date(now - 3600000 * 5), lastUpdated: new Date(now - 3600000 * 5), weight: 'Medium', payout: URGENCY_PAYOUT_NORMAL_KES, calculatedCost: URGENCY_PAYOUT_NORMAL_KES / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, distanceKm: 8 },
    ];
    setOrders(demoOrders);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const { identifier } = credentials;
    const simulatedPassword = "password"; 

    let foundUser: User | DeliveryAgent | undefined = storeUsers.find(u => u.name === identifier && u.password === simulatedPassword);
    if (!foundUser) {
      foundUser = footmen.find(f => f.name === identifier && f.password === simulatedPassword);
    }
    if (!foundUser) {
      foundUser = riders.find(r => r.name === identifier && r.password === simulatedPassword);
    }

    if (foundUser) {
      setCurrentUserState(foundUser);
      setCurrentRoleState(foundUser.role);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [storeUsers, footmen, riders]);

  const signup = useCallback(async (credentials: SignupCredentials): Promise<boolean> => {
    const { name, phone, password, role } = credentials;
    const newId = `user_${Date.now()}_${Math.random().toString(16).slice(2,8)}`;
    
    if (role === UserRole.STORE) {
      const newStoreUser: User = { id: newId, name, phone, password, role };
      setStoreUsers(prev => [...prev, newStoreUser]);
      setCurrentUserState(newStoreUser);
    } else if (role === UserRole.FOOTMAN) {
      const newFootman: DeliveryAgent = { id: newId, name, phone, password, role, tasksCompleted: 0, totalGrossEarnings: 0 };
      setFootmen(prev => [...prev, newFootman]);
      setCurrentUserState(newFootman);
    } else if (role === UserRole.RIDER) {
      const newRider: DeliveryAgent = { id: newId, name, phone, password, role, tasksCompleted: 0, totalGrossEarnings: 0 };
      setRiders(prev => [...prev, newRider]);
      setCurrentUserState(newRider);
    } else {
        return false;
    }
    
    setCurrentRoleState(role);
    setIsAuthenticated(true);
    return true;
  }, []); // Removed storeUsers, footmen, riders from deps as they are updated within

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUserState(null);
    setCurrentRoleState(null);
  }, []);


  const updateAgentEarnings = (agentId: string, role: UserRole.FOOTMAN | UserRole.RIDER, payout: number) => {
    const updater = (prevAgents: DeliveryAgent[]) =>
      prevAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, tasksCompleted: agent.tasksCompleted + 1, totalGrossEarnings: agent.totalGrossEarnings + payout }
          : agent
      );
    if (role === UserRole.FOOTMAN) setFootmen(updater);
    if (role === UserRole.RIDER) setRiders(updater);
  };

  const postOrder = useCallback((orderData: Omit<Order, 'id' | 'status' | 'postedAt' | 'lastUpdated' | 'payout' | 'calculatedCost'> & { storeId: string }) => {
    if (!currentUser || currentUser.role !== UserRole.STORE) {
        alert("Only logged-in stores can post orders.");
        return;
    }
    let customerCost = 0;
    let agentPayout = 0;

    if (orderData.distanceKm && orderData.distanceKm > 0) {
        const uberEquivalentCost = UBER_ESTIMATE_BASE_KES + (UBER_ESTIMATE_PER_KM_KES * orderData.distanceKm);
        customerCost = uberEquivalentCost * (1 - BLITZ_DISCOUNT_PERCENTAGE);
        agentPayout = customerCost * AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST;
    } else {
        switch(orderData.urgency) {
            case OrderUrgency.ASAP: agentPayout = URGENCY_PAYOUT_ASAP_KES; break;
            case OrderUrgency.URGENT: agentPayout = URGENCY_PAYOUT_URGENT_KES; break;
            default: agentPayout = URGENCY_PAYOUT_NORMAL_KES; break;
        }
        customerCost = agentPayout / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST; 
    }

    const newOrder: Order = {
      ...orderData,
      storeId: currentUser.id,
      id: `order_${Date.now()}_${Math.random().toString(16).slice(2,8)}`,
      status: OrderStatus.PENDING_PICKUP,
      postedAt: new Date(),
      lastUpdated: new Date(),
      payout: parseFloat(agentPayout.toFixed(2)),
      calculatedCost: parseFloat(customerCost.toFixed(2)),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  }, [currentUser]);

  const claimOrderByFootman = useCallback((orderId: string, footmanId: string) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.status === OrderStatus.PENDING_PICKUP
        ? { ...order, status: OrderStatus.CLAIMED_BY_FOOTMAN, footmanId, assignedTo: footmanId, lastUpdated: new Date() }
        : order
    ));
  }, []);

  const shareOrderWithRiders = useCallback((orderIds: string[], footmanId: string, confirmation: ConfirmationDetails) => {
    updateAgentEarnings(footmanId, UserRole.FOOTMAN, PAYOUT_FOOTMAN_CONSOLIDATION_KES * orderIds.length); 
    
    setOrders(prevOrders => prevOrders.map(order => {
      if (orderIds.includes(order.id) && order.footmanId === footmanId && order.status === OrderStatus.CLAIMED_BY_FOOTMAN) {
        const riderPayout = order.payout - PAYOUT_FOOTMAN_CONSOLIDATION_KES;
        return { 
            ...order, 
            status: OrderStatus.SHARED_WITH_RIDERS, 
            pickupConfirmation: confirmation, 
            sharedByFootmanAt: new Date(), 
            assignedTo: undefined, 
            lastUpdated: new Date(),
            payout: parseFloat(riderPayout.toFixed(2))
        };
      }
      return order;
    }));
  }, []);

  const deliverOrderByFootman = useCallback((orderId: string, footmanId: string, confirmation: ConfirmationDetails) => {
    const orderToDeliver = orders.find(o => o.id === orderId);
    if (orderToDeliver) {
        updateAgentEarnings(footmanId, UserRole.FOOTMAN, orderToDeliver.payout); 
    }
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.footmanId === footmanId && order.status === OrderStatus.CLAIMED_BY_FOOTMAN
        ? { ...order, status: OrderStatus.DELIVERED, deliveryConfirmation: confirmation, deliveredAt: new Date(), assignedTo: footmanId, lastUpdated: new Date() }
        : order
    ));
  }, [orders]);

  const claimSharedOrderByRider = useCallback((orderId: string, riderId: string) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.status === OrderStatus.SHARED_WITH_RIDERS
        ? { ...order, status: OrderStatus.CLAIMED_BY_RIDER, riderId, assignedTo: riderId, claimedByRiderAt: new Date(), lastUpdated: new Date() }
        : order
    ));
  }, []);

  const confirmRiderPickupFromAgent = useCallback((orderId: string, riderId: string, confirmation: ConfirmationDetails) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.riderId === riderId && order.status === OrderStatus.CLAIMED_BY_RIDER
        ? { ...order, status: OrderStatus.OUT_FOR_DELIVERY, 
            pickupConfirmation: confirmation, 
            lastUpdated: new Date() 
          }
        : order
    ));
  }, []);
  
  const deliverOrderByRider = useCallback((orderId: string, riderId: string, confirmation: ConfirmationDetails) => {
    const orderToDeliver = orders.find(o => o.id === orderId);
     if (orderToDeliver) {
        updateAgentEarnings(riderId, UserRole.RIDER, orderToDeliver.payout); 
    }
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.riderId === riderId && (order.status === OrderStatus.CLAIMED_BY_RIDER || order.status === OrderStatus.OUT_FOR_DELIVERY)
        ? { ...order, status: OrderStatus.DELIVERED, deliveryConfirmation: confirmation, deliveredAt: new Date(), assignedTo: riderId, lastUpdated: new Date() }
        : order
    ));
  }, [orders]);

  const contextValue: AppContextType = {
    orders, footmen, riders, currentUser, currentRole, isAuthenticated, theme,
    login, signup, logout, toggleTheme,
    postOrder, claimOrderByFootman, shareOrderWithRiders,
    deliverOrderByFootman, claimSharedOrderByRider, confirmRiderPickupFromAgent, deliverOrderByRider
  };

  const renderCurrentView = () => {
    if (!isAuthenticated || !currentRole) {
        return <AuthPage />;
    }
    switch (currentRole) {
      case UserRole.STORE:
        return <StorePortal />;
      case UserRole.FOOTMAN:
        return currentUser ? <FootmanDashboard /> : <p className="text-center text-gray-400 dark:text-gray-500 p-4">Error: Footman data not loaded.</p>;
      case UserRole.RIDER:
        return currentUser ? <RiderDashboard /> : <p className="text-center text-gray-400 dark:text-gray-500 p-4">Error: Rider data not loaded.</p>;
      default:
        return <p className="text-center text-gray-400 dark:text-gray-500 p-4">Invalid role selected.</p>;
    }
  };

  if (!isAuthenticated) {
    return (
      <AppContext.Provider value={contextValue}>
        <AuthPage />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-blitzLight-bg dark:bg-blitzGray-darker text-blitzLight-text dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {renderCurrentView()}
            
            {(currentRole === UserRole.FOOTMAN || currentRole === UserRole.RIDER) && (
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LeaderboardView agents={footmen} title="🏆 Top Footmen" />
                <LeaderboardView agents={riders} title="🏆 Top Riders" />
              </div>
            )}
          </div>
        </main>
        <footer className="bg-blitzLight-card dark:bg-blitzBlack text-center p-4 text-sm text-blitzLight-subtleText dark:text-gray-500 border-t border-blitzLight-border dark:border-blitzGray-dark">
            Blitz Delivery MVP &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </AppContext.Provider>
  );
};

export default App;