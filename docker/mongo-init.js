db = db.getSiblingDB('onboarding');

db.createCollection('progress');
db.createCollection('tabs');

db.tabs.insertMany([
 {
    name: 'Tools',
    description: 'Gather your tools!',
    steps: [
      "IDE",
      "Postman",
      "GitHub"
    ]
  },
]);