// Test script to manually add alerts to Firebase
// Run this in browser console after updating Firebase rules

// Add a test alert
const testAlert = {
  type: 'warning',
  message: 'Test d\'alerte - Température élevée détectée',
  building: 'Bâtiment Test',
  timestamp: new Date().toISOString()
};

// Add to Firebase (run this in browser console)
console.log('Adding test alert:', testAlert);

// You can also test the sensorService directly:
// sensorService.addAlert(testAlert);
