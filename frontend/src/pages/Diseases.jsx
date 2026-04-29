import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Diseases.css';

const Diseases = () => {
  const [language, setLanguage] = useState('en');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Complete Diseases Database
  const diseases = [
    {
      id: 1,
      name: "Newcastle Disease",
      nameAm: "ኒውካስል በሽታ",
      type: "viral",
      severity: "high",
      transmission: "Air, direct contact, contaminated equipment",
      transmissionAm: "አየር፣ ቀጥተኛ ግንኙነት፣ የተበከሉ መሳሪያዎች",
      incubation: "4-6 days",
      symptoms: [
        "Greenish, watery diarrhea",
        "Swollen eyes, discharge",
        "Nervous signs (twisted neck, paralysis)",
        "Coughing, sneezing, respiratory distress",
        "Sudden death without symptoms",
        "Drop in egg production"
      ],
      symptomsAm: [
        "አረንጓዴ ውሃማ ተቅማጥ",
        "እብጠት ያለባቸው አይኖች ፈሳሽ",
        "የነርቭ ምልክቶች (አንገት መጠምዘዝ ሽባ)",
        "ማሳል ማስነጠስ የመተንፈስ ችግር",
        "ያለ ምልክት ድንገተኛ ሞት",
        "የእንቁላል ምርት መቀነስ"
      ],
      treatment: [
        "No specific cure - supportive care only",
        "Isolate sick birds immediately",
        "Disinfect the poultry house thoroughly",
        "Provide vitamins and electrolytes in water",
        "Antibiotics for secondary infections"
      ],
      treatmentAm: [
        "የተለየ ፈውስ የለም - የድጋፍ እንክብካቤ ብቻ",
        "የታመሙ ዶሮዎችን ወዲያውኑ ማግለል",
        "የዶሮ ቤቱን በሚገባ ማጽዳት",
        "በውሃ ውስጥ ቫይታሚኖች እና ኤሌክትሮላይቶች መስጠት",
        "ለሁለተኛ ኢንፌክሽን አንቲባዮቲክስ"
      ],
      prevention: [
        "Vaccinate at day 7 and 21 (Lasota strain)",
        "Strict biosecurity measures",
        "Quarantine new birds for 30 days",
        "Regular disinfection of equipment",
        "Control wild birds access"
      ],
      preventionAm: [
        "በቀን 7 እና 21 ክትባት መስጠት",
        "ጥብቅ የባዮሴኩሪቲ እርምጃዎች",
        "አዳዲስ ዶሮዎችን ለ30 ቀናት ማግለል",
        "የመሳሪያዎች አዘውትሮ ማጽዳት",
        "የዱር አእዋፍ መግባት መከላከል"
      ],
      image: "https://stmaaprodfwsite.blob.core.windows.net/assets/sites/1/2020/06/002_769_IMG_chickenwithnewcastledisease.jpg"
    },
    {
      id: 2,
      name: "Coccidiosis",
      nameAm: "ኮክሲዲዮሲስ",
      type: "parasitic",
      severity: "medium",
      transmission: "Ingestion of contaminated litter, feed, or water",
      transmissionAm: "የተበከለ ቆሻሻ መኖ ወይም ውሃ መዋጥ",
      incubation: "4-7 days",
      symptoms: [
        "Bloody or red droppings",
        "Lethargy, weakness, depression",
        "Reduced feed and water intake",
        "Weight loss, poor growth",
        "Pale comb and wattles",
        "Ruffled feathers"
      ],
      symptomsAm: [
        "ደም ያለበት ወይም ቀይ ሰገራ",
        "ድካም ድክመት የመንፈስ ጭንቀት",
        "የመኖ እና የውሃ ፍጆታ መቀነስ",
        "ክብደት መቀነስ ደካማ እድገት",
        "ሐመር ኮምብ እና ዋትል",
        "የተበታተኑ ላባዎች"
      ],
      treatment: [
        "Anti-coccidial medications (Amprolium, Toltrazuril)",
        "Add electrolytes and vitamins to water",
        "Keep litter dry at all times",
        "Reduce stocking density",
        "Clean and disinfect feeders/waterers daily"
      ],
      treatmentAm: [
        "ፀረ-ኮክሲዲያል መድሀኒቶች",
        "በውሃ ውስጥ ኤሌክትሮላይቶች እና ቫይታሚኖች መጨመር",
        "ቆሻሻን ሁልጊዜ ደረቅ ማድረግ",
        "የዶሮ ብዛት መጠን መቀነስ",
        "የመኖ እና የውሃ ማጠጫዎችን በየቀኑ ማጽዳት"
      ],
      prevention: [
        "Use coccidiostats in feed",
        "Keep litter dry (moisture less than 30 percent)",
        "Good ventilation",
        "Avoid overcrowding",
        "Rotate pens between flocks"
      ],
      preventionAm: [
        "በመኖ ውስጥ ኮክሲዲዮስታትስ መጠቀም",
        "ቆሻሻን ደረቅ ማድረግ",
        "ጥሩ አየር ማናፈሻ",
        "መጨናነቅን መከላከል",
        "በመንጋዎች መካከል ማጠሪያ መለዋወጥ"
      ],
      image: "https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34253538/files/what-is-coccidiosis.jpg"
    },
    {
      id: 3,
      name: "Avian Influenza (Bird Flu)",
      nameAm: "የአእዋፍ ኢንፍሉዌንዛ",
      type: "viral",
      severity: "critical",
      transmission: "Wild birds, contaminated equipment, humans",
      transmissionAm: "የዱር አእዋፍ የተበከሉ መሳሪያዎች ሰዎች",
      incubation: "1-7 days",
      symptoms: [
        "Sudden death without signs",
        "Swollen head, comb, and wattles",
        "Purple discoloration of legs/comb",
        "Respiratory distress (coughing, sneezing)",
        "Massive drop in egg production",
        "Neurological signs (twisted neck)"
      ],
      symptomsAm: [
        "ያለ ምልክት ድንገተኛ ሞት",
        "እብጠት ያለበት ጭንቅላት ኮምብ እና ዋትል",
        "የእግር/ኮምብ ሐምራዊ ቀለም መለወጥ",
        "የመተንፈስ ችግር",
        "ከፍተኛ የእንቁላል ምርት መቀነስ",
        "የነርቭ ምልክቶች"
      ],
      treatment: [
        "REPORT TO AUTHORITIES IMMEDIATELY",
        "No treatment - culling required",
        "Strict quarantine of farm",
        "Movement restrictions",
        "Complete disinfection after depopulation"
      ],
      treatmentAm: [
        "ወዲያውኑ ለባለስልጣናት ማሳወቅ",
        "ህክምና የለም - ማጥፋት ያስፈልጋል",
        "የእርሻ ጥብቅ ማግለል",
        "የእንቅስቃሴ እገዳ",
        "ሙሉ ማጽዳት"
      ],
      prevention: [
        "Prevent contact with wild birds",
        "Strict biosecurity protocols",
        "Vaccination in high-risk areas",
        "Regular health monitoring",
        "Report sick birds immediately"
      ],
      preventionAm: [
        "ከዱር አእዋፍ ጋር ያለውን ግንኙነት መከላከል",
        "ጥብቅ የባዮሴኩሪቲ ፕሮቶኮሎች",
        "ከፍተኛ ተጋላጭነት ባለባቸው አካባቢዎች ክትባት",
        "አዘውትሮ የጤና ክትትል",
        "የታመሙ ዶሮዎችን ወዲያውኑ ማሳወቅ"
      ],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6TX_nEsEmZYeduWiokS3ukUe_7ZVSUJVN3CMN6F36cg&s"
    },
    {
      id: 4,
      name: "Fowl Typhoid",
      nameAm: "የዶሮ ታይፎይድ",
      type: "bacterial",
      severity: "medium",
      transmission: "Contaminated feed, water, environment",
      transmissionAm: "የተበከለ መኖ ውሃ አካባቢ",
      incubation: "4-10 days",
      symptoms: [
        "Pale comb and wattles",
        "Greenish-yellow diarrhea",
        "Anemia (pale mucous membranes)",
        "Sudden death in acute cases",
        "Reduced egg production",
        "Weakness and depression"
      ],
      symptomsAm: [
        "ሐመር ኮምብ እና ዋትል",
        "አረንጓዴ-ቢጫ ተቅማጥ",
        "የደም ማነስ",
        "አጣዳፊ ሁኔታዎች ውስጥ ድንገተኛ ሞት",
        "የእንቁላል ምርት መቀነስ",
        "ድክመት እና የመንፈስ ጭንቀት"
      ],
      treatment: [
        "Antibiotics (Amoxicillin, Tetracycline)",
        "Isolate sick birds",
        "Improve sanitation",
        "Add vitamins to feed",
        "Electrolytes in water"
      ],
      treatmentAm: [
        "አንቲባዮቲክስ",
        "የታመሙ ዶሮዎችን ማግለል",
        "የንፅህና አጠባበቅ መሻሻል",
        "በመኖ ውስጥ ቫይታሚኖች መጨመር",
        "በውሃ ውስጥ ኤሌክትሮላይቶች"
      ],
      prevention: [
        "Biosecurity measures",
        "Clean water source",
        "Rodent control",
        "Regular disinfection",
        "Test new birds before introduction"
      ],
      preventionAm: [
        "የባዮሴኩሪቲ እርምጃዎች",
        "ንጹህ የውሃ ምንጭ",
        "አይጥ ቁጥጥር",
        "አዘውትሮ ማጽዳት",
        "ከማስገባት በፊት አዳዲስ ዶሮዎችን መመርመር"
      ],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyZGXZ4EJIWaNoV8F1IrsGxoKwYua2lkIKSg&s"
    },
    {
      id: 5,
      name: "Marek's Disease",
      nameAm: "ማሬክ በሽታ",
      type: "viral",
      severity: "high",
      transmission: "Airborne, shed from feather follicles",
      transmissionAm: "በአየር ወለድ ከላባ ቀዳዳዎች ይወጣል",
      incubation: "3-4 weeks",
      symptoms: [
        "Paralysis of legs and wings",
        "Tumor growth in internal organs",
        "Weight loss despite eating",
        "Grey iris or irregular pupil",
        "Sudden death",
        "Skin lesions around feather follicles"
      ],
      symptomsAm: [
        "የእግር እና የክንፍ ሽባ",
        "በውስጥ አካላት ላይ ዕጢ መበራከት",
        "ምግብ ቢበሉም ክብደት መቀነስ",
        "ግራጫ አይሪስ ወይም ያልተለመደ ፐፒል",
        "ድንገተኛ ሞት",
        "በላባ ቀዳዳዎች ዙሪያ የቆዳ ቁስሎች"
      ],
      treatment: [
        "No treatment available",
        "Cull affected birds",
        "Supportive care",
        "Prevention is key - vaccination"
      ],
      treatmentAm: [
        "ምንም ህክምና የለም",
        "የታመሙ ዶሮዎችን ማጥፋት",
        "የድጋፍ እንክብካቤ",
        "መከላከል ቁልፍ ነው - ክትባት"
      ],
      prevention: [
        "Vaccinate at day 1 (hatchery)",
        "Good biosecurity",
        "Keep young chicks separate",
        "Resistant breeds available",
        "Clean and disinfect between flocks"
      ],
      preventionAm: [
        "በቀን 1 ክትባት መስጠት",
        "ጥሩ ባዮሴኩሪቲ",
        "ወጣት ጫጩቶችን ለየብቻ ማስቀመጥ",
        "ተከላካይ ዝርያዎች ይገኛሉ",
        "በመንጋዎች መካከል ማጽዳት እና ማጥፋት"
      ],
      image: "data:image/jpeg;base64,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"
    }
  ];

  // Filter diseases
  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = (language === 'en' ? disease.name : disease.nameAm).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || disease.type === filterType;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'viral': return { text: '🦠 Viral', color: '#8b5cf6' };
      case 'bacterial': return { text: '🧫 Bacterial', color: '#3b82f6' };
      case 'parasitic': return { text: '🐛 Parasitic', color: '#f59e0b' };
      default: return { text: '⚠️ Unknown', color: '#6b7280' };
    }
  };

  const translations = {
    en: {
      title: "Poultry Diseases Guide",
      subtitle: "Complete guide to diagnosis, treatment, and prevention",
      search: "🔍 Search diseases by name...",
      filter: "Filter by disease type",
      all: "📋 All Diseases",
      viral: "🦠 Viral",
      bacterial: "🧫 Bacterial",
      parasitic: "🐛 Parasitic",
      severity: "Severity",
      transmission: "Transmission",
      incubation: "Incubation Period",
      symptoms: "Symptoms",
      treatment: "Treatment",
      prevention: "Prevention",
      backToGuide: "← Back to Diseases Guide",
      viewDetails: "View Details",
      emergencyNote: "⚠️ For emergency situations, contact a veterinarian immediately!"
    },
    am: {
      title: "የዶሮ በሽታዎች መመሪያ",
      subtitle: "የምርመራ፣ ህክምና እና መከላከያ ሙሉ መመሪያ",
      search: "🔍 በሽታዎችን በስም ይፈልጉ...",
      filter: "በበሽታ አይነት አጣራ",
      all: "📋 ሁሉም በሽታዎች",
      viral: "🦠 ቫይረስ",
      bacterial: "🧫 ባክቴሪያ",
      parasitic: "🐛 ጥገኛ",
      severity: "ክብደት",
      transmission: "ስርጭት",
      incubation: "የምልክት ጊዜ",
      symptoms: "ምልክቶች",
      treatment: "ህክምና",
      prevention: "መከላከያ",
      backToGuide: "← ወደ በሽታዎች መመሪያ ተመለስ",
      viewDetails: "ዝርዝር ይመልከቱ",
      emergencyNote: "⚠️ ለአስቸኳይ ሁኔታዎች ወዲያውኑ የእንስሳት ሐኪም ይደውሉ"
    }
  };

  const t = translations[language];

  return (
    <div className="diseases-page-enhanced">
      <div className="diseases-container-enhanced">
        {/* Header */}
        <div className="diseases-header-enhanced">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Search Bar - On Top */}
        <div className="search-bar-container">
          <div className="search-box-large">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons - Below Search */}
        <div className="filter-section">
          <div className="filter-label">
            <i className="fas fa-filter"></i> {t.filter}
          </div>
          <div className="filter-buttons">
            <button className={filterType === 'all' ? 'active' : ''} onClick={() => setFilterType('all')}>
              <i className="fas fa-list"></i> {t.all}
            </button>
            <button className={filterType === 'viral' ? 'active' : ''} onClick={() => setFilterType('viral')}>
              <i className="fas fa-virus"></i> {t.viral}
            </button>
            <button className={filterType === 'bacterial' ? 'active' : ''} onClick={() => setFilterType('bacterial')}>
              <i className="fas fa-biohazard"></i> {t.bacterial}
            </button>
            <button className={filterType === 'parasitic' ? 'active' : ''} onClick={() => setFilterType('parasitic')}>
              <i className="fas fa-bug"></i> {t.parasitic}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <i className="fas fa-chart-simple"></i>
          <span>{filteredDiseases.length} {filteredDiseases.length === 1 ? 'Disease' : 'Diseases'} found</span>
        </div>

        {/* Disease Cards Grid */}
        {!selectedDisease ? (
          <>
            {filteredDiseases.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No diseases found matching your search.</p>
              </div>
            ) : (
              <div className="diseases-grid-enhanced">
                {filteredDiseases.map(disease => {
                  const typeBadge = getTypeBadge(disease.type);
                  return (
                    <div key={disease.id} className="disease-card-enhanced" onClick={() => setSelectedDisease(disease)}>
                      <div className="disease-card-image">
                        <img src={disease.image} alt={disease.name} />
                        <div className="card-badges">
                          <span className="severity-badge" style={{ backgroundColor: getSeverityColor(disease.severity) }}>
                            <i className="fas fa-exclamation-triangle"></i> {t.severity}: {disease.severity.toUpperCase()}
                          </span>
                          <span className="type-badge" style={{ backgroundColor: typeBadge.color }}>
                            {typeBadge.text}
                          </span>
                        </div>
                      </div>
                      <div className="disease-card-content">
                        <h3>{language === 'en' ? disease.name : disease.nameAm}</h3>
                        <p className="transmission-preview">
                          <i className="fas fa-exchange-alt"></i> {language === 'en' ? disease.transmission.substring(0, 60) : disease.transmissionAm.substring(0, 60)}...
                        </p>
                        <button className="view-details-btn-enhanced">
                          {t.viewDetails} <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="disease-detail-enhanced">
            <button className="back-btn-enhanced" onClick={() => setSelectedDisease(null)}>
              <i className="fas fa-arrow-left"></i> {t.backToGuide}
            </button>
            
            <div className="detail-content-enhanced">
              <div className="detail-header">
                <h2>{language === 'en' ? selectedDisease.name : selectedDisease.nameAm}</h2>
                <div className="detail-badges">
                  <span className="severity-badge" style={{ backgroundColor: getSeverityColor(selectedDisease.severity) }}>
                    <i className="fas fa-exclamation-triangle"></i> {t.severity}: {selectedDisease.severity.toUpperCase()}
                  </span>
                  <span className="type-badge" style={{ backgroundColor: getTypeBadge(selectedDisease.type).color }}>
                    {getTypeBadge(selectedDisease.type).text}
                  </span>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h3><i className="fas fa-exchange-alt"></i> {t.transmission}</h3>
                  <p>{language === 'en' ? selectedDisease.transmission : selectedDisease.transmissionAm}</p>
                </div>
                <div className="detail-section">
                  <h3><i className="fas fa-hourglass-half"></i> {t.incubation}</h3>
                  <p>{selectedDisease.incubation}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3><i className="fas fa-stethoscope"></i> {t.symptoms}</h3>
                <div className="symptoms-grid">
                  {(language === 'en' ? selectedDisease.symptoms : selectedDisease.symptomsAm).map((symptom, i) => (
                    <div key={i} className="symptom-item">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3><i className="fas fa-pills"></i> {t.treatment}</h3>
                <ul className="detail-list">
                  {(language === 'en' ? selectedDisease.treatment : selectedDisease.treatmentAm).map((item, i) => (
                    <li key={i}><i className="fas fa-check-circle"></i> {item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3><i className="fas fa-shield-alt"></i> {t.prevention}</h3>
                <ul className="detail-list">
                  {(language === 'en' ? selectedDisease.prevention : selectedDisease.preventionAm).map((item, i) => (
                    <li key={i}><i className="fas fa-check-circle"></i> {item}</li>
                  ))}
                </ul>
              </div>

              <div className="emergency-note">
                <i className="fas fa-ambulance"></i>
                <p>{t.emergencyNote}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diseases;
