/**
 * ROSXY: THE CYBERVERSE
 * Learn to Code. Play to Win. Think Like a Hacker.
 */

import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { LanguageDashboardModal } from './components/LanguageDashboardModal';
import { Cyberverse3D } from './components/Cyberverse3D';
import { HudAndDock } from './components/HudAndDock';
import { CodePlaygroundModal } from './components/CodePlaygroundModal';
import { BossBattleArena } from './components/BossBattleArena';
import { TerminalSimulator } from './components/TerminalSimulator';
import { PhishingEmailInspector, NetworkPacketRouter } from './components/CyberMinigames';
import { CharacterCreator } from './components/CharacterCreator';
import { IntroCutscene } from './components/IntroCutscene';
import { WorldMapModal } from './components/WorldMapModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { MissionsListModal } from './components/MissionsListModal';
import { ByteCompanion } from './components/ByteCompanion';

import { CODE_MISSIONS } from './data/curriculum';
import { CYBER_DISTRICTS } from './data/districts';
import { LANGUAGE_CATALOG } from './data/languages';
import { 
  CodeMission, 
  DistrictId, 
  PlayerStats, 
  CyberRole, 
  PlayerCustomization,
  LanguageId,
  LanguageTrackInfo
} from './types/game';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'rosxy_cyberverse_save_v2';

const defaultPlayer: PlayerStats = {
  name: 'Cyber Guardian',
  handle: 'ZeroCool',
  role: 'Code Architect',
  level: 1,
  xp: 120,
  xpToNextLevel: 300,
  credits: 150,
  energy: 5,
  maxEnergy: 5,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedDistricts: ['neon-academy', 'python-port', 'linux-underground', 'cyber-defense'],
  currentDistrict: 'neon-academy',
  completedMissions: [],
  defeatedBosses: [],
  recentLanguage: 'python',
  pinnedLanguages: ['python', 'javascript', 'cybersecurity'],
  languageProgress: {
    python: { completedCount: 0, currentLevel: 1, xp: 0 },
    c: { completedCount: 0, currentLevel: 1, xp: 0 },
    javascript: { completedCount: 0, currentLevel: 1, xp: 0 },
    cybersecurity: { completedCount: 0, currentLevel: 1, xp: 0 },
  },
  customization: {
    suitColor: '#1e293b',
    visorColor: '#00f3ff',
    accentColor: '#ff007f',
    cyberware: 'Neural Deck',
    avatarIcon: 'guardian-core',
  },
  inventory: [
    {
      id: 'default-deck',
      name: 'Cyberdeck Mk.1',
      type: 'tool',
      rarity: 'Common',
      description: 'Standard issue neural interface for compiling Python and Bash.',
      equipped: true,
    },
  ],
  unlockedSkills: ['skill-prog-1', 'skill-sec-1'],
};

export default function App() {
  const [player, setPlayer] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return defaultPlayer;
  });

  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(() => {
    return localStorage.getItem('rosxy_intro_seen') === 'true';
  });

  // Navigation mode: 'home' or 'cyberverse'
  const [viewMode, setViewMode] = useState<'home' | 'cyberverse'>('home');
  const [isSettingUpChar, setIsSettingUpChar] = useState<boolean>(false);

  // Active Modals State
  const [activeMission, setActiveMission] = useState<CodeMission | null>(null);
  const [selectedLanguageForDashboard, setSelectedLanguageForDashboard] = useState<LanguageTrackInfo | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [activeBossDistrict, setActiveBossDistrict] = useState<string | null>(null);
  const [showTerminalSim, setShowTerminalSim] = useState(false);
  const [showPhishingDrill, setShowPhishingDrill] = useState(false);
  const [showNetworkRouter, setShowNetworkRouter] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {}
  }, [player]);

  // Check and update streaks on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (player.lastActiveDate !== today) {
      const last = new Date(player.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        setPlayer((prev) => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: today,
          energy: prev.maxEnergy,
        }));
      } else if (diffDays > 1) {
        setPlayer((prev) => ({
          ...prev,
          streakDays: 1,
          lastActiveDate: today,
          energy: prev.maxEnergy,
        }));
      }
    }
  }, [player.lastActiveDate]);

  // Helper: Find next recommended mission for a language
  const getNextMissionForLanguage = (langId: LanguageId): CodeMission => {
    const matching = CODE_MISSIONS.filter(
      (m) => m.language === langId || (langId === 'cybersecurity' && m.language === 'cyberdefense')
    );
    const uncompleted = matching.find((m) => !player.completedMissions?.includes(m.id));
    return uncompleted || matching[0] || CODE_MISSIONS[0];
  };

  // PLAY NOW button action (1 tap to learning!)
  const handlePlayNow = () => {
    const nextMission = getNextMissionForLanguage(player.recentLanguage || 'python');
    if (nextMission.type === 'terminal') {
      setShowTerminalSim(true);
    } else if (nextMission.type === 'phishing') {
      setShowPhishingDrill(true);
    } else if (nextMission.type === 'network-routing') {
      setShowNetworkRouter(true);
    } else {
      setActiveMission(nextMission);
    }
  };

  // Open Language Dashboard
  const handleOpenLanguageDashboard = (langId: LanguageId) => {
    const langInfo = LANGUAGE_CATALOG.find((l) => l.id === langId) || LANGUAGE_CATALOG[0];
    setSelectedLanguageForDashboard(langInfo);
    setPlayer((prev) => ({
      ...prev,
      recentLanguage: langId,
    }));
  };

  // Pin / Unpin language toggle
  const handleTogglePin = (langId: LanguageId) => {
    setPlayer((prev) => {
      const current = prev.pinnedLanguages || [];
      if (current.includes(langId)) {
        return {
          ...prev,
          pinnedLanguages: current.filter((id) => id !== langId),
        };
      } else {
        if (current.length >= 3) {
          // Replace first if at limit
          return {
            ...prev,
            pinnedLanguages: [...current.slice(1), langId],
          };
        }
        return {
          ...prev,
          pinnedLanguages: [...current, langId],
        };
      }
    });
  };

  // Persistent in-game language switcher handler
  const handleSwitchLanguageInEditor = (newLangId: LanguageId) => {
    sounds.playByteChirp();
    const nextMission = getNextMissionForLanguage(newLangId);
    setPlayer((prev) => ({
      ...prev,
      recentLanguage: newLangId,
    }));
    setActiveMission(nextMission);
  };

  // 3D Trigger interaction dispatcher
  const handle3DInteraction = (triggerId: string, triggerType: 'mission' | 'boss' | 'terminal' | 'npc') => {
    sounds.playTerminalClick();

    if (triggerType === 'boss') {
      const dist = CYBER_DISTRICTS.find((d) => d.id === player.currentDistrict) || CYBER_DISTRICTS[0];
      setActiveBossDistrict(dist.id);
      return;
    }

    if (triggerId === 'linux-ls-grep') {
      setShowTerminalSim(true);
      return;
    }

    if (triggerId === 'cyber-phishing-drill') {
      setShowPhishingDrill(true);
      return;
    }

    if (triggerId === 'network-routing-flow') {
      setShowNetworkRouter(true);
      return;
    }

    const mission = CODE_MISSIONS.find((m) => m.id === triggerId);
    if (mission) {
      setActiveMission(mission);
    } else {
      setShowMissionsModal(true);
    }
  };

  // Reward handler for completing missions
  const handleMissionComplete = (missionId: string, xpGained: number, creditsGained: number) => {
    setPlayer((prev) => {
      const newXp = prev.xp + xpGained;
      const leveledUp = newXp >= prev.level * prev.xpToNextLevel;
      const nextLevel = leveledUp ? prev.level + 1 : prev.level;

      if (leveledUp) {
        sounds.playSuccessFanfare();
      }

      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];

      // Update per-language separate progress
      const missionObj = CODE_MISSIONS.find((m) => m.id === missionId);
      const langKey = missionObj?.language || prev.recentLanguage;
      const currentProg = prev.languageProgress?.[langKey] || { completedCount: 0, currentLevel: 1, xp: 0 };
      const updatedProg = {
        ...prev.languageProgress,
        [langKey]: {
          completedCount: currentProg.completedCount + 1,
          currentLevel: Math.floor((currentProg.completedCount + 1) / 2) + 1,
          xp: currentProg.xp + xpGained,
        },
      };

      return {
        ...prev,
        xp: newXp,
        level: nextLevel,
        credits: prev.credits + creditsGained,
        completedMissions: completed,
        languageProgress: updatedProg,
      };
    });
  };

  // Victory handler for boss fights
  const handleBossVictory = (bossName: string, xpGained: number, creditsGained: number) => {
    setPlayer((prev) => {
      const defeated = prev.defeatedBosses.includes(bossName)
        ? prev.defeatedBosses
        : [...prev.defeatedBosses, bossName];

      const currDistIdx = CYBER_DISTRICTS.findIndex((d) => d.id === prev.currentDistrict);
      const nextDist = CYBER_DISTRICTS[currDistIdx + 1];
      const unlocked = (nextDist && !prev.unlockedDistricts.includes(nextDist.id))
        ? [...prev.unlockedDistricts, nextDist.id]
        : prev.unlockedDistricts;

      return {
        ...prev,
        xp: prev.xp + xpGained,
        credits: prev.credits + creditsGained,
        defeatedBosses: defeated,
        unlockedDistricts: unlocked,
      };
    });
  };

  // Skill unlock handler
  const handleUnlockSkill = (skillId: string, requiredXp: number) => {
    setPlayer((prev) => ({
      ...prev,
      unlockedSkills: [...(prev.unlockedSkills || []), skillId],
    }));
  };

  // Character customization save
  const handleSaveCharacter = (
    name: string,
    handle: string,
    role: CyberRole,
    customization: PlayerCustomization
  ) => {
    setPlayer((prev) => ({
      ...prev,
      name,
      handle,
      role,
      customization,
    }));
    setIsSettingUpChar(false);
    setShowProfileModal(false);
  };

  const handleSelectDistrict = (districtId: DistrictId) => {
    setPlayer((prev) => ({
      ...prev,
      currentDistrict: districtId,
    }));
    setViewMode('cyberverse');
  };

  const currentDistrictInfo = CYBER_DISTRICTS.find((d) => d.id === player.currentDistrict) || CYBER_DISTRICTS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060914] text-white">
      {/* 1. Cinematic Intro Cutscene */}
      {!hasCompletedIntro && (
        <IntroCutscene
          onComplete={() => {
            localStorage.setItem('rosxy_intro_seen', 'true');
            setHasCompletedIntro(true);
            setIsSettingUpChar(true);
          }}
        />
      )}

      {/* 2. Character Setup Modal (First Time or from Profile menu) */}
      {(isSettingUpChar || showProfileModal) && (
        <CharacterCreator
          initialPlayer={player}
          isInitialSetup={isSettingUpChar}
          onSave={handleSaveCharacter}
          onClose={() => {
            setIsSettingUpChar(false);
            setShowProfileModal(false);
          }}
        />
      )}

      {/* 3. HOME SCREEN (Simple, beginner-friendly default landing) */}
      {viewMode === 'home' ? (
        <HomeScreen
          player={player}
          onPlayNow={handlePlayNow}
          onChooseLanguage={() => setShowLanguageSelector(true)}
          onExploreCyberverse={() => setViewMode('cyberverse')}
          onCyberSecurity={() => {
            sounds.playTerminalClick();
            setShowPhishingDrill(true);
          }}
          onMyProgress={() => setShowSkillsModal(true)}
          onSelectLanguage={(langId) => handleOpenLanguageDashboard(langId)}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      ) : (
        /* 4. 3D CYBERVERSE EXPLORATION ENGINE */
        <>
          <Cyberverse3D
            player={player}
            currentDistrict={player.currentDistrict}
            onInteract={handle3DInteraction}
            onOpenMap={() => setShowMapModal(true)}
          />

          <HudAndDock
            player={player}
            currentDistrictName={currentDistrictInfo.name}
            onGoHome={() => setViewMode('home')}
            onChooseLanguage={() => setShowLanguageSelector(true)}
            onOpenMissions={() => setShowMissionsModal(true)}
            onOpenPlayground={handlePlayNow}
            onOpenMap={() => setShowMapModal(true)}
            onOpenSkills={() => setShowSkillsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        </>
      )}

      {/* 5. Floating Sarcastic Companion BYTE Widget */}
      <ByteCompanion />

      {/* 6. Quick Language Selector Modal (Search & Categories) */}
      {showLanguageSelector && (
        <LanguageSelectorModal
          player={player}
          onSelectLanguage={(langId) => {
            setShowLanguageSelector(false);
            handleOpenLanguageDashboard(langId);
          }}
          onTogglePin={handleTogglePin}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}

      {/* 7. Language Learning Dashboard Modal (1-Tap START LEARNING) */}
      {selectedLanguageForDashboard && (
        <LanguageDashboardModal
          language={selectedLanguageForDashboard}
          player={player}
          onStartMission={(mission) => {
            setSelectedLanguageForDashboard(null);
            if (mission.type === 'terminal') {
              setShowTerminalSim(true);
            } else if (mission.type === 'phishing') {
              setShowPhishingDrill(true);
            } else if (mission.type === 'network-routing') {
              setShowNetworkRouter(true);
            } else {
              setActiveMission(mission);
            }
          }}
          onExploreDistrict={(districtId) => {
            setSelectedLanguageForDashboard(null);
            handleSelectDistrict(districtId as DistrictId);
          }}
          onClose={() => setSelectedLanguageForDashboard(null)}
        />
      )}

      {/* 8. Active In-Game Code Playground Modal (with Persistent Language Dropdown) */}
      {activeMission && (
        <CodePlaygroundModal
          mission={activeMission}
          player={player}
          onClose={() => setActiveMission(null)}
          onComplete={handleMissionComplete}
          onSwitchLanguage={handleSwitchLanguageInEditor}
        />
      )}

      {/* 9. Boss Battle Arena Modal */}
      {activeBossDistrict && (
        <BossBattleArena
          district={currentDistrictInfo}
          player={player}
          onClose={() => setActiveBossDistrict(null)}
          onVictory={handleBossVictory}
        />
      )}

      {/* 10. Linux Terminal Simulator */}
      {showTerminalSim && (
        <TerminalSimulator
          onClose={() => setShowTerminalSim(false)}
          onMissionPass={(xp, credits) => handleMissionComplete('linux-ls-grep', xp, credits)}
        />
      )}

      {/* 11. Phishing Email Forensic Drill */}
      {showPhishingDrill && (
        <PhishingEmailInspector
          onClose={() => setShowPhishingDrill(false)}
          onPass={(xp, credits) => handleMissionComplete('cyber-phishing-drill', xp, credits)}
        />
      )}

      {/* 12. Network Router & Firewall Minigame */}
      {showNetworkRouter && (
        <NetworkPacketRouter
          onClose={() => setShowNetworkRouter(false)}
          onPass={(xp, credits) => handleMissionComplete('network-routing-flow', xp, credits)}
        />
      )}

      {/* 13. Cyberverse District Map */}
      {showMapModal && (
        <WorldMapModal
          player={player}
          currentDistrict={player.currentDistrict}
          onSelectDistrict={handleSelectDistrict}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* 14. Skill Tree & Progression */}
      {showSkillsModal && (
        <SkillTreeModal
          player={player}
          onUnlockSkill={handleUnlockSkill}
          onClose={() => setShowSkillsModal(false)}
        />
      )}

      {/* 15. Mission Board Modal */}
      {showMissionsModal && (
        <MissionsListModal
          player={player}
          currentDistrict={player.currentDistrict}
          onSelectMission={(m) => {
            if (m.isBossMission) {
              setActiveBossDistrict(m.districtId);
            } else if (m.type === 'terminal') {
              setShowTerminalSim(true);
            } else if (m.type === 'phishing') {
              setShowPhishingDrill(true);
            } else if (m.type === 'network-routing') {
              setShowNetworkRouter(true);
            } else {
              setActiveMission(m);
            }
          }}
          onClose={() => setShowMissionsModal(false)}
        />
      )}
    </div>
  );
}
