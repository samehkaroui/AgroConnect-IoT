import { database } from '../lib/firebase';
import { ref, onValue, set, push, off } from 'firebase/database';

export interface SensorData {
  temperature: number;
  humidity: number;
  airQuality: number;
  lightLevel: number;
  birdCount: number;
  activityLevel: number;
  timestamp: string;
}

export interface GasData {
  co: number;        // Carbon Monoxide (ppm)
  co2: number;       // Carbon Dioxide (ppm)
  nh3: number;       // Ammonia (ppm)
  h2s: number;       // Hydrogen Sulfide (ppm)
  timestamp: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'ventilation' | 'heating' | 'lighting' | 'watering';
  status: 'active' | 'inactive' | 'auto';
  power: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  building: string;
}

class SensorService {
  private sensorDataRef = ref(database, 'sensorData');
  private gasDataRef = ref(database, 'gasData');
  private equipmentRef = ref(database, 'equipment');
  private alertsRef = ref(database, 'alerts');

  // Subscribe to real-time sensor data updates
  subscribeSensorData(callback: (data: SensorData) => void): () => void {
    const unsubscribe = onValue(this.sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });

    return () => off(this.sensorDataRef, 'value', unsubscribe);
  }

  // Subscribe to real-time equipment updates
  subscribeEquipment(callback: (equipment: Equipment[]) => void): () => void {
    const unsubscribe = onValue(this.equipmentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const equipmentArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        callback(equipmentArray);
      }
    });

    return () => off(this.equipmentRef, 'value', unsubscribe);
  }

  // Subscribe to real-time gas data updates
  subscribeGasData(callback: (data: GasData) => void): () => void {
    const unsubscribe = onValue(this.gasDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });

    return () => off(this.gasDataRef, 'value', unsubscribe);
  }

  // Subscribe to real-time alerts
  subscribeAlerts(callback: (alerts: Alert[]) => void): () => void {
    const unsubscribe = onValue(this.alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        callback(alertsArray.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    });

    return () => off(this.alertsRef, 'value', unsubscribe);
  }

  // Update sensor data
  async updateSensorData(data: Partial<SensorData>): Promise<void> {
    const updates = {
      ...data,
      timestamp: new Date().toISOString()
    };
    await set(this.sensorDataRef, updates);
  }

  // Update gas data
  async updateGasData(data: Partial<GasData>): Promise<void> {
    const updates = {
      ...data,
      timestamp: new Date().toISOString()
    };
    await set(this.gasDataRef, updates);
  }

  // Control equipment
  async controlEquipment(equipmentId: string, updates: Partial<Equipment>): Promise<void> {
    const equipmentItemRef = ref(database, `equipment/${equipmentId}`);
    await set(equipmentItemRef, updates);
  }

  // Toggle equipment status
  async toggleEquipment(equipmentId: string, currentStatus: string): Promise<void> {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const equipmentItemRef = ref(database, `equipment/${equipmentId}/status`);
    await set(equipmentItemRef, newStatus);
  }

  // Set equipment to auto mode
  async setAutoMode(equipmentId: string): Promise<void> {
    const equipmentItemRef = ref(database, `equipment/${equipmentId}/status`);
    await set(equipmentItemRef, 'auto');
  }

  // Set day/night mode
  async setDayMode(): Promise<void> {
    const updates = {
      'equipment/lighting/status': 'active',
      'equipment/lighting/power': 85,
      'equipment/ventilation/power': 75,
      'equipment/heating/power': 40
    };
    
    for (const [path, value] of Object.entries(updates)) {
      await set(ref(database, path), value);
    }
  }

  async setNightMode(): Promise<void> {
    const updates = {
      'equipment/lighting/status': 'inactive',
      'equipment/lighting/power': 0,
      'equipment/ventilation/power': 50,
      'equipment/heating/power': 70
    };
    
    for (const [path, value] of Object.entries(updates)) {
      await set(ref(database, path), value);
    }
  }

  // Add new alert
  async addAlert(alert: Omit<Alert, 'id'>): Promise<void> {
    await push(this.alertsRef, {
      ...alert,
      timestamp: new Date().toISOString()
    });
  }

  // Remove alert
  async removeAlert(alertId: string): Promise<void> {
    const alertRef = ref(database, `alerts/${alertId}`);
    await set(alertRef, null);
  }

  // Initialize default data if not exists
  async initializeDefaultData(): Promise<void> {
    // Initialize sensor data
    const defaultSensorData: SensorData = {
      temperature: 24.5,
      humidity: 65,
      airQuality: 85,
      lightLevel: 45,
      birdCount: 2847,
      activityLevel: 72,
      timestamp: new Date().toISOString()
    };

    // Initialize gas data
    const defaultGasData: GasData = {
      co: 2.5,    // Normal CO level (ppm)
      co2: 450,   // Normal CO2 level (ppm)
      nh3: 8.0,   // Normal NH3 level (ppm)
      h2s: 0.5,   // Normal H2S level (ppm)
      timestamp: new Date().toISOString()
    };

    // Initialize equipment
    const defaultEquipment = {
      'ventilation-zone-a': {
        name: 'Ventilation Zone A',
        type: 'ventilation',
        status: 'auto',
        power: 75
      },
      'heating-main': {
        name: 'Chauffage Principal',
        type: 'heating',
        status: 'active',
        power: 60
      },
      'lighting-led': {
        name: 'Éclairage LED',
        type: 'lighting',
        status: 'active',
        power: 85
      },
      'watering-system': {
        name: 'Système d\'abreuvement',
        type: 'watering',
        status: 'auto',
        power: 100
      }
    };

    // Initialize alerts
    const defaultAlerts = {
      'alert-1': {
        type: 'warning',
        message: 'Humidité élevée détectée - Bâtiment A',
        timestamp: new Date().toISOString(),
        building: 'Bâtiment A'
      },
      'alert-2': {
        type: 'info',
        message: 'Ventilation automatique activée',
        timestamp: new Date().toISOString(),
        building: 'Bâtiment B'
      }
    };

    // Set default data
    await set(this.sensorDataRef, defaultSensorData);
    await set(this.gasDataRef, defaultGasData);
    await set(this.equipmentRef, defaultEquipment);
    await set(this.alertsRef, defaultAlerts);
  }

  // Simulate real-time sensor data updates
  startSensorSimulation(): () => void {
    const interval = setInterval(async () => {
      const currentTime = new Date().toISOString();
      const updates = {
        temperature: 24.5 + (Math.random() - 0.5) * 2,
        humidity: 65 + (Math.random() - 0.5) * 10,
        airQuality: 85 + (Math.random() - 0.5) * 15,
        lightLevel: 45 + (Math.random() - 0.5) * 30,
        activityLevel: 72 + (Math.random() - 0.5) * 20,
        timestamp: currentTime
      };

      // Update gas data with realistic variations
      const gasUpdates = {
        co: Math.max(0, 2.5 + (Math.random() - 0.5) * 1.5),     // 1-4 ppm range
        co2: Math.max(300, 450 + (Math.random() - 0.5) * 100),  // 350-550 ppm range
        nh3: Math.max(0, 8.0 + (Math.random() - 0.5) * 4),      // 4-12 ppm range
        h2s: Math.max(0, 0.5 + (Math.random() - 0.5) * 0.8),    // 0.1-0.9 ppm range
        timestamp: currentTime
      };

      await this.updateSensorData(updates);
      await this.updateGasData(gasUpdates);

      // Generate random alerts occasionally
      if (Math.random() < 0.1) { // 10% chance
        const alertTypes = ['warning', 'info', 'error'] as const;
        const buildings = ['Bâtiment A', 'Bâtiment B', 'Bâtiment C'];
        const messages = [
          'Température élevée détectée',
          'Ventilation automatique activée',
          'Niveau d\'activité inhabituel',
          'Système de refroidissement en marche',
          'Maintenance programmée terminée'
        ];

        await this.addAlert({
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          building: buildings[Math.floor(Math.random() * buildings.length)],
          timestamp: currentTime
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}

export const sensorService = new SensorService();
