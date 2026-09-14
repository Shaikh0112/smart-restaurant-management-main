// RESPONSIBILITY: Custom hook handling useFeatures logic
// DATA FLOW: UI Component -> useFeatures -> State/API
import { useState } from 'react';
import type { FeatureFlag, FeatureRolloutType } from "@/app/super-admin/super-admin_types/features_types";
import { MOCK_FEATURE_FLAGS } from "@/app/super-admin/super-admin_constants/features_constants";

/**
 * @description Custom hook for useFeatures
 * @returns {object} Hook state and methods
 */
export const useFeatures = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>(MOCK_FEATURE_FLAGS);

  const updateRollout = (id: string, newRollout: FeatureRolloutType) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          rolloutType: newRollout,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'Current User'
        };
      }
      return f;
    }));
  };

  return {
    features,
    updateRollout
  };
};
