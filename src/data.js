export const cats = [
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Domestic Shorthair',
    birthday: '2020-04-15',
    personality: ['Sleepy', 'Clingy', 'Sweet'],
    favoriteFood: 'Tuna flakes',
    funFact: 'Will only drink running water from the tap.',
    mood: 85,
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'milo',
    name: 'Milo',
    breed: 'Orange Tabby',
    birthday: '2021-08-10',
    personality: ['Chaotic', 'Hungry', 'Mischievous'],
    favoriteFood: 'Literally anything',
    funFact: 'Believes he is a parrot and sits on shoulders.',
    mood: 95,
    avatar: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop'
  }
];

export const memories = [
  {
    id: 1,
    catId: 'luna',
    photo: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=1000&auto=format&fit=crop',
    caption: "First day home! 🏠",
    story: "She hid under the sofa for 4 hours before finally coming out for some chicken.",
    date: '2020-06-20',
    location: 'Living Room',
    mood: 'Sleepy',
    tags: ['Adoption', 'Cute']
  },
  {
    id: 2,
    catId: 'milo',
    photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop',
    caption: "Caught orange-handed 🎃",
    story: "He somehow managed to climb the curtains and got stuck at the top.",
    date: '2022-01-15',
    location: 'Bedroom',
    mood: 'Chaotic',
    tags: ['Naughty', 'Funny']
  },
  {
    id: 3,
    catId: 'luna',
    photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop',
    caption: "Sunbeams are the best beds ☀️",
    story: "Following the sunlight across the floor all afternoon.",
    date: '2022-04-05',
    location: 'Sunroom',
    mood: 'Majestic',
    tags: ['Sleep', 'Sun']
  },
  {
    id: 4,
    catId: 'milo',
    photo: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1000&auto=format&fit=crop',
    caption: "Waiting for dinner 🍽️",
    story: "Exactly 2 hours before dinnertime, the staring contest begins.",
    date: '2023-11-20',
    location: 'Kitchen',
    mood: 'Hungry',
    tags: ['Food', 'Stare']
  },
  {
    id: 5,
    catId: 'luna',
    photo: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1000&auto=format&fit=crop',
    caption: "The Box Inspector 📦",
    story: "No delivery is safe from Luna's rigorous inspection process.",
    date: '2024-02-14',
    location: 'Hallway',
    mood: 'Mischievous',
    tags: ['Box', 'Play']
  }
];

export const timelineEvents = [
  {
    id: 't1',
    date: 'April 2020',
    title: 'Luna is Born',
    description: 'A tiny, squeaky void enters the world.',
    icon: 'Baby'
  },
  {
    id: 't2',
    date: 'June 2020',
    title: 'Gotcha Day! (Luna)',
    description: 'Brought Luna home from the shelter.',
    icon: 'Home'
  },
  {
    id: 't3',
    date: 'August 2021',
    title: 'Milo Joins the Family',
    description: 'Orange chaos is added to the household.',
    icon: 'Cat'
  },
  {
    id: 't4',
    date: 'December 2022',
    title: 'First Christmas Together',
    description: 'The tree survived (mostly).',
    icon: 'TreePine'
  }
];

export const stats = {
  naps: 14592,
  treats: 3450,
  boxes: 124,
  curtains: 8,
  hairballs: 42
};
