/**
 * Default category seed template (Master Category List).
 * Used to bootstrap data/category_seed.json and for reset-data.
 */

export const defaultCategorySeed = [
  {
    group: 'תקשורת',
    groupEn: 'Communication',
    color: 'blue',
    isFixed: true,
    items: [
      { name: 'יוטיוב', nameEn: 'YouTube', icon: 'Youtube' },
      { name: 'טלפון נייד', nameEn: 'Mobile Phone', icon: 'Smartphone' },
      { name: 'תשתית אינטרנט', nameEn: 'Internet Infrastructure', icon: 'Router' },
      { name: 'ספק אינטרנט', nameEn: 'ISP', icon: 'Globe' },
      { name: 'כבלים', nameEn: 'Cable TV', icon: 'Tv' },
      { name: 'נטפליקס/ספוטיפיי', nameEn: 'Netflix/Spotify', icon: 'Music' },
    ],
  },
  {
    group: 'דיור ומיסים',
    groupEn: 'Housing & Taxes',
    color: 'orange',
    isFixed: true,
    items: [
      { name: 'חשמל', nameEn: 'Electricity', icon: 'Zap' },
      { name: 'ארנונה', nameEn: 'Municipal Tax', icon: 'Building' },
      { name: 'גז', nameEn: 'Gas', icon: 'Flame' },
      { name: 'מים וביוב', nameEn: 'Water & Sewage', icon: 'Droplets' },
      { name: 'שכר דירה', nameEn: 'Rent', icon: 'Home' },
      { name: 'משכנתא', nameEn: 'Mortgage', icon: 'Key' },
      { name: 'ועד בית/מיסי ישוב', nameEn: 'HOA', icon: 'Users' },
      { name: 'עוזרת/תחזוקת גינה', nameEn: 'Maintenance', icon: 'Shovel' },
    ],
  },
  {
    group: 'חינוך וילדים',
    groupEn: 'Education & Children',
    color: 'green',
    isFixed: true,
    items: [
      { name: 'מעון/מטפלת', nameEn: 'Daycare/Nanny', icon: 'Baby' },
      { name: 'גן', nameEn: 'Kindergarten', icon: 'ToyBrick' },
      { name: 'צהרון/חינוך חברתי', nameEn: 'Afterschool', icon: 'Clock' },
      { name: 'בתי ספר', nameEn: 'School Fees', icon: 'Backpack' },
      { name: 'חוגים', nameEn: 'Extracurriculars', icon: 'Palette' },
      { name: 'תשלומים נלווים', nameEn: 'Extras', icon: 'PlusCircle' },
      { name: 'הוראה מתקנת/קורסים', nameEn: 'Tutoring', icon: 'BookOpen' },
      { name: 'אוניברסיטה', nameEn: 'University', icon: 'GraduationCap' },
    ],
  },
  {
    group: 'ביטוחים',
    groupEn: 'Insurance',
    color: 'red',
    isFixed: true,
    items: [
      { name: 'ביטוח ישיר', nameEn: 'Direct Insurance', icon: 'Shield' },
      { name: 'ביטוח תאונות אישיות', nameEn: 'Accident Ins', icon: 'Bandage' },
      { name: 'ביטוחי בריאות', nameEn: 'Health Insurance', icon: 'HeartPulse' },
      { name: 'ביטוחי חיים', nameEn: 'Life Insurance', icon: 'Activity' },
      { name: 'ביטוח חיים משכנתא', nameEn: 'Mortgage Ins', icon: 'Home' },
      { name: 'ביטוח מבנה/תכולה', nameEn: 'Property Ins', icon: 'Umbrella' },
    ],
  },
  {
    group: 'תחבורה',
    groupEn: 'Transport',
    color: 'indigo',
    isFixed: true,
    items: [
      { name: 'ביטוח רכב', nameEn: 'Car Insurance', icon: 'ShieldCheck' },
      { name: 'רישוי רכב וטיפולים', nameEn: 'Car Service', icon: 'Wrench' },
      { name: 'תחבורה ציבורית/ליסינג', nameEn: 'Public Transport', icon: 'Bus' },
    ],
  },
  {
    group: 'התחייבויות ועמלות',
    groupEn: 'Loans & Fees',
    color: 'gray',
    isFixed: true,
    items: [
      { name: 'החזרי הלוואות מהתלוש', nameEn: 'Salary Loan', icon: 'Banknote' },
      { name: 'החזרי הלוואות (גופים)', nameEn: 'General Loan', icon: 'Landmark' },
      { name: 'תשלומי אשראי', nameEn: 'Credit Payments', icon: 'CreditCard' },
      { name: 'ריבית חובה בעו"ש', nameEn: 'Overdraft Interest', icon: 'Percent' },
    ],
  },
];
