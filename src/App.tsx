import React, { useState, useEffect } from 'react';
import { Navigation, PageId } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { BriefingModal } from './components/BriefingModal';
import { AddPlantModal } from './components/AddPlantModal';
import { LogSensorModal } from './components/LogSensorModal';
import { PlantDetailDrawer } from './components/PlantDetailDrawer';

import { OverviewPage } from './pages/OverviewPage';
import { PlantsPage } from './pages/PlantsPage';
import { SensorsPage } from './pages/SensorsPage';
import { ScannerPage } from './pages/ScannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { ImageLabPage } from './pages/ImageLabPage';
import { CCTVPage } from './pages/CCTVPage';
import { ResearchPage } from './pages/ResearchPage';
import { SettingsPage } from './pages/SettingsPage';

import {
  getPlants,
  savePlant,
  deletePlant,
  getSensorReadings,
  addSensorReading,
  deleteSensorReading,
  getImageAssessments,
  addImageAssessment,
  getResearchNotes,
  addResearchNote,
  getCalibrationSettings,
  saveCalibrationSettings,
  loadReferenceDataset,
} from './services/storage';
import { Plant, SensorReading, ImageAssessment, ResearchNote, CalibrationSettings } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Core Data State
  const [plants, setPlants] = useState<Plant[]>([]);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [assessments, setAssessments] = useState<ImageAssessment[]>([]);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [settings, setSettings] = useState<CalibrationSettings>(getCalibrationSettings());

  // Modal / Drawer State
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isLogSensorOpen, setIsLogSensorOpen] = useState(false);
  const [selectedPlantForSensor, setSelectedPlantForSensor] = useState<string | undefined>(undefined);
  const [selectedPlantForDrawer, setSelectedPlantForDrawer] = useState<Plant | null>(null);
  const [preselectedPlantIdForScanner, setPreselectedPlantIdForScanner] = useState<string | undefined>(undefined);

  // Sync data on mount
  const refreshData = () => {
    setPlants(getPlants());
    setSensorReadings(getSensorReadings());
    setAssessments(getImageAssessments());
    setResearchNotes(getResearchNotes());
    setSettings(getCalibrationSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleSavePlant = (plant: Plant) => {
    savePlant(plant);
    refreshData();
  };

  const handleDeletePlant = (id: string) => {
    deletePlant(id);
    refreshData();
    if (selectedPlantForDrawer?.id === id) {
      setSelectedPlantForDrawer(null);
    }
  };

  const handleSaveReading = (reading: Omit<SensorReading, 'id' | 'vpd'>) => {
    addSensorReading(reading);
    refreshData();
  };

  const handleDeleteReading = (id: string) => {
    deleteSensorReading(id);
    refreshData();
  };

  const handleSaveAssessment = (assessment: ImageAssessment) => {
    addImageAssessment(assessment);
    refreshData();
  };

  const handleAddResearchNote = (note: Omit<ResearchNote, 'id' | 'date'>) => {
    addResearchNote(note);
    refreshData();
  };

  const handleSaveSettings = (newSettings: CalibrationSettings) => {
    saveCalibrationSettings(newSettings);
    setSettings(newSettings);
  };

  const handleLoadReferenceCohort = () => {
    loadReferenceDataset();
    refreshData();
  };

  const handleOpenScannerWithPlant = (plantId?: string) => {
    setPreselectedPlantIdForScanner(plantId);
    setCurrentPage('scanner');
    setSelectedPlantForDrawer(null);
  };

  const handleOpenLogSensorWithPlant = (plantId?: string) => {
    setSelectedPlantForSensor(plantId);
    setIsLogSensorOpen(true);
    setSelectedPlantForDrawer(null);
  };

  return (
    <div className="flex h-screen bg-[#050e09] text-emerald-50 overflow-hidden font-sans bg-lab-grid">
      
      {/* Sidebar Navigation (Desktop) */}
      <Navigation
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          setIsMobileNavOpen(false);
        }}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        specimenCount={plants.length}
      />

      {/* Mobile Navigation Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#06140e] border-r border-emerald-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Navigation
              currentPage={currentPage}
              onSelectPage={(page) => {
                setCurrentPage(page);
                setIsMobileNavOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onOpenBriefing={() => {
                setIsBriefingOpen(true);
                setIsMobileNavOpen(false);
              }}
              specimenCount={plants.length}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Top Header Bar */}
        <TopBar
          currentPage={currentPage}
          plants={plants}
          onOpenAddPlant={() => setIsAddPlantOpen(true)}
          onOpenLogSensor={() => handleOpenLogSensorWithPlant()}
          onOpenScanner={() => handleOpenScannerWithPlant()}
          onOpenBriefing={() => setIsBriefingOpen(true)}
          onLoadReferenceData={handleLoadReferenceCohort}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentPage === 'overview' && (
            <OverviewPage
              plants={plants}
              sensorReadings={sensorReadings}
              assessments={assessments}
              onSelectPlant={(plant) => setSelectedPlantForDrawer(plant)}
              onOpenAddPlant={() => setIsAddPlantOpen(true)}
              onOpenLogSensor={() => handleOpenLogSensorWithPlant()}
              onOpenScanner={(id) => handleOpenScannerWithPlant(id)}
              onOpenBriefing={() => setIsBriefingOpen(true)}
              onLoadReferenceData={handleLoadReferenceCohort}
            />
          )}

          {currentPage === 'plants' && (
            <PlantsPage
              plants={plants}
              onSelectPlant={(plant) => setSelectedPlantForDrawer(plant)}
              onOpenAddPlant={() => setIsAddPlantOpen(true)}
              onOpenScanner={(id) => handleOpenScannerWithPlant(id)}
              onOpenLogSensor={(id) => handleOpenLogSensorWithPlant(id)}
              onLoadReferenceData={handleLoadReferenceCohort}
            />
          )}

          {currentPage === 'sensors' && (
            <SensorsPage
              plants={plants}
              sensorReadings={sensorReadings}
              onOpenLogSensor={(id) => handleOpenLogSensorWithPlant(id)}
              onDeleteReading={handleDeleteReading}
            />
          )}

          {currentPage === 'scanner' && (
            <ScannerPage
              plants={plants}
              preselectedPlantId={preselectedPlantIdForScanner}
              onSaveAssessment={handleSaveAssessment}
              onSelectPlant={(plant) => setSelectedPlantForDrawer(plant)}
              onOpenAddPlant={() => setIsAddPlantOpen(true)}
            />
          )}

          {currentPage === 'assistant' && <AssistantPage plants={plants} />}

          {currentPage === 'imagelab' && (
            <ImageLabPage plants={plants} assessments={assessments} />
          )}

          {currentPage === 'cctv' && <CCTVPage />}

          {currentPage === 'research' && (
            <ResearchPage
              plants={plants}
              researchNotes={researchNotes}
              onAddNote={handleAddResearchNote}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onDataReset={refreshData}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <BriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onSave={handleSavePlant}
      />

      <LogSensorModal
        isOpen={isLogSensorOpen}
        plants={plants}
        selectedPlantId={selectedPlantForSensor}
        onClose={() => {
          setIsLogSensorOpen(false);
          setSelectedPlantForSensor(undefined);
        }}
        onSave={handleSaveReading}
      />

      <PlantDetailDrawer
        plant={selectedPlantForDrawer}
        sensorReadings={sensorReadings}
        assessments={assessments}
        onClose={() => setSelectedPlantForDrawer(null)}
        onOpenScanner={(id) => handleOpenScannerWithPlant(id)}
        onOpenLogSensor={(id) => handleOpenLogSensorWithPlant(id)}
        onDeletePlant={handleDeletePlant}
      />

    </div>
  );
}
