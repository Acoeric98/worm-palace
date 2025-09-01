import { useState } from 'react';
import { useGameData } from '../hooks/useGameData';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';
import { TrainingRoom } from '../components/TrainingRoom';
import { JobBoard } from '../components/JobBoard';
import { SetupForm } from '../components/SetupForm';
import { ProfileEditor } from '../components/ProfileEditor';
import { Shop } from '../components/Shop';
import { Inventory } from '../components/Inventory';

type Page = 'dashboard' | 'training' | 'jobs' | 'profile' | 'shop' | 'inventory';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const {
    gameState,
    createUserAndWorm,
    executeTrain,
    acceptJob,
    completeJob,
    updateWormProfile,
    isTrainingAvailable,
    getTrainingCooldown,
    buyItem,
    useItem,
    equipItem,
    unequipItem,
    getTotalStats,
    isLoggedIn
  } = useGameData();

  // If no user/worm exists, show setup form
  if (!isLoggedIn) {
    return <SetupForm onCreateWorm={createUserAndWorm} />;
  }

  const { user, worm, trainings, jobs, jobAssignments, inventory, shopItems } = gameState;
  
  if (!worm) {
    return <SetupForm onCreateWorm={createUserAndWorm} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            worm={worm}
            assignments={jobAssignments}
            jobs={jobs}
            onNavigate={setCurrentPage}
            onCompleteJob={completeJob}
          />
        );
      
      case 'training':
        return (
          <TrainingRoom 
            trainings={trainings}
            worm={worm}
            onTrain={executeTrain}
            isTrainingAvailable={isTrainingAvailable}
            getTrainingCooldown={getTrainingCooldown}
          />
        );
      
      case 'jobs':
        return (
          <JobBoard 
            jobs={jobs}
            assignments={jobAssignments}
            worm={worm}
            onAcceptJob={acceptJob}
            onCompleteJob={completeJob}
          />
        );
      
      case 'profile':
        return (
          <ProfileEditor 
            user={user!}
            worm={worm}
            onUpdateProfile={updateWormProfile}
          />
        );
      
      case 'shop':
        return (
          <Shop 
            items={shopItems}
            worm={worm}
            onBuyItem={buyItem}
          />
        );
      
      case 'inventory':
        return (
          <Inventory 
            inventory={inventory}
            items={shopItems}
            worm={worm}
            onUseItem={useItem}
            onEquipItem={equipItem}
            onUnequipItem={unequipItem}
            getTotalStats={getTotalStats}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      <div className="container mx-auto p-4 space-y-6">
        <Navigation 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          coins={worm.coins}
        />
        
        <main className="pb-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
