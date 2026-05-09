// Add this at the top of your UnifiedFarm.jsx inside the component
// Just for debugging - Add this after the useState declarations

console.log('=== UNIFIED FARM DEBUG ===');
const token = localStorage.getItem('poultryToken');
const savedUser = localStorage.getItem('poultryUser');
console.log('Token exists:', !!token);
console.log('Saved user:', savedUser);
if (savedUser) {
  const userData = JSON.parse(savedUser);
  console.log('User role:', userData.role);
  console.log('User name:', userData.name);
}
