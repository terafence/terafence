import React from "react";
import {
  IconArrowNarrowRight,
  IconLock,
  IconShieldLock,
  IconDeviceDesktop,
  IconDiamond,
  IconClock,
  IconBuildingFactory,
  IconShield,
  IconSettings,
  IconFileText,
  IconRefresh,
  IconArrowRight
} from '@tabler/icons-react';

export const getIconByName = (name: string) => {
  const icons: { [key: string]: React.ElementType } = {
    ArrowNarrowRight: IconArrowNarrowRight,
    Lock: IconLock,
    ShieldLock: IconShieldLock,
    DeviceDesktop: IconDeviceDesktop,
    Diamond: IconDiamond,
    Clock: IconClock,
    BuildingFactory: IconBuildingFactory,
    Shield: IconShield,
    Settings: IconSettings,
    FileText: IconFileText,
    Refresh: IconRefresh,
    ArrowRight: IconArrowRight,
  };
  
  return icons[name] || IconArrowNarrowRight;
};