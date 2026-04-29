// Update the recordForm state with better placeholders
// In UnifiedFarm.jsx, replace the recordForm useState with:

const [recordForm, setRecordForm] = useState({
  farmId: '',
  date: new Date().toISOString().split('T')[0],
  totalBirds: '',
  healthyBirds: '',
  sickBirds: '',
  deadBirds: '',
  eggsCollected: '',
  eggsSold: '',
  eggPrice: 5,
  feedConsumed: '',
  feedCost: '',
  medicineCost: '',
  otherExpenses: '',
  temperature: '',
  humidity: '',
  notes: ''
});
