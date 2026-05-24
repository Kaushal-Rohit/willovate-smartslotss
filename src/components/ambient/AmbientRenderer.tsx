import React from 'react';
import { BusinessType, AmbientAsset } from '../../types';
import { businessTypeAssets } from '../../services/dataStore';
import { ActivityCenterAmbient } from './ActivityCenterAmbient';
import { ClinicAmbient } from './ClinicAmbient';
import { CoachingAmbient } from './CoachingAmbient';
import { CosmeticsAmbient } from './CosmeticsAmbient';
import { GamingZoneAmbient } from './GamingZoneAmbient';
import { GymAmbient } from './GymAmbient';
import { MassageAmbient } from './MassageAmbient';
import { OtherAmbient } from './OtherAmbient';
import { RestaurantAmbient } from './RestaurantAmbient';
import { SalonAmbient } from './SalonAmbient';
import { TurfAmbient } from './TurfAmbient';

interface AmbientRendererProps {
  businessType: BusinessType;
  active?: boolean;
  uploadedAsset?: AmbientAsset;
  selectedAssetUrl?: string;
}

export const getAmbientUrl = (businessType: BusinessType, uploadedAsset?: AmbientAsset, selectedAssetUrl?: string) =>
  uploadedAsset?.url || selectedAssetUrl || businessTypeAssets[businessType] || businessTypeAssets.Other;

export const AmbientRenderer: React.FC<AmbientRendererProps> = ({
  businessType,
  active = false,
  uploadedAsset,
  selectedAssetUrl,
}) => {
  const src = getAmbientUrl(businessType, uploadedAsset, selectedAssetUrl);

  switch (businessType) {
    case 'Restaurant':
      return <RestaurantAmbient active={active} mediaSrc={src} />;
    case 'Salon':
      return <SalonAmbient active={active} mediaSrc={src} />;
    case 'Clinic':
      return <ClinicAmbient active={active} mediaSrc={src} />;
    case 'Coaching':
      return <CoachingAmbient active={active} mediaSrc={src} />;
    case 'Turf':
      return <TurfAmbient active={active} mediaSrc={src} />;
    case 'Cosmetics':
      return <CosmeticsAmbient active={active} mediaSrc={src} />;
    case 'Massage/Spa':
      return <MassageAmbient active={active} mediaSrc={src} />;
    case 'Gaming Zone':
      return <GamingZoneAmbient active={active} mediaSrc={src} />;
    case 'Activity Center':
      return <ActivityCenterAmbient active={active} mediaSrc={src} />;
    case 'Other':
      return <OtherAmbient active={active} mediaSrc={src} />;
    case 'Gym':
      return <GymAmbient active={active} mediaSrc={src} />;
    default:
      return <OtherAmbient active={active} mediaSrc={src} />;
  }
};
