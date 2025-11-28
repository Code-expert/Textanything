const vehicleStates = new Map();

export function getVehicleState(vehicleId) {
  return vehicleStates.get(vehicleId) || null;
}

export function updateVehicleState(vehicleId, state) {
  const updated = {
    vehicleId,
    ...state
  };

  vehicleStates.set(vehicleId, updated);
  return updated;
}
